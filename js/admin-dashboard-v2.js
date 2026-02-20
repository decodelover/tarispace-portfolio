/**
 * Admin Dashboard JavaScript - Cloud Synced Version
 * 
 * This version uses DataSyncService for cloud-based data persistence.
 * All changes made here will sync to the main site (index.html) automatically.
 */

const AdminDashboard = {
    data: null,
    isLoading: false,

    // ========================================================================
    // INITIALIZATION
    // ========================================================================
    
    async init() {
        this.showLoadingOverlay('Initializing Dashboard...');
        
        try {
            // Initialize the sync service
            await DataSyncService.init();
            
            // Load all data
            this.data = await DataSyncService.fetchData(true);
            
            // Setup UI
            this.setupEventListeners();
            this.loadDashboard();
            this.initCharts();
            this.loadProfileForm();
            this.renderServices();
            this.renderProjects();
            this.renderBlog();
            this.renderMessages();
            this.renderSkills();
            this.updateNotificationBadge();
            
            // Listen for real-time updates
            this.setupRealtimeSync();
            
            this.hideLoadingOverlay();
            this.showToast('Dashboard loaded successfully!', 'success');
            
        } catch (error) {
            console.error('Dashboard initialization error:', error);
            this.hideLoadingOverlay();
            this.showToast('Error loading dashboard. Using cached data.', 'error');
            
            // Fallback to localStorage
            const cachedData = localStorage.getItem('portfolioData');
            if (cachedData) {
                this.data = JSON.parse(cachedData);
                this.loadDashboard();
            }
        }
    },

    setupRealtimeSync() {
        // Listen for updates from other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === 'portfolioDataUpdate') {
                this.refreshData();
            }
        });

        // Listen for custom events
        window.addEventListener('portfolioDataUpdated', (e) => {
            this.data = e.detail;
            this.refreshUI();
        });
    },

    async refreshData() {
        this.data = await DataSyncService.fetchData(true);
        this.refreshUI();
    },

    refreshUI() {
        this.loadDashboard();
        this.loadProfileForm();
        this.renderServices();
        this.renderProjects();
        this.renderBlog();
        this.renderMessages();
        this.renderSkills();
        this.updateNotificationBadge();
    },

    // ========================================================================
    // LOADING OVERLAY
    // ========================================================================
    
    showLoadingOverlay(message = 'Loading...') {
        let overlay = document.getElementById('loadingOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'loadingOverlay';
            overlay.innerHTML = `
                <div class="loading-content">
                    <div class="loading-spinner"></div>
                    <p class="loading-message">${message}</p>
                </div>
            `;
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99999;
            `;
            document.body.appendChild(overlay);
        }
        overlay.querySelector('.loading-message').textContent = message;
        overlay.style.display = 'flex';
    },

    hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    },

    // ========================================================================
    // EVENT LISTENERS
    // ========================================================================
    
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Menu toggle for mobile
        document.getElementById('menuToggle')?.addEventListener('click', () => {
            document.querySelector('.sidebar')?.classList.toggle('active');
        });

        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                // Clear current auth session so login page does not auto-redirect.
                localStorage.removeItem('authData');
                this.showToast('Logged out successfully', 'success');
                setTimeout(() => {
                    window.location.href = 'admin-login.html';
                }, 1500);
            }
        });

        // Profile section
        document.getElementById('changePhotoBtn')?.addEventListener('click', () => {
            document.getElementById('photoInput')?.click();
        });

        document.getElementById('photoInput')?.addEventListener('change', (e) => {
            this.handlePhotoUpload(e, 'profile');
        });

        // About image upload
        document.getElementById('changeAboutPhotoBtn')?.addEventListener('click', () => {
            document.getElementById('aboutPhotoInput')?.click();
        });

        document.getElementById('aboutPhotoInput')?.addEventListener('change', (e) => {
            this.handlePhotoUpload(e, 'about');
        });

        document.getElementById('saveProfileBtn')?.addEventListener('click', () => {
            this.saveProfile();
        });

        document.getElementById('cancelProfileBtn')?.addEventListener('click', () => {
            this.loadProfileForm();
        });

        // Services
        document.getElementById('addServiceBtn')?.addEventListener('click', () => {
            this.openServiceModal();
        });

        document.getElementById('serviceForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveService();
        });

        document.getElementById('cancelServiceBtn')?.addEventListener('click', () => {
            this.closeServiceModal();
        });

        document.getElementById('closeServiceModal')?.addEventListener('click', () => {
            this.closeServiceModal();
        });

        // Projects
        document.getElementById('addProjectBtn')?.addEventListener('click', () => {
            this.openProjectModal();
        });

        document.getElementById('projectForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProject();
        });

        document.getElementById('cancelProjectBtn')?.addEventListener('click', () => {
            this.closeProjectModal();
        });

        document.getElementById('closeProjectModal')?.addEventListener('click', () => {
            this.closeProjectModal();
        });

        document.getElementById('projectImage')?.addEventListener('change', (e) => {
            this.handleProjectImagePreview(e);
        });

        // Blog
        document.getElementById('addBlogBtn')?.addEventListener('click', () => {
            this.openBlogModal();
        });

        document.getElementById('blogForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveBlog();
        });

        document.getElementById('cancelBlogBtn')?.addEventListener('click', () => {
            this.closeBlogModal();
        });

        document.getElementById('closeBlogModal')?.addEventListener('click', () => {
            this.closeBlogModal();
        });

        // Messages
        document.getElementById('clearMessagesBtn')?.addEventListener('click', async () => {
            if (confirm('Clear all messages?')) {
                this.data.messages = [];
                await DataSyncService.saveData(this.data);
                this.renderMessages();
                this.updateNotificationBadge();
                this.showToast('All messages cleared', 'success');
            }
        });

        // Skills
        document.getElementById('addSkillBtn')?.addEventListener('click', () => {
            this.openSkillModal();
        });

        document.getElementById('skillLevel')?.addEventListener('input', (e) => {
            document.getElementById('skillLevelValue').textContent = e.target.value + '%';
        });

        document.getElementById('skillForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSkill();
        });

        document.getElementById('cancelSkillBtn')?.addEventListener('click', () => {
            this.closeSkillModal();
        });

        document.getElementById('closeSkillModal')?.addEventListener('click', () => {
            this.closeSkillModal();
        });

        // Settings
        document.getElementById('saveSaveSettingsBtn')?.addEventListener('click', () => {
            this.saveSettings();
        });

        document.getElementById('changePasswordBtn')?.addEventListener('click', () => {
            this.showToast('Password change feature coming soon', 'info');
        });

        document.getElementById('backupDataBtn')?.addEventListener('click', () => {
            this.backupData();
        });

        document.getElementById('importDataBtn')?.addEventListener('click', () => {
            document.getElementById('importDataInput')?.click();
        });

        document.getElementById('importDataInput')?.addEventListener('change', (e) => {
            this.importData(e);
        });

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('show');
            }
        });

        // Notification button
        document.getElementById('notificationBtn')?.addEventListener('click', () => {
            this.navigateToSection('messages');
        });
    },

    // ========================================================================
    // NAVIGATION
    // ========================================================================
    
    handleNavigation(e) {
        e.preventDefault();
        const section = e.target.closest('.nav-link').dataset.section;
        this.navigateToSection(section);
    },

    navigateToSection(section) {
        // Update active states
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === section) {
                link.classList.add('active');
            }
        });

        document.querySelectorAll('.section').forEach(sec => {
            sec.classList.remove('active');
        });

        const sectionElement = document.getElementById(`${section}-section`);
        if (sectionElement) {
            sectionElement.classList.add('active');
            document.getElementById('pageTitle').textContent = 
                section.charAt(0).toUpperCase() + section.slice(1);
        }

        // Close sidebar on mobile
        document.querySelector('.sidebar')?.classList.remove('active');
    },

    // ========================================================================
    // DASHBOARD
    // ========================================================================
    
    loadDashboard() {
        if (!this.data) return;
        
        document.getElementById('visitCount').textContent = (this.data.stats?.visits || 0).toLocaleString();
        document.getElementById('messageCount').textContent = this.data.messages?.length || 0;
        document.getElementById('projectCount').textContent = this.data.projects?.length || 0;
        document.getElementById('blogCount').textContent = this.data.blog?.length || 0;
        
        // Update recent activity
        this.updateRecentActivity();
    },

    updateRecentActivity() {
        const activityList = document.querySelector('.activity-list');
        if (!activityList || !this.data) return;

        activityList.innerHTML = '';
        
        // Combine messages and recent updates
        const activities = [];
        
        // Add recent messages
        this.data.messages?.slice(0, 3).forEach(msg => {
            activities.push({
                icon: 'fa-envelope',
                text: `New message from ${msg.from}`,
                time: this.formatTimeAgo(msg.time),
                timestamp: new Date(msg.time).getTime()
            });
        });

        // Sort by time
        activities.sort((a, b) => b.timestamp - a.timestamp);

        if (activities.length === 0) {
            activityList.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No recent activity</p>';
            return;
        }

        activities.slice(0, 5).forEach(activity => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            item.innerHTML = `
                <div class="activity-icon">
                    <i class="fa ${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.text}</p>
                    <span>${activity.time}</span>
                </div>
            `;
            activityList.appendChild(item);
        });
    },

    formatTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
        return date.toLocaleDateString();
    },

    initCharts() {
        // Visitor Chart
        const visitorCtx = document.getElementById('visitorChart')?.getContext('2d');
        if (visitorCtx) {
            new Chart(visitorCtx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Visitors',
                        data: [120, 190, 150, 220, 180, 210, 195],
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 5,
                        pointBackgroundColor: '#6366f1',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, border: { display: false }, grid: { color: 'rgba(0, 0, 0, 0.05)' } },
                        x: { border: { display: false }, grid: { display: false } }
                    }
                }
            });
        }

        // Traffic Chart
        const trafficCtx = document.getElementById('trafficChart')?.getContext('2d');
        if (trafficCtx) {
            new Chart(trafficCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Direct', 'Google', 'Social', 'Referral'],
                    datasets: [{
                        data: [35, 25, 25, 15],
                        backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#3b82f6']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: { legend: { position: 'bottom' } }
                }
            });
        }
    },

    // ========================================================================
    // PROFILE
    // ========================================================================
    
    loadProfileForm() {
        if (!this.data?.profile) return;
        
        const profile = this.data.profile;
        
        // Set form values
        document.getElementById('fullName').value = profile.fullName || '';
        document.getElementById('title').value = profile.title || '';
        document.getElementById('bio').value = profile.bio || '';
        document.getElementById('email').value = profile.email || '';
        document.getElementById('phone').value = profile.phone || '';
        document.getElementById('location').value = profile.location || '';
        document.getElementById('experience').value = profile.experience || 0;
        document.getElementById('linkedinUrl').value = profile.linkedinUrl || '';
        document.getElementById('githubUrl').value = profile.githubUrl || '';
        document.getElementById('twitterUrl').value = profile.twitterUrl || '';
        
        // Set profile images
        const profileImg = document.querySelector('.profile-image');
        if (profileImg && profile.profileImage) {
            profileImg.src = profile.profileImage;
        }
        
        const aboutImg = document.querySelector('.about-image-preview');
        if (aboutImg && profile.aboutImage) {
            aboutImg.src = profile.aboutImage;
        }
    },

    async saveProfile() {
        this.showLoadingOverlay('Saving profile...');
        
        try {
            this.data.profile = {
                ...this.data.profile,
                fullName: document.getElementById('fullName').value,
                title: document.getElementById('title').value,
                bio: document.getElementById('bio').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                location: document.getElementById('location').value,
                experience: parseInt(document.getElementById('experience').value) || 0,
                linkedinUrl: document.getElementById('linkedinUrl').value,
                githubUrl: document.getElementById('githubUrl').value,
                twitterUrl: document.getElementById('twitterUrl').value
            };

            await DataSyncService.saveData(this.data);
            this.hideLoadingOverlay();
            this.showToast('Profile updated successfully! Changes will appear on the main site.', 'success');
        } catch (error) {
            this.hideLoadingOverlay();
            this.showToast('Error saving profile: ' + error.message, 'error');
        }
    },

    async handlePhotoUpload(e, type = 'profile') {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            this.showToast('Please select an image file', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            this.showToast('Image size should be less than 5MB', 'error');
            return;
        }

        this.showLoadingOverlay('Uploading image...');

        try {
            // Convert to base64 (for free hosting without image service)
            const imageData = await DataSyncService.fileToBase64(file);
            
            if (type === 'profile') {
                this.data.profile.profileImage = imageData;
                document.querySelector('.profile-image').src = imageData;
                document.querySelector('.user-avatar').src = imageData;
            } else if (type === 'about') {
                this.data.profile.aboutImage = imageData;
                const aboutPreview = document.querySelector('.about-image-preview');
                if (aboutPreview) aboutPreview.src = imageData;
            }

            await DataSyncService.saveData(this.data);
            this.hideLoadingOverlay();
            this.showToast('Image uploaded successfully!', 'success');
        } catch (error) {
            this.hideLoadingOverlay();
            this.showToast('Error uploading image: ' + error.message, 'error');
        }
    },

    // ========================================================================
    // SERVICES
    // ========================================================================
    
    currentEditingServiceId: null,

    openServiceModal(serviceId = null) {
        this.currentEditingServiceId = serviceId;
        const form = document.getElementById('serviceForm');
        form.reset();

        if (serviceId) {
            const service = this.data.services.find(s => s.id === serviceId);
            if (service) {
                document.getElementById('serviceTitle').value = service.title;
                document.getElementById('serviceDesc').value = service.description;
                document.getElementById('serviceIcon').value = service.icon;
                document.querySelector('#serviceModal .modal-header h2').textContent = 'Edit Service';
            }
        } else {
            document.querySelector('#serviceModal .modal-header h2').textContent = 'Add New Service';
        }

        document.getElementById('serviceModal').classList.add('show');
    },

    closeServiceModal() {
        document.getElementById('serviceModal').classList.remove('show');
        this.currentEditingServiceId = null;
    },

    async saveService() {
        this.showLoadingOverlay('Saving service...');

        try {
            const serviceData = {
                title: document.getElementById('serviceTitle').value,
                description: document.getElementById('serviceDesc').value,
                icon: document.getElementById('serviceIcon').value
            };

            if (this.currentEditingServiceId) {
                await DataSyncService.updateService(this.currentEditingServiceId, serviceData);
                this.showToast('Service updated successfully!', 'success');
            } else {
                await DataSyncService.addService(serviceData);
                this.showToast('Service added successfully!', 'success');
            }

            this.data = await DataSyncService.fetchData(true);
            this.renderServices();
            this.closeServiceModal();
            this.hideLoadingOverlay();
        } catch (error) {
            this.hideLoadingOverlay();
            this.showToast('Error saving service: ' + error.message, 'error');
        }
    },

    renderServices() {
        const servicesList = document.getElementById('servicesList');
        if (!servicesList || !this.data?.services) return;

        servicesList.innerHTML = '';

        this.data.services.forEach(service => {
            const serviceCard = document.createElement('div');
            serviceCard.className = 'service-card';
            serviceCard.innerHTML = `
                <div class="service-icon">
                    <i class="fa ${service.icon}"></i>
                </div>
                <div class="service-content">
                    <h3>${service.title}</h3>
                    <p>${service.description}</p>
                    <div class="card-actions">
                        <button class="card-btn card-btn-edit" onclick="AdminDashboard.openServiceModal(${service.id})">Edit</button>
                        <button class="card-btn card-btn-delete" onclick="AdminDashboard.deleteService(${service.id})">Delete</button>
                    </div>
                </div>
            `;
            servicesList.appendChild(serviceCard);
        });

        if (this.data.services.length === 0) {
            servicesList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No services yet. Add your first service!</p>';
        }
    },

    async deleteService(id) {
        if (!confirm('Are you sure you want to delete this service?')) return;

        this.showLoadingOverlay('Deleting service...');
        try {
            await DataSyncService.deleteService(id);
            this.data = await DataSyncService.fetchData(true);
            this.renderServices();
            this.hideLoadingOverlay();
            this.showToast('Service deleted successfully!', 'success');
        } catch (error) {
            this.hideLoadingOverlay();
            this.showToast('Error deleting service: ' + error.message, 'error');
        }
    },

    // ========================================================================
    // PROJECTS
    // ========================================================================
    
    currentEditingProjectId: null,
    currentProjectImage: null,

    openProjectModal(projectId = null) {
        this.currentEditingProjectId = projectId;
        this.currentProjectImage = null;
        const form = document.getElementById('projectForm');
        form.reset();
        document.getElementById('projectImagePreview').style.display = 'none';

        if (projectId) {
            const project = this.data.projects.find(p => p.id === projectId);
            if (project) {
                document.getElementById('projectTitle').value = project.title;
                document.getElementById('projectDesc').value = project.description;
                document.getElementById('projectTech').value = project.tech;
                document.getElementById('projectLink').value = project.link || '';
                document.getElementById('projectImage').removeAttribute('required');
                
                if (project.image) {
                    document.getElementById('projectImagePreview').src = project.image;
                    document.getElementById('projectImagePreview').style.display = 'block';
                    this.currentProjectImage = project.image;
                }
                
                document.querySelector('#projectModal .modal-header h2').textContent = 'Edit Project';
            }
        } else {
            document.getElementById('projectImage').setAttribute('required', 'required');
            document.querySelector('#projectModal .modal-header h2').textContent = 'Add New Project';
        }

        document.getElementById('projectModal').classList.add('show');
    },

    closeProjectModal() {
        document.getElementById('projectModal').classList.remove('show');
        this.currentEditingProjectId = null;
        this.currentProjectImage = null;
    },

    async handleProjectImagePreview(e) {
        const file = e.target.files[0];
        if (file) {
            try {
                // For now, create a local preview using FileReader
                // Store the file name for reference
                const fileName = file.name;
                this.currentProjectImage = `img/portfolio/${fileName}`;
                
                // Preview the image locally
                const reader = new FileReader();
                reader.onload = (event) => {
                    const preview = document.getElementById('projectImagePreview');
                    preview.src = event.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } catch (error) {
                this.showToast('Error loading image preview', 'error');
            }
        }
    },

    async saveProject() {
        if (!this.currentProjectImage && !this.currentEditingProjectId) {
            this.showToast('Please select a project image', 'error');
            return;
        }

        this.showLoadingOverlay('Saving project...');

        try {
            const projectData = {
                title: document.getElementById('projectTitle').value,
                description: document.getElementById('projectDesc').value,
                tech: document.getElementById('projectTech').value,
                link: document.getElementById('projectLink').value,
                image: this.currentProjectImage
            };

            if (this.currentEditingProjectId) {
                if (!this.currentProjectImage) {
                    delete projectData.image; // Keep existing image
                }
                await DataSyncService.updateProject(this.currentEditingProjectId, projectData);
                this.showToast('Project updated successfully!', 'success');
            } else {
                await DataSyncService.addProject(projectData);
                this.showToast('Project added successfully!', 'success');
            }

            this.data = await DataSyncService.fetchData(true);
            this.renderProjects();
            this.loadDashboard();
            this.closeProjectModal();
            this.hideLoadingOverlay();
        } catch (error) {
            this.hideLoadingOverlay();
            this.showToast('Error saving project: ' + error.message, 'error');
        }
    },

    renderProjects() {
        const projectsList = document.getElementById('projectsList');
        if (!projectsList || !this.data?.projects) return;

        projectsList.innerHTML = '';

        this.data.projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <img src="${project.image || 'img/portfolio/placeholder.jpg'}" alt="${project.title}" class="project-image">
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-meta">
                        <span><i class="fa fa-code"></i> ${project.tech}</span>
                        ${project.link ? `<span><i class="fa fa-link"></i> <a href="${project.link}" target="_blank">Watch Project</a></span>` : ''}
                    </div>
                    <div class="card-actions">
                        <button class="card-btn card-btn-edit" onclick="AdminDashboard.openProjectModal(${project.id})">Edit</button>
                        <button class="card-btn card-btn-delete" onclick="AdminDashboard.deleteProject(${project.id})">Delete</button>
                    </div>
                </div>
            `;
            projectsList.appendChild(projectCard);
        });

        if (this.data.projects.length === 0) {
            projectsList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No projects yet. Add your first project!</p>';
        }
    },

    async deleteProject(id) {
        if (!confirm('Are you sure you want to delete this project?')) return;

        this.showLoadingOverlay('Deleting project...');
        try {
            await DataSyncService.deleteProject(id);
            this.data = await DataSyncService.fetchData(true);
            this.renderProjects();
            this.loadDashboard();
            this.hideLoadingOverlay();
            this.showToast('Project deleted successfully!', 'success');
        } catch (error) {
            this.hideLoadingOverlay();
            this.showToast('Error deleting project: ' + error.message, 'error');
        }
    },

    // ========================================================================
    // BLOG
    // ========================================================================
    
    currentEditingBlogId: null,

    openBlogModal(blogId = null) {
        this.currentEditingBlogId = blogId;
        const form = document.getElementById('blogForm');
        form.reset();

        if (blogId) {
            const post = this.data.blog.find(b => b.id === blogId);
            if (post) {
                document.getElementById('blogTitle').value = post.title;
                document.getElementById('blogContent').value = post.content;
                document.getElementById('blogImage').value = post.image || '';
                document.getElementById('blogAuthor').value = post.author || 'Robert Kariuki';
                document.getElementById('blogCategory').value = post.category;
                document.getElementById('blogTags').value = Array.isArray(post.tags) ? post.tags.join(', ') : post.tags;
                document.getElementById('blogReadTime').value = post.readTime || 5;
                document.getElementById('blogLink').value = post.link || '';
                document.getElementById('blogFeatured').checked = post.featured || false;
                document.querySelector('#blogModal .modal-header h2').textContent = 'Edit Post';
            }
        } else {
            document.getElementById('blogAuthor').value = 'Robert Kariuki';
            document.querySelector('#blogModal .modal-header h2').textContent = 'Write New Post';
        }

        document.getElementById('blogModal').classList.add('show');
    },

    closeBlogModal() {
        document.getElementById('blogModal').classList.remove('show');
        this.currentEditingBlogId = null;
    },

    async saveBlog() {
        this.showLoadingOverlay('Saving blog post...');

        try {
            const blogData = {
                title: document.getElementById('blogTitle').value,
                content: document.getElementById('blogContent').value,
                image: document.getElementById('blogImage').value,
                author: document.getElementById('blogAuthor').value,
                category: document.getElementById('blogCategory').value,
                tags: document.getElementById('blogTags').value.split(',').map(tag => tag.trim()).filter(t => t),
                readTime: parseInt(document.getElementById('blogReadTime').value) || 5,
                link: document.getElementById('blogLink').value,
                featured: document.getElementById('blogFeatured').checked,
                excerpt: document.getElementById('blogContent').value.substring(0, 150) + '...',
                date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
            };

            if (this.currentEditingBlogId) {
                await DataSyncService.updateBlogPost(this.currentEditingBlogId, blogData);
                this.showToast('Blog post updated successfully!', 'success');
            } else {
                await DataSyncService.addBlogPost(blogData);
                this.showToast('Blog post published successfully!', 'success');
            }

            this.data = await DataSyncService.fetchData(true);
            this.renderBlog();
            this.loadDashboard();
            this.closeBlogModal();
            this.hideLoadingOverlay();
        } catch (error) {
            this.hideLoadingOverlay();
            this.showToast('Error saving blog post: ' + error.message, 'error');
        }
    },

    renderBlog() {
        const blogList = document.getElementById('blogList');
        if (!blogList || !this.data?.blog) return;

        blogList.innerHTML = '';

        this.data.blog.forEach(post => {
            const blogCard = document.createElement('div');
            blogCard.className = 'blog-card';
            const imageHtml = post.image ? `<div class="blog-card-image" style="background-image: url('${post.image}'); height: 200px; background-size: cover; background-position: center; border-radius: 4px 4px 0 0;"></div>` : '';
            blogCard.innerHTML = `
                ${imageHtml}
                <div style="padding: 15px;">
                    <h3 style="margin: 0 0 10px 0;">${post.title}</h3>
                    <div class="blog-meta" style="font-size: 12px; color: #999; margin-bottom: 10px;">
                        <span><i class="fa fa-calendar"></i> ${post.date}</span>
                        <span><i class="fa fa-user"></i> ${post.author || 'Author'}</span>
                        <span><i class="fa fa-folder"></i> ${post.category}</span>
                    </div>
                    ${post.tags ? `<div style="font-size: 12px; margin-bottom: 10px;"><i class="fa fa-tags"></i> ${Array.isArray(post.tags) ? post.tags.join(', ') : post.tags}</div>` : ''}
                    <p class="blog-preview" style="margin: 10px 0; font-size: 13px; color: #666; line-height: 1.5;">${post.content?.substring(0, 150) || ''}...</p>
                    ${post.readTime ? `<div style="font-size: 12px; color: #999; margin-bottom: 10px;"><i class="fa fa-clock-o"></i> ${post.readTime} min read</div>` : ''}
                    <div class="card-actions">
                        <button class="card-btn card-btn-edit" onclick="AdminDashboard.openBlogModal(${post.id})">Edit</button>
                        <button class="card-btn card-btn-delete" onclick="AdminDashboard.deleteBlog(${post.id})">Delete</button>
                    </div>
                </div>
            `;
            blogList.appendChild(blogCard);
        });

        if (this.data.blog.length === 0) {
            blogList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No blog posts yet. Start writing!</p>';
        }
    },

    async deleteBlog(id) {
        if (!confirm('Are you sure you want to delete this blog post?')) return;

        this.showLoadingOverlay('Deleting blog post...');
        try {
            await DataSyncService.deleteBlogPost(id);
            this.data = await DataSyncService.fetchData(true);
            this.renderBlog();
            this.loadDashboard();
            this.hideLoadingOverlay();
            this.showToast('Blog post deleted successfully!', 'success');
        } catch (error) {
            this.hideLoadingOverlay();
            this.showToast('Error deleting blog post: ' + error.message, 'error');
        }
    },

    async syncAllBlogsToCloud() {
        const btn = document.getElementById('syncCloudBtn');
        if (btn) btn.disabled = true;

        this.showLoadingOverlay('Syncing 6 blogs to JSONbin cloud...');

        try {
            // The 6 blog articles with all metadata
            const blogsToSync = [
                { id: 1, title: 'Out of the Smoke: The Story Behind the Code', content: 'A powerful personal narrative about overcoming adversity, from street life to full-stack development. The journey that shaped Tarispace and the philosophy behind every project I build.', author: 'Tari Godsproperty Pereowei', category: 'Personal Story', tags: ['personal journey', 'full stack dev', 'inspiration', 'entrepreneurship', 'web development'], date: '2025-01-25', image: 'img/blog/1.jpg', link: 'article-out-of-smoke.html', readTime: '12 min read', featured: true },
                { id: 2, title: 'The Dangers of Not Following Latest Trends', content: 'Why staying oblivious to technological evolution is sabotaging your career. The price of ignoring trends, the compounding effects of stagnation, and how to stay relevant in a fast-moving tech landscape.', author: 'Tari Godsproperty Pereowei', category: 'Career Insights', tags: ['tech trends', 'career growth', 'evolution', 'professional development'], date: '2026-01-27', image: 'img/blog/2.jpg', link: 'article-dangers-not-following-trends.html', readTime: '8 min read', featured: false },
                { id: 3, title: 'The Importance of Having a Digital Skill', content: 'In a world moving digital, having at least one digital skill is no longer optional—it\'s survival. Discover the freedom, leverage, and opportunity that comes with mastering a digital skill.', author: 'Tari Godsproperty Pereowei', category: 'Skills', tags: ['digital skills', 'education', 'opportunity', 'career', 'future'], date: '2026-01-27', image: 'img/blog/3.jpg', link: 'article-importance-digital-skills.html', readTime: '9 min read', featured: false },
                { id: 4, title: 'Programming Problem-Solving Applies to Real Life', content: 'The skills you develop debugging code translate directly to solving problems in your everyday life. Learn how systematic thinking becomes your superpower.', author: 'Tari Godsproperty Pereowei', category: 'Mindset', tags: ['problem-solving', 'programming', 'mindset', 'growth', 'systems thinking'], date: '2026-02-10', image: 'img/blog/4.jpg', link: 'article-programming-solves-real-life.html', readTime: '10 min read', featured: false },
                { id: 5, title: 'From Failure to Success: Why Your First Project Doesn\'t Define Your Career', content: 'Your first project will likely fail. That\'s not the end—it\'s the beginning. Learn why failure is the best teacher and how it leads to extraordinary success.', author: 'Tari Godsproperty Pereowei', category: 'Resilience', tags: ['failure', 'resilience', 'success', 'mindset', 'growth'], date: '2026-02-28', image: 'img/blog/5.jpg', link: 'article-failure-to-success.html', readTime: '9 min read', featured: false },
                { id: 6, title: 'Building Software, Building Character: What Code Teaches You', content: 'Code teaches you discipline, integrity, and patience. Learn how building software builds character and makes you a better human being.', author: 'Tari Godsproperty Pereowei', category: 'Philosophy', tags: ['character', 'code', 'philosophy', 'discipline', 'integrity'], date: '2026-03-15', image: 'img/blog/6.jpg', link: 'article-building-character.html', readTime: '10 min read', featured: false }
            ];

            // Update local data first
            this.data.blog = blogsToSync;
            this.data.stats = this.data.stats || {};
            this.data.stats.blogs = 6;
            this.data.lastUpdated = new Date().toISOString();

            // Save to cloud using DataSyncService (which handles CORS properly)
            await DataSyncService.saveData(this.data);
            
            // Refresh local data
            this.renderBlog();
            this.loadDashboard();
            this.hideLoadingOverlay();
            this.showToast('✅ Successfully synced 6 blogs to cloud! Live site will update within 30 seconds.', 'success');
            
        } catch (error) {
            console.error('Sync error:', error);
            this.hideLoadingOverlay();
            this.showToast('❌ Error syncing to cloud: ' + error.message, 'error');
        } finally {
            if (btn) btn.disabled = false;
        }
    },

    // ========================================================================
    // MESSAGES
    // ========================================================================
    
    renderMessages() {
        const messagesList = document.getElementById('messagesList');
        if (!messagesList) return;

        messagesList.innerHTML = '';

        if (!this.data?.messages || this.data.messages.length === 0) {
            messagesList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No messages yet. Messages from your contact form will appear here.</p>';
            return;
        }

        this.data.messages.forEach(message => {
            const messageCard = document.createElement('div');
            messageCard.className = `message-card ${message.read ? '' : 'unread'}`;
            messageCard.innerHTML = `
                <div class="message-header">
                    <div>
                        <p class="message-from">${message.from} ${!message.read ? '<span class="new-badge">NEW</span>' : ''}</p>
                        <p class="message-email">${message.email}</p>
                        ${message.subject ? `<p class="message-subject"><strong>Subject:</strong> ${message.subject}</p>` : ''}
                    </div>
                    <p class="message-time">${this.formatTimeAgo(message.time)}</p>
                </div>
                <p class="message-content">${message.message}</p>
                <div class="message-actions">
                    ${!message.read ? `<button class="msg-btn msg-btn-mark-read" onclick="AdminDashboard.markAsRead(${message.id})">Mark as Read</button>` : ''}
                    <button class="msg-btn msg-btn-reply" onclick="AdminDashboard.replyMessage('${message.email}')">Reply</button>
                    <button class="msg-btn msg-btn-delete" onclick="AdminDashboard.deleteMessage(${message.id})">Delete</button>
                </div>
            `;
            messagesList.appendChild(messageCard);
        });
    },

    async markAsRead(id) {
        try {
            await DataSyncService.markMessageRead(id);
            this.data = await DataSyncService.fetchData(true);
            this.renderMessages();
            this.updateNotificationBadge();
        } catch (error) {
            this.showToast('Error marking message as read', 'error');
        }
    },

    async deleteMessage(id) {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            await DataSyncService.deleteMessage(id);
            this.data = await DataSyncService.fetchData(true);
            this.renderMessages();
            this.loadDashboard();
            this.updateNotificationBadge();
            this.showToast('Message deleted', 'success');
        } catch (error) {
            this.showToast('Error deleting message', 'error');
        }
    },

    replyMessage(email) {
        window.location.href = `mailto:${email}`;
    },

    updateNotificationBadge() {
        const badge = document.querySelector('#notificationBtn .badge');
        if (badge && this.data?.messages) {
            const unreadCount = this.data.messages.filter(m => !m.read).length;
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
    },

    // ========================================================================
    // SKILLS
    // ========================================================================
    
    currentEditingSkillId: null,

    openSkillModal(skillId = null) {
        this.currentEditingSkillId = skillId;
        const form = document.getElementById('skillForm');
        form.reset();
        document.getElementById('skillLevelValue').textContent = '70%';
        document.getElementById('skillLevel').value = 70;

        if (skillId) {
            const skill = this.data.skills.find(s => s.id === skillId);
            if (skill) {
                document.getElementById('skillName').value = skill.name;
                document.getElementById('skillLevel').value = skill.level;
                document.getElementById('skillLevelValue').textContent = skill.level + '%';
                document.getElementById('skillCategory').value = skill.category;
                document.querySelector('#skillModal .modal-header h2').textContent = 'Edit Skill';
            }
        } else {
            document.querySelector('#skillModal .modal-header h2').textContent = 'Add New Skill';
        }

        document.getElementById('skillModal').classList.add('show');
    },

    closeSkillModal() {
        document.getElementById('skillModal').classList.remove('show');
        this.currentEditingSkillId = null;
    },

    async saveSkill() {
        this.showLoadingOverlay('Saving skill...');

        try {
            const skillData = {
                name: document.getElementById('skillName').value,
                level: parseInt(document.getElementById('skillLevel').value),
                category: document.getElementById('skillCategory').value
            };

            if (this.currentEditingSkillId) {
                await DataSyncService.updateSkill(this.currentEditingSkillId, skillData);
                this.showToast('Skill updated successfully!', 'success');
            } else {
                await DataSyncService.addSkill(skillData);
                this.showToast('Skill added successfully!', 'success');
            }

            this.data = await DataSyncService.fetchData(true);
            this.renderSkills();
            this.closeSkillModal();
            this.hideLoadingOverlay();
        } catch (error) {
            this.hideLoadingOverlay();
            this.showToast('Error saving skill: ' + error.message, 'error');
        }
    },

    renderSkills() {
        const skillsList = document.getElementById('skillsList');
        if (!skillsList || !this.data?.skills) return;

        skillsList.innerHTML = '';

        // Group by category
        const categories = [...new Set(this.data.skills.map(s => s.category))];

        categories.forEach(category => {
            const categorySkills = this.data.skills.filter(s => s.category === category);
            const categorySection = document.createElement('div');
            categorySection.style.marginBottom = '30px';

            const categoryTitle = document.createElement('h4');
            categoryTitle.textContent = category;
            categoryTitle.style.cssText = 'margin-bottom: 15px; font-size: 16px; font-weight: 700; color: #6366f1;';
            categorySection.appendChild(categoryTitle);

            categorySkills.forEach(skill => {
                const skillCard = document.createElement('div');
                skillCard.className = 'skill-card';
                skillCard.innerHTML = `
                    <div class="skill-info">
                        <h4>${skill.name}</h4>
                        <div class="skill-category">${category}</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${skill.level}%"></div>
                        </div>
                    </div>
                    <div class="skill-value">${skill.level}%</div>
                    <div style="display: flex; gap: 10px;">
                        <button class="card-btn card-btn-edit" onclick="AdminDashboard.openSkillModal(${skill.id})">Edit</button>
                        <button class="card-btn card-btn-delete" onclick="AdminDashboard.deleteSkill(${skill.id})">Delete</button>
                    </div>
                `;
                categorySection.appendChild(skillCard);
            });

            skillsList.appendChild(categorySection);
        });

        if (this.data.skills.length === 0) {
            skillsList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No skills yet. Add your skills!</p>';
        }
    },

    async deleteSkill(id) {
        if (!confirm('Are you sure you want to delete this skill?')) return;

        this.showLoadingOverlay('Deleting skill...');
        try {
            await DataSyncService.deleteSkill(id);
            this.data = await DataSyncService.fetchData(true);
            this.renderSkills();
            this.hideLoadingOverlay();
            this.showToast('Skill deleted successfully!', 'success');
        } catch (error) {
            this.hideLoadingOverlay();
            this.showToast('Error deleting skill: ' + error.message, 'error');
        }
    },

    // ========================================================================
    // SETTINGS
    // ========================================================================
    
    async saveSettings() {
        this.showLoadingOverlay('Saving settings...');

        try {
            // Get checkbox values
            const settings = {
                enableComments: document.querySelector('input[type="checkbox"]:nth-of-type(1)')?.checked ?? true,
                showContactForm: document.querySelector('input[type="checkbox"]:nth-of-type(2)')?.checked ?? true,
                enableNewsletter: document.querySelector('input[type="checkbox"]:nth-of-type(3)')?.checked ?? true,
                emailNotifications: document.querySelector('input[type="checkbox"]:nth-of-type(4)')?.checked ?? true
            };

            await DataSyncService.updateSettings(settings);
            this.data = await DataSyncService.fetchData(true);
            this.hideLoadingOverlay();
            this.showToast('Settings saved successfully!', 'success');
        } catch (error) {
            this.hideLoadingOverlay();
            this.showToast('Error saving settings: ' + error.message, 'error');
        }
    },

    // ========================================================================
    // BACKUP & IMPORT
    // ========================================================================
    
    async backupData() {
        try {
            await DataSyncService.exportData();
            this.showToast('Backup downloaded successfully!', 'success');
        } catch (error) {
            this.showToast('Error creating backup: ' + error.message, 'error');
        }
    },

    async importData(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                this.showLoadingOverlay('Importing data...');
                await DataSyncService.importData(event.target.result);
                this.data = await DataSyncService.fetchData(true);
                this.refreshUI();
                this.hideLoadingOverlay();
                this.showToast('Data imported successfully!', 'success');
            } catch (error) {
                this.hideLoadingOverlay();
                this.showToast('Error importing data: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    },

    // ========================================================================
    // TOAST NOTIFICATIONS
    // ========================================================================
    
    showToast(message, type = 'success') {
        const toast = document.getElementById('successToast');
        if (!toast) return;

        const icon = toast.querySelector('i');
        const messageEl = document.getElementById('toastMessage');

        // Update icon based on type
        icon.className = type === 'success' ? 'fa fa-check' : 
                         type === 'error' ? 'fa fa-times' : 'fa fa-info';
        
        // Update colors
        toast.style.background = type === 'success' ? '#10b981' :
                                 type === 'error' ? '#ef4444' : '#3b82f6';

        messageEl.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    AdminDashboard.init();
});
