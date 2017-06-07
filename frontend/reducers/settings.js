import { 
    GET_SETTINGS_REQUEST, 
    GET_SETTINGS_SUCCESS, 
    GET_SETTINGS_ERROR, 
    DISMISS_SETTINGS_ERROR, 
    SET_GEN_SETTING,
    SAVE_SETTINGS,
    SAVE_SUCCESS,
    SET_REGION_SETTING,
    DELETE_ADFS,
    RESET_FLAGS } from '../constants/ActionTypes';

const initialState = {
    admins:[],
    fetching: false,
    errors: null,
    success: false
};

export default function settings(state = initialState, action) {
    switch (action.type) {
        case GET_SETTINGS_REQUEST:
            return { ...state, fetching: true };
        case GET_SETTINGS_SUCCESS:
            return { ...state, fetching: false, errors: null };
        case GET_SETTINGS_ERROR:
            return { ...state, errors: action.error, fetching: false };
        case RESET_FLAGS:
            return { ...state, errors: null, success: false, fetching: false };
        case DISMISS_SETTINGS_ERROR:
            return { ...state, errors: null };
        case SET_REGION_SETTING:
            return { ...state };
        case SET_GEN_SETTING:
            var obj = {};
            obj[action.setting.name] = action.setting.value;
            return Object.assign({}, state, obj);
        case SAVE_SETTINGS:
            return { ...state, errors: null, success: false, fetching: true};
        case SAVE_SUCCESS:
            return { ...state, ...action.response, fetching: false, success: true};
        case DELETE_ADFS:
            var filtered = state.adfs.filter(adfs => adfs._id != action.adfs);
            return { ...state, adfs: filtered };
        default:
            return state;
    }
}
