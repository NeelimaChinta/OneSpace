import React, { Component } from 'react'
import Moment from "react-moment"
import isEmpty from "../../validation/is-empty"

class ProfileCreds extends Component {
    render() {
        const {experience, education} = this.props

        const experiences = experience.map((experience) => (
            <li key = {experience._id} className="list-group-item">
                <h4>
                    {experience.company}
                </h4>
                <p>
                    <Moment format= "YYYY-MM-DD">
                        {experience.from}
                    </Moment>
                    &nbsp;-&nbsp;
                    {isEmpty(experience.to) ? "Current" :
                        <Moment format ="YYYY-MM-DD">
                            {experience.to}
                        </Moment>
                    }
                </p>
                <p>
                    <strong>
                        Position:
                    </strong> 
                    &nbsp;{experience.title}
                </p>
                {isEmpty(experience.location) 
                    ? "" 
                    : <p>
                        <strong>
                            Description: 
                        </strong> 
                        &nbsp; {experience.location}
                      </p>
                }
                {isEmpty(experience.description) 
                    ? "" 
                    : <p>
                        <strong>
                            Description: 
                        </strong> 
                        &nbsp; {experience.description}
                      </p>
                }
            </li>
        ))

        const educations = education.map((education) => (
            <li key = {education._id} className="list-group-item">
                <h4>
                    {education.school}
                </h4>
                <p>
                    <Moment format= "YYYY-MM-DD">
                        {education.from}
                    </Moment>
                    &nbsp;-&nbsp;
                    {isEmpty(education.to) ? "Current" :
                        <Moment format ="YYYY-MM-DD">
                            {education.to}
                        </Moment>
                    }
                </p>
                <p>
                    <strong>
                        Degree:
                    </strong> 
                    &nbsp;{education.degree}
                </p>
                <p>
                    <strong>
                        Field Of Study:
                    </strong> 
                    &nbsp;{education.fieldOfStudy}
                </p>
                {isEmpty(education.description) 
                    ? "" 
                    : <p>
                        <strong>
                            Description: 
                        </strong> 
                        &nbsp; {education.description}
                      </p>
                }
            </li>
        ))
        
        return (
            <div className="row">
                <div className="col-md-6">
                    <h3 className="text-center text-info">
                        Experience
                    </h3>
                    <ul className="list-group">
                        {experiences}
                    </ul>
                </div>

                <div className="col-md-6">
                    <h3 className="text-center text-info">
                        Education
                    </h3>
                    <ul className="list-group">
                        {educations}
                    </ul>
                </div>
            </div>
        )
    }
}

export default ProfileCreds