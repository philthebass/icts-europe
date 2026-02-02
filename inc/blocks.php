<?php
/**
 * Custom block registrations for the ICTS Europe theme.
 *
 * @package icts-europe
 */

namespace ICTS_Europe;

\add_action(
    'acf/init',
    function () {

        // Bail early if ACF blocks are not available.
        if ( ! \function_exists( 'acf_register_block_type' ) ) {
            return;
        }

        // Client Logos Slider block.
        \acf_register_block_type(
            [
                'name'            => 'client-logos-slider',
                'title'           => __( 'Client Logos Slider', 'icts-europe' ),
                'description'     => __( 'Displays a responsive slider of client logos.', 'icts-europe' ),
                'render_template' => \get_template_directory() . '/template-parts/blocks/client-logos-slider.php',
                'category'        => 'widgets',
                'icon'            => 'images-alt2',
                'keywords'        => [ 'clients', 'logos', 'slider', 'carousel' ],
                'align'           => 'full',
                'supports'        => [
                    'align'  => [ 'full' ],
                    'anchor' => true,
                ],
                'enqueue_assets'  => function () {

                    $theme_uri = \get_template_directory_uri();

                    \wp_enqueue_style(
                        'icts-client-logos-slider',
                        $theme_uri . '/assets/styles/blocks/client-logos-slider.css',
                        [],
                        '1.0.0'
                    );

                    \wp_enqueue_style(
                        'flickity',
                        $theme_uri . '/assets/vendor/flickity/flickity.min.css',
                        [],
                        '2.3.0'
                    );

                    \wp_enqueue_script(
                        'flickity',
                        $theme_uri . '/assets/vendor/flickity/flickity.pkgd.min.js',
                        [],
                        '2.3.0',
                        true
                    );

                    \wp_enqueue_script(
                        'icts-client-logos-flickity',
                        $theme_uri . '/assets/js/client-logos-flickity.js',
                        [ 'flickity' ],
                        '1.0.0',
                        true
                    );
                },
            ]
        );

        // Hero Slider block.
        \acf_register_block_type(
            [
                'name'            => 'hero-slider',
                'title'           => __( 'Hero Slider', 'icts-europe' ),
                'description'     => __( 'Displays a full-width hero slider for page headers.', 'icts-europe' ),
                'render_template' => \get_template_directory() . '/template-parts/blocks/hero-slider.php',
                'category'        => 'theme',
                'icon'            => 'images-alt2',
                'keywords'        => [ 'hero', 'slider', 'banner' ],
                'align'           => 'full',
                'supports'        => [
                    'align'  => [ 'full' ],
                    'anchor' => true,
                ],
                'enqueue_assets'  => function () {

                    $theme_uri = \get_template_directory_uri();

                    // Block-specific CSS.
                    \wp_enqueue_style(
                        'icts-hero-slider',
                        $theme_uri . '/assets/styles/blocks/hero-slider.css',
                        [],
                        '1.0.0'
                    );

                    // Re-use Flickity (same handles as other sliders).
                    \wp_enqueue_style(
                        'flickity',
                        $theme_uri . '/assets/vendor/flickity/flickity.min.css',
                        [],
                        '2.3.0'
                    );

                    \wp_enqueue_script(
                        'flickity',
                        $theme_uri . '/assets/vendor/flickity/flickity.pkgd.min.js',
                        [],
                        '2.3.0',
                        true
                    );

                    \wp_enqueue_script(
                        'icts-hero-slider',
                        $theme_uri . '/assets/js/hero-slider.js',
                        [ 'flickity' ],
                        '1.0.0',
                        true
                    );
                },
            ]
        );

        // Team Member Card block.
        \acf_register_block_type(
            [
                'name'            => 'team-member-card',
                'title'           => __( 'Team Member Card', 'icts-europe' ),
                'description'     => __( 'Displays a Management Team member card.', 'icts-europe' ),
                'render_template' => \get_template_directory() . '/template-parts/blocks/team-member-card.php',
                'category'        => 'theme',
                'icon'            => 'id-alt',
                'keywords'        => [ 'team', 'member', 'people', 'staff' ],
                'supports'        => [
                    'align'  => false,
                    'anchor' => true,
                ],
            ]
        );

        // Team Member Profile block.
        \acf_register_block_type(
            [
                'name'            => 'team-member-profile',
                'title'           => __( 'Team Member Profile', 'icts-europe' ),
                'description'     => __( 'Displays a full Management Team member profile.', 'icts-europe' ),
                'render_template' => \get_template_directory() . '/template-parts/blocks/team-member-profile.php',
                'category'        => 'theme',
                'icon'            => 'id-alt',
                'keywords'        => [ 'team', 'member', 'profile', 'staff' ],
                'supports'        => [
                    'align'  => false,
                    'anchor' => true,
                ],
            ]
        );

        // Testimonials Slider block.
        \acf_register_block_type(
            [
                'name'            => 'testimonials-slider',
                'title'           => __( 'Testimonials Slider', 'icts-europe' ),
                'description'     => __( 'Displays a slider of client testimonials.', 'icts-europe' ),
                'render_template' => \get_template_directory() . '/template-parts/blocks/testimonials-slider.php',
                'category'        => 'theme',
                'icon'            => 'format-quote',
                'keywords'        => [ 'testimonial', 'slider', 'quote', 'clients' ],
                'align'           => 'full',
                'supports'        => [
                    'align'  => [ 'full' ],
                    'anchor' => true,
                ],
                'enqueue_assets'  => function () {

                    $theme_uri = \get_template_directory_uri();

                    \wp_enqueue_style(
                        'icts-testimonials-slider',
                        $theme_uri . '/assets/styles/blocks/testimonials-slider.css',
                        [],
                        '1.0.0'
                    );

                    \wp_enqueue_style(
                        'flickity',
                        $theme_uri . '/assets/vendor/flickity/flickity.min.css',
                        [],
                        '2.3.0'
                    );

                    \wp_enqueue_script(
                        'flickity',
                        $theme_uri . '/assets/vendor/flickity/flickity.pkgd.min.js',
                        [],
                        '2.3.0',
                        true
                    );

                    \wp_enqueue_script(
                        'icts-testimonials-slider',
                        $theme_uri . '/assets/js/testimonials-slider.js',
                        [ 'flickity' ],
                        '1.0.0',
                        true
                    );
                },
            ]
        );

    }
);