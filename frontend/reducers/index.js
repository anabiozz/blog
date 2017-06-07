import { combineReducers } from 'redux';
import user from './user';
import auth from './auth';
import settings from './settings';

export default combineReducers({
    user,
    auth,
    settings
});
