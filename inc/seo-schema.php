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
 * Normalize plain text for schema output.
 *
 * @param string $value Raw text or HTML.
 * @return string
 */
function normalize_schema_text( $value ) {
	return \trim( \preg_replace( '/\s+/', ' ', \wp_specialchars_decode( \wp_strip_all_tags( $value ), \ENT_QUOTES ) ) );
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
