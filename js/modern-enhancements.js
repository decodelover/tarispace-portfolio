/* =====================================================
   MODERN ENHANCEMENTS & INTERACTIVE FEATURES
   ===================================================== */

document.addEventListener('DOMContentLoaded', function() {
	initializeParticles();
	initializeCounters();
	initializePreloader();
	initializePortfolioFilters();
	initializeContactForm();
	initializeNewsletterForm();
	initializeSmoothScrolling();
	initializeScrollAnimations();
	initializeIntersectionObserver();
	initializeFloatingIcons();
});

// =====================================================
// PARTICLE BACKGROUND ANIMATION
// =====================================================

function initializeParticles() {
	const canvas = document.getElementById('particleCanvas');
	if (!canvas) return;

	const ctx = canvas.getContext('2d');
	const particles = [];
	const particleCount = 50;

	// Set canvas size
	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}
	resizeCanvas();
	window.addEventListener('resize', resizeCanvas);

	// Particle class
	class Particle {
		constructor() {
			this.x = Math.random() * canvas.width;
			this.y = Math.random() * canvas.height;
			this.size = Math.random() * 2 + 1;
			this.speedX = Math.random() * 0.5 - 0.25;
			this.speedY = Math.random() * 0.5 - 0.25;
			this.opacity = Math.random() * 0.5 + 0.2;
		}

		update() {
			this.x += this.speedX;
			this.y += this.speedY;

			// Wrap around screen
			if (this.x > canvas.width) this.x = 0;
			if (this.x < 0) this.x = canvas.width;
			if (this.y > canvas.height) this.y = 0;
			if (this.y < 0) this.y = canvas.height;
		}

		draw() {
			ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	// Create particles
	for (let i = 0; i < particleCount; i++) {
		particles.push(new Particle());
	}

	// Animation loop
	function animate() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		particles.forEach(particle => {
			particle.update();
			particle.draw();

			// Draw connections
			particles.forEach(otherParticle => {
				const dx = particle.x - otherParticle.x;
				const dy = particle.y - otherParticle.y;
				const distance = Math.sqrt(dx * dx + dy * dy);

				if (distance < 150) {
					ctx.strokeStyle = `rgba(212, 175, 55, ${0.1 * (1 - distance / 150)})`;
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.moveTo(particle.x, particle.y);
					ctx.lineTo(otherParticle.x, otherParticle.y);
					ctx.stroke();
				}
			});
		});

		requestAnimationFrame(animate);
	}

	animate();
}

// =====================================================
// PRELOADER ANIMATION
// =====================================================

function initializePreloader() {
	window.addEventListener('load', function() {
		const preloader = document.getElementById('preloader');
		if (!preloader) return;

		setTimeout(() => {
			preloader.style.opacity = '0';
			preloader.style.visibility = 'hidden';
			preloader.style.transition = 'all 0.6s ease-out';
		}, 2000);
	});
}

// =====================================================
// COUNTER ANIMATION
// =====================================================

function initializeCounters() {
	const counters = document.querySelectorAll('.counter');
	const speed = 50;

	const startCounters = (entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting && !entry.target.dataset.counted) {
				entry.target.dataset.counted = 'true';

				counters.forEach(counter => {
					const target = parseInt(counter.getAttribute('data-target'));
					let current = 0;

					const increment = target / speed;

					const updateCount = () => {
						current += increment;
						if (current < target) {
							counter.textContent = Math.ceil(current);
							setTimeout(updateCount, 30);
						} else {
							counter.textContent = target;
						}
					};

					updateCount();
				});
			}
		});
	};

	const observer = new IntersectionObserver(startCounters, {
		threshold: 0.5
	});

	counters.forEach(counter => observer.observe(counter));
}

// =====================================================
// PORTFOLIO FILTERING
// =====================================================

function initializePortfolioFilters() {
	const filterBtns = document.querySelectorAll('.filter-btn');
	const portfolioItems = document.querySelectorAll('.portfolio-item');

	filterBtns.forEach(btn => {
		btn.addEventListener('click', function() {
			// Update active button
			filterBtns.forEach(b => b.classList.remove('active'));
			this.classList.add('active');

			const filterValue = this.getAttribute('data-filter');

			// Animate portfolio items
			portfolioItems.forEach(item => {
				item.style.opacity = '0';
				item.style.transform = 'scale(0.8)';
				item.style.transition = 'all 0.3s ease-out';

				setTimeout(() => {
					if (filterValue === 'all' || item.getAttribute('data-filter') === filterValue) {
						item.style.display = 'block';
						setTimeout(() => {
							item.style.opacity = '1';
							item.style.transform = 'scale(1)';
						}, 10);
					} else {
						item.style.display = 'none';
					}
				}, 300);
			});
		});
	});
}

