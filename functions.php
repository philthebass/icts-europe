<?php
/**
 * This file adds functions to the ICTS Europe WordPress theme.
 *
 * @package icts-europe
 * @author  Phil Evans
 * @license GNU General Public License v2 or later
 * @link    https://www.earlymarketing.com/
 */

namespace ICTS_Europe;

// Load custom ACF / PHP-rendered blocks.
require_once __DIR__ . '/inc/blocks.php';
// Register native (JS) blocks assets.
\add_action( 'init', function () {
    $theme_dir = get_template_directory();
    $theme_ver = \wp_get_theme()->get( 'Version' );
    $asset_ver = static function ( $relative_path ) use ( $theme_dir, $theme_ver ) {
        $absolute_path = $theme_dir . $relative_path;
        return file_exists( $absolute_path ) ? (string) filemtime( $absolute_path ) : $theme_ver;
    };

    // Editor scripts for native slider blocks (no build step; uses wp globals).
    $hero_editor_handle = 'icts-hero-blocks-editor';
    \wp_register_script(
        $hero_editor_handle,
        get_template_directory_uri() . '/assets/blocks/hero-slider/editor.js',
        [ 'wp-blocks', 'wp-element', 'wp-i18n', 'wp-block-editor', 'wp-components' ],
        $asset_ver( '/assets/blocks/hero-slider/editor.js' ),
        true
    );
    $solutions_editor_handle = 'icts-solutions-blocks-editor';
    \wp_register_script(
        $solutions_editor_handle,
        get_template_directory_uri() . '/assets/blocks/solutions-slider/editor.js',
        [ 'wp-blocks', 'wp-element', 'wp-i18n', 'wp-block-editor', 'wp-components' ],
        $asset_ver( '/assets/blocks/solutions-slider/editor.js' ),
        true
    );

    // Front-end assets (shared with editor preview if needed).
    \wp_register_style(
        'icts-hero-slider-style',
        get_template_directory_uri() . '/assets/styles/blocks/hero-slider.css',
        [],
        $asset_ver( '/assets/styles/blocks/hero-slider.css' )
    );
    \wp_register_style(
        'icts-solutions-slider-style',
        get_template_directory_uri() . '/assets/styles/blocks/solutions-slider.css',
        [],
        $asset_ver( '/assets/styles/blocks/solutions-slider.css' )
    );
    \wp_register_style(
        'flickity',
        get_template_directory_uri() . '/assets/vendor/flickity/flickity.min.css',
        [],
        '2.3.0'
    );
    \wp_register_script(
        'flickity',
        get_template_directory_uri() . '/assets/vendor/flickity/flickity.pkgd.min.js',
        [],
        '2.3.0',
        true
    );
    \wp_register_script(
        'icts-hero-slider-frontend',
        get_template_directory_uri() . '/assets/js/hero-slider.js',
        [ 'flickity' ],
        $asset_ver( '/assets/js/hero-slider.js' ),
        true
    );
    \wp_register_script(
        'icts-solutions-slider-frontend',
        get_template_directory_uri() . '/assets/js/solutions-slider.js',
        [ 'flickity' ],
        $asset_ver( '/assets/js/solutions-slider.js' ),
        true
    );
    \wp_register_script(
        'icts-latest-news-slider-frontend',
        get_template_directory_uri() . '/assets/js/latest-news-slider.js',
        [ 'flickity' ],
        $asset_ver( '/assets/js/latest-news-slider.js' ),
        true
    );

    \wp_register_script(
        'icts-sector-grid-editor',
        get_template_directory_uri() . '/assets/blocks/sector-grid/editor.js',
        [ 'wp-blocks', 'wp-element', 'wp-block-editor' ],
        $asset_ver( '/assets/blocks/sector-grid/editor.js' ),
        true
    );

    \wp_register_script(
        'icts-sector-card-editor',
        get_template_directory_uri() . '/assets/blocks/sector-card/editor.js',
        [ 'wp-blocks', 'wp-element', 'wp-i18n', 'wp-block-editor', 'wp-components' ],
        $asset_ver( '/assets/blocks/sector-card/editor.js' ),
        true
    );

    \wp_register_script(
        'icts-sector-card-view',
        get_template_directory_uri() . '/blocks/sector-card/view.js',
        [],
        $asset_ver( '/blocks/sector-card/view.js' ),
        true
    );

    \wp_register_script(
        'icts-how-it-works-editor',
        get_template_directory_uri() . '/assets/blocks/how-it-works/editor.js',
        [ 'wp-blocks', 'wp-element', 'wp-i18n', 'wp-block-editor' ],
        $asset_ver( '/assets/blocks/how-it-works/editor.js' ),
        true
    );

    \wp_register_script(
        'icts-how-it-works-step-editor',
        get_template_directory_uri() . '/assets/blocks/how-it-works-step/editor.js',
        [ 'wp-blocks', 'wp-element', 'wp-i18n', 'wp-block-editor', 'wp-components' ],
        $asset_ver( '/assets/blocks/how-it-works-step/editor.js' ),
        true
    );
    \wp_register_script(
        'icts-steps-primary-editor',
        get_template_directory_uri() . '/assets/blocks/steps-primary/editor.js',
        [ 'wp-blocks', 'wp-element', 'wp-i18n', 'wp-block-editor' ],
        $asset_ver( '/assets/blocks/steps-primary/editor.js' ),
        true
    );
    \wp_register_script(
        'icts-steps-primary-step-editor',
        get_template_directory_uri() . '/assets/blocks/steps-primary-step/editor.js',
        [ 'wp-blocks', 'wp-element', 'wp-i18n', 'wp-block-editor', 'wp-components' ],
        $asset_ver( '/assets/blocks/steps-primary-step/editor.js' ),
        true
    );
    \wp_register_script(
        'icts-latest-news-slider-editor',
        get_template_directory_uri() . '/assets/blocks/latest-news-slider/editor.js',
        [ 'wp-blocks', 'wp-element', 'wp-i18n', 'wp-block-editor', 'wp-components', 'wp-server-side-render' ],
        $asset_ver( '/assets/blocks/latest-news-slider/editor.js' ),
        true
    );

    \wp_register_script(
        'icts-how-it-works-view',
        get_template_directory_uri() . '/blocks/how-it-works/view.js',
        [],
        $asset_ver( '/blocks/how-it-works/view.js' ),
        true
    );
    \wp_register_script(
        'icts-steps-primary-view',
        get_template_directory_uri() . '/blocks/steps-primary/view.js',
        [],
        $asset_ver( '/blocks/steps-primary/view.js' ),
        true
    );

    \wp_register_style(
        'icts-sector-grid-style',
        get_template_directory_uri() . '/assets/styles/blocks/sector-grid.css',
        [],
        $asset_ver( '/assets/styles/blocks/sector-grid.css' )
    );

    \wp_register_style(
        'icts-sector-grid-editor',
        get_template_directory_uri() . '/assets/styles/blocks/sector-grid-editor.css',
        [],
        $asset_ver( '/assets/styles/blocks/sector-grid-editor.css' )
    );

    \wp_register_style(
        'icts-sector-card-style',
        get_template_directory_uri() . '/assets/styles/blocks/sector-card.css',
        [],
        $asset_ver( '/assets/styles/blocks/sector-card.css' )
    );

    \wp_register_style(
        'icts-sector-card-editor',
        get_template_directory_uri() . '/assets/styles/blocks/sector-card-editor.css',
        [],
        $asset_ver( '/assets/styles/blocks/sector-card-editor.css' )
    );

    \wp_register_style(
        'icts-how-it-works-style',
        get_template_directory_uri() . '/assets/styles/blocks/how-it-works.css',
        [],
        $asset_ver( '/assets/styles/blocks/how-it-works.css' )
    );

    \wp_register_style(
        'icts-how-it-works-editor',
        get_template_directory_uri() . '/assets/styles/blocks/how-it-works-editor.css',
        [],
        $asset_ver( '/assets/styles/blocks/how-it-works-editor.css' )
    );

    \wp_register_style(
        'icts-how-it-works-step-style',
        get_template_directory_uri() . '/assets/styles/blocks/how-it-works-step.css',
        [],
        $asset_ver( '/assets/styles/blocks/how-it-works-step.css' )
    );

    \wp_register_style(
        'icts-how-it-works-step-editor',
        get_template_directory_uri() . '/assets/styles/blocks/how-it-works-step-editor.css',
        [],
        $asset_ver( '/assets/styles/blocks/how-it-works-step-editor.css' )
    );
    \wp_register_style(
        'icts-steps-primary-style',
        get_template_directory_uri() . '/assets/styles/blocks/steps-primary.css',
        [],
        $asset_ver( '/assets/styles/blocks/steps-primary.css' )
    );
    \wp_register_style(
        'icts-steps-primary-editor',
        get_template_directory_uri() . '/assets/styles/blocks/steps-primary-editor.css',
        [],
        $asset_ver( '/assets/styles/blocks/steps-primary-editor.css' )
    );
    \wp_register_style(
        'icts-steps-primary-step-style',
        get_template_directory_uri() . '/assets/styles/blocks/steps-primary-step.css',
        [],
        $asset_ver( '/assets/styles/blocks/steps-primary-step.css' )
    );
    \wp_register_style(
        'icts-steps-primary-step-editor',
        get_template_directory_uri() . '/assets/styles/blocks/steps-primary-step-editor.css',
        [],
        $asset_ver( '/assets/styles/blocks/steps-primary-step-editor.css' )
    );

    \wp_register_style(
        'icts-latest-news-slider-style',
        get_template_directory_uri() . '/assets/styles/blocks/latest-news-slider.css',
        [ 'flickity' ],
        $asset_ver( '/assets/styles/blocks/latest-news-slider.css' )
    );

    \register_block_type( 'icts-europe/hero-slider', [
        'editor_script' => $hero_editor_handle,
        'style'         => [ 'icts-hero-slider-style', 'flickity' ],
        'view_script'   => [ 'flickity', 'icts-hero-slider-frontend' ],
    ] );

    \register_block_type( 'icts-europe/hero-slide', [
        'editor_script' => $hero_editor_handle,
        'parent'        => [ 'icts-europe/hero-slider' ],
    ] );

    \register_block_type( 'icts-europe/solutions-slider', [
        'editor_script' => $solutions_editor_handle,
        'style'         => [ 'icts-solutions-slider-style', 'flickity' ],
        'view_script'   => [ 'flickity', 'icts-solutions-slider-frontend' ],
    ] );

    \register_block_type( 'icts-europe/solutions-slide', [
        'editor_script' => $solutions_editor_handle,
        'parent'        => [ 'icts-europe/solutions-slider' ],
    ] );

    \register_block_type_from_metadata( __DIR__ . '/blocks/sector-grid' );
    \register_block_type_from_metadata( __DIR__ . '/blocks/sector-card' );
    \register_block_type_from_metadata( __DIR__ . '/blocks/how-it-works' );
    \register_block_type_from_metadata( __DIR__ . '/blocks/how-it-works-step' );
    \register_block_type_from_metadata( __DIR__ . '/blocks/steps-primary' );
    \register_block_type_from_metadata( __DIR__ . '/blocks/steps-primary-step' );
    \register_block_type_from_metadata( __DIR__ . '/blocks/latest-news-slider' );

    \register_block_style(
        'icts/how-it-works',
        [
            'name'       => 'vertical-rail',
            'label'      => __( 'Vertical Rail', 'icts-europe' ),
            'is_default' => true,
        ]
    );

    \register_block_style(
        'icts/how-it-works',
        [
            'name'  => 'horizontal-stepper',
            'label' => __( 'Horizontal Stepper', 'icts-europe' ),
        ]
    );
} );

