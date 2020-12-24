import React, { Component } from 'react'
import {connect} from "react-redux"
import {Link, withRouter} from "react-router-dom"
import PropTypes from "prop-types"
import TextFieldGroup from "../common/TextFieldGroup"
import TextAreaFieldGroup from "../common/TextAreaFieldGroup"
import {addExperience} from "../../actions/profileActions"

class AddExperience extends Component {

    constructor (props) {
        super()

        this.state = {
            company: "",
            title: "",
            location: "",
            from: "",
            to: "",
            current: false,
            description: "",
            errors: {},
            disabled: false
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange (e) {
        this.setState ({[e.target.name]: e.target.value})
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.errors) {
            this.setState ({errors: nextProps.errors})
        }
    }

    onSubmit (e) {
        e.preventDefault();

        const expData = {
            company: this.state.company,
            title: this.state.title,
            location: this.state.location,
            from: this.state.from,
            to: this.state.to,
            current: this.state.current,
            description: this.state.description,
        }

        this.props.addExperience(expData, this.props.history)

    }

  render() {
      const {errors, disabled, current} = this.state
      let ToDate

    if (!disabled) {
        ToDate = (
            <div>
            {/* To Component */} 
                <TextFieldGroup 
                    name = "to"
                    type = "date"
                    value = {this.state.to}
                    onChange = {this.onChange}
                    error = {errors.to}
                    info = "Enter the end date of your experience"
                />
            </div>
        )
    } else {
        ToDate = (
            <div>
            {/* To Component */} 
                <TextFieldGroup
                    name = "to"
                    value = "Currently Ongoing"
                    type = "date"
                    onChange = {this.onChange}
                    info = "The experience is currently in progress"
                    disabled
                />
            </div>
        )  
    }

    return (
      <div className = "add-experience">
        <div className = "container">
            <div className = "row">
                <div className = "col-md-8 m-auto">
                    <Link to ="/dashboard" className = "btn btn-light"> 
                        Return to Dashboard
                    </Link>
                    <h1 className = "display-4 text-center">
                        Add Experience
                    </h1>
                    <p className = "lead text-center">
                        Add any job or position that you have had in the past or current.
                    </p>
                    <small className = "d-block pb-3">
                        * = required fields
                    </small>

                    <form noValidate onSubmit = {this.onSubmit}>
                        {/* Company Component */}
                        <TextFieldGroup 
                            placeholder = "Company"
                            name = "company"
                            type = "text"
                            value = {this.state.company}
                            onChange = {this.onChange}
                            error = {errors.company}
                            info = "Enter the name of the company or employer"
                        />
                        {/* Title Component */}
                        <TextFieldGroup 
                            placeholder = "Title"
                            name = "title"
                            type = "text"
                            value = {this.state.title}
                            onChange = {this.onChange}
                            error = {errors.title}
                            info = "Enter the title of your position or role"
                        />
                        {/* Location Component */}
                        <TextFieldGroup 
                            placeholder = "Location"
                            name = "location"
                            type = "text"
                            value = {this.state.location}
                            onChange = {this.onChange}
                            error = {errors.location}
                            info = "Enter the location of your experience"
                        />
                        {/* From Component */}
                        <TextFieldGroup 
                            name = "from"
                            type = "date"
                            value = {this.state.from}
                            onChange = {this.onChange}
                            error = {errors.from}
                            info = "Enter the start date of your experience"
                        />
                        {ToDate}
                        <input 
                            type = "checkbox"
                            name = "current"
                            onClick = {() => {
                                this.setState(prevState => ({
                                    current: !current,
                                    disabled: !disabled,
                                    to: ""
                                }))
                            }}
                        />
                        &nbsp;&nbsp;Current Experience
                        <br></br>
                        <br></br>
                        {/* Description Component */}
                        <TextAreaFieldGroup 
                            placeholder = "Add a Description"
                            name = "description"
                            type = "text"
                            value = {this.state.description}
                            onChange = {this.onChange}
                            error = {errors.description}
                            info = "Add a description of your experience "
                        />              
                        <input
                            type = "submit"
                            className = "btn btn-info btn-block mt-4"

                        />
                    </form>
                </div>
            </div>
        </div>
      </div>
    )
  }
}

AddExperience.propTypes = {
    addExperience : PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
    profile: state.profile,
    errors: state.errors
})
export default connect(mapStateToProps, {addExperience})(withRouter(AddExperience))