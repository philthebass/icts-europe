<?php
/**
 * SEO schema extensions for the ICTS Europe theme.
 *
 * @package icts-europe
 */

namespace ICTS_Europe;

/**
 * Return the first graph node ID matching a schema type.
 *
 * @param array  $graph Schema graph.
 * @param string $type  Schema type to match.
 * @return string
 */
function get_schema_node_id_by_type( $graph, $type ) {
	foreach ( $graph as $piece ) {
		if ( ! \is_array( $piece ) || empty( $piece['@id'] ) || empty( $piece['@type'] ) ) {
			continue;
		}

		$piece_types = \is_array( $piece['@type'] ) ? $piece['@type'] : [ $piece['@type'] ];
		if ( \in_array( $type, $piece_types, true ) ) {
			return (string) $piece['@id'];
		}
	}

	return '';
}

/**
 * Return whether a graph node already exists by ID.
 *
 * @param array  $graph Schema graph.
 * @param string $node_id Schema node ID.
 * @return bool
 */
function schema_graph_has_node_id( $graph, $node_id ) {
	foreach ( $graph as $piece ) {
		if ( \is_array( $piece ) && isset( $piece['@id'] ) && (string) $piece['@id'] === $node_id ) {
			return true;
		}
	}

	return false;
}

/**
 * Return the WebPage graph node ID for the current permalink.
 *
 * @param array  $graph     Schema graph.
 * @param string $permalink Current page permalink.
 * @return string
 */
function get_current_webpage_schema_node_id( $graph, $permalink ) {
	$permalink = \trailingslashit( $permalink );

	foreach ( $graph as $piece ) {
		if ( ! \is_array( $piece ) || empty( $piece['@id'] ) || empty( $piece['@type'] ) ) {
			continue;
		}

		$piece_types = \is_array( $piece['@type'] ) ? $piece['@type'] : [ $piece['@type'] ];
		if ( ! \in_array( 'WebPage', $piece_types, true ) ) {
			continue;
		}

		$piece_id  = (string) $piece['@id'];
		$piece_url = isset( $piece['url'] ) ? \trailingslashit( (string) $piece['url'] ) : '';

		if ( \trailingslashit( $piece_id ) === $permalink || $piece_url === $permalink || 0 === \strpos( $piece_id, $permalink . '#' ) ) {
			return $piece_id;
		}
	}

	return '';
}

/**
 * Normalize plain text for schema output.
 *
 * @param string $value Raw text or HTML.
 * @return string
 */
function normalize_schema_text( $value ) {
	return \trim( \preg_replace( '/\s+/', ' ', \wp_specialchars_decode( \wp_strip_all_tags( $value ), \ENT_QUOTES ) ) );
}

/**
 * Return canonical solution software schema metadata keyed by default-language page slug.
 *
 * @return array
 */
function get_solution_software_schema_items() {
	return [
		'traveldoc-adc'        => [
			'name'                     => 'TravelDoc ADC',
			'description'              => 'Real-time automated document and compliance checking integrated directly into airline and operator departure control systems, delivering instant OK/Not OK decisions.',
			'application_category'     => 'BusinessApplication',
			'application_sub_category' => 'Hybrid (SaaS platform + API)',
			'audience'                 => 'Airlines, ground handlers, travel providers, maritime and rail operators',
			'runtime_platform'         => 'API-based, with DCS integration',
		],
		'traveldoc-compliance' => [
			'name'                     => 'TravelDoc Compliance',
			'description'              => 'AI-powered pre-departure document capture and verification platform that validates passenger documents against entry requirements at online check-in, before passengers reach the airport.',
			'application_category'     => 'BusinessApplication',
			'application_sub_category' => 'Hybrid (SaaS application + API/widget)',
			'audience'                 => 'Airlines',
			'runtime_platform'         => 'Browser-based staff portal, embeddable web widget or iOS/Android app integration, with DCS output',
		],
		'traveldoc-pro'        => [
			'name'                     => 'TravelDoc Pro',
			'description'              => 'A web based application for staff who need to verify travel documents or answer passenger questions without system integration.',
			'application_category'     => 'BusinessApplication',
			'application_sub_category' => 'Software application (SaaS)',
			'audience'                 => 'Airlines, ground handlers, travel agencies, travel providers, maritime & rail operators and individual travellers',
			'runtime_platform'         => 'Browser-based interface',
		],
		'traveldoc-explore'    => [
			'name'                     => 'TravelDoc Explore',
			'description'              => 'A free, self-serve web tool that gives travellers a personalised checklist of visa, passport, health, and entry requirements for any destination based on their nationality.',
			'application_category'     => 'TravelApplication',
			'application_sub_category' => 'Software application (B2C)',
			'audience'                 => 'Individual travellers',
			'runtime_platform'         => 'Browser-based, mobile-friendly web application',
		],
		'global-apis'          => [
			'name'                     => 'Global APIS',
			'description'              => 'Automated advance passenger information submission gateway that sends passenger manifest data to border agencies worldwide in real time.',
			'application_category'     => 'BusinessApplication',
			'application_sub_category' => 'API/platform (managed gateway)',
			'audience'                 => 'Airlines, travel providers, maritime and rail operators',
			'runtime_platform'         => 'API-based gateway, with operator-facing interface',
		],
		'cpm'                  => [
			'name'                     => 'CPM',
			'description'              => 'TSA-compliant passenger pre-screening software deployed on physical units at airport check-in, validating documents against security requirements to reduce screening times.',
			'application_category'     => 'BusinessApplication',
			'application_sub_category' => 'Installed software (hardware-deployed)',
			'audience'                 => 'Airlines',
			'runtime_platform'         => 'Installed software on dedicated hardware units, operates offline',
		],
	];
}

