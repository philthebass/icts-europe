( () => {
	const prefersReducedMotion = window.matchMedia( '(prefers-reduced-motion: reduce)' );
	const ua = window.navigator && window.navigator.userAgent ? window.navigator.userAgent : '';
	const platform = window.navigator && window.navigator.platform ? window.navigator.platform : '';
	const maxTouchPoints = window.navigator && window.navigator.maxTouchPoints ? window.navigator.maxTouchPoints : 0;
	const isIOSWebKit = /iPad|iPhone|iPod/.test( ua ) || ( platform === 'MacIntel' && maxTouchPoints > 1 );

	const initStepReveal = ( root ) => {
		const steps = root.querySelectorAll( '.wp-block-icts-steps-primary-step' );
		if ( ! steps.length ) {
			return;
		}

		if ( isIOSWebKit ) {
			steps.forEach( ( step ) => {
				step.classList.add( 'is-inview' );
			} );
			return;
		}

		steps.forEach( ( step, index ) => {
			step.classList.add( 'has-steps-primary-reveal' );
			step.classList.add( index % 2 === 0 ? 'is-from-left' : 'is-from-right' );
			step.style.setProperty( '--icts-step-delay', `${ index * 120 }ms` );
		} );

		if ( prefersReducedMotion.matches || typeof IntersectionObserver === 'undefined' ) {
			steps.forEach( ( step ) => {
				step.classList.add( 'is-inview' );
			} );
			return;
		}

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
			{ threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
		);

		steps.forEach( ( step ) => observer.observe( step ) );
	};

	document.querySelectorAll( '.wp-block-icts-steps-primary' ).forEach( ( block ) => {
		initStepReveal( block );
	} );
} )();
