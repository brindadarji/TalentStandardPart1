﻿/* Experience section */
import React from 'react';
import Cookies from 'js-cookie';
import { Icon } from 'semantic-ui-react'
import { ChildSingleInput } from '../Form/SingleInput.jsx';
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
            newExperience: [],
        }

        this.handleChange = this.handleChange.bind(this)
        this.renderAdd = this.renderAdd.bind(this)
        this.closeAdd = this.closeAdd.bind(this)
        this.openAdd = this.openAdd.bind(this)
        this.saveExperience = this.saveExperience.bind(this)
        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)

    };

    closeAdd() {
        this.setState({ showAddSection: false })
    }

    openAdd() {
        this.setState({
            showAddSection: true,
        })
    }

    openEdit(index) {
        const experienceData = Object.assign([], this.props.experienceData);
        const selectedRecord = experienceData.find(exp => exp.id === index);
        this.setState({ showEditSection: true, newExperience: selectedRecord })
    }

    closeEdit() {
        this.setState({ showEditSection: false, newExperience: [] })
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.newExperience)
        data[event.target.name] = event.target.value
        this.setState({
            newExperience: data
        })
    }

    handleExperienceSave() {
        const data = Object.assign([], this.props.experienceData);
        data.push(this.state.newExperience);
        this.props.controlFunc(this.props.componentId, { experience: data });
        this.closeAdd();
        this.setState({
            newExperience: []
        })
    }

    handleExperienceDelete(index) {
        const data = Object.assign([], this.props.experienceData);
        const deletedData = data.filter(experience => experience.id !== index);
        this.props.controlFunc(this.props.componentId, { experience: deletedData });
        this.setState({
            newExperience: []
        })
    }

    handleExperienceEdit(index) {
        let data = Object.assign([], this.props.experienceData);
        const indexToUpdate = data.findIndex(item => item.id === index);
        const updatedArray = [
            ...data.slice(0, indexToUpdate),
            this.state.newExperience,
            ...data.slice(indexToUpdate + 1)
        ];
        data = updatedArray;
        this.props.controlFunc(this.props.componentId, { experience : data });
        this.closeEdit();
        this.setState({
            newExperience: []
        })
    }

    saveExperience() {
        const { company, position, start, end, responsibilities } = this.state.newExperience;
        if (!company || !position || !start || !end || !responsibilities) {
            TalentUtil.notification.show("Please enter experience details", "error", null, null)
        }
        else {
            const experienceToSave = {
                company,
                position,
                start,
                end,
                responsibilities
            }

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
                        this.handleExperienceSave();
                    }.bind(this),
                    error: function (res, a, b) {
                        console.log(res)
                        console.log(a)
                        console.log(b)
                    }
                })
            }
            catch (error) {
                console.log("An error occurred during add experience request:", error);
            }
        }
    }

    editExperience(index) {
        const { company, position, start, end, responsibilities } = this.state.newExperience;
        if (!company || !position || !start || !end || !responsibilities) {
            TalentUtil.notification.show("Please enter experience details", "error", null, null)
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
                    url: 'https://talentservicesprofile20240417233610.azurewebsites.net/profile/profile/updateExperience?id=' + index,
                    headers: {
                        'Authorization': 'Bearer ' + cookies,
                        'Content-Type': 'application/json'
                    },
                    type: "POST",
                    dataType: "json",
                    data: JSON.stringify(experienceToEdit),
                    success: function (res) {
                        this.handleExperienceEdit(index);

                    }.bind(this),
                    error: function (res, a, b) {
                        console.log(res)
                        console.log(a)
                        console.log(b)
                    }
                })
            }
            catch (error) {
                console.log("An error occurred during edit experience request:", error);
            }
        }
    }

    deleteExperience(index) {
        let cookies = Cookies.get('talentAuthToken');
        try {
            $.ajax({
                url: 'https://talentservicesprofile20240417233610.azurewebsites.net/profile/profile/deleteExperience/?id=' + index,
                headers: {
                    'Authorization': 'Bearer ' + cookies,
                    'Content-Type': 'application/json'
                },
                type: "DELETE",
                dataType: "json",

                success: function (res) {
                    if (res == true) {
                        this.handleExperienceDelete(index);
                        TalentUtil.notification.show("Experience deleted sucessfully", "success", null, null)
                    } else {
                        console.log(res);
                        TalentUtil.notification.show("Experience did not delete successfully", "error", null, null)
                    }

                }.bind(this),
                error: function (res, a, b) {
                    console.log(res)
                    console.log(a)
                    console.log(b)
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
        let contents = this.renderDisplay();
        let addExperience = this.state.showAddSection ? this.renderAdd() : ''
        return (
            <div className='ui sixteen wide column'>
                {addExperience}
                {contents}
            </div>
        )
    }

    renderAdd() {
        return (
            <div className='ui sixteen wide column'>
                <div className='ui fields'>
                    <div className='eight wide field'>
                        <ChildSingleInput
                            inputType="text"
                            name="company"
                            label="Company:"
                            value={this.state.newExperience.company}
                            controlFunc={this.handleChange}
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
                                value={this.state.newExperience.position}
                                controlFunc={this.handleChange}
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
                            value={this.state.newExperience.start}
                            controlFunc={this.handleChange}
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
                            value={this.state.newExperience.end}
                            controlFunc={this.handleChange}
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
                            value={this.state.newExperience.responsibilities}
                            controlFunc={this.handleChange}
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
        const startDate = this.state.newExperience.start.split('T')[0];
        const endDate = this.state.newExperience.end.split('T')[0];
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
                                value={this.state.newExperience.company}
                                controlFunc={this.handleChange}
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
                            value={this.state.newExperience.position}
                            controlFunc={this.handleChange}
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
                                controlFunc={this.handleChange}
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
                                controlFunc={this.handleChange}
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
                    value={this.state.newExperience.responsibilities}
                    controlFunc={this.handleChange}
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

    renderDisplay() {
        const experience = Array.isArray(this.props.experienceData) ? this.props.experienceData : [];
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
                        {experience.map((exp) => (
                            this.state.showEditSection && this.state.newExperience.id === exp.id
                                    ? this.renderEdit(exp)
                                    : this.renderTableRow(exp)
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }
}
