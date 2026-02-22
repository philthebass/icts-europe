( function () {
	'use strict';

	var resizeTimer = null;

	function parseIntSafe( value, fallback ) {
		var parsed = parseInt( value, 10 );
		return Number.isFinite( parsed ) ? parsed : fallback;
	}

	function formatCounterValue( value ) {
		var numeric = parseIntSafe( value, 0 );
		var sign = numeric < 0 ? '-' : '';
		var abs = Math.abs( numeric );

		return sign + String( abs ).replace( /\B(?=(\d{3})+(?!\d))/g, ',' );
	}

	function animateCounter( node, prefersReducedMotion ) {
		if ( ! node || node.dataset.counterAnimated === '1' ) {
			return;
		}

		var from = parseIntSafe( node.dataset.from, 0 );
		var to = parseIntSafe( node.dataset.to, from );
		var duration = Math.max( 200, parseIntSafe( node.dataset.duration, 1600 ) );
		var range = to - from;

		node.dataset.counterAnimated = '1';

		if ( prefersReducedMotion || from === to ) {
			node.textContent = formatCounterValue( to );
			return;
		}

		node.textContent = formatCounterValue( from );

		var startTime = null;

		var tick = function ( now ) {
			if ( null === startTime ) {
				startTime = now;
			}

			var elapsed = now - startTime;
			var progress = Math.min( elapsed / duration, 1 );
			var eased = 1 - Math.pow( 1 - progress, 3 );
			var current = from + range * eased;
			var nextValue = range >= 0 ? Math.floor( current ) : Math.ceil( current );

			node.textContent = formatCounterValue( nextValue );

			if ( progress < 1 ) {
				window.requestAnimationFrame( tick );
				return;
			}

			node.textContent = formatCounterValue( to );
		};

		window.requestAnimationFrame( tick );
	}

	function getCounterGroupKey( block ) {
		if ( ! block ) {
			return null;
		}

		var layoutGroup = block.closest( '.is-layout-grid, .is-layout-flex, .wp-block-columns' );
		return layoutGroup || block.parentElement;
	}

	function equalizeCounterHeights() {
		var blocks = Array.prototype.slice.call(
			document.querySelectorAll( '.icts-counter-block' )
		);

		if ( ! blocks.length ) {
			return;
		}

		var groups = new Map();

		blocks.forEach( function ( block ) {
			var key = getCounterGroupKey( block );
			if ( ! key ) {
				return;
			}

			if ( ! groups.has( key ) ) {
				groups.set( key, [] );
			}

			groups.get( key ).push( block );
		} );

		groups.forEach( function ( groupBlocks ) {
			var cards = groupBlocks
				.map( function ( block ) {
					return block.querySelector( '.icts-counter-block__inner' );
				} )
				.filter( Boolean );

			if ( cards.length < 2 ) {
				return;
			}

			cards.forEach( function ( card ) {
				card.style.minBlockSize = '';
				card.style.blockSize = '';
			} );

			var group = getCounterGroupKey( groupBlocks[ 0 ] );
			var isSingleNoWrapRow = group && group.classList.contains( 'is-nowrap' );

			if ( isSingleNoWrapRow ) {
				var maxRowHeight = 0;

				cards.forEach( function ( card ) {
					maxRowHeight = Math.max( maxRowHeight, card.offsetHeight );
				} );

				if ( maxRowHeight > 0 ) {
					cards.forEach( function ( card ) {
						card.style.minBlockSize = String( maxRowHeight ) + 'px';
						card.style.blockSize = String( maxRowHeight ) + 'px';
					} );
				}

				return;
			}

			var rows = [];

			cards.forEach( function ( card ) {
				var top = card.getBoundingClientRect().top;
				var center = top + card.offsetHeight / 2;
				var row = rows.find( function ( currentRow ) {
					return Math.abs( currentRow.center - center ) < 6;
				} );

				if ( ! row ) {
					row = { center: center, cards: [] };
					rows.push( row );
				}

				row.cards.push( card );
			} );

			rows.forEach( function ( row ) {
				var maxHeight = 0;

				row.cards.forEach( function ( card ) {
					maxHeight = Math.max( maxHeight, card.offsetHeight );
				} );

				if ( maxHeight <= 0 ) {
					return;
				}

				row.cards.forEach( function ( card ) {
					card.style.minBlockSize = String( maxHeight ) + 'px';
					card.style.blockSize = String( maxHeight ) + 'px';
				} );
			} );
		} );
	}

	function scheduleEqualizeCounterHeights() {
		if ( resizeTimer ) {
			window.clearTimeout( resizeTimer );
		}

		resizeTimer = window.setTimeout( equalizeCounterHeights, 80 );
	}

	function initCounters() {
		var counters = Array.prototype.slice.call(
			document.querySelectorAll( '.icts-counter-block__number[data-from][data-to]' )
		);
		if ( ! counters.length ) {
			return;
		}

		var observedBlocks = Array.from(
			new Set(
				counters.map( function ( counter ) {
					return counter.closest( '.icts-counter-block' ) || counter;
				} )
			)
		);

		var prefersReducedMotion = window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

		equalizeCounterHeights();

		if ( document.fonts && document.fonts.ready ) {
			document.fonts.ready.then( scheduleEqualizeCounterHeights );
		}

		if ( 'IntersectionObserver' in window ) {
			var observer = new IntersectionObserver(
				function ( entries ) {
					entries.forEach( function ( entry ) {
						if ( ! entry.isIntersecting ) {
							return;
						}

						var blockCounters = entry.target.querySelectorAll( '.icts-counter-block__number[data-from][data-to]' );

						blockCounters.forEach( function ( counter ) {
							animateCounter( counter, prefersReducedMotion );
						} );

						observer.unobserve( entry.target );
					} );
				},
				{
					threshold: 0,
					rootMargin: '0px 0px -20% 0px',
				}
			);

			observedBlocks.forEach( function ( block ) {
				observer.observe( block );
			} );

			return;
		}

		counters.forEach( function ( counter ) {
			animateCounter( counter, prefersReducedMotion );
		} );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', initCounters );
	} else {
		initCounters();
	}

	window.addEventListener( 'resize', scheduleEqualizeCounterHeights );
	window.addEventListener( 'load', equalizeCounterHeights );
}() );
