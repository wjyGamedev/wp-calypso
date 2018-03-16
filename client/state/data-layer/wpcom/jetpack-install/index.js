/** @format */
/**
 * Internal dependencies
 */
import { dispatchRequestEx } from 'state/data-layer/wpcom-http/utils';
import { http } from 'state/data-layer/wpcom-http/actions';
import {
	jetpackRemoteInstallComplete,
	jetpackRemoteInstallUpdateError,
} from 'state/jetpack-remote-install/actions';
import { JETPACK_REMOTE_INSTALL } from 'state/action-types';

export const installJetpackPlugin = action =>
	http(
		{
			method: 'POST',
			path: '/jetpack-install/' + encodeURIComponent( action.url ),
			query: {
				user: action.user,
				password: action.password,
			},
		},
		action
	);

export const handleSuccess = ( { url }, data ) => {
	if ( data.status ) {
		return jetpackRemoteInstallComplete( url );
	}
	return jetpackRemoteInstallUpdateError( url, 'UNKNOWN_ERROR' );
};

export const handleError = ( { url }, error ) => {
	return jetpackRemoteInstallUpdateError( url, error.error, error.message );
};

export default {
	[ JETPACK_REMOTE_INSTALL ]: [
		dispatchRequestEx( {
			fetch: installJetpackPlugin,
			onSuccess: handleSuccess,
			onError: handleError,
		} ),
	],
};
