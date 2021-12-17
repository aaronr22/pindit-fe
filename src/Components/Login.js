import React from "react";
import { GoogleLogin } from "react-google-login";
import { refreshTokenSetup } from "../utils/refreshToken";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT;

export class Login extends React.Component {

  onFailure = res => {
    console.log("[Login Failed] res:", res);
  };

  render() {
    return (
      <div style={{float:'right'}}>
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT}
          buttonText="Login"
          onSuccess={this.props.onSuccess}
          onFailure={this.onFailure}
          // cookiePolicy={"single_host_origin"}
          // style={{ marginTop: "9rem" }}
          // isSignedIn={true}
        />
      </div>
    );
  }
}

export default Login;
