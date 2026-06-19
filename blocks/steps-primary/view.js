( () => {
	const prefersReducedMotion = window.matchMedia( '(prefers-reduced-motion: reduce)' );
	const desktopViewport = window.matchMedia( '(min-width: 961px)' );
	const ua = window.navigator && window.navigator.userAgent ? window.navigator.userAgent : '';
	const platform = window.navigator && window.navigator.platform ? window.navigator.platform : '';
	const maxTouchPoints = window.navigator && window.navigator.maxTouchPoints ? window.navigator.maxTouchPoints : 0;
	const isIOSWebKit = /iPad|iPhone|iPod/.test( ua ) || ( platform === 'MacIntel' && maxTouchPoints > 1 );

	if (
		isIOSWebKit ||
		prefersReducedMotion.matches ||
		! desktopViewport.matches ||
		typeof IntersectionObserver === 'undefined'
	) {
		return;
	}

	const initStepReveal = ( root ) => {
		const steps = root.querySelectorAll( '.wp-block-icts-steps-primary-step' );

		if ( ! steps.length ) {
			return;
		}

		steps.forEach( ( step, index ) => {
			step.classList.add( 'has-steps-primary-reveal' );
			step.classList.add( index % 2 === 0 ? 'is-from-left' : 'is-from-right' );
			step.style.setProperty( '--icts-step-delay', `${ index * 100 }ms` );
		} );

		const observer = new IntersectionObserver(
			( entries ) => {
				entries.forEach( ( entry ) => {
					if ( ! entry.isIntersecting ) {
						return;
					}

					entry.target.classList.add( 'is-inview' );
					observer.unobserve( entry.target );
				} );
			},
			{ threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
		);

		steps.forEach( ( step ) => observer.observe( step ) );
	};

	document.querySelectorAll( '.wp-block-icts-steps-primary' ).forEach( initStepReveal );
} )();
