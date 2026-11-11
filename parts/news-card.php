<?php
/**
 * Linked post card shared by Latest News and the Case Studies Query Loop.
 *
 * @package icts-europe
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$post_id = (int) $args['post_id'];
$show_date = $args['show_date'];
$show_author = $args['show_author'];
$excerpt = ! empty( $args['show_excerpt'] ) && has_excerpt( $post_id )
	? trim( wp_strip_all_tags( get_the_excerpt( $post_id ) ) )
	: '';
$permalink  = get_permalink( $post_id );
$title      = get_the_title( $post_id );
$date_text  = get_the_date( 'F j, Y', $post_id );
$author_name = '';
if ( function_exists( '\ICTS_Europe\get_post_display_author_data' ) ) {
	$author_data = \ICTS_Europe\get_post_display_author_data( $post_id );
	$author_name = isset( $author_data['name'] ) ? (string) $author_data['name'] : '';
} elseif ( function_exists( '\ICTS_Europe\get_post_display_author_name' ) ) {
	$author_name = (string) \ICTS_Europe\get_post_display_author_name( $post_id );
} else {
	$author_name = (string) get_the_author_meta( 'display_name', (int) get_post_field( 'post_author', $post_id ) );
}
$thumb_html = get_the_post_thumbnail(
	$post_id,
	'large',
	[
		'class'   => 'icts-latest-news-slider__image',
		'loading' => 'lazy',
	]
);

$category_terms   = get_the_category( $post_id );
$primary_term     = null;
$yoast_primary_id = (int) get_post_meta( $post_id, '_yoast_wpseo_primary_category', true );

if ( $yoast_primary_id > 0 ) {
	$candidate = get_term( $yoast_primary_id, 'category' );
	if ( $candidate instanceof \WP_Term && ! is_wp_error( $candidate ) ) {
		$primary_term = $candidate;
	}
}

if ( ! $primary_term && ! empty( $category_terms ) ) {
	$primary_term = $category_terms[0];
}

$category_label = $primary_term instanceof \WP_Term ? $primary_term->name : '';
$color_slug     = $primary_term instanceof \WP_Term ? (string) get_term_meta( $primary_term->term_id, 'icts_category_color_slug', true ) : '';

if ( '' === $color_slug || ! preg_match( '/^[a-z0-9-]+$/', $color_slug ) ) {
	$color_slug = 'brand-secondary';
}
$category_marker_style = sprintf( 'background-color:var(--wp--preset--color--%s);', esc_attr( $color_slug ) );
?>
<a class="icts-latest-news-slider__card" href="<?php echo esc_url( $permalink ); ?>">
	<div class="icts-latest-news-slider__media">
		<?php if ( $thumb_html ) : ?>
			<?php echo $thumb_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		<?php else : ?>
			<div class="icts-latest-news-slider__image-placeholder" aria-hidden="true"></div>
		<?php endif; ?>
	</div>

	<div class="icts-latest-news-slider__content">
		<?php if ( '' !== $category_label ) : ?>
			<p class="icts-latest-news-slider__category">
				<span class="icts-latest-news-slider__category-marker" style="<?php echo $category_marker_style; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>"></span>
				<span class="icts-latest-news-slider__category-text"><?php echo esc_html( $category_label ); ?></span>
			</p>
		<?php endif; ?>

		<h3 class="icts-latest-news-slider__title"><?php echo esc_html( $title ); ?></h3>

		<?php if ( '' !== $excerpt ) : ?>
			<p class="icts-latest-news-slider__excerpt"><?php echo esc_html( $excerpt ); ?></p>
		<?php endif; ?>

		<?php if ( $show_date || $show_author ) : ?>
			<p class="icts-latest-news-slider__meta">
				<?php if ( $show_date && '' !== $date_text ) : ?>
					<span class="icts-latest-news-slider__date"><?php echo esc_html( $date_text ); ?></span>
				<?php endif; ?>
				<?php if ( $show_author && '' !== $author_name ) : ?>
					<span class="icts-latest-news-slider__author"><?php echo esc_html( $author_name ); ?></span>
				<?php endif; ?>
			</p>
		<?php endif; ?>
	</div>
</a>
