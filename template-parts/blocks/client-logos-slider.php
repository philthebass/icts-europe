<?php
/**
 * Logos Slider (Flickity) Block template.
 *
 * Logos can be sourced from Customers, Partners, or both.
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

// Mark editor preview explicitly so CSS can avoid front-end-only hidden states.
if ( is_admin() ) {
    $classes .= ' is-editor-preview';
}

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

$logo_source_mode = get_field( 'logo_source_mode' );
if ( ! in_array( $logo_source_mode, array( 'customers', 'partners', 'both' ), true ) ) {
    $logo_source_mode = 'customers';
}

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

// ----- Data collection helpers ------------------------------------------------

/**
 * Build customer logo image HTML from the customer_logo field.
 *
 * @param mixed  $logo  ACF image field return value.
 * @param string $title Fallback alt/title text.
 * @return string
 */
$get_customer_logo_html = static function ( $logo, $title ) {
    $image_id = 0;
    $img_html = '';

    if ( is_array( $logo ) ) {
        if ( isset( $logo['ID'] ) ) {
            $image_id = (int) $logo['ID'];
        } elseif ( isset( $logo['id'] ) ) {
            $image_id = (int) $logo['id'];
        } elseif ( isset( $logo['url'] ) ) {
            $img_html = sprintf(
                '<img src="%s" class="client-logos-slider__logo-image" alt="%s" loading="lazy" />',
                esc_url( $logo['url'] ),
                esc_attr( $title )
            );
        }
    } elseif ( is_numeric( $logo ) ) {
        $image_id = (int) $logo;
    } elseif ( is_string( $logo ) && '' !== $logo ) {
        $img_html = sprintf(
            '<img src="%s" class="client-logos-slider__logo-image" alt="%s" loading="lazy" />',
            esc_url( $logo ),
            esc_attr( $title )
        );
    }

    if ( $image_id ) {
        $img_html = wp_get_attachment_image(
            $image_id,
            'medium',
            false,
            array(
                'class'   => 'client-logos-slider__logo-image',
                'loading' => 'lazy',
                'alt'     => $title,
            )
        );
    }

    return is_string( $img_html ) ? $img_html : '';
};

/**
 * Resolve a post to the default-language member of its Polylang translation set.
 *
 * @param int $post_id Post ID.
 * @return int
 */
$get_canonical_post_id = static function ( $post_id ) {
    $post_id = (int) $post_id;

    if ( ! function_exists( 'pll_get_post_translations' ) ) {
        return $post_id;
    }

    $translations = pll_get_post_translations( $post_id );
    if ( empty( $translations ) || ! is_array( $translations ) ) {
        return $post_id;
    }

    if ( function_exists( 'pll_default_language' ) ) {
        $default_language = (string) pll_default_language();
        if ( '' !== $default_language && ! empty( $translations[ $default_language ] ) ) {
            return (int) $translations[ $default_language ];
        }
    }

    $translation_ids = array_filter( array_map( 'intval', $translations ) );
    if ( empty( $translation_ids ) ) {
        return $post_id;
    }

    return min( $translation_ids );
};

$logo_items = array();
$rendered_customer_ids = array();
$rendered_partner_ids  = array();

// ----- Build customers data ---------------------------------------------------

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
    'post_type'        => 'customers',
    'post_status'      => 'publish',
    'posts_per_page'   => -1,
    'orderby'          => 'title',
    'order'            => 'ASC',
    'lang'             => '',
    'suppress_filters' => true,
    'meta_query'       => array(
        array(
            'key'     => 'customer_logo',
            'compare' => 'EXISTS',
        ),
    ),
);

