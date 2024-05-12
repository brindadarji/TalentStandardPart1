/* Self introduction section */
import React, { Component } from 'react';
import Cookies from 'js-cookie'
import { ChildSingleInput } from '../Form/SingleInput.jsx';

export default class SelfIntroduction extends React.Component {
    constructor(props) {
        super(props);

        const selfIntroDetails = props.selfIntroDetails ?
            Object.assign({}, props.selfIntroDetails)
            : {
            }

        this.state = {
            showEditSection: false,
            newSelfIntro: selfIntroDetails,
            
        }

        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveSumDes = this.saveSumDes.bind(this);
        this.renderEdit = this.renderEdit.bind(this);
        this.renderDisplay = this.renderDisplay.bind(this);
    };


    openEdit() {
        const selfIntroDetails = Object.assign({}, this.props.selfIntroDetails);
        this.setState({
            showEditSection: true,
            newSelfIntro: selfIntroDetails,
        });
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        });
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.newSelfIntro);
        data[event.target.name] = event.target.value;
        this.setState({
            newSelfIntro: data
        });
    }

    saveSumDes() {
        const data = Object.assign({}, this.state.newSelfIntro);
        this.props.controlFunc(this.props.componentId, data);
        this.closeEdit();
    }

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

    renderEdit() {
        return (
            <div className='ui sixteen wide column'>
                
                        <ChildSingleInput
                            className="four wide field"
                            inputType="text"
                            label=""
                            name="summary"
                            value={this.state.newSelfIntro.summary}
                            controlFunc={this.handleChange}
                            maxLength={150}
                            placeholder="Please provide a short summary about yourself"
                            errorMessage="Please enter a valid summary"
                />

                <p>Summary must be no more than 150 characters.</p>

                <textarea
                    placeholder="Please tell us about any hobbies, additional expertise, or anything else you'd like to add"
                    name="description"
                    value={this.state.newSelfIntro.description}
                    onChange={this.handleChange}
                    rows="6"
                />
               <p></p>
                <p>Description must be between 150-600 characters.</p>
                <button type="button" className="ui button btn-des" onClick={this.closeEdit}>Cancel</button>
                <button type="button" className="ui teal button btn-des" onClick={this.saveSumDes}>Save</button>
                
            </div>
        )
    }

    renderDisplay() {
        let sum = this.props.selfIntroDetails && this.props.selfIntroDetails.summary ? this.props.selfIntroDetails.summary : "";
        let des = this.props.selfIntroDetails && this.props.selfIntroDetails.description ? this.props.selfIntroDetails.description : "";
        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>Summary: {sum} </p>
                        <p>Description: {des} </p>
                    </React.Fragment>
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
                </div>
            </div>

        )
    }
}