// Editor-only CSS for better hero slider preview
\add_action( 'enqueue_block_editor_assets', function () {
	$hero_editor_style_path = get_template_directory() . '/assets/styles/blocks/hero-slider-editor.css';
    \wp_enqueue_style(
        'icts-hero-slider-editor',
        get_template_directory_uri() . '/assets/styles/blocks/hero-slider-editor.css',
        [],
        \file_exists( $hero_editor_style_path ) ? (string) \filemtime( $hero_editor_style_path ) : \wp_get_theme()->get( 'Version' )
    );

    $team_profile_style_path = get_template_directory() . '/assets/styles/blocks/team-member-profile.css';
    \wp_enqueue_style(
        'icts-team-member-profile-editor',
        get_template_directory_uri() . '/assets/styles/blocks/team-member-profile.css',
        [],
        \file_exists( $team_profile_style_path ) ? (string) \filemtime( $team_profile_style_path ) : \wp_get_theme()->get( 'Version' )
    );
} );

/**
 * Set up theme defaults and register various WordPress features.
 */
function setup() {

	// Enqueue editor styles and fonts.
	\add_editor_style( 'style.css' );

	// Load translations from the theme's languages directory.
	\load_theme_textdomain( 'icts-europe', get_template_directory() . '/languages' );

	// Remove core block patterns.
	\remove_theme_support( 'core-block-patterns' );
}
\add_action( 'after_setup_theme', __NAMESPACE__ . '\setup' );
/**
 * Enqueue styles.
 */
function enqueue_style_sheet() {
	$handle = 'icts-europe';
	wp_enqueue_style( $handle, get_stylesheet_uri(), array(), wp_get_theme()->get( 'Version' ) );
	wp_enqueue_script(
		'icts-navigation-mega-menu',
		get_template_directory_uri() . '/assets/js/navigation-mega-menu.js',
		array(),
		wp_get_theme()->get( 'Version' ),
		true
	);
	wp_enqueue_script(
		'icts-header-search-modal',
		get_template_directory_uri() . '/assets/js/header-search-modal.js',
		array(),
		wp_get_theme()->get( 'Version' ),
		true
	);
	wp_enqueue_script(
		'icts-header-language-switcher',
		get_template_directory_uri() . '/assets/js/header-language-switcher.js',
		array(),
		wp_get_theme()->get( 'Version' ),
		true
	);
}
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_style_sheet' );