// =====================================================
// CONTACT FORM SUBMISSION
// =====================================================

function initializeContactForm() {
	const contactForm = document.getElementById('contactForm');
	if (!contactForm) return;

	contactForm.addEventListener('submit', function(e) {
		e.preventDefault();

		const formData = new FormData(this);
		const inputs = this.querySelectorAll('input, textarea');
		const submitBtn = this.querySelector('.btn-submit');

		// Validate form
		let isValid = true;
		inputs.forEach(input => {
			if (!input.value.trim()) {
				isValid = false;
				input.classList.add('error');
			} else {
				input.classList.remove('error');
			}
		});

		if (!isValid) {
			showNotification('Please fill in all fields', 'error');
			return;
		}

		// Show loading state
		const originalText = submitBtn.textContent;
		submitBtn.textContent = 'Sending...';
		submitBtn.disabled = true;
		submitBtn.style.opacity = '0.7';

		// Simulate form submission (replace with actual backend call)
		setTimeout(() => {
			submitBtn.textContent = 'Message Sent!';
			submitBtn.style.background = '#4CAF50';

			showNotification('Message sent successfully! I will get back to you soon.', 'success');

			// Reset form
			setTimeout(() => {
				contactForm.reset();
				submitBtn.textContent = originalText;
				submitBtn.disabled = false;
				submitBtn.style.opacity = '1';
				submitBtn.style.background = '';
			}, 2000);
		}, 1500);
	});
}

// =====================================================
// NEWSLETTER FORM SUBMISSION
// =====================================================

function initializeNewsletterForm() {
	const newsletterForm = document.querySelector('.newsletter-form');
	if (!newsletterForm) return;

	newsletterForm.addEventListener('submit', function(e) {
		e.preventDefault();

		const emailInput = this.querySelector('input[type="email"]');
		const submitBtn = this.querySelector('button');
		const email = emailInput.value.trim();

		// Validate email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			showNotification('Please enter a valid email address', 'error');
			return;
		}

		// Show loading state
		const originalText = submitBtn.textContent;
		submitBtn.textContent = 'Subscribing...';
		submitBtn.disabled = true;

		// Simulate subscription (replace with actual backend call)
		setTimeout(() => {
			submitBtn.textContent = 'Subscribed!';
			showNotification('Successfully subscribed to newsletter!', 'success');

			// Reset form
			setTimeout(() => {
				emailInput.value = '';
				submitBtn.textContent = originalText;
				submitBtn.disabled = false;
			}, 1500);
		}, 1500);
	});
}

// =====================================================
// SMOOTH SCROLLING
// =====================================================

function initializeSmoothScrolling() {
	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function(e) {
			const href = this.getAttribute('href');
			if (href === '#') return;

			const target = document.querySelector(href);
			if (!target) return;

			e.preventDefault();

			target.scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
		});
	});
}

// =====================================================
// SCROLL ANIMATIONS
// =====================================================

function initializeScrollAnimations() {
	const animatedElements = document.querySelectorAll(
		'.section-header, .about-heading, .resume-item, .service-card, .portfolio-card, .blog-post'
	);

	const observerOptions = {
		threshold: 0.1,
		rootMargin: '0px 0px -100px 0px'
	};

	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.style.opacity = '1';
				entry.target.style.transform = 'translateY(0)';
				observer.unobserve(entry.target);
			}
		});
	}, observerOptions);

	animatedElements.forEach(element => {
		element.style.opacity = '0';
		element.style.transform = 'translateY(20px)';
		element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
		observer.observe(element);
	});
}

// =====================================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// =====================================================

function initializeIntersectionObserver() {
	const observerOptions = {
		threshold: 0.2,
		rootMargin: '0px 0px -50px 0px'
	};

	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('animate-in');
			}
		});
	}, observerOptions);

	document.querySelectorAll('[data-animate]').forEach(el => {
		observer.observe(el);
	});
}

// =====================================================
// FLOATING ICONS ANIMATION
// =====================================================

