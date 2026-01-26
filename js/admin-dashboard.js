// Admin Dashboard JavaScript
// Data storage (in production, this would be a backend database)
const AdminDashboard = {
    // Initialize data structures
    data: {
        profile: {
            fullName: 'Tari Pereowei',
            title: 'Full Stack Developer',
            bio: 'Experienced full stack developer with passion for creating modern web solutions.',
            email: 'tari@example.com',
            phone: '+1 (555) 123-4567',
            location: 'Lagos, Nigeria',
            experience: 5,
            linkedinUrl: 'https://linkedin.com/in/tari',
            githubUrl: 'https://github.com/tari',
            twitterUrl: 'https://twitter.com/tari'
        },
        services: [
            {
                id: 1,
                title: 'Web Development',
                description: 'Full-stack web development using modern frameworks and technologies.',
                icon: 'fa-code'
            },
            {
                id: 2,
                title: 'UI/UX Design',
                description: 'Creating beautiful and user-friendly interface designs.',
                icon: 'fa-paint-brush'
            },
            {
                id: 3,
                title: 'Mobile Development',
                description: 'Native and cross-platform mobile app development.',
                icon: 'fa-mobile'
            }
        ],
        projects: [
            {
                id: 1,
                title: 'E-Commerce Platform',
                description: 'A full-featured e-commerce platform with payment integration.',
                tech: 'React, Node.js, MongoDB',
                link: 'https://example.com'
            },
            {
                id: 2,
                title: 'Project Management Tool',
                description: 'Collaborative project management application.',
                tech: 'Vue.js, Express, PostgreSQL',
                link: 'https://example.com'
            }
        ],
        blog: [
            {
                id: 1,
                title: 'Out of the Smoke: The Story Behind the Code',
                content: 'A powerful personal narrative about overcoming adversity, from street life to full-stack development. The journey that shaped Tarispace and the philosophy behind every project I build.',
                author: 'Tari Godsproperty Pereowei',
                category: 'Personal Story',
                tags: ['personal journey', 'full stack dev', 'inspiration', 'entrepreneurship', 'web development'],
                date: '2025-01-25',
                image: 'img/blog/1.jpg',
                link: 'article-out-of-smoke.html',
                readTime: '12 min read',
                featured: true
            },
            {
                id: 2,
                title: 'The Dangers of Not Following Latest Trends',
                content: 'Why staying oblivious to technological evolution is sabotaging your career. The price of ignoring trends, the compounding effects of stagnation, and how to stay relevant in a fast-moving tech landscape.',
                author: 'Tari Godsproperty Pereowei',
                category: 'Career Insights',
                tags: ['tech trends', 'career growth', 'evolution', 'professional development'],
                date: '2026-01-27',
                image: 'img/blog/2.jpg',
                link: 'article-dangers-not-following-trends.html',
                readTime: '8 min read',
                featured: false
            },
            {
                id: 3,
                title: 'The Importance of Having a Digital Skill',
                content: 'In a world moving digital, having at least one digital skill is no longer optional—it\'s survival. Discover the freedom, leverage, and opportunity that comes with mastering a digital skill.',
                author: 'Tari Godsproperty Pereowei',
                category: 'Skills',
                tags: ['digital skills', 'education', 'opportunity', 'career', 'future'],
                date: '2026-01-27',
                image: 'img/blog/3.jpg',
                link: 'article-importance-digital-skills.html',
                readTime: '9 min read',
                featured: false
            },
            {
                id: 4,
                title: 'Programming Problem-Solving Applies to Real Life',
                content: 'The skills you develop debugging code translate directly to solving problems in your everyday life. Learn how systematic thinking becomes your superpower.',
                author: 'Tari Godsproperty Pereowei',
                category: 'Mindset',
                tags: ['problem-solving', 'programming', 'mindset', 'growth', 'systems thinking'],
                date: '2026-02-10',
                image: 'img/blog/4.jpg',
                link: 'article-programming-solves-real-life.html',
                readTime: '10 min read',
                featured: false
            },
            {
                id: 5,
                title: 'From Failure to Success: Why Your First Project Doesn\'t Define Your Career',
                content: 'Your first project will likely fail. That\'s not the end—it\'s the beginning. Learn why failure is the best teacher and how it leads to extraordinary success.',
                author: 'Tari Godsproperty Pereowei',
                category: 'Resilience',
                tags: ['failure', 'resilience', 'success', 'mindset', 'growth'],
                date: '2026-02-28',
                image: 'img/blog/5.jpg',
                link: 'article-failure-to-success.html',
                readTime: '9 min read',
                featured: false
            },
            {
                id: 6,
                title: 'Building Software, Building Character: What Code Teaches You',
                content: 'Code teaches you discipline, integrity, and patience. Learn how building software builds character and makes you a better human being.',
                author: 'Tari Godsproperty Pereowei',
                category: 'Philosophy',
                tags: ['character', 'code', 'philosophy', 'discipline', 'integrity'],
                date: '2026-03-15',
                image: 'img/blog/6.jpg',
                link: 'article-building-character.html',
                readTime: '10 min read',
                featured: false
            }
        ],
        messages: [
            {
                id: 1,
                from: 'John Doe',
                email: 'john@example.com',
                message: 'I am interested in your web development services for my startup project.',
                time: '2025-12-20 14:30'
            },
            {
                id: 2,
                from: 'Jane Smith',
                email: 'jane@example.com',
                message: 'Great portfolio! Can we discuss potential collaboration?',
                time: '2025-12-20 12:15'
            }
        ],
        skills: [
            {
                id: 1,
                name: 'React.js',
                level: 95,
                category: 'Frontend'
            },
            {
                id: 2,
                name: 'JavaScript',
                level: 98,
                category: 'Frontend'
            },
            {
                id: 3,
                name: 'Node.js',
                level: 90,
                category: 'Backend'
            },
            {
                id: 4,
                name: 'MongoDB',
                level: 85,
                category: 'Database'
            }
        ],
        stats: {
            visits: 1245,
            messages: 28,
            projects: 12,
            blogs: 8
        }
    },

    // Initialize the dashboard
    init() {
        // Load from localStorage if available, otherwise use default data
        this.loadFromStorage();
        
        this.setupEventListeners();
        this.loadDashboard();
        this.initCharts();
        this.renderServices();
        this.renderProjects();
        this.renderBlog();
        this.renderMessages();
        this.renderSkills();
    },

    // Setup event listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Menu toggle for mobile
        document.getElementById('menuToggle').addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('active');
        });

        // User profile button click
        const userProfileBtn = document.getElementById('userProfileBtn');
        if (userProfileBtn) {
            userProfileBtn.addEventListener('click', () => {
                document.querySelectorAll('.nav-link').forEach(link => {
                    if (link.getAttribute('data-section') === 'profile') {
                        link.click();
                    }
                });
                // Close sidebar on mobile after click
                document.querySelector('.sidebar').classList.remove('active');
            });
        }

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                // In production, this would clear session/auth data
                this.showToast('Logged out successfully');
                setTimeout(() => {
                    window.location.href = 'index-2.html';
                }, 1500);
            }
        });

        // Profile section
        document.getElementById('changePhotoBtn').addEventListener('click', () => {
            document.getElementById('photoInput').click();
        });

        document.getElementById('photoInput').addEventListener('change', (e) => {
            this.handlePhotoUpload(e);
        });

        document.getElementById('saveProfileBtn').addEventListener('click', () => {
            this.saveProfile();
        });

        document.getElementById('cancelProfileBtn').addEventListener('click', () => {
            this.loadProfileForm();
        });

        // Services
        document.getElementById('addServiceBtn').addEventListener('click', () => {
            this.openServiceModal();
        });

        document.getElementById('serviceForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveService();
        });

        document.getElementById('cancelServiceBtn').addEventListener('click', () => {
            this.closeServiceModal();
        });

        document.getElementById('closeServiceModal').addEventListener('click', () => {
            this.closeServiceModal();
        });

        // Projects
        document.getElementById('addProjectBtn').addEventListener('click', () => {
            this.openProjectModal();
        });

        document.getElementById('projectForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProject();
        });

        document.getElementById('cancelProjectBtn').addEventListener('click', () => {
            this.closeProjectModal();
        });

        document.getElementById('closeProjectModal').addEventListener('click', () => {
            this.closeProjectModal();
        });

        document.getElementById('projectImage').addEventListener('change', (e) => {
            this.handleProjectImagePreview(e);
        });

        // Blog
        document.getElementById('addBlogBtn').addEventListener('click', () => {
            this.openBlogModal();
        });

        document.getElementById('blogForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveBlog();
        });

        document.getElementById('cancelBlogBtn').addEventListener('click', () => {
            this.closeBlogModal();
        });

        document.getElementById('closeBlogModal').addEventListener('click', () => {
            this.closeBlogModal();
        });

        // Messages
        document.getElementById('clearMessagesBtn').addEventListener('click', () => {
            if (confirm('Clear all messages?')) {
                this.data.messages = [];
                this.renderMessages();
                this.showToast('All messages cleared');
            }
        });

        // Skills
        document.getElementById('addSkillBtn').addEventListener('click', () => {
            this.openSkillModal();
        });

        document.getElementById('skillLevel').addEventListener('input', (e) => {
            document.getElementById('skillLevelValue').textContent = e.target.value + '%';
        });

        document.getElementById('skillForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSkill();
        });

        document.getElementById('cancelSkillBtn').addEventListener('click', () => {
            this.closeSkillModal();
        });

        document.getElementById('closeSkillModal').addEventListener('click', () => {
            this.closeSkillModal();
        });

        // Settings
        document.getElementById('saveSaveSettingsBtn').addEventListener('click', () => {
            this.showToast('Settings saved successfully');
        });

        document.getElementById('changePasswordBtn').addEventListener('click', () => {
            this.showToast('Password change feature coming soon');
        });

        document.getElementById('backupDataBtn').addEventListener('click', () => {
            this.backupData();
        });

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('show');
            }
        });
    },

    // Navigation handler
    handleNavigation(e) {
        e.preventDefault();
        const section = e.target.closest('.nav-link').dataset.section;
        
        // Update active states
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        e.target.closest('.nav-link').classList.add('active');

        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        const sectionElement = document.getElementById(`${section}-section`);
        if (sectionElement) {
            sectionElement.classList.add('active');
            document.getElementById('pageTitle').textContent = 
                section.charAt(0).toUpperCase() + section.slice(1);
        }

        // Close sidebar on mobile
        document.querySelector('.sidebar').classList.remove('active');
    },

    // Dashboard functions
    loadFromStorage() {
        try {
            const stored = localStorage.getItem('portfolioData');
            if (stored) {
                const parsedData = JSON.parse(stored);
                // If blog array is empty or doesn't exist, reload defaults
                if (!parsedData.blog || parsedData.blog.length === 0) {
                    console.log('Blog data empty, resetting...');
                    this.resetData();
                } else {
                    this.data = parsedData;
                }
            }
        } catch (e) {
            console.log('localStorage corrupted, using defaults');
            this.resetData();
        }
    },

    loadDashboard() {
        document.getElementById('visitCount').textContent = this.data.stats.visits.toLocaleString();
        document.getElementById('messageCount').textContent = this.data.stats.messages;
        document.getElementById('projectCount').textContent = this.data.stats.projects;
        document.getElementById('blogCount').textContent = this.data.stats.blogs;
    },

    initCharts() {
        // Visitor Chart
        const visitorCtx = document.getElementById('visitorChart').getContext('2d');
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
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        border: { display: false },
                        grid: { color: 'rgba(0, 0, 0, 0.05)' }
                    },
                    x: {
                        border: { display: false },
                        grid: { display: false }
                    }
                }
            }
        });

        // Traffic Chart
        const trafficCtx = document.getElementById('trafficChart').getContext('2d');
        new Chart(trafficCtx, {
            type: 'doughnut',
            data: {
                labels: ['Direct', 'Google', 'Social', 'Referral'],
                datasets: [{
                    data: [35, 25, 25, 15],
                    backgroundColor: [
                        '#6366f1',
                        '#10b981',
                        '#f59e0b',
                        '#3b82f6'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    },

    // Profile functions
    loadProfileForm() {
        const profile = this.data.profile;
        document.getElementById('fullName').value = profile.fullName;
        document.getElementById('title').value = profile.title;
        document.getElementById('bio').value = profile.bio;
        document.getElementById('email').value = profile.email;
        document.getElementById('phone').value = profile.phone;
        document.getElementById('location').value = profile.location;
        document.getElementById('experience').value = profile.experience;
        document.getElementById('linkedinUrl').value = profile.linkedinUrl;
        document.getElementById('githubUrl').value = profile.githubUrl;
        document.getElementById('twitterUrl').value = profile.twitterUrl;
    },

    saveProfile() {
        this.data.profile = {
            fullName: document.getElementById('fullName').value,
            title: document.getElementById('title').value,
            bio: document.getElementById('bio').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            location: document.getElementById('location').value,
            experience: parseInt(document.getElementById('experience').value),
            linkedinUrl: document.getElementById('linkedinUrl').value,
            githubUrl: document.getElementById('githubUrl').value,
            twitterUrl: document.getElementById('twitterUrl').value
        };

        this.showToast('Profile updated successfully!');
        this.syncToMainSite();
    },

    handlePhotoUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                document.querySelector('.profile-image').src = event.target.result;
                this.showToast('Photo updated successfully!');
            };
            reader.readAsDataURL(file);
        }
    },

    // Service functions
    openServiceModal() {
        document.getElementById('serviceForm').reset();
        document.querySelector('#serviceModal .modal-header h2').textContent = 'Add New Service';
        document.getElementById('serviceModal').classList.add('show');
    },

    closeServiceModal() {
        document.getElementById('serviceModal').classList.remove('show');
    },

    saveService() {
        const newService = {
            id: this.data.services.length + 1,
            title: document.getElementById('serviceTitle').value,
            description: document.getElementById('serviceDesc').value,
            icon: document.getElementById('serviceIcon').value
        };

        this.data.services.push(newService);
        this.renderServices();
        this.closeServiceModal();
        this.showToast('Service added successfully!');
        this.syncToMainSite();
    },

    renderServices() {
        const servicesList = document.getElementById('servicesList');
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
                        <button class="card-btn card-btn-edit" onclick="AdminDashboard.editService(${service.id})">Edit</button>
                        <button class="card-btn card-btn-delete" onclick="AdminDashboard.deleteService(${service.id})">Delete</button>
                    </div>
                </div>
            `;
            servicesList.appendChild(serviceCard);
        });
    },

    editService(id) {
        const service = this.data.services.find(s => s.id === id);
        if (service) {
            document.getElementById('serviceTitle').value = service.title;
            document.getElementById('serviceDesc').value = service.description;
            document.getElementById('serviceIcon').value = service.icon;
            document.querySelector('#serviceModal .modal-header h2').textContent = 'Edit Service';
            document.getElementById('serviceModal').classList.add('show');
            // For simplicity, we'll delete and re-add. In production, track edit mode
            this.deleteService(id);
        }
    },

    deleteService(id) {
        this.data.services = this.data.services.filter(s => s.id !== id);
        this.renderServices();
        this.showToast('Service deleted');
        this.syncToMainSite();
    },

    // Project functions
    openProjectModal() {
        document.getElementById('projectForm').reset();
        document.getElementById('projectImagePreview').style.display = 'none';
        document.querySelector('#projectModal .modal-header h2').textContent = 'Add New Project';
        document.getElementById('projectModal').classList.add('show');
    },

    closeProjectModal() {
        document.getElementById('projectModal').classList.remove('show');
    },

    handleProjectImagePreview(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const preview = document.getElementById('projectImagePreview');
                preview.src = event.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    },

    saveProject() {
        const newProject = {
            id: this.data.projects.length + 1,
            title: document.getElementById('projectTitle').value,
            description: document.getElementById('projectDesc').value,
            tech: document.getElementById('projectTech').value,
            link: document.getElementById('projectLink').value
        };

        this.data.projects.push(newProject);
        this.renderProjects();
        this.closeProjectModal();
        this.showToast('Project added successfully!');
        this.data.stats.projects++;
        document.getElementById('projectCount').textContent = this.data.stats.projects;
        this.syncToMainSite();
    },

    renderProjects() {
        const projectsList = document.getElementById('projectsList');
        projectsList.innerHTML = '';

        this.data.projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <img src="img/portfolio/placeholder.jpg" alt="${project.title}" class="project-image">
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-meta">
                        <span><i class="fa fa-code"></i> ${project.tech}</span>
                        <span><i class="fa fa-link"></i> <a href="${project.link}" target="_blank">View Project</a></span>
                    </div>
                    <div class="card-actions">
                        <button class="card-btn card-btn-edit" onclick="AdminDashboard.editProject(${project.id})">Edit</button>
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

    editProject(id) {
        const project = this.data.projects.find(p => p.id === id);
        if (project) {
            document.getElementById('projectTitle').value = project.title;
            document.getElementById('projectDesc').value = project.description;
            document.getElementById('projectTech').value = project.tech;
            document.getElementById('projectLink').value = project.link;
            document.querySelector('#projectModal .modal-header h2').textContent = 'Edit Project';
            document.getElementById('projectModal').classList.add('show');
            this.deleteProject(id);
        }
    },

    deleteProject(id) {
        this.data.projects = this.data.projects.filter(p => p.id !== id);
        this.renderProjects();
        this.data.stats.projects--;
        document.getElementById('projectCount').textContent = this.data.stats.projects;
        this.showToast('Project deleted');
        this.syncToMainSite();
    },

    // Blog functions
    openBlogModal() {
        document.getElementById('blogForm').reset();
        document.querySelector('#blogModal .modal-header h2').textContent = 'Write New Post';
        document.getElementById('blogModal').classList.add('show');
    },

    closeBlogModal() {
        document.getElementById('blogModal').classList.remove('show');
    },

    saveBlog() {
        const newBlog = {
            id: this.data.blog.length + 1,
            title: document.getElementById('blogTitle').value,
            content: document.getElementById('blogContent').value,
            category: document.getElementById('blogCategory').value,
            tags: document.getElementById('blogTags').value.split(',').map(tag => tag.trim()),
            date: new Date().toISOString().split('T')[0]
        };

        this.data.blog.push(newBlog);
        this.renderBlog();
        this.closeBlogModal();
        this.showToast('Blog post published successfully!');
        this.data.stats.blogs++;
        document.getElementById('blogCount').textContent = this.data.stats.blogs;
        this.syncToMainSite();
    },

    renderBlog() {
        const blogList = document.getElementById('blogList');
        blogList.innerHTML = '';

        this.data.blog.forEach(post => {
            const blogCard = document.createElement('div');
            blogCard.className = 'blog-card';
            blogCard.innerHTML = `
                <h3>${post.title}</h3>
                <div class="blog-meta">
                    <span><i class="fa fa-calendar"></i> ${post.date}</span>
                    <span><i class="fa fa-folder"></i> ${post.category}</span>
                    <span><i class="fa fa-tags"></i> ${post.tags.join(', ')}</span>
                </div>
                <p class="blog-preview">${post.content.substring(0, 150)}...</p>
                <div class="card-actions">
                    <button class="card-btn card-btn-edit" onclick="AdminDashboard.editBlog(${post.id})">Edit</button>
                    <button class="card-btn card-btn-delete" onclick="AdminDashboard.deleteBlog(${post.id})">Delete</button>
                </div>
            `;
            blogList.appendChild(blogCard);
        });

        if (this.data.blog.length === 0) {
            blogList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No blog posts yet. Start writing!</p>';
        }
    },

    editBlog(id) {
        const post = this.data.blog.find(p => p.id === id);
        if (post) {
            document.getElementById('blogTitle').value = post.title;
            document.getElementById('blogContent').value = post.content;
            document.getElementById('blogCategory').value = post.category;
            document.getElementById('blogTags').value = post.tags.join(', ');
            document.querySelector('#blogModal .modal-header h2').textContent = 'Edit Post';
            document.getElementById('blogModal').classList.add('show');
            this.deleteBlog(id);
        }
    },

    deleteBlog(id) {
        this.data.blog = this.data.blog.filter(b => b.id !== id);
        this.renderBlog();
        this.data.stats.blogs--;
        document.getElementById('blogCount').textContent = this.data.stats.blogs;
        this.showToast('Blog post deleted');
        this.syncToMainSite();
    },

    resetData() {
        // Clear localStorage
        localStorage.removeItem('portfolioData');
        
        // Reset data to default structure with all 6 blog articles
        this.data = {
            profile: {
                fullName: 'Tari Pereowei',
                title: 'Full Stack Developer',
                bio: 'Experienced full stack developer with passion for creating modern web solutions.',
                email: 'tari@example.com',
                phone: '+1 (555) 123-4567',
                location: 'Lagos, Nigeria',
                experience: 5,
                linkedinUrl: 'https://linkedin.com/in/tari',
                githubUrl: 'https://github.com/tari',
                twitterUrl: 'https://twitter.com/tari'
            },
            services: [
                { id: 1, title: 'Web Development', description: 'Full-stack web development using modern frameworks and technologies.', icon: 'fa-code' },
                { id: 2, title: 'UI/UX Design', description: 'Creating beautiful and user-friendly interface designs.', icon: 'fa-paint-brush' },
                { id: 3, title: 'Mobile Development', description: 'Native and cross-platform mobile app development.', icon: 'fa-mobile' }
            ],
            projects: [
                { id: 1, title: 'E-Commerce Platform', description: 'A full-featured e-commerce platform with payment integration.', tech: 'React, Node.js, MongoDB', link: 'https://example.com' },
                { id: 2, title: 'Project Management Tool', description: 'Collaborative project management application.', tech: 'Vue.js, Express, PostgreSQL', link: 'https://example.com' }
            ],
            blog: [
                { id: 1, title: 'Out of the Smoke: The Story Behind the Code', content: 'A powerful personal narrative about overcoming adversity, from street life to full-stack development. The journey that shaped Tarispace and the philosophy behind every project I build.', author: 'Tari Godsproperty Pereowei', category: 'Personal Story', tags: ['personal journey', 'full stack dev', 'inspiration', 'entrepreneurship', 'web development'], date: '2025-01-25', image: 'img/blog/1.jpg', link: 'article-out-of-smoke.html', readTime: '12 min read', featured: true },
                { id: 2, title: 'The Dangers of Not Following Latest Trends', content: 'Why staying oblivious to technological evolution is sabotaging your career. The price of ignoring trends, the compounding effects of stagnation, and how to stay relevant in a fast-moving tech landscape.', author: 'Tari Godsproperty Pereowei', category: 'Career Insights', tags: ['tech trends', 'career growth', 'evolution', 'professional development'], date: '2026-01-27', image: 'img/blog/2.jpg', link: 'article-dangers-not-following-trends.html', readTime: '8 min read', featured: false },
                { id: 3, title: 'The Importance of Having a Digital Skill', content: 'In a world moving digital, having at least one digital skill is no longer optional—it\'s survival. Discover the freedom, leverage, and opportunity that comes with mastering a digital skill.', author: 'Tari Godsproperty Pereowei', category: 'Skills', tags: ['digital skills', 'education', 'opportunity', 'career', 'future'], date: '2026-01-27', image: 'img/blog/3.jpg', link: 'article-importance-digital-skills.html', readTime: '9 min read', featured: false },
                { id: 4, title: 'Programming Problem-Solving Applies to Real Life', content: 'The skills you develop debugging code translate directly to solving problems in your everyday life. Learn how systematic thinking becomes your superpower.', author: 'Tari Godsproperty Pereowei', category: 'Mindset', tags: ['problem-solving', 'programming', 'mindset', 'growth', 'systems thinking'], date: '2026-02-10', image: 'img/blog/4.jpg', link: 'article-programming-solves-real-life.html', readTime: '10 min read', featured: false },
                { id: 5, title: 'From Failure to Success: Why Your First Project Doesn\'t Define Your Career', content: 'Your first project will likely fail. That\'s not the end—it\'s the beginning. Learn why failure is the best teacher and how it leads to extraordinary success.', author: 'Tari Godsproperty Pereowei', category: 'Resilience', tags: ['failure', 'resilience', 'success', 'mindset', 'growth'], date: '2026-02-28', image: 'img/blog/5.jpg', link: 'article-failure-to-success.html', readTime: '9 min read', featured: false },
                { id: 6, title: 'Building Software, Building Character: What Code Teaches You', content: 'Code teaches you discipline, integrity, and patience. Learn how building software builds character and makes you a better human being.', author: 'Tari Godsproperty Pereowei', category: 'Philosophy', tags: ['character', 'code', 'philosophy', 'discipline', 'integrity'], date: '2026-03-15', image: 'img/blog/6.jpg', link: 'article-building-character.html', readTime: '10 min read', featured: false }
            ],
            messages: [],
            skills: [
                { id: 1, name: 'React.js', level: 95, category: 'Frontend' },
                { id: 2, name: 'JavaScript', level: 98, category: 'Frontend' },
                { id: 3, name: 'Node.js', level: 90, category: 'Backend' },
                { id: 4, name: 'MongoDB', level: 85, category: 'Database' }
            ],
            stats: { visits: 1245, messages: 0, projects: 12, blogs: 6 }
        };
        
        // Save to localStorage
        localStorage.setItem('portfolioData', JSON.stringify(this.data));
        
        // Show success message and reload
        this.showToast('Data reset successfully! Reloading...');
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    },

    syncAllBlogsToCloud() {
        const btn = document.getElementById('syncCloudBtn');
        if (btn) btn.disabled = true;

        this.showToast('Syncing 6 blogs to JSONbin cloud...');

        // The 6 blog articles with all metadata
        const blogsToSync = [
            { id: 1, title: 'Out of the Smoke: The Story Behind the Code', content: 'A powerful personal narrative about overcoming adversity, from street life to full-stack development. The journey that shaped Tarispace and the philosophy behind every project I build.', author: 'Tari Godsproperty Pereowei', category: 'Personal Story', tags: ['personal journey', 'full stack dev', 'inspiration', 'entrepreneurship', 'web development'], date: '2025-01-25', image: 'img/blog/1.jpg', link: 'article-out-of-smoke.html', readTime: '12 min read', featured: true },
            { id: 2, title: 'The Dangers of Not Following Latest Trends', content: 'Why staying oblivious to technological evolution is sabotaging your career. The price of ignoring trends, the compounding effects of stagnation, and how to stay relevant in a fast-moving tech landscape.', author: 'Tari Godsproperty Pereowei', category: 'Career Insights', tags: ['tech trends', 'career growth', 'evolution', 'professional development'], date: '2026-01-27', image: 'img/blog/2.jpg', link: 'article-dangers-not-following-trends.html', readTime: '8 min read', featured: false },
            { id: 3, title: 'The Importance of Having a Digital Skill', content: 'In a world moving digital, having at least one digital skill is no longer optional—it\'s survival. Discover the freedom, leverage, and opportunity that comes with mastering a digital skill.', author: 'Tari Godsproperty Pereowei', category: 'Skills', tags: ['digital skills', 'education', 'opportunity', 'career', 'future'], date: '2026-01-27', image: 'img/blog/3.jpg', link: 'article-importance-digital-skills.html', readTime: '9 min read', featured: false },
            { id: 4, title: 'Programming Problem-Solving Applies to Real Life', content: 'The skills you develop debugging code translate directly to solving problems in your everyday life. Learn how systematic thinking becomes your superpower.', author: 'Tari Godsproperty Pereowei', category: 'Mindset', tags: ['problem-solving', 'programming', 'mindset', 'growth', 'systems thinking'], date: '2026-02-10', image: 'img/blog/4.jpg', link: 'article-programming-solves-real-life.html', readTime: '10 min read', featured: false },
            { id: 5, title: 'From Failure to Success: Why Your First Project Doesn\'t Define Your Career', content: 'Your first project will likely fail. That\'s not the end—it\'s the beginning. Learn why failure is the best teacher and how it leads to extraordinary success.', author: 'Tari Godsproperty Pereowei', category: 'Resilience', tags: ['failure', 'resilience', 'success', 'mindset', 'growth'], date: '2026-02-28', image: 'img/blog/5.jpg', link: 'article-failure-to-success.html', readTime: '9 min read', featured: false },
            { id: 6, title: 'Building Software, Building Character: What Code Teaches You', content: 'Code teaches you discipline, integrity, and patience. Learn how building software builds character and makes you a better human being.', author: 'Tari Godsproperty Pereowei', category: 'Philosophy', tags: ['character', 'code', 'philosophy', 'discipline', 'integrity'], date: '2026-03-15', image: 'img/blog/6.jpg', link: 'article-building-character.html', readTime: '10 min read', featured: false }
        ];

        // Update local data
        this.data.blog = blogsToSync;
        this.data.stats.blogs = 6;
        localStorage.setItem('portfolioData', JSON.stringify(this.data));
        this.renderBlog();
        document.getElementById('blogCount').textContent = '6';

        // Sync to JSONbin using data-sync-service
        fetch('https://api.jsonbin.io/v3/b/6966ca8cae596e708fda73f6/latest', {
            headers: { 'X-Master-Key': '$2a$10$kF1WW4grArkeQvZEZPwjaOZd7WvGav.EEpEJT8fWwjwWyJOz8Hn9a' }
        })
        .then(r => r.json())
        .then(data => {
            data.record.blog = blogsToSync;
            data.record.stats.blogs = 6;
            data.record.lastUpdated = new Date().toISOString();
            
            return fetch('https://api.jsonbin.io/v3/b/6966ca8cae596e708fda73f6', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': '$2a$10$kF1WW4grArkeQvZEZPwjaOZd7WvGav.EEpEJT8fWwjwWyJOz8Hn9a'
                },
                body: JSON.stringify(data.record)
            });
        })
        .then(r => r.json())
        .then(result => {
            this.showToast('✅ Successfully synced 6 blogs to cloud! Live site will update within 30 seconds.');
            if (btn) btn.disabled = false;
        })
        .catch(err => {
            console.error('Sync error:', err);
            this.showToast('❌ Error syncing to cloud. Check console.');
            if (btn) btn.disabled = false;
        });
    },

    // Messages functions
    renderMessages() {
        const messagesList = document.getElementById('messagesList');
        messagesList.innerHTML = '';

        if (this.data.messages.length === 0) {
            messagesList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No messages</p>';
            return;
        }

        this.data.messages.forEach(message => {
            const messageCard = document.createElement('div');
            messageCard.className = 'message-card';
            messageCard.innerHTML = `
                <div class="message-header">
                    <div>
                        <p class="message-from">${message.from}</p>
                        <p class="message-email">${message.email}</p>
                    </div>
                    <p class="message-time">${message.time}</p>
                </div>
                <p class="message-content">${message.message}</p>
                <div class="message-actions">
                    <button class="msg-btn msg-btn-reply" onclick="AdminDashboard.replyMessage(${message.id})">Reply</button>
                    <button class="msg-btn msg-btn-delete" onclick="AdminDashboard.deleteMessage(${message.id})">Delete</button>
                </div>
            `;
            messagesList.appendChild(messageCard);
        });

        // Update message count
        document.getElementById('messageCount').textContent = this.data.messages.length;
    },

    deleteMessage(id) {
        this.data.messages = this.data.messages.filter(m => m.id !== id);
        this.renderMessages();
        this.showToast('Message deleted');
    },

    replyMessage(id) {
        const message = this.data.messages.find(m => m.id === id);
        if (message) {
            this.showToast(`Reply feature: Compose email to ${message.email}`);
        }
    },

    // Skills functions
    openSkillModal() {
        document.getElementById('skillForm').reset();
        document.getElementById('skillLevelValue').textContent = '70%';
        document.getElementById('skillLevel').value = 70;
        document.querySelector('#skillModal .modal-header h2').textContent = 'Add New Skill';
        document.getElementById('skillModal').classList.add('show');
    },

    closeSkillModal() {
        document.getElementById('skillModal').classList.remove('show');
    },

    saveSkill() {
        const newSkill = {
            id: this.data.skills.length + 1,
            name: document.getElementById('skillName').value,
            level: parseInt(document.getElementById('skillLevel').value),
            category: document.getElementById('skillCategory').value
        };

        this.data.skills.push(newSkill);
        this.renderSkills();
        this.closeSkillModal();
        this.showToast('Skill added successfully!');
        this.syncToMainSite();
    },

    renderSkills() {
        const skillsList = document.getElementById('skillsList');
        skillsList.innerHTML = '';

        // Group skills by category
        const categories = [...new Set(this.data.skills.map(s => s.category))];

        categories.forEach(category => {
            const categorySkills = this.data.skills.filter(s => s.category === category);
            const categorySection = document.createElement('div');
            categorySection.style.marginBottom = '30px';

            const categoryTitle = document.createElement('h4');
            categoryTitle.textContent = category;
            categoryTitle.style.marginBottom = '15px';
            categoryTitle.style.fontSize = '16px';
            categoryTitle.style.fontWeight = '700';
            categoryTitle.style.color = '#6366f1';
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
                        <button class="card-btn card-btn-edit" onclick="AdminDashboard.editSkill(${skill.id})">Edit</button>
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

    editSkill(id) {
        const skill = this.data.skills.find(s => s.id === id);
        if (skill) {
            document.getElementById('skillName').value = skill.name;
            document.getElementById('skillLevel').value = skill.level;
            document.getElementById('skillLevelValue').textContent = skill.level + '%';
            document.getElementById('skillCategory').value = skill.category;
            document.querySelector('#skillModal .modal-header h2').textContent = 'Edit Skill';
            document.getElementById('skillModal').classList.add('show');
            this.deleteSkill(id);
        }
    },

    deleteSkill(id) {
        this.data.skills = this.data.skills.filter(s => s.id !== id);
        this.renderSkills();
        this.showToast('Skill deleted');
        this.syncToMainSite();
    },

    // Toast notification
    showToast(message) {
        const toast = document.getElementById('successToast');
        document.getElementById('toastMessage').textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    },

    // Sync data to main site
    syncToMainSite() {
        // Store data in localStorage for demo purposes
        localStorage.setItem('portfolioData', JSON.stringify(this.data));
        
        // Dispatch custom event to trigger immediate updates
        const event = new Event('portfolioDataUpdated');
        window.dispatchEvent(event);
        
        // Also notify other tabs
        localStorage.setItem('portfolioDataUpdate', Date.now().toString());
        
        console.log('✅ Data synced to main site:', this.data);
        // In production, this would send data to backend via API
    },

    // Backup data
    backupData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        this.showToast('Data backed up successfully!');
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    AdminDashboard.init();
});
