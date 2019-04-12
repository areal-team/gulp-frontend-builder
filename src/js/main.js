'use strict';

$(function() {
    $('.js-main-slider').owlCarousel({
        items: 1,
        loop: true,
        nav: true,
        animateOut: 'fadeOut'
    });


    $('.js-parallax').parallax();
});
