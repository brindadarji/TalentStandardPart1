/* Skill section */
import React from 'react';
import Cookies from 'js-cookie';
import { Icon } from 'semantic-ui-react'
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { validateRequiredFields } from '../Form/validation.jsx';
export default class Skill extends React.Component {
    constructor(props) {
        super(props);

        const skillData = props.skillData ?
            Object.assign({}, props.skillData)
            : {

            }

        this.state = {
            showAddSection: false,
            showEditSection: false,
            addSkill: { name: '', level: '' },
            editSkill: { id: '', name: '', level: '' },
        }

        this.handleAddChange = this.handleAddChange.bind(this);
        this.handleEditChange = this.handleEditChange.bind(this);
        this.renderAddSkill = this.renderAddSkill.bind(this);
        this.closeAdd = this.closeAdd.bind(this);
        this.openAdd = this.openAdd.bind(this);
        this.saveSkill = this.saveSkill.bind(this);
        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
    };

    openAdd() {
        this.setState({
            showAddSection: true,
        });
    }

    closeAdd() {
        this.setState({ showAddSection: false, addSkill: { name: '', level: '' } });
    }

    openEdit(selectedSkillId) {
        if (!selectedSkillId) {
            TalentUtil.notification.show("Please select skill to edit", "error", null, null);
            return;
        }
        const skillData = Object.assign([], this.props.skillData);
        const selectedSkill = skillData.find(skill => skill.id === selectedSkillId);
        this.setState({ showEditSection: true, editSkill: selectedSkill });
    }

    closeEdit() {
        this.setState({ showEditSection: false, editSkill: { id: '', name: '', level: '' } });
    }

    handleAddChange(event) {
        const { name, value } = event.target;
        const data = Object.assign({}, this.state.addSkill);
        data[name] = value;
        this.setState({
            addSkill: data
        });
    }

    handleEditChange(event) {
        const { name, value } = event.target;
        const data = Object.assign({}, this.state.editSkill);
        data[name] = value;
        this.setState({
            editSkill: data
        });
    }

    handleSkillSave() {
        const data = Object.assign([], this.props.skillData);
        data.push(this.state.addSkill);
        this.props.controlFunc(this.props.componentId, { skills: data });
        this.closeAdd();
        this.setState({
            addSkill: []
        });
    }

    handleSkillDelete(selectedSkillId) {
        if (!selectedSkillId) {
            TalentUtil.notification.show("Please select skill to delete", "error", null, null);
            return;
        }
        const data = Object.assign([], this.props.skillData);
        const deletedData = data.filter(skill => skill.id !== selectedSkillId);
        this.props.controlFunc(this.props.componentId, { skills: deletedData });
    }

    handleSkillEdit(selectedSkillId) {
        if (!selectedSkillId) {
            TalentUtil.notification.show("Please select skill to edit", "error", null, null);
            return;
        }
        let data = Object.assign([], this.props.skillData);
        const skillToUpdate = data.findIndex(item => item.id === selectedSkillId);
        const updatedArray = [
            ...data.slice(0, skillToUpdate),
            this.state.editSkill,
            ...data.slice(skillToUpdate + 1)
        ];
        data = updatedArray;
        this.props.controlFunc(this.props.componentId, { skills: data });
        this.closeEdit();
        this.setState({
            editSkill: []
        });
    }
   
    saveSkill() {
        const { name, level } = this.state.addSkill;
        const requiredFields = {
            "Skill Name": name,
            "Skill Level": level
        };

        const errorMessage = validateRequiredFields(requiredFields);

        if (errorMessage) {
            TalentUtil.notification.show(errorMessage, "error", null, null);
            return;
        }
        else {
            const skillToSave = {
                name,
                level
            }

            let cookies = Cookies.get('talentAuthToken');
            try {
                $.ajax({
                    url: 'https://talentservicesprofile20240417233610.azurewebsites.net/profile/profile/addSkill',
                    headers: {
                        'Authorization': 'Bearer ' + cookies,
                        'Content-Type': 'application/json'
                    },
                    type: "POST",
                    dataType: "json",
                    data: JSON.stringify(skillToSave),
                    success: function (res) {
                        if (res.success) {
                            this.setState({
                                addSkill: {
                                    name: this.state.addSkill.name,
                                    level: this.state.addSkill.level,
                                    id: res.skill.id
                                }
                            });
                            this.handleSkillSave();
                        }
                        else {
                            TalentUtil.notification.show("Skill did not save successfully", "error", null, null);
                        }
                    }.bind(this),
                    error: function (res) {
                        console.error('Error:', res.status);
                    }
                })
            }
            catch (error) {
                console.log("An error occurred during Skill add request:", error);
            }
        }
    }

