import React from 'react';
import connect from 'react-redux/lib/connect/connect';
import Link from 'react-router/lib/Link';

class Login extends React.Component {
    render() {
        // const { settings } = this.props;

        return (<div className="container">
            <h1>Select your ADFS to sign in:</h1>
            <div className="row">
                <div className="col-xs-4 adfs-item">
                    <Link to={process.env.CORE_URL+'signin'}>Local sign in</Link>
                </div>
            </div>
        </div>);
    }
}
function mapStateToProps (state) {
    return {
        settings: state.settings
    };
}
export default connect(mapStateToProps)(Login);
