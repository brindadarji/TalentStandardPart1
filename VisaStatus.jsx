import React from 'react'
import { ChildSingleInput } from '../Form/SingleInput.jsx';

export default class VisaStatus extends React.Component {
    constructor(props) {
        super(props)

        const visaDetails = props.visaDetails ?
            Object.assign({}, props.visaDetails)
            : {
                
            }

        this.state = {
            newVisa: visaDetails
        }

        this.handleChange = this.handleChange.bind(this)
        this.saveStatus = this.saveStatus.bind(this)
    }

    componentDidMount() {
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.newVisa)
        data[event.target.name] = event.target.value
        this.setState({
            newVisa: data,
            }, () => {
                if (data.visaStatus === 'citizen' || data.visaStatus === 'pr') {
                    this.saveStatus();
                }
            });
    }

    saveStatus() {
        const data = Object.assign({}, this.state.newVisa)
        this.props.controlFunc(this.props.componentId, data )
    }


    render() {
        let visa = this.state.newVisa.visaStatus ? this.state.newVisa.visaStatus : this.props.visaDetails.visaStatus;
        let visaDate = this.state.newVisa.visaExpiryDate ? this.state.newVisa.visaExpiryDate : this.props.visaDetails.visaExpiryDate;
        let visaexpiryDate;
        if (visaDate) {
            visaexpiryDate = visaDate.split('T')[0];
        } else {
            visaexpiryDate = '';
        }
        
        
        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <div className='ui fields'>
                        <div className='six wide field'>
                            
                                <label>Visa type</label>
                                <select className="ui right labeled dropdown"
                                    placeholder="visa"
                                    label="Visa type"
                                    value={visa}
                                    onChange={this.handleChange}
                                    name="visaStatus">

                                    <option value="">Select a Visa Type</option>
                                    <option value="citizen">Citizen</option>
                                    <option value="pr">Permanent Resident</option>
                                    <option value="work">Work Visa</option>
                                    <option value="student">Student Visa</option>
                                </select>
                        </div>

                        
                      {(visa === 'work' || visa === 'student') && (
                        <div className='fields'>
                            <div className='twelve wide field'>
                                <ChildSingleInput
                                        className="twelve wide field"
                                        inputType="date"
                                        label="Visa expiry date"
                                        name="visaExpiryDate"
                                        value={visaexpiryDate}
                                        controlFunc={this.handleChange}
                                        maxLength={80}
                                        placeholder="Enter the Visa expiry date"
                                        errorMessage="Please enter a valid expiry date"
                                />
                               </div>
                                <div className='four wide field'>
                                    <button type="button" className='ui teal button visa-save' onClick={this.saveStatus}>Save</button>
                            </div>
                        </div>
                         )}
                        
                    </div>
                </div>
            </div>
          )
    }
}