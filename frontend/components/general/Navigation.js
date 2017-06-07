import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router/lib/Link';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';

//CSS only for browser!
if (process.env.BROWSER) {
    require('../../styles/Navigation.css');
}

export default class Navbar extends React.Component {
    render() {
        const { name, makeRefresh } = this.props;
        console.log('RENDER <Navbar>');

        return (<nav className="navbar navbar-inverse navbar-fixed-top">
            <div className="navbar-header">
                <button type="button" 
                        className="navbar-toggle collapsed"
                        data-toggle="collapse" 
                        data-target="#navbar" 
                        aria-expanded="false" 
                        aria-controls="navbar">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                </button>
                <Link to={process.env.CORE_URL+(name == 'Unknown' ? '' : 'dashboard')} 
                className="navbar-brand"><img src={process.env.CORE_URL+'images/logo.png'} /><span> | Blog </span></Link>
            </div>
            {name != 'Unknown' && <div id="navbar" className="collapse navbar-collapse">
                <ul className="nav navbar-nav navbar-right">
                    <li>
                        <Link to={process.env.CORE_URL+'executive'} className="font16">
                            <span className="glyphicon glyphicon-resize-small font16" />
                        </Link>
                    </li>
                    <li>
                        <a onClick={makeRefresh}><span className="glyphicon glyphicon-refresh font16" /></a>
                    </li>
                    <li>
                        <Link to={process.env.CORE_URL+'settings'} className="font16">
                            <span className="glyphicon glyphicon-cog font16" />
                        </Link>
                    </li>
                    <NavDropdown eventKey="4" title={name} id="nav-dropdown" className="custom-font16">
                        <MenuItem eventKey="4.1" href={process.env.CORE_URL+'oauth2/logout'}>Log out</MenuItem>
                    </NavDropdown>
                </ul>
            </div>}
        </nav>);
    }
}

Navbar.propTypes = {
    name: PropTypes.string.isRequired,
    makeRefresh: PropTypes.func.isRequired
};
