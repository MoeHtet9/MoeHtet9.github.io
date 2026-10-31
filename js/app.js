$(function () {
  const $window = $(window);
  const $navbar = $('#mainNav');
  const $backToTop = $('.back-top');
  const $navLinks = $('.nav-link');
  const $navMenu = $('#navMenu');

  // Keep the footer year current.
  $('#year').text(new Date().getFullYear());

  // Update navigation state and reveal elements while scrolling.
  function updatePage() {
    const scrollTop = $window.scrollTop();
    const viewportBottom = scrollTop + $window.height();

    $navbar.toggleClass('scrolled', scrollTop > 35);
    $backToTop.toggleClass('show', scrollTop > 450);

    $navLinks.each(function () {
      const $link = $(this);
      const $section = $($link.attr('href'));

      if (!$section.length) return;

      const sectionTop = $section.offset().top - 150;
      const sectionBottom = sectionTop + $section.outerHeight();
      const isActive = scrollTop >= sectionTop && scrollTop < sectionBottom;

      if (isActive) {
        $navLinks.removeClass('active');
        $link.addClass('active');
      }
    });

    $('.reveal:not(.visible)').each(function () {
      const $element = $(this);
      const elementTop = $element.offset().top;

      if (viewportBottom > elementTop + 45) {
        $element.addClass('visible');

        $element.find('.progress-bar').each(function () {
          const width = $(this).data('width');
          $(this).css('width', width);
        });
      }
    });
  }

  // Use a single handler for scroll and resize events.
  $window.on('scroll resize', updatePage);
  updatePage();

  // Close the mobile menu after selecting a navigation item.
  $('.nav-link, #navMenu .btn-main, .hero-actions a, .brand, .back-top').on('click', function () {
    $navMenu.removeClass('show');
  });

  // Front-end demo only. Connect this form to a Laravel endpoint to send messages.
  $('#contactForm').on('submit', function (event) {
    event.preventDefault();
    $('#formMessage').text(
      'Thanks! Connect this form to your Laravel mail route to receive messages.'
    );
    this.reset();
  });
});
