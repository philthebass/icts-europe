( function ( wp ) {
	const { registerBlockType } = wp.blocks;
	const { __ } = wp.i18n;
	const { Fragment } = wp.element;
	const { useBlockProps, InspectorControls, BlockControls } = wp.blockEditor || wp.editor;
	const { useSelect } = wp.data;
	const { PanelBody, RangeControl, ToggleControl, TextControl, ToolbarGroup, ToolbarButton, CheckboxControl } = wp.components;
	const ServerSideRender = wp.serverSideRender;

	registerBlockType( 'icts/latest-news-slider', {
		edit: function ( props ) {
			const { attributes, setAttributes } = props;
			const preview = !!attributes.preview;
			const selectedCategoryIds = Array.isArray( attributes.categoryIds ) ? attributes.categoryIds : [];
			const categories = useSelect(
				function ( select ) {
					return select( 'core' ).getEntityRecords( 'taxonomy', 'category', {
						per_page: 100,
						orderby: 'name',
						order: 'asc',
						hide_empty: false
					} );
				},
				[]
			);

			const toggleCategory = function ( termId, checked ) {
				const next = checked
					? [ ...selectedCategoryIds, termId ]
					: selectedCategoryIds.filter( function ( id ) {
						return id !== termId;
					} );

				setAttributes( {
					categoryIds: Array.from( new Set( next ) )
				} );
			};

			const blockProps = useBlockProps( {
				className: 'icts-latest-news-slider-editor' + ( preview ? ' is-previewing' : '' )
			} );

			return wp.element.createElement(
				Fragment,
				{},
				wp.element.createElement(
					InspectorControls,
					{},
					wp.element.createElement(
						PanelBody,
						{ title: __( 'Slider Settings', 'icts-europe' ), initialOpen: true },
						wp.element.createElement( RangeControl, {
							label: __( 'Posts to show', 'icts-europe' ),
							min: 3,
							max: 12,
							step: 1,
							value: attributes.postsToShow || 9,
							onChange: function ( value ) {
								setAttributes( { postsToShow: value } );
							}
						} ),
						wp.element.createElement( RangeControl, {
							label: __( 'Autoplay (ms)', 'icts-europe' ),
							min: 0,
							max: 15000,
							step: 500,
							value: attributes.autoplay || 7000,
							onChange: function ( value ) {
								setAttributes( { autoplay: value } );
							}
						} ),
						wp.element.createElement( TextControl, {
							label: __( 'Heading', 'icts-europe' ),
							value: attributes.heading || '',
							onChange: function ( value ) {
								setAttributes( { heading: value } );
							}
						} )
					),
					wp.element.createElement(
						PanelBody,
						{ title: __( 'Category Filter', 'icts-europe' ), initialOpen: false },
						wp.element.createElement( ToggleControl, {
							label: __( 'Show all categories', 'icts-europe' ),
							checked: selectedCategoryIds.length === 0,
							__nextHasNoMarginBottom: true,
							onChange: function ( checked ) {
								if ( checked ) {
									setAttributes( { categoryIds: [] } );
								}
							}
						} ),
						Array.isArray( categories ) && categories.length
							? categories.map( function ( term ) {
								const termId = Number( term.id );
								return wp.element.createElement( CheckboxControl, {
									key: term.id,
									label: term.name,
									checked: selectedCategoryIds.includes( termId ),
									__nextHasNoMarginBottom: true,
									onChange: function ( checked ) {
										toggleCategory( termId, checked );
									}
								} );
							} )
							: wp.element.createElement(
								'p',
								{ style: { marginTop: 8 } },
								__( 'No categories found.', 'icts-europe' )
							)
					),
					wp.element.createElement(
						PanelBody,
						{ title: __( 'Display Options', 'icts-europe' ), initialOpen: false },
						wp.element.createElement( ToggleControl, {
							label: __( 'Preview first slide only', 'icts-europe' ),
							checked: preview,
							__nextHasNoMarginBottom: true,
							onChange: function ( checked ) {
								setAttributes( { preview: !!checked } );
							}
						} ),
						wp.element.createElement( ToggleControl, {
							label: __( 'Show date', 'icts-europe' ),
							checked: attributes.showDate !== false,
							__nextHasNoMarginBottom: true,
							onChange: function ( checked ) {
								setAttributes( { showDate: !!checked } );
							}
						} ),
						wp.element.createElement( ToggleControl, {
							label: __( 'Show author', 'icts-europe' ),
							checked: attributes.showAuthor !== false,
							__nextHasNoMarginBottom: true,
							onChange: function ( checked ) {
								setAttributes( { showAuthor: !!checked } );
							}
						} )
					)
				),
				wp.element.createElement(
					'div',
					blockProps,
					wp.element.createElement(
						BlockControls,
						{},
						wp.element.createElement(
							ToolbarGroup,
							{},
							wp.element.createElement( ToolbarButton, {
								icon: preview ? 'visibility' : 'hidden',
								label: preview ? __( 'Exit preview', 'icts-europe' ) : __( 'Preview', 'icts-europe' ),
								isPressed: preview,
								onClick: function () {
									setAttributes( { preview: !preview } );
								}
							} )
						)
					),
					wp.element.createElement( ServerSideRender, {
						block: 'icts/latest-news-slider',
						attributes: attributes
					} )
				)
			);
		},
		save: function () {
			return null;
		}
	} );
} )( window.wp );