/**
 * Render header search modal in front end only.
 */
function render_header_search_modal() {
	$search_block = '<!-- wp:search {"label":"Search","showLabel":false,"placeholder":"Search\u2026","buttonText":"Search","buttonUseIcon":true,"className":"icts-header-search-modal__search"} /-->';
	?>
	<div class="icts-header-search-modal" id="icts-header-search-modal" role="dialog" aria-modal="true" aria-label="Site search" hidden>
		<div class="icts-header-search-modal__backdrop" data-icts-search-close></div>
		<div class="icts-header-search-modal__panel" role="document">
			<button type="button" class="icts-header-search-modal__close" data-icts-search-close aria-label="<?php esc_attr_e( 'Close search', 'icts-europe' ); ?>">×</button>
			<?php echo do_blocks( $search_block ); ?>
		</div>
	</div>
	<?php
}
add_action( 'wp_footer', __NAMESPACE__ . '\render_header_search_modal', 20 );

/**
 * Render the header search trigger button as icon-only on the front end.
 *
 * @param string $block_content Rendered block HTML.
 * @param array  $block         Parsed block data.
 * @return string
 */
function render_header_search_trigger_button( $block_content, $block ) {
	if ( is_admin() && ! wp_doing_ajax() ) {
		return $block_content;
	}

	$class_name = '';
	if ( ! empty( $block['attrs'] ) && is_array( $block['attrs'] ) && ! empty( $block['attrs']['className'] ) ) {
		$class_name = (string) $block['attrs']['className'];
	}

	if ( '' === $class_name || false === strpos( $class_name, 'icts-site-header__search-toggle' ) ) {
		return $block_content;
	}

	$previous_libxml_state = libxml_use_internal_errors( true );
	$document              = new \DOMDocument( '1.0', 'UTF-8' );
	$loaded                = $document->loadHTML(
		'<?xml encoding="utf-8" ?><div data-icts-search-toggle-wrapper>' . $block_content . '</div>',
		LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
	);

	if ( ! $loaded ) {
		libxml_use_internal_errors( $previous_libxml_state );
		libxml_clear_errors();
		return $block_content;
	}

	$anchors = $document->getElementsByTagName( 'a' );
	if ( ! $anchors->length ) {
		libxml_use_internal_errors( $previous_libxml_state );
		libxml_clear_errors();
		return $block_content;
	}

	$anchor = $anchors->item( 0 );
	$label  = trim( wp_strip_all_tags( (string) $anchor->textContent ) );
	if ( '' === $label ) {
		$label = __( 'Search', 'icts-europe' );
	}

	while ( $anchor->firstChild ) {
		$anchor->removeChild( $anchor->firstChild );
	}
	$anchor->setAttribute( 'aria-label', $label );

	$wrapper = $document->getElementsByTagName( 'div' )->item( 0 );
	if ( ! $wrapper ) {
		libxml_use_internal_errors( $previous_libxml_state );
		libxml_clear_errors();
		return $block_content;
	}

	$output = '';
	foreach ( $wrapper->childNodes as $child_node ) {
		$output .= $document->saveHTML( $child_node );
	}

	libxml_use_internal_errors( $previous_libxml_state );
	libxml_clear_errors();

	return '' !== $output ? $output : $block_content;
}
add_filter( 'render_block_core/button', __NAMESPACE__ . '\render_header_search_trigger_button', 10, 2 );

/**
 * Render a custom front-end language switcher for Polylang.
 *
 * Keep the block in templates/editor for content management, but replace output
 * on the front end so we can fully control styling and behavior.
 *
 * @param string $block_content Rendered block HTML.
 * @param array  $block         Parsed block data.
 * @return string
 */
function render_custom_polylang_language_switcher( $block_content, $block ) {
	if ( empty( $block['blockName'] ) || 'polylang/language-switcher' !== $block['blockName'] ) {
		return $block_content;
	}

	if ( is_admin() && ! wp_doing_ajax() ) {
		return $block_content;
	}

	if ( ! function_exists( 'pll_the_languages' ) ) {
		return $block_content;
	}

	$attrs                  = ! empty( $block['attrs'] ) && is_array( $block['attrs'] ) ? $block['attrs'] : array();
	$show_names             = ! array_key_exists( 'show_names', $attrs ) || ! empty( $attrs['show_names'] );
	$hide_if_no_translation = ! empty( $attrs['hide_if_no_translation'] );
	$force_home             = ! empty( $attrs['force_home'] );
	$languages              = pll_the_languages(
		array(
			'raw'                    => 1,
			'hide_if_empty'          => 0,
			'hide_if_no_translation' => $hide_if_no_translation,
			'force_home'             => $force_home,
		)
	);

	if ( empty( $languages ) || ! is_array( $languages ) ) {
		return $block_content;
	}

	$current_language = null;
	foreach ( $languages as $language ) {
		if ( ! empty( $language['current_lang'] ) ) {
			$current_language = $language;
			break;
		}
	}

	if ( ! $current_language ) {
		$current_language = reset( $languages );
	}

	$toggle_label = __( 'Language selector', 'icts-europe' );
	$current_name = ! empty( $current_language['name'] ) ? $current_language['name'] : '';
	$current_slug = ! empty( $current_language['slug'] ) ? strtoupper( $current_language['slug'] ) : '';
	$current_text = $show_names && '' !== $current_name ? $current_name : $current_slug;

	if ( '' === $current_text ) {
		$current_text = __( 'Language', 'icts-europe' );
	}

	$menu_id = wp_unique_id( 'icts-language-switcher-menu-' );
	$classes = array( 'wp-block-polylang-language-switcher', 'icts-language-switcher' );

	if ( ! empty( $attrs['className'] ) && is_string( $attrs['className'] ) ) {
		foreach ( preg_split( '/\s+/', $attrs['className'] ) as $class_name ) {
			$sanitized = sanitize_html_class( $class_name );
			if ( '' !== $sanitized ) {
				$classes[] = $sanitized;
			}
		}
	}

	$items_html = '';
	foreach ( $languages as $language ) {
		if ( ! is_array( $language ) ) {
			continue;
		}

		$name       = ! empty( $language['name'] ) ? $language['name'] : '';
		$slug       = ! empty( $language['slug'] ) ? strtoupper( $language['slug'] ) : '';
		$item_text  = $show_names && '' !== $name ? $name : $slug;
		$is_current = ! empty( $language['current_lang'] );
		$url        = ! empty( $language['url'] ) ? $language['url'] : '';

		if ( '' === trim( $item_text ) ) {
			continue;
		}

		$item_inner = '<span class="icts-language-switcher__item-label">' . esc_html( $item_text ) . '</span>';

		if ( $is_current || '' === $url ) {
			$items_html .= '<li role="none" class="icts-language-switcher__item' . ( $is_current ? ' is-current' : '' ) . '">';
			$items_html .= '<span class="icts-language-switcher__item-link is-current" role="menuitemradio" aria-checked="' . ( $is_current ? 'true' : 'false' ) . '">' . $item_inner . '</span>';
			$items_html .= '</li>';
			continue;
		}

		$items_html .= '<li role="none" class="icts-language-switcher__item' . ( $is_current ? ' is-current' : '' ) . '">';
		$items_html .= '<a class="icts-language-switcher__item-link" role="menuitemradio" aria-checked="false" href="' . esc_url( $url ) . '">' . $item_inner . '</a>';
		$items_html .= '</li>';
	}

	if ( '' === $items_html ) {
		return $block_content;
	}

	$output = '<div class="' . esc_attr( implode( ' ', array_unique( $classes ) ) ) . '" data-icts-language-switcher>';
	$output .= '<button type="button" class="icts-language-switcher__toggle" aria-haspopup="menu" aria-expanded="false" aria-controls="' . esc_attr( $menu_id ) . '" aria-label="' . esc_attr( $toggle_label ) . '">';
	$output .= '<span class="icts-language-switcher__label">' . esc_html( $current_text ) . '</span>';
	$output .= '<span class="icts-language-switcher__chevron" aria-hidden="true"></span>';
	$output .= '</button>';
	$output .= '<ul class="icts-language-switcher__menu" id="' . esc_attr( $menu_id ) . '" role="menu" hidden>';
	$output .= $items_html;
	$output .= '</ul>';
	$output .= '</div>';

	return $output;
}
add_filter( 'render_block', __NAMESPACE__ . '\render_custom_polylang_language_switcher', 10, 2 );


