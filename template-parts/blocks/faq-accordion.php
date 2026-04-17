<?php
/**
 * FAQ Accordion block template.
 *
 * @package icts-europe
 */

if ( ! isset( $block ) || ! is_array( $block ) ) {
	return;
}

$is_editor_preview = ! empty( $is_preview ) || is_admin();

$translate = static function ( $text ) {
	$label = (string) $text;

	if ( function_exists( 'pll__' ) ) {
		$translated = pll__( $label );
		if ( is_string( $translated ) && '' !== trim( $translated ) ) {
			return $translated;
		}
	}

	return $label;
};

$id = ! empty( $block['anchor'] ) ? (string) $block['anchor'] : 'faq-accordion-' . (string) $block['id'];

$class_name = 'icts-faq-accordion-block js-icts-faq-accordion';
if ( ! empty( $block['className'] ) ) {
	$class_name .= ' ' . (string) $block['className'];
}
if ( ! empty( $block['align'] ) ) {
	$class_name .= ' align' . (string) $block['align'];
}

$heading = get_field( 'heading' );
if ( ! is_string( $heading ) || '' === trim( $heading ) ) {
	$heading = $translate( __( 'FAQs', 'icts-europe' ) );
}

$intro = get_field( 'intro' );
$intro = is_string( $intro ) ? trim( $intro ) : '';

$faq_limit = get_field( 'faq_limit' );
$faq_limit = is_numeric( $faq_limit ) ? (int) $faq_limit : 0;
if ( $faq_limit < 1 ) {
	$faq_limit = 0;
}

$show_all_label = get_field( 'show_all_label' );
$show_all_label = is_string( $show_all_label ) ? trim( $show_all_label ) : '';
if ( '' === $show_all_label ) {
	$show_all_label = $translate( __( 'Show all FAQs', 'icts-europe' ) );
}

$product_filter_mode = get_field( 'product_filter_mode' );
if ( ! in_array( $product_filter_mode, [ 'all', 'specific' ], true ) ) {
	$product_filter_mode = 'all';
}

$product_taxonomy_term = get_field( 'product_taxonomy' );

$customer_type_filter = get_field( 'customer_type_filter' );
if ( ! in_array( $customer_type_filter, [ 'all', 'specific' ], true ) ) {
	$customer_type_filter = 'all';
}

$customer_type_term = get_field( 'customer_type_term' );

$output_schema = get_field( 'output_schema' );
if ( null === $output_schema || '' === $output_schema ) {
	$output_schema = 1;
}
$output_schema = (bool) $output_schema;

$enable_search = get_field( 'enable_search' );
if ( null === $enable_search || '' === $enable_search ) {
	$enable_search = 0;
}
$enable_search = (bool) $enable_search;

$search_label = get_field( 'search_label' );
$search_label = is_string( $search_label ) ? trim( $search_label ) : '';
if ( '' === $search_label ) {
	$search_label = $translate( __( 'Search FAQs', 'icts-europe' ) );
}

$search_placeholder = get_field( 'search_placeholder' );
$search_placeholder = is_string( $search_placeholder ) ? trim( $search_placeholder ) : '';
if ( '' === $search_placeholder ) {
	$search_placeholder = $translate( __( 'Search', 'icts-europe' ) );
}

$enable_category_filter = get_field( 'enable_category_filter' );
if ( null === $enable_category_filter || '' === $enable_category_filter ) {
	$enable_category_filter = 0;
}
$enable_category_filter = (bool) $enable_category_filter;

$category_filter_label = get_field( 'category_filter_label' );
$category_filter_label = is_string( $category_filter_label ) ? trim( $category_filter_label ) : '';
if ( '' === $category_filter_label ) {
	$category_filter_label = $translate( __( 'Filter FAQs by category', 'icts-europe' ) );
}

