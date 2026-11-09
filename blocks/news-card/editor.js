( function ( wp ) {
	const el = wp.element.createElement;
	const ServerSideRender = wp.serverSideRender.ServerSideRender || wp.serverSideRender;

	wp.blocks.registerBlockType( 'icts/news-card', {
		edit: function ( { context } ) {
			const props = wp.blockEditor.useBlockProps();
			return el( 'div', props, context.postId && el( wp.components.Disabled, {},
				el( ServerSideRender, {
					block: 'icts/news-card',
					urlQueryArgs: { post_id: context.postId }
				} )
			) );
		},
		save: function () {
			return null;
		}
	} );
} )( window.wp );
