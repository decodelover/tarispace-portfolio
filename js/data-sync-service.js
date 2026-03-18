/**
 * Backend Data Service Adapter
 *
 * Maintains the old DataSyncService interface while routing all operations
 * to the Node.js + PostgreSQL backend API.
 */

const inferredApiBase = (() => {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
        return 'http://127.0.0.1:4000/api';
    }

    return `${window.location.origin}/api`;
})();

const DataSyncService = {
    API_BASE_URL: window.__API_BASE_URL || inferredApiBase,
    _cache: null,
    _lastFetch: 0,
    CACHE_DURATION: 30000,

    async init() {
        return true;
    },

    broadcastDataUpdate(payload = null) {
        const timestamp = Date.now().toString();
        localStorage.setItem('portfolioDataUpdate', timestamp);
        window.dispatchEvent(new CustomEvent('portfolioDataUpdated', {
            detail: payload
        }));
    },

    getAuthToken() {
        try {
            const auth = JSON.parse(localStorage.getItem('authData') || '{}');
            return auth?.token || null;
        } catch (error) {
            return null;
        }
    },

    async request(path, options = {}, requiresAuth = false) {
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };

        if (requiresAuth) {
            const token = this.getAuthToken();
            if (!token) {
                throw new Error('You are not authenticated');
            }
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`${this.API_BASE_URL}${path}`, {
            ...options,
            headers
        });

        if (!response.ok) {
            let message = `Request failed (${response.status})`;
            try {
                const errorData = await response.json();
                message = errorData.message || message;
            } catch (_error) {
                // Ignore invalid JSON bodies.
            }
            throw new Error(message);
        }

        if (response.status === 204) {
            return null;
        }

        return response.json();
    },

    async replaceCollection(endpoint, items, mapItem) {
        const currentItems = await this.request(endpoint, {}, true);

        for (const item of currentItems) {
            await this.request(`${endpoint}/${item.id}`, { method: 'DELETE' }, true);
        }

        for (const item of items) {
            await this.request(endpoint, {
                method: 'POST',
                body: JSON.stringify(mapItem(item))
            }, true);
        }
    },

    async replaceMessages(messages) {
        const currentMessages = await this.request('/messages', {}, true);

        for (const message of currentMessages) {
            await this.request(`/messages/${message.id}`, { method: 'DELETE' }, true);
        }

        for (const message of messages) {
            await this.request('/public/messages', {
                method: 'POST',
                body: JSON.stringify({
                    name: message.from || message.name || 'Anonymous',
                    email: message.email || '',
                    subject: message.subject || '',
                    message: message.message || ''
                })
            });
        }
    },

    normalizeProfile(profile = {}) {
        return {
            fullName: profile.full_name || profile.fullName || '',
            title: profile.title || '',
            bio: profile.bio || '',
            email: profile.email || '',
            phone: profile.phone || '',
            location: profile.location || '',
            experience: Number(profile.experience || 0),
            specialty: profile.specialty || '',
            focus: profile.focus || '',
            profileImage: profile.profile_image || profile.profileImage || '',
            aboutImage: profile.about_image || profile.aboutImage || '',
            linkedinUrl: profile.linkedin_url || profile.linkedinUrl || '',
            githubUrl: profile.github_url || profile.githubUrl || '',
            twitterUrl: profile.twitter_url || profile.twitterUrl || '',
            facebookUrl: profile.facebook_url || profile.facebookUrl || '',
            whatsappNumber: profile.whatsapp_number || profile.whatsappNumber || ''
        };
    },

    denormalizeProfile(profile = {}) {
        return {
            full_name: profile.fullName || profile.full_name || '',
            title: profile.title || '',
            bio: profile.bio || '',
            email: profile.email || '',
            phone: profile.phone || '',
            location: profile.location || '',
            experience: Number(profile.experience || 0),
            specialty: profile.specialty || '',
            focus: profile.focus || '',
            profile_image: profile.profileImage || profile.profile_image || '',
            about_image: profile.aboutImage || profile.about_image || '',
            linkedin_url: profile.linkedinUrl || profile.linkedin_url || '',
            github_url: profile.githubUrl || profile.github_url || '',
            twitter_url: profile.twitterUrl || profile.twitter_url || '',
            facebook_url: profile.facebookUrl || profile.facebook_url || '',
            whatsapp_number: profile.whatsappNumber || profile.whatsapp_number || ''
        };
    },

    normalizeBlogPost(post = {}) {
        const readTime = post.read_time || post.readTime || '';
        return {
            ...post,
            readTime,
            read_time: readTime,
            tags: Array.isArray(post.tags) ? post.tags : [],
            featured: Boolean(post.featured)
        };
    },

    denormalizeBlogPost(post = {}) {
        const readTime = post.readTime || post.read_time || '';
        return {
            title: post.title || '',
            content: post.content || '',
            excerpt: post.excerpt || '',
            author: post.author || '',
            category: post.category || '',
            tags: Array.isArray(post.tags) ? post.tags : [],
            image: post.image || '',
            date: post.date || null,
            read_time: typeof readTime === 'number' ? `${readTime} min read` : readTime,
            link: post.link || '',
            featured: Boolean(post.featured)
        };
    },

    normalizeMessages(messages = []) {
        return messages.map((message) => ({
            ...message,
            from: message.name || message.from || '',
            read: Boolean(message.is_read || message.isRead || message.read),
            isRead: Boolean(message.is_read || message.isRead || message.read),
            time: message.created_at || message.time || new Date().toISOString()
        }));
    },

    normalizeSettings(settings = {}) {
        return {
            enableComments: Boolean(settings.enable_comments ?? settings.enableComments),
            showContactForm: Boolean(settings.show_contact_form ?? settings.showContactForm),
            enableNewsletter: Boolean(settings.enable_newsletter ?? settings.enableNewsletter),
            emailNotifications: Boolean(settings.email_notifications ?? settings.emailNotifications),
            visitCount: Number(settings.visit_count || settings.visitCount || 0)
        };
    },

    denormalizeSettings(settings = {}) {
        return {
            enable_comments: Boolean(settings.enableComments ?? settings.enable_comments),
            show_contact_form: Boolean(settings.showContactForm ?? settings.show_contact_form),
            enable_newsletter: Boolean(settings.enableNewsletter ?? settings.enable_newsletter),
            email_notifications: Boolean(settings.emailNotifications ?? settings.email_notifications),
            visit_count: Number(settings.visitCount ?? settings.visit_count ?? 0)
        };
    },

    async fetchData(forceRefresh = false) {
        if (!forceRefresh && this._cache && Date.now() - this._lastFetch < this.CACHE_DURATION) {
            return this._cache;
        }

        const [siteData, stats] = await Promise.all([
            this.request('/public/site-data'),
            this.request('/stats', {}, true).catch(() => this.request('/stats').catch(() => ({ visits: 0 })))
        ]);

        let messages = [];
        const token = this.getAuthToken();
        if (token) {
            messages = await this.request('/messages', {}, true).catch(() => []);
        }

        const normalized = {
            profile: this.normalizeProfile(siteData.profile || {}),
            services: Array.isArray(siteData.services) ? siteData.services : [],
            projects: Array.isArray(siteData.projects) ? siteData.projects : [],
            blog: (siteData.blog || []).map((post) => this.normalizeBlogPost(post)),
            messages: this.normalizeMessages(messages),
            skills: Array.isArray(siteData.skills) ? siteData.skills : [],
            settings: this.normalizeSettings(siteData.settings || {}),
            stats: {
                visits: Number(stats.visits || siteData.settings?.visit_count || 0),
                messages: Number(stats.messages || messages.length || 0),
                projects: Number(stats.projects || (siteData.projects || []).length || 0),
                blogs: Number(stats.blog || (siteData.blog || []).length || 0),
                happyClients: 19,
                completedProjects: 30
            },
            adminAuth: {
                email: localStorage.getItem('rememberEmail') || 'admin@example.com'
            },
            lastUpdated: new Date().toISOString()
        };

        this._cache = normalized;
        this._lastFetch = Date.now();
        return normalized;
    },

    async saveData(data) {
        if (data.profile) {
            await this.updateProfile(data.profile);
        }
        if (data.settings) {
            await this.updateSettings(data.settings);
        }

        if (Array.isArray(data.services)) {
            await this.replaceCollection('/services', data.services, (service) => ({
                title: service.title,
                description: service.description || '',
                icon: service.icon || '',
                features: Array.isArray(service.features) ? service.features : []
            }));
        }

        if (Array.isArray(data.projects)) {
            await this.replaceCollection('/projects', data.projects, (project) => ({
                title: project.title,
                description: project.description || '',
                image: project.image || '',
                category: project.category || '',
                tech: project.tech || '',
                link: project.link || '',
                featured: Boolean(project.featured)
            }));
        }

        if (Array.isArray(data.blog)) {
            await this.replaceCollection('/blog', data.blog, (post) => this.denormalizeBlogPost(post));
        }

        if (Array.isArray(data.skills)) {
            await this.replaceCollection('/skills', data.skills, (skill) => ({
                name: skill.name,
                level: Number(skill.level || 0),
                category: skill.category || ''
            }));
        }

        if (Array.isArray(data.messages)) {
            await this.replaceMessages(data.messages);
        }

        this._cache = null;
        const refreshed = await this.fetchData(true);
        this.broadcastDataUpdate(refreshed);
        return refreshed;
    },

    async getProfile() {
        const profile = await this.request('/profile', {}, true);
        return this.normalizeProfile(profile);
    },

    async updateProfile(profileData) {
        const payload = this.denormalizeProfile(profileData);
        const profile = await this.request('/profile', {
            method: 'PUT',
            body: JSON.stringify(payload)
        }, true);
        this._cache = null;
        const normalized = this.normalizeProfile(profile);
        this.broadcastDataUpdate();
        return normalized;
    },

    async getServices() {
        return this.request('/services', {}, true);
    },

    async addService(service) {
        this._cache = null;
        const result = await this.request('/services', {
            method: 'POST',
            body: JSON.stringify({
                title: service.title,
                description: service.description || '',
                icon: service.icon || '',
                features: Array.isArray(service.features) ? service.features : []
            })
        }, true);
        this.broadcastDataUpdate();
        return result;
    },

    async updateService(id, serviceData) {
        this._cache = null;
        const result = await this.request(`/services/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                title: serviceData.title,
                description: serviceData.description || '',
                icon: serviceData.icon || '',
                features: Array.isArray(serviceData.features) ? serviceData.features : []
            })
        }, true);
        this.broadcastDataUpdate();
        return result;
    },

    async deleteService(id) {
        this._cache = null;
        const result = await this.request(`/services/${id}`, { method: 'DELETE' }, true);
        this.broadcastDataUpdate();
        return result;
    },

    async getProjects() {
        return this.request('/projects', {}, true);
    },

    async addProject(project) {
        this._cache = null;
        const result = await this.request('/projects', {
            method: 'POST',
            body: JSON.stringify({
                title: project.title,
                description: project.description || '',
                image: project.image || '',
                category: project.category || '',
                tech: project.tech || '',
                link: project.link || '',
                featured: Boolean(project.featured)
            })
        }, true);
        this.broadcastDataUpdate();
        return result;
    },

    async updateProject(id, projectData) {
        this._cache = null;
        const result = await this.request(`/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                title: projectData.title,
                description: projectData.description || '',
                image: projectData.image || '',
                category: projectData.category || '',
                tech: projectData.tech || '',
                link: projectData.link || '',
                featured: Boolean(projectData.featured)
            })
        }, true);
        this.broadcastDataUpdate();
        return result;
    },

    async deleteProject(id) {
        this._cache = null;
        const result = await this.request(`/projects/${id}`, { method: 'DELETE' }, true);
        this.broadcastDataUpdate();
        return result;
    },

    async getBlogPosts() {
        const posts = await this.request('/blog', {}, true);
        return posts.map((post) => this.normalizeBlogPost(post));
    },

    async addBlogPost(post) {
        this._cache = null;
        const created = await this.request('/blog', {
            method: 'POST',
            body: JSON.stringify(this.denormalizeBlogPost(post))
        }, true);
        const normalized = this.normalizeBlogPost(created);
        this.broadcastDataUpdate();
        return normalized;
    },

    async updateBlogPost(id, postData) {
        this._cache = null;
        const updated = await this.request(`/blog/${id}`, {
            method: 'PUT',
            body: JSON.stringify(this.denormalizeBlogPost(postData))
        }, true);
        const normalized = this.normalizeBlogPost(updated);
        this.broadcastDataUpdate();
        return normalized;
    },

    async deleteBlogPost(id) {
        this._cache = null;
        const result = await this.request(`/blog/${id}`, { method: 'DELETE' }, true);
        this.broadcastDataUpdate();
        return result;
    },

    async getMessages() {
        const messages = await this.request('/messages', {}, true);
        return this.normalizeMessages(messages);
    },

    async addMessage(message) {
        const created = await this.request('/public/messages', {
            method: 'POST',
            body: JSON.stringify({
                name: message.from || message.name || 'Anonymous',
                email: message.email || '',
                subject: message.subject || '',
                message: message.message || ''
            })
        });
        this._cache = null;
        const normalized = {
            ...created,
            from: created.name
        };
        this.broadcastDataUpdate();
        return normalized;
    },

    async markMessageRead(id) {
        this._cache = null;
        const result = await this.request(`/messages/${id}/read`, { method: 'PATCH' }, true);
        this.broadcastDataUpdate();
        return result;
    },

    async deleteMessage(id) {
        this._cache = null;
        const result = await this.request(`/messages/${id}`, { method: 'DELETE' }, true);
        this.broadcastDataUpdate();
        return result;
    },

    async getUnreadCount() {
        const messages = await this.getMessages();
        return messages.filter((message) => !message.isRead).length;
    },

    async getSkills() {
        return this.request('/skills', {}, true);
    },

    async addSkill(skill) {
        this._cache = null;
        const result = await this.request('/skills', {
            method: 'POST',
            body: JSON.stringify({
                name: skill.name,
                level: Number(skill.level || 0),
                category: skill.category || ''
            })
        }, true);
        this.broadcastDataUpdate();
        return result;
    },

    async updateSkill(id, skillData) {
        this._cache = null;
        const result = await this.request(`/skills/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: skillData.name,
                level: Number(skillData.level || 0),
                category: skillData.category || ''
            })
        }, true);
        this.broadcastDataUpdate();
        return result;
    },

    async deleteSkill(id) {
        this._cache = null;
        const result = await this.request(`/skills/${id}`, { method: 'DELETE' }, true);
        this.broadcastDataUpdate();
        return result;
    },

    async getStats() {
        return this.request('/stats', {}, true);
    },

    async updateStats(stats) {
        return this.request('/settings', {
            method: 'PUT',
            body: JSON.stringify({ visit_count: Number(stats.visits || 0) })
        }, true);
    },

    async incrementVisits() {
        this._cache = null;
        return this.request('/public/track-visit', { method: 'POST' });
    },

    async getSettings() {
        const settings = await this.request('/settings', {}, true);
        return this.normalizeSettings(settings);
    },

    async updateSettings(settings) {
        this._cache = null;
        const payload = this.denormalizeSettings(settings);
        const result = await this.request('/settings', {
            method: 'PUT',
            body: JSON.stringify(payload)
        }, true);
        this.broadcastDataUpdate();
        return result;
    },

    async getAdminAuth(_forceRefresh = false) {
        return {
            email: localStorage.getItem('rememberEmail') || 'admin@example.com'
        };
    },

    async verifyAdminCredentials(email, password) {
        const result = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        const auth = JSON.parse(localStorage.getItem('authData') || '{}');
        auth.token = result.token;
        auth.email = result.user?.email || email;
        auth.loginTime = new Date().toISOString();
        localStorage.setItem('authData', JSON.stringify(auth));

        return true;
    },

    async changeAdminPassword({ currentPassword, newPassword }) {
        return this.request('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ currentPassword, newPassword })
        }, true);
    },

    async resetAdminPassword({ email, recoveryKey, newPassword }) {
        return this.request('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ email, recoveryKey, newPassword })
        });
    },

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },

    async uploadImage(file) {
        return this.fileToBase64(file);
    },

    async exportData() {
        const data = await this.fetchData(true);
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tarispace-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    },

    async importData(jsonData) {
        const parsed = JSON.parse(jsonData);
        await this.saveData(parsed);
        this._cache = null;
        return this.fetchData(true);
    },

    async resetToDefault() {
        throw new Error('Reset to default is not supported through the API yet.');
    }
};

window.DataSyncService = DataSyncService;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataSyncService;
}
