( function ( blocks, blockEditor, i18n ) {
	const { registerBlockType } = blocks;
	const { InnerBlocks, RichText, useBlockProps } = blockEditor;
	const el = wp.element.createElement;
	const { __ } = i18n;

	const ALLOWED_BLOCKS = [ 'icts/how-it-works-step' ];
	const TEMPLATE = [
		[
			'icts/how-it-works-step',
			{
				title: __( 'Your DCS sends passenger details', 'icts-europe' ),
				description: __(
					'Your DCS sends passenger details and journey information to TravelDoc.',
					'icts-europe'
				),
			},
		],
		[
			'icts/how-it-works-step',
			{
				title: __( 'TravelDoc checks global travel rules', 'icts-europe' ),
				description: __(
					'TravelDoc checks passenger information against visa requirements, passport validity, health requirements, and transit visa rules in under 1 second.',
					'icts-europe'
				),
			},
		],
		[
			'icts/how-it-works-step',
			{
				title: __( 'Go / Conditional / No-Go guidance', 'icts-europe' ),
				description: __(
					'TravelDoc returns Go/Conditional/No-Go status with specific guidance in your chosen language so check-in staff can make informed decisions instantly.',
					'icts-europe'
				),
			},
		],
	];

	registerBlockType( 'icts/how-it-works', {
		edit( { attributes, setAttributes } ) {
			const blockProps = useBlockProps( { className: 'icts-how-it-works' } );

			return el(
				'section',
				blockProps,
				el( RichText, {
					tagName: 'h2',
					className: 'icts-how-it-works__heading',
					value: attributes.heading,
					onChange: ( value ) => setAttributes( { heading: value } ),
					placeholder: __( 'How it works', 'icts-europe' ),
				} ),
				el( RichText, {
					tagName: 'p',
					className: 'icts-how-it-works__intro',
					value: attributes.intro,
					onChange: ( value ) => setAttributes( { intro: value } ),
					placeholder: __( 'Add an optional intro sentence.', 'icts-europe' ),
				} ),
				el(
					'div',
					{ className: 'icts-how-it-works__timeline' },
					el( InnerBlocks, {
						allowedBlocks: ALLOWED_BLOCKS,
						template: TEMPLATE,
						orientation: 'vertical',
						templateInsertUpdatesSelection: false,
						renderAppender: InnerBlocks.ButtonBlockAppender,
					} )
				)
			);
		},
		save( { attributes } ) {
			return el(
				'section',
				useBlockProps.save( { className: 'icts-how-it-works' } ),
				el( RichText.Content, {
					tagName: 'h2',
					className: 'icts-how-it-works__heading',
					value: attributes.heading,
				} ),
				el( RichText.Content, {
					tagName: 'p',
					className: 'icts-how-it-works__intro',
					value: attributes.intro,
				} ),
				el(
					'div',
					{ className: 'icts-how-it-works__timeline' },
					el( InnerBlocks.Content )
				)
			);
		},
		attributes: {
			heading: {
				type: 'string',
				default: __( 'How it works', 'icts-europe' ),
			},
			intro: {
				type: 'string',
				default: '',
			},
		},
	} );
} )( window.wp.blocks, window.wp.blockEditor, window.wp.i18n );
