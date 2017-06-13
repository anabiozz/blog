import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router/lib/Link';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';

export default class Navbar extends React.Component {
    render() {
        const { name } = this.props;
        console.log('RENDER <Navbar>');

        return (<nav className="navbar navbar-default navbar-fixed-top">
            {
                    name != 'Unknown' && <div id="navbar" className="collapse navbar-collapse">

                    <ul className="nav navbar-nav">
                        <li><a href="#">home</a></li>
                        <li><a href="#">blog</a></li>
                    </ul>

                    <ul className="nav navbar-nav navbar-right">
                        <li>
                            <Link to={process.env.CORE_URL+'settings'} className="font16">
                                <span className="glyphicon glyphicon-cog font16" />
                            </Link>
                        </li>
                        <NavDropdown eventKey="4" title={name} id="nav-dropdown" >
                            <MenuItem eventKey="4.1" href={process.env.CORE_URL+'oauth2/logout'}>Log out</MenuItem>
                        </NavDropdown>
                    </ul>
                </div>
            }
        </nav>);
    }
}

Navbar.propTypes = {
    name: PropTypes.string.isRequired,
    makeRefresh: PropTypes.func.isRequired
};
