( function () {
	'use strict';

	var config = window.ictsSentryConfig || {};
	var sentry = window.Sentry;

	if ( ! sentry || ! config.dsn ) {
		return;
	}

	function getExceptionValue( event ) {
		var values = event && event.exception && event.exception.values;
		var firstValue = values && values.length ? values[ 0 ] : null;

		return firstValue && firstValue.value ? firstValue.value : '';
	}

	function eventReferences( event, needle ) {
		var text;

		try {
			text = JSON.stringify( event );
		} catch ( error ) {
			text = '';
		}

		return text.indexOf( needle ) !== -1;
	}

	function isAnalyticsFetchNoise( event ) {
		return (
			getExceptionValue( event ) === 'Failed to fetch' &&
			eventReferences( event, '/wp-admin/admin-ajax.php' ) &&
			eventReferences( event, 'analyticswp' )
		);
	}

	sentry.init( {
		dsn: config.dsn,
		environment: config.environment || 'production',
		release: config.release || undefined,
		sendDefaultPii: false,
		tracesSampleRate: 0,
		beforeSend: function ( event ) {
			if ( isAnalyticsFetchNoise( event ) ) {
				return null;
			}

			if ( event ) {
				delete event.user;
			}

			return event;
		},
	} );

	sentry.setTag( 'theme', 'icts-europe' );

	if ( config.themeVersion ) {
		sentry.setTag( 'theme_version', config.themeVersion );
	}

	if ( config.pageTemplate ) {
		sentry.setTag( 'page_template', config.pageTemplate );
	}

	function getStorage() {
		try {
			var testKey = '__icts_sentry_test__';
			window.sessionStorage.setItem( testKey, '1' );
			window.sessionStorage.removeItem( testKey );
			return window.sessionStorage;
		} catch ( error ) {
			return null;
		}
	}

	function capturePossibleCrash( previousState ) {
		sentry.withScope( function ( scope ) {
			scope.setLevel( 'warning' );
			scope.setTag( 'signal', 'possible_previous_page_crash' );
			scope.setExtra( 'previous_state', previousState );
			scope.setExtra( 'current_url', window.location.href );
			sentry.captureMessage( 'Possible previous page crash or forced reload' );
		} );
	}

	function initPossibleCrashMonitor() {
		var storage = getStorage();

		if ( ! storage ) {
			return;
		}

		var key = 'icts_sentry_page_state:' + window.location.pathname;
		var now = Date.now();
		var previousState = null;

		try {
			previousState = JSON.parse( storage.getItem( key ) || 'null' );
		} catch ( error ) {
			previousState = null;
		}

		if (
			previousState &&
			previousState.active &&
			! previousState.cleanExit &&
			now - previousState.timestamp < 10 * 60 * 1000
		) {
			capturePossibleCrash( previousState );
		}

		var currentState = {
			active: true,
			cleanExit: false,
			timestamp: now,
			url: window.location.href,
			userAgent: window.navigator && window.navigator.userAgent ? window.navigator.userAgent : '',
		};

		storage.setItem( key, JSON.stringify( currentState ) );

		window.addEventListener( 'pagehide', function () {
			currentState.active = false;
			currentState.cleanExit = true;
			currentState.timestamp = Date.now();
			storage.setItem( key, JSON.stringify( currentState ) );
		} );
	}

	initPossibleCrashMonitor();
}() );
