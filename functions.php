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
} );

// Editor-only CSS for better hero slider preview
\add_action( 'enqueue_block_editor_assets', function () {
    \wp_enqueue_style(
        'icts-hero-slider-editor',
        get_template_directory_uri() . '/assets/styles/blocks/hero-slider-editor.css',
        [],
        \wp_get_theme()->get( 'Version' )
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
// Polylang: Register Team Member archive slug for translation.
\add_action( 'init', function () {
    if ( \function_exists( 'pll_register_string' ) ) {
        \pll_register_string(
            'team_member_archive_slug',
            'management-team',
            'CPT Archives'
        );
    }
} 
);

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
