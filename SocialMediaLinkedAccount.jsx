/* Social media JSX */
import React, { Component } from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Popup } from 'semantic-ui-react';

export default class SocialMediaLinkedAccount extends React.Component {
    constructor(props) {
        super(props)

         const linkedDetails = props.linkedDetails ?
         Object.assign({}, props.linkedDetails)
             : {
                 linkedIn: '',
                 github:''
        }

        this.state = {
            showEditSection: false,
            newLinked: linkedDetails
        }
        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveLinked = this.saveLinked.bind(this);
        this.renderEdit = this.renderEdit.bind(this);
        this.renderDisplay = this.renderDisplay.bind(this);
    }

    openEdit() {
        const linkedDetails = Object.assign({}, this.props.linkedDetails);
        this.setState({
            showEditSection: true,
            newLinked: linkedDetails
        });
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        });
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.newLinked);
        data[event.target.name] = event.target.value;
        this.setState({
            newLinked: data
        });
    }

    saveLinked() {
        const data = {
            linkedIn: this.state.newLinked.linkedIn,
            github: this.state.newLinked.github
        };
        this.props.controlFunc(this.props.componentId, { linkedAccounts: data });
        this.closeEdit();
    }

    componentDidMount() {
        $('.ui.button.social-media')
            .popup();
    }

    
    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }


    renderDisplay() {
        const linkedUrl = this.props.linkedDetails && this.props.linkedDetails.linkedIn ? this.props.linkedDetails.linkedIn : '';
        const gitUrl = this.props.linkedDetails && this.props.linkedDetails.github ? this.props.linkedDetails.github : '';

        return (
            <div className='linkedaccount-div'>
                <a href={linkedUrl} target="_blank" rel="noopener noreferrer">
                    <button type="button" className="ui compact linkedin button linked-btn"><i aria-hidden="true" className="linkedin icon"></i> LinkedIn</button>
               </a>
                <a href={gitUrl} target="_blank" rel="noopener noreferrer">
                    <button type="button" className='ui compact secondary github button linked-btn'><i aria-hidden="true" className="github icon"></i> GitHub</button>
                </a>
                <button type="button" className='ui secondary button linkedaccount-editbutton' onClick={this.openEdit}>Edit</button> 
            </div>
        )
    }

    renderEdit() {
        return (
            <div className='ui sixteen wide column'>
                <ChildSingleInput
                    inputType="text"
                    label="LinkedIn"
                    name="linkedIn"
                    value={this.state.newLinked.linkedIn}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter your LinkedIn URL"
                    errorMessage="Please enter a valid LinkedIn URL"
                />
                <ChildSingleInput
                    inputType="text"
                    label="GitHub"
                    name="github"
                    value={this.state.newLinked.github}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter your GitHub URL"
                    errorMessage="Please enter a valid GitHub URL"
                />

                <button type="button" className="ui teal button" onClick={this.saveLinked}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
            </div>
           
        )
    }

}