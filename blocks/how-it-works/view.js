( () => {
	const initHowItWorks = ( root ) => {
		const stepBlocks = Array.from(
			root.querySelectorAll( '.wp-block-icts-how-it-works-step' )
		);

		if ( ! stepBlocks.length ) {
			return;
		}

		const triggers = [];
		const panels = [];

		stepBlocks.forEach( ( stepBlock, index ) => {
			const trigger = stepBlock.querySelector( '.icts-how-it-works-step__trigger' );
			const panel = stepBlock.querySelector( '.icts-how-it-works-step__panel' );
			const number = stepBlock.querySelector(
				'.icts-how-it-works-step__marker-number'
			);
			if ( ! trigger || ! panel ) {
				return;
			}

			const panelId =
				panel.id || `icts-how-it-works-panel-${ root.dataset.hiwId || '0' }-${ index + 1 }`;

			panel.id = panelId;
			trigger.setAttribute( 'aria-controls', panelId );
			trigger.setAttribute( 'aria-expanded', 'false' );
			trigger.setAttribute( 'role', 'button' );
			trigger.setAttribute( 'tabindex', '0' );

			if ( number ) {
				number.textContent = String( index + 1 );
			}

			triggers.push( trigger );
			panels.push( panel );
		} );

		if ( ! triggers.length ) {
			return;
		}

		const activateStep = ( targetIndex, moveFocus = false ) => {
			triggers.forEach( ( trigger, index ) => {
				const isActive = index === targetIndex;
				const panel = panels[ index ];
				const stepBlock = stepBlocks[ index ];

				trigger.setAttribute( 'aria-expanded', isActive ? 'true' : 'false' );
				panel.hidden = ! isActive;
				stepBlock.classList.toggle( 'is-active', isActive );
			} );

			if ( moveFocus && triggers[ targetIndex ] ) {
				triggers[ targetIndex ].focus();
			}

			const maxIndex = Math.max( triggers.length - 1, 1 );
			const progress = ( targetIndex / maxIndex ) * 100;
			root.style.setProperty( '--icts-hiw-progress', `${ progress }%` );
		};

		triggers.forEach( ( trigger, index ) => {
			trigger.addEventListener( 'click', () => {
				activateStep( index );
			} );

			trigger.addEventListener( 'keydown', ( event ) => {
				let nextIndex = index;
				if ( event.key === 'ArrowDown' || event.key === 'ArrowRight' ) {
					nextIndex = Math.min( triggers.length - 1, index + 1 );
				} else if ( event.key === 'ArrowUp' || event.key === 'ArrowLeft' ) {
					nextIndex = Math.max( 0, index - 1 );
				} else if ( event.key === 'Home' ) {
					nextIndex = 0;
				} else if ( event.key === 'End' ) {
					nextIndex = triggers.length - 1;
				} else {
					return;
				}

				event.preventDefault();
				activateStep( nextIndex, true );
			} );
		} );

		activateStep( 0 );
		root.classList.add( 'is-ready' );
	};

	document.querySelectorAll( '.wp-block-icts-how-it-works' ).forEach( ( block, index ) => {
		block.dataset.hiwId = String( index + 1 );
		initHowItWorks( block );
	} );
} )();
