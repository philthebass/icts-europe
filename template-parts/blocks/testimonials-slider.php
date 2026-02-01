<?php
/**
 * Testimonials Slider block template.
 *
 * @package icts-europe
 */

// $block is provided by ACF.
if ( ! isset( $block ) ) {
    return;
}

// Generate ID and classes for the block wrapper.
$id = ! empty( $block['anchor'] ) ? $block['anchor'] : 'testimonials-slider-' . $block['id'];

$class_name = 'block-testimonials-slider';
if ( ! empty( $block['className'] ) ) {
    $class_name .= ' ' . $block['className'];
}
if ( ! empty( $block['align'] ) ) {
    $class_name .= ' align' . $block['align'];
}

// Query Testimonials.
$args = [
    'post_type'      => 'testimonial',
    'posts_per_page' => -1,
    'orderby'        => 'menu_order',
    'order'          => 'ASC',
    'meta_query'     => [
        [
            'key'     => 'testimonial_text',
            'compare' => '!=',
            'value'   => '',
        ],
    ],
];

// Polylang filter
if ( function_exists( '\pll_current_language' ) ) {
    $args['lang'] = \pll_current_language( 'slug' );
}

$query = new \WP_Query( $args );

if ( ! $query->have_posts() ) {
    if ( ! empty( $is_preview ) ) {
        echo '<p>' . \esc_html__( 'No testimonials found.', 'icts-europe' ) . '</p>';
    }
    \wp_reset_postdata();
    return;
}
?>

<section id="<?php echo \esc_attr( $id ); ?>" class="<?php echo \esc_attr( $class_name ); ?>">
    <div class="testimonials-slider js-testimonials-slider">
        <?php while ( $query->have_posts() ) : $query->the_post(); ?>

           <?php
            $post_id = get_the_ID();

            // Read values directly from post meta (avoids ACF mapping issues).
            $testimonial_name = get_post_meta( $post_id, 'testimonial_name', true );
            $job_title = get_post_meta( $post_id, 'job_title', true );
            $company = get_post_meta( $post_id, 'company', true );
            $testimonial_text = get_post_meta( $post_id, 'testimonial_text', true );
            $client_logo_id = (int) get_post_meta( $post_id, 'client_logo', true );

        // Fallback only for the *text*, not the company name.
            if ( ! $testimonial_text ) {
                $testimonial_text = get_the_content( null, false, $post_id );
            }
// No fallback to post title for $company – we don't want titles in the slider.
?>

    <article class="testimonial-slide">
        <div class="testimonial-inner">

          <div class="testimonial-quote-icon testimonial-quote-icon--open" aria-hidden="true">
            <svg class="testimonial-quote-svg"
         xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 78 252"
         role="img"
         focusable="false">
        <text transform="translate(6 3)"
              fill="#ffffff"
              stroke="currentColor"
              stroke-width="3"
              font-size="180"
              font-family="NunitoSans-Regular, 'Nunito Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
            <tspan x="-2.1" y="182">“</tspan>
        </text>
    </svg>
            </div>

            <?php if ( $testimonial_text ) : ?>
                <blockquote class="testimonial-quote">
                    <?php echo wp_kses_post( wpautop( $testimonial_text ) ); ?>
                </blockquote>
            <?php endif; ?>

            <?php if ( $testimonial_name || $job_title ) : ?>
                <p class="testimonial-person">
                    <?php
                    echo esc_html( $testimonial_name );
                    if ( $testimonial_name && $job_title ) {
                        echo ' – ';
                    }
                    echo esc_html( $job_title );
                    ?>
                </p>
            <?php endif; ?>

            <?php if ( $client_logo_id ) : ?>
                <div class="testimonial-logo">
                    <?php
                    $alt = get_post_meta( $client_logo_id, '_wp_attachment_image_alt', true );
                    if ( '' === $alt ) {
                        $alt = $company ?: get_the_title( $post_id );
                    }

                    echo wp_get_attachment_image(
                        $client_logo_id,
                        'medium',
                        false,
                        [ 'alt' => esc_attr( $alt ) ]
                    );
                    ?>
                </div>
            <?php endif; ?>

            <div class="testimonial-quote-icon testimonial-quote-icon--close" aria-hidden="true">
            <svg class="testimonial-quote-svg"
         xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 78 252"
         role="img"
         focusable="false">
        <text transform="translate(6 3)"
              fill="#ffffff"
              stroke="currentColor"
              stroke-width="3"
              font-size="180"
              font-family="NunitoSans-Regular, 'Nunito Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
            <tspan x="-2.1" y="182">”</tspan>
        </text>
    </svg>
        </div>

        </div>
    </article>

        <?php endwhile; ?>
    </div>
</section>

<?php
wp_reset_postdata();