<?php
/**
 * Render a news card for the current Query Loop post.
 *
 * @package icts-europe
 */

if ( ! defined( 'ABSPATH' ) || empty( $block->context['postId'] ) ) {
	return;
}
?>
<article <?php echo get_block_wrapper_attributes(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php
	get_template_part(
		'parts/news-card',
		null,
		[
			'post_id'     => $block->context['postId'],
			'show_author' => true,
			'show_date'   => true,
		]
	);
	?>
</article>
