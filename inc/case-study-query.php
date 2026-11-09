<?php
/**
 * Match every included category in the Case Studies pattern's Query Loop.
 *
 * @package icts-europe
 */

namespace ICTS_Europe;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Use the same category intersection in the editor and the rendered loop.
 *
 * @param array $args WordPress query arguments.
 * @return array
 */
function match_case_study_categories( $args ) {
	foreach ( $args['tax_query'] ?? array() as $key => $clause ) {
		if ( 'category' === ( $clause['taxonomy'] ?? '' ) && 'IN' === ( $clause['operator'] ?? 'IN' ) ) {
			$args['tax_query'][ $key ]['operator'] = 'AND';
		}
	}
	return $args;
}

add_filter(
	'query_loop_block_query_vars',
	static function ( $args, $block ) {
		return empty( $block->context['query']['ictsMatchCategories'] ) ? $args : match_case_study_categories( $args );
	},
	10,
	2
);

add_filter(
	'rest_post_query',
	static function ( $args, $request ) {
		return rest_sanitize_boolean( $request->get_param( 'ictsMatchCategories' ) ) ? match_case_study_categories( $args ) : $args;
	},
	10,
	2
);