function initializeFloatingIcons() {
	const floatingIcons = document.querySelectorAll('.floating-icon');

	floatingIcons.forEach((icon, index) => {
		const angle = (index / floatingIcons.length) * Math.PI * 2;
		const baseDelay = index * 0.3;

		icon.style.setProperty('--angle', angle);
		icon.style.setProperty('--delay', baseDelay + 's');

		// Add hover effect
		icon.addEventListener('mouseenter', function() {
			this.style.transform = 'scale(1.2) rotateY(360deg)';
			this.style.zIndex = '100';
		});

		icon.addEventListener('mouseleave', function() {
			this.style.transform = '';
			this.style.zIndex = '';
		});
	});
}

// =====================================================
// NOTIFICATION SYSTEM
// =====================================================

function showNotification(message, type = 'info') {
	const notification = document.createElement('div');
	notification.className = `notification notification-${type}`;
	notification.style.cssText = `
		position: fixed;
		top: 20px;
		right: 20px;
		padding: 16px 24px;
		background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
		color: white;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		z-index: 10000;
		animation: slideInRight 0.3s ease-out;
		font-weight: 600;
		letter-spacing: 0.5px;
	`;

	notification.textContent = message;
	document.body.appendChild(notification);

	setTimeout(() => {
		notification.style.animation = 'slideInLeft 0.3s ease-out reverse';
		setTimeout(() => notification.remove(), 300);
	}, 3000);
}

// =====================================================
// MOUSE TRAIL EFFECT (Optional Enhancement)
// =====================================================

function initializeMouseTrail() {
	let mouseX = 0;
	let mouseY = 0;

	document.addEventListener('mousemove', (e) => {
		mouseX = e.clientX;
		mouseY = e.clientY;

		// Create trailing particles on hero section
		const heroSection = document.querySelector('.hero-block');
		if (heroSection) {
			const rect = heroSection.getBoundingClientRect();
			if (mouseY > rect.top && mouseY < rect.bottom) {
				createTrailParticle(mouseX, mouseY);
			}
		}
	});

	function createTrailParticle(x, y) {
		const particle = document.createElement('div');
		particle.style.cssText = `
			position: fixed;
			left: ${x}px;
			top: ${y}px;
			width: 8px;
			height: 8px;
			background: radial-gradient(circle, rgba(212, 175, 55, 0.8), transparent);
			border-radius: 50%;
			pointer-events: none;
			z-index: 100;
			animation: trailFade 0.6s ease-out forwards;
		`;

		document.body.appendChild(particle);
		setTimeout(() => particle.remove(), 600);
	}

	// Add keyframes for trail fade
	const style = document.createElement('style');
	style.textContent = `
		@keyframes trailFade {
			0% {
				opacity: 1;
				transform: scale(1) translateY(0);
			}
			100% {
				opacity: 0;
				transform: scale(0.5) translateY(20px);
			}
		}
	`;
	document.head.appendChild(style);
}

// =====================================================
// SCROLL PROGRESS BAR
// =====================================================

function initializeScrollProgress() {
	const progressBar = document.createElement('div');
	progressBar.style.cssText = `
		position: fixed;
		top: 0;
		left: 0;
		height: 3px;
		background: linear-gradient(90deg, #D4AF37, #00d4ff, #9d4edd);
		z-index: 9999;
		width: 0%;
		transition: width 0.1s ease-out;
	`;

	document.body.appendChild(progressBar);

	window.addEventListener('scroll', () => {
		const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
		const scrolled = (window.scrollY / windowHeight) * 100;
		progressBar.style.width = scrolled + '%';
	});
}

// =====================================================
// ENHANCED FORM VALIDATION
// =====================================================

function validateEmail(email) {
	const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return re.test(email);
}

function validatePhone(phone) {
	const re = /^[\d\s\-\+\(\)]+$/;
	return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// =====================================================
// SCROLL TO TOP BUTTON
// =====================================================

function initializeScrollToTop() {
	const scrollToTopBtn = document.createElement('button');
	scrollToTopBtn.id = 'scrollToTop';
	scrollToTopBtn.innerHTML = '<i class="las la-chevron-up"></i>';
	scrollToTopBtn.style.cssText = `
		position: fixed;
		bottom: 30px;
		right: 30px;
		width: 50px;
		height: 50px;
		background: linear-gradient(135deg, #D4AF37, #B8960F);
		border: none;
		border-radius: 50%;
		color: #000;
		font-size: 24px;
		cursor: pointer;
		z-index: 999;
		opacity: 0;
		visibility: hidden;
		transition: all 0.3s ease-out;
		box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
	`;

	document.body.appendChild(scrollToTopBtn);

	window.addEventListener('scroll', () => {
		if (window.scrollY > 500) {
			scrollToTopBtn.style.opacity = '1';
			scrollToTopBtn.style.visibility = 'visible';
		} else {
			scrollToTopBtn.style.opacity = '0';
			scrollToTopBtn.style.visibility = 'hidden';
		}
	});

	scrollToTopBtn.addEventListener('click', () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	});

	scrollToTopBtn.addEventListener('mouseenter', function() {
		this.style.transform = 'scale(1.1)';
	});

	scrollToTopBtn.addEventListener('mouseleave', function() {
		this.style.transform = 'scale(1)';
	});
}

