import React from 'react';
import IndexRoute from 'react-router/lib/IndexRoute';
// import IndexRedirect from 'react-router/lib/IndexRedirect';
import Route from 'react-router/lib/Route';
//Layouts
import Layout from './containers/Layout';
//containers
import Login from './containers/Login';
import LocalAuth from './containers/LocalAuth';
//components

export default (user) => {
    function requireAuth(nextState, replace) {
        if (!user) {
            replace({
                pathname: '/'
            });
        }
    }
    function hasLogin(nextState, replace) {
        if (user && user.name != 'Unknown') {
            replace({
                pathname: '/dashboard'
            });
        }
    }
    const core_url = process.env.CORE_URL ? process.env.CORE_URL : '/';

    return (
        <Route path={core_url} component={Layout} mode={'full'}>
            <IndexRoute component={Login} onEnter={hasLogin} />
            <Route path="signin" component={LocalAuth} onEnter={hasLogin} />
            <Route path="dashboard" onEnter={requireAuth}/>
         </Route>
    );
};