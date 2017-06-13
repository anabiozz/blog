import browserHistory from 'react-router/lib/browserHistory';
import {
//  SET_USER_TIMEFRAME,
  SAVE_USER_SUCCESS,
  SAVE_USER_ERROR,
  DISMISS_USER_ERROR,
  DISMISS_USER_SUCCESS,
  SET_USER_PARAMS,
  SEND_LOCAL_CREDENTIALS
} from '../constants/ActionTypes';
import fetch from 'isomorphic-fetch';

const receiveSuccess = response => ({ type: SAVE_USER_SUCCESS, response });
const receiveFail = error => ({ type: SAVE_USER_ERROR, error });

export function addParamToPref(params) {
  return (dispatch, getState) => {
    dispatch({
        type: SET_USER_PARAMS, params: params
    });

    //Save user
    let domain = '';
    if (typeof window !== 'undefined') {
        domain = window.location.origin+process.env.CORE_URL;
    }
    let user = getState().user;
    return fetch(domain + 'api/users/'+user._id, {
        method: 'put',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then((response) => {
        if (!response.error) {
            return response;
        } else {
            let error = new Error(response.message);
            error.response = response;
            throw error;
        }
    })
    .then(response => dispatch(receiveSuccess(response)))
    .catch(error => dispatch(receiveFail(error)));
  };
}

export function sendLocalCredentials(refs) {
	return (dispatch) => {
		dispatch({
			type: SEND_LOCAL_CREDENTIALS
		});
		let domain = '';
		if (typeof window !== 'undefined') {
			domain = window.location.origin+process.env.CORE_URL;
		}
		fetch(domain + 'login/local', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: refs.name.value,
                password: refs.password.value
            })
        })
        .then(response => {
            if( 200 == response.status ) {
                return response;
            } else if( 401 == response.status ) {
                throw new Error('Login name or password are incorrect');
            } else {
                throw new Error('Cannot send request. Response status ' + response.status);
            }
        })
        .then(response => response.json())
        .then(response => {
            dispatch(receiveSuccess(response));
            browserHistory.push(response.redirectURL);
        })
        .catch(error => dispatch(receiveFail(error)));
    };
}


export function dismissErrorUser() {
    return (dispatch) => {
        return dispatch({
            type: DISMISS_USER_ERROR
        });
    };
}
export function dismissSuccessUser() {
    return (dispatch) => {
        return dispatch({
            type: DISMISS_USER_SUCCESS
        });
    };
}