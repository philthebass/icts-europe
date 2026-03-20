( function () {
	'use strict';

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
}() );
