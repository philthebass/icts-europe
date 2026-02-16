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
$linkedin  = is_string( $linkedin ) ? trim( $linkedin ) : '';

$sidebar_aria_label = __( 'Other team members', 'icts-europe' );
$sidebar_title      = __( 'Leadership Team', 'icts-europe' );
$sidebar_empty      = __( 'No other team members found.', 'icts-europe' );
$linkedin_label     = __( 'LinkedIn', 'icts-europe' );
$linkedin_aria      = __( 'Visit %s on LinkedIn', 'icts-europe' );

if ( function_exists( 'pll__' ) ) {
	$sidebar_aria_label = pll__( $sidebar_aria_label );
	$sidebar_title      = pll__( $sidebar_title );
	$sidebar_empty      = pll__( $sidebar_empty );
	$linkedin_label     = pll__( $linkedin_label );
	$linkedin_aria      = pll__( $linkedin_aria );
}

$other_team_members = new \WP_Query(
	[
		'post_type'           => 'team-member',
		'post_status'         => 'publish',
		'posts_per_page'      => -1,
		'post__not_in'        => [ $profile_post_id ],
		'orderby'             => [
			'menu_order' => 'ASC',
			'title'      => 'ASC',
		],
		'order'               => 'ASC',
		'no_found_rows'       => true,
		'ignore_sticky_posts' => true,
	]
);

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
	<div class="team-member-profile__layout">
		<div class="team-member-profile__main">
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
								<a
									class="team-member-profile__linkedin-link"
									href="<?php echo esc_url( $linkedin ); ?>"
									target="_blank"
									rel="noopener"
									aria-label="<?php echo esc_attr( sprintf( $linkedin_aria, $title ) ); ?>"
								>
									<svg class="team-member-profile__linkedin-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
										<path d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003zM7.119 20.452H3.555V9h3.564v11.452zM5.337 7.433a2.064 2.064 0 1 1 0-4.128 2.064 2.064 0 0 1 0 4.128zM20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286z" />
									</svg>
									<span class="screen-reader-text"><?php echo esc_html( $linkedin_label ); ?></span>
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
		</div>

		<aside class="team-member-profile__sidebar" aria-label="<?php echo esc_attr( $sidebar_aria_label ); ?>">
			<h2 class="team-member-profile__sidebar-title">
				<?php echo esc_html( $sidebar_title ); ?>
			</h2>

			<?php if ( $other_team_members->have_posts() ) : ?>
				<ul class="team-member-profile__sidebar-list">
					<?php
						while ( $other_team_members->have_posts() ) :
							$other_team_members->the_post();
							$other_member_id  = get_the_ID();
							$other_member_url = get_permalink( $other_member_id );
							$other_member_job = function_exists( 'get_field' ) ? get_field( 'job_title', $other_member_id ) : '';
							$other_member_img = get_the_post_thumbnail(
								$other_member_id,
								'thumbnail',
								[
									'class'   => 'team-member-profile__sidebar-image',
									'loading' => 'lazy',
								]
							);
							?>
							<li class="team-member-profile__sidebar-item">
								<div class="team-member-profile__sidebar-member">
									<?php if ( $other_member_img ) : ?>
										<a class="team-member-profile__sidebar-image-link" href="<?php echo esc_url( $other_member_url ); ?>">
											<?php echo $other_member_img; ?>
										</a>
									<?php endif; ?>

									<div class="team-member-profile__sidebar-member-text">
										<a class="team-member-profile__sidebar-link" href="<?php echo esc_url( $other_member_url ); ?>">
											<?php echo esc_html( get_the_title( $other_member_id ) ); ?>
										</a>
										<?php if ( $other_member_job ) : ?>
											<p class="team-member-profile__sidebar-role"><?php echo esc_html( $other_member_job ); ?></p>
										<?php endif; ?>
									</div>
								</div>
							</li>
						<?php endwhile; ?>
				</ul>
			<?php else : ?>
				<p class="team-member-profile__sidebar-empty">
					<?php echo esc_html( $sidebar_empty ); ?>
				</p>
			<?php endif; ?>
		</aside>
	</div>
</article>
<?php wp_reset_postdata(); ?>
