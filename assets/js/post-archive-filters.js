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

	function getControlsWrapper() {
		var existing = document.querySelector( '.icts-archive-controls' );
		if ( existing ) {
			return existing;
		}

		var controls = document.createElement( 'div' );
		controls.className = 'icts-archive-controls alignwide';
		controls.innerHTML =
			'<div class="icts-archive-controls__search">' +
				'<label class="screen-reader-text" for="icts-archive-search">' + config.i18n.searchLabel + '</label>' +
				'<input id="icts-archive-search" type="search" class="icts-archive-controls__search-input" placeholder="' + config.i18n.searchPlaceholder + '" autocomplete="off" />' +
			'</div>' +
			'<div class="icts-archive-controls__category">' +
				'<label class="screen-reader-text" for="icts-archive-category">' + config.i18n.filterLabel + '</label>' +
				'<select id="icts-archive-category" class="icts-archive-controls__category-select"></select>' +
			'</div>';

		rootQuery.parentNode.insertBefore( controls, rootQuery );
		return controls;
	}

	function populateCategorySelect( select ) {
		select.innerHTML = '';

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

	function renderNoResults() {
		postTemplate.innerHTML =
			'<li class="wp-block-post icts-archive-post-empty">' +
				'<p>' + config.i18n.noResults + '</p>' +
			'</li>';
		var host = ensurePaginationHost();
		host.innerHTML = '';
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
				if ( data.items_html ) {
					postTemplate.innerHTML = data.items_html;
				} else {
					renderNoResults();
				}

				var host = ensurePaginationHost();
				host.innerHTML = data.pagination_html || '';
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
