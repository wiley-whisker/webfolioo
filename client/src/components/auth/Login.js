import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }
  updateError = () => {
    this.setState({ errors: this.props.errors });
  };
  getSnapshotBeforeUpdate(prevProps) {
    return { notify: prevProps.errors !== this.props.errors };
  }
  componentDidUpdate(prevprop, prevstate, snapshot) {
    if (snapshot.notify) {
      this.updateError();
    }

    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(userData);
  };

  fillDemoEmail = () => {
    this.setState({ email: "AwesomeRecruiter@demo.com" });
  };

  fillDemoPassword = () => {
    this.setState({ password: "test123" });
  };
  recruiter = () => {
    //e.preventDefault();
    this.fillDemoEmail();
    this.fillDemoPassword();
    const userData = {
      email: "AwesomeRecruiter@demo.com",
      password: "test123"
    };
    //console.log(userData);
    setTimeout(() => {
      this.props.loginUser(userData);
    }, 500);
  };
  render() {
    const { errors } = this.state;

    return (
      <div className="base-wrapper">
        <div className="auth-header">Sign In</div>
        <form className="auth-form" noValidate onSubmit={this.onSubmit}>
          <div className="auth-group">
            <label>
              <div className="auth-label">Email address</div>
              <input
                onChange={this.onChange}
                value={this.state.email}
                error={errors.email}
                id="email"
                type="email"
                className="auth-input"
              />
              <div className="auth-error">
                {errors.email}
                {errors.emailnotfound}
              </div>
            </label>
          </div>

          <div className="auth-group">
            <label>
              <div className="auth-label">Password</div>
              <input
                onChange={this.onChange}
                value={this.state.password}
                error={errors.password}
                id="password"
                type="password"
                className="auth-input"
              />
              <div className="auth-error">
                {errors.password}
                {errors.passwordincorrect}
              </div>
            </label>
          </div>

          <div>
            <button type="submit" className="auth-button">
              Login
            </button>
          </div>

          <div className="bottom-group">
            <button onClick={this.recruiter}>Demo</button>
            <br />
            <Link to="/register" className="link">
              Sign up
            </Link>
          </div>
        </form>

        <p
          style={{
            position: "relative",
            top: "-83px",
            left: "130px",
            fontSize: "10px",
            fontStyle: "oblique"
          }}
        >
          Are you a recruiter? <br />
          login as Demo
        </p>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { loginUser })(Login);
