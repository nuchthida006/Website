// -------------------------------
// Page navigation with back stack
// -------------------------------
const navStack = [];

function navigateTo(pageId, push = true) {
    const pages = document.querySelectorAll('.page');
    const current = document.querySelector('.page.active');

    if (push && current && current.id && current.id !== pageId) {
        navStack.push(current.id);
    }

    pages.forEach(page => page.classList.remove('active'));

    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

function goBack() {
    if (navStack.length === 0) return;
    const prev = navStack.pop();
    navigateTo(prev, false);
}

// expose for inline onclick handlers (redundant but explicit)
window.goBack = goBack;

// -------------------------------
// Hero slide autoplay
// -------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.slide-track');
    const slides = document.querySelectorAll('.slide-item');
    if (!track || slides.length === 0) return;

    let index = 0;
    const total = slides.length;
    function goTo(i, px) {
        if (typeof px === 'number') {
            track.style.transform = `translateX(-${px}px)`;
        } else {
            track.style.transform = `translateX(-${i * 100}%)`;
        }
    }

    function next() {
        index = (index + 1) % total;
        const style = getComputedStyle(slides[0]);
        const marginLeft = parseFloat(style.marginLeft) || 0;
        const marginRight = parseFloat(style.marginRight) || 0;
        const slideWidth = slides[0].getBoundingClientRect().width + marginLeft + marginRight;
        goTo(index, index * slideWidth);
    }

    // start autoplay
    let interval = null;
    function start() {
        // ensure first position
        goTo(0, 0);
        clearInterval(interval);
        interval = setInterval(next, 3000);
    }
    start();

    const hero = document.querySelector('.hero-slides');
    if (hero) {
        hero.addEventListener('mouseenter', () => clearInterval(interval));
        hero.addEventListener('mouseleave', () => {
            clearInterval(interval);
            interval = setInterval(next, 3000);
        });
    }
});

// -------------------------------
// Convert youtu.be links to embedded iframes (keep original link)
// -------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const anchors = Array.from(document.querySelectorAll('a[href^="https://youtu.be/"]'));
    anchors.forEach(a => {
        try {
            const href = a.getAttribute('href');
            const m = href.match(/youtu\.be\/([^?]+)/);
            if (!m) return;
            const id = m[1];
            const wrapper = document.createElement('div');
            wrapper.className = 'video-embed';

            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${id}`;
            iframe.title = a.textContent || 'YouTube video player';
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            iframe.setAttribute('allowfullscreen', '');
            iframe.loading = 'lazy';

            const link = a.cloneNode(true);
            link.textContent = 'ลิงค์วิดีโอบน YouTube';
            link.target = '_blank';
            link.rel = 'noopener noreferrer';

            wrapper.appendChild(iframe);
            wrapper.appendChild(link);

            a.parentNode.replaceChild(wrapper, a);
        } catch (e) {
            // ignore
            console.error('Failed to convert youtu.be link', e);
        }
    });
});