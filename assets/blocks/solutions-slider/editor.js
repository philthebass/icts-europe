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
        InnerBlocks,
        BlockControls
    } = wp.blockEditor || wp.editor;
    const {
        PanelBody,
        Button,
        ToolbarGroup,
        ToolbarButton,
        RangeControl,
        FocalPointPicker
    } = wp.components;

    registerBlockType('icts-europe/solutions-slide', {
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
        title: __('Solutions Slider', 'icts-europe'),
        icon: 'images-alt2',
        category: 'layout',
        supports: {
            align: false,
            html: false,
            anchor: true
        },
        attributes: {
            heading: { type: 'string', default: '' },
            subheading: { type: 'string', default: '' },
            preview: { type: 'boolean', default: false },
            autoplay: { type: 'number', default: 7000 }
        },
        edit: function (props) {
            const { attributes, setAttributes } = props;
            const { heading, subheading, preview, autoplay } = attributes;
            const appender =
                InnerBlocks && InnerBlocks.ButtonBlockAppender
                    ? InnerBlocks.ButtonBlockAppender
                    : undefined;

            return el(
                'div',
                { className: 'icts-solutions-slider-block' + (preview ? ' is-previewing' : '') },
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
                            el(RangeControl, {
                                label: __('Autoplay duration (ms)', 'icts-europe'),
                                min: 2000,
                                max: 12000,
                                step: 500,
                                value: autoplay,
                                onChange: function (value) {
                                    setAttributes({ autoplay: value || 7000 });
                                }
                            })
                        )
                    ),
                    el(
                        'section',
                        {
                            key: 'slider',
                            className:
                                'icts-solutions-slider' + (preview ? ' is-solutions-previewing' : ''),
                            'data-autoplay': String(autoplay || 7000)
                        },
                        [
                            el('div', { className: 'icts-solutions-slider__intro', key: 'intro' }, [
                                el(RichText, {
                                    key: 'heading',
                                    tagName: 'h2',
                                    className: 'icts-solutions-slider__heading',
                                    value: heading,
                                    allowedFormats: [],
                                    placeholder: __('Our Technology Stack', 'icts-europe'),
                                    onChange: function (value) {
                                        setAttributes({ heading: value });
                                    }
                                }),
                                el(RichText, {
                                    key: 'subheading',
                                    tagName: 'p',
                                    className: 'icts-solutions-slider__subheading',
                                    allowedFormats: [],
                                    value: subheading,
                                    placeholder: __(
                                        'Trusted by the industry to deliver smoother operations and financial savings.',
                                        'icts-europe'
                                    ),
                                    onChange: function (value) {
                                        setAttributes({ subheading: value });
                                    }
                                })
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
            const { heading, subheading, autoplay } = props.attributes;

            return el('div', { className: 'icts-solutions-slider-block' }, [
                el(
                    'section',
                    {
                        key: 'slider',
                        className: 'icts-solutions-slider',
                        'data-autoplay': String(autoplay || 7000)
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
                            'aria-label': __('Solutions slider pagination', 'icts-europe')
                        })
                    ]
                )
            ]);
        }
    });
})(window.wp);
