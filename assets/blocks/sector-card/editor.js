( function ( blocks, blockEditor, components, element, i18n ) {
	const { registerBlockType } = blocks;
	const {
		InnerBlocks,
		InspectorControls,
		MediaUpload,
		MediaUploadCheck,
		RichText,
		useBlockProps,
	} = blockEditor;
	const { Button, PanelBody, SelectControl, TextControl } = components;
	const { Fragment, createElement: el, useEffect, useState } = element;
	const { __ } = i18n;
	const { createBlocksFromInnerBlocksTemplate } = blocks;
	const { switchToBlockType } = blocks;

	const MODAL_TEMPLATE = [
		[
			'core/heading',
			{
				level: 2,
				placeholder: __( 'Modal heading', 'icts-europe' ),
			},
		],
		[
			'core/paragraph',
			{
				placeholder: __( 'Add modal content…', 'icts-europe' ),
			},
		],
	];

	const MODAL_LAYOUT_TEMPLATES = {
		simple: [
			[
				'core/heading',
				{ level: 2, content: __( 'Modal heading', 'icts-europe' ) },
			],
			[
				'core/paragraph',
				{
					content: __(
						'Add a concise introduction for this sector.',
						'icts-europe'
					),
				},
			],
		],
		twoColumn: [
			[
				'core/columns',
				{},
				[
					[
						'core/column',
						{},
						[
							[
								'core/image',
								{
									sizeSlug: 'large',
								},
							],
						],
					],
					[
						'core/column',
						{},
						[
							[
								'core/heading',
								{
									level: 2,
									content: __( 'Sector overview', 'icts-europe' ),
								},
							],
							[
								'core/paragraph',
								{
									content: __(
										'Describe the challenge, the solution, and the outcome.',
										'icts-europe'
									),
								},
							],
							[
								'core/buttons',
								{},
								[
									[
										'core/button',
										{
											text: __( 'Learn more', 'icts-europe' ),
										},
									],
								],
							],
						],
					],
				],
			],
		],
		features: [
			[
				'core/heading',
				{ level: 2, content: __( 'Key features', 'icts-europe' ) },
			],
			[
				'core/list',
				{
					values:
						'<li>' +
						__( 'Fast onboarding', 'icts-europe' ) +
						'</li><li>' +
						__( 'Automated checks', 'icts-europe' ) +
						'</li><li>' +
						__( 'Global coverage', 'icts-europe' ) +
						'</li>',
				},
			],
			[
				'core/separator',
				{},
			],
			[
				'core/paragraph',
				{
					content: __(
						'Add supporting details, compliance notes, or implementation timeline.',
						'icts-europe'
					),
				},
			],
		],
	};

	const makeModalId = ( clientId ) =>
		`icts-sector-modal-${ clientId.replace( /-/g, '' ).slice( 0, 12 ) }`;

	const FONT_SIZE_OPTIONS = [
		{ label: __( 'Theme default', 'icts-europe' ), value: '' },
		{ label: __( 'X Small', 'icts-europe' ), value: 'x-small' },
		{ label: __( 'Small', 'icts-europe' ), value: 'small' },
		{ label: __( 'Base', 'icts-europe' ), value: 'base' },
		{ label: __( 'Large', 'icts-europe' ), value: 'large' },
		{ label: __( 'X Large', 'icts-europe' ), value: 'x-large' },
		{ label: __( 'H1', 'icts-europe' ), value: 'h-1' },
		{ label: __( 'H2', 'icts-europe' ), value: 'h-2' },
		{ label: __( 'H3', 'icts-europe' ), value: 'h-3' },
		{ label: __( 'H4', 'icts-europe' ), value: 'h-4' },
		{ label: __( 'H5', 'icts-europe' ), value: 'h-5' },
		{ label: __( 'H6', 'icts-europe' ), value: 'h-6' },
		{ label: __( 'Button', 'icts-europe' ), value: 'button' },
	];

	registerBlockType( 'icts/sector-card', {
		edit( { attributes, setAttributes, clientId } ) {
			const {
				imageId,
				imageUrl,
				imageAlt,
				heading,
				headingTag,
				headingFontSize,
				headingFontWeight,
				text,
				textFontSize,
				textFontWeight,
				buttonLabel,
				modalBackgroundColorSlug,
				modalBackgroundColor,
				modalId,
			} = attributes;
				const [ isModalEditorOpen, setModalEditorOpen ] = useState( false );
				const [ lastModalBlockClientId, setLastModalBlockClientId ] = useState( null );

			useEffect( () => {
				if ( ! modalId ) {
					setAttributes( { modalId: makeModalId( clientId ) } );
				}
			}, [ clientId, modalId ] );

				const blockProps = useBlockProps( { className: 'icts-sector-card' } );
				const blockEditorSelect = window.wp.data.select( 'core/block-editor' );
				const blockEditorDispatch = window.wp.data.dispatch( 'core/block-editor' );
				const editorSettings = window.wp.data.select( 'core/block-editor' ).getSettings();
				const themeColors = Array.isArray( editorSettings?.colors ) ? editorSettings.colors : [];
				const modalBackgroundOptions = themeColors.length
				? themeColors.map( ( color ) => ( {
						label: color.name,
						value: color.slug,
				  } ) )
				: [ { label: __( 'Brand Primary Hover', 'icts-europe' ), value: 'brand-primary-hover' } ];

			const modalBackgroundValue = modalBackgroundColorSlug
				? `var(--wp--preset--color--${ modalBackgroundColorSlug })`
				: modalBackgroundColor || undefined;

				const applyModalTemplate = ( key ) => {
					const template = MODAL_LAYOUT_TEMPLATES[ key ];
					if ( ! template ) {
						return;
					}

					const templateBlocks = createBlocksFromInnerBlocksTemplate( template );
					blockEditorDispatch.replaceInnerBlocks( clientId, templateBlocks, false );
				};

				const selectedBlockClientId = blockEditorSelect.getSelectedBlockClientId();
				const selectedBlock = selectedBlockClientId
					? blockEditorSelect.getBlock( selectedBlockClientId )
					: null;
				const selectedParents = selectedBlockClientId
					? blockEditorSelect.getBlockParents( selectedBlockClientId )
					: [];
				const isSelectedBlockInModal =
					!! selectedBlock &&
					selectedParents.includes( clientId ) &&
					( selectedBlock.name === 'core/heading' ||
						selectedBlock.name === 'core/paragraph' );
				const resolvedModalBlockClientId = isSelectedBlockInModal
					? selectedBlockClientId
					: lastModalBlockClientId;
				const resolvedModalBlock = resolvedModalBlockClientId
					? blockEditorSelect.getBlock( resolvedModalBlockClientId )
					: null;
				const isResolvedBlockEditable =
					!! resolvedModalBlock &&
					( resolvedModalBlock.name === 'core/heading' ||
						resolvedModalBlock.name === 'core/paragraph' );

				useEffect( () => {
					if ( isSelectedBlockInModal && selectedBlockClientId ) {
						setLastModalBlockClientId( selectedBlockClientId );
					}
				}, [ isSelectedBlockInModal, selectedBlockClientId ] );

				const changeSelectedBlockType = ( nextBlockName ) => {
					if (
						! isResolvedBlockEditable ||
						! resolvedModalBlock ||
						! resolvedModalBlockClientId
					) {
						return;
					}

					if ( resolvedModalBlock.name === nextBlockName ) {
						return;
					}

					const convertedBlock = switchToBlockType( resolvedModalBlock, nextBlockName );
					if ( convertedBlock ) {
						blockEditorDispatch.replaceBlocks(
							resolvedModalBlockClientId,
							convertedBlock
						);
					}
				};

				const selectedModalBlockControls = isResolvedBlockEditable
					? el(
							'div',
							{ className: 'icts-sector-card__modal-selected-block-controls' },
							el( SelectControl, {
								label: __( 'Selected block type', 'icts-europe' ),
								value: resolvedModalBlock.name,
								options: [
									{ label: __( 'Heading', 'icts-europe' ), value: 'core/heading' },
									{ label: __( 'Paragraph', 'icts-europe' ), value: 'core/paragraph' },
								],
								onChange: changeSelectedBlockType,
							} ),
							resolvedModalBlock.name === 'core/heading'
								? el( SelectControl, {
										label: __( 'Heading level', 'icts-europe' ),
										value: String( resolvedModalBlock.attributes?.level || 2 ),
										options: [
											{ label: __( 'H1', 'icts-europe' ), value: '1' },
											{ label: __( 'H2', 'icts-europe' ), value: '2' },
											{ label: __( 'H3', 'icts-europe' ), value: '3' },
											{ label: __( 'H4', 'icts-europe' ), value: '4' },
											{ label: __( 'H5', 'icts-europe' ), value: '5' },
											{ label: __( 'H6', 'icts-europe' ), value: '6' },
										],
										onChange: ( value ) =>
											blockEditorDispatch.updateBlockAttributes(
												resolvedModalBlockClientId,
												{ level: Number( value ) }
											),
								  } )
								: null
					  )
					: null;

				const cardInspector = el(
					InspectorControls,
					null,
				el(
					PanelBody,
					{ title: __( 'Card Settings', 'icts-europe' ), initialOpen: true },
					el( TextControl, {
						label: __( 'Learn More label', 'icts-europe' ),
						value: buttonLabel,
						onChange: ( value ) => setAttributes( { buttonLabel: value } ),
					} )
				),
				el(
					PanelBody,
					{ title: __( 'Typography', 'icts-europe' ), initialOpen: false },
					el( SelectControl, {
						label: __( 'Heading element', 'icts-europe' ),
						value: headingTag || 'p',
						options: [
							{ label: __( 'Heading 2', 'icts-europe' ), value: 'h2' },
							{ label: __( 'Heading 3', 'icts-europe' ), value: 'h3' },
							{ label: __( 'Heading 4', 'icts-europe' ), value: 'h4' },
							{ label: __( 'Heading 5', 'icts-europe' ), value: 'h5' },
							{ label: __( 'Heading 6', 'icts-europe' ), value: 'h6' },
							{ label: __( 'Paragraph', 'icts-europe' ), value: 'p' },
						],
						onChange: ( value ) => setAttributes( { headingTag: value } ),
					} ),
					el( SelectControl, {
						label: __( 'Heading font size', 'icts-europe' ),
						value: headingFontSize || '',
						options: FONT_SIZE_OPTIONS,
						onChange: ( value ) => setAttributes( { headingFontSize: value } ),
					} ),
					el( SelectControl, {
						label: __( 'Heading font weight', 'icts-europe' ),
						value: headingFontWeight || '',
						options: [
							{ label: __( 'Theme default', 'icts-europe' ), value: '' },
							{ label: '300', value: '300' },
							{ label: '400', value: '400' },
							{ label: '500', value: '500' },
							{ label: '600', value: '600' },
							{ label: '700', value: '700' },
							{ label: '800', value: '800' },
							{ label: '900', value: '900' },
						],
						onChange: ( value ) => setAttributes( { headingFontWeight: value } ),
					} ),
					el( SelectControl, {
						label: __( 'Body font size', 'icts-europe' ),
						value: textFontSize || '',
						options: FONT_SIZE_OPTIONS,
						onChange: ( value ) => setAttributes( { textFontSize: value } ),
					} ),
					el( SelectControl, {
						label: __( 'Body font weight', 'icts-europe' ),
						value: textFontWeight || '',
						options: [
							{ label: __( 'Theme default', 'icts-europe' ), value: '' },
							{ label: '300', value: '300' },
							{ label: '400', value: '400' },
							{ label: '500', value: '500' },
							{ label: '600', value: '600' },
							{ label: '700', value: '700' },
							{ label: '800', value: '800' },
							{ label: '900', value: '900' },
						],
						onChange: ( value ) => setAttributes( { textFontWeight: value } ),
					} )
				),
					el(
						PanelBody,
						{ title: __( 'Modal', 'icts-europe' ), initialOpen: false },
						el( SelectControl, {
							label: __( 'Modal background color', 'icts-europe' ),
						value: modalBackgroundColorSlug || 'brand-primary-hover',
						options: modalBackgroundOptions,
						onChange: ( value ) =>
							setAttributes( {
								modalBackgroundColorSlug: value || '',
								modalBackgroundColor: '',
							} ),
					} ),
						isSelectedBlockInModal
							? el(
									Fragment,
									null,
									el( SelectControl, {
										label: __( 'Selected block type', 'icts-europe' ),
										value: selectedBlock.name,
										options: [
											{ label: __( 'Heading', 'icts-europe' ), value: 'core/heading' },
											{ label: __( 'Paragraph', 'icts-europe' ), value: 'core/paragraph' },
										],
										onChange: changeSelectedBlockType,
									} ),
									selectedBlock.name === 'core/heading'
										? el( SelectControl, {
												label: __( 'Heading level', 'icts-europe' ),
												value: String( selectedBlock.attributes?.level || 2 ),
												options: [
													{ label: __( 'H1', 'icts-europe' ), value: '1' },
													{ label: __( 'H2', 'icts-europe' ), value: '2' },
													{ label: __( 'H3', 'icts-europe' ), value: '3' },
													{ label: __( 'H4', 'icts-europe' ), value: '4' },
													{ label: __( 'H5', 'icts-europe' ), value: '5' },
													{ label: __( 'H6', 'icts-europe' ), value: '6' },
												],
												onChange: ( value ) =>
													blockEditorDispatch.updateBlockAttributes(
														selectedBlockClientId,
														{ level: Number( value ) }
													),
										  } )
										: null
							  )
							: null
					)
				);

			const templateButtons = el(
				'div',
				{ className: 'icts-sector-card__modal-layout-actions' },
				el(
					Button,
					{
						variant: 'secondary',
						onClick: () => applyModalTemplate( 'simple' ),
					},
					__( 'Simple', 'icts-europe' )
				),
				el(
					Button,
					{
						variant: 'secondary',
						onClick: () => applyModalTemplate( 'twoColumn' ),
					},
					__( '2 Column', 'icts-europe' )
				),
				el(
					Button,
					{
						variant: 'secondary',
						onClick: () => applyModalTemplate( 'features' ),
					},
					__( 'Feature List', 'icts-europe' )
				)
			);

			return el(
				Fragment,
				null,
				cardInspector,
				el(
					'div',
					blockProps,
					el(
						'div',
						{ className: 'icts-sector-card__card-editor' },
						el(
							'div',
							{ className: 'icts-sector-card__media-editor' },
							el(
								MediaUploadCheck,
								null,
								el( MediaUpload, {
									onSelect: ( media ) =>
										setAttributes( {
											imageId: media?.id,
											imageUrl: media?.url,
											imageAlt: media?.alt || '',
										} ),
									allowedTypes: [ 'image' ],
									value: imageId,
									render: ( { open } ) =>
										el(
											Button,
											{ variant: 'secondary', onClick: open },
											imageUrl
												? __( 'Replace image', 'icts-europe' )
												: __( 'Choose image', 'icts-europe' )
										),
								} )
							),
							imageUrl
								? el( 'img', { src: imageUrl, alt: imageAlt || '' } )
								: el(
										'div',
										{ className: 'icts-sector-card__media-placeholder' },
										__( 'Card image', 'icts-europe' )
								  )
						),
						el(
							'div',
							{ className: 'icts-sector-card__body-editor' },
							el( RichText, {
								tagName: headingTag || 'p',
								className: 'icts-sector-card__heading',
								value: heading,
								onChange: ( value ) => setAttributes( { heading: value } ),
								placeholder: __( 'Sector title', 'icts-europe' ),
								style: {
									fontSize: headingFontSize
										? `var(--wp--preset--font-size--${ headingFontSize })`
										: undefined,
									fontWeight: headingFontWeight || undefined,
								},
							} ),
							el( RichText, {
								tagName: 'p',
								className: 'icts-sector-card__text',
								value: text,
								onChange: ( value ) => setAttributes( { text: value } ),
								placeholder: __( 'Short summary text', 'icts-europe' ),
								style: {
									fontSize: textFontSize
										? `var(--wp--preset--font-size--${ textFontSize })`
										: undefined,
									fontWeight: textFontWeight || undefined,
								},
							} ),
							el(
								'div',
								{ className: 'icts-sector-card__learn-more-editor', 'aria-hidden': true },
								buttonLabel || __( 'Learn More', 'icts-europe' )
							)
						)
					),
					el(
						'div',
						{
							className: 'icts-sector-card__modal-editor',
							style: { background: modalBackgroundValue },
						},
						el(
							'p',
							{ className: 'icts-sector-card__modal-editor-label' },
							__( 'Modal content', 'icts-europe' )
						),
						templateButtons,
						el(
							Button,
							{
								variant: 'primary',
								onClick: () => setModalEditorOpen( true ),
								className: 'icts-sector-card__modal-editor-open',
							},
							__( 'Edit modal content', 'icts-europe' )
						),
						el(
							'p',
							{ className: 'icts-sector-card__modal-editor-hint' },
							__(
								'Open the modal editor to edit this card’s detailed content in a larger canvas.',
								'icts-europe'
							)
						)
					)
				),
				isModalEditorOpen
					? el(
							'div',
							{
								className: 'icts-sector-card__modal-editor-overlay',
								role: 'presentation',
							},
							el( 'div', {
								className: 'icts-sector-card__modal-editor-backdrop',
								onClick: () => setModalEditorOpen( false ),
							} ),
							el(
								'div',
								{
									className: 'icts-sector-card__modal-editor-dialog',
									role: 'dialog',
									'aria-modal': 'true',
									'aria-label': __( 'Edit modal content', 'icts-europe' ),
								},
								el(
									'div',
									{ className: 'icts-sector-card__modal-editor-header' },
									el(
										'h2',
										{ className: 'icts-sector-card__modal-editor-title' },
										__( 'Edit modal content', 'icts-europe' )
									),
									el( Button, {
										icon: 'no-alt',
										label: __( 'Close', 'icts-europe' ),
										className: 'icts-sector-card__modal-editor-close',
										onClick: () => setModalEditorOpen( false ),
									} )
								),
								el(
									'div',
									{ className: 'icts-sector-card__modal-editor-overlay-inner' },
									templateButtons,
									selectedModalBlockControls,
									el(
										'div',
										{
											className: 'icts-sector-card__modal-editor-canvas',
											style: { background: modalBackgroundValue },
										},
									el( InnerBlocks, {
										template: MODAL_TEMPLATE,
										templateInsertUpdatesSelection: false,
										__experimentalCaptureToolbars: true,
										renderAppender: InnerBlocks.ButtonBlockAppender,
									} )
								)
							)
					  )
					  )
					: null
			);
		},
		save() {
			return el( InnerBlocks.Content );
		},
	} );
} )(
	window.wp.blocks,
	window.wp.blockEditor,
	window.wp.components,
	window.wp.element,
	window.wp.i18n
);
