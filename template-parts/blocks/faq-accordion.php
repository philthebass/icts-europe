<?php
/**
 * FAQ Accordion block template.
 *
 * @package icts-europe
 */

if ( ! isset( $block ) || ! is_array( $block ) ) {
	return;
}

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

$show_filters = get_field( 'show_filters' );
if ( null === $show_filters || '' === $show_filters ) {
	$show_filters = 1;
}
$show_filters = (bool) $show_filters;

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
	'posts_per_page'      => -1,
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

$faq_rows             = [];
$product_term_options = [];
$customer_term_options = [];

if ( $query->have_posts() ) {
	while ( $query->have_posts() ) {
		$query->the_post();

		$faq_post_id = (int) get_the_ID();
		$question    = get_the_title( $faq_post_id );

		$answer_content = (string) get_post_field( 'post_content', $faq_post_id );
		$answer_html    = '';
		if ( '' !== trim( $answer_content ) ) {
			$answer_html = apply_filters( 'the_content', $answer_content );
		}

		$product_terms = get_the_terms( $faq_post_id, 'product' );
		if ( is_wp_error( $product_terms ) || ! is_array( $product_terms ) ) {
			$product_terms = [];
		}

		$customer_terms = get_the_terms( $faq_post_id, 'customer-type' );
		if ( is_wp_error( $customer_terms ) || ! is_array( $customer_terms ) ) {
			$customer_terms = [];
		}

		$product_slugs = [];
		foreach ( $product_terms as $term ) {
			if ( ! $term instanceof WP_Term ) {
				continue;
			}

			$product_slugs[] = (string) $term->slug;
			$product_term_options[ (int) $term->term_id ] = $term;
		}

		$customer_slugs = [];
		foreach ( $customer_terms as $term ) {
			if ( ! $term instanceof WP_Term ) {
				continue;
			}

			$customer_slugs[] = (string) $term->slug;
			$customer_term_options[ (int) $term->term_id ] = $term;
		}

		$faq_rows[] = [
			'post_id'        => $faq_post_id,
			'question'       => $question,
			'answer_html'    => $answer_html,
			'product_slugs'  => $product_slugs,
			'customer_slugs' => $customer_slugs,
		];
	}
}

wp_reset_postdata();

if ( ! empty( $product_term_options ) ) {
	uasort(
		$product_term_options,
		static function ( $term_a, $term_b ) {
			return strnatcasecmp( (string) $term_a->name, (string) $term_b->name );
		}
	);
}

if ( ! empty( $customer_term_options ) ) {
	uasort(
		$customer_term_options,
		static function ( $term_a, $term_b ) {
			return strnatcasecmp( (string) $term_a->name, (string) $term_b->name );
		}
	);
}

$product_filter_default  = ( 'specific' === $product_filter_mode && $product_taxonomy_term instanceof WP_Term ) ? (string) $product_taxonomy_term->slug : '';
$customer_filter_default = ( 'specific' === $customer_type_filter && $customer_type_term instanceof WP_Term ) ? (string) $customer_type_term->slug : '';

$filter_form_label       = $translate( __( 'FAQ filters', 'icts-europe' ) );
$filter_product_label    = $translate( __( 'Product', 'icts-europe' ) );
$filter_customer_label   = $translate( __( 'Customer type', 'icts-europe' ) );
$filter_all_products     = $translate( __( 'All products', 'icts-europe' ) );
$filter_all_customers    = $translate( __( 'All customer types', 'icts-europe' ) );
$empty_results_label     = $translate( __( 'No FAQs found for the selected filters.', 'icts-europe' ) );
$editor_empty_label      = $translate( __( 'No FAQs found. Add FAQ posts to populate this block.', 'icts-europe' ) );

$render_filters = $show_filters && ( ! empty( $product_term_options ) || ! empty( $customer_term_options ) );
?>

<section
	id="<?php echo esc_attr( $id ); ?>"
	class="<?php echo esc_attr( $class_name ); ?>"
	data-default-product="<?php echo esc_attr( $product_filter_default ); ?>"
	data-default-customer="<?php echo esc_attr( $customer_filter_default ); ?>"
>
	<div class="icts-faq-accordion__inner">
		<header class="icts-faq-accordion__header">
			<h2 class="icts-faq-accordion__title"><?php echo esc_html( $heading ); ?></h2>
			<?php if ( '' !== $intro ) : ?>
				<p class="icts-faq-accordion__intro"><?php echo esc_html( $intro ); ?></p>
			<?php endif; ?>
		</header>

		<?php if ( $render_filters ) : ?>
			<form class="icts-faq-accordion__filters" data-icts-faq-filters aria-label="<?php echo esc_attr( $filter_form_label ); ?>">
				<?php if ( ! empty( $product_term_options ) ) : ?>
					<div class="icts-faq-accordion__filter">
						<label class="icts-faq-accordion__filter-label" for="<?php echo esc_attr( $id ); ?>-filter-product">
							<?php echo esc_html( $filter_product_label ); ?>
						</label>
						<select
							class="icts-faq-accordion__filter-select"
							id="<?php echo esc_attr( $id ); ?>-filter-product"
							data-icts-faq-filter="product"
						>
							<option value=""><?php echo esc_html( $filter_all_products ); ?></option>
							<?php foreach ( $product_term_options as $term ) : ?>
								<option value="<?php echo esc_attr( $term->slug ); ?>" <?php selected( $product_filter_default, (string) $term->slug ); ?>>
									<?php echo esc_html( $term->name ); ?>
								</option>
							<?php endforeach; ?>
						</select>
					</div>
				<?php endif; ?>

				<?php if ( ! empty( $customer_term_options ) ) : ?>
					<div class="icts-faq-accordion__filter">
						<label class="icts-faq-accordion__filter-label" for="<?php echo esc_attr( $id ); ?>-filter-customer">
							<?php echo esc_html( $filter_customer_label ); ?>
						</label>
						<select
							class="icts-faq-accordion__filter-select"
							id="<?php echo esc_attr( $id ); ?>-filter-customer"
							data-icts-faq-filter="customer"
						>
							<option value=""><?php echo esc_html( $filter_all_customers ); ?></option>
							<?php foreach ( $customer_term_options as $term ) : ?>
								<option value="<?php echo esc_attr( $term->slug ); ?>" <?php selected( $customer_filter_default, (string) $term->slug ); ?>>
									<?php echo esc_html( $term->name ); ?>
								</option>
							<?php endforeach; ?>
						</select>
					</div>
				<?php endif; ?>
			</form>
		<?php endif; ?>

		<?php if ( ! empty( $faq_rows ) ) : ?>
			<div class="icts-faq-accordion__items" data-icts-faq-items>
				<?php foreach ( $faq_rows as $index => $faq_row ) : ?>
					<?php
					$item_dom_id = $id . '-item-' . ( $index + 1 );
					$question_id = $item_dom_id . '-label';
					$panel_id    = $item_dom_id . '-panel';
					?>
					<article
						class="icts-faq-accordion__item"
						data-product-terms="<?php echo esc_attr( implode( '|', $faq_row['product_slugs'] ) ); ?>"
						data-customer-terms="<?php echo esc_attr( implode( '|', $faq_row['customer_slugs'] ) ); ?>"
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

			<p class="icts-faq-accordion__empty" data-icts-faq-empty hidden>
				<?php echo esc_html( $empty_results_label ); ?>
			</p>
		<?php else : ?>
			<p class="icts-faq-accordion__empty is-static" data-icts-faq-empty-static>
				<?php echo esc_html( $editor_empty_label ); ?>
			</p>
		<?php endif; ?>
	</div>
</section>
