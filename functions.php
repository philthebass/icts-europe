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

/**
 * Set up theme defaults and register various WordPress features.
 */
function setup() {

	// Enqueue editor styles and fonts.
	\add_editor_style( 'style.css' );

	// Remove core block patterns.
	\remove_theme_support( 'core-block-patterns' );
}
\add_action( 'after_setup_theme', __NAMESPACE__ . '\setup' );
/**
 * Enqueue styles.
 */
function enqueue_style_sheet() {
	wp_enqueue_style( sanitize_title( __NAMESPACE__ ), get_template_directory_uri() . '/style.css', array(), wp_get_theme()->get( 'Version' ) );
}
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_style_sheet' );


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
		echo '<style>.blog .wp-block-post-template .wp-block-post:last-child .entry-content + .wp-block-separator, .archive .wp-block-post-template .wp-block-post:last-child .entry-content + .wp-block-separator, .blog .wp-block-post-template .wp-block-post:last-child .entry-content + .wp-block-separator, .search .wp-block-post-template .wp-block-post:last-child .wp-block-post-excerpt + .wp-block-separator { display: none; }</style>';
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