/**
 * Register solution software schema strings for Polylang translation.
 *
 * @return void
 */
function register_solution_software_schema_strings() {
	if ( ! \function_exists( 'pll_register_string' ) ) {
		return;
	}

	foreach ( get_solution_software_schema_items() as $slug => $item ) {
		foreach ( [ 'name', 'description', 'application_sub_category', 'audience', 'runtime_platform' ] as $field ) {
			if ( empty( $item[ $field ] ) || ! \is_string( $item[ $field ] ) ) {
				continue;
			}

			\pll_register_string(
				"solution_schema_{$slug}_{$field}",
				$item[ $field ],
				'Theme: Solution schema',
				'description' === $field
			);
		}
	}
}
\add_action( 'init', __NAMESPACE__ . '\register_solution_software_schema_strings' );

/**
 * Translate a schema text string through Polylang when available.
 *
 * @param string $value Default text value.
 * @return string
 */
function translate_schema_text( $value ) {
	if ( \function_exists( 'pll__' ) ) {
		$value = \pll__( $value );
	}

	return normalize_schema_text( $value );
}

/**
 * Resolve the default-language slug for a page, accounting for Polylang translations.
 *
 * @param int $post_id Current page ID.
 * @return string
 */
function get_default_language_page_slug( $post_id ) {
	$default_post_id = $post_id;

	if ( \function_exists( 'pll_default_language' ) && \function_exists( 'pll_get_post' ) ) {
		$default_language = \pll_default_language( 'slug' );
		if ( $default_language ) {
			$translated_post_id = \pll_get_post( $post_id, $default_language );
			if ( $translated_post_id ) {
				$default_post_id = (int) $translated_post_id;
			}
		}
	}

	$slug = \get_post_field( 'post_name', $default_post_id );
	return \is_string( $slug ) ? $slug : '';
}

/**
 * Add Person schema to Team Member profile pages.
 *
 * @param array $graph   Yoast schema graph.
 * @param mixed $context Yoast schema context.
 * @return array
 */