$all_categories_label = get_field( 'all_categories_label' );
$all_categories_label = is_string( $all_categories_label ) ? trim( $all_categories_label ) : '';
if ( '' === $all_categories_label ) {
	$all_categories_label = $translate( __( 'All categories', 'icts-europe' ) );
}

$no_results_label = get_field( 'no_results_label' );
$no_results_label = is_string( $no_results_label ) ? trim( $no_results_label ) : '';
if ( '' === $no_results_label ) {
	$no_results_label = $translate( __( 'No FAQs found for the selected filters.', 'icts-europe' ) );
}

$tax_query = [];

if ( 'specific' === $product_filter_mode && $product_taxonomy_term instanceof WP_Term ) {
	$tax_query[] = [
		'taxonomy' => 'product',
		'field'    => 'term_id',
		'terms'    => [ (int) $product_taxonomy_term->term_id ],
	];
}

if ( 'specific' === $customer_type_filter && $customer_type_term instanceof WP_Term ) {
	$tax_query[] = [
		'taxonomy' => 'customer-type',
		'field'    => 'term_id',
		'terms'    => [ (int) $customer_type_term->term_id ],
	];
}

if ( count( $tax_query ) > 1 ) {
	$tax_query['relation'] = 'AND';
}

$query_args = [
	'post_type'           => 'faq',
	'post_status'         => 'publish',
	'posts_per_page'      => $is_editor_preview ? 20 : -1,
	'orderby'             => [
		'menu_order' => 'ASC',
		'title'      => 'ASC',
	],
	'order'               => 'ASC',
	'no_found_rows'       => true,
	'ignore_sticky_posts' => true,
];

if ( ! empty( $tax_query ) ) {
	$query_args['tax_query'] = $tax_query;
}

if ( function_exists( 'pll_current_language' ) ) {
	$query_args['lang'] = pll_current_language( 'slug' );
}

$query = new WP_Query( $query_args );

$faq_rows              = [];
$faq_category_options  = [];
$faq_filter_taxonomy   = 'product';

if ( $query->have_posts() ) {
	while ( $query->have_posts() ) {
		$query->the_post();

		$faq_post_id = (int) get_the_ID();
		$question    = get_the_title( $faq_post_id );

		$answer_content = (string) get_post_field( 'post_content', $faq_post_id );
		$answer_html    = '';
		if ( '' !== trim( $answer_content ) ) {
			if ( $is_editor_preview ) {
				$answer_html = wpautop( wp_kses_post( $answer_content ) );
			} else {
				$answer_html = apply_filters( 'the_content', $answer_content );
			}
		}

		$answer_schema = trim(
			preg_replace(
				'/\s+/u',
				' ',
				wp_strip_all_tags( strip_shortcodes( $answer_content ) )
			)
		);

		$faq_categories = [];
		$product_terms  = wp_get_post_terms( $faq_post_id, $faq_filter_taxonomy );
		if ( ! is_wp_error( $product_terms ) ) {
			foreach ( $product_terms as $product_term ) {
				if ( ! $product_term instanceof WP_Term ) {
					continue;
				}

				$term_id = (int) $product_term->term_id;
				if ( $term_id <= 0 ) {
					continue;
				}

				$faq_categories[] = $term_id;
				if ( ! isset( $faq_category_options[ $term_id ] ) ) {
					$faq_category_options[ $term_id ] = [
						'id'   => $term_id,
						'name' => $product_term->name,
					];
				}
			}
		}

		$search_index = trim( $question . ' ' . $answer_schema );

		$faq_rows[] = [
			'post_id'       => $faq_post_id,
			'question'      => $question,
			'answer_html'   => $answer_html,
			'answer_schema' => $answer_schema,
			'search_index'  => $search_index,
			'categories'    => $faq_categories,
		];
	}
}

wp_reset_postdata();

