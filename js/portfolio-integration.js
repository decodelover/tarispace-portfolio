// Integration Script for Admin Dashboard with Main Site
// Add this to your main portfolio site (index-2.html) to sync admin changes

(function() {
    'use strict';

    const PortfolioIntegration = {
        // Check for portfolio data from admin
        init() {
            this.loadPortfolioData();
            this.watchForUpdates();
        },

        // Load and apply portfolio data
        loadPortfolioData() {
            const data = localStorage.getItem('portfolioData');
            if (data) {
                try {
                    const portfolioData = JSON.parse(data);
                    this.applyData(portfolioData);
                    console.log('Portfolio data loaded from admin');
                } catch (error) {
                    console.error('Error loading portfolio data:', error);
                }
            }
        },

        // Apply data to main site
        applyData(data) {
            // Apply profile data
            this.updateProfile(data.profile);
            
            // Apply services
            this.updateServices(data.services);
            
            // Apply projects
            this.updateProjects(data.projects);
            
            // Apply blog posts
            this.updateBlog(data.blog);
            
            // Apply skills
            this.updateSkills(data.skills);
            
            // Update statistics
            this.updateStats(data.stats);
        },

        // Update profile section
        updateProfile(profile) {
            if (!profile) return;

            // Update name if exists
            const nameElements = document.querySelectorAll('[data-portfolio="name"]');
            nameElements.forEach(el => {
                el.textContent = profile.fullName;
            });

            // Update title
            const titleElements = document.querySelectorAll('[data-portfolio="title"]');
            titleElements.forEach(el => {
                el.textContent = profile.title;
            });

            // Update bio
            const bioElements = document.querySelectorAll('[data-portfolio="bio"]');
            bioElements.forEach(el => {
                el.textContent = profile.bio;
            });

            // Update contact info
            if (document.querySelector('[data-portfolio="email"]')) {
                document.querySelector('[data-portfolio="email"]').href = `mailto:${profile.email}`;
            }

            if (document.querySelector('[data-portfolio="phone"]')) {
                document.querySelector('[data-portfolio="phone"]').href = `tel:${profile.phone}`;
            }

            // Update social links
            const socials = {
                linkedin: profile.linkedinUrl,
                github: profile.githubUrl,
                twitter: profile.twitterUrl
            };

            Object.entries(socials).forEach(([key, url]) => {
                const element = document.querySelector(`[data-portfolio="social-${key}"]`);
                if (element) {
                    element.href = url;
                }
            });
        },

        // Update services section
        updateServices(services) {
            if (!services || !Array.isArray(services)) return;

            const servicesContainer = document.querySelector('[data-portfolio="services"]');
            if (!servicesContainer) return;

            servicesContainer.innerHTML = '';

            services.forEach(service => {
                const serviceElement = document.createElement('div');
                serviceElement.className = 'service-item';
                serviceElement.innerHTML = `
                    <div class="service-icon">
                        <i class="fa ${service.icon}"></i>
                    </div>
                    <h3>${service.title}</h3>
                    <p>${service.description}</p>
                `;
                servicesContainer.appendChild(serviceElement);
            });
        },

        // Update portfolio/projects section
        updateProjects(projects) {
            if (!projects || !Array.isArray(projects)) return;

            const projectsContainer = document.querySelector('[data-portfolio="projects"]');
            if (!projectsContainer) return;

            projectsContainer.innerHTML = '';

            projects.forEach(project => {
                const projectElement = document.createElement('div');
                projectElement.className = 'project-item';
                projectElement.innerHTML = `
                    <div class="project-card">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <div class="project-tech">${project.tech}</div>
                        ${project.link ? `<a href="${project.link}" class="project-link">View Project</a>` : ''}
                    </div>
                `;
                projectsContainer.appendChild(projectElement);
            });
        },

        // Update blog posts
        updateBlog(blogPosts) {
            if (!blogPosts || !Array.isArray(blogPosts)) return;

            const blogContainer = document.querySelector('[data-portfolio="blog"]');
            if (!blogContainer) return;

            blogContainer.innerHTML = '';

            blogPosts.forEach(post => {
                const blogElement = document.createElement('div');
                blogElement.className = 'blog-post';
                blogElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <div class="post-meta">
                        <span>${post.date}</span>
                        <span>${post.category}</span>
                    </div>
                    <p>${post.content.substring(0, 150)}...</p>
                    <div class="post-tags">
                        ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                `;
                blogContainer.appendChild(blogElement);
            });
        },

        // Update skills section
        updateSkills(skills) {
            if (!skills || !Array.isArray(skills)) return;

            const skillsContainer = document.querySelector('[data-portfolio="skills"]');
            if (!skillsContainer) return;

            skillsContainer.innerHTML = '';

            // Group by category
            const grouped = {};
            skills.forEach(skill => {
                if (!grouped[skill.category]) {
                    grouped[skill.category] = [];
                }
                grouped[skill.category].push(skill);
            });

            Object.entries(grouped).forEach(([category, categorySkills]) => {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'skill-category';
                categoryDiv.innerHTML = `<h4>${category}</h4>`;

                categorySkills.forEach(skill => {
                    const skillElement = document.createElement('div');
                    skillElement.className = 'skill-item';
                    skillElement.innerHTML = `
                        <div class="skill-name">${skill.name}</div>
                        <div class="skill-bar">
                            <div class="skill-progress" style="width: ${skill.level}%"></div>
                        </div>
                        <div class="skill-level">${skill.level}%</div>
                    `;
                    categoryDiv.appendChild(skillElement);
                });

                skillsContainer.appendChild(categoryDiv);
            });
        },

        // Update statistics
        updateStats(stats) {
            if (!stats) return;

            const statSelectors = {
                visits: '[data-portfolio="stat-visits"]',
                messages: '[data-portfolio="stat-messages"]',
                projects: '[data-portfolio="stat-projects"]',
                blogs: '[data-portfolio="stat-blogs"]'
            };

            Object.entries(statSelectors).forEach(([key, selector]) => {
                const element = document.querySelector(selector);
                if (element && stats[key]) {
                    element.textContent = stats[key];
                }
            });
        },

        // Watch for updates from admin panel
        watchForUpdates() {
            // Check for updates every 5 seconds
            setInterval(() => {
                this.loadPortfolioData();
            }, 5000);

            // Listen for storage changes (when admin updates from another tab)
            window.addEventListener('storage', (event) => {
                if (event.key === 'portfolioData') {
                    this.loadPortfolioData();
                }
            });
        }
    };

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        PortfolioIntegration.init();
    });

    // Export for use in other scripts
    window.PortfolioIntegration = PortfolioIntegration;
})();
