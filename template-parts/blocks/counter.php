<?php
/**
 * Counter block template.
 *
 * @package icts-europe
 */

if ( ! isset( $block ) || ! is_array( $block ) ) {
	return;
}

$is_editor_preview = ! empty( $is_preview ) || is_admin();

$id = ! empty( $block['anchor'] ) ? (string) $block['anchor'] : 'counter-' . (string) $block['id'];

$class_name = 'icts-counter-block';
if ( ! empty( $block['className'] ) ) {
	$raw_classes = \preg_split( '/\s+/', (string) $block['className'] );
	$raw_classes = \is_array( $raw_classes ) ? $raw_classes : [];

	$align_classes = [
		'alignleft',
		'alignright',
		'aligncenter',
		'alignwide',
		'alignfull',
	];

	$classes = [];
	foreach ( $raw_classes as $raw_class ) {
		$raw_class = \is_string( $raw_class ) ? \trim( $raw_class ) : '';
		if ( '' === $raw_class || \in_array( $raw_class, $align_classes, true ) ) {
			continue;
		}

		$sanitized = \sanitize_html_class( $raw_class );
		if ( '' !== $sanitized ) {
			$classes[] = $sanitized;
		}
	}

	if ( ! empty( $classes ) ) {
		$class_name .= ' ' . \implode( ' ', $classes );
	}
}
if ( $is_editor_preview ) {
	$class_name .= ' is-editor-preview';
}

$number = get_field( 'number' );
$number = is_numeric( $number ) ? (int) round( (float) $number ) : 0;
$number = max( 0, $number );

$count_direction = get_field( 'count_direction' );
if ( ! in_array( $count_direction, [ 'up', 'down' ], true ) ) {
	$count_direction = 'up';
}

$prefix = get_field( 'prefix' );
$prefix = is_string( $prefix ) ? trim( $prefix ) : '';

$suffix = get_field( 'suffix' );
$suffix = is_string( $suffix ) ? trim( $suffix ) : '';

$label = get_field( 'label' );
$label = is_string( $label ) ? trim( $label ) : '';

$from_value = ( 'down' === $count_direction ) ? $number : 0;
$to_value   = ( 'down' === $count_direction ) ? 0 : $number;
$display_from = number_format( $from_value, 0, '.', ',' );

$aria_value_number = number_format( $to_value, 0, '.', ',' );
$aria_value        = trim( $prefix . $aria_value_number . $suffix );
if ( '' === $aria_value ) {
	$aria_value = $aria_value_number;
}
?>

<section id="<?php echo esc_attr( $id ); ?>" class="<?php echo esc_attr( $class_name ); ?>">
	<div
		class="icts-counter-block__inner"
		data-count-direction="<?php echo esc_attr( $count_direction ); ?>"
	>
		<p class="icts-counter-block__value" aria-label="<?php echo esc_attr( $aria_value ); ?>">
			<?php if ( '' !== $prefix ) : ?>
				<span class="icts-counter-block__affix is-prefix"><?php echo esc_html( $prefix ); ?></span>
			<?php endif; ?>

			<span
				class="icts-counter-block__number"
				data-from="<?php echo esc_attr( (string) $from_value ); ?>"
				data-to="<?php echo esc_attr( (string) $to_value ); ?>"
				data-duration="1600"
			>
				<?php echo esc_html( $display_from ); ?>
			</span>

			<?php if ( '' !== $suffix ) : ?>
				<span class="icts-counter-block__affix is-suffix"><?php echo esc_html( $suffix ); ?></span>
			<?php endif; ?>
		</p>

		<?php if ( '' !== $label ) : ?>
			<p class="icts-counter-block__label"><?php echo esc_html( $label ); ?></p>
		<?php endif; ?>
	</div>
</section>
