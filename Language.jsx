/* Language section */ 
import React from 'react';
import Cookies from 'js-cookie';
import { Icon } from 'semantic-ui-react'
import { ChildSingleInput,SingleInput } from '../Form/SingleInput.jsx';
import { validateRequiredFields } from '../Form/validation.jsx';

export default class Language extends React.Component {
    constructor(props) {
        super(props);

        const languageData = props.languageData ?
            Object.assign({}, props.languageData)
            : {

            }

        this.state = {
            showAddSection: false,
            showEditSection: false,
            addLanguage: { name: '', level: '' },
            editLanguage: { id: '', name: '', level: '' },
        }

        this.handleAddChange = this.handleAddChange.bind(this);
        this.handleEditChange = this.handleEditChange.bind(this);
        this.renderAdd = this.renderAdd.bind(this);
        this.closeAdd = this.closeAdd.bind(this);
        this.openAdd = this.openAdd.bind(this);
        this.saveLanguage = this.saveLanguage.bind(this);
        this.handleLanguageDelete = this.handleLanguageDelete.bind(this);
        this.handleLanguageSave = this.handleLanguageSave.bind(this);
        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
    }

    closeAdd() {
        this.setState({ showAddSection: false, addLanguage: { name: '', level: '' } });
    }

    openAdd() {
        this.setState({
            showAddSection: true,
        });
    }

    openEdit(selectedLangId) {
        if (!selectedLangId) {
            TalentUtil.notification.show("Please select language to edit", "error", null, null);
            return;
        }
        const languageData = Object.assign([], this.props.languageData);
        const selectedLanguage = languageData.find(lang => lang.id === selectedLangId);
        this.setState({ showEditSection: true, editLanguage: selectedLanguage});
    }

    closeEdit() {
        this.setState({ showEditSection: false, editLanguage: { id: '', name: '', level: '' } });
    }

    handleAddChange(event) {
        const { name, value } = event.target;
        const data = Object.assign({}, this.state.addLanguage);
        data[name] = value;
        this.setState({
            addLanguage: data,
        });
    }

    handleEditChange(event) {
        const { name, value } = event.target;
        const data = Object.assign({}, this.state.editLanguage);
        data[name] = value;
        this.setState({
            editLanguage: data,
        });
    }

    handleLanguageDelete(selectedLangId) {
        if (!selectedLangId) {
            TalentUtil.notification.show("Please select language to delete", "error", null, null);
            return;
        }
        const data = Object.assign([], this.props.languageData);
        const deletedData = data.filter(lang => lang.id !== selectedLangId);
        this.props.controlFunc(this.props.componentId, { languages: deletedData });
    }

    handleLanguageSave() {
        const data = Object.assign([], this.props.languageData);
        data.push(this.state.addLanguage);
        this.props.controlFunc(this.props.componentId, { languages: data });
        this.closeAdd();
        this.setState({
            addLanguage: []
        });
    }

    handleLanguageEdit(selectedLangId) {
        if (!selectedLangId) {
            TalentUtil.notification.show("Please select language to edit", "error", null, null);
            return;
        }
        let data = Object.assign([], this.props.languageData);
        const langToUpdate = data.findIndex(item => item.id === selectedLangId);
        const updatedArray = [
            ...data.slice(0, langToUpdate),
            this.state.editLanguage,
            ...data.slice(langToUpdate + 1)
        ];
        data = updatedArray;
        this.props.controlFunc(this.props.componentId, { languages: data });
        this.closeEdit();
        this.setState({
            editLanguage: []
        });
    }

    editLanguage(selectedLangId) {
        if (!selectedLangId) {
            TalentUtil.notification.show("Please select language to edit", "error", null, null);
            return;
        }
        const { name, level } = this.state.editLanguage;
        const requiredFields = {
            "Language Name": name,
            "Language Level": level
        };

        const errorMessage = validateRequiredFields(requiredFields);

        if (errorMessage) {
            TalentUtil.notification.show(errorMessage, "error", null, null);
            return;
        }
        else {
            const languagesToedit = {
                name,
                level
            }
            let cookies = Cookies.get('talentAuthToken');
            try {
                $.ajax({
                    url: 'https://talentservicesprofile20240417233610.azurewebsites.net/profile/profile/updateLanguage?id=' + selectedLangId,
                    headers: {
                        'Authorization': 'Bearer ' + cookies,
                        'Content-Type': 'application/json'
                    },
                    type: "POST",
                    dataType: "json",
                    data: JSON.stringify(languagesToedit),
                    success: function (res) {
                        if (res.success) {
                            this.handleLanguageEdit(selectedLangId);
                        }
                        else {
                            TalentUtil.notification.show("Language did not update successfully", "error", null, null);
                        }

                    }.bind(this),
                    error: function (res) {
                        console.error('Error:', res.status);
                    }
                })
            }
            catch (error) {
                console.log("An error occurred during edit language request:", error);
            }
        }
    }

