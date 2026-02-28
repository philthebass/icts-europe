<?php
/**
 * Sector Card block server rendering.
 *
 * @package icts-europe
 */

$image_url    = isset( $attributes['imageUrl'] ) ? (string) $attributes['imageUrl'] : '';
$image_alt    = isset( $attributes['imageAlt'] ) ? (string) $attributes['imageAlt'] : '';
$heading      = isset( $attributes['heading'] ) ? (string) $attributes['heading'] : '';
$heading_tag  = isset( $attributes['headingTag'] ) ? (string) $attributes['headingTag'] : 'p';
$heading_size = isset( $attributes['headingFontSize'] ) ? trim( (string) $attributes['headingFontSize'] ) : 'base';
$heading_wt   = isset( $attributes['headingFontWeight'] ) ? trim( (string) $attributes['headingFontWeight'] ) : '600';
$text         = isset( $attributes['text'] ) ? (string) $attributes['text'] : '';
$text_size    = isset( $attributes['textFontSize'] ) ? trim( (string) $attributes['textFontSize'] ) : 'small';
$text_wt      = isset( $attributes['textFontWeight'] ) ? trim( (string) $attributes['textFontWeight'] ) : '400';
$modal_bg_slug = isset( $attributes['modalBackgroundColorSlug'] ) ? sanitize_key( (string) $attributes['modalBackgroundColorSlug'] ) : 'brand-primary-hover';
$modal_bg     = isset( $attributes['modalBackgroundColor'] ) ? (string) $attributes['modalBackgroundColor'] : '';
$button_label = isset( $attributes['buttonLabel'] ) && '' !== trim( (string) $attributes['buttonLabel'] )
	? (string) $attributes['buttonLabel']
	: __( 'Learn More', 'icts-europe' );
$modal_id     = isset( $attributes['modalId'] ) && '' !== trim( (string) $attributes['modalId'] )
	? sanitize_html_class( (string) $attributes['modalId'] )
	: 'icts-sector-modal-' . substr( md5( wp_json_encode( $attributes ) ), 0, 10 );

$label_id = $modal_id . '-title';
$allowed_heading_tags = array( 'h2', 'h3', 'h4', 'h5', 'h6', 'p' );
if ( ! in_array( $heading_tag, $allowed_heading_tags, true ) ) {
	$heading_tag = 'h3';
}

$allowed_font_size_slugs = array(
	'x-small',
	'small',
	'base',
	'large',
	'x-large',
	'h-1',
	'h-2',
	'h-3',
	'h-4',
	'h-5',
	'h-6',
	'button',
);

$heading_size_value = '';
if ( '' !== $heading_size ) {
	if ( in_array( $heading_size, $allowed_font_size_slugs, true ) ) {
		$heading_size_value = sprintf( 'var(--wp--preset--font-size--%s)', $heading_size );
	} else {
		// Backward compatibility with previously saved free-text values.
		$heading_size_value = sanitize_text_field( $heading_size );
	}
}

$text_size_value = '';
if ( '' !== $text_size ) {
	if ( in_array( $text_size, $allowed_font_size_slugs, true ) ) {
		$text_size_value = sprintf( 'var(--wp--preset--font-size--%s)', $text_size );
	} else {
		// Backward compatibility with previously saved free-text values.
		$text_size_value = sanitize_text_field( $text_size );
	}
}

$heading_style = '';
if ( '' !== $heading_size_value ) {
	$heading_style .= 'font-size:' . $heading_size_value . ';';
}
if ( '' !== $heading_wt ) {
	$heading_style .= 'font-weight:' . sanitize_text_field( $heading_wt ) . ';';
}

$text_style = '';
if ( '' !== $text_size_value ) {
	$text_style .= 'font-size:' . $text_size_value . ';';
}
if ( '' !== $text_wt ) {
	$text_style .= 'font-weight:' . sanitize_text_field( $text_wt ) . ';';
}

$modal_panel_style = '';
if ( '' !== $modal_bg_slug ) {
	$modal_panel_style = sprintf( 'background:var(--wp--preset--color--%s);', $modal_bg_slug );
} else {
	$sanitized_modal_bg = sanitize_hex_color( $modal_bg );
	if ( $sanitized_modal_bg ) {
		$modal_panel_style = 'background:' . $sanitized_modal_bg . ';';
	}
}
?>
<article <?php echo get_block_wrapper_attributes( [ 'class' => 'icts-sector-card' ] ); ?>>
	<div class="icts-sector-card__card">
		<?php if ( $image_url ) : ?>
			<figure class="icts-sector-card__media">
				<img src="<?php echo esc_url( $image_url ); ?>" alt="<?php echo esc_attr( $image_alt ); ?>" loading="lazy" decoding="async" />
			</figure>
		<?php endif; ?>

		<div class="icts-sector-card__body">
			<?php if ( $heading ) : ?>
				<<?php echo esc_attr( $heading_tag ); ?> class="icts-sector-card__heading"<?php echo '' !== $heading_style ? ' style="' . esc_attr( $heading_style ) . '"' : ''; ?>><?php echo esc_html( $heading ); ?></<?php echo esc_attr( $heading_tag ); ?>>
			<?php endif; ?>

			<?php if ( $text ) : ?>
				<p class="icts-sector-card__text"<?php echo '' !== $text_style ? ' style="' . esc_attr( $text_style ) . '"' : ''; ?>><?php echo esc_html( $text ); ?></p>
			<?php endif; ?>

			<button
				type="button"
				class="icts-sector-card__learn-more"
				aria-haspopup="dialog"
				aria-controls="<?php echo esc_attr( $modal_id ); ?>"
				data-modal-target="<?php echo esc_attr( $modal_id ); ?>"
			>
				<?php echo esc_html( $button_label ); ?>
			</button>
		</div>
	</div>

	<div class="icts-sector-card__modal" id="<?php echo esc_attr( $modal_id ); ?>" hidden>
		<div class="icts-sector-card__modal-overlay" data-modal-close></div>
		<div
			class="icts-sector-card__modal-panel"
			role="dialog"
			aria-modal="true"
			aria-labelledby="<?php echo esc_attr( $label_id ); ?>"
			tabindex="-1"
			<?php echo '' !== $modal_panel_style ? ' style="' . esc_attr( $modal_panel_style ) . '"' : ''; ?>
		>
			<button
				type="button"
				class="icts-sector-card__modal-close"
				aria-label="<?php echo esc_attr__( 'Close dialog', 'icts-europe' ); ?>"
				data-modal-close
			>
				<span aria-hidden="true">&times;</span>
			</button>

			<h2 id="<?php echo esc_attr( $label_id ); ?>" class="screen-reader-text">
				<?php echo esc_html( $heading ? $heading : $button_label ); ?>
			</h2>

			<div class="icts-sector-card__modal-content">
				<?php echo wp_kses_post( $content ); ?>
			</div>
		</div>
	</div>
</article>