// =====================================================
// LAZY LOADING IMAGES
// =====================================================

function initializeLazyLoading() {
	const images = document.querySelectorAll('img[data-src]');

	const imageObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const img = entry.target;
				img.src = img.dataset.src;
				img.classList.add('loaded');
				observer.unobserve(img);
			}
		});
	});

	images.forEach(img => imageObserver.observe(img));
}

// =====================================================
// INITIALIZE ALL FEATURES
// =====================================================

// Initialize scroll to top
initializeScrollToTop();

// Initialize scroll progress bar
initializeScrollProgress();

// Initialize mouse trail (optional)
// initializeMouseTrail();

// =====================================================
// KEYBOARD SHORTCUTS
// =====================================================

document.addEventListener('keydown', (e) => {
	// Home: Ctrl+Home
	if (e.ctrlKey && e.key === 'Home') {
		document.querySelector('#section1').scrollIntoView({ behavior: 'smooth' });
	}
	// Contact: Ctrl+K
	if (e.ctrlKey && e.key === 'k') {
		e.preventDefault();
		document.querySelector('#section6').scrollIntoView({ behavior: 'smooth' });
	}
});

// =====================================================
// DARK MODE TOGGLE (OPTIONAL)
// =====================================================

function initializeDarkMode() {
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

	const toggleDarkMode = (isDark) => {
		if (isDark) {
			document.documentElement.style.filter = 'invert(1) hue-rotate(180deg)';
		}
	};

	toggleDarkMode(prefersDark.matches);
	prefersDark.addListener(e => toggleDarkMode(e.matches));
}

// Optional: Uncomment to enable dark mode toggle
// initializeDarkMode();

// =====================================================
// PERFORMANCE MONITORING
// =====================================================

if ('PerformanceObserver' in window) {
	try {
		const observer = new PerformanceObserver((list) => {
			for (const entry of list.getEntries()) {
				console.log(`${entry.name}: ${entry.duration}ms`);
			}
		});

		observer.observe({
			entryTypes: ['navigation', 'resource', 'paint']
		});
	} catch (e) {
		console.log('Performance monitoring not available');
	}
}

// =====================================================
// ADVANCED ANIMATIONS WITH GSAP (Optional)
// =====================================================

// Uncomment if using GSAP library
/*
if (typeof gsap !== 'undefined') {
	gsap.registerPlugin(ScrollTrigger);

	gsap.utils.toArray('.service-card').forEach((card) => {
		gsap.to(card, {
			scrollTrigger: {
				trigger: card,
				start: 'top center+=100',
				end: 'center center',
				scrub: 1,
				markers: false
			},
			opacity: 1,
			y: 0,
			duration: 1
		});
	});
}
*/

// =====================================================
// SMOOTH PAGE TRANSITIONS
// =====================================================

function initializePageTransitions() {
	const links = document.querySelectorAll('a:not([target="_blank"])');

	links.forEach(link => {
		link.addEventListener('click', function(e) {
			const href = this.getAttribute('href');

			if (href && href.startsWith('http') && !href.includes(window.location.hostname)) {
				e.preventDefault();

				const transitionOverlay = document.createElement('div');
				transitionOverlay.style.cssText = `
					position: fixed;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					background: linear-gradient(135deg, #D4AF37, #9d4edd);
					z-index: 9998;
					animation: slideInRight 0.3s ease-out;
				`;

				document.body.appendChild(transitionOverlay);

				setTimeout(() => {
					window.location.href = href;
				}, 300);
			}
		});
	});
}

// Call transition initialization
initializePageTransitions();

console.log('%cTarispace Portfolio Loaded Successfully ✨', 'color: #D4AF37; font-size: 16px; font-weight: bold;');