    saveLanguage() {
        const { name, level } = this.state.addLanguage;
        const requiredFields = {
            "Language Name": name,
            "Language Level": level
        };

        const errorMessage = validateRequiredFields(requiredFields);

        if (errorMessage) {
            TalentUtil.notification.show(errorMessage, "error", null, null);
            return;
        }
        else {
            const languagesToSave = {
                name,
                level
            }
            let cookies = Cookies.get('talentAuthToken');

            try {
                $.ajax({
                    url: 'https://talentservicesprofile20240417233610.azurewebsites.net/profile/profile/AddLanguage',
                    headers: {
                        'Authorization': 'Bearer ' + cookies,
                        'Content-Type': 'application/json'
                    },
                    type: "POST",
                    dataType: "json",
                    data: JSON.stringify(languagesToSave),
                    success: function (res) {
                        if (res.success) {
                            this.setState({
                                addLanguage: {
                                    name: this.state.addLanguage.name,
                                    level: this.state.addLanguage.level,
                                    id: res.language.id
                                }
                            });
                            this.handleLanguageSave();
                        }
                        else {
                            TalentUtil.notification.show("Language did not save successfully", "error", null, null);
                        }
                    }.bind(this),
                    error: function (res) {
                        console.error('Error:', res.status);
                    }
                })
            }
            catch (error) {
                console.log("An error occurred during Save Language request:", error);
            }
        }
    }

    deleteLanguage(selectedLangId) {
        if (!selectedLangId) {
            TalentUtil.notification.show("Please select language to delete", "error", null, null);
            return;
        }
        let cookies = Cookies.get('talentAuthToken');
        try {
            $.ajax({
                url: 'https://talentservicesprofile20240417233610.azurewebsites.net/profile/profile/deleteLanguage/?id=' + selectedLangId,
                headers: {
                    'Authorization': 'Bearer ' + cookies,
                    'Content-Type': 'application/json'
                },
                type: "DELETE",
                dataType: "json",

                success: function (res) {
                    if (res.success) {
                        this.handleLanguageDelete(selectedLangId);
                        TalentUtil.notification.show("Language deleted sucessfully", "success", null, null);
                    } else {
                        TalentUtil.notification.show("Language did not delete successfully", "error", null, null);
                    }

                }.bind(this),
                error: function (res) {
                    console.error('Error:', res.status);
                }
            })
        }
        catch (error) {
            console.log("An error occurred during Delete language request:", error);
        }
    }

    render() {
        let contents = this.renderLangTable();
        let addLanguage = this.state.showAddSection ? this.renderAdd() : '';
        return (
            <div className='ui sixteen wide column'>
                {addLanguage}
                {contents}
            </div>
        )
    }

    renderTableRow(language) {
        return (
            <tr key={language.id}>
                <td>{language.name}</td>
                <td>{language.level}</td>
                <td>{
                    <div>
                        <Icon className='close large link icon addnew_btn' onClick={() => this.deleteLanguage(language.id)}></Icon>
                        <Icon className='pencil alternate large link icon addnew_btn' onClick={() => this.openEdit(language.id)}></Icon>
                    </div>
                }
                </td>
            </tr>
        )
    }

    renderLangData() {
        const languages = Array.isArray(this.props.languageData) ? this.props.languageData : [];
        return (
                languages.map((language) => (
                    this.state.showEditSection && this.state.editLanguage.id === language.id
                        ? this.renderEdit(language)
                        : this.renderTableRow(language)
                ))
        )
    }

    renderLangTable() {
        return (
            <div className='ui sixteen wide column'>
                 <table className="ui single line table">
                    <thead className="">
                                <tr className="">
                                    <th className>Language</th>
                                    <th className>Level</th>
                                    <th className=''>
                                    <button type="button" className="ui teal button addnew_btn" onClick={this.openAdd}><Icon name='add'></Icon>Add New</button>
                                    </th>
                                </tr>
                    </thead>
                    <tbody>
                        {this.renderLangData()}
                    </tbody>
                </table>
            </div>
        )
        
    }

    renderAdd() {
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
                            placeholder="Add Language"
                        />
                    </div>
                    <div className='four wide field'>
                        <div className='field'>
                            <label></label>
                            <select
                                onChange={this.handleAddChange}
                                name="level"
                            >
                                <option value="">Language Level</option>
                                <option value="Basic">Basic</option>
                                <option value="Conversational">Conversational</option>
                                <option value="Fluent">Fluent</option>
                                <option value="Native/Bilingual">Native/Bilingual</option>
                            </select>
                        </div>
                    </div>
                    <div className='six wide field'>
                        <div className='field'>
                            <label></label>
                            <button type="button" className="ui teal button" onClick={this.saveLanguage}>Save</button>
                            <button type="button" className="ui button" onClick={this.closeAdd}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderEdit(language) {
        return (
            <tr key={language.id}>
                <td>
                    <ChildSingleInput
                        inputType="text"
                        name="name"
                        label=""
                        value={this.state.editLanguage.name}
                        controlFunc={this.handleEditChange}
                        maxLength={80}
                        placeholder="Edit Language"
                        errorMessage="Please enter a valid Language"
                    />
                </td>
                <td>
                    <select
                        onChange={this.handleEditChange}
                        value={this.state.editLanguage.level}
                        name="level"
                    >
                        <option value="">Language Level</option>
                        <option value="Basic">Basic</option>
                        <option value="Conversational">Conversational</option>
                        <option value="Fluent">Fluent</option>
                        <option value="Native/Bilingual">Native/Bilingual</option>
                    </select>
                </td>
                <td>
                    <button type="button" className="ui blue basic button" onClick={() => this.editLanguage(language.id)}>Update</button>
                    <button type="button" className="ui red basic button" onClick={() => this.closeEdit()}>Cancel</button>
                </td>
            </tr>

        )
    }
}