// Only add tax_query if we actually have filters.
if ( in_array( $logo_source_mode, array( 'customers', 'both' ), true ) ) {
    if ( ! empty( $tax_query ) ) {
        $args['tax_query'] = $tax_query;
    }

    $customers_query = new WP_Query( $args );

    if ( $customers_query->have_posts() ) {
        while ( $customers_query->have_posts() ) {
            $customers_query->the_post();

            $customer_id = $get_canonical_post_id( get_the_ID() );
            if ( isset( $rendered_customer_ids[ $customer_id ] ) ) {
                continue;
            }

            $logo     = get_field( 'customer_logo', $customer_id );
            $logo_url = get_field( 'link', $customer_id );
            $title    = get_the_title( $customer_id );
            $img_html = $get_customer_logo_html( $logo, $title );

            if ( '' === $img_html ) {
                continue;
            }

            $rendered_customer_ids[ $customer_id ] = true;

            $logo_items[] = array(
                'title'    => $title,
                'url'      => is_string( $logo_url ) ? $logo_url : '',
                'img_html' => $img_html,
            );
        }
    }

    wp_reset_postdata();
}

// ----- Build partners data ----------------------------------------------------

if ( in_array( $logo_source_mode, array( 'partners', 'both' ), true ) ) {
    $partners_query = new WP_Query(
        array(
            'post_type'        => 'partner',
            'post_status'      => 'publish',
            'posts_per_page'   => -1,
            'orderby'          => 'title',
            'order'            => 'ASC',
            'lang'             => '',
            'suppress_filters' => true,
            'meta_query'       => array(
                array(
                    'key'     => '_thumbnail_id',
                    'compare' => 'EXISTS',
                ),
            ),
        )
    );

    if ( $partners_query->have_posts() ) {
        while ( $partners_query->have_posts() ) {
            $partners_query->the_post();

            $partner_id = $get_canonical_post_id( get_the_ID() );
            if ( isset( $rendered_partner_ids[ $partner_id ] ) ) {
                continue;
            }

            $title    = get_the_title( $partner_id );
            $logo_url = get_field( 'partner_site', $partner_id );
            $image_id = get_post_thumbnail_id( $partner_id );
            $img_html = '';

            if ( $image_id ) {
                $img_html = wp_get_attachment_image(
                    $image_id,
                    'medium',
                    false,
                    array(
                        'class'   => 'client-logos-slider__logo-image',
                        'loading' => 'lazy',
                        'alt'     => $title,
                    )
                );
            }

            if ( '' === $img_html ) {
                continue;
            }

            $rendered_partner_ids[ $partner_id ] = true;

            $logo_items[] = array(
                'title'    => $title,
                'url'      => is_string( $logo_url ) ? $logo_url : '',
                'img_html' => $img_html,
            );
        }
    }

    wp_reset_postdata();
}

if ( 'both' === $logo_source_mode && ! empty( $logo_items ) ) {
    usort(
        $logo_items,
        static function ( $left, $right ) {
            return strcasecmp( (string) $left['title'], (string) $right['title'] );
        }
    );
}

if ( ! is_admin() && count( $logo_items ) > 24 ) {
    $logo_items = array_slice( $logo_items, 0, 24 );
}

// ----- Render ----------------------------------------------------------------
?>

<section id="<?php echo esc_attr( $anchor ); ?>" class="<?php echo esc_attr( $classes ); ?>">

    <?php if ( ! empty( $logo_items ) ) : ?>


        <div class="client-logos-slider__carousel">
            <?php
            foreach ( $logo_items as $logo_item ) :
                ?>
                <div class="client-logos-slider__cell">
                    <?php if ( ! empty( $logo_item['url'] ) ) : ?>
                        <a
                            href="<?php echo esc_url( $logo_item['url'] ); ?>"
                            class="client-logos-slider__logo-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <?php echo $logo_item['img_html']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
                        </a>
                    <?php else : ?>
                        <?php echo $logo_item['img_html']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>

    <?php elseif ( is_admin() ) : ?>

        <p><?php esc_html_e( 'No logos found for the current source/filter settings.', 'icts-europe' ); ?></p>

    <?php endif; ?>

</section>
