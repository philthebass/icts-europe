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

		// Logos Slider block.
		\acf_register_block_type(
			[
				'name'            => 'client-logos-slider',
				'title'           => __( 'Logos Slider', 'icts-europe' ),
				'description'     => __( 'Displays a responsive slider of customer and partner logos.', 'icts-europe' ),
				'render_template' => \get_template_directory() . '/template-parts/blocks/client-logos-slider.php',
				'category'        => 'widgets',
				'icon'            => 'images-alt2',
				'keywords'        => [ 'logos', 'customers', 'partners', 'slider', 'carousel' ],
				'api_version'     => 3,
				'align'           => 'full',
				'supports'        => [
					'align'  => [ 'full' ],
					'anchor' => true,
				],
				'enqueue_assets'  => function () {
					$theme_uri = \get_template_directory_uri();

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

		// (Removed) ACF Hero Slider block: replaced by native Gutenberg blocks.

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
				'api_version'     => 3,
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
				'api_version'     => 3,
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
				'api_version'     => 3,
				'align'           => 'full',
				'supports'        => [
					'align'  => [ 'full' ],
					'anchor' => true,
				],
				'enqueue_assets'  => function () {
					$theme_uri = \get_template_directory_uri();

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

		// FAQ Accordion block.
		\acf_register_block_type(
			[
				'name'            => 'faq-accordion',
				'title'           => __( 'FAQ Accordion', 'icts-europe' ),
				'description'     => __( 'Displays FAQs in an accordion with optional taxonomy scoping.', 'icts-europe' ),
				'render_template' => \get_template_directory() . '/template-parts/blocks/faq-accordion.php',
				'category'        => 'theme',
				'icon'            => 'list-view',
				'keywords'        => [ 'faq', 'accordion', 'questions', 'answers' ],
				'api_version'     => 3,
				'align'           => 'wide',
				'supports'        => [
					'align'  => [ 'wide', 'full' ],
					'anchor' => true,
				],
				'enqueue_assets'  => function () {
					$theme_dir = \get_template_directory();
					$theme_uri = \get_template_directory_uri();
					$theme_ver = \wp_get_theme()->get( 'Version' );

					$script_path = '/assets/js/faq-accordion.js';
					$script_abs  = $theme_dir . $script_path;
					$script_ver  = \file_exists( $script_abs ) ? (string) \filemtime( $script_abs ) : $theme_ver;

					\wp_enqueue_script(
						'icts-faq-accordion',
						$theme_uri . $script_path,
						[],
						$script_ver,
						true
					);
				},
			]
		);

		// Counter block.
		\acf_register_block_type(
			[
				'name'            => 'counter',
				'title'           => __( 'Counter', 'icts-europe' ),
				'description'     => __( 'Displays a branded animated counter with label, prefix, and suffix.', 'icts-europe' ),
				'render_template' => \get_template_directory() . '/template-parts/blocks/counter.php',
				'category'        => 'theme',
				'icon'            => 'editor-ol',
				'keywords'        => [ 'counter', 'number', 'stat', 'metric' ],
				'api_version'     => 3,
				'supports'        => [
					'align'    => false,
					'anchor'   => true,
					'inserter' => true,
				],
				'enqueue_assets'  => function () {
					$style_path  = \get_template_directory() . '/assets/styles/blocks/counter.css';
					$script_path = \get_template_directory() . '/assets/js/counter.js';

					\wp_enqueue_style(
						'icts-counter-block',
						\get_template_directory_uri() . '/assets/styles/blocks/counter.css',
						[],
						\file_exists( $style_path ) ? (string) \filemtime( $style_path ) : '1.0.0'
					);

					\wp_enqueue_script(
						'icts-counter-block-script',
						\get_template_directory_uri() . '/assets/js/counter.js',
						[],
						\file_exists( $script_path ) ? (string) \filemtime( $script_path ) : '1.0.0',
						true
					);
				},
			]
		);
	}
);

/**
 * Register ACF block styles via block-style API (front-end + iframe editor compatible).
 */
function register_acf_block_styles() {
	$theme_dir = \get_template_directory();
	$theme_uri = \get_template_directory_uri();
	$theme_ver = \wp_get_theme()->get( 'Version' );
	$asset_ver = static function ( $relative_path ) use ( $theme_dir, $theme_ver ) {
		$absolute_path = $theme_dir . $relative_path;
		return \file_exists( $absolute_path ) ? (string) \filemtime( $absolute_path ) : $theme_ver;
	};

	if ( ! \wp_style_is( 'flickity', 'registered' ) ) {
		\wp_register_style(
			'flickity',
			$theme_uri . '/assets/vendor/flickity/flickity.min.css',
			[],
			'2.3.0'
		);
	}

	\wp_register_style(
		'icts-post-archive-filters',
		$theme_uri . '/assets/styles/blocks/post-archive-filters.css',
		[],
		$asset_ver( '/assets/styles/blocks/post-archive-filters.css' )
	);

	$block_styles = [
		[
			'block'  => 'acf/client-logos-slider',
			'handle' => 'icts-client-logos-slider',
			'src'    => '/assets/styles/blocks/client-logos-slider.css',
			'deps'   => [ 'flickity' ],
		],
		[
			'block'  => 'acf/team-member-card',
			'handle' => 'icts-team-member-card',
			'src'    => '/assets/styles/blocks/team-member-card.css',
			'deps'   => [],
		],
		[
			'block'  => 'acf/team-member-profile',
			'handle' => 'icts-team-member-profile',
			'src'    => '/assets/styles/blocks/team-member-profile.css',
			'deps'   => [],
		],
		[
			'block'  => 'acf/testimonials-slider',
			'handle' => 'icts-testimonials-slider',
			'src'    => '/assets/styles/blocks/testimonials-slider.css',
			'deps'   => [ 'flickity' ],
		],
		[
			'block'  => 'acf/faq-accordion',
			'handle' => 'icts-faq-accordion',
			'src'    => '/assets/styles/blocks/faq-accordion.css',
			'deps'   => [ 'icts-post-archive-filters' ],
		],
	];

	foreach ( $block_styles as $block_style ) {
		$src = (string) $block_style['src'];

		\wp_enqueue_block_style(
			(string) $block_style['block'],
			[
				'handle' => (string) $block_style['handle'],
				'src'    => $theme_uri . $src,
				'path'   => $theme_dir . $src,
				'deps'   => (array) $block_style['deps'],
			]
		);
	}
}
\add_action( 'init', __NAMESPACE__ . '\\register_acf_block_styles', 20 );