    editSkill(selectedSkillId) {
        if (!selectedSkillId) {
            TalentUtil.notification.show("Please select skill to edit", "error", null, null);
            return;
        }
        const { name, level } = this.state.editSkill;
        const requiredFields = {
            "Skill Name": name,
            "Skill Level": level
        };

        const errorMessage = validateRequiredFields(requiredFields);

        if (errorMessage) {
            TalentUtil.notification.show(errorMessage, "error", null, null);
            return;
        }
        else {
            const skillToedit = {
                name,
                level
            }
            let cookies = Cookies.get('talentAuthToken');
            try {
                $.ajax({
                    url: 'https://talentservicesprofile20240417233610.azurewebsites.net/profile/profile/updateSkill?id=' + selectedSkillId,
                    headers: {
                        'Authorization': 'Bearer ' + cookies,
                        'Content-Type': 'application/json'
                    },
                    type: "POST",
                    dataType: "json",
                    data: JSON.stringify(skillToedit),
                    success: function (res) {
                        if (res.success) {
                            this.handleSkillEdit(selectedSkillId);
                        }
                        else {
                            TalentUtil.notification.show("Skill did not edit successfully", "error", null, null);
                        }
                    }.bind(this),
                    error: function (res) {
                        console.error('Error:', res.status);
                    }
                })
            }
            catch (error) {
                console.log("An error occurred during edit skill request:", error);
            }
        }
    }

    deleteSkill(selectedSkillId) {
        if (!selectedSkillId) {
            TalentUtil.notification.show("Please select skill to delete", "error", null, null);
            return;
        }
        let cookies = Cookies.get('talentAuthToken');
        try {
            $.ajax({
                url: 'https://talentservicesprofile20240417233610.azurewebsites.net/profile/profile/deleteSkill/?id=' + selectedSkillId,
                headers: {
                    'Authorization': 'Bearer ' + cookies,
                    'Content-Type': 'application/json'
                },
                type: "DELETE",
                dataType: "json",

                success: function (res) {
                    if (res.success) {
                        this.handleSkillDelete(selectedSkillId);
                        TalentUtil.notification.show("skill deleted sucessfully", "success", null, null);
                    } else {
                        TalentUtil.notification.show("skill did not delete successfully", "error", null, null);
                    }

                }.bind(this),
                error: function (res) {
                    console.error('Error:', res.status);
                }
            })
        }
        catch (error) {
            console.log("An error occurred during delete skill request:", error);
        }
    }

    render() {
        let contents = this.renderExpTable();
        let addSkill = this.state.showAddSection ? this.renderAddSkill() : ''
        return (
            <div className='ui sixteen wide column'>
                {addSkill}
                {contents}
            </div>
        )   
    }

    renderTableRow(skill){
        return (
            <tr key={skill.id}>
                <td>{skill.name}</td>
                <td>{skill.level}</td>
                <td>{
                    <div>
                        <Icon className='close large link icon addnew_btn' onClick={() => this.deleteSkill(skill.id)}></Icon>
                        <Icon className='pencil alternate large link icon addnew_btn' onClick={() => this.openEdit(skill.id)}></Icon>
                    </div>
                }
                </td>
            </tr>
        )
    }

    renderSkillData() {
        const Skills = Array.isArray(this.props.skillData) ? this.props.skillData : [];
        return (
            Skills.map((skill) => (
                this.state.showEditSection && this.state.editSkill.id === skill.id
                    ? this.renderEdit(skill)
                    : this.renderTableRow(skill)
            ))
        )
    }

    renderExpTable() {
       return(
        <div className='ui sixteen wide column'>
            <table className="ui single line table">
                <thead className="">
                    <tr className="">
                        <th className>Skill</th>
                        <th className>Level</th>
                        <th className=''>
                            <button type="button" className="ui teal button addnew_btn" onClick={this.openAdd}><Icon name='add'></Icon>Add New</button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                       {this.renderSkillData()}
                </tbody>
            </table>
        </div>
       )
    }

    renderAddSkill() {
        return (
            <div className='ui sixteen wide column'>
                <div className='ui fields'>
                    <div className='four wide field'>
                        <ChildSingleInput
                            inputType="text"
                            name="name"
                            label=""
                            controlFunc={this.handleAddChange}
                            maxLength={80}
                            placeholder="Add Skill"
                            errorMessage="Please enter a valid Skill"
                        />
                    </div>
                    <div className='four wide field'>
                        <div className='field'>
                            <label></label>
                            <select
                                onChange={this.handleAddChange}
                                name="level"
                            >
                                <option value="">Skill Level</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Expert">Expert</option>
                            </select>
                        </div>
                    </div>
                    <div className='six wide field'>
                        <div className='field'>
                            <label></label>
                            <button type="button" className="ui teal button" onClick={this.saveSkill}>Save</button>
                            <button type="button" className="ui button" onClick={this.closeAdd}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderEdit(skill) {
        return (
            <tr key={skill.id}>
                <td>
                    <ChildSingleInput
                        inputType="text"
                        name="name"
                        label=""
                        value={this.state.editSkill.name}
                        controlFunc={this.handleEditChange}
                        maxLength={80}
                        placeholder="Edit Skill"
                        errorMessage="Please enter a valid Language"
                    />
                </td>
                <td>
                    <select
                        onChange={this.handleEditChange}
                        value={this.state.editSkill.level}
                        name="level"
                    >
                        <option value="">Skill Level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert</option>
                    </select>
                </td>
                <td>
                    <div>
                        <button type="button" className="ui blue basic button" onClick={() => this.editSkill(skill.id)}>Update</button>
                        <button type="button" className="ui red basic button" onClick={() => this.closeEdit()}>Cancel</button>
                    </div>
                </td>
            </tr>
        )
    }
}