/**
 * Add block style variations.
 */
function register_block_styles() {

	$block_styles = array(
		'core/list'         => array(
			'list-check'        => __( 'Check', 'icts-europe' ),
			'list-check-circle' => __( 'Check Circle', 'icts-europe' ),
			'list-boxed'        => __( 'Boxed', 'icts-europe' ),
		),
		'core/code'         => array(
			'dark-code' => __( 'Dark', 'icts-europe' ),
		),
		'core/cover'        => array(
			'blur-image-less' => __( 'Blur Image Less', 'icts-europe' ),
			'blur-image-more' => __( 'Blur Image More', 'icts-europe' ),
			'rounded-cover'   => __( 'Rounded', 'icts-europe' ),
		),
		'core/column'       => array(
			'column-box-shadow' => __( 'Box Shadow', 'icts-europe' ),
		),
		'core/post-excerpt' => array(
			'excerpt-truncate-2' => __( 'Truncate 2 Lines', 'icts-europe' ),
			'excerpt-truncate-3' => __( 'Truncate 3 Lines', 'icts-europe' ),
			'excerpt-truncate-4' => __( 'Truncate 4 Lines', 'icts-europe' ),
		),
		'core/group'        => array(
			'column-box-shadow' => __( 'Box Shadow', 'icts-europe' ),
			'background-blur'   => __( 'Background Blur', 'icts-europe' ),
		),
		'core/separator'    => array(
			'separator-dotted' => __( 'Dotted', 'icts-europe' ),
			'separator-thin'   => __( 'Thin', 'icts-europe' ),
		),
		'core/image'        => array(
			'rounded-full' => __( 'Rounded Full', 'icts-europe' ),
			'media-boxed'  => __( 'Boxed', 'icts-europe' ),
		),
		'core/preformatted' => array(
			'preformatted-dark' => __( 'Dark Style', 'icts-europe' ),
		),
		'core/post-terms'   => array(
			'term-button' => __( 'Button Style', 'icts-europe' ),
		),
		'core/video'        => array(
			'media-boxed' => __( 'Boxed', 'icts-europe' ),
		),
	);

	foreach ( $block_styles as $block => $styles ) {
		foreach ( $styles as $style_name => $style_label ) {
			register_block_style(
				$block,
				array(
					'name'  => $style_name,
					'label' => $style_label,
				)
			);
		}
	}
}
add_action( 'init', __NAMESPACE__ . '\register_block_styles' );


/**
 * Load custom block styles only when the block is used.
 */
function enqueue_custom_block_styles() {

	// Scan our styles folder to locate block styles.
	$files = glob( get_template_directory() . '/assets/styles/*.css' );

	foreach ( $files as $file ) {

		// Get the filename and core block name.
		$filename   = basename( $file, '.css' );
		$block_name = str_replace( 'core-', 'core/', $filename );

		wp_enqueue_block_style(
			$block_name,
			array(
				'handle' => "icts-europe-block-{$filename}",
				'src'    => get_theme_file_uri( "assets/styles/{$filename}.css" ),
				'path'   => get_theme_file_path( "assets/styles/{$filename}.css" ),
			)
		);
	}
}
add_action( 'init', __NAMESPACE__ . '\enqueue_custom_block_styles' );


/**
 * Enqueue WooCommerce specific stylesheet
 */
function enqueue_woocommerce_styles() {

	// Only enqueue if WooCommerce is active
	if ( class_exists( 'WooCommerce' ) ) {
		wp_enqueue_style(
			'theme-woocommerce-style',
			get_template_directory_uri() . '/assets/styles/woocommerce.css',
			array(),
			'1.0.0'
		);
	}
}
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_woocommerce_styles' );

/**
 * Enqueue counter assets globally so recovered/static pattern markup still animates.
 */
function enqueue_counter_assets() {
	$theme_dir  = get_template_directory();
	$theme_uri  = get_template_directory_uri();
	$theme_ver  = wp_get_theme()->get( 'Version' );
	$style_path = '/assets/styles/blocks/counter.css';
	$script_path = '/assets/js/counter.js';
	$style_abs  = $theme_dir . $style_path;
	$script_abs = $theme_dir . $script_path;

	wp_enqueue_style(
		'icts-counter-block',
		$theme_uri . $style_path,
		[],
		file_exists( $style_abs ) ? (string) filemtime( $style_abs ) : $theme_ver
	);

	wp_enqueue_script(
		'icts-counter-block-script',
		$theme_uri . $script_path,
		[],
		file_exists( $script_abs ) ? (string) filemtime( $script_abs ) : $theme_ver,
		true
	);
}
add_action( 'enqueue_block_assets', __NAMESPACE__ . '\enqueue_counter_assets', 20 );


/**
 * Register pattern categories.
 */
function pattern_categories() {

	$block_pattern_categories = array(
		'icts-europe/card'           => array(
			'label' => __( 'Cards', 'icts-europe' ),
		),
		'icts-europe/call-to-action' => array(
			'label' => __( 'Call To Action', 'icts-europe' ),
		),
		'icts-europe/features'       => array(
			'label' => __( 'Features', 'icts-europe' ),
		),
		'icts-europe/hero'           => array(
			'label' => __( 'Hero', 'icts-europe' ),
		),
		'icts-europe/pages'          => array(
			'label' => __( 'Pages', 'icts-europe' ),
		),
		'icts-europe/posts'          => array(
			'label' => __( 'Posts', 'icts-europe' ),
		),
		'icts-europe/pricing'        => array(
			'label' => __( 'Pricing', 'icts-europe' ),
		),
		'icts-europe/testimonial'    => array(
			'label' => __( 'Testimonials', 'icts-europe' ),
		),
		'icts-europe/menu'    => array(
			'label' => __( 'Menu', 'icts-europe' ),
		)
	);

	foreach ( $block_pattern_categories as $name => $properties ) {
		register_block_pattern_category( $name, $properties );
	}
}
add_action( 'init', __NAMESPACE__ . '\pattern_categories', 9 );

