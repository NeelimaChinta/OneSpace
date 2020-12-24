import React, { Component } from "react";
import PropTypes from "prop-types"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import { registerUser } from "../../actions/authActions"
import TextFieldGroup from "../common/TextFieldGroup"

class Register extends Component {

  /* Constructor */
  constructor() {
    super();
    this.state = {
      name : "",
      email : "",
      password : "",
      password2 : "",
      errors : {}
    };

    this.onChange = this.onChange.bind (this)
    this.onSubmit = this.onSubmit.bind (this)
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard")
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if(nextProps.errors) {
      this.setState({errors: nextProps.errors})
    }
  }

  /* On Change Function */
  onChange (e) {
    this.setState ({[e.target.name]: e.target.value})
  }

  onSubmit (e) {
    e.preventDefault();

    const newUser = {
      name : this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    } 

    this.props.registerUser(newUser, this.props.history);
  }

  render() {

    const { errors } = this.state

    return (
      <div>
        <div className="register">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto">
                {/* sign-up header */}
                <h1 className="display-4 text-center">
                  Sign Up
                </h1>
                <p className="lead text-center">
                  Create your OneSpace account
                </p>
                {/* sign up form */}
                <form noValidate onSubmit = {this.onSubmit}>
                  
                  {/* Name Component */}
                  <TextFieldGroup
                    name = "name"
                    placeholder = "Name"
                    value = {this.state.name}
                    error = {errors.name}
                    onChange = {this.onChange}
                    type = "text"
                  />

                  {/* Email Component */}
                  <TextFieldGroup
                    name = "email"
                    placeholder = "Email"
                    value = {this.state.email}
                    error = {errors.email}
                    onChange = {this.onChange}
                    type = "email"
                    info = "This site uses Gravatar. If you want a profile image, use a Gravatar-registered email"
                  />


                {/* Password Component */}
                <TextFieldGroup
                  name = "password"
                  placeholder = "Password"
                  value = {this.state.password}
                  error = {errors.password}
                  onChange = {this.onChange}
                  type = "password"
                />

                {/* Confirm Password Component */}
                <TextFieldGroup
                  name = "password2"
                  placeholder = "Confirm Password"
                  value = {this.state.password2}
                  error = {errors.password2}
                  onChange = {this.onChange}
                  type = "password"
                />               
                {/* submit button */}
                  <input 
                    type="submit" 
                    className="btn btn-info btn-block mt-4" 
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
})

export default connect(mapStateToProps, {registerUser})(withRouter (Register));
