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
			}

			var flkty = new Flickity( sliderEl, {
				cellSelector: '.icts-latest-news-slider__cell',
				wrapAround: true,
				groupCells: true,
				contain: true,
				prevNextButtons: true,
				pageDots: false,
				autoPlay: false,
				pauseAutoPlayOnHover: !!autoPlayMs,
				rightToLeft: isRtl,
				adaptiveHeight: true
			} );

			function equalizeCardHeights() {
				var cards = sliderEl.querySelectorAll( '.icts-latest-news-slider__card' );
				if ( ! cards.length ) {
					return;
				}

				cards.forEach( function ( card ) {
					card.style.minHeight = '';
				} );

				var maxCardHeight = 0;
				cards.forEach( function ( card ) {
					var cardHeight = card.getBoundingClientRect().height;
					if ( cardHeight > maxCardHeight ) {
						maxCardHeight = cardHeight;
					}
				} );

				if ( maxCardHeight > 0 ) {
					var pixelHeight = String( Math.ceil( maxCardHeight ) ) + 'px';
					cards.forEach( function ( card ) {
						card.style.minHeight = pixelHeight;
					} );
				}
			}

			function refreshLayout() {
				if ( ! flkty || flkty.isDestroyed ) {
					return;
				}

				equalizeCardHeights();
				flkty.resize();
				flkty.reposition();

				if ( flkty.viewport ) {
					var maxCellHeight = 0;
					sliderEl.querySelectorAll( '.icts-latest-news-slider__cell' ).forEach( function ( cell ) {
						var cellHeight = cell.getBoundingClientRect().height;
						if ( cellHeight > maxCellHeight ) {
							maxCellHeight = cellHeight;
						}
					} );

					if ( maxCellHeight > 0 ) {
						flkty.viewport.style.height = String( Math.ceil( maxCellHeight ) ) + 'px';
					}
				}
			}

			flkty.on( 'settle', refreshLayout );

			setTimeout( refreshLayout, 0 );
			window.addEventListener( 'load', refreshLayout, { once: true } );
			window.addEventListener( 'resize', refreshLayout );

			if ( autoPlayMs ) {
				flkty.options.autoPlay = autoPlayMs;
				flkty.stopPlayer();
				var isInViewport = false;
				var isPlaying = false;
				var pageIsFullyLoaded = document.readyState === 'complete';
				var initialLayoutReady = false;

				function startAutoplayCycle() {
					if ( isPlaying ) {
						return;
					}

					flkty.stopPlayer();
					flkty.playPlayer();
					isPlaying = true;
				}

				function stopAutoplayCycle() {
					if ( ! isPlaying ) {
						return;
					}

					flkty.stopPlayer();
					isPlaying = false;
				}

				function maybeStartAutoplay() {
					if ( isInViewport && pageIsFullyLoaded && initialLayoutReady ) {
						setTimeout( startAutoplayCycle, 40 );
					}
				}

				window.addEventListener(
					'load',
					function () {
						pageIsFullyLoaded = true;
						maybeStartAutoplay();
					},
					{ once: true }
				);

				var pendingImages = 0;
				var images = sliderEl.querySelectorAll( 'img' );

				function completeInitialLayout() {
					if ( initialLayoutReady ) {
						return;
					}

					refreshLayout();
					flkty.select( 0, false, true );
					initialLayoutReady = true;
					maybeStartAutoplay();
				}

				if ( images.length ) {
					images.forEach( function ( img ) {
						if ( img.complete ) {
							return;
						}

						pendingImages += 1;

						var onImageDone = function () {
							pendingImages -= 1;
							refreshLayout();
							if ( pendingImages <= 0 ) {
								completeInitialLayout();
							}
						};

						img.addEventListener( 'load', onImageDone, { once: true } );
						img.addEventListener( 'error', onImageDone, { once: true } );
					} );
				}

				if ( pendingImages === 0 ) {
					setTimeout( completeInitialLayout, 0 );
				}

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
								maybeStartAutoplay();
							} );
						},
						{
							threshold: 0.35
						}
					);

					observer.observe( sliderEl );
				} else {
					isInViewport = true;
					maybeStartAutoplay();
				}
			} else {
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