/**
 * Register fallback map patterns explicitly.
 *
 * This ensures the pattern appears in the inserter even if auto-discovery
 * doesn't pick up new files immediately in a local/editor session.
 */
function register_fallback_patterns() {
	if ( ! function_exists( 'register_block_pattern' ) || ! class_exists( '\WP_Block_Patterns_Registry' ) ) {
		return;
	}

	$registry = \WP_Block_Patterns_Registry::get_instance();
	$slug     = 'icts-europe/contact-map-static';

	if ( $registry->is_registered( $slug ) ) {
		return;
	}

	$placeholder_url = esc_url( get_template_directory_uri() . '/assets/images/contact-map-placeholder.svg' );
	$alt_text        = esc_attr__( 'Static map placeholder', 'icts-europe' );
	$map_url         = esc_url( 'https://maps.app.goo.gl/wxcWEyqnCVKFgaZs7' );

	$content = '<!-- wp:group {"metadata":{"name":"Contact Map Static"},"className":"icts-contact-map-static","layout":{"type":"constrained"}} -->
<div class="wp-block-group icts-contact-map-static"><!-- wp:image {"sizeSlug":"full","linkDestination":"custom","href":"' . $map_url . '","linkTarget":"_blank","rel":"noopener noreferrer","className":"icts-contact-map-static__image"} -->
<figure class="wp-block-image size-full icts-contact-map-static__image"><a href="' . $map_url . '" target="_blank" rel="noopener noreferrer"><img src="' . $placeholder_url . '" alt="' . $alt_text . '"/></a></figure>
<!-- /wp:image --></div>
<!-- /wp:group -->';

	register_block_pattern(
		$slug,
		[
			'title'       => __( 'Contact Map (Static)', 'icts-europe' ),
			'description' => __( 'Cookie-safe static map image with an external maps link.', 'icts-europe' ),
			'categories'  => [ 'icts-europe/call-to-action', 'icts-europe/hero' ],
			'keywords'    => [ 'map', 'contact', 'location', 'address', 'static' ],
			'inserter'    => true,
			'content'     => $content,
		]
	);
}
add_action( 'init', __NAMESPACE__ . '\register_fallback_patterns', 20 );

/**
 * Register the Counter Band pattern with explicit content.
 *
 * Fallback only: if file discovery misses the pattern in a local/editor session.
 */
function register_counter_band_pattern() {
	if ( ! function_exists( 'register_block_pattern' ) || ! class_exists( '\WP_Block_Patterns_Registry' ) ) {
		return;
	}

	$registry = \WP_Block_Patterns_Registry::get_instance();
	$slug     = 'icts-europe/counter-band';

	if ( $registry->is_registered( $slug ) ) {
		return;
	}

	$pattern_file = get_template_directory() . '/patterns/counter-band.php';
	if ( ! file_exists( $pattern_file ) ) {
		return;
	}

	ob_start();
	include $pattern_file;
	$content = trim( (string) ob_get_clean() );

	if ( '' === $content ) {
		return;
	}

	register_block_pattern(
		$slug,
		[
			'title'       => __( 'Counter Band', 'icts-europe' ),
			'description' => __( 'Full-width counter section with background image and responsive grid.', 'icts-europe' ),
			'categories'  => [ 'icts-europe/features' ],
			'keywords'    => [ 'counter', 'stats', 'metrics', 'numbers' ],
			'inserter'    => true,
			'content'     => $content,
		]
	);
}
add_action( 'init', __NAMESPACE__ . '\register_counter_band_pattern', 25 );

/**
 * Keep the inserter focused on the current counter workflow.
 */
function unregister_legacy_patterns() {
	if ( ! function_exists( 'unregister_block_pattern' ) || ! class_exists( '\WP_Block_Patterns_Registry' ) ) {
		return;
	}

	$registry = \WP_Block_Patterns_Registry::get_instance();
	$patterns = $registry->get_all_registered();

	foreach ( $patterns as $slug => $pattern ) {
		$title = isset( $pattern['title'] ) ? wp_strip_all_tags( (string) $pattern['title'] ) : '';

		if (
			'icts-europe/numbers-stacked' === $slug ||
			false !== strpos( (string) $slug, 'numbers-stacked' ) ||
			0 === strcasecmp( $title, 'Numbers Stacked' )
		) {
			unregister_block_pattern( (string) $slug );
		}
	}
}
add_action( 'init', __NAMESPACE__ . '\unregister_legacy_patterns', 30 );

/**
 * Hide legacy counter inserter entries.
 *
 * Counter cards are now intended to be added through the Counter Band pattern.
 */
function filter_allowed_block_types( $allowed_block_types, $block_editor_context ) {
	unset( $block_editor_context );

	$blocked_types = [ 'core/counter' ];

	if ( true === $allowed_block_types && class_exists( '\WP_Block_Type_Registry' ) ) {
		$all_types = array_keys( \WP_Block_Type_Registry::get_instance()->get_all_registered() );
		return array_values( array_diff( $all_types, $blocked_types ) );
	}

	if ( is_array( $allowed_block_types ) ) {
		return array_values( array_diff( $allowed_block_types, $blocked_types ) );
	}

	return $allowed_block_types;
}
add_filter( 'allowed_block_types_all', __NAMESPACE__ . '\filter_allowed_block_types', 20, 2 );


/**
 * Remove last separator on blog/archive if no pagination exists.
 */
function is_paginated() {
    global $wp_query;
    if ( $wp_query->max_num_pages < 2 ) {
        $css = '.blog .wp-block-post-template .wp-block-post:last-child .entry-content + .wp-block-separator, .archive .wp-block-post-template .wp-block-post:last-child .entry-content + .wp-block-separator, .blog .wp-block-post-template .wp-block-post:last-child .entry-content + .wp-block-separator, .search .wp-block-post-template .wp-block-post:last-child .wp-block-post-excerpt + .wp-block-separator { display: none; }';
        \wp_add_inline_style( 'icts-europe', $css );
    }
}
add_action( 'wp_head', __NAMESPACE__ . '\is_paginated' );


/**
 * Add a Sidebar template part area
 */
function template_part_areas( array $areas ) {
	$areas[] = array(
		'area'        => 'sidebar',
		'area_tag'    => 'section',
		'label'       => __( 'Sidebar', 'icts-europe' ),
		'description' => __( 'The Sidebar template defines a page area that can be found on the Page (With Sidebar) template.', 'icts-europe' ),
		'icon'        => 'sidebar',
	);

	return $areas;
}


add_filter( 'default_wp_template_part_areas', __NAMESPACE__ . '\template_part_areas' );

