<?php
/**
 * Title: Contact Map (Static)
 * Slug: icts-europe/contact-map-static
 * Description: Cookie-safe static map image with an external maps link.
 * Categories: icts-europe/call-to-action, icts-europe/hero
 * Keywords: map, contact, location, address, static
 * Viewport Width: 600
 * Inserter: true
 */
?>
<!-- wp:group {"metadata":{"name":"Contact Map Static"},"className":"icts-contact-map-static","layout":{"type":"constrained"}} -->
<div class="wp-block-group icts-contact-map-static"><!-- wp:image {"sizeSlug":"full","linkDestination":"custom","href":"https://maps.app.goo.gl/wxcWEyqnCVKFgaZs7","linkTarget":"_blank","rel":"noopener noreferrer","className":"icts-contact-map-static__image"} -->
<figure class="wp-block-image size-full icts-contact-map-static__image"><a href="https://maps.app.goo.gl/wxcWEyqnCVKFgaZs7" target="_blank" rel="noopener noreferrer"><img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/contact-map-placeholder.svg' ); ?>" alt="<?php esc_attr_e( 'Static map placeholder', 'icts-europe' ); ?>"/></a></figure>
<!-- /wp:image --></div>
<!-- /wp:group -->
