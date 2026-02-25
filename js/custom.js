AOS.init({
	duration: 800,
	easing: 'slide',
	once: true
});

$(function(){

	'use strict';

	$(".loader").delay(0).fadeOut("slow");
	$("#overlayer").delay(0).fadeOut("slow");	

	var siteMenuClone = function() {

		$('.js-clone-nav').each(function() {
			var $this = $(this);
			$this.clone().attr('class', 'site-nav-wrap').appendTo('.site-mobile-menu-body');
		});


		setTimeout(function() {
			
			var counter = 0;
			$('.site-mobile-menu .has-children').each(function(){
				var $this = $(this);

				$this.prepend('<span class="arrow-collapse collapsed">');

				$this.find('.arrow-collapse').attr({
					'data-toggle' : 'collapse',
					'data-target' : '#collapseItem' + counter,
				});

				$this.find('> ul').attr({
					'class' : 'collapse',
					'id' : 'collapseItem' + counter,
				});

				counter++;

			});

		}, 1000);

		$('body').on('click', '.arrow-collapse', function(e) {
			var $this = $(this);
			if ( $this.closest('li').find('.collapse').hasClass('show') ) {
				$this.removeClass('active');
			} else {
				$this.addClass('active');
			}
			e.preventDefault();  

		});

		$(window).resize(function() {
			var $this = $(this),
			w = $this.width();

			if ( w > 768 ) {
				if ( $('body').hasClass('offcanvas-menu') ) {
					$('body').removeClass('offcanvas-menu');
				}
			}
		})

		$('body').on('click', '.js-menu-toggle', function(e) {
			var $this = $(this);
			e.preventDefault();

			if ( $('body').hasClass('offcanvas-menu') ) {
				$('body').removeClass('offcanvas-menu');
				$('body').find('.js-menu-toggle').removeClass('active');
			} else {
				$('body').addClass('offcanvas-menu');
				$('body').find('.js-menu-toggle').addClass('active');
			}
		}) 

		// click outisde offcanvas
		$(document).mouseup(function(e) {
			var container = $(".site-mobile-menu");
			if (!container.is(e.target) && container.has(e.target).length === 0) {
				if ( $('body').hasClass('offcanvas-menu') ) {
					$('body').removeClass('offcanvas-menu');
					$('body').find('.js-menu-toggle').removeClass('active');
				}
			}
		});
	}; 
	siteMenuClone();

	var owlPlugin = function() {
		if ( $('.owl-single').length > 0 ) {
			var owl = $('.owl-single').owlCarousel({
		    loop: true,
		    autoHeight: true,
		    margin: 0,
		    autoplay: true,
		    smartSpeed: 1000,
		    items: 1,
		    nav: true,
		    navText: ['<span class="icon-keyboard_backspace"></span>','<span class="icon-keyboard_backspace"></span>']
			});

			owl.on('initialized.owl.carousel', function() {
				owl.trigger('refresh.owl.carousel');
			});

			$('.custom-owl-next').click(function(e) {
				e.preventDefault();
				owl.trigger('next.owl.carousel');
			})
			$('.custom-owl-prev').click(function(e) {
				e.preventDefault();
				owl.trigger('prev.owl.carousel');
			})
		}


		if ( $('.owl-logos').length > 0 ) {
			var owl3 = $('.owl-logos').owlCarousel({
				loop: true,
				autoHeight: true,
				margin: 10,
				autoplay: true,
				smartSpeed: 700,
				items: 4,
				stagePadding: 0,
				nav: true,
				dots: true,
				navText: ['<span class="icon-keyboard_backspace"></span>','<span class="icon-keyboard_backspace"></span>'],
				responsive:{
					0:{
						items:1
					},
					600:{
						items:1
					},
					800: {
						items:2
					},
					1000:{
						items:3
					},
					1100:{
						items:5
					}
				}
			});
		}
		
		if ( $('.owl-3-slider').length > 0 ) {
			var owl3 = $('.owl-3-slider').owlCarousel({
				loop: true,
				autoHeight: true,
				margin: 10,
				autoplay: true,
				smartSpeed: 700,
				items: 4,
				stagePadding: 0,
				nav: true,
				dots: true,
				navText: ['<span class="icon-keyboard_backspace"></span>','<span class="icon-keyboard_backspace"></span>'],
				responsive:{
					0:{
						items:1
					},
					600:{
						items:1
					},
					800: {
						items:2
					},
					1000:{
						items:2
					},
					1100:{
						items:3
					}
				}
			});
		}
		$('.js-custom-next-v2').click(function(e) {
			e.preventDefault();
			owl3.trigger('next.owl.carousel');
		})
		$('.js-custom-prev-v2').click(function(e) {
			e.preventDefault();
			owl3.trigger('prev.owl.carousel');
		})
	}
	owlPlugin();

	var counter = function() {
		
		$('.count-numbers').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('ut-animated') ) {

				var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',')
				$('.counter > span').each(function(){
					var $this = $(this),
					num = $this.data('number');
					$this.animateNumber(
					{
						number: num,
						numberStep: comma_separator_number_step
					}, 10000,
					function() {
			      // $('.counter-caption').addClass('active')
			    }
					);
				});
				
			}

		} , { offset: '95%' } );

	}
	counter();

	var portfolioMasonry = function() {
		$('.filters ul li').click(function(){
			$('.filters ul li').removeClass('active');
			$(this).addClass('active');
			
			var data = $(this).attr('data-filter');
			$grid.isotope({
				filter: data
			})
		});


		if(document.getElementById("portfolio-section")){
			var $grid = $(".grid").isotope({
				itemSelector: ".all",
				percentPosition: true,
				masonry: {
					columnWidth: ".all"
				}
			})

			$grid.imagesLoaded().progress( function() {
				$grid.isotope('layout');
			});  
			
		};


	};
	portfolioMasonry();

	$('.js-search-toggle').on('click', function() {
		$('.search-wrap').toggleClass('active');

		setTimeout(function() {
			$('#s').focus();
		}, 400);
	})

	$(document).mouseup(function(e) {
    var container = $(".search-wrap form");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      if ( $('.search-wrap').hasClass('active') ) {
				$('.search-wrap').removeClass('active');
			}
    }
	}); 

	var siteStellar = function() {
		$(window).stellar({
	    responsive: false,
	    parallaxBackgrounds: true,
	    parallaxElements: true,
	    horizontalScrolling: false,
	    hideDistantElements: false,
	    scrollProperty: 'scroll'
	  });
	};
	siteStellar();

	var pricing = function() {
		$('.js-period-toggle').on('click', function(e) {
			var $this = $(this),
				pricingItem = $('.pricing-item');
			if ( $('.period-toggle').hasClass('active') ) {
				$this.removeClass('active');
				pricingItem.removeClass('yearly');
			} else {
				$this.addClass('active');
				pricingItem.addClass('yearly');
			}
			e.preventDefault();
		})
	}
	pricing();

	document.addEventListener('scroll', function() {
		const navbar = document.querySelector('.site-nav');
		const menu_item = document.querySelector('.active a');
		// console.log(menu_item);
		if (window.scrollY > 500) { 
			navbar.style = 'background-color: rgba(0,0,0,0.9); backdrop-filter: blur(5px); box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);'
			// console.log("In"); 
		} else {
			navbar.style = 'background-color: transparent; backdrop-filter: none; box-shadow: none;'
			// console.log("Out");
		}
	});