/**
 * Shortcode: output current year.
 */
function current_year_shortcode() {
    return esc_html( wp_date( 'Y' ) );
}

add_shortcode( 'icts_current_year', __NAMESPACE__ . '\current_year_shortcode' );

/**
 * Footer: replace hardcoded copyright year with current year.
 *
 * This targets footer copyright paragraphs that include "Site By EarlyMarketing.com"
 * so it works for both file-based and Site Editor-saved template parts.
 */
function update_footer_copyright_year( $block_content, $block ) {
    if ( ! is_string( $block_content ) || '' === $block_content ) {
        return $block_content;
    }

    if ( false === strpos( $block_content, 'Site By EarlyMarketing.com' ) ) {
        return $block_content;
    }

    $year    = wp_date( 'Y' );
    $updated = preg_replace_callback(
        '/(©\s*)(\d{4})/u',
        static function ( $matches ) use ( $year ) {
            return $matches[1] . $year;
        },
        $block_content,
        1
    );

    return is_string( $updated ) ? $updated : $block_content;
}

add_filter( 'render_block_core/paragraph', __NAMESPACE__ . '\update_footer_copyright_year', 10, 2 );

/**
 * Admin: Customers list – show a small logo next to the title.
 */
\add_filter(
    'manage_customers_posts_columns',
    function ( $columns ) {

        $new = [];

        foreach ( $columns as $key => $label ) {
            // Insert our column before the Title column so it appears as second column.
            if ( 'title' === $key ) {
                $new['customer_logo'] = __( 'Logo', 'icts-europe' );
            }

            $new[ $key ] = $label;
        }

        return $new;
    }
);

\add_action(
    'manage_customers_posts_custom_column',
    function ( $column, $post_id ) {

        if ( 'customer_logo' !== $column ) {
            return;
        }

        // ACF field on the Customers CPT.
        $logo = \get_field( 'customer_logo', $post_id );

        $image_id = 0;
        $src      = '';

        if ( \is_array( $logo ) ) {
            if ( isset( $logo['ID'] ) ) {
                $image_id = (int) $logo['ID'];
            } elseif ( isset( $logo['id'] ) ) {
                $image_id = (int) $logo['id'];
            } elseif ( isset( $logo['url'] ) ) {
                $src = esc_url( $logo['url'] );
            }
        } elseif ( \is_numeric( $logo ) ) {
            $image_id = (int) $logo;
        } elseif ( \is_string( $logo ) && '' !== $logo ) {
            $src = esc_url( $logo );
        }

        // Prefer the attachment ID when we have it.
        if ( $image_id ) {
            $thumb = \wp_get_attachment_image(
                $image_id,
                'thumbnail',
                false,
                [
                    'style' => 'max-width:60px;height:auto;display:block;margin:0 auto;',
                    'alt'   => '',
                ]
            );

            if ( $thumb ) {
                // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                echo $thumb;
                return;
            }
        }

        if ( $src ) {
            echo '<img src="' . $src . '" alt="" style="max-width:60px;height:auto;display:block;margin:0 auto;" />';
        } else {
            // Little dash so you can easily see "no logo".
            echo '<span aria-hidden="true">—</span>';
        }
    },
    10,
    2
);

\add_action(
    'admin_head-edit.php',
    function () {
        $screen = \get_current_screen();

        if ( 'edit-customers' !== $screen->id ) {
            return;
        }

        echo '<style>
            .column-customer_logo {
                width: 80px;
                text-align: center;
            }
        </style>';
    }
);

/**
 * Admin: Partners list – show featured image thumbnail.
 */
\add_filter(
    'manage_partner_posts_columns',
    function ( $columns ) {

        $new = [];

        foreach ( $columns as $key => $label ) {
            // Insert our column before the Title column so it appears as second column.
            if ( 'title' === $key ) {
                $new['partner_thumb'] = __( 'Image', 'icts-europe' );
            }

            $new[ $key ] = $label;
        }

        return $new;
    }
);

\add_action(
    'manage_partner_posts_custom_column',
    function ( $column, $post_id ) {

        if ( 'partner_thumb' !== $column ) {
            return;
        }

        $thumb_id = \get_post_thumbnail_id( $post_id );

        if ( $thumb_id ) {
            $src = \wp_get_attachment_image_url( $thumb_id, 'full' );

            if ( $src ) {
                echo '<span class="icts-admin-partner-thumb"><img src="' . esc_url( $src ) . '" alt="" loading="lazy" decoding="async" /></span>';
                return;
            }
        }

        echo '<span aria-hidden="true">—</span>';
    },
    10,
    2
);

\add_action(
    'admin_head-edit.php',
    function () {
        $screen = \get_current_screen();

        if ( 'edit-partner' !== $screen->id ) {
            return;
        }

        echo '<style>
            .column-partner_thumb {
                width: 80px;
                text-align: center;
            }
            .column-partner_thumb .icts-admin-partner-thumb {
                width: 64px;
                height: 40px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }
            .column-partner_thumb .icts-admin-partner-thumb img {
                max-width: 64px;
                max-height: 40px;
                width: auto;
                height: auto;
                object-fit: contain;
                object-position: center;
                display: block;
            }
        </style>';
    }
);

/**
 * Category term meta: brand color token for Latest News slider marker.
 */
function get_category_color_palette_choices() {
    $palette = \wp_get_global_settings( [ 'color', 'palette', 'theme' ] );

    if ( ! is_array( $palette ) || empty( $palette ) ) {
        return [];
    }

    return array_values(
        array_filter(
            $palette,
            static function ( $item ) {
                return is_array( $item ) && ! empty( $item['slug'] ) && ! empty( $item['name'] );
            }
        )
    );
}

function render_category_color_field_add() {
    $choices = get_category_color_palette_choices();
    ?>
    <div class="form-field term-icts-category-color-wrap">
        <label for="icts_category_color_slug"><?php esc_html_e( 'Marker color token', 'icts-europe' ); ?></label>
        <select name="icts_category_color_slug" id="icts_category_color_slug">
            <option value=""><?php esc_html_e( 'Default (Brand Secondary)', 'icts-europe' ); ?></option>
            <?php foreach ( $choices as $choice ) : ?>
                <option value="<?php echo esc_attr( $choice['slug'] ); ?>"><?php echo esc_html( $choice['name'] ); ?></option>
            <?php endforeach; ?>
        </select>
        <p><?php esc_html_e( 'Used by the Latest News slider category marker.', 'icts-europe' ); ?></p>
    </div>
    <?php
}

