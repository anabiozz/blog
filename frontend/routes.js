import React from 'react';
// import IndexRoute from 'react-router/lib/IndexRoute';
// import IndexRedirect from 'react-router/lib/IndexRedirect';
import Route from 'react-router/lib/Route';
//Layouts
import Layout from './containers/Layout';
//containers

//components

export default () => {
    const core_url = process.env.CORE_URL ? process.env.CORE_URL : '/';

    return (
        <Route path={core_url} component={Layout} mode={'full'} />
    );
};