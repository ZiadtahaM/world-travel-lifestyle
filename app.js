class WorldTheme {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupNavigation();
        this.setupSearch();
        this.setupFilters();
        this.setupForms();
        this.setupVideoPlayers();
        this.setupScrollEffects();
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.hideLoader();
        });

        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 16));

        window.addEventListener('resize', this.throttle(() => {
            this.handleResize();
        }, 250));
    }

    setupNavigation() {
        const navbarToggle = document.querySelector('.navbar-toggle');
        const navbarMenu = document.querySelector('.navbar-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        const header = document.querySelector('.header');

        if (navbarToggle && navbarMenu) {
            navbarToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const isExpanded = navbarToggle.getAttribute('aria-expanded') === 'true';
                
                navbarToggle.setAttribute('aria-expanded', !isExpanded);
                navbarMenu.classList.toggle('active');
                document.body.style.overflow = navbarMenu.classList.contains('active') ? 'hidden' : '';
                
                this.animateHamburger(navbarToggle, !isExpanded);
            });

            document.addEventListener('click', (e) => {
                if (!navbarMenu.contains(e.target) && !navbarToggle.contains(e.target)) {
                    navbarMenu.classList.remove('active');
                    navbarToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                    this.animateHamburger(navbarToggle, false);
                }
            });
        }

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const headerHeight = header ? header.offsetHeight : 80;
                        const targetPosition = targetElement.offsetTop - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        this.updateActiveNavLink(link);
                        
                        if (navbarMenu && navbarMenu.classList.contains('active')) {
                            navbarMenu.classList.remove('active');
                            navbarToggle.setAttribute('aria-expanded', 'false');
                            document.body.style.overflow = '';
                            this.animateHamburger(navbarToggle, false);
                        }
                    }
                }
            });
        });
    }

    animateHamburger(toggle, isOpen) {
        const lines = toggle.querySelectorAll('.hamburger-line');
        
        if (isOpen) {
            lines[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            lines[1].style.opacity = '0';
            lines[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            lines[0].style.transform = 'none';
            lines[1].style.opacity = '1';
            lines[2].style.transform = 'none';
        }
    }

    updateActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    setupSearch() {
        const searchToggle = document.querySelector('.search-toggle');
        const searchModal = document.querySelector('.search-modal');
        const searchClose = document.querySelector('.search-close');
        const searchOverlay = document.querySelector('.search-overlay');
        const searchInput = document.querySelector('.search-input');
        const searchForm = document.querySelector('.search-form');

        if (searchToggle && searchModal) {
            searchToggle.addEventListener('click', () => {
                this.openSearchModal();
            });

            if (searchClose) {
                searchClose.addEventListener('click', () => {
                    this.closeSearchModal();
                });
            }

            if (searchOverlay) {
                searchOverlay.addEventListener('click', () => {
                    this.closeSearchModal();
                });
            }

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && searchModal.classList.contains('active')) {
                    this.closeSearchModal();
                }
                
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    this.openSearchModal();
                }
            });

            if (searchForm) {
                searchForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const query = searchInput.value.trim();
                    if (query) {
                        this.performSearch(query);
                    }
                });
            }
        }
    }

    openSearchModal() {
        const searchModal = document.querySelector('.search-modal');
        const searchInput = document.querySelector('.search-input');
        
        if (searchModal) {
            searchModal.classList.add('active');
            searchModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            setTimeout(() => {
                if (searchInput) {
                    searchInput.focus();
                }
            }, 300);
        }
    }

    closeSearchModal() {
        const searchModal = document.querySelector('.search-modal');
        const searchInput = document.querySelector('.search-input');
        
        if (searchModal) {
            searchModal.classList.remove('active');
            searchModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            
            if (searchInput) {
                searchInput.value = '';
            }
        }
    }

    performSearch(query) {
        console.log(`Searching for: ${query}`);
        this.showNotification(`Searching for "${query}"...`, 'info');
        this.closeSearchModal();
    }

    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const trendingCards = document.querySelectorAll('.trending-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                this.filterTrendingCards(filter, trendingCards);
            });
        });
    }

    filterTrendingCards(filter, cards) {
        cards.forEach(card => {
            const category = card.getAttribute('data-category');
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                card.style.display = 'block';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    setupForms() {
        const newsletterForm = document.querySelector('.newsletter-form');
        
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const emailInput = newsletterForm.querySelector('input[type="email"]');
                const email = emailInput.value.trim();
                
                if (this.validateEmail(email)) {
                    this.subscribeNewsletter(email);
                    emailInput.value = '';
                } else {
                    this.showNotification('Please enter a valid email address', 'error');
                }
            });
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    subscribeNewsletter(email) {
        const button = document.querySelector('.newsletter-form .btn');
        if (!button) return;
        const originalText = button.textContent;

        button.textContent = 'Preview only';
        button.disabled = true;
        this.showNotification('Newsletter service is not connected in this preview. Your email was not sent.', 'info');

        window.setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 1800);
    }

    setupVideoPlayers() {
        const playButtons = document.querySelectorAll('.play-button');
        
        playButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const videoCard = button.closest('.video-card');
                const videoTitle = videoCard.querySelector('.video-title').textContent;
                
                this.playVideo(videoTitle);
            });
        });
    }

    playVideo(title) {
        this.showNotification(`Playing: ${title}`, 'info');
    }

    setupScrollEffects() {
        const scrollIndicator = document.querySelector('.hero-scroll-indicator');
        
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const featuredSection = document.querySelector('.featured-section');
                if (featuredSection) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                    const targetPosition = featuredSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        }
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    if (entry.target.classList.contains('featured-card') ||
                        entry.target.classList.contains('trending-card') ||
                        entry.target.classList.contains('article-card') ||
                        entry.target.classList.contains('video-card')) {
                        
                        const delay = Array.from(entry.target.parentElement.children).indexOf(entry.target) * 100;
                        entry.target.style.animationDelay = `${delay}ms`;
                    }
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll(`
            .featured-card,
            .trending-card,
            .article-card,
            .video-card,
            .section-header,
            .newsletter-content,
            .about-content
        `);

        animatedElements.forEach(el => {
            observer.observe(el);
        });

        const style = document.createElement('style');
        style.textContent = `
            .featured-card,
            .trending-card,
            .article-card,
            .video-card,
            .section-header,
            .newsletter-content,
            .about-content {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease-out, transform 0.6s ease-out;
            }
            
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }

    handleScroll() {
        const scrollTop = window.pageYOffset;
        const header = document.querySelector('.header');
        const scrollIndicator = document.querySelector('.hero-scroll-indicator');
        
        if (header) {
            if (scrollTop > 100) {
                header.style.background = 'rgba(var(--color-surface), 0.98)';
                header.style.boxShadow = 'var(--shadow-md)';
            } else {
                header.style.background = 'rgba(var(--color-surface), 0.95)';
                header.style.boxShadow = 'none';
            }
        }
        
        if (scrollIndicator) {
            scrollIndicator.style.opacity = scrollTop > 200 ? '0' : '1';
        }
        
        this.updateActiveNavOnScroll();
    }

    updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    handleResize() {
        const navbarMenu = document.querySelector('.navbar-menu');
        const navbarToggle = document.querySelector('.navbar-toggle');
        
        if (window.innerWidth > 768) {
            if (navbarMenu) {
                navbarMenu.classList.remove('active');
            }
            if (navbarToggle) {
                navbarToggle.setAttribute('aria-expanded', 'false');
                this.animateHamburger(navbarToggle, false);
            }
            document.body.style.overflow = '';
        }
    }

    hideLoader() {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 300);
        }
    }

    showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        const content = document.createElement('div');
        content.className = 'notification-content';
        const messageEl = document.createElement('span');
        messageEl.className = 'notification-message';
        messageEl.textContent = typeof message === 'string' ? message : String(message ?? '');
        const closeBtn = document.createElement('button');
        closeBtn.className = 'notification-close';
        closeBtn.type = 'button';
        closeBtn.setAttribute('aria-label', 'Close notification');
        const closeIcon = document.createElement('i');
        closeIcon.className = 'fas fa-times';
        closeIcon.setAttribute('aria-hidden', 'true');
        closeBtn.appendChild(closeIcon);
        content.append(messageEl, closeBtn);
        notification.appendChild(content);
        
        const notificationStyles = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--color-surface);
                border: 1px solid var(--color-border);
                border-radius: var(--radius-base);
                box-shadow: var(--shadow-card);
                z-index: 1500;
                min-width: 300px;
                max-width: 400px;
                transform: translateX(420px);
                transition: transform 0.3s ease-out;
            }
            
            .notification--success {
                border-left: 4px solid var(--color-success);
            }
            
            .notification--error {
                border-left: 4px solid var(--color-error);
            }
            
            .notification--info {
                border-left: 4px solid var(--color-info);
            }
            
            .notification-content {
                padding: var(--space-16);
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: var(--space-12);
            }
            
            .notification-message {
                flex: 1;
                color: var(--color-text);
                font-size: var(--font-size-sm);
            }
            
            .notification-close {
                background: none;
                border: none;
                color: var(--color-text-secondary);
                cursor: pointer;
                padding: var(--space-4);
                border-radius: var(--radius-sm);
                transition: var(--transition-fast);
            }
            
            .notification-close:hover {
                background: var(--color-secondary);
                color: var(--color-text);
            }
        `;
        
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = notificationStyles;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        closeBtn.addEventListener('click', () => {
            this.hideNotification(notification);
        });
        
        setTimeout(() => {
            if (notification.parentElement) {
                this.hideNotification(notification);
            }
        }, 5000);
    }

    hideNotification(notification) {
        notification.style.transform = 'translateX(420px)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
}

