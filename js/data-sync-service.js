/**
 * Data Sync Service for Tarispace Portfolio
 * 
 * This service provides cloud-based data persistence using JSONbin.io
 * All data (profile, services, projects, blog, messages, skills) is stored
 * in the cloud and synced between admin dashboard and main site.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://jsonbin.io and create a free account
 * 2. Create a new bin with empty object: {}
 * 3. Copy your Bin ID and replace JSONBIN_BIN_ID below
 * 4. Go to API Keys and create a new Access Key with Read/Update permissions
 * 5. Copy your Access Key and replace JSONBIN_API_KEY below
 */

const DataSyncService = {
    // ========================================================================
    // CONFIGURATION - JSONbin.io credentials
    // ========================================================================
    JSONBIN_BIN_ID: '6966ca8cae596e708fda73f6',
    JSONBIN_API_KEY: '$2a$10$kF1WW4grArkeQvZEZPwjaOZd7WvGav.EEpEJT8fWwjwWyJOz8Hn9a',
    JSONBIN_BASE_URL: 'https://api.jsonbin.io/v3',
    
    // Cache for performance
    _cache: null,
    _lastFetch: 0,
    CACHE_DURATION: 30000, // 30 seconds cache
    
    // ========================================================================
    // DEFAULT DATA STRUCTURE
    // ========================================================================
    getDefaultData() {
        return {
            profile: {
                fullName: 'Tari Godsproperty Pereowei',
                title: 'Full Stack & Blockchain Developer',
                bio: "I'm Tari—a creative problem-solver and tech enthusiast who transforms ideas into elegant digital experiences. I blend analytical thinking with artistic vision to build web solutions that truly make an impact.",
                email: 'taripereowei@gmail.com',
                phone: '+234 704 645 7549',
                location: 'Bayelsa State, Nigeria',
                experience: 5,
                specialty: 'Full Stack & Blockchain Dev',
                focus: 'Web3 & Smart Contracts',
                profileImage: 'img/tari about image.png',
                aboutImage: 'img/tari about image.png',
                linkedinUrl: 'https://linkedin.com/in/tari',
                githubUrl: 'https://github.com/tari',
                twitterUrl: 'https://twitter.com/tarilove19',
                facebookUrl: 'https://facebook.com/tarilove0',
                whatsappNumber: '+2347046457549'
            },
            services: [
                {
                    id: 1,
                    title: 'Frontend Development',
                    description: 'Creating stunning, responsive user interfaces with React, Vue, and modern CSS. Focused on performance, accessibility, and beautiful design.',
                    icon: 'la-laptop-code',
                    features: ['React/Vue.js', 'Responsive Design', 'Performance']
                },
                {
                    id: 2,
                    title: 'Backend Development',
                    description: 'Building robust server-side applications with Node.js, Express, and various databases. API design, authentication, and scalable architecture.',
                    icon: 'la-server',
                    features: ['Node.js/Express', 'REST APIs', 'Database Design']
                },
                {
                    id: 3,
                    title: 'Blockchain Development',
                    description: 'Developing smart contracts and decentralized applications on Ethereum and Starknet. Web3 integration and DeFi protocol development.',
                    icon: 'la-cube',
                    features: ['Smart Contracts', 'Web3.js/Ethers', 'DeFi']
                }
            ],
            projects: [
                {
                    id: 1,
                    title: 'Starknet Infrastructure',
                    description: 'A comprehensive blockchain infrastructure platform built on Starknet L2. Features smart contract deployment and developer tools for the Cairo ecosystem.',
                    image: 'img/portfolio/project1.jpg',
                    category: 'blockchain',
                    tech: 'Starknet, Cairo, React',
                    link: '#',
                    featured: true
                },
                {
                    id: 2,
                    title: 'Taricents Platform',
                    description: 'A modern e-commerce platform with seamless user experience. Includes product catalog, shopping cart, and secure checkout functionality.',
                    image: 'img/portfolio/project2.jpg',
                    category: 'web',
                    tech: 'React, Node.js, MongoDB',
                    link: '#',
                    featured: true
                }
            ],
            blog: [
                {
                    id: 1,
                    title: 'Out of the Smoke: The Story Behind the Code',
                    content: 'A powerful personal narrative about overcoming adversity, from street life to full-stack development. The journey that shaped Tarispace and the philosophy behind every project I build.',
                    excerpt: 'From the streets to the code: The inspiring journey of how I went from roasting plantain for survival to becoming a full-stack developer.',
                    author: 'Tari Godsproperty Pereowei',
                    category: 'Personal Story',
                    tags: ['personal journey', 'full stack dev', 'inspiration', 'entrepreneurship', 'web development'],
                    image: 'img/blog/1.jpg',
                    date: '2025-01-25',
                    readTime: '12 min read',
                    link: 'article-out-of-smoke.html',
                    featured: true
                },
                {
                    id: 2,
                    title: 'The Dangers of Not Following Latest Trends',
                    content: 'Why staying oblivious to technological evolution is sabotaging your career. The price of ignoring trends, the compounding effects of stagnation, and how to stay relevant in a fast-moving tech landscape.',
                    excerpt: 'Ignoring tech trends is expensive. Here\'s why staying current isn\'t optional in today\'s market.',
                    author: 'Tari Godsproperty Pereowei',
                    category: 'Career Insights',
                    tags: ['tech trends', 'career growth', 'evolution', 'professional development'],
                    image: 'img/blog/2.jpg',
                    date: '2026-01-27',
                    readTime: '8 min read',
                    link: 'article-dangers-not-following-trends.html',
                    featured: false
                },
                {
                    id: 3,
                    title: 'The Importance of Having a Digital Skill',
                    content: 'In a world moving digital, having at least one digital skill is no longer optional—it\'s survival. Discover the freedom, leverage, and opportunity that comes with mastering a digital skill.',
                    excerpt: 'Digital skills are the new currency. Learn why this is non-negotiable in the modern economy.',
                    author: 'Tari Godsproperty Pereowei',
                    category: 'Skills',
                    tags: ['digital skills', 'education', 'opportunity', 'career', 'future'],
                    image: 'img/blog/3.jpg',
                    date: '2026-01-27',
                    readTime: '9 min read',
                    link: 'article-importance-digital-skills.html',
                    featured: false
                },
                {
                    id: 4,
                    title: 'Programming Problem-Solving Applies to Real Life',
                    content: 'The skills you develop debugging code translate directly to solving problems in your everyday life. Learn how systematic thinking becomes your superpower.',
                    excerpt: 'The debugging mindset isn\'t just for code. It\'s the key to solving any problem systematically.',
                    author: 'Tari Godsproperty Pereowei',
                    category: 'Mindset',
                    tags: ['problem-solving', 'programming', 'mindset', 'growth', 'systems thinking'],
                    image: 'img/blog/4.jpg',
                    date: '2026-02-10',
                    readTime: '10 min read',
                    link: 'article-programming-solves-real-life.html',
                    featured: false
                },
                {
                    id: 5,
                    title: 'From Failure to Success: Why Your First Project Doesn\'t Define Your Career',
                    content: 'Your first project will likely fail. That\'s not the end—it\'s the beginning. Learn why failure is the best teacher and how it leads to extraordinary success.',
                    excerpt: 'Everyone\'s first major project fails. What matters is what happens next. Here\'s how failure becomes your greatest advantage.',
                    author: 'Tari Godsproperty Pereowei',
                    category: 'Resilience',
                    tags: ['failure', 'resilience', 'success', 'mindset', 'growth'],
                    image: 'img/blog/5.jpg',
                    date: '2026-02-28',
                    readTime: '9 min read',
                    link: 'article-failure-to-success.html',
                    featured: false
                },
                {
                    id: 6,
                    title: 'Building Software, Building Character: What Code Teaches You',
                    content: 'Code teaches you discipline, integrity, and patience. Learn how building software builds character and makes you a better human being.',
                    excerpt: 'Writing code isn\'t just a job skill—it\'s a practice in building unshakeable character traits.',
                    author: 'Tari Godsproperty Pereowei',
                    category: 'Philosophy',
                    tags: ['character', 'code', 'philosophy', 'discipline', 'integrity'],
                    image: 'img/blog/6.jpg',
                    date: '2026-03-15',
                    readTime: '10 min read',
                    link: 'article-building-character.html',
                    featured: false
                }
            ],
            messages: [],
            skills: [
                { id: 1, name: 'React.js', level: 95, category: 'Frontend' },
                { id: 2, name: 'JavaScript', level: 98, category: 'Frontend' },
                { id: 3, name: 'Node.js', level: 90, category: 'Backend' },
                { id: 4, name: 'MongoDB', level: 85, category: 'Database' },
                { id: 5, name: 'Solidity', level: 80, category: 'Blockchain' },
                { id: 6, name: 'Cairo', level: 75, category: 'Blockchain' }
            ],
            stats: {
                visits: 1245,
                messages: 0,
                projects: 12,
                blogs: 8,
                happyClients: 19,
                completedProjects: 30
            },
            settings: {
                enableComments: true,
                showContactForm: true,
                enableNewsletter: true,
                emailNotifications: true
            },
            lastUpdated: new Date().toISOString()
        };
    },

    // ========================================================================
    // INITIALIZATION
    // ========================================================================
    async init() {
        // Check if using placeholder credentials
        if (this.JSONBIN_BIN_ID === 'YOUR_BIN_ID_HERE') {
            console.warn('⚠️ DataSyncService: Using localStorage fallback. Set up JSONbin.io for cloud sync.');
            return this._initLocalStorage();
        }
        
        try {
            const data = await this.fetchData();
            if (!data || Object.keys(data).length === 0) {
                // Initialize with default data
                await this.saveData(this.getDefaultData());
            }
            console.log('✅ DataSyncService initialized successfully');
            return true;
        } catch (error) {
            console.error('❌ DataSyncService initialization failed:', error);
            return this._initLocalStorage();
        }
    },

    _initLocalStorage() {
        if (!localStorage.getItem('portfolioData')) {
            localStorage.setItem('portfolioData', JSON.stringify(this.getDefaultData()));
        }
        return true;
    },

    // ========================================================================
    // CORE DATA OPERATIONS
    // ========================================================================
    
    /**
     * Fetch all data from cloud storage
     */
    async fetchData(forceRefresh = false) {
        // Return cached data if valid
        if (!forceRefresh && this._cache && (Date.now() - this._lastFetch < this.CACHE_DURATION)) {
            return this._cache;
        }

        // Fallback to localStorage if not configured
        if (this.JSONBIN_BIN_ID === 'YOUR_BIN_ID_HERE') {
            const localData = localStorage.getItem('portfolioData');
            this._cache = localData ? JSON.parse(localData) : this.getDefaultData();
            return this._cache;
        }

        try {
            const response = await fetch(`${this.JSONBIN_BASE_URL}/b/${this.JSONBIN_BIN_ID}/latest`, {
                method: 'GET',
                headers: {
                    'X-Access-Key': this.JSONBIN_API_KEY
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            this._cache = result.record || this.getDefaultData();
            this._lastFetch = Date.now();
            
            // Also save to localStorage as backup
            localStorage.setItem('portfolioData', JSON.stringify(this._cache));
            
            return this._cache;
        } catch (error) {
            console.error('Error fetching data:', error);
            // Fallback to localStorage
            const localData = localStorage.getItem('portfolioData');
            return localData ? JSON.parse(localData) : this.getDefaultData();
        }
    },

    /**
     * Save all data to cloud storage
     */
    async saveData(data) {
        data.lastUpdated = new Date().toISOString();
        
        // Always save to localStorage as backup
        localStorage.setItem('portfolioData', JSON.stringify(data));
        this._cache = data;
        this._lastFetch = Date.now();

        // If not configured, just use localStorage
        if (this.JSONBIN_BIN_ID === 'YOUR_BIN_ID_HERE') {
            this._triggerUpdateEvent(data);
            return data;
        }

        try {
            const response = await fetch(`${this.JSONBIN_BASE_URL}/b/${this.JSONBIN_BIN_ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Access-Key': this.JSONBIN_API_KEY
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Data saved to cloud');
            
            // Trigger update event for other tabs/pages
            this._triggerUpdateEvent(data);
            
            return result.record;
        } catch (error) {
            console.error('Error saving data:', error);
            throw error;
        }
    },

    /**
     * Trigger custom event for data updates
     */
    _triggerUpdateEvent(data) {
        // Use localStorage event for cross-tab communication
        localStorage.setItem('portfolioDataUpdate', Date.now().toString());
        
        // Dispatch custom event for same-page updates
        window.dispatchEvent(new CustomEvent('portfolioDataUpdated', { detail: data }));
    },

    // ========================================================================
    // PROFILE OPERATIONS
    // ========================================================================
    
    async getProfile() {
        const data = await this.fetchData();
        return data.profile;
    },

    async updateProfile(profileData) {
        const data = await this.fetchData();
        data.profile = { ...data.profile, ...profileData };
        await this.saveData(data);
        return data.profile;
    },

    // ========================================================================
    // SERVICES OPERATIONS
    // ========================================================================
    
    async getServices() {
        const data = await this.fetchData();
        return data.services || [];
    },

    async addService(service) {
        const data = await this.fetchData();
        service.id = Date.now();
        data.services.push(service);
        await this.saveData(data);
        return service;
    },

    async updateService(id, serviceData) {
        const data = await this.fetchData();
        const index = data.services.findIndex(s => s.id === id);
        if (index !== -1) {
            data.services[index] = { ...data.services[index], ...serviceData };
            await this.saveData(data);
            return data.services[index];
        }
        throw new Error('Service not found');
    },

    async deleteService(id) {
        const data = await this.fetchData();
        data.services = data.services.filter(s => s.id !== id);
        await this.saveData(data);
        return true;
    },

    // ========================================================================
    // PROJECTS OPERATIONS
    // ========================================================================
    
    async getProjects() {
        const data = await this.fetchData();
        return data.projects || [];
    },

    async addProject(project) {
        const data = await this.fetchData();
        project.id = Date.now();
        data.projects.push(project);
        data.stats.projects++;
        await this.saveData(data);
        return project;
    },

    async updateProject(id, projectData) {
        const data = await this.fetchData();
        const index = data.projects.findIndex(p => p.id === id);
        if (index !== -1) {
            data.projects[index] = { ...data.projects[index], ...projectData };
            await this.saveData(data);
            return data.projects[index];
        }
        throw new Error('Project not found');
    },

    async deleteProject(id) {
        const data = await this.fetchData();
        data.projects = data.projects.filter(p => p.id !== id);
        data.stats.projects = Math.max(0, data.stats.projects - 1);
        await this.saveData(data);
        return true;
    },

    // ========================================================================
    // BLOG OPERATIONS
    // ========================================================================
    
    async getBlogPosts() {
        const data = await this.fetchData();
        return data.blog || [];
    },

    async addBlogPost(post) {
        const data = await this.fetchData();
        post.id = Date.now();
        post.date = new Date().toISOString().split('T')[0];
        post.author = data.profile.fullName;
        data.blog.push(post);
        data.stats.blogs++;
        await this.saveData(data);
        return post;
    },

    async updateBlogPost(id, postData) {
        const data = await this.fetchData();
        const index = data.blog.findIndex(b => b.id === id);
        if (index !== -1) {
            data.blog[index] = { ...data.blog[index], ...postData };
            await this.saveData(data);
            return data.blog[index];
        }
        throw new Error('Blog post not found');
    },

    async deleteBlogPost(id) {
        const data = await this.fetchData();
        data.blog = data.blog.filter(b => b.id !== id);
        data.stats.blogs = Math.max(0, data.stats.blogs - 1);
        await this.saveData(data);
        return true;
    },

    // ========================================================================
    // MESSAGES OPERATIONS
    // ========================================================================
    
    async getMessages() {
        const data = await this.fetchData();
        return data.messages || [];
    },

    async addMessage(message) {
        const data = await this.fetchData();
        message.id = Date.now();
        message.time = new Date().toISOString();
        message.read = false;
        data.messages.unshift(message); // Add to beginning
        data.stats.messages++;
        await this.saveData(data);
        return message;
    },

    async markMessageRead(id) {
        const data = await this.fetchData();
        const message = data.messages.find(m => m.id === id);
        if (message) {
            message.read = true;
            await this.saveData(data);
            return message;
        }
        throw new Error('Message not found');
    },

    async deleteMessage(id) {
        const data = await this.fetchData();
        data.messages = data.messages.filter(m => m.id !== id);
        await this.saveData(data);
        return true;
    },

    async getUnreadCount() {
        const messages = await this.getMessages();
        return messages.filter(m => !m.read).length;
    },

    // ========================================================================
    // SKILLS OPERATIONS
    // ========================================================================
    
    async getSkills() {
        const data = await this.fetchData();
        return data.skills || [];
    },

    async addSkill(skill) {
        const data = await this.fetchData();
        skill.id = Date.now();
        data.skills.push(skill);
        await this.saveData(data);
        return skill;
    },

    async updateSkill(id, skillData) {
        const data = await this.fetchData();
        const index = data.skills.findIndex(s => s.id === id);
        if (index !== -1) {
            data.skills[index] = { ...data.skills[index], ...skillData };
            await this.saveData(data);
            return data.skills[index];
        }
        throw new Error('Skill not found');
    },

    async deleteSkill(id) {
        const data = await this.fetchData();
        data.skills = data.skills.filter(s => s.id !== id);
        await this.saveData(data);
        return true;
    },

    // ========================================================================
    // STATS OPERATIONS
    // ========================================================================
    
    async getStats() {
        const data = await this.fetchData();
        return data.stats;
    },

    async updateStats(stats) {
        const data = await this.fetchData();
        data.stats = { ...data.stats, ...stats };
        await this.saveData(data);
        return data.stats;
    },

    async incrementVisits() {
        const data = await this.fetchData();
        data.stats.visits++;
        await this.saveData(data);
        return data.stats.visits;
    },

    // ========================================================================
    // SETTINGS OPERATIONS
    // ========================================================================
    
    async getSettings() {
        const data = await this.fetchData();
        return data.settings;
    },

    async updateSettings(settings) {
        const data = await this.fetchData();
        data.settings = { ...data.settings, ...settings };
        await this.saveData(data);
        return data.settings;
    },

    // ========================================================================
    // IMAGE HANDLING (Base64 for small images, URL for external)
    // ========================================================================
    
    /**
     * Convert file to base64 for storage
     * Note: For production, use a proper image hosting service like Cloudinary, ImgBB, etc.
     */
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    },

    /**
     * Upload image to free image hosting (ImgBB)
     * Get your free API key at: https://api.imgbb.com/
     */
    async uploadImage(file, imgbbApiKey = null) {
        // If no API key, use base64 (works but increases data size)
        if (!imgbbApiKey) {
            return await this.fileToBase64(file);
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (result.success) {
                return result.data.url;
            }
            throw new Error('Image upload failed');
        } catch (error) {
            console.error('Image upload error:', error);
            // Fallback to base64
            return await this.fileToBase64(file);
        }
    },

    // ========================================================================
    // UTILITY FUNCTIONS
    // ========================================================================
    
    /**
     * Export all data as JSON file
     */
    async exportData() {
        const data = await this.fetchData();
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tarispace-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    },

    /**
     * Import data from JSON file
     */
    async importData(jsonData) {
        try {
            const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
            await this.saveData(data);
            return true;
        } catch (error) {
            console.error('Import error:', error);
            throw error;
        }
    },

    /**
     * Reset to default data
     */
    async resetToDefault() {
        await this.saveData(this.getDefaultData());
        return true;
    }
};

// Make available globally
window.DataSyncService = DataSyncService;

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataSyncService;
}
