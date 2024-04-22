/* Photo upload section */
import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { Icon, Image, Button } from 'semantic-ui-react'

export default class PhotoUpload extends Component {

    constructor(props) {
        super(props);

        const imageId = props.imageId ?
            Object.assign({}, props.imageId)
            : {

            }

        this.state = {
            showUploadButton: false,
            selectedFileThumb: '',
            selectedFile: '',
        };
        this.fileInputRef = React.createRef();
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleIconClick = this.handleIconClick.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
    };

    handleImageChange(e) {
        const file = e.target.files[0];
        const cropPhoto = URL.createObjectURL(file)
        this.setState({
            selectedFile: file,
            selectedFileThumb: cropPhoto,
            showUploadButton: true
        });
    }

    handleIconClick() {
        this.fileInputRef.current.click();
    }

    handleUpload() {
        const cookies = Cookies.get('talentAuthToken');
        try {
            var formData = new FormData();
            formData.append('file', this.state.selectedFile);

            $.ajax({
                url: this.props.savePhotoUrl,
                headers: {
                    Authorization: 'Bearer ' + cookies,
                },
                type: "POST",
                processData: false,
                contentType: false,
                data: formData,
                success: function () {
                        this.setState({
                            showUploadButton: false,
                        });
                        TalentUtil.notification.show("ProfilePhoto updated successfully", "success", null, null);
                    
                }.bind(this),
                error: function (xhr, status, error) {
                    console.error(status, error);
                    TalentUtil.notification.show("ProfilePhoto did not update successfully", "error", null, null);
                }
            });
        } catch (error) {
            console.error("Error uploading the photo", error);
        }
    }

    renderImageUpload() {
        const { selectedFile, selectedFileThumb } = this.state;
        const profileImage = selectedFile ? selectedFileThumb : this.props.imageId.profilePhotoUrl;

        if (this.props.imageId.profilePhotoUrl) {
            return (
                <div style={{ textAlign: 'center' }}>

                    <div className='profile-photodiv'>
                        <input
                            ref={this.fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={this.handleImageChange}
                        />
                        <img
                            src={profileImage}
                            className="profile_upload_btn profile-thumb"
                            onClick={this.handleIconClick}
                        />
                    </div><br></br>
                    {this.state.showUploadButton && <Button type="button" className='ui teal button' onClick={this.handleUpload}><Icon name="upload" aria-hidden="true"></Icon>Upload</Button>}
                </div>
            )
        }
        else {
            return (
                <React.Fragment>
                    <input
                        ref={this.fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={this.handleImageChange}
                    />
                    <i
                        className="big icons"
                        onClick={this.handleIconClick}
                        style={{ cursor: 'pointer' }}
                    >
                        <i aria-hidden="true" className="camera retro big circular icon"></i>
                    </i>
                </React.Fragment>
            )
        }
    }


    render() {
            return (
                <div className='row'>
                    <div className="ui sixteen wide column">
                        <div className='ui fields'>
                            <div className='ui icon'>
                                {this.renderImageUpload()}
                            </div>
                        </div>
                    </div>
                </div>
            )

        }
    }
