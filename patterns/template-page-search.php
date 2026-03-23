<?php
/**
 * Title: Search Results Page
 * Slug: icts-europe/template-page-search
 * Description: The page that shows search results.
 * Categories: icts-europe/pages
 * Keywords: page, full-width
 * Viewport Width: 1500
 * Inserter: false
 */

$search_results_terms_args = [
	'taxonomy'   => 'category',
	'hide_empty' => true,
	'orderby'    => 'name',
	'order'      => 'ASC',
];

if ( function_exists( 'pll_current_language' ) ) {
	$current_lang = (string) pll_current_language( 'slug' );
	if ( '' !== $current_lang ) {
		$search_results_terms_args['lang'] = $current_lang;
	}
}

$search_results_categories = get_terms( $search_results_terms_args );
$search_results_current_cat = isset( $_GET['icts_cat'] ) ? absint( (int) wp_unslash( $_GET['icts_cat'] ) ) : 0;
if ( $search_results_current_cat <= 0 && isset( $_GET['cat'] ) ) {
	$search_results_current_cat = absint( (int) wp_unslash( $_GET['cat'] ) );
}
?>
<!-- wp:template-part {"slug":"header","tagName":"header","className":"site-header"} /-->

<!-- wp:group {"align":"full","style":{"spacing":{"margin":{"top":"0","bottom":"0"},"padding":{"top":"var:preset|spacing|x-large","bottom":"var:preset|spacing|x-large"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--x-large);padding-bottom:var(--wp--preset--spacing--x-large)"><!-- wp:group {"className":"icts-search-results-header-controls"} -->
<div class="wp-block-group icts-search-results-header-controls"><!-- wp:query-title {"type":"search","className":"icts-search-results-controls__title","fontSize":"medium"} /-->

<form role="search" method="get" class="icts-archive-controls icts-search-results-controls" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<div class="icts-archive-controls__search">
		<label class="screen-reader-text" for="icts-search-results-term"><?php echo esc_html( \ICTS_Europe\get_post_archive_label( 'Search posts' ) ); ?></label>
		<input
			id="icts-search-results-term"
			type="search"
			name="s"
			class="icts-archive-controls__search-input"
			placeholder="<?php echo esc_attr( \ICTS_Europe\get_post_archive_label( 'Search' ) ); ?>"
			value="<?php echo esc_attr( get_search_query() ); ?>"
			autocomplete="off"
		/>
	</div>
	<div class="icts-archive-controls__category">
		<label class="screen-reader-text" for="icts-search-results-category"><?php echo esc_html( \ICTS_Europe\get_post_archive_label( 'Filter by category' ) ); ?></label>
		<select id="icts-search-results-category" name="icts_cat" class="icts-archive-controls__category-select" onchange="this.form.submit()">
			<option value=""><?php echo esc_html( \ICTS_Europe\get_post_archive_label( 'All categories' ) ); ?></option>
			<?php if ( ! is_wp_error( $search_results_categories ) && ! empty( $search_results_categories ) ) : ?>
				<?php foreach ( $search_results_categories as $search_results_category ) : ?>
					<?php if ( ! ( $search_results_category instanceof WP_Term ) ) { continue; } ?>
					<option value="<?php echo esc_attr( (string) $search_results_category->term_id ); ?>" <?php selected( $search_results_current_cat, (int) $search_results_category->term_id ); ?>>
						<?php echo esc_html( $search_results_category->name ); ?>
					</option>
				<?php endforeach; ?>
			<?php endif; ?>
		</select>
	</div>
</form></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:group {"tagName":"main","className":"site-content","style":{"spacing":{"margin":{"top":"0"},"padding":{"top":"var:preset|spacing|xx-large","bottom":"var:preset|spacing|xx-large"}}}} -->
<main class="wp-block-group site-content" style="margin-top:0;padding-top:var(--wp--preset--spacing--xx-large);padding-bottom:var(--wp--preset--spacing--xx-large)"><!-- wp:query {"queryId":0,"className":"icts-search-results-query","query":{"perPage":6,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":true},"layout":{"contentSize":null,"type":"constrained"}} -->
<div class="wp-block-query icts-search-results-query"><!-- wp:post-template {"layout":{"type":"default"}} -->
<!-- wp:group {"className":"icts-search-result-item","layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between","verticalAlignment":"top"}} -->
<div class="wp-block-group icts-search-result-item"><!-- wp:group {"className":"icts-search-result-item__content","layout":{"type":"constrained"}} -->
<div class="wp-block-group icts-search-result-item__content"><!-- wp:post-title {"isLink":true,"style":{"spacing":{"margin":{"top":"0","bottom":"var:preset|spacing|small"}}},"fontSize":"h-2"} /-->

<!-- wp:post-excerpt {"excerptLength":32,"moreText":"","showMoreOnNewLine":false} /-->

<!-- wp:read-more {"content":"<?php esc_attr_e( 'Learn more', 'icts-europe' ); ?>","className":"is-style-wp-block-button__link wp-element-button"} /--></div>
<!-- /wp:group -->

<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"16/9","sizeSlug":"large","useFirstImageFromPost":true,"className":"icts-search-result-item__image"} /-->

<!-- wp:image {"sizeSlug":"large","linkDestination":"none","className":"icts-search-result-item__fallback"} -->
<figure class="wp-block-image size-large icts-search-result-item__fallback"><img src="<?php echo esc_url( get_theme_file_uri( '/patterns/images/computer-hands.webp' ) ); ?>" alt="<?php esc_attr_e( 'Default featured image placeholder', 'icts-europe' ); ?>"/></figure>
<!-- /wp:image --></div>
<!-- /wp:group -->

<!-- wp:separator {"className":"is-style-separator-thin","style":{"spacing":{"margin":{"top":"var:preset|spacing|large","bottom":"var:preset|spacing|large"}}},"backgroundColor":"border-light"} -->
<hr class="wp-block-separator has-text-color has-border-light-color has-alpha-channel-opacity has-border-light-background-color has-background is-style-separator-thin" style="margin-top:var(--wp--preset--spacing--large);margin-bottom:var(--wp--preset--spacing--large)"/>
<!-- /wp:separator -->
<!-- /wp:post-template -->

<!-- wp:query-pagination {"layout":{"type":"flex","justifyContent":"right"}} -->
<!-- wp:query-pagination-previous {"className":"is-style-wp-block-button__link"} /-->

<!-- wp:query-pagination-numbers /-->

<!-- wp:query-pagination-next {"className":"is-style-wp-block-button__link"} /-->
<!-- /wp:query-pagination -->

<!-- wp:query-no-results -->
<!-- wp:paragraph {"placeholder":"<?php esc_attr_e( 'Add text or blocks that will display when a query returns no results.', 'icts-europe' ); ?>","style":{"spacing":{"margin":{"top":"0","right":"0","bottom":"0","left":"0"}}}} -->
<p style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0"><?php esc_html_e( 'Sorry, nothing was found for that search term.', 'icts-europe' ); ?></p>
<!-- /wp:paragraph -->
<!-- /wp:query-no-results --></div>
<!-- /wp:query --></main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","tagName":"footer","className":"site-footer"} /-->
