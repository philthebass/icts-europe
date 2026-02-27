(function (wp) {
  const { registerBlockType } = wp.blocks;
  const el = wp.element.createElement;
  const Fragment = wp.element.Fragment;
  const { __ } = wp.i18n;
  const {
    InspectorControls,
    MediaUpload,
    MediaUploadCheck,
    RichText,
    URLInputButton,
    InnerBlocks,
    BlockControls
  } = wp.blockEditor || wp.editor;
  const { PanelBody, Button, TextControl, FocalPointPicker, ToggleControl, ToolbarGroup, ToolbarButton, ToolbarItem, Modal } = wp.components;

  // Prefer modern LinkControl with search across posts/pages; fall back to URLInputButton.
  const LinkControl = (wp.blockEditor && (wp.blockEditor.LinkControl || wp.blockEditor.__experimentalLinkControl))
    || (wp.editor && (wp.editor.LinkControl || wp.editor.__experimentalLinkControl))
    || null;

  // Child: hero-slide
  registerBlockType('icts-europe/hero-slide', {
    apiVersion: 3,
    title: __('Hero Slide', 'icts-europe'),
    icon: 'format-image',
    parent: ['icts-europe/hero-slider'],
    category: 'layout',
    supports: { reusable: false, html: false },
    attributes: {
      title: { type: 'string', source: 'text', selector: 'h2.icts-hero-slider__title' },
      text: { type: 'string', source: 'html', selector: '.icts-hero-slider__text' },
      ctaLabel: { type: 'string', source: 'html', selector: 'a.icts-hero-slider__button', default: '' },
      ctaUrl: { type: 'string', source: 'attribute', selector: 'a.icts-hero-slider__button', attribute: 'href', default: '' },
      ctaTarget: { type: 'string', source: 'attribute', selector: 'a.icts-hero-slider__button', attribute: 'target', default: '' },
      logoId: { type: 'number' },
      logoUrl: { type: 'string', default: '' },
      logoAlt: { type: 'string', default: '' },
      logoLinkUrl: { type: 'string', default: '' },
      logoLinkTarget: { type: 'string', default: '' },
      mediaId: { type: 'number' },
      mediaUrl: { type: 'string' },
      focalPoint: { type: 'object', default: { x: 0.5, y: 0.5 } }
    },
    edit: function (props) {
      const { attributes, setAttributes, className } = props;
      const { title, text, ctaLabel, ctaUrl, ctaTarget, logoId, logoUrl, logoAlt, logoLinkUrl, logoLinkTarget, mediaId, mediaUrl, focalPoint } = attributes;
      const { useState } = wp.element;

      // CTA modal state
      const [isCtaOpen, setIsCtaOpen] = useState(false);
      const [tempCta, setTempCta] = useState(null);
      const [isLogoLinkOpen, setIsLogoLinkOpen] = useState(false);
      const [tempLogoLink, setTempLogoLink] = useState(null);

      function onSelectImage(media) {
        if (!media) return;
        setAttributes({ mediaId: media.id, mediaUrl: media.url });
      }

      function onSelectLogo(media) {
        if (!media) return;
        const resolvedUrl = media.url
          || media.source_url
          || (media.sizes && media.sizes.full && media.sizes.full.url)
          || '';
        setAttributes({
          logoId: media.id,
          logoUrl: resolvedUrl,
          logoAlt: media.alt || media.title || ''
        });
      }

      function removeLogo() {
        setAttributes({
          logoId: 0,
          logoUrl: '',
          logoAlt: '',
          logoLinkUrl: '',
          logoLinkTarget: ''
        });
      }

      function openCta() {
        setTempCta({ label: ctaLabel || '', url: ctaUrl || '', newTab: ctaTarget === '_blank' });
        setIsCtaOpen(true);
      }

      function saveCta() {
        if (!tempCta) { setIsCtaOpen(false); return; }
        setAttributes({ ctaLabel: tempCta.label || '', ctaUrl: tempCta.url || '', ctaTarget: tempCta.newTab ? '_blank' : '' });
        setIsCtaOpen(false);
      }

      function openLogoLink() {
        setTempLogoLink({ url: logoLinkUrl || '', newTab: logoLinkTarget === '_blank' });
        setIsLogoLinkOpen(true);
      }

      function saveLogoLink() {
        if (!tempLogoLink) { setIsLogoLinkOpen(false); return; }
        setAttributes({
          logoLinkUrl: tempLogoLink.url || '',
          logoLinkTarget: tempLogoLink.newTab ? '_blank' : ''
        });
        setIsLogoLinkOpen(false);
      }

      return el(Fragment, {},
        el(InspectorControls, {},
          el(PanelBody, { title: __('Media', 'icts-europe'), initialOpen: true },
            el(MediaUploadCheck, {},
              el(MediaUpload, {
                onSelect: onSelectImage,
                allowedTypes: ['image'],
                value: mediaId,
                render: ({ open }) => el(Button, { onClick: open, isSecondary: true }, mediaUrl ? __('Replace image', 'icts-europe') : __('Select image', 'icts-europe'))
              })
            ),
            mediaUrl && el('div', { style: { marginTop: '12px' } },
              el(FocalPointPicker, {
                url: mediaUrl,
                value: focalPoint,
                onChange: (fp) => setAttributes({ focalPoint: fp })
              })
            )
          ),
          el(PanelBody, { title: __('Logo', 'icts-europe'), initialOpen: false },
            el(MediaUploadCheck, {},
              el(MediaUpload, {
                onSelect: onSelectLogo,
                allowedTypes: ['image'],
                value: logoId,
                render: ({ open }) => el(Button, { onClick: open, isSecondary: true }, logoUrl ? __('Replace logo', 'icts-europe') : __('Select logo', 'icts-europe'))
              })
            ),
            logoUrl && el(Fragment, {},
              el('div', { style: { marginTop: '10px' } },
                el('img', {
                  src: logoUrl,
                  alt: logoAlt || '',
                  style: { maxWidth: '220px', width: '100%', height: 'auto', display: 'block' }
                })
              ),
              el(TextControl, {
                label: __('Logo alt text', 'icts-europe'),
                value: logoAlt || '',
                onChange: function(v){ setAttributes({ logoAlt: v }); }
              }),
              el('div', { className: 'icts-hero-cta-summary' },
                el('div', { className: 'icts-hero-cta-summary__row' },
                  el('div', { className: 'icts-hero-cta-summary__label' }, __('Logo link', 'icts-europe')),
                  el('div', { className: 'icts-hero-cta-summary__value' }, logoLinkUrl || __('None', 'icts-europe'))
                ),
                el(Button, { isSecondary: true, onClick: openLogoLink, style: { marginTop: '8px' } }, __('Edit logo link', 'icts-europe')),
                el(Button, { isLink: true, isDestructive: true, onClick: removeLogo, style: { marginTop: '4px' } }, __('Remove logo', 'icts-europe'))
              ),
              isLogoLinkOpen && el(Modal, { title: __('Edit logo link', 'icts-europe'), className: 'icts-hero-cta-modal-frame', onRequestClose: function(){ setIsLogoLinkOpen(false); } },
                el('div', { className: 'icts-hero-cta-modal' },
                  LinkControl ?
                    el(LinkControl, {
                      value: { url: (tempLogoLink && tempLogoLink.url) || '', opensInNewTab: !!(tempLogoLink && tempLogoLink.newTab) },
                      onChange: function (val) {
                        setTempLogoLink(Object.assign({}, tempLogoLink || {}, { url: (val && val.url) || '', newTab: !!(val && val.opensInNewTab) }));
                      },
                      settings: [ { id: 'opensInNewTab', title: __('Open in new tab', 'icts-europe') } ],
                      showInitialSuggestions: true,
                      withCreateSuggestion: false
                    })
                  : el('div', { style: { marginTop: '8px' } },
                      el(URLInputButton, {
                        url: (tempLogoLink && tempLogoLink.url) || '',
                        onChange: function (url) { setTempLogoLink(Object.assign({}, tempLogoLink || {}, { url: url })); }
                      }),
                      el(ToggleControl, {
                        label: __('Open in new tab', 'icts-europe'),
                        checked: !!(tempLogoLink && tempLogoLink.newTab),
                        __nextHasNoMarginBottom: true,
                        onChange: function(val){ setTempLogoLink(Object.assign({}, tempLogoLink || {}, { newTab: !!val })); }
                      })
                    ),
                  el('div', { className: 'icts-hero-cta-modal__actions' },
                    el(Button, { isTertiary: true, onClick: function(){ setIsLogoLinkOpen(false); } }, __('Cancel', 'icts-europe')),
                    el(Button, { isPrimary: true, onClick: saveLogoLink }, __('Save', 'icts-europe'))
                  )
                )
              )
            )
          ),
          el(PanelBody, { title: __('CTA', 'icts-europe'), initialOpen: false },
            el('div', { className: 'icts-hero-cta-summary' },
              el('div', { className: 'icts-hero-cta-summary__row' },
                el('div', { className: 'icts-hero-cta-summary__label' }, __('Label', 'icts-europe')),
                el('div', { className: 'icts-hero-cta-summary__value' }, ctaLabel || __('None', 'icts-europe'))
              ),
              el('div', { className: 'icts-hero-cta-summary__row' },
                el('div', { className: 'icts-hero-cta-summary__label' }, __('URL', 'icts-europe')),
                el('div', { className: 'icts-hero-cta-summary__value' }, ctaUrl || __('None', 'icts-europe'))
              ),
              el(Button, { isSecondary: true, onClick: openCta, style: { marginTop: '8px' } }, __('Edit CTA', 'icts-europe'))
            ),
            isCtaOpen && el(Modal, { title: __('Edit CTA', 'icts-europe'), className: 'icts-hero-cta-modal-frame', onRequestClose: function(){ setIsCtaOpen(false); } },
              el('div', { className: 'icts-hero-cta-modal' },
                el(TextControl, {
                  label: __('Button label', 'icts-europe'),
                  value: (tempCta && tempCta.label) || '',
                  onChange: function(v){ setTempCta(Object.assign({}, tempCta || {}, { label: v })); }
                }),
                LinkControl ?
                  el(LinkControl, {
                    value: { url: (tempCta && tempCta.url) || '', opensInNewTab: !!(tempCta && tempCta.newTab) },
                    onChange: function (val) {
                      setTempCta(Object.assign({}, tempCta || {}, { url: (val && val.url) || '', newTab: !!(val && val.opensInNewTab) }));
                    },
                    settings: [ { id: 'opensInNewTab', title: __('Open in new tab', 'icts-europe') } ],
                    showInitialSuggestions: true,
                    withCreateSuggestion: false
                  })
                : el('div', { style: { marginTop: '8px' } },
                    el(URLInputButton, {
                      url: (tempCta && tempCta.url) || '',
                      onChange: function (url) { setTempCta(Object.assign({}, tempCta || {}, { url: url })); }
                    }),
                    el(ToggleControl, {
                      label: __('Open in new tab', 'icts-europe'),
                      checked: !!(tempCta && tempCta.newTab),
                      __nextHasNoMarginBottom: true,
                      onChange: function(val){ setTempCta(Object.assign({}, tempCta || {}, { newTab: !!val })); }
                    })
                  ),
                el('div', { className: 'icts-hero-cta-modal__actions' },
                  el(Button, { isTertiary: true, onClick: function(){ setIsCtaOpen(false); } }, __('Cancel', 'icts-europe')),
                  el(Button, { isPrimary: true, onClick: saveCta }, __('Save', 'icts-europe'))
                )
              )
            )
          )
        ),
        el('article', { className: 'icts-hero-slider__slide ' + (className || '') },
          mediaUrl && el('div', { className: 'icts-hero-slider__media' },
            el('img', {
              src: mediaUrl,
              alt: '',
              style: { objectPosition: (focalPoint.x * 100).toFixed(2) + '% ' + (focalPoint.y * 100).toFixed(2) + '%' }
            })
          ),
          // Overlay must not capture pointer events in editor
          el('div', { className: 'icts-hero-slider__overlay', style: { pointerEvents: 'none' } }),
          el('div', { className: 'icts-hero-slider__content' },
            logoUrl && el('div', { className: 'icts-hero-slider__logo' },
              logoLinkUrl
                ? el('a', {
                  className: 'icts-hero-slider__logo-link',
                  href: logoLinkUrl,
                  target: logoLinkTarget || undefined,
                  rel: logoLinkTarget === '_blank' ? 'noreferrer noopener' : undefined
                },
                el('img', { src: logoUrl, alt: logoAlt || '' }))
                : el('img', { src: logoUrl, alt: logoAlt || '' })
            ),
            el(RichText, {
              tagName: 'h2',
              className: 'icts-hero-slider__title',
              value: title,
              allowedFormats: [],
              placeholder: __('Heading…', 'icts-europe'),
              onChange: (v) => setAttributes({ title: v })
            }),
            el(RichText, {
              tagName: 'div',
              className: 'icts-hero-slider__text has-medium-font-size',
              value: text,
              placeholder: __('Summary…', 'icts-europe'),
              onChange: (v) => setAttributes({ text: v })
            }),
            (ctaLabel || ctaUrl) && el('a', {
              className: 'icts-hero-slider__button wp-element-button',
              href: ctaUrl || '#',
              target: ctaTarget || undefined
            }, ctaLabel || __('Button', 'icts-europe'))
          )
        )
      );
    },
    save: function (props) {
      const a = props.attributes;
      const objPos = ((a.focalPoint?.x || 0.5) * 100).toFixed(2) + '% ' + ((a.focalPoint?.y || 0.5) * 100).toFixed(2) + '%';
      return el('article', { className: 'icts-hero-slider__slide' },
        a.mediaUrl && el('div', { className: 'icts-hero-slider__media' },
          el('img', { src: a.mediaUrl, alt: '', style: { objectPosition: objPos } })
        ),
        el('div', { className: 'icts-hero-slider__overlay' }),
        el('div', { className: 'icts-hero-slider__content' },
          a.logoUrl && el('div', { className: 'icts-hero-slider__logo' },
            a.logoLinkUrl
              ? el('a', {
                className: 'icts-hero-slider__logo-link',
                href: a.logoLinkUrl,
                target: a.logoLinkTarget || undefined,
                rel: a.logoLinkTarget === '_blank' ? 'noreferrer noopener' : undefined
              },
              el('img', { src: a.logoUrl, alt: a.logoAlt || '' }))
              : el('img', { src: a.logoUrl, alt: a.logoAlt || '' })
          ),
          el(RichText.Content, { tagName: 'h2', className: 'icts-hero-slider__title', value: a.title }),
          el(RichText.Content, { tagName: 'div', className: 'icts-hero-slider__text has-medium-font-size', value: a.text }),
          (a.ctaLabel && a.ctaUrl) && el('a', { className: 'icts-hero-slider__button wp-element-button', href: a.ctaUrl, target: a.ctaTarget || undefined }, a.ctaLabel)
        )
      );
    }
  });

  // Parent: hero-slider
  registerBlockType('icts-europe/hero-slider', {
    apiVersion: 3,
    title: __('Hero Slider', 'icts-europe'),
    icon: 'images-alt2',
    category: 'layout',
    supports: { align: ['full'], html: false, anchor: true },
    attributes: { preview: { type: 'boolean', default: false } },
    edit: function (props) {
      const { attributes: { preview }, setAttributes } = props;
      const { useRef, useEffect } = wp.element;
      const previewRef = useRef(null);

      useEffect(function () {
        const root = previewRef.current;
        if (!root) {
          return undefined;
        }

        const applyPreviewState = function () {
          const track = root.querySelector('.icts-hero-slider__track');
          if (!track) {
            return;
          }

          let slideBlocks = Array.from(
            track.querySelectorAll('.block-editor-block-list__layout > [data-type="icts-europe/hero-slide"]')
          );

          if (!slideBlocks.length) {
            slideBlocks = Array.from(track.querySelectorAll('[data-type="icts-europe/hero-slide"]'));
          }

          slideBlocks.forEach(function (slideBlock, index) {
            if (preview && index > 0) {
              slideBlock.style.setProperty('display', 'none');
              slideBlock.setAttribute('data-icts-preview-hidden', '1');
              return;
            }

            if (slideBlock.getAttribute('data-icts-preview-hidden') === '1') {
              slideBlock.style.removeProperty('display');
              slideBlock.removeAttribute('data-icts-preview-hidden');
            }
          });
        };

        applyPreviewState();

        if (typeof MutationObserver === 'undefined') {
          return undefined;
        }

        const observer = new MutationObserver(function () {
          applyPreviewState();
        });
        observer.observe(root, { childList: true, subtree: true });

        return function () {
          observer.disconnect();
          const hiddenSlides = root.querySelectorAll('[data-icts-preview-hidden="1"]');
          hiddenSlides.forEach(function (hiddenSlide) {
            hiddenSlide.style.removeProperty('display');
            hiddenSlide.removeAttribute('data-icts-preview-hidden');
          });
        };
      }, [preview]);

      return el('div', { className: 'icts-hero-slider-block alignfull' + (preview ? ' is-previewing' : ''), ref: previewRef },
        el(InspectorControls, {},
          el(PanelBody, { title: __('Slider Settings', 'icts-europe'), initialOpen: true },
            el(ToggleControl, {
              label: __('Preview first slide only', 'icts-europe'),
              checked: !!preview,
              __nextHasNoMarginBottom: true,
              onChange: function (nextValue) { setAttributes({ preview: !!nextValue }); }
            })
          )
        ),
        el(BlockControls, {},
          el(ToolbarGroup, {},
            el(ToolbarButton, {
              icon: preview ? 'visibility' : 'hidden',
              label: preview ? __('Exit preview', 'icts-europe') : __('Preview', 'icts-europe'),
              isPressed: !!preview,
              onClick: function () { setAttributes({ preview: !preview }); }
            })
          )
        ),
        el('section', { className: 'icts-hero-slider' + (preview ? ' is-previewing' : '') },
          el('div', { className: 'icts-hero-slider__track' },
            el(InnerBlocks, {
              allowedBlocks: ['icts-europe/hero-slide'],
              template: [['icts-europe/hero-slide', {}]],
              orientation: 'horizontal',
              renderAppender: InnerBlocks.ButtonBlockAppender
            })
          )
        )
      );
    },
    save: function () {
      return el('div', { className: 'icts-hero-slider-block alignfull' },
        el('section', { className: 'icts-hero-slider' },
          el('div', { className: 'icts-hero-slider__track js-icts-hero-slider' }, el(InnerBlocks.Content)),
          el('div', { className: 'icts-hero-slider__indicators js-icts-hero-slider-indicators' })
        )
      );
    }
  });
})(window.wp);
