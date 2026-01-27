<?php
/**
 * Team Member Profile ACF block template.
 *
 * @param array  $block      The block settings and attributes.
 * @param string $content    The block inner HTML (empty here).
 * @param bool   $is_preview Whether this is shown in the editor preview.
 * @param int    $post_id    The post ID this block is saved to (not used here).
 */

// Determine which post to render.
$profile_post_id = 0;

if ( ! empty( $block['context']['postId'] ) ) {
	// When the editor provides context (e.g. on single post view).
	$profile_post_id = (int) $block['context']['postId'];
} elseif ( ! empty( $post_id ) ) {
	// When the block is used directly on a post/page.
	$profile_post_id = (int) $post_id;
} else {
	// Front end on a single post should have a global post.
	$profile_post_id = get_the_ID();
}

// If we still don't have a post in the editor, pick a sample Team Member.
if ( ! $profile_post_id && $is_preview ) {
	$preview_query = new \WP_Query(
		[
			'post_type'      => 'team-member', // <-- your CPT key
			'posts_per_page' => 1,
		]
	);

	if ( $preview_query->have_posts() ) {
		$preview_query->the_post();
		$profile_post_id = get_the_ID();
		\wp_reset_postdata();
	}
}

// If we *still* don't have anything, bail (shouldn't happen on front end).
if ( ! $profile_post_id ) {
	return;
}

$title = get_the_title( $profile_post_id );

// ACF fields.
$job_title = function_exists( 'get_field' ) ? get_field( 'job_title', $profile_post_id ) : '';
$linkedin  = function_exists( 'get_field' ) ? get_field( 'linkedin_profile', $profile_post_id ) : '';
$bio       = function_exists( 'get_field' ) ? get_field( 'biog', $profile_post_id ) : '';

// Featured image as portrait.
$portrait = get_the_post_thumbnail(
	$profile_post_id,
	'large',
	[
		'class'   => 'team-member-profile__image',
		'loading' => 'lazy',
	]
);
?>

<article <?php post_class( 'team-member-profile', $profile_post_id ); ?>>
	<div class="team-member-profile__inner">
		<?php if ( $portrait ) : ?>
			<div class="team-member-profile__media">
				<?php echo $portrait; ?>
			</div>
		<?php endif; ?>

		<div class="team-member-profile__content">
			<header class="team-member-profile__header">
				<h1 class="team-member-profile__name">
					<?php echo esc_html( $title ); ?>
				</h1>

				<?php if ( $job_title ) : ?>
					<p class="team-member-profile__role">
						<?php echo esc_html( $job_title ); ?>
					</p>
				<?php endif; ?>

				<?php if ( $linkedin ) : ?>
					<p class="team-member-profile__linkedin">
						<a href="<?php echo esc_url( $linkedin ); ?>" target="_blank" rel="noopener">
							<?php esc_html_e( 'LinkedIn', 'icts-europe' ); ?>
						</a>
					</p>
				<?php endif; ?>
			</header>

			<?php if ( $bio ) : ?>
				<div class="team-member-profile__bio">
					<?php echo wp_kses_post( wpautop( $bio ) ); ?>
				</div>
			<?php endif; ?>
		</div>
	</div>
</article>