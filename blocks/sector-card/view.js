( () => {
	const FOCUSABLE_SELECTOR = [
		'a[href]',
		'area[href]',
		'input:not([disabled]):not([type="hidden"])',
		'select:not([disabled])',
		'textarea:not([disabled])',
		'button:not([disabled])',
		'[tabindex]:not([tabindex="-1"])',
	].join( ',' );

	const openerMap = new WeakMap();
	const closeTimerMap = new WeakMap();
	let activeModal = null;

	const getFocusable = ( container ) =>
		Array.from( container.querySelectorAll( FOCUSABLE_SELECTOR ) ).filter( ( element ) => {
			return !!( element.offsetWidth || element.offsetHeight || element.getClientRects().length );
		} );

	const lockScroll = () => document.body.classList.add( 'has-icts-sector-modal-open' );
	const unlockScroll = () => document.body.classList.remove( 'has-icts-sector-modal-open' );

	const finishCloseModal = ( modal, restoreFocus = true ) => {
		if ( ! modal ) {
			return;
		}

		modal.hidden = true;
		modal.classList.remove( 'is-open', 'is-closing' );

		if ( activeModal === modal ) {
			activeModal = null;
			unlockScroll();
		}

		if ( restoreFocus ) {
			const opener = openerMap.get( modal );
			if ( opener && typeof opener.focus === 'function' ) {
				opener.focus();
			}
		}
	};

	const closeModal = ( modal, restoreFocus = true ) => {
		if ( ! modal || modal.hidden ) {
			return;
		}

		const existingTimer = closeTimerMap.get( modal );
		if ( existingTimer ) {
			window.clearTimeout( existingTimer );
		}

		const panel = modal.querySelector( '.icts-sector-card__modal-panel' );
		modal.classList.remove( 'is-open' );
		modal.classList.add( 'is-closing' );

		const complete = () => finishCloseModal( modal, restoreFocus );
		let completed = false;
		const completeOnce = () => {
			if ( completed ) {
				return;
			}
			completed = true;
			complete();
		};

		if ( panel ) {
			panel.addEventListener( 'transitionend', completeOnce, { once: true } );
		}

		const fallbackTimer = window.setTimeout( completeOnce, 260 );
		closeTimerMap.set( modal, fallbackTimer );
	};

	const openModal = ( modal, opener ) => {
		if ( ! modal ) {
			return;
		}

		if ( activeModal && activeModal !== modal ) {
			closeModal( activeModal, false );
		}

		openerMap.set( modal, opener );
		activeModal = modal;

		const existingTimer = closeTimerMap.get( modal );
		if ( existingTimer ) {
			window.clearTimeout( existingTimer );
		}

		modal.hidden = false;
		modal.classList.remove( 'is-closing' );
		window.requestAnimationFrame( () => {
			modal.classList.add( 'is-open' );
		} );
		lockScroll();

		const panel = modal.querySelector( '.icts-sector-card__modal-panel' );
		if ( ! panel ) {
			return;
		}

		const focusable = getFocusable( panel );
		( focusable[ 0 ] || panel ).focus();
	};

	const initCardReveal = () => {
		const cards = Array.from( document.querySelectorAll( '.wp-block-icts-sector-card' ) );
		if ( ! cards.length ) {
			return;
		}

		cards.forEach( ( card, index ) => {
			card.classList.add( 'has-icts-reveal' );
			card.style.setProperty( '--icts-card-delay', `${ Math.min( index * 90, 720 ) }ms` );
		} );

		if (
			window.matchMedia &&
			window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches
		) {
			cards.forEach( ( card ) => card.classList.add( 'is-inview' ) );
			return;
		}

		if ( ! ( 'IntersectionObserver' in window ) ) {
			cards.forEach( ( card ) => card.classList.add( 'is-inview' ) );
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

		cards.forEach( ( card ) => observer.observe( card ) );
	};

	initCardReveal();

	document.addEventListener( 'click', ( event ) => {
		const opener = event.target.closest( '.icts-sector-card__learn-more[data-modal-target]' );
		if ( opener ) {
			event.preventDefault();
			const modal = document.getElementById( opener.getAttribute( 'data-modal-target' ) );
			openModal( modal, opener );
			return;
		}

		const closeTrigger = event.target.closest( '[data-modal-close]' );
		if ( closeTrigger ) {
			const modal = closeTrigger.closest( '.icts-sector-card__modal' );
			closeModal( modal );
		}
	} );

	document.addEventListener( 'keydown', ( event ) => {
		if ( ! activeModal ) {
			return;
		}

		if ( event.key === 'Escape' ) {
			event.preventDefault();
			closeModal( activeModal );
			return;
		}

		if ( event.key !== 'Tab' ) {
			return;
		}

		const panel = activeModal.querySelector( '.icts-sector-card__modal-panel' );
		if ( ! panel ) {
			return;
		}

		const focusable = getFocusable( panel );
		if ( ! focusable.length ) {
			event.preventDefault();
			panel.focus();
			return;
		}

		const first = focusable[ 0 ];
		const last = focusable[ focusable.length - 1 ];
		const activeElement = document.activeElement;

		if ( event.shiftKey && activeElement === first ) {
			event.preventDefault();
			last.focus();
		} else if ( ! event.shiftKey && activeElement === last ) {
			event.preventDefault();
			first.focus();
		}
	} );
} )();
