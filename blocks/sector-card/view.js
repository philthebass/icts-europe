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
	let activeModal = null;

	const getFocusable = ( container ) =>
		Array.from( container.querySelectorAll( FOCUSABLE_SELECTOR ) ).filter( ( element ) => {
			return !!( element.offsetWidth || element.offsetHeight || element.getClientRects().length );
		} );

	const lockScroll = () => document.body.classList.add( 'has-icts-sector-modal-open' );
	const unlockScroll = () => document.body.classList.remove( 'has-icts-sector-modal-open' );

	const closeModal = ( modal, restoreFocus = true ) => {
		if ( ! modal ) {
			return;
		}

		modal.hidden = true;
		modal.classList.remove( 'is-open' );

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

	const openModal = ( modal, opener ) => {
		if ( ! modal ) {
			return;
		}

		if ( activeModal && activeModal !== modal ) {
			closeModal( activeModal, false );
		}

		openerMap.set( modal, opener );
		activeModal = modal;

		modal.hidden = false;
		modal.classList.add( 'is-open' );
		lockScroll();

		const panel = modal.querySelector( '.icts-sector-card__modal-panel' );
		if ( ! panel ) {
			return;
		}

		const focusable = getFocusable( panel );
		( focusable[ 0 ] || panel ).focus();
	};

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
