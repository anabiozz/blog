import React from 'react';
import connect from 'react-redux/lib/connect/connect';
import Navbar from '../components/general/Navigation';

class Layout extends React.Component {
	constructor(...props) {
		super(...props);

		this.state = {
			refresher: null
		};
		this.getRefresher = this.getRefresher.bind(this);
		this.makeRefresh = this.makeRefresh.bind(this);
	}
	makeRefresh() {
		console.log('<Layout> makeRefresh');
		this.state.refresher ? this.state.refresher() : console.error('[ERROR] Could not make refresh, method isn\'t defined');
	}
	getRefresher(refresher) {
		console.log('<Layout> getRefresher');
		this.setState({ refresher });
	}
	render() {
		const { user } = this.props;
		console.log('RENDER <Layout>');

		const childrenWithProps = React.Children.map(this.props.children,
            (child) => React.cloneElement(child, {
				getRefresher: this.getRefresher
			})
        );
		return (<div className="container-fluid">
            <Navbar name={user.name} makeRefresh={this.makeRefresh} mode={this.props.route.mode} />
            {childrenWithProps}
        </div>);
	}
}

function mapStateToProps (state) {
	return {
		user: state.user
	};
}

export default connect(mapStateToProps)(Layout);
