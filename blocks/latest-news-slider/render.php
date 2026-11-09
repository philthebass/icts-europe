<?php
/**
 * Latest News Slider block render.
 *
 * @package icts-europe
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$heading       = isset( $attributes['heading'] ) ? trim( (string) $attributes['heading'] ) : '';
$posts_to_show = isset( $attributes['postsToShow'] ) ? (int) $attributes['postsToShow'] : 9;
$autoplay      = isset( $attributes['autoplay'] ) ? (int) $attributes['autoplay'] : 7000;
$show_author   = ! isset( $attributes['showAuthor'] ) || (bool) $attributes['showAuthor'];
$show_date     = ! isset( $attributes['showDate'] ) || (bool) $attributes['showDate'];
$related_by_current_post = ! empty( $attributes['relatedByCurrentPost'] );
$category_ids  = isset( $attributes['categoryIds'] ) && is_array( $attributes['categoryIds'] )
	? array_values(
		array_filter(
			array_map( 'absint', $attributes['categoryIds'] )
		)
	)
	: [];

if ( $posts_to_show < 1 ) {
	$posts_to_show = 9;
}

$posts_to_show = min( 24, $posts_to_show );

if ( $autoplay < 0 ) {
	$autoplay = 0;
}

$current_post_id = 0;

if ( $related_by_current_post && is_singular( 'post' ) ) {
	$current_post_id = (int) get_queried_object_id();
}

$translated_heading = $heading;
if ( '' !== $translated_heading && function_exists( '\ICTS_Europe\get_post_archive_label' ) ) {
	$translated_heading = \ICTS_Europe\get_post_archive_label( $translated_heading );
}

$query_args = [
	'post_type'           => 'post',
	'post_status'         => 'publish',
	'posts_per_page'      => $posts_to_show,
	'ignore_sticky_posts' => true,
	'no_found_rows'       => true,
];

if ( $current_post_id > 0 ) {
	$query_args['post__not_in'] = [ $current_post_id ];

	$related_category_ids = wp_get_post_categories(
		$current_post_id,
		[
			'fields' => 'ids',
		]
	);

	if ( ! empty( $related_category_ids ) ) {
		$query_args['category__in'] = array_map( 'absint', $related_category_ids );
	}
} elseif ( ! empty( $category_ids ) ) {
	$query_args['category__in'] = $category_ids;
}

$query = new \WP_Query( $query_args );
$slides             = array_chunk( $query->posts, 3 );
$wrapper_attributes = get_block_wrapper_attributes(
	[
		'class' => 'icts-latest-news-slider-block alignfull',
	]
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-autoplay="<?php echo esc_attr( (string) $autoplay ); ?>">
	<div class="icts-latest-news-slider__inner">
		<?php if ( '' !== $heading ) : ?>
			<h2 class="icts-latest-news-slider__heading"><?php echo esc_html( $translated_heading ); ?></h2>
		<?php endif; ?>

		<div class="icts-latest-news-slider__track js-icts-latest-news-slider">
			<?php foreach ( $slides as $slide_posts ) : ?>
				<section class="icts-latest-news-slider__cell">
					<div class="icts-latest-news-slider__slide-grid">
						<?php foreach ( $slide_posts as $news_post ) : ?>
							<article class="icts-latest-news-slider__slide-card">
								<?php
								get_template_part(
									'parts/news-card',
									null,
									[
										'post_id'     => $news_post->ID,
										'show_author' => $show_author,
										'show_date'   => $show_date,
									]
								);
								?>
							</article>
						<?php endforeach; ?>
					</div>
				</section>
			<?php endforeach; ?>
		</div>
	</div>
</section>
