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
				// Default alignment: full width.
				'align'           => 'full',
				'supports'        => [
					'align'  => [ 'full' ],
					'anchor' => true,
				],
				'enqueue_assets'  => function () {

					$theme_uri = \get_template_directory_uri();

					// Block-specific styles.
					\wp_enqueue_style(
						'icts-client-logos-slider',
						$theme_uri . '/assets/styles/blocks/client-logos-slider.css',
						[],
						'1.0.0'
					);

					// Flickity CSS.
					\wp_enqueue_style(
						'flickity',
						$theme_uri . '/assets/vendor/flickity/flickity.min.css',
						[],
						'2.3.0'
					);

					// Flickity JS.
					\wp_enqueue_script(
						'flickity',
						$theme_uri . '/assets/vendor/flickity/flickity.pkgd.min.js',
						[],
						'2.3.0',
						true
					);

					// Our Flickity initialiser for this block.
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
				// No enqueue_assets needed for now – we’ll just style via theme CSS.
			]
		);

		        // Team Member Profile block (single profile layout).
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

	}
);