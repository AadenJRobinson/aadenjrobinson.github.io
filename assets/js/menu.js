function $(selector, ctx) {
    // Returns all elements with the given selector if flagged with -f (defaults to querySelector)
    let findAll = / -f$/;
    return findAll.test(selector) ? (ctx || document).querySelectorAll(selector.split(findAll)[0]) : (ctx || document).querySelector(selector);
}
const deviceChecker = {
    regex1: /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i,
    regex2: /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i,
    isMobile: function (userAgent) {
        return this.regex1.test(userAgent) || this.regex2.test(userAgent);
    }
};

document.addEventListener('DOMContentLoaded', function() {
    let body = $('body');
    body.classList.add('fade-in');
    scrollNav();
    collapseNav();
    registerEvents();

    function scrollNav() {
        let scrollClass = 'affix';
        if(window.scrollY > 50) body.classList.add(scrollClass);
        else if(window.scrollY === 0) body.classList.remove(scrollClass);
    }

    function collapseNav() {
        // Code will only execute if the hamburger menu is enabled (desktop nav is disabled)
        if($('.desktop-nav').style.display === 'none') return;
        let nav = $('.nav-default');

        Array.from(nav.children).forEach(el => {
            if(el.style.display === 'none') el.style.display = '';
        });

        let counter = 2;
        let moreMenu = nav.children[nav.children.length - 1];
        let removedEls = [];
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
        let moreNavContent = Array.from($('.nav-default .more-subnav-wrap > div a -f'));
        moreNavContent.reverse();
        let moreNavContentHTML = [];
        moreNavContent.forEach(el => moreNavContentHTML.push(el.innerHTML));
        for(let i = 0; i < removedEls.length; i++) {
            if(moreNavContentHTML.includes(removedEls[i].innerHTML)) {
                moreNavContent[i].style.display = 'block';
            }
        }
    }

    function registerEvents() {
        $('.hamburger -f').forEach(function(hamburger) {
            hamburger.addEventListener('click', function (e) {
                e.preventDefault();
                if (!body.classList.contains('nav-open')) body.classList.add('nav-open');
                else body.classList.remove('nav-open');
            });
        });
        window.addEventListener('scroll', scrollNav);
        window.addEventListener('resize', collapseNav);
    }
});