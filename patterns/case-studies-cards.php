<?php
/**
 * Title: Case Studies Cards
 * Slug: icts-europe/case-studies-cards
 * Description: A blue section of news-style cards matching every selected category.
 * Categories: icts-europe/posts
 * Keywords: case study, posts, cards, categories
 * Viewport Width: 1440
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$category = get_term_by( 'slug', 'case-studies', 'category' );
$query    = [
	'perPage'             => 3,
	'postType'            => 'post',
	'order'               => 'desc',
	'orderBy'             => 'date',
	'sticky'              => 'ignore',
	'inherit'             => false,
	'ictsMatchCategories' => true,
];

if ( $category instanceof WP_Term ) {
	$term_id   = $category->term_id;
	$language  = function_exists( 'pll_current_language' ) ? pll_current_language() : '';
	if ( $language && function_exists( 'pll_get_term' ) ) {
		$term_id = pll_get_term( $term_id, $language ) ?: $term_id;
	}
	$query['taxQuery'] = [ 'include' => [ 'category' => [ (int) $term_id ] ] ];
}
?>
<!-- wp:group {"metadata":{"name":"Case Studies"},"align":"full","style":{"spacing":{"margin":{"top":"0","bottom":"0"},"padding":{"top":"var:preset|spacing|small","bottom":"var:preset|spacing|small"}}},"backgroundColor":"brand-primary","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-brand-primary-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--small);padding-bottom:var(--wp--preset--spacing--small)"><!-- wp:heading {"level":3,"textColor":"white"} -->
<h3 class="wp-block-heading has-white-color has-text-color"><?php esc_html_e( 'Case Studies', 'icts-europe' ); ?></h3>
<!-- /wp:heading -->

<!-- wp:query <?php echo serialize_block_attributes( [ 'query' => $query ] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> -->
<div class="wp-block-query"><!-- wp:post-template {"align":"wide","style":{"spacing":{"blockGap":"var:preset|spacing|small"}},"layout":{"type":"grid","columnCount":null,"minimumColumnWidth":"22rem"}} -->
<!-- wp:icts/news-card /-->
<!-- /wp:post-template --></div>
<!-- /wp:query --></div>
<!-- /wp:group -->
