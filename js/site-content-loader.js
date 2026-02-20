/**
 * Site Content Loader for Tarispace Portfolio
 * 
 * This script loads dynamic content from the cloud storage (or localStorage)
 * and updates the main site (index.html) with the latest data from the admin dashboard.
 * 
 * It also handles:
 * - Contact form submissions (saves to cloud storage)
 * - Newsletter subscriptions
 * - Visit tracking
 * - Real-time content updates
 */

const SiteContentLoader = {
    data: null,
    isLoaded: false,
    isInitializing: false,

    // ========================================================================
    // INITIALIZATION
    // ========================================================================
    
    async init() {
        if (this.isLoaded || this.isInitializing) return;
        this.isInitializing = true;
        console.log('🚀 SiteContentLoader: Initializing...');
        
        try {
            // Initialize the sync service
            await DataSyncService.init();
            
            // Load data
            this.data = await DataSyncService.fetchData();
            this.isLoaded = true;
            
            // Update page content
            this.updateProfile();
            this.updateAbout();
            this.updateServices();
            this.updatePortfolio();
            this.updateBlog();
            this.updateSkills();
            this.updateContact();
            
            // Setup form handlers
            this.setupContactForm();
            this.setupNewsletterForm();
            
            // Track visit
            this.trackVisit();
            
            // Listen for real-time updates
            this.setupRealtimeUpdates();
            
            console.log('✅ SiteContentLoader: Ready!');
            
        } catch (error) {
            console.error('❌ SiteContentLoader: Error initializing', error);
            // Site will still work with static content
        } finally {
            this.isInitializing = false;
        }
    },

    setupRealtimeUpdates() {
        // Listen for localStorage changes (from admin in another tab)
        window.addEventListener('storage', (e) => {
            if (e.key === 'portfolioDataUpdate' || e.key === 'portfolioData') {
                console.log('📡 Received data update, refreshing content...');
                this.refreshContent();
            }
        });

        // Refresh content more frequently (every 30 seconds) for faster updates
        setInterval(() => this.refreshContent(), 30000);
        
        // Also listen for custom events from the same tab
        window.addEventListener('portfolioDataUpdated', () => {
            console.log('📡 Portfolio data updated event received');
            this.refreshContent();
        });
    },

    async refreshContent() {
        try {
            // Force refresh from cloud storage
            this.data = await DataSyncService.fetchData(true);
            this.updateProfile();
            this.updateAbout();
            this.updateServices();
            this.updatePortfolio();
            this.updateBlog();
            this.updateSkills();
            console.log('✅ Content refreshed successfully');
        } catch (error) {
            console.error('Error refreshing content:', error);
        }
    },

    // ========================================================================
    // PROFILE / HERO SECTION
    // ========================================================================
    
    updateProfile() {
        if (!this.data?.profile) return;
        
        const profile = this.data.profile;
        
        // Update hero section
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.innerHTML = `Hello, I'm <span class="gradient-text">${profile.fullName || 'Tari Pereowei'}</span>`;
        }
        
        // Update hero description
        const heroDesc = document.querySelector('.hero-description');
        if (heroDesc) {
            heroDesc.textContent = profile.bio?.split('.')[0] + '.' || heroDesc.textContent;
        }
        
        // Update profile images
        if (profile.profileImage) {
            document.querySelectorAll('.profile-img, .myphoto img').forEach(img => {
                img.src = profile.profileImage;
            });
        }
        
        // Update social links
        this.updateSocialLinks(profile);
    },

    updateSocialLinks(profile) {
        // Facebook
        document.querySelectorAll('a[href*="facebook"]').forEach(link => {
            if (profile.facebookUrl) link.href = profile.facebookUrl;
        });
        
        // Twitter
        document.querySelectorAll('a[href*="twitter"]').forEach(link => {
            if (profile.twitterUrl) link.href = profile.twitterUrl;
        });
        
        // LinkedIn
        document.querySelectorAll('a[href*="linkedin"]').forEach(link => {
            if (profile.linkedinUrl) link.href = profile.linkedinUrl;
        });
        
        // GitHub
        document.querySelectorAll('a[href*="github"]').forEach(link => {
            if (profile.githubUrl) link.href = profile.githubUrl;
        });
        
        // WhatsApp
        document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
            if (profile.whatsappNumber) {
                link.href = `https://wa.me/${profile.whatsappNumber.replace(/\D/g, '')}`;
            }
        });
        
        // Email links
        document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
            if (profile.email) link.href = `mailto:${profile.email}`;
        });
        
        // Phone links
        document.querySelectorAll('a[href^="tel:"]').forEach(link => {
            if (profile.phone) link.href = `tel:${profile.phone.replace(/\s/g, '')}`;
        });
    },

    // ========================================================================
    // ABOUT SECTION
    // ========================================================================
    
    updateAbout() {
        if (!this.data?.profile) return;
        
        const profile = this.data.profile;
        
        // Update about image
        if (profile.aboutImage) {
            const aboutImg = document.querySelector('.about-img, .con-about img');
            if (aboutImg) aboutImg.src = profile.aboutImage;
        }
        
        // Update about text
        const aboutParagraphs = document.querySelectorAll('.about-paragraph');
        if (aboutParagraphs.length > 0 && profile.bio) {
            const sentences = profile.bio.split('. ');
            if (aboutParagraphs[0]) {
                aboutParagraphs[0].textContent = sentences.slice(0, 2).join('. ') + '.';
            }
            if (aboutParagraphs[1] && sentences.length > 2) {
                aboutParagraphs[1].textContent = sentences.slice(2).join('. ');
            }
        }
        
        // Update info items
        const updateInfoItem = (label, value) => {
            const items = document.querySelectorAll('.info-item');
            items.forEach(item => {
                const labelEl = item.querySelector('.info-label');
                if (labelEl && labelEl.textContent.includes(label)) {
                    const valueEl = item.querySelector('.info-value');
                    if (valueEl) {
                        if (label === 'Email:' && value) {
                            valueEl.innerHTML = `<a href="mailto:${value}">${value}</a>`;
                        } else if (label === 'Phone:' && value) {
                            valueEl.innerHTML = `<a href="tel:${value.replace(/\s/g, '')}">${value}</a>`;
                        } else if (value) {
                            valueEl.textContent = value;
                        }
                    }
                }
            });
        };
        
        updateInfoItem('Full Name:', profile.fullName);
        updateInfoItem('Specialty:', profile.specialty);
        updateInfoItem('Location:', profile.location);
        updateInfoItem('Focus:', profile.focus);
        updateInfoItem('Email:', profile.email);
        updateInfoItem('Phone:', profile.phone);
        
        // Update stats
        if (this.data.stats) {
            const stats = this.data.stats;
            document.querySelectorAll('.counter[data-target]').forEach(counter => {
                const target = counter.getAttribute('data-target');
                if (target === '19' && stats.happyClients) {
                    counter.setAttribute('data-target', stats.happyClients);
                    counter.textContent = stats.happyClients;
                } else if (target === '30' && stats.completedProjects) {
                    counter.setAttribute('data-target', stats.completedProjects);
                    counter.textContent = stats.completedProjects;
                }
            });
        }
    },

    // ========================================================================
    // SERVICES SECTION
    // ========================================================================
    
    updateServices() {
        if (!this.data?.services || this.data.services.length === 0) return;
        
        const servicesContainer = document.querySelector('.services-grid, #section3 .row');
        if (!servicesContainer) return;
        
        // Keep a reference to original structure if needed
        // For now, we'll update existing service cards or create new ones
        
        const services = this.data.services;
        const existingCards = servicesContainer.querySelectorAll('.service-box, .service-card-item');
        
        services.forEach((service, index) => {
            if (existingCards[index]) {
                // Update existing card
                const card = existingCards[index];
                const titleEl = card.querySelector('h3, .service-title');
                const descEl = card.querySelector('p, .service-description');
                const iconEl = card.querySelector('i');
                
                if (titleEl) titleEl.textContent = service.title;
                if (descEl) descEl.textContent = service.description;
                if (iconEl) iconEl.className = `las ${service.icon}`;
            }
        });
    },

    // ========================================================================
    // PORTFOLIO SECTION
    // ========================================================================
    
    updatePortfolio() {
        if (!this.data?.projects || this.data.projects.length === 0) return;
        
        const portfolioContainer = document.querySelector('.portfolio-grid, .portfolio-items');
        if (!portfolioContainer) return;
        
        const projects = this.data.projects;
        const existingItems = portfolioContainer.querySelectorAll('.portfolio-item, .portfolio-box');
        
        projects.forEach((project, index) => {
            if (existingItems[index]) {
                const item = existingItems[index];
                
                // Update image
                const img = item.querySelector('img');
                if (img && project.image) img.src = project.image;
                
                // Update title
                const title = item.querySelector('h3, .portfolio-title');
                if (title) title.textContent = project.title;
                
                // Update description
                const desc = item.querySelector('.portfolio-description, p');
                if (desc) desc.textContent = project.description;
                
                // Update link
                const link = item.querySelector('a[href]');
                if (link && project.link) link.href = project.link;
                
                // Update technologies/tags
                const tagsContainer = item.querySelector('.portfolio-tags');
                if (tagsContainer && project.tech) {
                    // Parse technologies from string (e.g., "React, Node.js, MongoDB")
                    const techs = project.tech.split(',').map(t => t.trim());
                    tagsContainer.innerHTML = techs.map(tech => `<span class="tag">${tech}</span>`).join('');
                }
            }
        });
    },

    // ========================================================================
    // BLOG SECTION
    // ========================================================================
    
    updateBlog() {
        if (!this.data?.blog || this.data.blog.length === 0) return;
        
        const blogContainer = document.querySelector('.blog-grid, .blog-posts');
        if (!blogContainer) return;
        
        const posts = this.data.blog;
        const existingCards = blogContainer.querySelectorAll('.blog-card, .blog-item, article');
        
        posts.slice(0, existingCards.length).forEach((post, index) => {
            if (existingCards[index]) {
                const card = existingCards[index];
                const title = card.querySelector('h3, .blog-title');
                const excerpt = card.querySelector('.blog-excerpt, p');
                const category = card.querySelector('.blog-category');
                const date = card.querySelector('.blog-date, time');
                
                if (title) title.textContent = post.title;
                if (excerpt) excerpt.textContent = post.excerpt || post.content?.substring(0, 150) + '...';
                if (category) category.textContent = post.category;
                if (date) date.textContent = post.date;
            }
        });
    },

    // ========================================================================
    // SKILLS SECTION
    // ========================================================================
    
    updateSkills() {
        if (!this.data?.skills || this.data.skills.length === 0) return;
        
        const skillsContainer = document.querySelector('.skills-container');
        if (!skillsContainer) return;
        
        // Clear existing skills
        skillsContainer.innerHTML = '';
        
        // Render skills from admin data
        this.data.skills.forEach(skill => {
            const skillItem = document.createElement('div');
            skillItem.className = 'skill-item';
            skillItem.innerHTML = `
                <div class="skill-info">
                    <span class="skill-title">${skill.name || 'Skill'}</span>
                    <span class="skill-percentage">${skill.level || 0}%</span>
                </div>
                <div class="skill-bar">
                    <div class="skill-progress" style="width: ${skill.level || 0}%"></div>
                </div>
            `;
            skillsContainer.appendChild(skillItem);
        });
    },

    // ========================================================================
    // CONTACT SECTION
    // ========================================================================
    
    updateContact() {
        if (!this.data?.profile) return;
        
        const profile = this.data.profile;
        
        // Update phone display
        const phoneCards = document.querySelectorAll('.contact-card');
        phoneCards.forEach(card => {
            const icon = card.querySelector('i');
            const text = card.querySelector('p');
            
            if ((icon?.classList.contains('la-phone-volume') || icon?.classList.contains('la-phone')) && profile.phone) {
                text.textContent = profile.phone;
                card.href = `tel:${profile.phone.replace(/\s/g, '')}`;
            }
            
            if (icon?.classList.contains('la-envelope') && profile.email) {
                text.textContent = profile.email;
                card.href = `mailto:${profile.email}`;
            }
            
            if (icon?.classList.contains('la-map-marker-alt') && profile.location) {
                text.textContent = profile.location;
            }
        });
    },

    // ========================================================================
    // CONTACT FORM HANDLER
    // ========================================================================
    
    setupContactForm() {
        const contactForm = document.getElementById('contactForm') || document.querySelector('.contact-form');
        if (!contactForm) return;

        // Prevent duplicate submit bindings if init() runs more than once.
        if (contactForm.dataset.syncHandlerBound === 'true') return;
        contactForm.dataset.syncHandlerBound = 'true';
        
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Respect HTML5 required/email validation first.
            if (!contactForm.checkValidity()) {
                this.showNotification('Please fill in all required fields', 'error');
                contactForm.reportValidity();
                return;
            }

            // Get form data by explicit field ids (more stable than array indexes).
            const nameInput = contactForm.querySelector('#contactName');
            const emailInput = contactForm.querySelector('#contactEmail');
            const subjectInput = contactForm.querySelector('#contactSubject');
            const messageInput = contactForm.querySelector('#contactMessage');
            const formData = {
                from: nameInput?.value?.trim() || 'Anonymous',
                email: emailInput?.value?.trim() || '',
                subject: subjectInput?.value?.trim() || 'No Subject',
                message: messageInput?.value?.trim() || ''
            };
            
            // Validate
            if (!formData.from || !formData.email || !formData.message) {
                this.showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {
                // Save message to storage
                await DataSyncService.addMessage(formData);
                
                // Show success message
                this.showNotification('Message sent successfully! I will get back to you soon.', 'success');
                
                // Reset form
                contactForm.reset();
                
            } catch (error) {
                console.error('Error sending message:', error);
                this.showNotification('Error sending message. Please try again or email directly.', 'error');
            } finally {
                // Restore button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    },

    // ========================================================================
    // NEWSLETTER FORM HANDLER
    // ========================================================================
    
    setupNewsletterForm() {
        const newsletterForm = document.querySelector('.newsletter-form');
        if (!newsletterForm) return;
        
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput?.value;
            
            if (!email) {
                this.showNotification('Please enter your email address', 'error');
                return;
            }
            
            // For now, save as a message (can be modified to separate newsletter list)
            try {
                await DataSyncService.addMessage({
                    from: 'Newsletter Subscriber',
                    email: email,
                    subject: 'Newsletter Subscription',
                    message: `New newsletter subscription from: ${email}`
                });
                
                this.showNotification('Successfully subscribed to the newsletter!', 'success');
                newsletterForm.reset();
                
            } catch (error) {
                this.showNotification('Error subscribing. Please try again.', 'error');
            }
        });
    },

    // ========================================================================
    // VISIT TRACKING
    // ========================================================================
    
    async trackVisit() {
        // Only track once per session
        if (sessionStorage.getItem('visitTracked')) return;
        
        try {
            await DataSyncService.incrementVisits();
            sessionStorage.setItem('visitTracked', 'true');
            console.log('📊 Visit tracked');
        } catch (error) {
            console.error('Error tracking visit:', error);
        }
    },

    // ========================================================================
    // NOTIFICATION HELPER
    // ========================================================================
    
    showNotification(message, type = 'success') {
        // Check if there's an existing notification element
        let notification = document.getElementById('siteNotification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'siteNotification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                border-radius: 10px;
                color: white;
                font-weight: 500;
                z-index: 99999;
                transform: translateX(150%);
                transition: transform 0.3s ease;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            `;
            document.body.appendChild(notification);
        }
        
        notification.textContent = message;
        notification.style.background = type === 'success' ? '#10b981' : 
                                        type === 'error' ? '#ef4444' : '#3b82f6';
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out
        setTimeout(() => {
            notification.style.transform = 'translateX(150%)';
        }, 4000);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure DataSyncService is loaded
    setTimeout(() => {
        SiteContentLoader.init();
    }, 100);
});

// Also initialize on window load as backup
window.addEventListener('load', () => {
    if (!SiteContentLoader.isLoaded) {
        SiteContentLoader.init();
    }
});
