const parser = new DOMParser();
function $(selector, ctx) {
    // Returns all elements with the given selector if flagged with -f (defaults to querySelector)
    let findAll = / -f$/;
    return findAll.test(selector) ? (ctx || document).querySelectorAll(selector.split(findAll)[0]) : (ctx || document).querySelector(selector);
}

const templates = {
    noticeBar: parser.parseFromString(`
        <div class="notice-bar">
            <div class="spacer"><i class="fa-solid fa-xmark"></i></div>
            <div class="container">
                <span>University Admissions: Please Read! <i class="fa-solid fa-caret-down"></i></span>
                <div class="info">
                    Thank you for checking out my website! The pages titled "Projects," "Resume," and "Experience" all have
                    STEM-based information on them. However, I encourage you to look through "Extracurriculars" and "Contact" as well (the latter
                    specifically for the code).
                </div>
            </div>
            <button><i class="fa-solid fa-xmark"></i></button>
        </div>`, 'text/html').body.firstElementChild,
    footer: parser.parseFromString(`
    <div id="footer-wrap">
        <div class="footer">
            <div class="copyright">
                &copy; 2025 Aaden Robinson. All rights reserved.
            </div>
        </div>
    </div>`, 'text/html').body.firstElementChild
};

document.addEventListener('DOMContentLoaded', function() {
    let body = $('body');
    body.classList.add('fade-in');
    $('.main-wrap').after(templates.footer);

    $('.hamburger -f').forEach(function (hamburger) {
        hamburger.addEventListener('click', function (e) {
            e.preventDefault();
            if (!body.classList.contains('nav-open')) body.classList.add('nav-open');
            else body.classList.remove('nav-open');
        });
    });
    window.addEventListener('scroll', scrollNav);
    window.addEventListener('resize', () => {
        collapseNav();
        moveNavbar();
    });
    scrollNav();
    collapseNav();

    if(!getCookie('noticeBarClosed')) {
        body.prepend(templates.noticeBar);
        $('.notice-bar button').addEventListener('click', function () {
            let noticeBar = this.parentElement;
            noticeBar.style.display = 'none';
            moveNavbar();
            setCookie('noticeBarClosed', 1, '2d');
        });
        $('.notice-bar .container span').addEventListener('click', function () {
            let info = $('.notice-bar .container .info');
            let icon = $('i', this);
            if (!info.style.display || info.style.display === 'none') {
                info.style.display = 'block';
                icon.classList.remove('fa-caret-down');
                icon.classList.add('fa-caret-up');
            } else {
                info.style.display = '';
                icon.classList.remove('fa-caret-up');
                icon.classList.add('fa-caret-down');
            }
            moveNavbar();
        });
        updateNoticeBar();
        moveNavbar();
    }



    function scrollNav() {
        let scrollClass = 'affix';
        if(window.scrollY > 50) body.classList.add(scrollClass);
        else if(window.scrollY === 0) body.classList.remove(scrollClass);
    }
    function collapseNav() {
        // Code will only execute if the hamburger menu is disabled
        if($('.desktop-nav').style.display === 'none') return;
        let nav = $('.desktop-nav ul');
        let moreMenu = nav.children[nav.children.length - 1];

        Array.from(nav.children).forEach(el => {
            if(el.style.display === 'none') el.style.display = '';
        });
        Array.from($('.more-subnav-content a -f', moreMenu)).forEach(el => {
            if(el.style.display !== 'none') el.style.display = '';
        });

        let counter = 2;
        let removedEls = [];
        body.classList.add('more-subnav-enabled');

        while(nav.offsetHeight > 50) {
            let removeEl = nav.children[nav.children.length - counter];
            if(removeEl === moreMenu) {
                counter++;
                removeEl = nav.children[nav.children.length - counter];
            }
            removeEl.style.display = 'none';

            removedEls.push($('a', removeEl));
            counter++;
        }

        if (removedEls.length > 0) body.classList.add('more-subnav-enabled');
        else body.classList.remove('more-subnav-enabled');

        let moreNavContent = Array.from($('.desktop-nav ul .more-subnav-wrap > div a -f'));
        moreNavContent.reverse();
        let moreNavContentHTML = [];
        moreNavContent.forEach(el => moreNavContentHTML.push(el.classList.contains('active') ?
            $('span', el).innerHTML : el.innerHTML));

        for(let i = 0; i < removedEls.length; i++) {
            if(moreNavContentHTML.includes(removedEls[i].innerHTML)) moreNavContent[i].style.display = 'block';

        }
    }

    function moveNavbar() {
        let noticeBar = $('.notice-bar');
        if(!noticeBar) return;
        let navbar = getNavbar();
        if(noticeBar.style.display !== 'none') navbar.style.top = noticeBar.offsetHeight + 'px';
        else navbar.style.top = '';
    }
    function updateNoticeBar() {
        let noticeBar = $('.notice-bar');
        if (getCookie('noticeBarClosed')) noticeBar.style.display = '';
        else noticeBar.style.display = 'flex';
    }

    function getNavbar() {
        let desktopNav = $('.desktop-nav');
        return desktopNav.style.display !== 'none' ? desktopNav : $('.mobile-nav');
    }
    function setCookie(name, value, expires) {
        let expiresValue = expires !== 'session' ? expires.split(/(s|min|hr|d)/)[0] : null;
        let expiresUnit = expiresValue ? expires.split(/[0-9]+/)[1] : null;
        let factor = -1;
        switch(expiresUnit) {
            case 's': factor = 1000; break;
            case 'min': factor = 1000 * 60; break;
            case 'hr': factor = 1000 * 60 * 60; break;
            case 'd': factor = 1000 * 60 * 60 * 24; break;
            default: console.error('Invalid setCookie format!'); break;
        }
        const date = new Date();
        date.setTime(date.getTime() + expiresValue * factor);

        document.cookie = name + '=' + value + ';' + 'expires=' + (expiresValue ? date.toUTCString() : 'session') + ';path=/';
    }
    function getCookie(cname) {
        let name = cname + '=';
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
           let c = ca[i];
           while (c.charAt(0) === ' ') c = c.substring(1);

           if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
        }
        return '';
    }
});