/* bind contact form once DOM is ready (we're already inside $(function(){}) above)
		const form = document.getElementById('contactForm');
		if (form) {
			form.addEventListener('submit', async (event) => {
				event.preventDefault(); // Prevent default form submission
		
				const formData = new FormData(form);
				// debug info
				console.log('Submitting contact form', [...formData.entries()]);
		
				try {
					const response = await fetch('lead.php', {
						method: 'POST',
						body: formData
					});
					console.log('Fetch response', response.status, response.statusText);
			
					if (response.ok) {
						alert('Form submitted successfully!');
					} else {
						const text = await response.text();
						console.error('Server error:', text);
						alert('Form submission failed.');
					}
				} catch (error) {
					console.error('Fetch error:', error);
					alert('An error occurred.');
				}
			});
		} else {
			// no contact form on this page; nothing to do
			// logging removed to avoid noise
		}*/
	
})
// standalone submission handler using Cloudflare Worker or other serverless API\nconst workerForm = document.getElementById('contactForm');\nif (workerForm) {\n    workerForm.addEventListener('submit', async (event) => {\n        event.preventDefault();\n        const formData = new FormData(workerForm);\n        console.log('Submitting contact form via worker endpoint', [...formData.entries()]);\n        try {\n            const resp = await fetch('/form-submit', { // change URL to your worker route\n                method: 'POST',\n                body: formData\n            });\n            console.log('Worker fetch status', resp.status, resp.statusText);\n            if (resp.ok) {\n                alert('Form submitted successfully!');\n            } else {\n                const json = await resp.json().catch(() => null);\n                console.error('Worker error', json || await resp.text());\n                alert('Form submission failed.');\n            }\n        } catch (err) {\n            console.error('Fetch error', err);\n            alert('Error submitting form.');\n        }\n    });\n} else {\n    // no contact form on page\n}\n
