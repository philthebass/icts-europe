( () => {
	const GRID_SELECTOR = '.icts-reveal-grid';
	const MAX_DELAY_MS = 720;
	const DELAY_STEP_MS = 90;
	const observedItems = new Set();

	const addRevealClasses = ( item, index ) => {
		if ( ! item || ! ( item instanceof HTMLElement ) ) {
			return;
		}

		if ( item.hasAttribute( 'data-icts-reveal-skip' ) ) {
			return;
		}

		item.classList.add( 'icts-reveal-item', 'has-icts-reveal' );
		item.style.setProperty(
			'--icts-card-delay',
			`${ Math.min( index * DELAY_STEP_MS, MAX_DELAY_MS ) }ms`
		);
		observedItems.add( item );
	};

	const getItemsForGrid = ( grid ) => {
		const customSelector = ( grid.getAttribute( 'data-icts-reveal-item-selector' ) || '' ).trim();
		if ( customSelector ) {
			return Array.from( grid.querySelectorAll( customSelector ) );
		}

		return Array.from( grid.children );
	};

	const initRevealGrid = () => {
		const grids = Array.from( document.querySelectorAll( GRID_SELECTOR ) );
		if ( ! grids.length ) {
			return;
		}

		grids.forEach( ( grid ) => {
			getItemsForGrid( grid ).forEach( ( item, index ) => addRevealClasses( item, index ) );
		} );

		if ( ! observedItems.size ) {
			return;
		}

		if (
			( window.matchMedia &&
				window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches ) ||
			! ( 'IntersectionObserver' in window )
		) {
			observedItems.forEach( ( item ) => item.classList.add( 'is-inview' ) );
			return;
		}

		const observer = new IntersectionObserver(
			( entries, localObserver ) => {
				entries.forEach( ( entry ) => {
					if ( ! entry.isIntersecting ) {
						return;
					}

					entry.target.classList.add( 'is-inview' );
					localObserver.unobserve( entry.target );
				} );
			},
			{
				threshold: 0.15,
				rootMargin: '0px 0px -6% 0px',
			}
		);

		observedItems.forEach( ( item ) => observer.observe( item ) );
	};

	initRevealGrid();
} )();