function render_category_color_field_edit( $term ) {
    $choices  = get_category_color_palette_choices();
    $selected = (string) \get_term_meta( $term->term_id, 'icts_category_color_slug', true );
    ?>
    <tr class="form-field term-icts-category-color-wrap">
        <th scope="row">
            <label for="icts_category_color_slug"><?php esc_html_e( 'Marker color token', 'icts-europe' ); ?></label>
        </th>
        <td>
            <select name="icts_category_color_slug" id="icts_category_color_slug">
                <option value=""><?php esc_html_e( 'Default (Brand Secondary)', 'icts-europe' ); ?></option>
                <?php foreach ( $choices as $choice ) : ?>
                    <option value="<?php echo esc_attr( $choice['slug'] ); ?>" <?php selected( $selected, $choice['slug'] ); ?>>
                        <?php echo esc_html( $choice['name'] ); ?>
                    </option>
                <?php endforeach; ?>
            </select>
            <p class="description"><?php esc_html_e( 'Used by the Latest News slider category marker.', 'icts-europe' ); ?></p>
        </td>
    </tr>
    <?php
}

function save_category_color_field( $term_id ) {
    if ( ! isset( $_POST['icts_category_color_slug'] ) ) {
        return;
    }

    $color_slug = sanitize_key( (string) \wp_unslash( $_POST['icts_category_color_slug'] ) );

    if ( '' === $color_slug ) {
        \delete_term_meta( $term_id, 'icts_category_color_slug' );
        return;
    }

    \update_term_meta( $term_id, 'icts_category_color_slug', $color_slug );
}

\add_action( 'category_add_form_fields', __NAMESPACE__ . '\render_category_color_field_add' );
\add_action( 'category_edit_form_fields', __NAMESPACE__ . '\render_category_color_field_edit' );
\add_action( 'created_category', __NAMESPACE__ . '\save_category_color_field' );
\add_action( 'edited_category', __NAMESPACE__ . '\save_category_color_field' );
// Polylang: Register Team Member archive slug for translation.
\add_action( 'init', function () {
    if ( \function_exists( 'pll_register_string' ) ) {
        \pll_register_string(
            'team_member_archive_slug',
            'management-team',
            'CPT Archives'
        );

        \pll_register_string(
            'team_member_archive_title',
            'Management Team',
            'CPT Archives'
        );

        \pll_register_string(
            'management_team_page_heading',
            'Meet our Executive and Management Teams',
            'Theme: Team Member'
        );

        \pll_register_string(
            'team_member_sidebar_title',
            'Leadership Team',
            'Theme: Team Member'
        );

        \pll_register_string(
            'team_member_sidebar_aria',
            'Other team members',
            'Theme: Team Member'
        );

        \pll_register_string(
            'team_member_sidebar_empty',
            'No other team members found.',
            'Theme: Team Member'
        );

        \pll_register_string(
            'team_member_linkedin_label',
            'LinkedIn',
            'Theme: Team Member'
        );

        \pll_register_string(
            'team_member_linkedin_aria',
            'Visit %s on LinkedIn',
            'Theme: Team Member'
        );

        \pll_register_string(
            'faq_block_heading_default',
            'FAQs',
            'Theme: FAQ'
        );

        \pll_register_string(
            'faq_block_empty_preview',
            'No FAQs found. Add FAQ posts to populate this block.',
            'Theme: FAQ'
        );
    }
} 
);

/**
 * Return localized archive title label for the Team Member CPT.
 *
 * @return string
 */
function get_team_member_archive_title_label() {
    $label = \__( 'Management Team', 'icts-europe' );

    if ( \function_exists( 'pll__' ) ) {
        $translated = \pll__( $label );
        if ( \is_string( $translated ) && '' !== \trim( $translated ) ) {
            $label = $translated;
        }
    }

    return $label;
}

/**
 * Return localized H1 label for Team Member archive page heading.
 *
 * @return string
 */
function get_team_member_archive_page_heading_label() {
    $label = \__( 'Meet our Executive and Management Teams', 'icts-europe' );

    if ( \function_exists( 'pll__' ) ) {
        $translated = \pll__( $label );
        if ( \is_string( $translated ) && '' !== \trim( $translated ) ) {
            $label = $translated;
        }
    }

    return $label;
}

/**
 * Remove "Archive" from Yoast titles for Team Member archive pages.
 *
 * @param string $title Current SEO title.
 * @return string
 */
function filter_team_member_archive_yoast_title( $title ) {
    if ( ! \is_post_type_archive( 'team-member' ) ) {
        return $title;
    }

    $site_name = \wp_specialchars_decode( \get_bloginfo( 'name' ), \ENT_QUOTES );
    $label     = get_team_member_archive_title_label();

    return \sprintf( '%1$s - %2$s', $label, $site_name );
}
add_filter( 'wpseo_title', __NAMESPACE__ . '\filter_team_member_archive_yoast_title' );
add_filter( 'wpseo_opengraph_title', __NAMESPACE__ . '\filter_team_member_archive_yoast_title' );
add_filter( 'wpseo_twitter_title', __NAMESPACE__ . '\filter_team_member_archive_yoast_title' );

/**
 * Keep Yoast CollectionPage schema title in sync with filtered archive title.
 *
 * @param array $data Schema node data.
 * @return array
 */
function filter_team_member_archive_yoast_schema_name( $data ) {
    if ( ! \is_post_type_archive( 'team-member' ) || ! \is_array( $data ) ) {
        return $data;
    }

    $site_name    = \wp_specialchars_decode( \get_bloginfo( 'name' ), \ENT_QUOTES );
    $archive_name = \sprintf( '%1$s - %2$s', get_team_member_archive_title_label(), $site_name );

    $data['name'] = $archive_name;

    return $data;
}
add_filter( 'wpseo_schema_webpage', __NAMESPACE__ . '\filter_team_member_archive_yoast_schema_name', 10, 1 );

/**
 * Replace Team Member archive H1 block text with a translatable Polylang string.
 *
 * @param string $block_content Rendered block HTML.
 * @param array  $block         Parsed block data.
 * @return string
 */
function filter_team_member_archive_heading( $block_content, $block ) {
    if ( ! \is_post_type_archive( 'team-member' ) ) {
        return $block_content;
    }

    if ( empty( $block['attrs'] ) || ! \is_array( $block['attrs'] ) ) {
        return $block_content;
    }

    $level = isset( $block['attrs']['level'] ) ? (int) $block['attrs']['level'] : 2;
    if ( 1 !== $level ) {
        return $block_content;
    }

    $default_heading = 'Meet our Executive and Management Teams';
    if ( false === \strpos( \wp_strip_all_tags( $block_content ), $default_heading ) ) {
        return $block_content;
    }

    $replacement_heading = get_team_member_archive_page_heading_label();

    $previous_libxml_state = \libxml_use_internal_errors( true );
    $document              = new \DOMDocument( '1.0', 'UTF-8' );
    $loaded                = $document->loadHTML(
        '<?xml encoding="utf-8" ?><div data-icts-team-heading-wrapper>' . $block_content . '</div>',
        \LIBXML_HTML_NOIMPLIED | \LIBXML_HTML_NODEFDTD
    );

    if ( ! $loaded ) {
        \libxml_use_internal_errors( $previous_libxml_state );
        \libxml_clear_errors();
        return $block_content;
    }

    $wrapper = $document->getElementsByTagName( 'div' )->item( 0 );
    $heading = $document->getElementsByTagName( 'h1' )->item( 0 );

    if ( ! $wrapper || ! $heading ) {
        \libxml_use_internal_errors( $previous_libxml_state );
        \libxml_clear_errors();
        return $block_content;
    }

    while ( $heading->firstChild ) {
        $heading->removeChild( $heading->firstChild );
    }
    $heading->appendChild( $document->createTextNode( $replacement_heading ) );

    $output = '';
    foreach ( $wrapper->childNodes as $child_node ) {
        $output .= $document->saveHTML( $child_node );
    }

    \libxml_use_internal_errors( $previous_libxml_state );
    \libxml_clear_errors();

    return '' !== $output ? $output : $block_content;
}
add_filter( 'render_block_core/heading', __NAMESPACE__ . '\filter_team_member_archive_heading', 10, 2 );

