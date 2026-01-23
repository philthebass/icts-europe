<?php
/**
 * Client Logos Slider (Flickity) Block template.
 *
 * Logos are managed via the ACF Options Page: Client Logos.
 *
 * @var array $block
 */

if ( ! isset( $block ) ) {
	return;
}

// Unique ID and classes for this block instance.
$block_id = 'client-logos-slider-' . $block['id'];

// Base classes for the block wrapper.
$classes = 'client-logos-slider';
if ( ! empty( $block['className'] ) ) {
	$classes .= ' ' . esc_attr( $block['className'] );
}
if ( ! empty( $block['align'] ) ) {
	$classes .= ' align' . esc_attr( $block['align'] );
}

// Anchor support.
$anchor = ! empty( $block['anchor'] ) ? sanitize_title( $block['anchor'] ) : $block_id;

// Repeater field name on the options page.
$field_name = 'client-logos-and-links';

// Determine language, if Polylang is active.
$lang = function_exists( 'pll_current_language' ) ? pll_current_language() : null;

// Try possible post_ids in order and keep the first that returns rows.
$possible_ids = array();

if ( $lang ) {
	// e.g. options_en, options_fr, etc.
	$possible_ids[] = 'options_' . $lang;
}

// Always fall back to the global options.
$possible_ids[] = 'option';

$rows = array();

foreach ( $possible_ids as $pid ) {
	$candidate_rows = get_field( $field_name, $pid );

	if ( ! empty( $candidate_rows ) && is_array( $candidate_rows ) ) {
		$rows = $candidate_rows;
		break;
	}
}

$rows_count = is_array( $rows ) ? count( $rows ) : 0;
?>

<section id="<?php echo esc_attr( $anchor ); ?>" class="<?php echo esc_attr( $classes ); ?>">
	<?php if ( $rows_count > 0 ) : ?>
		<div class="client-logos-slider__carousel">
			<?php foreach ( $rows as $row ) : ?>
				<?php
				$logo     = isset( $row['client-logo'] ) ? $row['client-logo'] : null;
				$logo_url = isset( $row['client-link'] ) ? $row['client-link'] : '';

				$image_id = 0;
				$img_html = '';

				// CASE 1: Image field returns an array.
				if ( is_array( $logo ) ) {
					if ( isset( $logo['ID'] ) ) {
						$image_id = (int) $logo['ID'];
					} elseif ( isset( $logo['id'] ) ) {
						$image_id = (int) $logo['id'];
					} elseif ( isset( $logo['url'] ) ) {
						$img_html = sprintf(
							'<img src="%s" class="client-logos-slider__logo-image" alt="%s" loading="lazy" />',
							esc_url( $logo['url'] ),
							esc_attr__( 'Client logo', 'icts-europe' )
						);
					}
				}
				// CASE 2: Image field returns an attachment ID.
				elseif ( is_numeric( $logo ) ) {
					$image_id = (int) $logo;
				}
				// CASE 3: Image field returns a URL string.
				elseif ( is_string( $logo ) && '' !== $logo ) {
					$img_html = sprintf(
						'<img src="%s" class="client-logos-slider__logo-image" alt="%s" loading="lazy" />',
						esc_url( $logo ),
						esc_attr__( 'Client logo', 'icts-europe' )
					);
				}

				// If we have an ID, prefer wp_get_attachment_image().
				if ( $image_id ) {
					$img_html = wp_get_attachment_image(
						$image_id,
						'medium',
						false,
						array(
							'class'   => 'client-logos-slider__logo-image',
							'loading' => 'lazy',
							'alt'     => __( 'Client logo', 'icts-europe' ),
						)
					);
				}

				// If we still don't have any HTML, skip this row.
				if ( ! $img_html ) {
					continue;
				}
				?>
				<div class="client-logos-slider__cell">
					<?php if ( ! empty( $logo_url ) ) : ?>
						<a
							href="<?php echo esc_url( $logo_url ); ?>"
							class="client-logos-slider__logo-link"
							target="_blank"
							rel="noopener noreferrer"
						>
							<?php echo $img_html; ?>
						</a>
					<?php else : ?>
						<?php echo $img_html; ?>
					<?php endif; ?>
				</div>
			<?php endforeach; ?>
		</div>
	<?php elseif ( is_admin() ) : ?>
		<p><?php esc_html_e( 'No client logos found. Check the “Client Logos” options page.', 'icts-europe' ); ?></p>
	<?php endif; ?>
</section>