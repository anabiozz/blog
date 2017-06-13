import React from 'react';
import bindActionCreators from 'redux/lib/bindActionCreators';
import connect from 'react-redux/lib/connect/connect';
//Actions
import { sendLocalCredentials, dismissErrorUser } from '../actions/UserActions';

class LocalAuth extends React.Component {
    constructor(...props) {
        super(...props);
        this.send =  this.send.bind(this);
    }
    componentWillMount() {
        this.props.dismissErrorUser();
    }
    send() {
        this.refs.password.style.border = '1px solid #ccc';
        this.refs.name.style.border = '1px solid #ccc';

        if(!this.refs.password.value) {
            return this.refs.password.style.border = '1px solid red';
        }
        if(!this.refs.name.value) {
            return this.refs.name.style.border = '1px solid red';
        }
        this.props.sendLocalCredentials(this.refs);
    }
    render() {
        const { user } = this.props;
        let status = user.fetching ? <span className="status-popup progress-color">Logging...</span> : user.errors ? <span className="status-popup fail-color">Error: {user.errors.message}</span> : null;

        return (
            <div className="container">
                <h1>Local sign in</h1>
                <form>
                    <div className="form-group">
                        <label htmlFor="name">Username</label>
                        <input type="text" className="form-control" name="name" id="name" ref="name" placeholder="Username" />
                    </div>
                    <div className="form-group">
                        <label className="password">Password</label>
                        <input type="password" className="form-control" name="password" id="password" ref="password" placeholder="Password"/>
                    </div>
                    <button type="button" className="btn btn-success" onClick={this.send}>Log in</button>{status}
                </form>
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        user: state.user
    };
}
function mapDispatchToProps(dispatch) {
    return {
        sendLocalCredentials: bindActionCreators(sendLocalCredentials, dispatch),
        dismissErrorUser: bindActionCreators(dismissErrorUser, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(LocalAuth);
