jQuery(function($) {

    // Fixed nav
    $.fn.checkHeaderPositioning = function(scrollEl, scrollClass) {
        let $me = $(this);

        if (!$me.length) {
          return;
        }

        if($(scrollEl).scrollTop() > 50) {
            $me.addClass(scrollClass);
        } else if($(scrollEl).scrollTop() === 0) {
            $me.removeClass(scrollClass);
        }
    };

  // Mobile sidebars
  $.fn.expandableSidebar = function(expandedClass) {
    let $me = this;

    $me.on('click', function() {
      if(!$me.hasClass(expandedClass)) {
        $me.addClass(expandedClass);
      } else {
        $me.removeClass(expandedClass);
      }
    });
  }

  // Interval loop
  $.fn.intervalLoop = function(condition, action, duration, limit) {
    let counter = 0;
    let looper = setInterval(function(){
      if (counter >= limit || $.fn.checkIfElementExists(condition)) {
        clearInterval(looper);
      } else {
        //action();
        counter++;
      }
    }, duration);
  }

  // Check if element exists
  $.fn.checkIfElementExists = function(selector) {
    return $(selector).length;
  }

  let birdseyeController = {
    init: function(opts) {
      let base = this;

      $('body').checkHeaderPositioning(window, 'affix');

      // Add classes to elements
      base._addClasses();
      base._attachEvents();
    },

    _addClasses: function() {
      let base = this;

      // Add fade in class to nav + logo + header
        $('body').addClass('fade-in');

      // Add class to nav items with subnav
      $('.menu-default').find('li.menu-item-wrap').each(function(){
        let $me = $(this);

        if($me.children('.menu-wrap').length > 0) {
          $me.addClass('has-submenu');
          $('<span class="icon-caret"></span>').insertAfter($me.children('a.menu-item'));
        }
      });

      // Add class to subnav items with subnav
      $('.menu').find('li.menu-subitem-wrap').each(function(){
        let $me = $(this);

        if($me.children('.menu-wrap').length > 0) {
          $me.addClass('has-submenu');
          $('<span class="icon-caret"></span>').insertAfter($me.children('a.menu-subitem'));
        }
      });

        // Keep subnav open if submenu item is active
        if ($(window).width() < 1024) {
          $('li.menu-subitem-wrap.nav-current').parents('.menu-wrap').addClass('open');
        }

      // Add placeholder text to inputs
      setTimeout(function(){
        $('.form-sublabel').each(function(){
            let sublabel = $(this).text();
            $(this).prev('.form-input').attr('placeholder', sublabel);
          });
        }, 1000);
    },

    _moveLogin: function() {
      $('.accounts').appendTo('#account-links');
    },

    _moveFlyout: function() {
      $('.search').appendTo('#search-links');
      $('.search').addClass('flyout');
      $('<span class="icon-search"></span>').appendTo('#search-links');

      $('.search').on('click', function(e){
        e.stopPropagation();
      });

      $(document).on('click', function(){
        $('.search').removeClass('open');
      });

      $('#search-links .icon-search').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        $('.search').toggleClass('open');
      });
    },

    _attachEvents: function() {
        const base = this;

        $('.hamburger').on('click', function(e) {
            e.preventDefault();
            if (!$('body').hasClass('nav-open')) {
                $('body').addClass('nav-open');
            } else {
                $('body').removeClass('nav-open');
            }
        });

        // Window scroll

        // Fixed header
        $(window).on('scroll', function() {
          $('body').checkHeaderPositioning(window, 'affix');
        });

        // Subnav toggle
        $('li.has-submenu span.icon-caret').on('click', function() {
            let $me = $(this);

            if($me.siblings('.menu-wrap').hasClass('open')) {
                $me.siblings('.menu-wrap').removeClass('open');
            } else {
                $me.siblings('.menu-wrap').addClass('open');
            }
        });

      // Store category dropdown
      $('.com-sidebar').expandableSidebar('sidebar-expanded');

      // Search filters dropdown
      $('#search-sidebar').expandableSidebar('sidebar-expanded');

      // Init fancybox swipe on mobile
      if ('ontouchstart' in window) {
        $('body').on('click', 'a.w-fancybox', function() {
          base._initSwipeGallery();
        });
      }
    }
  }

  $(document).ready(function(){
    birdseyeController.init();
  });
});