<?php
/**
 * Client Logos Slider (Flickity) Block template.
 *
 * Logos are sourced from the "Customers" CPT.
 * Filtering is controlled via block-level ACF fields:
 * - customer_type_filter (radio: all|specific)
 * - customer_type_term   (taxonomy: customer-type)
 * - product_filter_mode  (radio: all|specific)
 * - product_taxonomy     (taxonomy: product)
 *
 * @var array $block
 */

if ( ! isset( $block ) ) {
    return;
}

// ----- Basic block setup -----------------------------------------------------

$block_id = 'client-logos-slider-' . $block['id'];

// Base class for the block.
$classes = 'client-logos-slider';

// Only apply alignfull on the front end so the editor layout stays sane.
if ( ! is_admin() && ! empty( $block['align'] ) && 'full' === $block['align'] ) {
    $classes .= ' alignfull';
}

// Preserve any custom classes from the block settings.
if ( ! empty( $block['className'] ) ) {
    $classes .= ' ' . esc_attr( $block['className'] );
}

$anchor = ! empty( $block['anchor'] ) ? sanitize_title( $block['anchor'] ) : $block_id;

// ----- Block controls (ACF fields on the block) ------------------------------

$customer_type_filter = get_field( 'customer_type_filter' );
if ( ! $customer_type_filter ) {
    $customer_type_filter = 'all';
}

$customer_type_term = get_field( 'customer_type_term' ); // Term object or null.

$product_filter_mode = get_field( 'product_filter_mode' );
if ( ! $product_filter_mode ) {
    $product_filter_mode = 'all';
}

$product_taxonomy_term = get_field( 'product_taxonomy' ); // Term object or null.

// ----- Build the query for Customers CPT -------------------------------------

$tax_query = array();

// Filter by customer type taxonomy.
if ( 'specific' === $customer_type_filter && $customer_type_term instanceof WP_Term ) {
    $tax_query[] = array(
        'taxonomy' => 'customer-type',
        'field'    => 'term_id',
        'terms'    => array( $customer_type_term->term_id ),
    );
}

// Filter by product taxonomy.
if ( 'specific' === $product_filter_mode && $product_taxonomy_term instanceof WP_Term ) {
    $tax_query[] = array(
        'taxonomy' => 'product',
        'field'    => 'term_id',
        'terms'    => array( $product_taxonomy_term->term_id ),
    );
}

$args = array(
    'post_type'      => 'customers',
    'post_status'    => 'publish',
    'posts_per_page' => -1,
    'orderby'        => 'title',
    'order'          => 'ASC',
    'meta_query'     => array(
        array(
            'key'     => 'customer_logo',
            'compare' => 'EXISTS',
        ),
    ),
);

// Only add tax_query if we actually have filters.
if ( ! empty( $tax_query ) ) {
    $args['tax_query'] = $tax_query;
}

$query = new WP_Query( $args );

// How many logos did we get?
$logo_count = ( $query instanceof WP_Query ) ? (int) $query->found_posts : 0;

// ----- Render ----------------------------------------------------------------
?>

<section id="<?php echo esc_attr( $anchor ); ?>" class="<?php echo esc_attr( $classes ); ?>">

    <?php if ( $query->have_posts() ) : ?>


        <div class="client-logos-slider__carousel">
            <?php
            while ( $query->have_posts() ) :
                $query->the_post();

                $logo     = get_field( 'customer_logo', get_the_ID() );
                $logo_url = get_field( 'link', get_the_ID() ); // optional site URL.

                $image_id = 0;
                $img_html = '';

                // CASE 1: Image field returns array.
                if ( is_array( $logo ) ) {
                    if ( isset( $logo['ID'] ) ) {
                        $image_id = (int) $logo['ID'];
                    } elseif ( isset( $logo['id'] ) ) {
                        $image_id = (int) $logo['id'];
                    } elseif ( isset( $logo['url'] ) ) {
                        $img_html = sprintf(
                            '<img src="%s" class="client-logos-slider__logo-image" alt="%s" loading="lazy" />',
                            esc_url( $logo['url'] ),
                            esc_attr( get_the_title() )
                        );
                    }
                } elseif ( is_numeric( $logo ) ) {
                    // CASE 2: attachment ID.
                    $image_id = (int) $logo;
                } elseif ( is_string( $logo ) && '' !== $logo ) {
                    // CASE 3: plain URL.
                    $img_html = sprintf(
                        '<img src="%s" class="client-logos-slider__logo-image" alt="%s" loading="lazy" />',
                        esc_url( $logo ),
                        esc_attr( get_the_title() )
                    );
                }

                // Prefer wp_get_attachment_image when we have an ID.
                if ( $image_id ) {
                    $img_html = wp_get_attachment_image(
                        $image_id,
                        'medium',
                        false,
                        array(
                            'class'   => 'client-logos-slider__logo-image',
                            'loading' => 'lazy',
                            'alt'     => get_the_title(),
                        )
                    );
                }

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
            <?php endwhile; ?>
            <?php wp_reset_postdata(); ?>
        </div>

    <?php elseif ( is_admin() ) : ?>

        <p><?php esc_html_e( 'No customers with logos found for the current filter.', 'icts-europe' ); ?></p>

    <?php endif; ?>

</section>