( function ( blocks, blockEditor, i18n ) {
	const { registerBlockType } = blocks;
	const { InnerBlocks, RichText, useBlockProps } = blockEditor;
	const el = wp.element.createElement;
	const { __ } = i18n;

	const ALLOWED_BLOCKS = [ 'icts/steps-primary-step' ];
	const TEMPLATE = [
		[
			'icts/steps-primary-step',
			{
				title: __( 'Step 1:', 'icts-europe' ),
				description: __( 'Your DCS sends passenger details and journey information to TravelDoc.', 'icts-europe' ),
			},
		],
		[
			'icts/steps-primary-step',
			{
				title: __( 'Step 2:', 'icts-europe' ),
				description: __( 'TravelDoc checks passenger information against global travel rules in under 1 second.', 'icts-europe' ),
			},
		],
		[
			'icts/steps-primary-step',
			{
				title: __( 'Step 3:', 'icts-europe' ),
				description: __( 'TravelDoc returns Go/Conditional/No-Go status with specific guidance.', 'icts-europe' ),
			},
		],
	];

	registerBlockType( 'icts/steps-primary', {
		edit( { attributes, setAttributes } ) {
			const blockProps = useBlockProps( { className: 'icts-steps-primary' } );

			return el(
				'section',
				blockProps,
				el( RichText, {
					tagName: 'h2',
					className: 'icts-steps-primary__heading',
					value: attributes.heading,
					onChange: ( value ) => setAttributes( { heading: value } ),
					placeholder: __( 'How it works', 'icts-europe' ),
				} ),
				el(
					'div',
					{ className: 'icts-steps-primary__list' },
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
				useBlockProps.save( { className: 'icts-steps-primary' } ),
				el( RichText.Content, {
					tagName: 'h2',
					className: 'icts-steps-primary__heading',
					value: attributes.heading,
				} ),
				el(
					'div',
					{ className: 'icts-steps-primary__list' },
					el( InnerBlocks.Content )
				)
			);
		},
	} );
} )( window.wp.blocks, window.wp.blockEditor, window.wp.i18n );