class LazyLoader {
    constructor() {
        this.imageObserver = null;
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        this.imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px'
            });

            this.observeImages();
        } else {
            this.loadAllImages();
        }
    }

    observeImages() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            this.imageObserver.observe(img);
        });
    }

    loadImage(img) {
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }
        
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
    }

    loadAllImages() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            this.loadImage(img);
        });
    }
}

class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.preloadCriticalResources();
        this.optimizeImages();
        this.setupServiceWorker();
    }

    preloadCriticalResources() {
        const criticalResources = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = 'style';
            document.head.appendChild(link);
        });
    }

    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.getAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            if (!img.getAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }
        });
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                const swContent = `
                    const CACHE_NAME = 'world-theme-v1';
                    const urlsToCache = [
                        '/',
                        '/style.css',
                        '/app.js'
                    ];

                    self.addEventListener('install', event => {
                        event.waitUntil(
                            caches.open(CACHE_NAME)
                                .then(cache => cache.addAll(urlsToCache))
                        );
                    });

                    self.addEventListener('fetch', event => {
                        event.respondWith(
                            caches.match(event.request)
                                .then(response => {
                                    if (response) {
                                        return response;
                                    }
                                    return fetch(event.request);
                                })
                        );
                    });
                `;
                
                const blob = new Blob([swContent], { type: 'application/javascript' });
                const swUrl = URL.createObjectURL(blob);
                
                navigator.serviceWorker.register(swUrl)
                    .then(registration => {
                        console.log('SW registered successfully');
                    })
                    .catch(error => {
                        console.log('SW registration failed');
                    });
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WorldTheme();
    new LazyLoader();
    new PerformanceOptimizer();
    
    const cards = document.querySelectorAll('.featured-card, .trending-card, .article-card, .video-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = link.getAttribute('aria-label') || 'social media';
            console.log(`Opening ${platform} link`);
        });
    });
});