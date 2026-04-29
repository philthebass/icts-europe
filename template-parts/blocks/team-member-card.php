<?php
/**
 * Team Member Card ACF block template.
 *
 * @param array  $block      The block settings and attributes.
 * @param string $content    The block inner HTML (empty here).
 * @param bool   $is_preview Whether this is shown in the editor preview.
 * @param int    $post_id    The post ID this block is saved to (not used here).
 */

// Work out which post we should render.
// Inside a Query Loop, WordPress passes the current post ID via block context.
$loop_post_id = 0;

if ( ! empty( $block['context']['postId'] ) ) {
    $loop_post_id = (int) $block['context']['postId'];
} elseif ( ! empty( $post_id ) ) {
    $loop_post_id = (int) $post_id;
} else {
    $loop_post_id = get_the_ID();
}

if ( ! $loop_post_id ) {
    return;
}

// OPTIONAL: if you want to be strict later, you can re-enable this
// *after* you confirm the CPT slug is correct.
// For now, keep it commented out so it cannot block output.
// if ( get_post_type( $loop_post_id ) !== 'team-member' ) {
//     return;
// }

$title     = get_the_title( $loop_post_id );
$permalink = get_permalink( $loop_post_id );

// Job title from ACF (field name: job_title).
$job_title = function_exists( 'get_field' ) ? get_field( 'job_title', $loop_post_id ) : '';
$biog      = function_exists( 'get_field' ) ? get_field( 'biog', $loop_post_id ) : '';

$biog_text         = '';
$biog_is_truncated = false;

if ( is_string( $biog ) && '' !== trim( $biog ) ) {
	$biog_plain = trim( preg_replace( '/\s+/u', ' ', wp_strip_all_tags( $biog ) ) );

	if ( '' !== $biog_plain ) {
		$max_length = 210;
		if ( mb_strlen( $biog_plain ) > $max_length ) {
			$biog_text = mb_substr( $biog_plain, 0, $max_length );
			$biog_text = preg_replace( '/\s+\S*$/u', '', $biog_text );
			$biog_text = rtrim( (string) $biog_text, " \t\n\r\0\x0B.,;:!?" );
			$biog_is_truncated = true;
		} else {
			$biog_text = $biog_plain;
		}
	}
}

// Portrait from featured image.
$portrait = get_the_post_thumbnail(
    $loop_post_id,
    'medium',
    [
        'class'   => 'team-member-card__image',
        'loading' => 'lazy',
    ]
);
?>

<article <?php post_class( 'team-member-card', $loop_post_id ); ?>>
	    <?php if ( $portrait ) : ?>
	        <a href="<?php echo esc_url( $permalink ); ?>" class="team-member-card__image-link">
	            <?php echo $portrait; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- WordPress core generates post thumbnail markup. ?>
	            <span class="team-member-card__image-button wp-element-button" aria-hidden="true">
	                <?php echo esc_html( \ICTS_Europe\get_team_member_card_view_profile_label() ); ?>
	            </span>
        </a>
    <?php endif; ?>

    <div class="team-member-card__body">
        <h3 class="team-member-card__name">
            <a href="<?php echo esc_url( $permalink ); ?>">
                <?php echo esc_html( $title ); ?>
            </a>
        </h3>

        <?php if ( $job_title ) : ?>
            <p class="team-member-card__role">
                <?php echo esc_html( $job_title ); ?>
            </p>
        <?php endif; ?>

        <?php if ( $biog_text ) : ?>
            <p class="team-member-card__bio">
                <?php echo esc_html( $biog_text ); ?>
                <?php if ( $biog_is_truncated ) : ?>
                    … <a href="<?php echo esc_url( $permalink ); ?>" class="team-member-card__read-more"><?php echo esc_html( \ICTS_Europe\get_team_member_card_read_more_label() ); ?></a>
                <?php endif; ?>
            </p>
        <?php endif; ?>

        <a href="<?php echo esc_url( $permalink ); ?>" class="team-member-card__button wp-element-button">
            <?php echo esc_html( \ICTS_Europe\get_team_member_card_view_profile_label() ); ?>
        </a>
    </div>
</article>
