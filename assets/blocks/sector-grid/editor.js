( function ( blocks, blockEditor ) {
	const { registerBlockType } = blocks;
	const { InnerBlocks, useBlockProps } = blockEditor;
	const el = wp.element.createElement;

	const ALLOWED_BLOCKS = [ 'icts/sector-card' ];
	const TEMPLATE = [ [ 'icts/sector-card' ], [ 'icts/sector-card' ], [ 'icts/sector-card' ] ];

	registerBlockType( 'icts/sector-grid', {
		edit() {
			const blockProps = useBlockProps( { className: 'icts-sector-grid' } );
			return el(
				'div',
				blockProps,
				el( InnerBlocks, {
					allowedBlocks: ALLOWED_BLOCKS,
					template: TEMPLATE,
					orientation: 'horizontal',
					templateInsertUpdatesSelection: false,
					renderAppender: InnerBlocks.ButtonBlockAppender,
				} )
			);
		},
		save() {
			return el(
				'div',
				useBlockProps.save( { className: 'icts-sector-grid' } ),
				el( InnerBlocks.Content )
			);
		},
	} );
} )( window.wp.blocks, window.wp.blockEditor );