function add_team_member_person_schema( $graph, $context ) {
	unset( $context );

	if ( ! \is_singular( 'team-member' ) || ! \is_array( $graph ) ) {
		return $graph;
	}

	$post_id = \get_queried_object_id();
	if ( ! $post_id ) {
		return $graph;
	}

	$permalink = \get_permalink( $post_id );
	if ( ! $permalink ) {
		return $graph;
	}

	$person_id       = \trailingslashit( $permalink ) . '#person';
	$webpage_id      = \trailingslashit( $permalink );
	$organization_id = get_schema_node_id_by_type( $graph, 'Organization' );

	$name      = normalize_schema_text( \get_the_title( $post_id ) );
	$job_title = \function_exists( 'get_field' ) ? \get_field( 'job_title', $post_id ) : '';
	$bio       = \function_exists( 'get_field' ) ? \get_field( 'biog', $post_id ) : '';
	$linkedin  = \function_exists( 'get_field' ) ? \get_field( 'linkedin_profile', $post_id ) : '';

	if ( ! \is_string( $job_title ) ) {
		$job_title = '';
	}
	if ( ! \is_string( $bio ) ) {
		$bio = '';
	}
	if ( ! \is_string( $linkedin ) ) {
		$linkedin = '';
	}

	$person = [
		'@type' => 'Person',
		'@id'   => $person_id,
		'name'  => $name,
		'url'   => $permalink,
	];

	$job_title = normalize_schema_text( $job_title );
	if ( '' !== $job_title ) {
		$person['jobTitle'] = $job_title;
	}

	$bio = normalize_schema_text( $bio );
	if ( '' !== $bio ) {
		$person['description'] = $bio;
	}

	if ( \has_post_thumbnail( $post_id ) ) {
		$person['image'] = [
			'@id' => \trailingslashit( $permalink ) . '#primaryimage',
		];
	}

	if ( '' !== $organization_id ) {
		$person['worksFor'] = [
			'@id' => $organization_id,
		];
	}

	$linkedin = \trim( $linkedin );
	if ( '' !== $linkedin ) {
		$person['sameAs'] = [ \esc_url_raw( $linkedin ) ];
	}

	$graph[] = $person;

	foreach ( $graph as &$piece ) {
		if ( ! \is_array( $piece ) || empty( $piece['@id'] ) || empty( $piece['@type'] ) ) {
			continue;
		}

		$piece_types = \is_array( $piece['@type'] ) ? $piece['@type'] : [ $piece['@type'] ];
		if ( \in_array( 'WebPage', $piece_types, true ) && \trailingslashit( (string) $piece['@id'] ) === $webpage_id ) {
			$piece['mainEntity'] = [
				'@id' => $person_id,
			];
			break;
		}
	}
	unset( $piece );

	return $graph;
}
\add_filter( 'wpseo_schema_graph', __NAMESPACE__ . '\add_team_member_person_schema', 20, 2 );

/**
 * Add SoftwareApplication schema to canonical solution pages.
 *
 * @param array $graph   Yoast schema graph.
 * @param mixed $context Yoast schema context.
 * @return array
 */
function add_solution_software_application_schema( $graph, $context ) {
	unset( $context );

	if ( ! \is_page() || ! \is_array( $graph ) ) {
		return $graph;
	}

	$post_id = \get_queried_object_id();
	if ( ! $post_id ) {
		return $graph;
	}

	$slug  = get_default_language_page_slug( $post_id );
	$items = get_solution_software_schema_items();
	if ( '' === $slug || empty( $items[ $slug ] ) ) {
		return $graph;
	}

	$permalink = \get_permalink( $post_id );
	if ( ! $permalink ) {
		return $graph;
	}

	$item            = $items[ $slug ];
	$software_id     = \trailingslashit( $permalink ) . '#software';
	$webpage_id      = get_current_webpage_schema_node_id( $graph, $permalink );
	$organization_id = get_schema_node_id_by_type( $graph, 'Organization' );

	if ( schema_graph_has_node_id( $graph, $software_id ) ) {
		return $graph;
	}

	$software = [
		'@type'                  => 'SoftwareApplication',
		'@id'                    => $software_id,
		'name'                   => translate_schema_text( $item['name'] ),
		'url'                    => $permalink,
		'description'            => translate_schema_text( $item['description'] ),
		'applicationCategory'    => $item['application_category'],
		'applicationSubCategory' => translate_schema_text( $item['application_sub_category'] ),
		'audience'               => [
			'@type'        => 'Audience',
			'audienceType' => translate_schema_text( $item['audience'] ),
		],
		'runtimePlatform'        => translate_schema_text( $item['runtime_platform'] ),
	];

	if ( '' !== $webpage_id ) {
		$software['mainEntityOfPage'] = [
			'@id' => $webpage_id,
		];
	}

	if ( '' !== $organization_id ) {
		$organization_reference = [
			'@id' => $organization_id,
		];

		$software['publisher']  = $organization_reference;
		$software['creator']    = $organization_reference;
		$software['maintainer'] = $organization_reference;
	}

	$graph[] = $software;

	if ( '' !== $webpage_id ) {
		foreach ( $graph as &$piece ) {
			if ( ! \is_array( $piece ) || empty( $piece['@id'] ) || (string) $piece['@id'] !== $webpage_id ) {
				continue;
			}

			$piece_types = isset( $piece['@type'] ) && \is_array( $piece['@type'] ) ? $piece['@type'] : [ isset( $piece['@type'] ) ? $piece['@type'] : '' ];
			if ( \in_array( 'WebPage', $piece_types, true ) ) {
				$piece['mainEntity'] = [
					'@id' => $software_id,
				];
				break;
			}
		}
		unset( $piece );
	}

	return $graph;
}
\add_filter( 'wpseo_schema_graph', __NAMESPACE__ . '\add_solution_software_application_schema', 20, 2 );
