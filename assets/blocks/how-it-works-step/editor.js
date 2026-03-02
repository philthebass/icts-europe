( function ( blocks, blockEditor, components, i18n ) {
	const { registerBlockType } = blocks;
	const { InspectorControls, RichText, useBlockProps } = blockEditor;
	const { PanelBody, TextControl } = components;
	const el = wp.element.createElement;
	const { __ } = i18n;

	registerBlockType( 'icts/how-it-works-step', {
		edit( { attributes, setAttributes } ) {
			const blockProps = useBlockProps( { className: 'icts-how-it-works-step' } );

			return el(
				'article',
				blockProps,
				el(
					InspectorControls,
					null,
					el(
						PanelBody,
						{ title: __( 'Step Settings', 'icts-europe' ), initialOpen: true },
						el( TextControl, {
							label: __( 'Step label', 'icts-europe' ),
							value: attributes.stepLabel || 'Step',
							onChange: ( value ) => setAttributes( { stepLabel: value } ),
						} )
					)
				),
				el(
					'div',
					{ className: 'icts-how-it-works-step__marker' },
					el(
						'span',
						{ className: 'icts-how-it-works-step__marker-label' },
						attributes.stepLabel || __( 'Step', 'icts-europe' )
					)
				),
				el(
					'div',
					{ className: 'icts-how-it-works-step__content' },
					el( RichText, {
						tagName: 'h3',
						className: 'icts-how-it-works-step__title',
						value: attributes.title,
						onChange: ( value ) => setAttributes( { title: value } ),
						placeholder: __( 'Step title', 'icts-europe' ),
					} ),
					el( RichText, {
						tagName: 'p',
						className: 'icts-how-it-works-step__description',
						value: attributes.description,
						onChange: ( value ) => setAttributes( { description: value } ),
						placeholder: __( 'Explain this step.', 'icts-europe' ),
					} )
				)
			);
		},
		save( { attributes } ) {
			return el(
				'article',
				useBlockProps.save( { className: 'icts-how-it-works-step' } ),
				el(
					'button',
					{
						type: 'button',
						className: 'icts-how-it-works-step__trigger',
						'aria-expanded': 'false',
					},
					el(
						'span',
						{ className: 'icts-how-it-works-step__marker', 'aria-hidden': 'true' },
						el(
							'span',
							{ className: 'icts-how-it-works-step__marker-dot' },
							el( 'span', { className: 'icts-how-it-works-step__marker-number' } )
						)
					),
					el(
						'span',
						{ className: 'icts-how-it-works-step__trigger-content' },
						el(
							'span',
							{ className: 'icts-how-it-works-step__marker-label' },
							attributes.stepLabel || __( 'Step', 'icts-europe' )
						),
						el( RichText.Content, {
							tagName: 'span',
							className: 'icts-how-it-works-step__title',
							value: attributes.title,
						} )
					)
				),
				el(
					'div',
					{ className: 'icts-how-it-works-step__panel', hidden: true },
					el( RichText.Content, {
						tagName: 'p',
						className: 'icts-how-it-works-step__description',
						value: attributes.description,
					} )
				)
			);
		},
	} );
} )(
	window.wp.blocks,
	window.wp.blockEditor,
	window.wp.components,
	window.wp.i18n
);
