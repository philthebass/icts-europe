<?php
/**
 * Title: Counter Band
 * Slug: icts-europe/counter-band
 * Description: Full-width counter section with background image and responsive grid.
 * Categories: icts-europe/features
 * Keywords: counter, stats, metrics, numbers
 * Viewport Width: 1500
 * Inserter: true
 */
?>
<!-- wp:cover {"url":"<?php echo esc_url( get_template_directory_uri() . '/patterns/images/guy-laptop.webp' ); ?>","dimRatio":40,"overlayColor":"brand-primary","minHeight":320,"minHeightUnit":"px","isUserOverlayColor":true,"align":"full","className":"icts-counter-band","style":{"spacing":{"margin":{"top":"var:preset|spacing|x-large","bottom":"var:preset|spacing|x-large"},"padding":{"top":"var:preset|spacing|x-large","right":"var:preset|spacing|medium","bottom":"var:preset|spacing|x-large","left":"var:preset|spacing|medium"}}}} -->
<div class="wp-block-cover alignfull icts-counter-band" style="margin-top:var(--wp--preset--spacing--x-large);margin-bottom:var(--wp--preset--spacing--x-large);padding-top:var(--wp--preset--spacing--x-large);padding-right:var(--wp--preset--spacing--medium);padding-bottom:var(--wp--preset--spacing--x-large);padding-left:var(--wp--preset--spacing--medium);min-height:320px"><img class="wp-block-cover__image-background" alt="" src="<?php echo esc_url( get_template_directory_uri() . '/patterns/images/guy-laptop.webp' ); ?>" data-object-fit="cover"/><span aria-hidden="true" class="wp-block-cover__background has-brand-primary-background-color has-background-dim-40 has-background-dim"></span><div class="wp-block-cover__inner-container">
<!-- wp:group {"className":"icts-counter-band__grid","style":{"spacing":{"blockGap":"var:preset|spacing|medium"}},"layout":{"type":"grid","minimumColumnWidth":"15rem"}} -->
<div class="wp-block-group icts-counter-band__grid"><!-- wp:acf/counter {"name":"acf/counter","data":{"number":"1000000000","count_direction":"up","label":"Automated checks performed annually","prefix":"","suffix":""},"mode":"preview"} /-->

<!-- wp:acf/counter {"name":"acf/counter","data":{"number":"200","count_direction":"up","label":"Countries and territories covered","prefix":"","suffix":"+"},"mode":"preview"} /-->

<!-- wp:acf/counter {"name":"acf/counter","data":{"number":"40","count_direction":"up","label":"Airline partners worldwide","prefix":"+","suffix":"%"},"mode":"preview"} /-->

<!-- wp:acf/counter {"name":"acf/counter","data":{"number":"30","count_direction":"up","label":"Languages with translations for Arabic, Chinese, Dutch, English, French, German, Spanish and more","prefix":"","suffix":""},"mode":"preview"} /--></div>
<!-- /wp:group --></div></div>
<!-- /wp:cover -->
