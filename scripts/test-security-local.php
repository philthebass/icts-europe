<?php
/**
 * Local-only regression tests. Run with WP-CLI eval-file after installing the package.
 * Fixtures are isolated by query filters and rolled back, including on test failure.
 */
if ( ! defined( 'WP_CLI' ) || ! WP_CLI || ! preg_match( '/\.local$/', (string) wp_parse_url( home_url(), PHP_URL_HOST ) ) ) {
	throw new RuntimeException( 'Run only through WP-CLI on a .local site.' );
}
if ( ! function_exists( 'acf' ) || ! function_exists( 'pll_set_post_language' ) || ! function_exists( 'ICTS_Europe\can_reorder_faqs' ) ) {
	throw new RuntimeException( 'The patched theme, ACF Pro and Polylang must be active.' );
}
global $wpdb;
$table = $wpdb->get_row( $wpdb->prepare( 'SHOW TABLE STATUS WHERE Name = %s', $wpdb->posts ) );
if ( ! $table || 'InnoDB' !== $table->Engine ) {
	throw new RuntimeException( 'Transactional posts table required.' );
}
$assert = static function ( $condition, $message ) {
	if ( ! $condition ) {
		throw new RuntimeException( $message );
	}
	echo "PASS: $message\n";
};
add_filter( 'pre_http_request', static function () { return new WP_Error( 'local_test', 'Outbound HTTP blocked during fixtures.' ); }, PHP_INT_MAX );
add_filter( 'pre_wp_mail', '__return_true', PHP_INT_MAX );
add_filter( 'wp_die_ajax_handler', static function () {
	return static function () { throw new RuntimeException( 'icts_test_ajax_finished' ); };
} );
if ( ! defined( 'DOING_AJAX' ) ) { define( 'DOING_AJAX', true ); }
$fixture_ids = [];
$original_user = get_current_user_id();
$admin_ids = get_users( [ 'role' => 'administrator', 'number' => 1, 'fields' => 'ID' ] );
if ( ! $admin_ids ) { throw new RuntimeException( 'A Local administrator is required.' ); }
$as_role = static function ( $role ) use ( $admin_ids ) {
	wp_set_current_user( 0 );
	$user = wp_set_current_user( $admin_ids[0] );
	$user->allcaps = get_role( $role )->capabilities;
	// Explicitly simulate an editor whose HTML is filtered.
	if ( 'editor' === $role ) { $user->allcaps['unfiltered_html'] = false; }
};
$ajax = static function ( $ids, $extra = [] ) {
	$_POST = array_merge( [ 'orderedIds' => $ids, 'nonce' => wp_create_nonce( 'icts_faq_reorder' ) ], $extra );
	$_REQUEST = $_POST;
	ob_start();
	try {
		\ICTS_Europe\ajax_save_faq_reorder();
	} catch ( RuntimeException $e ) {
		if ( 'icts_test_ajax_finished' !== $e->getMessage() ) { ob_end_clean(); throw $e; }
	}
	return json_decode( ob_get_clean(), true );
};
$query_scope = static function ( $query ) use ( &$fixture_ids ) {
	if ( 'faq' === $query->get( 'post_type' ) ) { $query->set( 'post__in', $fixture_ids ?: [ 0 ] ); }
};
add_action( 'pre_get_posts', $query_scope, 999 );
$wpdb->query( 'START TRANSACTION' );
try {
	$as_role( 'administrator' );
	$answer = '<p>Keep this answer.</p><iframe src="https://example.com/embed"></iframe><form><input name="test"></form>';
	$langs = pll_languages_list();
	$assert( count( $langs ) >= 2, 'Polylang has multiple languages for regression coverage' );
	foreach ( [ 'A', 'B', 'C', 'D' ] as $i => $title ) {
		$wpdb->insert( $wpdb->posts, [
			'post_type' => 'faq', 'post_status' => 'publish', 'post_author' => (int) $admin_ids[0],
			'post_title' => 'Temporary security fixture ' . $title, 'post_content' => $answer,
			'menu_order' => ( $i + 1 ) * 10, 'post_date' => '2026-10-05 12:00:00',
			'post_date_gmt' => '2026-10-05 11:00:00', 'post_modified' => '2026-10-05 12:00:00',
			'post_modified_gmt' => '2026-10-05 11:00:00', 'post_excerpt' => '', 'to_ping' => '', 'pinged' => '', 'post_content_filtered' => '',
		] );
		$id = (int) $wpdb->insert_id;
		$assert( $id > 0, 'Temporary FAQ created' );
		$fixture_ids[] = $id;
		pll_set_post_language( $id, $i < 3 ? $langs[0] : $langs[1] );
	}
	[ $a, $b, $c, $d ] = $fixture_ids;
	$before = [];
	foreach ( $fixture_ids as $id ) { $before[$id] = get_post( $id, ARRAY_A ); }
	foreach ( [ 'subscriber', 'contributor', 'author' ] as $role ) {
		$as_role( $role );
		$assert( ! \ICTS_Europe\can_reorder_faqs(), "$role cannot receive reorder controls" );
		$result = $ajax( [ $c, $b, $a ], [ 'lang' => $langs[0] ] );
		$assert( false === $result['success'], "$role forged reorder rejected with a valid nonce" );
	}
	$as_role( 'editor' );
	$assert( \ICTS_Europe\can_reorder_faqs(), 'Editor may reorder published FAQs' );
	$deny_one = static function ( $caps, $cap, $user_id, $args ) use ( $b ) {
		return 'edit_post' === $cap && (int) ( $args[0] ?? 0 ) === $b ? [ 'do_not_allow' ] : $caps;
	};
	add_filter( 'map_meta_cap', $deny_one, 999, 4 );
	$result = $ajax( [ $c, $a ], [ 'lang' => $langs[0] ] );
	$assert( false === $result['success'], 'Permission checked even on an affected FAQ omitted from the submitted subset' );
	foreach ( $fixture_ids as $id ) { $assert( (int) get_post( $id )->menu_order === (int) $before[$id]['menu_order'], 'Denied request writes no ordering values' ); }
	remove_filter( 'map_meta_cap', $deny_one, 999 );
	$result = $ajax( [ $a, $a ], [ 'lang' => $langs[0] ] );
	$assert( false === $result['success'], 'Duplicate IDs rejected' );
	$result = $ajax( [ $d, $a ], [ 'lang' => $langs[0] ] );
	$assert( false === $result['success'], 'IDs from another language rejected' );
	$result = $ajax( [ $c, $a ], [ 'lang' => $langs[0] ] );
	$assert( true === $result['success'], 'Authorised partial list reordering succeeds' );
	$assert( 10 === (int) get_post( $c )->menu_order && 20 === (int) get_post( $b )->menu_order && 30 === (int) get_post( $a )->menu_order, 'Subset changes preserve other list slots' );
	$assert( 40 === (int) get_post( $d )->menu_order, 'Other language ordering is unchanged' );
	foreach ( $fixture_ids as $id ) {
		$after = get_post( $id, ARRAY_A ); unset( $after['menu_order'], $before[$id]['menu_order'] );
		$assert( $before[$id] === $after, 'All FAQ fields except ordering remain byte-for-byte unchanged' );
	}
	$render_card = static function ( $attrs ) {
		return render_block( [ 'blockName' => 'icts/sector-card', 'attrs' => $attrs, 'innerBlocks' => [], 'innerHTML' => '', 'innerContent' => [] ] );
	};
	$attack = '1rem;position:fixed;inset:0;background:url(https://attacker.invalid/x.png)';
	$html = $render_card( [ 'heading' => 'Test', 'text' => 'Text', 'headingFontSize' => $attack, 'textFontSize' => $attack, 'headingFontWeight' => $attack, 'textFontWeight' => $attack ] );
	$assert( false === strpos( $html, 'attacker.invalid' ) && false === strpos( $html, 'position:fixed' ), 'Sector Card rejects CSS injection through all four typography attributes' );
	$html = $render_card( [ 'heading' => 'Test', 'text' => 'Text', 'headingFontSize' => 'h-3', 'headingFontWeight' => '600', 'textFontSize' => 'small', 'textFontWeight' => 'normal' ] );
	$assert( false !== strpos( $html, 'var(--wp--preset--font-size--h-3)' ) && false !== strpos( $html, 'font-weight:600' ), 'Valid Sector Card presets still render' );
	$seen_limit = 0;
	$inspect_query = static function ( $query ) use ( &$seen_limit ) {
		if ( 'post' === $query->get( 'post_type' ) ) { $seen_limit = $query->get( 'posts_per_page' ); }
	};
	add_action( 'pre_get_posts', $inspect_query, 999 );
	ob_start(); $attributes = [ 'postsToShow' => 999999 ]; include get_template_directory() . '/blocks/latest-news-slider/render.php'; ob_end_clean();
	remove_action( 'pre_get_posts', $inspect_query, 999 );
	$assert( 24 === $seen_limit, 'News slider caps excessive query sizes at 24' );
	$registered = WP_Block_Patterns_Registry::get_instance()->get_all_registered();
	$theme_patterns = array_values( array_filter( array_column( $registered, 'name' ), static function ( $name ) { return 0 === strpos( $name, 'icts-europe/' ); } ) );
	$approved = \ICTS_Europe\get_launch_approved_pattern_slugs(); sort( $approved ); sort( $theme_patterns );
	$assert( $approved === $theme_patterns, 'Only approved theme patterns are registered' );
	wp_set_current_user( 0 );
	$response = rest_do_request( new WP_REST_Request( 'GET', '/wp/v2/faq/' . $a ) );
	$assert( 200 === $response->get_status(), 'Published FAQ remains readable anonymously through REST' );
	$wpdb->update( $wpdb->posts, [ 'post_status' => 'draft' ], [ 'ID' => $a ] ); clean_post_cache( $a );
	$response = rest_do_request( new WP_REST_Request( 'GET', '/wp/v2/faq/' . $a ) );
	$assert( $response->get_status() >= 400, 'Draft FAQ remains protected from anonymous REST reads' );
} finally {
	$wpdb->query( 'ROLLBACK' );
	foreach ( $fixture_ids as $id ) { clean_post_cache( $id ); }
	wp_cache_flush();
	wp_set_current_user( $original_user );
	remove_action( 'pre_get_posts', $query_scope, 999 );
	echo "Fixture transaction rolled back.\n";
}
