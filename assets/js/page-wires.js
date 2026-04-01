( function () {
	const SVG_NS = 'http://www.w3.org/2000/svg';
	const DISPLAY_WIDTH = 210;
	const STROKE_WIDTH = 5;
	const initializedDocuments = new WeakSet();
	const observedContainers = new WeakSet();
	const allowEditorFallback = !! (
		window.ictsPageWiresConfig &&
		window.ictsPageWiresConfig.allowEditorFallback
	);

	const PATHS = [
		{
			color: '#5fd469',
			points: [
				[ 'M', 72.646, 2.5 ],
				[ 'C', 66.229, 18.7, 55.319, 34.056, 40.676, 47.489 ],
				[ 'C', 31.323, 56.069, 20.324, 64.034, 14.24, 73.91 ],
				[ 'C', 2.5, 92.964, 11.489, 115.229, 26.34, 133.224 ],
				[ 'C', 41.191, 151.219, 61.632, 166.893, 75.174, 185.371 ],
				[ 'C', 93.433, 210.278, 98.13, 239.14, 94.22, 266.908 ],
				[ 'C', 90.31, 294.676, 78.199, 321.587, 64.255, 347.782 ],
				[ 'C', 52.324, 370.2, 38.899, 392.523, 34.099, 416.165 ],
				[ 'C', 25.94, 456.318, 43.322, 496.919, 66.639, 534.15 ],
			],
		},
		{
			color: '#c10a27',
			points: [
				[ 'M', 38.511, 8.248 ],
				[ 'C', 33.847, 74.979, 58.423, 141.462, 51.165, 208.129 ],
				[ 'C', 45.742, 257.939, 19.265, 306.885, 25.34, 356.645 ],
				[ 'C', 29.911, 394.079, 52.75, 429.882, 56.79, 467.346 ],
				[ 'C', 59.565, 493.087, 53.378, 518.895, 54.219, 544.696 ],
			],
		},
		{
			color: '#fbbe62',
			points: [
				[ 'M', 22.275, 2.5 ],
				[ 'C', 35.166, 31.085, 48.175, 60.182, 47.926, 90.005 ],
				[ 'C', 47.594, 129.914, 23.51, 168.651, 25.041, 208.547 ],
				[ 'C', 26.863, 256.053, 64.719, 300.28, 69.147, 347.709 ],
				[ 'C', 72.855, 387.415, 52.915, 426.389, 49.069, 466.089 ],
				[ 'C', 46.288, 494.784, 45.674, 517.287, 56.66, 545.108 ],
			],
		},
		{
			color: '#003565',
			points: [
				[ 'M', 51.262, 544.012 ],
				[ 'C', 27.696, 504.376, 24.284, 489.795, 15.162, 448.213 ],
				[ 'C', 2.546, 390.668, 27.458, 332.77, 36.815, 274.916 ],
				[ 'C', 40.247, 253.698, 41.583, 232.341, 42.915, 211.006 ],
				[ 'C', 44.35, 188.069, 45.754, 164.848, 39.134, 142.37 ],
				[ 'C', 32.507, 119.866, 17.934, 98.493, 15.701, 75.562 ],
				[ 'C', 13.261, 50.509, 25.733, 26.066, 38.015, 2.5 ],
			],
		},
		{
			color: '#9ae4ff',
			points: [
				[ 'M', 76.096, 4.479 ],
				[ 'C', 41.102, 58.214, 5.271, 115.767, 18.037, 174.057 ],
				[ 'C', 24.516, 203.639, 43.216, 231.185, 55.161, 259.931 ],
				[ 'C', 73.334, 303.674, 75.637, 350.539, 61.801, 395.038 ],
				[ 'C', 46.264, 445.009, 10.616, 494.825, 26.048, 544.814 ],
			],
		},
	];

	const PATH_BOUNDS = PATHS.reduce(
		( bounds, pathConfig ) => pathConfig.points.reduce(
			( currentBounds, segment ) => {
				const coords = segment.slice( 1 );

				for ( let index = 0; index < coords.length; index += 2 ) {
					const x = coords[ index ];
					const y = coords[ index + 1 ];

					currentBounds.minX = Math.min( currentBounds.minX, x );
					currentBounds.maxX = Math.max( currentBounds.maxX, x );
					currentBounds.minY = Math.min( currentBounds.minY, y );
					currentBounds.maxY = Math.max( currentBounds.maxY, y );
				}

				return currentBounds;
			},
			bounds
		),
		{
			minX: Infinity,
			maxX: -Infinity,
			minY: Infinity,
			maxY: -Infinity,
		}
	);

	function getBounds( points ) {
		return points.reduce(
			( bounds, segment ) => {
				const coords = segment.slice( 1 );

				for ( let index = 0; index < coords.length; index += 2 ) {
					const x = coords[ index ];
					const y = coords[ index + 1 ];

					bounds.minX = Math.min( bounds.minX, x );
					bounds.maxX = Math.max( bounds.maxX, x );
					bounds.minY = Math.min( bounds.minY, y );
					bounds.maxY = Math.max( bounds.maxY, y );
				}

				return bounds;
			},
			{
				minX: Infinity,
				maxX: -Infinity,
				minY: Infinity,
				maxY: -Infinity,
			}
		);
	}

	function getEditorFallbackContainers( doc ) {
		const selectors = [
			'.editor-styles-wrapper .is-root-container',
			'.editor-styles-wrapper.block-editor-writing-flow',
			'.editor-styles-wrapper',
			'.is-root-container',
			'.block-editor-block-list__layout.is-root-container',
		];

		return selectors
			.map( ( selector ) => doc.querySelector( selector ) )
			.filter( ( container, index, containers ) => (
				container && containers.indexOf( container ) === index
			) );
	}

	function hasDisabledMarker( doc ) {
		return !! doc.querySelector( '.page-wires-bg--disabled' );
	}

	function getEditedTemplateSlug( doc ) {
		try {
			const view = doc.defaultView || window;
			const wpData = view.wp && view.wp.data ? view.wp.data : window.wp && window.wp.data ? window.wp.data : null;

			if ( ! wpData || typeof wpData.select !== 'function' ) {
				return '';
			}

			const editorStore = wpData.select( 'core/editor' );

			if ( ! editorStore || typeof editorStore.getEditedPostAttribute !== 'function' ) {
				return '';
			}

			return editorStore.getEditedPostAttribute( 'template' ) || '';
		} catch ( error ) {
			return '';
		}
	}

	function getEditorStore( doc ) {
		try {
			const view = doc.defaultView || window;
			const wpData = view.wp && view.wp.data ? view.wp.data : window.wp && window.wp.data ? window.wp.data : null;

			if ( ! wpData || typeof wpData.select !== 'function' ) {
				return null;
			}

			return wpData.select( 'core/editor' );
		} catch ( error ) {
			return null;
		}
	}

	function getEditedPostType( doc ) {
		const editorStore = getEditorStore( doc );

		if ( ! editorStore || typeof editorStore.getCurrentPostType !== 'function' ) {
			return '';
		}

		return editorStore.getCurrentPostType() || '';
	}

	function templateDisablesWires( doc ) {
		return getEditedTemplateSlug( doc ) === 'page-no-wires';
	}

	function shouldUseEditorFallback( doc ) {
		return getEditedPostType( doc ) === 'page';
	}

	function scalePath( path, xScale, yScale ) {
		return path
			.map( ( segment ) => {
				const [ command, ...coords ] = segment;
				if ( coords.length === 0 ) {
					return command;
				}

				const scaled = coords.map( ( value, index ) => {
					if ( index % 2 === 0 ) {
						return ( ( value - PATH_BOUNDS.minX ) * xScale ).toFixed( 3 ).replace( /\.?0+$/, '' );
					}

					return ( ( value - yScale.minY ) * yScale.scale ).toFixed( 3 ).replace( /\.?0+$/, '' );
				} );

				return command + scaled.join( ',' );
			} )
			.join( ' ' );
	}

	function renderWires( container, doc ) {
		const height = container.offsetHeight;

		if ( ! height ) {
			return;
		}

		let art = container.querySelector( '.page-wires-bg__art' );

		if ( ! art ) {
			art = doc.createElement( 'div' );
			art.className = 'page-wires-bg__art';
			art.setAttribute( 'aria-hidden', 'true' );
			container.prepend( art );
		}

		if ( ! container.dataset.pageWiresStyled ) {
			container.style.position = 'relative';
			container.style.display = 'flow-root';
			container.dataset.pageWiresStyled = 'true';
		}

		art.style.position = 'absolute';
		art.style.top = '0';
		art.style.bottom = '0';
		art.style.left = '50%';
		art.style.width = DISPLAY_WIDTH + 'px';
		art.style.transform = 'translateX(-50%)';
		art.style.pointerEvents = 'none';
		art.style.zIndex = '0';

		const svg = doc.createElementNS( SVG_NS, 'svg' );
		svg.setAttribute( 'viewBox', `0 0 ${ DISPLAY_WIDTH } ${ height }` );
		svg.setAttribute( 'preserveAspectRatio', 'none' );
		svg.setAttribute( 'width', '100%' );
		svg.setAttribute( 'height', '100%' );
		svg.setAttribute( 'aria-hidden', 'true' );
		svg.style.display = 'block';

		const xScale = DISPLAY_WIDTH / ( PATH_BOUNDS.maxX - PATH_BOUNDS.minX );

		PATHS.forEach( ( pathConfig ) => {
			const pathBounds = getBounds( pathConfig.points );
			const yScale = {
				minY: pathBounds.minY,
				scale: height / ( pathBounds.maxY - pathBounds.minY ),
			};
			const path = doc.createElementNS( SVG_NS, 'path' );
			path.setAttribute( 'd', scalePath( pathConfig.points, xScale, yScale ) );
			path.setAttribute( 'stroke', pathConfig.color );
			path.setAttribute( 'stroke-width', STROKE_WIDTH.toFixed( 3 ) );
			svg.appendChild( path );
		} );

		art.replaceChildren( svg );
	}

	function observeContainer( container, doc, observer ) {
		if ( observedContainers.has( container ) ) {
			return;
		}

		observedContainers.add( container );
		renderWires( container, doc );
		observer.observe( container );
	}

	function initDocument( doc ) {
		if ( ! doc || initializedDocuments.has( doc ) ) {
			return;
		}

		initializedDocuments.add( doc );

		const observer = new ResizeObserver( ( entries ) => {
			entries.forEach( ( entry ) => {
				renderWires( entry.target, doc );
			} );
		} );

		const getContainers = () => {
			const explicitContainers = Array.from( doc.querySelectorAll( '.page-wires-bg' ) );

			if ( explicitContainers.length ) {
				return explicitContainers;
			}

			if ( ! allowEditorFallback ) {
				return [];
			}

			if ( hasDisabledMarker( doc ) ) {
				return [];
			}

			if ( templateDisablesWires( doc ) ) {
				return [];
			}

			if ( ! shouldUseEditorFallback( doc ) ) {
				return [];
			}

			return getEditorFallbackContainers( doc );
		};

		getContainers().forEach( ( container ) => {
			observeContainer( container, doc, observer );
		} );

		const containerObserver = new MutationObserver( () => {
			getContainers().forEach( ( container ) => {
				observeContainer( container, doc, observer );
			} );
		} );

		containerObserver.observe( doc.documentElement, {
			childList: true,
			subtree: true,
		} );
	}

	function initIframe( iframe ) {
		try {
			const iframeDocument = iframe.contentDocument;
			if ( iframeDocument ) {
				initDocument( iframeDocument );
			}
		} catch ( error ) {
			// Ignore inaccessible frames.
		}
	}

	function initAllContexts() {
		initDocument( document );
		document.querySelectorAll( 'iframe' ).forEach( ( iframe ) => {
			initIframe( iframe );
			iframe.addEventListener( 'load', () => initIframe( iframe ), { once: true } );
		} );

		const frameObserver = new MutationObserver( () => {
			document.querySelectorAll( 'iframe' ).forEach( ( iframe ) => {
				if ( iframe.dataset.pageWiresObserved === 'true' ) {
					return;
				}

				iframe.dataset.pageWiresObserved = 'true';
				initIframe( iframe );
				iframe.addEventListener( 'load', () => initIframe( iframe ) );
			} );
		} );

		frameObserver.observe( document.documentElement, {
			childList: true,
			subtree: true,
		} );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', initAllContexts );
	} else {
		initAllContexts();
	}
}() );
