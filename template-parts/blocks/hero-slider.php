<?php
/**
 * Hero Slider Block template
 *
 * @var array $block
 */

$block_id = 'icts-hero-slider-' . $block['id'];

$slides = get_field( 'slides' );
if ( ! $slides ) {
    return;
}
?>
<div class="icts-hero-slider-block alignfull">
    <section id="<?php echo esc_attr( $block_id ); ?>" class="icts-hero-slider">
        <div class="icts-hero-slider__track js-icts-hero-slider"
             data-flickity='{
                 "cellSelector": ".icts-hero-slider__slide",
                 "wrapAround": true,
                 "autoPlay": 7000,
                 "pauseAutoPlayOnHover": true,
                 "prevNextButtons": false,
                 "pageDots": false,
                 "adaptiveHeight": false,
                 "draggable": true,
                 "setGallerySize": false
             }'>

            <?php foreach ( $slides as $index => $slide ) : ?>
                <?php
                $title     = $slide['title'] ?? '';
                $text      = $slide['text'] ?? '';
                $cta_label = $slide['cta_label'] ?? '';
                $cta_link  = $slide['cta_link'] ?? null;
                $image     = $slide['image'] ?? null;

                $image_url = $image['url'] ?? '';
                $image_alt = $image['alt'] ?? '';

                // Focal point handling.
                $focal_value = $slide['image_focal_point'] ?? 'center-center';

                switch ( $focal_value ) {
                    case 'top-center':
                        $object_position = 'center top';
                        break;
                    case 'bottom-center':
                        $object_position = 'center bottom';
                        break;
                    case 'center-left':
                        $object_position = 'left center';
                        break;
                    case 'center-right':
                        $object_position = 'right center';
                        break;
                    case 'top-left':
                        $object_position = 'left top';
                        break;
                    case 'top-right':
                        $object_position = 'right top';
                        break;
                    case 'bottom-left':
                        $object_position = 'left bottom';
                        break;
                    case 'bottom-right':
                        $object_position = 'right bottom';
                        break;
                    case 'center-center':
                    default:
                        $object_position = 'center center';
                        break;
                }

                $slide_id = $block_id . '-slide-' . $index;
                ?>
                <article class="icts-hero-slider__slide" id="<?php echo esc_attr( $slide_id ); ?>">
                    <?php if ( $image_url ) : ?>
                        <div class="icts-hero-slider__media">
                            <img
                                src="<?php echo esc_url( $image_url ); ?>"
                                alt="<?php echo esc_attr( $image_alt ); ?>"
                                loading="lazy"
                                style="object-position: <?php echo esc_attr( $object_position ); ?>;"
                            />
                        </div>
                    <?php endif; ?>

                    <div class="icts-hero-slider__overlay"></div>

                    <div class="icts-hero-slider__content">
                        <?php if ( $title ) : ?>
                            <h2 class="icts-hero-slider__title">
                                <?php echo esc_html( $title ); ?>
                            </h2>
                        <?php endif; ?>

                        <?php if ( $text ) : ?>
                            <div class="icts-hero-slider__text has-medium-font-size">
                                <?php echo wp_kses_post( wpautop( $text ) ); ?>
                            </div>
                        <?php endif; ?>

                        <?php if ( $cta_link && $cta_label ) : ?>
                            <a class="icts-hero-slider__button wp-element-button"
                               href="<?php echo esc_url( $cta_link['url'] ); ?>"
                               target="<?php echo ! empty( $cta_link['target'] ) ? esc_attr( $cta_link['target'] ) : '_self'; ?>">
                                <?php echo esc_html( $cta_label ); ?>
                            </a>
                        <?php endif; ?>
                    </div>
                </article>
            <?php endforeach; ?>
        </div>

        <div class="icts-hero-slider__indicators js-icts-hero-slider-indicators"
             role="tablist"
             aria-label="<?php esc_attr_e( 'Hero slider pagination', 'icts-europe' ); ?>">
            <?php foreach ( $slides as $index => $slide ) :
                $slide_id = $block_id . '-slide-' . $index;
                ?>
                <button class="icts-hero-slider__indicator<?php echo 0 === $index ? ' is-active' : ''; ?>"
                        type="button"
                        role="tab"
                        aria-label="<?php echo esc_attr( sprintf( __( 'Go to slide %d', 'icts-europe' ), $index + 1 ) ); ?>"
                        aria-controls="<?php echo esc_attr( $slide_id ); ?>"
                        aria-selected="<?php echo 0 === $index ? 'true' : 'false'; ?>"
                        data-slide-index="<?php echo esc_attr( $index ); ?>">
                    <span class="icts-hero-slider__indicator-bar"></span>
                </button>
            <?php endforeach; ?>
        </div>
    </section>
</div>