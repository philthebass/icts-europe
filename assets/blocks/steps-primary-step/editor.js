( function ( blocks, blockEditor, components, i18n ) {
	const { registerBlockType } = blocks;
	const { InspectorControls, MediaUpload, MediaUploadCheck, RichText, useBlockProps } = blockEditor;
	const { Button, PanelBody } = components;
	const el = wp.element.createElement;
	const { __ } = i18n;

	registerBlockType( 'icts/steps-primary-step', {
		edit( { attributes, setAttributes } ) {
			const blockProps = useBlockProps( { className: 'icts-steps-primary-step' } );

			return el(
				'article',
				blockProps,
				el(
					InspectorControls,
					null,
					el(
						PanelBody,
						{ title: __( 'Image', 'icts-europe' ), initialOpen: true },
						el( MediaUploadCheck, null, el( MediaUpload, {
							onSelect: ( media ) => setAttributes( {
								imageUrl: media?.url || '',
								imageId: media?.id,
								imageAlt: media?.alt || '',
							} ),
							allowedTypes: [ 'image' ],
							value: attributes.imageId,
							render: ( { open } ) => el( Button, {
								onClick: open,
								variant: 'secondary',
							}, attributes.imageUrl ? __( 'Replace image', 'icts-europe' ) : __( 'Select image', 'icts-europe' ) ),
						} ) ),
						attributes.imageUrl
							? el( Button, {
								onClick: () => setAttributes( { imageUrl: '', imageId: undefined, imageAlt: '' } ),
								isDestructive: true,
								style: { marginTop: '0.75rem' },
							}, __( 'Remove image', 'icts-europe' ) )
							: null
					)
				),
				el(
					'div',
					{ className: 'icts-steps-primary-step__card' },
					el(
						'div',
						{ className: 'icts-steps-primary-step__content' },
						el( RichText, {
							tagName: 'h3',
							className: 'icts-steps-primary-step__title',
							value: attributes.title,
							onChange: ( value ) => setAttributes( { title: value } ),
							placeholder: __( 'Step title', 'icts-europe' ),
						} ),
						el( RichText, {
							tagName: 'p',
							className: 'icts-steps-primary-step__description',
							value: attributes.description,
							onChange: ( value ) => setAttributes( { description: value } ),
							placeholder: __( 'Add step description', 'icts-europe' ),
						} )
					),
					el(
						'div',
						{ className: 'icts-steps-primary-step__media' },
						attributes.imageUrl
							? el( 'img', {
								src: attributes.imageUrl,
								alt: attributes.imageAlt || '',
							} )
							: el( MediaUploadCheck, null, el( MediaUpload, {
								onSelect: ( media ) => setAttributes( {
									imageUrl: media?.url || '',
									imageId: media?.id,
									imageAlt: media?.alt || '',
								} ),
								allowedTypes: [ 'image' ],
								value: attributes.imageId,
								render: ( { open } ) => el( Button, {
									onClick: open,
									variant: 'secondary',
								}, __( 'Select image', 'icts-europe' ) ),
							} ) )
					)
				)
			);
		},
		save( { attributes } ) {
			return el(
				'article',
				useBlockProps.save( { className: 'icts-steps-primary-step' } ),
				el(
					'div',
					{ className: 'icts-steps-primary-step__card' },
					el(
						'div',
						{ className: 'icts-steps-primary-step__content' },
						el( RichText.Content, {
							tagName: 'h3',
							className: 'icts-steps-primary-step__title',
							value: attributes.title,
						} ),
						el( RichText.Content, {
							tagName: 'p',
							className: 'icts-steps-primary-step__description',
							value: attributes.description,
						} )
					),
					el(
						'div',
						{ className: 'icts-steps-primary-step__media' },
						attributes.imageUrl
							? el( 'img', {
								src: attributes.imageUrl,
								alt: attributes.imageAlt || '',
								loading: 'lazy',
								decoding: 'async',
							} )
							: null
					)
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
