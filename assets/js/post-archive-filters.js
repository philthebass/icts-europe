( function () {
	var config = window.ictsPostArchiveFilters || null;

	if ( ! config || ! config.enabled ) {
		return;
	}

	var rootQuery = document.querySelector( 'main .wp-block-query' );

	if ( ! rootQuery ) {
		return;
	}

	var postTemplate = rootQuery.querySelector( '.wp-block-post-template' );

	if ( ! postTemplate ) {
		return;
	}

	var paginationHost = rootQuery.querySelector( '.wp-block-query-pagination' );
	var currentPage = 1;
	var searchTimer = null;
	var currentRequest = null;

	rootQuery.classList.add( 'is-icts-archive-enhanced' );

	function clearElement( element ) {
		if ( ! element ) {
			return;
		}

		if ( typeof element.replaceChildren === 'function' ) {
			element.replaceChildren();
			return;
		}

		while ( element.firstChild ) {
			element.removeChild( element.firstChild );
		}
	}

	function appendChildren( parent, children ) {
		children.forEach( function ( child ) {
			if ( child ) {
				parent.appendChild( child );
			}
		} );
		return parent;
	}

	function createElement( tagName, className, text ) {
		var element = document.createElement( tagName );
		if ( className ) {
			element.className = className;
		}
		if ( typeof text === 'string' ) {
			element.textContent = text;
		}
		return element;
	}

	function getControlsWrapper() {
		var existing = document.querySelector( '.icts-archive-controls' );
		if ( existing ) {
			return existing;
		}

		var controls = document.createElement( 'div' );
		var searchWrap = createElement( 'div', 'icts-archive-controls__search' );
		var searchLabel = createElement( 'label', 'screen-reader-text', config.i18n.searchLabel || '' );
		var searchInput = document.createElement( 'input' );
		var categoryWrap = createElement( 'div', 'icts-archive-controls__category' );
		var categoryLabel = createElement( 'label', 'screen-reader-text', config.i18n.filterLabel || '' );
		var categorySelect = document.createElement( 'select' );

		controls.className = 'icts-archive-controls alignwide';
		searchLabel.setAttribute( 'for', 'icts-archive-search' );
		searchInput.id = 'icts-archive-search';
		searchInput.type = 'search';
		searchInput.className = 'icts-archive-controls__search-input';
		searchInput.placeholder = config.i18n.searchPlaceholder || '';
		searchInput.autocomplete = 'off';

		categoryLabel.setAttribute( 'for', 'icts-archive-category' );
		categorySelect.id = 'icts-archive-category';
		categorySelect.className = 'icts-archive-controls__category-select';

		appendChildren( searchWrap, [ searchLabel, searchInput ] );
		appendChildren( categoryWrap, [ categoryLabel, categorySelect ] );
		appendChildren( controls, [ searchWrap, categoryWrap ] );

		rootQuery.parentNode.insertBefore( controls, rootQuery );
		return controls;
	}

	function populateCategorySelect( select ) {
		clearElement( select );

		var allOption = document.createElement( 'option' );
		allOption.value = '0';
		allOption.textContent = config.i18n.allCategories;
		select.appendChild( allOption );

		( config.categories || [] ).forEach( function ( categoryItem ) {
			var option = document.createElement( 'option' );
			option.value = String( categoryItem.id );
			option.textContent = categoryItem.name;
			select.appendChild( option );
		} );

		select.value = String( config.currentCategory || 0 );
	}

	function getSearchValue() {
		var searchInput = document.getElementById( 'icts-archive-search' );
		return searchInput ? searchInput.value.trim() : '';
	}

	function getCategoryValue() {
		var select = document.getElementById( 'icts-archive-category' );
		if ( ! select ) {
			return 0;
		}
		var parsed = parseInt( select.value, 10 );
		return Number.isNaN( parsed ) ? 0 : parsed;
	}

	function setLoadingState( isLoading ) {
		rootQuery.classList.toggle( 'is-icts-archive-loading', !! isLoading );
	}

	function buildRequestUrl( page ) {
		var params = new URLSearchParams();
		params.set( 'page', String( page ) );
		params.set( 'per_page', String( config.perPage ) );
		params.set( 'search', getSearchValue() );
		params.set( 'category', String( getCategoryValue() ) );
		params.set( 'archive_type', config.archiveType || 'none' );
		params.set( 'archive_term', String( config.archiveTerm || 0 ) );
		if ( config.currentLang ) {
			params.set( 'lang', String( config.currentLang ) );
		}

		return config.restUrl.replace( /\/+$/, '' ) + '/icts-europe/v1/archive-posts?' + params.toString();
	}

	function updateBrowserUrl() {
		if ( ! window.history || ! window.history.replaceState ) {
			return;
		}

		var url = new URL( window.location.href );
		var searchValue = getSearchValue();
		var categoryValue = getCategoryValue();

		if ( searchValue ) {
			url.searchParams.set( 's', searchValue );
		} else {
			url.searchParams.delete( 's' );
		}

		if ( categoryValue > 0 ) {
			url.searchParams.set( 'icts_cat', String( categoryValue ) );
		} else {
			url.searchParams.delete( 'icts_cat' );
		}

		if ( currentPage > 1 ) {
			url.searchParams.set( 'paged', String( currentPage ) );
		} else {
			url.searchParams.delete( 'paged' );
		}

		window.history.replaceState( {}, '', url.toString() );
	}

	function ensurePaginationHost() {
		if ( paginationHost ) {
			return paginationHost;
		}

		var wrapper = document.createElement( 'div' );
		wrapper.className = 'wp-block-group alignwide';
		paginationHost = document.createElement( 'nav' );
		paginationHost.className = 'wp-block-query-pagination is-layout-flex';
		wrapper.appendChild( paginationHost );
		rootQuery.appendChild( wrapper );
		return paginationHost;
	}

	function renderNoResults( message ) {
		var item = createElement( 'li', 'wp-block-post icts-archive-post-empty' );
		var text = createElement( 'p', '', message || config.i18n.noResults || '' );

		clearElement( postTemplate );
		item.appendChild( text );
		postTemplate.appendChild( item );

		var host = ensurePaginationHost();
		clearElement( host );
	}

	function renderArchiveCard( item ) {
		var listItem = createElement( 'li', item.className || 'wp-block-post icts-archive-post-item' );
		var article = createElement( 'article', 'icts-archive-post-card' );
		var imageLink = createElement( 'a', 'icts-archive-post-card__image-link' );
		var body = createElement( 'div', 'icts-archive-post-card__body' );
		var title = createElement( 'h3', 'icts-archive-post-card__title' );
		var titleLink = document.createElement( 'a' );
		var meta = createElement( 'p', 'icts-archive-post-card__meta' );
		var date = createElement( 'span', 'icts-archive-post-card__date', item.date || '' );
		var authorWrap = createElement( 'span', 'icts-archive-post-card__author' );
		var buttons = createElement( 'div', 'wp-block-buttons is-layout-flex wp-block-buttons-is-layout-flex icts-archive-post-card__buttons' );
		var button = createElement( 'div', 'wp-block-button has-custom-width wp-block-button__width-100' );
		var buttonLink = createElement( 'a', 'wp-block-button__link wp-element-button', item.buttonLabel || '' );
		var permalink = item.permalink || '#';

		imageLink.href = permalink;
		if ( item.image && item.image.url ) {
			var image = document.createElement( 'img' );
			image.className = 'icts-archive-post-card__image';
			image.src = item.image.url;
			image.alt = item.image.alt || '';
			image.loading = 'lazy';
			image.decoding = 'async';
			imageLink.appendChild( image );
		} else {
			imageLink.appendChild( createElement( 'div', 'icts-archive-post-card__image-placeholder' ) );
			imageLink.firstChild.setAttribute( 'aria-hidden', 'true' );
		}

		if ( item.category && item.category.name ) {
			var category = createElement( 'p', 'icts-archive-post-card__category' );
			var marker = createElement( 'span', 'icts-archive-post-card__category-marker' );
			var markerSlug = /^[a-z0-9-]+$/.test( item.category.markerColorSlug || '' )
				? item.category.markerColorSlug
				: 'brand-secondary';
			var categoryText = createElement( 'span', 'icts-archive-post-card__category-text', item.category.name );

			marker.style.backgroundColor = 'var(--wp--preset--color--' + markerSlug + ')';
			appendChildren( category, [ marker, categoryText ] );
			body.appendChild( category );
		}

		titleLink.href = permalink;
		titleLink.textContent = item.title || '';
		title.appendChild( titleLink );

		if ( item.author && item.author.url ) {
			var authorLink = createElement( 'a', '', item.author.name || '' );
			authorLink.href = item.author.url;
			authorWrap.appendChild( authorLink );
		} else {
			authorWrap.textContent = item.author && item.author.name ? item.author.name : '';
		}

		appendChildren( meta, [ date, authorWrap ] );

		buttonLink.href = permalink;
		button.appendChild( buttonLink );
		buttons.appendChild( button );

		appendChildren( body, [ title, meta, buttons ] );
		appendChildren( article, [ imageLink, body ] );
		listItem.appendChild( article );

		return listItem;
	}

	function renderArchiveItems( items, message ) {
		clearElement( postTemplate );

		if ( ! Array.isArray( items ) || ! items.length ) {
			renderNoResults( message );
			return;
		}

		items.forEach( function ( item ) {
			postTemplate.appendChild( renderArchiveCard( item || {} ) );
		} );
	}

	function createPaginationLink( page, className, label ) {
		var link = createElement( 'a', className, label );
		link.href = '#';
		link.dataset.ictsPage = String( page );
		return link;
	}

	function renderPagination( pagination ) {
		var host = ensurePaginationHost();
		var totalPages = pagination && pagination.totalPages ? parseInt( pagination.totalPages, 10 ) : 0;
		var current = pagination && pagination.currentPage ? parseInt( pagination.currentPage, 10 ) : currentPage;

		clearElement( host );

		if ( Number.isNaN( totalPages ) || totalPages <= 1 ) {
			return;
		}

		if ( pagination.previousPage ) {
			host.appendChild(
				createPaginationLink(
					pagination.previousPage,
					'wp-block-query-pagination-previous is-style-wp-block-button__link',
					pagination.previousLabel || 'Previous Page'
				)
			);
		}

		var numbers = createElement( 'div', 'wp-block-query-pagination-numbers' );
		for ( var page = 1; page <= totalPages; page++ ) {
			if ( page === current ) {
				var currentItem = createElement( 'span', 'page-numbers current', String( page ) );
				currentItem.setAttribute( 'aria-current', 'page' );
				numbers.appendChild( currentItem );
			} else {
				numbers.appendChild( createPaginationLink( page, 'page-numbers', String( page ) ) );
			}
		}
		host.appendChild( numbers );

		if ( pagination.nextPage ) {
			host.appendChild(
				createPaginationLink(
					pagination.nextPage,
					'wp-block-query-pagination-next is-style-wp-block-button__link',
					pagination.nextLabel || 'Next Page'
				)
			);
		}
	}

	function fetchPosts( page ) {
		currentPage = page;

		if ( currentRequest && typeof currentRequest.abort === 'function' ) {
			currentRequest.abort();
		}

		var controller = new AbortController();
		currentRequest = controller;
		setLoadingState( true );

		return fetch( buildRequestUrl( page ), {
			credentials: 'same-origin',
			signal: controller.signal
		} )
			.then( function ( response ) {
				if ( ! response.ok ) {
					throw new Error( 'Request failed: ' + response.status );
				}
				return response.json();
			} )
			.then( function ( payload ) {
				if ( controller.signal.aborted ) {
					return;
				}

				if ( ! payload || ! payload.success || ! payload.data ) {
					throw new Error( 'Invalid response' );
				}

				var data = payload.data;
				renderArchiveItems( data.items || [], data.message );
				renderPagination( data.pagination || null );
				updateBrowserUrl();
			} )
			.catch( function ( error ) {
				if ( controller.signal.aborted ) {
					return;
				}
				window.console.error( '[ICTS archive filters]', error );
			} )
			.finally( function () {
				if ( controller.signal.aborted ) {
					return;
				}
				setLoadingState( false );
			} );
	}

	function bindPaginationClick() {
		rootQuery.addEventListener( 'click', function ( event ) {
			var target = event.target.closest( 'a[data-icts-page]' );
			if ( ! target ) {
				return;
			}

			event.preventDefault();
			var page = parseInt( target.getAttribute( 'data-icts-page' ), 10 );
			if ( Number.isNaN( page ) || page < 1 ) {
				page = 1;
			}

			fetchPosts( page );
		} );
	}

	function bindControls() {
		var controls = getControlsWrapper();
		var searchInput = controls.querySelector( '#icts-archive-search' );
		var categorySelect = controls.querySelector( '#icts-archive-category' );

		if ( searchInput ) {
			searchInput.value = config.currentSearch || '';
			searchInput.addEventListener( 'input', function () {
				if ( searchTimer ) {
					window.clearTimeout( searchTimer );
				}
				searchTimer = window.setTimeout( function () {
					fetchPosts( 1 );
				}, 250 );
			} );
		}

		if ( categorySelect ) {
			populateCategorySelect( categorySelect );
			categorySelect.addEventListener( 'change', function () {
				fetchPosts( 1 );
			} );
		}
	}

	bindControls();
	bindPaginationClick();
	fetchPosts( config.currentPage || 1 );
} )();
