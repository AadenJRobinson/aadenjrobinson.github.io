jQuery(function($) {

    // Fixed nav
    $.fn.checkHeaderPositioning = function(scrollEl, scrollClass) {
        var $me = $(this);

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
    var $me = this;

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
    var counter = 0;
    var looper = setInterval(function(){
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

  var birdseyeController = {
    init: function(opts) {
      var base = this;

      $('body').checkHeaderPositioning(window, 'affix');

      // Add classes to elements
      base._addClasses();
      base._attachEvents();
    },

    _addClasses: function() {
      var base = this;

      // Add fade in class to nav + logo + banner
        $('body').addClass('fade-in');

      // Add class to nav items with subnav
      $('.menu-default').find('li.menu-item-wrap').each(function(){
        var $me = $(this);

        if($me.children('.menu-wrap').length > 0) {
          $me.addClass('has-submenu');
          $('<span class="icon-caret"></span>').insertAfter($me.children('a.menu-item'));
        }
      });

      // Add class to subnav items with subnav
      $('.menu').find('li.menu-subitem-wrap').each(function(){
        var $me = $(this);

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
            var sublabel = $(this).text();
            $(this).prev('.form-input').attr('placeholder', sublabel);
          });
        }, 1000);
    },

    _moveLogin: function() {
      $('.wsite-accounts').appendTo('#account-links');
    },

    _moveFlyout: function() {
      $('.wsite-search').appendTo('#search-links');
      $('.wsite-search').addClass('flyout');
      $('<span class="icon-search"></span>').appendTo('#search-links');

      $('.wsite-search').on('click', function(e){
        e.stopPropagation();
      });

      $(document).on('click', function(){
        $('.wsite-search').removeClass('open');
      });

      $('#search-links .icon-search').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        $('.wsite-search').toggleClass('open');
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

        // Move cart + login
        $.fn.intervalLoop('.mobile-nav #member-login', base._moveLogin, 800, 5);

        // Move Flyout
        $.fn.intervalLoop('.birdseye-header #menus', base._moveFlyout, 300, 8);

        // Move Cart
        $.fn.intervalLoop('.birdseye-header #mini-cart', base._moveCart, 300, 8);

        // Check Cart

        $.fn.intervalLoop('body.cart-full', base._checkCartItems, 300, 10);

        // Window scroll

        // Fixed header
        $(window).on('scroll', function() {
          $('body').checkHeaderPositioning(window, 'affix');
        });

        // Subnav toggle
        $('li.has-submenu span.icon-caret').on('click', function() {
            var $me = $(this);

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