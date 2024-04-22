import React from 'react'
import Cookies from 'js-cookie'
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { AddressLocation } from './AddressLocation.jsx';
import { default as Nationalities } from '../../../../util/jsonFiles/countries.json';

export class Address extends React.Component {
    constructor(props) {
        super(props)
        const addressDetails = props.addressDetails ?
            Object.assign({}, props.addressDetails)
            :{
               
            }

        this.state = {
            showEditSection: false,
            newAddress: addressDetails
        }
       
        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveAddress = this.saveAddress.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
    }

    openEdit(){
        const addressDetails = Object.assign({}, this.props.addressDetails)
        this.setState({
            showEditSection: true,
            newAddress: addressDetails
        })
    }

    closeEdit(){
        this.setState({
            showEditSection: false
        })
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.newAddress)
        data[event.target.name] = event.target.value
        this.setState({
            newAddress: data
        })
    }

    saveAddress() {
        const data = Object.assign({}, this.state.newAddress)
        this.props.controlFunc(this.props.componentId, { address: data })
        this.closeEdit()
    }

    componentDidMount() {

    }

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }
   
    renderEdit() {  
        return (
         <div className='ui sixteen wide column'>
            <div className='ui fields'>
                <div className='four wide field'>
                    <ChildSingleInput
                        className="four wide field"
                        inputType="text"
                        label="Number"
                        name="number"
                        value={this.state.newAddress.number}
                        controlFunc={this.handleChange}
                        maxLength={80}
                        placeholder="Enter the number"
                        errorMessage="Please enter a valid number"
                    />
                </div>
                <div className='eight wide field'>
                    <ChildSingleInput
                        inputType="text"
                        label="Street"
                        name="street"
                        value={this.state.newAddress.street}
                        controlFunc={this.handleChange}
                        maxLength={80}
                        placeholder="Enter your street"
                        errorMessage="Please enter a valid street"
                    />
                </div>
                <div className='four wide field'>
                    <ChildSingleInput
                        inputType="text"
                        label="Suburb"
                        name="suburb"
                        value={this.state.newAddress.suburb}
                        controlFunc={this.handleChange}
                        maxLength={80}
                        placeholder="Enter your subrub"
                        errorMessage="Please enter a valid suburb"
                    />
                </div>
             </div> 
             
                <div className='ui fields'>
                <div className='twelve wide field'>
                <AddressLocation city={this.state.newAddress.city} country={this.state.newAddress.country} handleChange={this.handleChange} />
                </div>
                <div className='four wide field'>
                    <ChildSingleInput
                        inputType="text"
                        label="PostCode"
                        name="postCode"
                        value={this.state.newAddress.postCode}
                        controlFunc={this.handleChange}
                        maxLength={80}
                        placeholder="Enter your post code"
                        errorMessage="Please enter a valid postcode"
                    />
                </div>
                </div>
            <div>
                <button type="button" className="ui teal button" onClick={this.saveAddress}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
            </div>
        </div>
        )
       
    }

    renderDisplay() {
        let number = this.props.addressDetails && this.props.addressDetails.number ? this.props.addressDetails.number : "";
        let street = this.props.addressDetails && this.props.addressDetails.street ? this.props.addressDetails.street : "";
        let suburb = this.props.addressDetails && this.props.addressDetails.suburb ? this.props.addressDetails.suburb : "";
        let postCode = this.props.addressDetails && this.props.addressDetails.postCode ? this.props.addressDetails.postCode : "";

        let fulladdress = `${number}, ${street}, ${suburb}, ${postCode}`;
        let addresscity = this.props.addressDetails && this.props.addressDetails.city ? this.props.addressDetails.city : "";
        let addresscountry = this.props.addressDetails && this.props.addressDetails.country  ? this.props.addressDetails.country : "";

        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>Address: {fulladdress} </p>
                        <p>City: {addresscity} </p>
                        <p>Country: {addresscountry}</p>
                    </React.Fragment>
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
                </div>
            </div>
        )
    }
}


export class Nationality extends React.Component {
    constructor(props) {
        super(props)

        const nationalityDetails = props.nationalityDetails ?
            Object.assign({}, props.nationalityDetails)
            : {

            }

        this.state = {
            newNationality: nationalityDetails
        }

        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.newNationality)
        data[event.target.name] = event.target.value
        this.setState({
            newNationality: data
        })
        this.props.controlFunc(this.props.componentId, data )
    }

    componentDidMount() {

    }
    
    render() {
        let nationalityOptions = [];
        nationalityOptions = Object.keys(Nationalities).map((x) => <option key={x} value={x}>{x}</option>);
        let nationality = this.props.nationalityDetails ? this.props.nationalityDetails : "";
        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <div className='ui fields'>
                        <div className='eight wide field'>
                            <React.Fragment>
                                <select className="ui right labeled dropdown"
                                    placeholder="Nationality"
                                    value={nationality}
                                    onChange={this.handleChange}
                                    name="nationality">

                                    <option value="">Select a Nationality</option>
                                    {nationalityOptions}
                                </select>
                            </React.Fragment>
                        </div>
                    </div>
                </div>
            </div>
        )
        
    }
}