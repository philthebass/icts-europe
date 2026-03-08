<?php
/**
 * Title: ICTS Card
 * Slug: icts-europe/icts-card
 * Description: Reusable industry card with aligned title, text and button.
 * Categories: icts-europe/card
 * Keywords: card, industry, image, button
 * Viewport Width: 600
 * Inserter: true
 */
?>
<!-- wp:group {"className":"icts-card","style":{"border":{"radius":"6px"},"spacing":{"blockGap":"0","padding":{"top":"0","right":"0","bottom":"0","left":"0"}}},"backgroundColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group icts-card has-base-background-color has-background" style="border-radius:6px;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><!-- wp:image {"sizeSlug":"full","linkDestination":"none","aspectRatio":"16/9","scale":"cover","style":{"spacing":{"margin":{"bottom":"0"}},"border":{"radius":{"topLeft":"6px","topRight":"6px","bottomLeft":"0px","bottomRight":"0px"}}}} -->
<figure class="wp-block-image size-full has-custom-border" style="margin-bottom:0"><img src="<?php echo esc_url( get_template_directory_uri() ); ?>/patterns/images/computer-hands.webp" alt="<?php esc_attr_e( 'Card image placeholder', 'icts-europe' ); ?>" style="aspect-ratio:16/9;object-fit:cover;border-top-left-radius:6px;border-top-right-radius:6px;border-bottom-left-radius:0px;border-bottom-right-radius:0px"/></figure>
<!-- /wp:image -->

<!-- wp:group {"className":"icts-card__body","style":{"spacing":{"blockGap":"var:preset|spacing|small","padding":{"top":"var:preset|spacing|small","right":"var:preset|spacing|small","bottom":"var:preset|spacing|small","left":"var:preset|spacing|small"}}},"textColor":"near-black","layout":{"type":"constrained"}} -->
<div class="wp-block-group icts-card__body has-near-black-color has-text-color" style="padding-top:var(--wp--preset--spacing--small);padding-right:var(--wp--preset--spacing--small);padding-bottom:var(--wp--preset--spacing--small);padding-left:var(--wp--preset--spacing--small)"><!-- wp:paragraph {"style":{"typography":{"fontStyle":"normal","fontWeight":"600"}},"textColor":"brand-primary","fontSize":"medium"} -->
<p class="has-brand-primary-color has-text-color has-medium-font-size" style="font-style:normal;font-weight:600"><?php esc_html_e( 'Airlines', 'icts-europe' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><?php esc_html_e( 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in tristique est. Proin pellentesque posuere cursus. Ut commodo elementum semper. In facilisis sollicitudin nulla vel.', 'icts-europe' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:buttons {"className":"icts-card__buttons","style":{"spacing":{"margin":{"top":"var:preset|spacing|small"}}},"layout":{"type":"flex","justifyContent":"left"}} -->
<div class="wp-block-buttons icts-card__buttons" style="margin-top:var(--wp--preset--spacing--small)"><!-- wp:button {"width":100} -->
<div class="wp-block-button has-custom-width wp-block-button__width-100"><a class="wp-block-button__link wp-element-button"><?php esc_html_e( 'Learn More', 'icts-europe' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
