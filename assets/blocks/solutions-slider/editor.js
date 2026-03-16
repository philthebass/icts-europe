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
        PlainText,
        InnerBlocks,
        BlockControls,
        useBlockProps
    } = wp.blockEditor || wp.editor;
    const {
        PanelBody,
        Button,
        ToolbarGroup,
        ToolbarButton,
        RangeControl,
        FocalPointPicker,
        ToggleControl,
        ColorPalette,
        BaseControl
    } = wp.components;

    registerBlockType('icts-europe/solutions-slide', {
        apiVersion: 3,
        title: __('Solutions Slide', 'icts-europe'),
        icon: 'format-image',
        parent: ['icts-europe/solutions-slider'],
        category: 'layout',
        supports: {
            reusable: false,
            html: false
        },
        attributes: {
            mediaId: { type: 'number' },
            mediaUrl: { type: 'string' },
            mediaAlt: { type: 'string', default: '' },
            focalPoint: { type: 'object', default: { x: 0.5, y: 0.5 } }
        },
        edit: function (props) {
            const { attributes, setAttributes, className } = props;
            const { mediaId, mediaUrl, mediaAlt, focalPoint } = attributes;
            const appender =
                InnerBlocks && InnerBlocks.ButtonBlockAppender
                    ? InnerBlocks.ButtonBlockAppender
                    : undefined;
            const focalPointX =
                focalPoint && typeof focalPoint.x === 'number' ? focalPoint.x : 0.5;
            const focalPointY =
                focalPoint && typeof focalPoint.y === 'number' ? focalPoint.y : 0.5;

            function onSelectImage(media) {
                if (!media) {
                    return;
                }

                setAttributes({
                    mediaId: media.id,
                    mediaUrl: media.url,
                    mediaAlt: media.alt || ''
                });
            }

            return el(
                Fragment,
                {},
                el(
                    InspectorControls,
                    {},
                    el(
                        PanelBody,
                        { title: __('Image', 'icts-europe'), initialOpen: true },
                        el(
                            MediaUploadCheck,
                            {},
                            el(MediaUpload, {
                                onSelect: onSelectImage,
                                allowedTypes: ['image'],
                                value: mediaId,
                                render: function (renderProps) {
                                    return el(
                                        Button,
                                        {
                                            onClick: renderProps.open,
                                            isSecondary: true
                                        },
                                        mediaUrl
                                            ? __('Replace image', 'icts-europe')
                                            : __('Select image', 'icts-europe')
                                    );
                                }
                            })
                        ),
                        mediaUrl &&
                            FocalPointPicker &&
                            el('div', { style: { marginTop: '12px' } }, [
                                el(FocalPointPicker, {
                                    key: 'focal-point',
                                    url: mediaUrl,
                                    value: focalPoint,
                                    onChange: function (nextFocalPoint) {
                                        setAttributes({ focalPoint: nextFocalPoint });
                                    }
                                })
                            ])
                    )
                ),
                el(
                    'article',
                    { className: 'icts-solutions-slider__slide ' + (className || '') },
                    el('div', { className: 'icts-solutions-slider__slide-inner' }, [
                        el(
                            'div',
                            { className: 'icts-solutions-slider__content', key: 'content' },
                            el(InnerBlocks, {
                                template: [
                                    [
                                        'core/heading',
                                        {
                                            level: 3,
                                            placeholder: __('Solution heading…', 'icts-europe')
                                        }
                                    ],
                                    [
                                        'core/paragraph',
                                        {
                                            placeholder: __('Add summary…', 'icts-europe')
                                        }
                                    ],
                                    [
                                        'core/buttons',
                                        {},
                                        [
                                            [
                                                'core/button',
                                                { text: __('Learn more', 'icts-europe') }
                                            ]
                                        ]
                                    ]
                                ],
                                templateLock: false,
                                renderAppender: appender
                            })
                        ),
                        el('div', { className: 'icts-solutions-slider__media', key: 'media' }, [
                            mediaUrl
                                ? el('img', {
                                      key: 'image',
                                      src: mediaUrl,
                                      alt: mediaAlt || '',
                                      style: {
                                          objectPosition:
                                              (focalPointX * 100).toFixed(2) +
                                              '% ' +
                                              (focalPointY * 100).toFixed(2) +
                                              '%'
                                      }
                                  })
                                : el(
                                      'div',
                                      {
                                          key: 'placeholder',
                                          className: 'icts-solutions-slider__media-placeholder'
                                      },
                                      __('Select image', 'icts-europe')
                                  )
                        ])
                    ])
                )
            );
        },
        save: function (props) {
            const { mediaUrl, mediaAlt, focalPoint } = props.attributes;
            const focalPointX =
                focalPoint && typeof focalPoint.x === 'number' ? focalPoint.x : 0.5;
            const focalPointY =
                focalPoint && typeof focalPoint.y === 'number' ? focalPoint.y : 0.5;
            const objectPosition =
                (focalPointX * 100).toFixed(2) +
                '% ' +
                (focalPointY * 100).toFixed(2) +
                '%';

            return el('article', { className: 'icts-solutions-slider__slide' }, [
                el('div', { className: 'icts-solutions-slider__slide-inner', key: 'inner' }, [
                    el(
                        'div',
                        { className: 'icts-solutions-slider__content', key: 'content' },
                        el(InnerBlocks.Content)
                    ),
                    el('div', { className: 'icts-solutions-slider__media', key: 'media' }, [
                        mediaUrl
                            ? el('img', {
                                  key: 'image',
                                  src: mediaUrl,
                                  alt: mediaAlt || '',
                                  style: { objectPosition: objectPosition }
                              })
                            : null
                    ])
                ])
            ]);
        }
    });

    registerBlockType('icts-europe/solutions-slider', {
        apiVersion: 3,
        title: __('Solutions Slider', 'icts-europe'),
        icon: 'images-alt2',
        category: 'layout',
        supports: {
            align: ['wide', 'full'],
            html: false,
            anchor: true
        },
        attributes: {
            heading: {
                type: 'string',
                source: 'html',
                selector: '.icts-solutions-slider__heading',
                default: ''
            },
            subheading: {
                type: 'string',
                source: 'html',
                selector: '.icts-solutions-slider__subheading',
                default: ''
            },
            preview: { type: 'boolean', default: false },
            autoplay: { type: 'number', default: 7000 },
            containerBgColor: { type: 'string', default: '' },
            showStrands: { type: 'boolean', default: true },
            arrowLineColor: { type: 'string', default: '' },
            arrowColor: { type: 'string', default: '' },
            indicatorBorderColor: { type: 'string', default: '' },
            indicatorFillColor: { type: 'string', default: '' },
            headingColor: { type: 'string', default: '' }
        },
        edit: function (props) {
            const { attributes, setAttributes, className } = props;
            const {
                heading,
                subheading,
                preview,
                autoplay,
                containerBgColor,
                showStrands,
                arrowLineColor,
                arrowColor,
                indicatorBorderColor,
                indicatorFillColor,
                headingColor
            } = attributes;
            const { useRef, useEffect } = wp.element;
            const previewRef = useRef(null);
            const appender =
                InnerBlocks && InnerBlocks.ButtonBlockAppender
                    ? InnerBlocks.ButtonBlockAppender
                    : undefined;
            const editorSettings =
                wp.data && wp.data.select && wp.data.select('core/block-editor')
                    ? wp.data.select('core/block-editor').getSettings()
                    : {};
            const themeColors =
                (editorSettings && (editorSettings.colors || editorSettings.__experimentalFeatures?.color?.palette?.theme)) ||
                [];
            const arrowFill = arrowColor || '';
            const sectionStyle = {};
            const computedClassName =
                'icts-solutions-slider-block' +
                (preview ? ' is-previewing' : '') +
                (showStrands === false ? ' is-strands-hidden' : '');

            if (containerBgColor) {
                sectionStyle.backgroundColor = containerBgColor;
            }
            if (arrowFill) {
                sectionStyle['--icts-solutions-arrow-fill'] = arrowFill;
            }
            if (arrowLineColor) {
                sectionStyle['--icts-solutions-arrow-stroke'] = arrowLineColor;
            }
            if (indicatorBorderColor) {
                sectionStyle['--icts-solutions-indicator-border-color'] = indicatorBorderColor;
            }
            if (indicatorFillColor) {
                sectionStyle['--icts-solutions-indicator-fill-color'] = indicatorFillColor;
            }
            if (headingColor) {
                sectionStyle['--icts-solutions-heading-color'] = headingColor;
            }

            useEffect(function () {
                const root = previewRef.current;
                if (!root) {
                    return undefined;
                }

                const applyPreviewState = function () {
                    const track = root.querySelector('.icts-solutions-slider__track');
                    if (!track) {
                        return;
                    }

                    let slideBlocks = Array.from(
                        track.querySelectorAll(
                            '.block-editor-block-list__layout > [data-type="icts-europe/solutions-slide"]'
                        )
                    );

                    if (!slideBlocks.length) {
                        slideBlocks = Array.from(
                            track.querySelectorAll('[data-type="icts-europe/solutions-slide"]')
                        );
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

            const blockProps = useBlockProps
                ? useBlockProps({ className: computedClassName, ref: previewRef })
                : {
                      className: (className ? className + ' ' : '') + computedClassName,
                      ref: previewRef
                  };

            return el(
                'div',
                blockProps,
                [
                    el(
                        BlockControls,
                        { key: 'controls' },
                        el(
                            ToolbarGroup,
                            {},
                            el(ToolbarButton, {
                                icon: preview ? 'visibility' : 'hidden',
                                label: preview
                                    ? __('Exit preview', 'icts-europe')
                                    : __('Preview', 'icts-europe'),
                                isPressed: !!preview,
                                onClick: function () {
                                    setAttributes({ preview: !preview });
                                }
                            })
                        )
                    ),
                    el(
                        InspectorControls,
                        { key: 'inspector' },
                        el(
                            PanelBody,
                            { title: __('Slider Settings', 'icts-europe'), initialOpen: true },
                            el(ToggleControl, {
                                label: __('Preview first slide only', 'icts-europe'),
                                checked: !!preview,
                                __nextHasNoMarginBottom: true,
                                onChange: function (value) {
                                    setAttributes({ preview: !!value });
                                }
                            }),
                            el(RangeControl, {
                                label: __('Autoplay duration (ms)', 'icts-europe'),
                                min: 2000,
                                max: 12000,
                                step: 500,
                                value: autoplay,
                                onChange: function (value) {
                                    setAttributes({ autoplay: value || 7000 });
                                }
                            }),
                            el(ToggleControl, {
                                label: __('Show background strands', 'icts-europe'),
                                checked: showStrands !== false,
                                __nextHasNoMarginBottom: true,
                                onChange: function (value) {
                                    setAttributes({ showStrands: !!value });
                                }
                            }),
                            el(BaseControl, {
                                label: __('Container background color', 'icts-europe'),
                                __nextHasNoMarginBottom: true
                            }, [
                                el(ColorPalette, {
                                    key: 'container-bg-color',
                                    colors: themeColors,
                                    value: containerBgColor,
                                    onChange: function (value) {
                                        setAttributes({ containerBgColor: value || '' });
                                    }
                                })
                            ]),
                            el(BaseControl, {
                                label: __('Arrow line color', 'icts-europe'),
                                __nextHasNoMarginBottom: true
                            }, [
                                el(ColorPalette, {
                                    key: 'arrow-line-color',
                                    colors: themeColors,
                                    value: arrowLineColor,
                                    onChange: function (value) {
                                        setAttributes({ arrowLineColor: value || '' });
                                    }
                                })
                            ]),
                            el(BaseControl, {
                                label: __('Arrow fill color', 'icts-europe'),
                                __nextHasNoMarginBottom: true
                            }, [
                                el(ColorPalette, {
                                    key: 'arrow-color',
                                    colors: themeColors,
                                    value: arrowColor,
                                    onChange: function (value) {
                                        setAttributes({ arrowColor: value || '' });
                                    }
                                })
                            ]),
                            el(BaseControl, {
                                label: __('Heading color', 'icts-europe'),
                                __nextHasNoMarginBottom: true
                            }, [
                                el(ColorPalette, {
                                    key: 'heading-color',
                                    colors: themeColors,
                                    value: headingColor,
                                    onChange: function (value) {
                                        setAttributes({ headingColor: value || '' });
                                    }
                                })
                            ]),
                            el(BaseControl, {
                                label: __('Indicator border color', 'icts-europe'),
                                __nextHasNoMarginBottom: true
                            }, [
                                el(ColorPalette, {
                                    key: 'indicator-border-color',
                                    colors: themeColors,
                                    value: indicatorBorderColor,
                                    onChange: function (value) {
                                        setAttributes({ indicatorBorderColor: value || '' });
                                    }
                                })
                            ]),
                            el(BaseControl, {
                                label: __('Indicator fill color', 'icts-europe'),
                                __nextHasNoMarginBottom: true
                            }, [
                                el(ColorPalette, {
                                    key: 'indicator-fill-color',
                                    colors: themeColors,
                                    value: indicatorFillColor,
                                    onChange: function (value) {
                                        setAttributes({ indicatorFillColor: value || '' });
                                    }
                                })
                            ]),
                            (
                                arrowLineColor ||
                                arrowColor ||
                                containerBgColor ||
                                indicatorBorderColor ||
                                indicatorFillColor ||
                                headingColor
                            ) &&
                                el(Button, {
                                    variant: 'secondary',
                                    onClick: function () {
                                        setAttributes({
                                            containerBgColor: '',
                                            arrowLineColor: '',
                                            arrowColor: '',
                                            indicatorBorderColor: '',
                                            indicatorFillColor: '',
                                            headingColor: ''
                                        });
                                    }
                                }, __('Reset appearance colors', 'icts-europe'))
                        )
                    ),
                    el(
                        'section',
                        {
                            key: 'slider',
                            className:
                                'icts-solutions-slider' + (preview ? ' is-solutions-previewing' : ''),
                            'data-autoplay': String(autoplay || 7000),
                            style: sectionStyle
                        },
                        [
                            el('div', { className: 'icts-solutions-slider__intro', key: 'intro' }, [
                                el('h2', { key: 'heading-wrap', className: 'icts-solutions-slider__heading' }, [
                                    el(PlainText, {
                                        key: 'heading',
                                        value: heading,
                                        placeholder: __('Our Technology Stack', 'icts-europe'),
                                        onChange: function (value) {
                                            setAttributes({ heading: value });
                                        }
                                    })
                                ]),
                                el('p', { key: 'subheading-wrap', className: 'icts-solutions-slider__subheading' }, [
                                    el(PlainText, {
                                        key: 'subheading',
                                        value: subheading,
                                        placeholder: __(
                                            'Trusted by the industry to deliver smoother operations and financial savings.',
                                            'icts-europe'
                                        ),
                                        onChange: function (value) {
                                            setAttributes({ subheading: value });
                                        }
                                    })
                                ])
                            ]),
                            el(
                                'div',
                                { className: 'icts-solutions-slider__track', key: 'track' },
                                el(InnerBlocks, {
                                    allowedBlocks: ['icts-europe/solutions-slide'],
                                    template: [['icts-europe/solutions-slide', {}]],
                                    orientation: 'horizontal',
                                    renderAppender: appender
                                })
                            ),
                            el(
                                'div',
                                {
                                    key: 'indicators',
                                    className: 'icts-solutions-slider__indicators'
                                },
                                __('Indicators appear on the front end.', 'icts-europe')
                            )
                        ]
                    )
                ]
            );
        },
        save: function (props) {
            const {
                heading,
                subheading,
                autoplay,
                containerBgColor,
                showStrands,
                arrowLineColor,
                arrowColor,
                indicatorBorderColor,
                indicatorFillColor,
                headingColor
            } = props.attributes;
            const className = props.className || '';
            const arrowFill = arrowColor || '';
            const sectionStyle = {};
            const computedClassName =
                'icts-solutions-slider-block' + (showStrands === false ? ' is-strands-hidden' : '');

            if (containerBgColor) {
                sectionStyle.backgroundColor = containerBgColor;
            }
            if (arrowFill) {
                sectionStyle['--icts-solutions-arrow-fill'] = arrowFill;
            }
            if (arrowLineColor) {
                sectionStyle['--icts-solutions-arrow-stroke'] = arrowLineColor;
            }
            if (indicatorBorderColor) {
                sectionStyle['--icts-solutions-indicator-border-color'] = indicatorBorderColor;
            }
            if (indicatorFillColor) {
                sectionStyle['--icts-solutions-indicator-fill-color'] = indicatorFillColor;
            }
            if (headingColor) {
                sectionStyle['--icts-solutions-heading-color'] = headingColor;
            }

            const blockProps = useBlockProps && useBlockProps.save
                ? useBlockProps.save({ className: computedClassName })
                : {
                      className: (className ? className + ' ' : '') + computedClassName
                  };

            return el(
                'div',
                blockProps,
                [
                    el(
                        'section',
                        {
                            key: 'slider',
                            className: 'icts-solutions-slider',
                            'data-autoplay': String(autoplay || 7000),
                            style: sectionStyle
                        },
                        [
                            el('div', { className: 'icts-solutions-slider__intro', key: 'intro' }, [
                                heading
                                    ? el(RichText.Content, {
                                          key: 'heading',
                                          tagName: 'h2',
                                          className: 'icts-solutions-slider__heading',
                                          value: heading
                                      })
                                    : null,
                                subheading
                                    ? el(RichText.Content, {
                                          key: 'subheading',
                                          tagName: 'p',
                                          className: 'icts-solutions-slider__subheading',
                                          value: subheading
                                      })
                                    : null
                            ]),
                            el(
                                'div',
                                { className: 'icts-solutions-slider__track js-icts-solutions-slider', key: 'track' },
                                el(InnerBlocks.Content)
                            ),
                            el('div', {
                                key: 'indicators',
                                className:
                                    'icts-solutions-slider__indicators js-icts-solutions-slider-indicators',
                                role: 'tablist',
                                'aria-label': 'Solutions slider pagination'
                            })
                        ]
                    )
                ]
            );
        }
    });
})(window.wp);
