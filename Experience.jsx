﻿/* Experience section */
import React from 'react';
import Cookies from 'js-cookie';
import { Icon } from 'semantic-ui-react'
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { validateRequiredFields } from '../Form/validation.jsx';

export default class Experience extends React.Component {
    constructor(props) {
        super(props);

        const experienceData = props.experienceData ?
            Object.assign({}, props.experienceData)
            : {

            }

        this.state = {
            showAddSection: false,
            showEditSection: false,
            addExperience: { company: '', position: '', start: '', end: '', responsibilities: '' },
            editExperience: { id: '', company: '', position: '', start: '', end: '', responsibilities: '' },
        }

        this.handleAddChange = this.handleAddChange.bind(this);
        this.handleEditChange = this.handleEditChange.bind(this);
        this.renderAddExp = this.renderAddExp.bind(this);
        this.closeAdd = this.closeAdd.bind(this);
        this.openAdd = this.openAdd.bind(this);
        this.saveExperience = this.saveExperience.bind(this);
        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);

    };

    closeAdd() {
        this.setState({ showAddSection: false, addExperience: { company: '', position: '', start: '', end: '', responsibilities: '' } });
    }

    openAdd() {
        this.setState({
            showAddSection: true,
        });
    }

    openEdit(selectedExpID) {
        if (!selectedExpID) {
            TalentUtil.notification.show("Please select an experience to edit", "error", null, null);
            return;
        }
        const experienceData = Object.assign([], this.props.experienceData);
        const selectedExperience = experienceData.find(exp => exp.id === selectedExpID);
        this.setState({ showEditSection: true, editExperience: selectedExperience });
    }

    closeEdit() {
        this.setState({ showEditSection: false, editLanguage: { company: '', position: '', start: '', end: '', responsibilities: '' } });
    }

    handleAddChange(event) {
        const data = Object.assign({}, this.state.addExperience);
        data[event.target.name] = event.target.value;
        this.setState({
            addExperience: data
        });
    }

    handleEditChange(event) {
        const data = Object.assign({}, this.state.editExperience);
        data[event.target.name] = event.target.value;
        this.setState({
            editExperience: data
        });
    }

    handleExperienceSave() {
        const data = Object.assign([], this.props.experienceData);
        data.push(this.state.addExperience);
        this.props.controlFunc(this.props.componentId, { experience: data });
        this.closeAdd();
        this.setState({
            addExperience: []
        });
    }

    handleExperienceDelete(selectedExpID) {
        if (!selectedExpID) {
            TalentUtil.notification.show("Please select an experience to delete", "error", null, null);
            return;
        }
        const data = Object.assign([], this.props.experienceData);
        const deletedData = data.filter(experience => experience.id !== selectedExpID);
        this.props.controlFunc(this.props.componentId, { experience: deletedData });
    }

    handleExperienceEdit(selectedExpID) {
        if (!selectedExpID) {
            TalentUtil.notification.show("Please select an experience to edit", "error", null, null);
            return;
        }
        let data = Object.assign([], this.props.experienceData);
        const expToUpdate = data.findIndex(item => item.id === selectedExpID);
        const updatedArray = [
            ...data.slice(0, expToUpdate),
            this.state.editExperience,
            ...data.slice(expToUpdate + 1)
        ];
        data = updatedArray;
        this.props.controlFunc(this.props.componentId, { experience : data });
        this.closeEdit();
        this.setState({
            editExperience: []
        });
    }

    saveExperience() {
        const { company, position, start, end, responsibilities } = this.state.addExperience;
       
        const requiredFields = {
            "Company": company,
            "Position": position,
            "Start Date": start,
            "End Date": end,
            "Responsibilities": responsibilities,
        };

        const errorMessage = validateRequiredFields(requiredFields);

        if (errorMessage) {
            TalentUtil.notification.show(errorMessage, "error", null, null);
            return;
        }
        else {
            const experienceToSave = {
                company,
                position,
                start,
                end,
                responsibilities
            };

            let cookies = Cookies.get('talentAuthToken');
            try {
                $.ajax({
                    url: 'https://talentservicesprofile20240417233610.azurewebsites.net/profile/profile/addExperience',
                    headers: {
                        'Authorization': 'Bearer ' + cookies,
                        'Content-Type': 'application/json'
                    },
                    type: "POST",
                    dataType: "json",
                    data: JSON.stringify(experienceToSave),
                    success: function (res) {
                        if (res.success) {
                            this.setState({
                                addExperience: {
                                    company: this.state.addExperience.company,
                                    position: this.state.addExperience.position,
                                    start: this.state.addExperience.start,
                                    end: this.state.addExperience.end,
                                    responsibilities: this.state.addExperience.responsibilities,
                                    id: res.experience.id
                                }
                            });
                            this.handleExperienceSave();
                        }
                        else {
                            TalentUtil.notification.show("Experience did not add successfully", "error", null, null);
                        }
                    }.bind(this),
                    error: function (res) {
                        console.error('Error:', res.status);
                    }
                })
            }
            catch (error) {
                console.log("An error occurred during add experience request:", error);
            }
        }
    }

    editExperience(selectedExpID) {
        if (!selectedExpID) {
            TalentUtil.notification.show("Please select an experience to edit", "error", null, null);
            return;
        }
        const { company, position, start, end, responsibilities } = this.state.editExperience;
        const requiredFields = {
            "Company": company,
            "Position": position,
            "Start Date": start,
            "End Date": end,
            "Responsibilities": responsibilities,
        };

        const errorMessage = validateRequiredFields(requiredFields);

        if (errorMessage) {
            TalentUtil.notification.show(errorMessage, "error", null, null);
            return;
        }
        else {
            const experienceToEdit = {
                company,
                position,
                start,
                end,
                responsibilities
            }
            let cookies = Cookies.get('talentAuthToken');
            try {
                $.ajax({
                    url: 'https://talentservicesprofile20240417233610.azurewebsites.net/profile/profile/updateExperience?id=' + selectedExpID,
                    headers: {
                        'Authorization': 'Bearer ' + cookies,
                        'Content-Type': 'application/json'
                    },
                    type: "POST",
                    dataType: "json",
                    data: JSON.stringify(experienceToEdit),
                    success: function (res) {
                        if (res.success) {
                            this.handleExperienceEdit(selectedExpID);
                        }
                        else {
                            TalentUtil.notification.show("Experience did not edit successfully", "error", null, null);
                        }

                    }.bind(this),
                    error: function (res) {
                        console.error('Error:', res.status);
                    }
                })
            }
            catch (error) {
                console.log("An error occurred during edit experience request:", error);
            }
        }
    }

    deleteExperience(selectedExpID) {
        if (!selectedExpID) {
            TalentUtil.notification.show("Please select an experience to delete", "error", null, null);
            return;
        }
        let cookies = Cookies.get('talentAuthToken');
        try {
            $.ajax({
                url: 'https://talentservicesprofile20240417233610.azurewebsites.net/profile/profile/deleteExperience/?id=' + selectedExpID,
                headers: {
                    'Authorization': 'Bearer ' + cookies,
                    'Content-Type': 'application/json'
                },
                type: "DELETE",
                dataType: "json",

                success: function (res) {
                    if (res.success) {
                        this.handleExperienceDelete(selectedExpID);
                        TalentUtil.notification.show("Experience deleted sucessfully", "success", null, null);
                    } else {
                        TalentUtil.notification.show("Experience did not delete successfully", "error", null, null);
                    }

                }.bind(this),
                error: function (res) {
                    console.error('Error:', res.status);
                }
            })
        }
        catch (error) {
            console.log("An error occurred during delete language request:", error);
        }
    }

    formatDate(datestring) {
        const date = new Date(datestring);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        
        let suffix;
        if (day === 1 || day === 21 || day === 31) {
            suffix = "st";
        } else if (day === 2 || day === 22) {
            suffix = "nd";
        } else if (day === 3 || day === 23) {
            suffix = "rd";
        } else {
            suffix = "th";
        }

        return `${day}${suffix} ${month}, ${year}`;
    }
    
    render() {
        let contents = this.renderExpTable();
        let addExperience = this.state.showAddSection ? this.renderAddExp() : ''
        return (
            <div className='ui sixteen wide column'>
                {addExperience}
                {contents}
            </div>
        )
    }

    renderTableRow(exp) {
        return (
            <tr key={exp.id}>
                <td>{exp.company}</td>
                <td>{exp.position}</td>
                <td>{exp.responsibilities}</td>
                <td>{this.formatDate(exp.start)}</td>
                <td>{this.formatDate(exp.end)}</td>
                <td>{
                    <div>
                        <Icon className='close large link icon addnew_btn' onClick={() => this.deleteExperience(exp.id)}></Icon>
                        <Icon className='pencil alternate large link icon addnew_btn' onClick={() => this.openEdit(exp.id)}></Icon>
                    </div>
                }
                </td>
            </tr>
        )
    }

    renderExpData() {
        const experience = Array.isArray(this.props.experienceData) ? this.props.experienceData : [];
        return (
            experience.map((exp) => (
                this.state.showEditSection && this.state.editExperience.id === exp.id
                    ? this.renderEdit(exp)
                    : this.renderTableRow(exp)
            ))
        )
    }

    renderExpTable() {
        return (
            <div className='ui sixteen wide column'>
                <table className="ui single line table">
                    <thead className="">
                        <tr className="">
                            <th className>Company</th>
                            <th className>Position</th>
                            <th className>Responsibilities</th>
                            <th className>Start</th>
                            <th className>End</th>
                            <th className=''>
                                <button type="button" className="ui teal button addnew_btn" onClick={this.openAdd}><Icon name='add'></Icon>Add New</button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderExpData()}
                    </tbody>
                </table>
            </div>
        )
    }

    renderAddExp() {
        return (
            <div className='ui sixteen wide column'>
                <div className='ui fields'>
                    <div className='eight wide field'>
                        <ChildSingleInput
                            inputType="text"
                            name="company"
                            label="Company:"
                            controlFunc={this.handleAddChange}
                            maxLength={80}
                            placeholder="Add Company"
                            errorMessage="Please enter a valid company"
                        />
                    </div>
                    <div className='eight wide field'>
                         <ChildSingleInput
                                inputType="text"
                                name="position"
                                label="Position:"
                                controlFunc={this.handleAddChange}
                                maxLength={80}
                                placeholder="Add Position"
                                errorMessage="Please enter a valid position"
                            />
                    </div>
                </div>

                <div className='ui fields'>
                    <div className='eight wide field'>
                        <ChildSingleInput
                            inputType="date"
                            name="start"
                            label="Start Date:"
                            controlFunc={this.handleAddChange}
                            maxLength={80}
                            placeholder="Add start date"
                            errorMessage="Please enter a valid start date"
                        />
                    </div>
                    <div className='eight wide field'>
                        <ChildSingleInput
                            inputType="date"
                            name="end"
                            label="End Date:"
                            controlFunc={this.handleAddChange}
                            maxLength={80}
                            placeholder="Add end date"
                            errorMessage="Please enter a valid end date"
                        />
                    </div>
                </div>

                <div className='ui fields'>
                    <div className='sixteen wide field'>
                        <ChildSingleInput
                            inputType="text"
                            name="responsibilities"
                            label="Responsibilities:"
                            controlFunc={this.handleAddChange}
                            maxLength={80}
                            placeholder="Add Responsibilities"
                            errorMessage="Please enter a valid responsibilities"
                        />
                    </div>
                </div>

               <div className="ui fields">
                   <div className='sixteen wide field'>
                        <button type="button" className="ui teal button" onClick={this.saveExperience}>Save</button>
                        <button type="button" className="ui button" onClick={this.closeAdd}>Cancel</button>
                   </div>
               </div> 
            </div>
        )
    }

    renderEdit(exp) {
        let startDate = '';
        let endDate = '';

        if (this.state.editExperience.start && this.state.editExperience.start.length > 0) {
            startDate = this.state.editExperience.start.split('T')[0];
        }

        if (this.state.editExperience.end && this.state.editExperience.end.length > 0) {
            endDate = this.state.editExperience.end.split('T')[0];
        }

        return (
            <tr key={exp.id}>
            <td colSpan="6">
            <div className='ui sixteen wide column'>
                <div className='ui fields'>
                    <div className='eight wide field'>
                         <ChildSingleInput
                                inputType="text"
                                name="company"
                                label="Company"
                                value={this.state.editExperience.company}
                                controlFunc={this.handleEditChange}
                                maxLength={80}
                                placeholder="Edit Language"
                                errorMessage="Please enter a valid Language"
                          />
                    </div>
                    <div className='eight wide field'>
                        <ChildSingleInput
                            inputType="text"
                            name="position"
                            label="Position"
                            value={this.state.editExperience.position}
                            controlFunc={this.handleEditChange}
                            maxLength={80}
                            placeholder="Edit Language"
                            errorMessage="Please enter a valid Language"
                         />
                    </div>
            </div>
            <div className='ui fields'>
                    <div className='eight wide field'>
                        <ChildSingleInput
                                inputType="date"
                                name="start"
                                label="Start date:"
                                value={startDate}
                                controlFunc={this.handleEditChange}
                                maxLength={80}
                                placeholder="Edit Language"
                                errorMessage="Please enter a valid Language"
                            />
                    </div>
                    <div className='eight wide field'>
                        <ChildSingleInput
                                inputType="date"
                                name="end"
                                label="End date:"
                                value={endDate}
                                controlFunc={this.handleEditChange}
                                maxLength={80}
                                placeholder="Edit Language"
                                errorMessage="Please enter a valid Language"
                            />
                    </div>
            </div>

        <div className='ui fields'>
            <div className='sixteen wide field'>
                <ChildSingleInput
                    inputType="text"
                    name="responsibilities"
                    label="Responsibilities:"
                    value={this.state.editExperience.responsibilities}
                    controlFunc={this.handleEditChange}
                    maxLength={80}
                    placeholder="Edit Language"
                    errorMessage="Please enter a valid Language"
                  />
             </div>
        </div>
        <div className='ui fields'>
            <div className='sixteen wide field'>
                    <button type="button" className="ui blue basic button" onClick={() => this.editExperience(exp.id)}>Update</button>
                    <button type="button" className="ui red basic button" onClick={() => this.closeEdit()}>Cancel</button>
            </div>
        </div>

     </div>
     </td>
     </tr>
      )
    }

}