if ( ! empty( $faq_category_options ) ) {
	uasort(
		$faq_category_options,
		static function ( $left, $right ) {
			$left_name  = isset( $left['name'] ) ? (string) $left['name'] : '';
			$right_name = isset( $right['name'] ) ? (string) $right['name'] : '';
			return strcasecmp( $left_name, $right_name );
		}
	);
	$faq_category_options = array_values( $faq_category_options );
}

$editor_empty_label = $translate( __( 'No FAQs found. Add FAQ posts to populate this block.', 'icts-europe' ) );
$show_search        = $enable_search;
$show_category      = $enable_category_filter && ! empty( $faq_category_options );
$show_filters       = ! empty( $faq_rows ) && ( $show_search || $show_category );
$show_show_all      = $faq_limit > 0 && count( $faq_rows ) > $faq_limit;

$search_input_id   = $id . '-search';
$category_input_id = $id . '-category';

$to_lower = static function ( $value ) {
	$value = (string) $value;
	if ( function_exists( 'mb_strtolower' ) ) {
		return mb_strtolower( $value );
	}
	return strtolower( $value );
};

$faq_schema_rows = [];
if ( $output_schema && ! $is_editor_preview && ! empty( $faq_rows ) ) {
	foreach ( $faq_rows as $faq_row ) {
		$question = isset( $faq_row['question'] ) ? trim( (string) $faq_row['question'] ) : '';
		$answer   = isset( $faq_row['answer_schema'] ) ? trim( (string) $faq_row['answer_schema'] ) : '';

		if ( '' === $question || '' === $answer ) {
			continue;
		}

		$faq_schema_rows[] = [
			'@type'          => 'Question',
			'name'           => $question,
			'acceptedAnswer' => [
				'@type' => 'Answer',
				'text'  => $answer,
			],
		];
	}
}
?>

<section
	id="<?php echo esc_attr( $id ); ?>"
	class="<?php echo esc_attr( $class_name ); ?>"
