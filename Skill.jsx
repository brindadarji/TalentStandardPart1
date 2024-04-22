/* Skill section */
import React from 'react';
import Cookies from 'js-cookie';
import { Icon } from 'semantic-ui-react'
import { ChildSingleInput } from '../Form/SingleInput.jsx';

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
            newSkill: [],
            validationError: {
                name: '',
                level: '',
            },
        }

        this.handleChange = this.handleChange.bind(this)
        this.renderAddSkill = this.renderAddSkill.bind(this)
        this.closeAdd = this.closeAdd.bind(this)
        this.openAdd = this.openAdd.bind(this)
        this.saveSkill = this.saveSkill.bind(this)
        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
    };

    componentDidMount() {
    }

    closeAdd() {
        this.setState({ showAddSection: false })
    }

    openAdd() {
        this.setState({
            showAddSection: true,
        })
    }

    openEdit(index) {
        const skillData = Object.assign([], this.props.skillData);
        const selectedRecord = skillData.find(skill => skill.id === index);
        this.setState({ showEditSection: true, newSkill : selectedRecord })
    }

    closeEdit() {
        this.setState({ showEditSection: false, newSkill:[] })
    }

    handleChange(event) {
        const { name, value } = event.target;
        const data = Object.assign({}, this.state.newSkill);
        data[name] = value;

        let errorMessage = '';
        if (name === 'name' && value.trim() === '') {
            errorMessage = 'Please enter Skill';
        } else if (name === 'level' && value.trim() === '') {
            errorMessage = 'Please select Skill Level';
        }

        const newValidationError = Object.assign({}, this.state.validationError);
        newValidationError[name] = errorMessage;

        this.setState({
            newSkill: data,
            validationError: newValidationError,
        });
    }

    handleSkillSave() {
        const data = Object.assign([], this.props.skillData);
        data.push(this.state.newSkill);
        this.props.controlFunc(this.props.componentId, { skills: data });
        this.closeAdd();
        this.setState({
            newSkill: []
        })
    }

    handleSkillDelete(index) {
        const data = Object.assign([], this.props.skillData);
        const deletedData = data.filter(skill => skill.id !== index);
        this.props.controlFunc(this.props.componentId, { skills: deletedData });
        this.setState({
            newSkill: []
        })
    }

    handleSkillEdit(index) {
        let data = Object.assign([], this.props.skillData);
        const indexToUpdate = data.findIndex(item => item.id === index);
        const updatedArray = [
            ...data.slice(0, indexToUpdate),
            this.state.newSkill,
            ...data.slice(indexToUpdate + 1)
        ];
        data = updatedArray;
        this.props.controlFunc(this.props.componentId, { skills: data });
        this.closeEdit();
        this.setState({
            newSkill: []
        })
    }
   
    saveSkill() {
        const { name, level } = this.state.newSkill;
        if (!name || !level) {
            TalentUtil.notification.show("Please enter skill and level", "error", null, null)
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
                        this.handleSkillSave();
                    }.bind(this),
                    error: function (res, a, b) {
                        console.log(res)
                        console.log(a)
                        console.log(b)
                    }
                })
            }
            catch (error) {
                console.log("An error occurred during Skill add request:", error);
            }
        }
    }

    editSkill(index) {
        const { name, level } = this.state.newSkill;
        if (!name || !level) {
            TalentUtil.notification.show("Please enter skill and level", "error", null, null)
        }
        else {
            const skillToedit = {
                name,
                level
            }
            let cookies = Cookies.get('talentAuthToken');
            try {
                $.ajax({
                    url: 'https://talentservicesprofile20240417233610.azurewebsites.net/profile/profile/updateSkill?id=' + index,
                    headers: {
                        'Authorization': 'Bearer ' + cookies,
                        'Content-Type': 'application/json'
                    },
                    type: "POST",
                    dataType: "json",
                    data: JSON.stringify(skillToedit),
                    success: function (res) {
                        this.handleSkillEdit(index);
                    }.bind(this),
                    error: function (res, a, b) {
                        console.log(res)
                        console.log(a)
                        console.log(b)
                    }
                })
            }
            catch (error) {
                console.log("An error occurred during edit skill request:", error);
            }
        }
    }

    deleteSkill(index) {
        let cookies = Cookies.get('talentAuthToken');
        try {
            $.ajax({
                url: 'https://talentservicesprofile20240417233610.azurewebsites.net/profile/profile/deleteSkill/?id=' + index,
                headers: {
                    'Authorization': 'Bearer ' + cookies,
                    'Content-Type': 'application/json'
                },
                type: "DELETE",
                dataType: "json",

                success: function (res) {
                    if (res == true) {
                        this.handleSkillDelete(index);
                        TalentUtil.notification.show("skill deleted sucessfully", "success", null, null)
                    } else {
                        TalentUtil.notification.show("skill did not delete successfully", "error", null, null)
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
            console.log("An error occurred during delete skill request:", error);
        }
    }

    render() {
        let contents = this.renderDisplay();
        let addSkill = this.state.showAddSection ? this.renderAddSkill() : ''
        return (
            <div className='ui sixteen wide column'>
                {addSkill}
                {contents}
            </div>
        )   
    }

    renderEdit(skill) {
        return(
        <tr key={skill.id}>
            <td>
                <ChildSingleInput
                        inputType="text"
                        name="name"
                        label=""
                        value={this.state.newSkill.name}
                        controlFunc={this.handleChange}
                        maxLength={80}
                        placeholder="Edit Skill"
                        errorMessage="Please enter a valid Language"
                    />
            </td>
            <td>
                 <select
                        onChange={this.handleChange}
                        value={this.state.newSkill.level}
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

    renderDisplay() {
       const Skills = Array.isArray(this.props.skillData) ? this.props.skillData : [];
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
                       {Skills.map((skill) => (
                           this.state.showEditSection && this.state.newSkill.id === skill.id
                               ? this.renderEdit(skill)
                               : this.renderTableRow(skill)
                       ))}
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
                            value={this.state.newSkill.name}
                            controlFunc={this.handleChange}
                            maxLength={80}
                            placeholder="Add Skill"
                            errorMessage="Please enter a valid Skill"
                        />
                        {this.state.validationError.name && (
                            <div className="ui pointing red basic label">
                                {this.state.validationError.name}
                            </div>
                        )}
                    </div>
                    <div className='four wide field'>
                        <div className='field'>
                            <label></label>
                            <select
                                onChange={this.handleChange}
                                value={this.state.newSkill.level}
                                name="level"
                            >
                                <option value="">Skill Level</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Expert">Expert</option>
                            </select>
                        </div>
                        {this.state.validationError.level && (
                            <div className="ui pointing red basic label">
                                {this.state.validationError.level}
                            </div>
                        )}
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
}