\add_filter( 'register_post_type_args', function ( $args, $post_type ) {

    if ( 'team-member' !== $post_type ) {
        return $args;
    }

    if ( \function_exists( 'pll__' ) ) {
        $args['has_archive'] = \pll__( 'management-team' );
        $args['rewrite'] = [
            'slug'       => \pll__( 'management-team' ),
            'with_front' => true,
        ];
    }

    return $args;
}, 10, 2 );

/**
 * Admin: Team Member list – show a small portrait next to the title.
 */
\add_filter(
    'manage_team-member_posts_columns',
    function ( $columns ) {

        $new = [];

        foreach ( $columns as $key => $label ) {
            // Insert our column before the Title column so it appears as second column.
            if ( 'title' === $key ) {
                $new['team_photo'] = __( 'Photo', 'icts-europe' );
            }

            $new[ $key ] = $label;
        }

        return $new;
    }
);

\add_action(
    'manage_team-member_posts_custom_column',
    function ( $column, $post_id ) {

        if ( 'team_photo' !== $column ) {
            return;
        }

        $thumb = \get_the_post_thumbnail(
            $post_id,
            'thumbnail',
            [
                'style' => 'max-width:60px;height:auto;display:block;margin:0 auto;border-radius:4px;',
                'alt'   => '',
            ]
        );

        if ( $thumb ) {
            // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
            echo $thumb;
        } else {
            echo '<span aria-hidden="true">—</span>';
        }
    },
    10,
    2
);

namespace ICTS_Europe;


/**
 * When a Team Member in the default language is saved,
 * propagate its featured image to translations that don't have one.
 */
\add_action(
    'save_post_team-member',
    function ( $post_id, $post, $update ) {

        // Avoid autosaves / revisions.
        if ( \wp_is_post_autosave( $post_id ) || \wp_is_post_revision( $post_id ) ) {
            return;
        }

        if ( ! \function_exists( 'pll_get_post_language' ) || ! \function_exists( 'pll_get_post_translations' ) ) {
            return;
        }

        $default_lang = \pll_default_language();
        $post_lang    = \pll_get_post_language( $post_id );

        // Only act on the default language version.
        if ( $post_lang !== $default_lang ) {
            return;
        }

        $thumb_id = \get_post_thumbnail_id( $post_id );
        if ( ! $thumb_id ) {
            return;
        }

        $translations = \pll_get_post_translations( $post_id );
        if ( empty( $translations ) || ! \is_array( $translations ) ) {
            return;
        }

        foreach ( $translations as $lang => $tr_id ) {
            $tr_id = (int) $tr_id;

            if ( $lang === $default_lang ) {
                continue;
            }

            // Only set if the translation has no image yet.
            if ( \has_post_thumbnail( $tr_id ) ) {
                continue;
            }

            \set_post_thumbnail( $tr_id, $thumb_id );
        }
    },
    10,
    3
);

/**
 * When FAQ filter taxonomies are updated on any translation, mirror that taxonomy
 * to all linked FAQ translations.
 */
\add_action(
	'set_object_terms',
	function ( $object_id, $terms, $tt_ids, $taxonomy, $append, $old_tt_ids ) {

		static $is_syncing = false;

		if ( $is_syncing ) {
			return;
		}

		$object_id = (int) $object_id;
		if ( $object_id <= 0 ) {
			return;
		}

		if ( ! \in_array( $taxonomy, [ 'product', 'customer-type' ], true ) ) {
			return;
		}

		if ( \get_post_type( $object_id ) !== 'faq' ) {
			return;
		}

		if ( ! \function_exists( 'pll_get_post_translations' ) ) {
			return;
		}

		$translations = \pll_get_post_translations( $object_id );
		if ( empty( $translations ) || ! \is_array( $translations ) ) {
			return;
		}

		$source_term_ids = \wp_get_object_terms(
			$object_id,
			$taxonomy,
			[
				'fields' => 'ids',
			]
		);

		if ( \is_wp_error( $source_term_ids ) ) {
			return;
		}

		$is_syncing = true;

		foreach ( $translations as $translated_post_id ) {
			$translated_post_id = (int) $translated_post_id;

			if ( $translated_post_id <= 0 || $translated_post_id === $object_id ) {
				continue;
			}

			\wp_set_object_terms( $translated_post_id, $source_term_ids, $taxonomy, false );
		}

		$is_syncing = false;
	},
	20,
	6
);

/**
 * Ensure newly created/updated FAQ translations inherit synced filter taxonomies.
 * This covers Polylang/DeepL translation creation where no manual term edit occurs.
 */
\add_action(
	'pll_save_post',
	function ( $post_id, $post, $translations ) {

		static $is_syncing = false;

		if ( $is_syncing ) {
			return;
		}

		$post_id = (int) $post_id;
		if ( $post_id <= 0 || \get_post_type( $post_id ) !== 'faq' ) {
			return;
		}

		if ( empty( $translations ) || ! \is_array( $translations ) ) {
			return;
		}

		$taxonomies_to_sync = [ 'product', 'customer-type' ];
		$source_post_id     = $post_id;

		if ( \function_exists( 'pll_default_language' ) ) {
			$default_lang = (string) \pll_default_language();
			if ( $default_lang && ! empty( $translations[ $default_lang ] ) ) {
				$default_post_id = (int) $translations[ $default_lang ];
				if ( $default_post_id > 0 && \get_post_type( $default_post_id ) === 'faq' ) {
					$source_post_id = $default_post_id;
				}
			}
		}

		$is_syncing = true;

		foreach ( $taxonomies_to_sync as $taxonomy ) {
			if ( ! \taxonomy_exists( $taxonomy ) || ! \is_object_in_taxonomy( 'faq', $taxonomy ) ) {
				continue;
			}

			$source_term_ids = \wp_get_object_terms(
				$source_post_id,
				$taxonomy,
				[
					'fields' => 'ids',
				]
			);

			if ( \is_wp_error( $source_term_ids ) ) {
				continue;
			}

			foreach ( $translations as $translated_post_id ) {
				$translated_post_id = (int) $translated_post_id;

				if ( $translated_post_id <= 0 || $translated_post_id === $source_post_id ) {
					continue;
				}

				\wp_set_object_terms( $translated_post_id, $source_term_ids, $taxonomy, false );
			}
		}

		$is_syncing = false;
	},
	20,
	3
);
