( function ( wp ) {
	'use strict';

	if ( ! wp || ! wp.data || ! wp.domReady ) {
		return;
	}

	var isApplyingLimit = false;
	var NOTICE_ID = 'icts-counter-band-limit';
	var MAX_COUNTERS = 4;

	function hasClass( classNameValue, expectedClass ) {
		if ( ! classNameValue || ! expectedClass ) {
			return false;
		}

		return String( classNameValue )
			.split( /\s+/ )
			.filter( Boolean )
			.indexOf( expectedClass ) !== -1;
	}

	function getCounterBandGrids( blocks ) {
		var grids = [];
		var stack = Array.isArray( blocks ) ? blocks.slice() : [];

		while ( stack.length ) {
			var block = stack.pop();
			if ( ! block ) {
				continue;
			}

			if ( Array.isArray( block.innerBlocks ) && block.innerBlocks.length ) {
				Array.prototype.push.apply( stack, block.innerBlocks );
			}

			if (
				block.name === 'core/group' &&
				hasClass( block.attributes && block.attributes.className, 'icts-counter-band__grid' )
			) {
				grids.push( block );
			}
		}

		return grids;
	}

	function enforceCounterBandLimit() {
		if ( isApplyingLimit ) {
			return;
		}

		var editorSelect = wp.data.select( 'core/block-editor' );
		var editorDispatch = wp.data.dispatch( 'core/block-editor' );
		var noticesDispatch = wp.data.dispatch( 'core/notices' );
		var rootBlocks = editorSelect.getBlocks();
		var grids = getCounterBandGrids( rootBlocks );
		var hasTrimmedBlocks = false;
		var hasNormalizedLayout = false;
		var hasRemovedUnsupported = false;

		grids.forEach( function ( grid ) {
			var layout = ( grid.attributes && grid.attributes.layout ) || {};
			var needsLayoutNormalize = layout.type !== 'grid';

			if ( needsLayoutNormalize ) {
				isApplyingLimit = true;
				editorDispatch.updateBlockAttributes( grid.clientId, {
					layout: {
						type: 'grid',
						minimumColumnWidth: '15rem',
					},
				} );
				isApplyingLimit = false;
				hasNormalizedLayout = true;
			}

			var unsupportedIds = ( grid.innerBlocks || [] )
				.filter( function ( innerBlock ) {
					return innerBlock && innerBlock.name !== 'acf/counter';
				} )
				.map( function (innerBlock) {
					return innerBlock.clientId;
				} );

			if ( unsupportedIds.length ) {
				isApplyingLimit = true;
				editorDispatch.removeBlocks( unsupportedIds, false );
				isApplyingLimit = false;
				hasRemovedUnsupported = true;
			}

			var counterBlocks = ( grid.innerBlocks || [] ).filter( function ( innerBlock ) {
				return innerBlock && innerBlock.name === 'acf/counter';
			} );

			if ( counterBlocks.length <= MAX_COUNTERS ) {
				return;
			}

			var overflowIds = counterBlocks.slice( MAX_COUNTERS ).map( function ( counterBlock ) {
				return counterBlock.clientId;
			} );

			if ( ! overflowIds.length ) {
				return;
			}

			isApplyingLimit = true;
			editorDispatch.removeBlocks( overflowIds, false );
			isApplyingLimit = false;
			hasTrimmedBlocks = true;
		} );

		if ( hasTrimmedBlocks ) {
			noticesDispatch.createNotice(
				'warning',
				'Counter Band supports a maximum of 4 Counter Blocks. Extra counters were removed.',
				{
					id: NOTICE_ID,
					type: 'snackbar',
				}
			);
		}

		if ( hasRemovedUnsupported ) {
			noticesDispatch.createNotice(
				'warning',
				'Counter Band only supports Counter blocks. Unsupported blocks were removed.',
				{
					id: NOTICE_ID + '-allowed',
					type: 'snackbar',
				}
			);
		}

		if ( hasNormalizedLayout ) {
			noticesDispatch.createNotice(
				'info',
				'Counter Band layout was normalized to Grid for consistent behavior.',
				{
					id: NOTICE_ID + '-layout',
					type: 'snackbar',
				}
			);
		}
	}

	wp.domReady( function () {
		enforceCounterBandLimit();
		wp.data.subscribe( enforceCounterBandLimit );
	} );
}( window.wp ) );
