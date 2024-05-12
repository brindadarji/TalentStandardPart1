/* Language section */ 
import React from 'react';
import Cookies from 'js-cookie';
import { Icon } from 'semantic-ui-react'
import { ChildSingleInput,SingleInput } from '../Form/SingleInput.jsx';

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
            newLanguage: [],
            validationErrors: {
                name: '',
                level:'',
            },
        }

        this.handleChange = this.handleChange.bind(this);
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
        this.setState({ showAddSection: false });
    }

    openAdd() {
        this.setState({
            showAddSection: true,
        })
    }

    openEdit(selectedLangId) {
        const languageData = Object.assign([], this.props.languageData);
        const selectedLanguage = languageData.find(lang => lang.id === selectedLangId);
        this.setState({ showEditSection: true, newLanguage: selectedLanguage })
    }

    closeEdit() {
        this.setState({ showEditSection: false, newLanguage: [] });
    }

    handleChange(event) {
        const { name, value } = event.target;
        const data = Object.assign({}, this.state.newLanguage);
        data[name] = value;

        let errorMessage = '';
        if (name === 'name' && value.trim() === '') {
            errorMessage = 'Please enter Language';
        }else if (name === 'level' && value.trim() === '') {
            errorMessage = 'Please select Language Level';
        }

        const newValidationErrors = Object.assign({}, this.state.validationErrors);
        newValidationErrors[name] = errorMessage;

        this.setState({
            newLanguage: data,
            validationErrors: newValidationErrors,
        });
    }

    handleLanguageDelete(selectedLangId) {
        const data = Object.assign([], this.props.languageData);
        const deletedData = data.filter(lang => lang.id !== selectedLangId);
        this.props.controlFunc(this.props.componentId, { languages: deletedData });
        this.setState({
            newLanguage: []
        });
    }

    handleLanguageSave() {
        const data = Object.assign([], this.props.languageData);
        data.push(this.state.newLanguage);
        this.props.controlFunc(this.props.componentId, { languages: data });
        this.closeAdd();
        this.setState({
            newLanguage: []
        });
    }

    handleLanguageEdit(selectedLangId) {
        let data = Object.assign([], this.props.languageData);
        const langToUpdate = data.findIndex(item => item.id === selectedLangId);
        const updatedArray = [
            ...data.slice(0, langToUpdate),
            this.state.newLanguage,
            ...data.slice(langToUpdate + 1)
        ];
        data = updatedArray;
        this.props.controlFunc(this.props.componentId, { languages: data });
        this.closeEdit();
        this.setState({
            newLanguage: []
        });
    }

    editLanguage(selectedLangId) {
        const { name, level } = this.state.newLanguage;
        if (!name || !level) {
            TalentUtil.notification.show("Please enter language and level", "error", null, null)
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
                            console.log(res);
                        }

                    }.bind(this),
                    error: function (res, a, b) {
                        console.log(res);
                        console.log(a);
                        console.log(b);
                    }
                })
            }
            catch (error) {
                console.log("An error occurred during edit language request:", error);
            }
        }
    }

    saveLanguage() {
        const { name, level } = this.state.newLanguage;
        if (!name || !level) {
            TalentUtil.notification.show("Please enter language and level", "error", null, null);
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
                                newLanguage: {
                                    name: this.state.newLanguage.name,
                                    level: this.state.newLanguage.level,
                                    id: res.language.id
                                }
                            });
                            this.handleLanguageSave();
                        }
                        else {
                            console.log(res);
                        }
                    }.bind(this),
                    error: function (res, a, b) {
                        console.log(res);
                        console.log(a);
                        console.log(b);
                    }
                })
            }
            catch (error) {
                console.log("An error occurred during Save Language request:", error);
            }
        }
    }

    deleteLanguage(selectedLangId) {
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
                error: function (res, a, b) {
                    console.log(res);
                    console.log(a);
                    console.log(b);
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
                    this.state.showEditSection && this.state.newLanguage.id === language.id
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
                            controlFunc={this.handleChange}
                            maxLength={80}
                            placeholder="Add Language"
                        />
                        {this.state.validationErrors.name && (
                            <div className="ui pointing red basic label">
                                {this.state.validationErrors.name}
                            </div>
                        )}
                    </div>
                    <div className='four wide field'>
                        <div className='field'>
                            <label></label>
                            <select
                                onChange={this.handleChange}
                                name="level"
                            >
                                <option value="">Language Level</option>
                                <option value="Basic">Basic</option>
                                <option value="Conversational">Conversational</option>
                                <option value="Fluent">Fluent</option>
                                <option value="Native/Bilingual">Native/Bilingual</option>
                            </select>
                        </div>
                        {this.state.validationErrors.level && (
                            <div className="ui pointing red basic label">
                                {this.state.validationErrors.level}
                            </div>
                        )}
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
                        value={this.state.newLanguage.name}
                        controlFunc={this.handleChange}
                        maxLength={80}
                        placeholder="Edit Language"
                        errorMessage="Please enter a valid Language"
                    />
                </td>
                <td>
                    <select
                        onChange={this.handleChange}
                        value={this.state.newLanguage.level}
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