>
	<div class="icts-faq-accordion__inner">
		<header class="icts-faq-accordion__header">
			<h2 class="icts-faq-accordion__title"><?php echo esc_html( $heading ); ?></h2>
			<?php if ( '' !== $intro ) : ?>
				<p class="icts-faq-accordion__intro"><?php echo esc_html( $intro ); ?></p>
			<?php endif; ?>
		</header>

		<?php if ( ! empty( $faq_rows ) ) : ?>
			<?php if ( $show_filters ) : ?>
				<div class="icts-archive-controls icts-faq-accordion__controls">
					<?php if ( $show_search ) : ?>
						<div class="icts-archive-controls__search icts-faq-accordion__search" data-icts-faq-search-control>
							<label class="screen-reader-text" for="<?php echo esc_attr( $search_input_id ); ?>">
								<?php echo esc_html( $search_label ); ?>
							</label>
							<input
								id="<?php echo esc_attr( $search_input_id ); ?>"
								type="search"
								class="icts-archive-controls__search-input"
								placeholder="<?php echo esc_attr( $search_placeholder ); ?>"
								autocomplete="off"
								data-icts-faq-search
							/>
							<button
								type="button"
								class="icts-faq-accordion__search-clear"
								aria-label="<?php echo esc_attr( $translate( __( 'Clear FAQ search', 'icts-europe' ) ) ); ?>"
								data-icts-faq-search-clear
								hidden
							>
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
					<?php endif; ?>

					<?php if ( $show_category ) : ?>
						<div class="icts-archive-controls__category">
							<label class="screen-reader-text" for="<?php echo esc_attr( $category_input_id ); ?>">
								<?php echo esc_html( $category_filter_label ); ?>
							</label>
							<select
								id="<?php echo esc_attr( $category_input_id ); ?>"
								class="icts-archive-controls__category-select"
								data-icts-faq-category
							>
								<option value="0"><?php echo esc_html( $all_categories_label ); ?></option>
								<?php foreach ( $faq_category_options as $category_option ) : ?>
									<option value="<?php echo esc_attr( (string) $category_option['id'] ); ?>">
										<?php echo esc_html( (string) $category_option['name'] ); ?>
									</option>
								<?php endforeach; ?>
							</select>
						</div>
					<?php endif; ?>
				</div>
			<?php endif; ?>

			<div
				class="icts-faq-accordion__items"
				data-icts-faq-items
				data-icts-faq-limit="<?php echo esc_attr( (string) $faq_limit ); ?>"
			>
				<?php foreach ( $faq_rows as $index => $faq_row ) : ?>
					<?php
					$item_dom_id = $id . '-item-' . ( $index + 1 );
					$question_id = $item_dom_id . '-label';
					$panel_id    = $item_dom_id . '-panel';
					$categories  = isset( $faq_row['categories'] ) && is_array( $faq_row['categories'] ) ? array_map( 'intval', $faq_row['categories'] ) : [];
					$categories  = array_filter( $categories );
					?>
					<article
						class="icts-faq-accordion__item"
						data-icts-faq-search-index="<?php echo esc_attr( $to_lower( (string) $faq_row['search_index'] ) ); ?>"
						data-icts-faq-categories="<?php echo esc_attr( implode( ',', $categories ) ); ?>"
					>
						<h3 class="icts-faq-accordion__question-wrap">
							<button
								type="button"
								id="<?php echo esc_attr( $question_id ); ?>"
								class="icts-faq-accordion__toggle"
								aria-controls="<?php echo esc_attr( $panel_id ); ?>"
								aria-expanded="false"
								data-icts-faq-toggle
							>
								<span class="icts-faq-accordion__question"><?php echo esc_html( $faq_row['question'] ); ?></span>
								<span class="icts-faq-accordion__icon" aria-hidden="true"></span>
							</button>
						</h3>

						<div
							id="<?php echo esc_attr( $panel_id ); ?>"
							class="icts-faq-accordion__panel"
							role="region"
							aria-labelledby="<?php echo esc_attr( $question_id ); ?>"
							hidden
							data-icts-faq-panel
						>
							<div class="icts-faq-accordion__answer">
								<?php
								if ( '' !== $faq_row['answer_html'] ) {
									echo wp_kses_post( $faq_row['answer_html'] );
								}
								?>
							</div>
						</div>
					</article>
				<?php endforeach; ?>
			</div>
			<?php if ( $is_editor_preview && $faq_limit > 0 ) : ?>
				<p class="icts-faq-accordion__preview-note">
					<?php
					echo esc_html(
						sprintf(
							/* translators: %d number of FAQs shown initially in preview */
							__( 'Preview limited to the first %d FAQs. Clear "FAQs to Display Initially" to preview the full set.', 'icts-europe' ),
							$faq_limit
						)
					);
					?>
				</p>
			<?php endif; ?>
			<?php if ( $show_show_all ) : ?>
				<div class="icts-faq-accordion__actions">
					<button
						type="button"
						class="icts-faq-accordion__show-all wp-element-button"
						data-icts-faq-show-all
					>
						<?php echo esc_html( $show_all_label ); ?>
					</button>
				</div>
			<?php endif; ?>
			<p class="icts-faq-accordion__empty" data-icts-faq-empty hidden>
				<?php echo esc_html( $no_results_label ); ?>
			</p>
		<?php else : ?>
			<p class="icts-faq-accordion__empty is-static" data-icts-faq-empty-static>
				<?php echo esc_html( $editor_empty_label ); ?>
			</p>
		<?php endif; ?>
	</div>

	<?php if ( ! empty( $faq_schema_rows ) ) : ?>
		<?php
		$faq_schema = [
			'@context'   => 'https://schema.org',
			'@type'      => 'FAQPage',
			'mainEntity' => $faq_schema_rows,
		];
		?>
		<script type="application/ld+json" class="icts-faq-accordion__schema">
			<?php echo wp_json_encode( $faq_schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ); ?>
		</script>
	<?php endif; ?>
</section>
