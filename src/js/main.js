$(document).ready(function () {
  $('.owl-carousel').owlCarousel({
    center: true,
    items: 2,
    loop: true,
    margin: 20,
    responsive: {
      767: {
        items: 3,
        loop: false,
        center: false,
        touchDrag: false,
      },
    },
  });

  $('.hero__counter').each(function () {
    $(this)
      .prop('Counter', 0)
      .animate(
        {
          Counter: $(this).text(),
        },
        {
          duration: 4000,
          easing: 'swing',
          step: function (now) {
            $(this).text(Math.ceil(now));
          },
        }
      );
  });

  $('.header__hamburger').on('click', function (event) {
    event.preventDefault();
    $(this).toggleClass('is-active');
    $('nav>ul').toggleClass('active-menu');
    $('nav>ul li:eq(0)').fadeTo('1500', 1, function () {
      $(this).next().fadeTo('1500', 1, arguments.callee);
    });
  });
});
