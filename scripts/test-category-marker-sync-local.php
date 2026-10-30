<?php
/**
 * Transactional Local regression checks for category marker translation sync.
 * Run with WP-CLI eval-file; requires the theme and Polylang.
 */
if ( ! defined( 'WP_CLI' ) || ! WP_CLI || ! preg_match( '/\.local$/', (string) wp_parse_url( home_url(), PHP_URL_HOST ) ) ) {
    throw new RuntimeException( 'Run only through WP-CLI on a .local site.' );
}
if ( ! function_exists( 'pll_save_term_translations' ) || ! function_exists( 'ICTS_Europe\sync_category_marker_color_meta' ) ) {
    throw new RuntimeException( 'The updated theme and Polylang must be active.' );
}
global $wpdb;
foreach ( [ $wpdb->terms, $wpdb->term_taxonomy, $wpdb->term_relationships, $wpdb->termmeta ] as $table_name ) {
    $table = $wpdb->get_row( $wpdb->prepare( 'SHOW TABLE STATUS WHERE Name = %s', $table_name ) );
    if ( ! $table || 'InnoDB' !== $table->Engine ) {
        throw new RuntimeException( 'Transactional taxonomy tables required.' );
    }
}
$admins = get_users( [ 'role' => 'administrator', 'number' => 1, 'fields' => 'ID' ] );
$langs = pll_languages_list();
if ( ! $admins || count( $langs ) < 2 ) {
    throw new RuntimeException( 'A Local administrator and at least two languages are required.' );
}
$original_user = get_current_user_id();
$original_post = $_POST;
wp_set_current_user( $admins[0] );
$_POST = [];
add_filter( 'pre_http_request', static function () { return new WP_Error( 'local_test', 'Outbound HTTP blocked during fixtures.' ); }, PHP_INT_MAX );
add_filter( 'pre_wp_mail', '__return_true', PHP_INT_MAX );
$ids = [];
$assert = static function ( $ok, $message ) {
    if ( ! $ok ) { throw new RuntimeException( $message ); }
    echo "PASS: $message\n";
};
$create = static function ( $suffix, $taxonomy = 'category' ) use ( &$ids ) {
    $term = wp_insert_term( 'Temporary marker sync ' . wp_generate_uuid4() . ' ' . $suffix, $taxonomy );
    if ( is_wp_error( $term ) ) { throw new RuntimeException( $term->get_error_message() ); }
    $id = (int) $term['term_id'];
    $ids[ $id ] = $taxonomy;
    return $id;
};
$save = static function ( $id, $slug ) {
    $_POST = [ 'icts_category_color_slug' => $slug ];
    try {
        $result = wp_update_term( $id, 'category', [] );
        if ( is_wp_error( $result ) ) { throw new RuntimeException( $result->get_error_message() ); }
    } finally { $_POST = []; }
};
$key = 'icts_category_color_slug';
$wpdb->query( 'START TRANSACTION' );
try {
    $group = [];
    $names = [];
    foreach ( $langs as $i => $lang ) {
        $id = $create( $lang );
        pll_set_term_language( $id, $lang );
        update_term_meta( $id, $key, $i % 2 ? 'brand-tertiary' : 'brand-secondary' );
        update_term_meta( $id, 'icts_marker_test_unrelated', $lang );
        $group[ $lang ] = $id;
        $names[ $id ] = get_term( $id )->name;
    }
    pll_save_term_translations( $group );
    $group_ids = array_values( $group );
    $other = $create( 'unrelated' );
    update_term_meta( $other, $key, 'brand-secondary' );
    $all_match = static function ( $value ) use ( $group_ids, $key ) {
        foreach ( $group_ids as $id ) {
            if ( get_term_meta( $id, $key, true ) !== $value ) { return false; }
        }
        return true;
    };
    $save( $group_ids[0], 'brand-primary' );
    $assert( $all_match( 'brand-primary' ), 'Saving one category reconciles all ' . count( $group_ids ) . ' language versions, including previously different tokens' );
    $save( $group_ids[1], 'brand-tertiary' );
    $assert( $all_match( 'brand-tertiary' ), 'Changing a non-source-language category synchronises the whole group' );
    $save( $group_ids[1], '' );
    $assert( $all_match( '' ), 'Selecting Default removes the token from every translation' );
    $save( $group_ids[0], 'brand-primary' );
    // Deliberately recreate old inconsistent data, then save an unchanged source value.
    remove_filter( 'pll_copy_term_metas', 'ICTS_Europe\sync_category_marker_color_meta', 10 );
    update_term_meta( $group_ids[1], $key, 'brand-secondary' );
    add_filter( 'pll_copy_term_metas', 'ICTS_Europe\sync_category_marker_color_meta', 10, 4 );
    $save( $group_ids[0], 'brand-primary' );
    $assert( $all_match( 'brand-primary' ), 'Saving an unchanged token repairs existing translation differences' );
    wp_update_term( $group_ids[0], 'category', [] );
    $assert( $all_match( 'brand-primary' ), 'An update without the marker field does not clear the selected token' );
    $duplicate = $create( 'duplicate' );
    pll_set_term_language( $duplicate, $langs[1] );
    do_action( 'pll_duplicate_term', $group_ids[0], $duplicate, $langs[1] );
    $assert( 'brand-primary' === get_term_meta( $duplicate, $key, true ), 'Polylang term duplication copies the marker token to a new translation' );
    $assert( 'brand-secondary' === get_term_meta( $other, $key, true ), 'An unrelated category keeps its own colour' );
    foreach ( $group as $lang => $id ) {
        $assert( get_term( $id )->name === $names[ $id ] && get_term_meta( $id, 'icts_marker_test_unrelated', true ) === $lang, 'Translated name and unrelated metadata stay unchanged for ' . $lang );
    }
    $default_choice = \ICTS_Europe\get_category_marker_color_choice( '' );
    $secondary_choice = \ICTS_Europe\get_category_marker_color_choice( 'brand-secondary' );
    $assert( $default_choice['color'] === $secondary_choice['color'], 'Default swatch matches Brand Secondary' );
    $base_columns = [ 'cb' => '', 'name' => 'Name', 'language' => 'Language', 'slug' => 'Slug' ];
    remove_filter( 'manage_edit-category_columns', 'ICTS_Europe\add_category_marker_color_column', 20 );
    $existing_columns = apply_filters( 'manage_edit-category_columns', $base_columns );
    add_filter( 'manage_edit-category_columns', 'ICTS_Europe\add_category_marker_color_column', 20 );
    $columns = apply_filters( 'manage_edit-category_columns', $base_columns );
    $without_marker = $columns;
    unset( $without_marker['icts_marker_colour'] );
    $assert( isset( $columns['icts_marker_colour'] ) && $existing_columns === $without_marker, 'Colour column preserves existing category and language columns' );
    $cell = apply_filters( 'manage_category_custom_column', '', 'icts_marker_colour', $group_ids[0] );
    $assert( false !== strpos( $cell, 'Brand Primary' ) && false !== strpos( $cell, 'background-color:' ), 'Category column renders the selected colour and name' );
    $assert( 'unchanged' === apply_filters( 'manage_category_custom_column', 'unchanged', 'language', $group_ids[0] ), 'Other category columns remain unchanged' );
    ob_start();
    \ICTS_Europe\render_category_color_field_add();
    $add_control = ob_get_clean();
    $assert( false !== strpos( $add_control, 'data-color="rgb' ) && false !== strpos( $add_control, 'value=""' ), 'Add-category selector includes palette colours and Default' );
    ob_start();
    \ICTS_Europe\render_category_color_field_edit( get_term( $group_ids[0] ) );
    $edit_control = ob_get_clean();
    $assert( false !== strpos( $edit_control, 'selected=' ), 'Edit-category selector preserves the saved token' );
    $base = home_url();
    $assets = set_url_scheme( get_template_directory_uri(), wp_parse_url( $base, PHP_URL_SCHEME ) );
    $head = '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Category marker fixture</title><link rel="stylesheet" href="' . $base . '/wp-admin/css/common.css"><link rel="stylesheet" href="' . $base . '/wp-admin/css/forms.css"><link rel="stylesheet" href="' . $base . '/wp-admin/css/list-tables.css"><link rel="stylesheet" href="' . $assets . '/assets/styles/category-marker-admin.css"><body class="wp-admin wp-core-ui" style="padding:24px"><div class="wrap"><h1>Categories</h1>';
    $tail = '</div><script src="' . $assets . '/assets/js/category-marker-admin.js"></script></body></html>';
    delete_term_meta( $duplicate, $key );
    $table = '<table class="wp-list-table widefat fixed striped"><thead><tr><th>Name</th><th class="column-icts_marker_colour">Marker colour</th><th>Slug</th></tr></thead><tbody><tr><td>Articles</td><td>' . $cell . '</td><td>articles</td></tr><tr><td>Default example</td><td>' . apply_filters( 'manage_category_custom_column', '', 'icts_marker_colour', $duplicate ) . '</td><td>default-example</td></tr></tbody></table>';
    file_put_contents( sys_get_temp_dir() . '/icts-category-add-fixture.html', $head . '<div style="max-width:360px"><form id="addtag">' . $add_control . '<p><button type="reset">Reset</button></p></form></div>' . $table . $tail );
    file_put_contents( sys_get_temp_dir() . '/icts-category-edit-fixture.html', $head . '<form id="edittag"><table class="form-table">' . $edit_control . '</table></form>' . $table . $tail );
    $tag = $create( 'tag', 'post_tag' );
    $assert( [ 'existing' ] === \ICTS_Europe\sync_category_marker_color_meta( [ 'existing' ], true, $tag, $tag ), 'Non-category taxonomies are excluded' );
    $keys = \ICTS_Europe\sync_category_marker_color_meta( [ 'existing', $key ], true, $group_ids[0], $group_ids[1] );
    $assert( [ 'existing', $key ] === $keys, 'Existing sync keys are preserved without duplicates' );
} finally {
    $wpdb->query( 'ROLLBACK' );
    foreach ( $ids as $id => $taxonomy ) {
        clean_term_cache( $id, $taxonomy );
        wp_cache_delete( $id, 'term_meta' );
    }
    $_POST = $original_post;
    wp_set_current_user( $original_user );
    echo "Fixture transaction rolled back.\n";
}
