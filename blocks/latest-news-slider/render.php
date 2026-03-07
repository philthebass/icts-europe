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

if ( $autoplay < 0 ) {
	$autoplay = 0;
}

$query_args = [
	'post_type'           => 'post',
	'post_status'         => 'publish',
	'posts_per_page'      => $posts_to_show,
	'ignore_sticky_posts' => true,
	'no_found_rows'       => true,
];

if ( ! empty( $category_ids ) ) {
	$query_args['category__in'] = $category_ids;
}

$query = new \WP_Query( $query_args );
$posts = [];

if ( $query->have_posts() ) {
	while ( $query->have_posts() ) {
		$query->the_post();

		$post_id    = get_the_ID();
		$permalink  = get_permalink( $post_id );
		$title      = get_the_title( $post_id );
		$date_text  = get_the_date( 'F j, Y', $post_id );
		$author     = get_the_author();
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

		$posts[] = [
			'permalink'             => $permalink,
			'title'                 => $title,
			'date_text'             => $date_text,
			'author'                => $author,
			'thumb_html'            => $thumb_html,
			'category_label'        => $category_label,
			'category_marker_style' => sprintf( 'background-color:var(--wp--preset--color--%s);', esc_attr( $color_slug ) ),
		];
	}
}

wp_reset_postdata();

$slides             = array_chunk( $posts, 3 );
$wrapper_attributes = get_block_wrapper_attributes(
	[
		'class' => 'icts-latest-news-slider-block alignfull',
	]
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-autoplay="<?php echo esc_attr( (string) $autoplay ); ?>">
	<div class="icts-latest-news-slider__inner">
		<?php if ( '' !== $heading ) : ?>
			<h2 class="icts-latest-news-slider__heading"><?php echo esc_html( $heading ); ?></h2>
		<?php endif; ?>

		<div class="icts-latest-news-slider__track js-icts-latest-news-slider">
			<?php foreach ( $slides as $slide_posts ) : ?>
				<section class="icts-latest-news-slider__cell">
					<div class="icts-latest-news-slider__slide-grid">
						<?php foreach ( $slide_posts as $post_item ) : ?>
							<article class="icts-latest-news-slider__slide-card">
								<a class="icts-latest-news-slider__card" href="<?php echo esc_url( $post_item['permalink'] ); ?>">
									<div class="icts-latest-news-slider__media">
										<?php if ( $post_item['thumb_html'] ) : ?>
											<?php echo $post_item['thumb_html']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
										<?php else : ?>
											<div class="icts-latest-news-slider__image-placeholder" aria-hidden="true"></div>
										<?php endif; ?>
									</div>

									<div class="icts-latest-news-slider__content">
										<?php if ( '' !== $post_item['category_label'] ) : ?>
											<p class="icts-latest-news-slider__category">
												<span class="icts-latest-news-slider__category-marker" style="<?php echo $post_item['category_marker_style']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>"></span>
												<span class="icts-latest-news-slider__category-text"><?php echo esc_html( $post_item['category_label'] ); ?></span>
											</p>
										<?php endif; ?>

										<h3 class="icts-latest-news-slider__title"><?php echo esc_html( $post_item['title'] ); ?></h3>

										<?php if ( $show_date || $show_author ) : ?>
											<p class="icts-latest-news-slider__meta">
												<?php if ( $show_date && '' !== $post_item['date_text'] ) : ?>
													<span class="icts-latest-news-slider__date"><?php echo esc_html( $post_item['date_text'] ); ?></span>
												<?php endif; ?>
												<?php if ( $show_author && '' !== $post_item['author'] ) : ?>
													<span class="icts-latest-news-slider__author"><?php echo esc_html( $post_item['author'] ); ?></span>
												<?php endif; ?>
											</p>
										<?php endif; ?>
									</div>
								</a>
							</article>
						<?php endforeach; ?>
					</div>
				</section>
			<?php endforeach; ?>
		</div>
	</div>
</section>
