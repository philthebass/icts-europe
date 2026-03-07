( function () {
	function initLatestNewsSliders( context ) {
		var root = context || document;
		var sliders = root.querySelectorAll( '.js-icts-latest-news-slider:not(.is-icts-latest-news-slider-init)' );

		if ( ! sliders.length || typeof Flickity === 'undefined' ) {
			return;
		}

		sliders.forEach( function ( sliderEl ) {
			sliderEl.classList.add( 'is-icts-latest-news-slider-init' );

			var container = sliderEl.closest( '.icts-latest-news-slider-block' );
			var isRtl = !!( document.documentElement && document.documentElement.getAttribute( 'dir' ) === 'rtl' );
			var prefersReducedMotion = !!(
				window.matchMedia && window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches
			);
			var autoPlayMs = 7000;

			if ( container && container.dataset && container.dataset.autoplay ) {
				var parsedDuration = parseInt( container.dataset.autoplay, 10 );
				if ( ! Number.isNaN( parsedDuration ) && parsedDuration > 0 ) {
					autoPlayMs = parsedDuration;
				}
			}

			if ( prefersReducedMotion ) {
				autoPlayMs = 0;
			}

			if ( container ) {
				if ( autoPlayMs ) {
					container.style.setProperty( '--icts-latest-news-autoplay', String( autoPlayMs ) + 'ms' );
				}
				container.classList.toggle( 'is-latest-news-no-autoplay', ! autoPlayMs );
				container.classList.remove( 'is-latest-news-playing' );
			}

			var flkty = new Flickity( sliderEl, {
				cellSelector: '.icts-latest-news-slider__cell',
				wrapAround: true,
				contain: true,
				prevNextButtons: true,
				pageDots: false,
				autoPlay: false,
				pauseAutoPlayOnHover: false,
				rightToLeft: isRtl,
				adaptiveHeight: false,
				draggable: true
			} );

			function refreshLayout() {
				if ( ! flkty || flkty.isDestroyed ) {
					return;
				}

				var maxCellHeight = 0;
				sliderEl.querySelectorAll( '.icts-latest-news-slider__cell' ).forEach( function ( cell ) {
					cell.style.minHeight = '';
					var cellHeight = cell.getBoundingClientRect().height;
					if ( cellHeight > maxCellHeight ) {
						maxCellHeight = cellHeight;
					}
				} );

				if ( maxCellHeight > 0 ) {
					var pixelHeight = String( Math.ceil( maxCellHeight ) ) + 'px';
					sliderEl.querySelectorAll( '.icts-latest-news-slider__cell' ).forEach( function ( cell ) {
						cell.style.minHeight = pixelHeight;
					} );
					if ( flkty.viewport ) {
						flkty.viewport.style.height = pixelHeight;
					}
				}

				flkty.resize();
				flkty.reposition();
			}

			setTimeout( refreshLayout, 0 );
			setTimeout( refreshLayout, 120 );
			window.addEventListener( 'load', refreshLayout, { once: true } );
			window.addEventListener( 'resize', refreshLayout );
			if ( autoPlayMs ) {
				var isInViewport = false;
				var isHovered = false;
				var autoplayTimer = null;
				var pageIsFullyLoaded = document.readyState === 'complete';
				var initialLayoutReady = false;

				function clearAutoplayTimer() {
					if ( autoplayTimer ) {
						window.clearTimeout( autoplayTimer );
						autoplayTimer = null;
					}
				}

				function updatePlayingState( playing ) {
					if ( container ) {
						container.classList.toggle( 'is-latest-news-playing', playing );
					}
				}

				function scheduleNextAutoplay() {
					clearAutoplayTimer();

					if ( ! isInViewport || ! pageIsFullyLoaded || ! initialLayoutReady || isHovered ) {
						updatePlayingState( false );
						return;
					}

					updatePlayingState( true );
					autoplayTimer = window.setTimeout( function () {
						autoplayTimer = null;

						if ( ! isInViewport || ! pageIsFullyLoaded || ! initialLayoutReady || isHovered ) {
							updatePlayingState( false );
							return;
						}

						flkty.next( true );
					}, autoPlayMs );
				}

				function startAutoplayCycle() {
					scheduleNextAutoplay();
				}

				function stopAutoplayCycle() {
					clearAutoplayTimer();
					updatePlayingState( false );
				}

				// Flickity's arrow buttons do not always trigger pointerDown on the carousel.
				// Clear the current timer on manual nav so the next slide waits a full interval.
				sliderEl.querySelectorAll( '.flickity-prev-next-button' ).forEach( function ( buttonEl ) {
					buttonEl.addEventListener( 'click', stopAutoplayCycle );
				} );

				window.addEventListener(
					'load',
					function () {
						pageIsFullyLoaded = true;
						refreshLayout();
						startAutoplayCycle();
					},
					{ once: true }
				);

				sliderEl.addEventListener( 'mouseenter', function () {
					isHovered = true;
					stopAutoplayCycle();
				} );

				sliderEl.addEventListener( 'mouseleave', function () {
					isHovered = false;
					startAutoplayCycle();
				} );

				flkty.on( 'pointerDown', stopAutoplayCycle );
				flkty.on( 'settle', function () {
					refreshLayout();
					if ( isInViewport && pageIsFullyLoaded && initialLayoutReady && ! isHovered ) {
						scheduleNextAutoplay();
					}
				} );

				function completeInitialLayout() {
					if ( initialLayoutReady ) {
						return;
					}

					initialLayoutReady = true;
					refreshLayout();
					startAutoplayCycle();
				}

				// Do not gate autoplay on all lazy-loaded images.
				// Initialize immediately and let periodic layout refresh handle late image loads.
				setTimeout( completeInitialLayout, 0 );

				if ( 'IntersectionObserver' in window ) {
					var observer = new IntersectionObserver(
						function ( entries ) {
							entries.forEach( function ( entry ) {
								if ( ! entry.isIntersecting ) {
									isInViewport = false;
									stopAutoplayCycle();
									return;
								}

								isInViewport = true;
								startAutoplayCycle();
							} );
						},
						{ threshold: 0.35 }
					);

					observer.observe( sliderEl );
				} else {
					isInViewport = true;
					startAutoplayCycle();
				}
			} else {
				flkty.on( 'settle', refreshLayout );
				sliderEl.querySelectorAll( 'img' ).forEach( function ( img ) {
					if ( ! img.complete ) {
						img.addEventListener( 'load', refreshLayout, { once: true } );
						img.addEventListener( 'error', refreshLayout, { once: true } );
					}
				} );
				setTimeout( refreshLayout, 180 );
				setTimeout( refreshLayout, 380 );
			}
		} );
	}

	document.addEventListener( 'DOMContentLoaded', function () {
		if ( document.body && document.body.classList.contains( 'block-editor-page' ) ) {
			return;
		}
		initLatestNewsSliders( document );
	} );

	if ( typeof window !== 'undefined' ) {
		window.ICTS = window.ICTS || {};
		window.ICTS.initLatestNewsSliders = initLatestNewsSliders;
	}
} )();
