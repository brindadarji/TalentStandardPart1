import React from 'react'
import { Form, Checkbox } from 'semantic-ui-react';
import { SingleInput } from '../Form/SingleInput.jsx';

export default class TalentStatus extends React.Component {
    constructor(props) {
        super(props);

        const status = props.status ?
            Object.assign({}, props.status)
            : {

            }

        this.state = {
            newStatus: status
        }

        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.newStatus)
        data[event.target.name] = event.target.value
        this.setState({
            newStatus: data
        })
        this.props.controlFunc(this.props.componentId, { jobSeekingStatus : data })
    }

    componentDidMount() {

    }
    
    render() {
        let status = this.props.status && this.props.status.status ? this.props.status.status : "";
       
        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <div className='ui fields'>
                        <div className='ui radio'>
                            <React.Fragment>
                                <p><b>Current Status</b></p>
                                <p><input type="radio" className='status_radio' name="status" value="Actively looking for a job" checked={status === 'Actively looking for a job'} onChange={this.handleChange} /> Actively looking for a job</p>
                                <p><input type="radio" className='status_radio' name="status" value="Not looking for a job at the moment" checked={status === 'Not looking for a job at the moment'} onChange={this.handleChange} /> Not looking for a job at the moment</p>
                                <p><input type="radio" className='status_radio' name="status" value="Currently employed but open to offer" checked={status === 'Currently employed but open to offer'} onChange={this.handleChange} /> Currently employed but open to offer</p>
                                <p><input type="radio" className='status_radio' name="status" value="Will be available at a later date" checked={status === 'Will be available at a later date'} onChange={this.handleChange} /> Will be available at a later date</p>
                            </React.Fragment>
                        </div>
                    </div>
                </div>
            </div>
            )
    }
}