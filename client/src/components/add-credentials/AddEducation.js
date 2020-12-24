import React, { Component } from 'react'
import {connect} from "react-redux"
import {Link, withRouter} from "react-router-dom"
import PropTypes from "prop-types"
import TextFieldGroup from "../common/TextFieldGroup"
import TextAreaFieldGroup from "../common/TextAreaFieldGroup"
import {addEducation} from "../../actions/profileActions"

class AddEducation extends Component {

    constructor (props) {
        super()

        this.state = {
            school: "",
            degree: "",
            fieldOfStudy: "",
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

        const eduData = {
            school: this.state.school,
            degree: this.state.degree,
            fieldOfStudy: this.state.fieldOfStudy,
            from: this.state.from,
            to: this.state.to,
            current: this.state.current,
            description: this.state.description,
        }

        this.props.addEducation(eduData, this.props.history)

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
                    info = "Enter the end date of your education"
                />
            </div>
        )
    } else {
        ToDate = (
            <div>
            {/* To Component */} 
                <TextFieldGroup
                    name = "to"
                    value = ""
                    type = "text"
                    onChange = {this.onChange}
                    info = "The education is currently in progress"
                    disabled
                />
            </div>
        )  
    }

    return (
      <div className = "add-education">
        <div className = "container">
            <div className = "row">
                <div className = "col-md-8 m-auto">
                    <Link to ="/dashboard" className = "btn btn-light"> 
                        Return to Dashboard
                    </Link>
                    <h1 className = "display-4 text-center">
                        Add Education
                    </h1>
                    <p className = "lead text-center">
                        Add any education or learning experience that you have had in the past or current.
                    </p>
                    <small className = "d-block pb-3">
                        * = required fields
                    </small>

                    <form noValidate onSubmit = {this.onSubmit}>
                        {/* School Component */}
                        <TextFieldGroup 
                            placeholder = "School / Institution"
                            name = "school"
                            type = "text"
                            value = {this.state.school}
                            onChange = {this.onChange}
                            error = {errors.school}
                            info = "Enter the name of the school or institution"
                        />
                        {/* Degree Component */}
                        <TextFieldGroup 
                            placeholder = "Degree / Level of Study"
                            name = "degree"
                            type = "text"
                            value = {this.state.degree}
                            onChange = {this.onChange}
                            error = {errors.degree}
                            info = "Enter the name of the degree you received"
                        />
                        {/* Field Of Study Component */}
                        <TextFieldGroup 
                            placeholder = "Field of Study"
                            name = "fieldOfStudy"
                            type = "text"
                            value = {this.state.fieldOfStudy}
                            onChange = {this.onChange}
                            error = {errors.fieldOfStudy}
                            info = "Enter the field of study for the experience "
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

AddEducation.propTypes = {
    addEducation : PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
    profile: state.profile,
    errors: state.errors
})

export default connect(mapStateToProps, {addEducation})(withRouter(AddEducation))