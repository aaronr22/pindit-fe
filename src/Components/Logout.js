import React from 'react';
import {GoogleLogout} from 'react-google-login';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT;

export class Logout extends React.Component {

    render() {
    return (
        <div style={{float:'right'}}>
            <GoogleLogout
                clientId={clientId}
                buttonText="Logout"
                onLogoutSuccess={this.props.onSuccess}
            />
        </div>
    );
    }
}

export default Logout;