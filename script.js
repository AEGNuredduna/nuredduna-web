document.addEventListener('DOMContentLoaded', () => {
    // 0. Load Content from content.json
    fetch('content.json')
        .then(response => {
            if (!response.ok) {
                console.warn('No s\'ha pogut carregar content.json (Falla de CORS per obrir-ho via file://?). S\'utilitza el text HTML de base.');
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Helper to access nested objects via string path 'nav.qui_som'
            const getNestedProperty = (obj, path) => {
                return path.split('.').reduce((acc, part) => acc && acc[part], obj);
            };

            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                const value = getNestedProperty(data, key);
                if (value) {
                    el.textContent = value;
                }
            });
        })
        .catch(error => console.error('Error loading content:', error));

    // 1. Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true, // Animates only once when scrolling down
        offset: 100, // Trigger animation 100px before the element comes into view
    });

    // 2. Mobile Menu Toggle System
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    let isMenuOpen = false; // State to track menu closure properly

    btn.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            menu.classList.remove('hidden'); // Show menu
            // Basic slide-down effect trick
            menu.style.maxHeight = menu.scrollHeight + "px";
            menu.style.opacity = '1';
        } else {
            closeMenu();
        }
    });

    // Helper to close the mobile menu
    function closeMenu() {
        isMenuOpen = false;
        menu.style.maxHeight = '0px';
        menu.style.opacity = '0';
        setTimeout(() => {
            menu.classList.add('hidden'); // Hide after transition
        }, 300); // match transition duration if we added css, but tailwind handles standard hidden. 
                 // In this straightforward setup it toggles instantly. Let's just snap hide
        menu.classList.add('hidden');
    }

    // Close mobile menu when a link inside is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Prevent scrolling behind mobile menu if we wanted a full screen one, 
    // but here it's a dropdown, so just standard behavior is fine.

    // 3. Sticky Navigation visual effect
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('shadow-md', 'bg-earth-50/95');
            header.classList.remove('bg-earth-50/90', 'shadow-sm');
        } else {
            header.classList.add('bg-earth-50/90', 'shadow-sm');
            header.classList.remove('shadow-md', 'bg-earth-50/95');
        }
    });

    // 4. Form Submission Mock
    const form = document.querySelector('form');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Basic visual feedback
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Enviant...';
            submitBtn.classList.add('opacity-75');

            setTimeout(() => {
                submitBtn.textContent = 'Missatge Enviat!';
                submitBtn.classList.remove('opacity-75');
                submitBtn.classList.replace('bg-forest', 'bg-green-600');
                
                // Reset form
                form.reset();
                
                // Revert button styling after 3 sec
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.classList.replace('bg-green-600', 'bg-forest');
                }, 3000);
            }, 1000);
        });
    }
});
