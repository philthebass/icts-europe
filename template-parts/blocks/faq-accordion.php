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

$faq_rows = [];

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

		$faq_rows[] = [
			'post_id'       => $faq_post_id,
			'question'      => $question,
			'answer_html'   => $answer_html,
			'answer_schema' => $answer_schema,
		];
	}
}

wp_reset_postdata();

$editor_empty_label = $translate( __( 'No FAQs found. Add FAQ posts to populate this block.', 'icts-europe' ) );

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
			<div class="icts-faq-accordion__items" data-icts-faq-items>
				<?php foreach ( $faq_rows as $index => $faq_row ) : ?>
					<?php
					$item_dom_id = $id . '-item-' . ( $index + 1 );
					$question_id = $item_dom_id . '-label';
					$panel_id    = $item_dom_id . '-panel';
					?>
					<article class="icts-faq-accordion__item">
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
