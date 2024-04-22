import React from 'react';
import Cookies from 'js-cookie';
import SocialMediaLinkedAccount from './SocialMediaLinkedAccount.jsx';
import { IndividualDetailSection } from './ContactDetail.jsx';
import FormItemWrapper from '../Form/FormItemWrapper.jsx';
import { Address, Nationality } from './Location.jsx';
import Language from './Language.jsx';
import Skill from './Skill.jsx';
import Education from './Education.jsx';
import Certificate from './Certificate.jsx';
import VisaStatus from './VisaStatus.jsx'
import PhotoUpload from './PhotoUpload.jsx';
import VideoUpload from './VideoUpload.jsx';
import CVUpload from './CVUpload.jsx';
import SelfIntroduction from './SelfIntroduction.jsx';
import Experience from './Experience.jsx';
import { BodyWrapper, loaderData } from '../Layout/BodyWrapper.jsx';
import { LoggedInNavigation } from '../Layout/LoggedInNavigation.jsx';
import TalentStatus from './TalentStatus.jsx';

export default class AccountProfile extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            profileData: {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                education: [],
                languages: [],
                skills: [],
                experience: [],
                certifications: [],
                visaStatus: '',
                visaExpiryDate: '',
                profilePhoto: '',
                linkedAccounts: {
                    linkedIn: "",
                    github: ""
                },
                jobSeekingStatus: {
                    status: "",
                    availableDate: null
                }
            },
            loaderData: loaderData,

        }

        this.updateWithoutSave = this.updateWithoutSave.bind(this)
        this.updateAndSaveData = this.updateAndSaveData.bind(this)
        this.updateForComponentId = this.updateForComponentId.bind(this)
        this.handleUserInput = this.handleUserInput.bind(this);
        this.saveProfile = this.saveProfile.bind(this)
        this.loadData = this.loadData.bind(this)
        this.init = this.init.bind(this);
    };

    init() {
        let loaderData = this.state.loaderData;
        loaderData.allowedUsers.push("Talent");
        loaderData.isLoading = false;
        this.setState({ loaderData, })
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        let cookies = Cookies.get('talentAuthToken');
        try {
            $.ajax({
                url: 'https://talentservicesprofile20240417233610.azurewebsites.net/profile/profile/getTalentProfile',
                headers: {
                    'Authorization': 'Bearer ' + cookies,
                    'Content-Type': 'application/json',
                },
                type: "GET",
                dataType: "json",
                success: function (res) {
                    let profileData = null;
                    if (res.data) {
                        profileData = res.data
                        console.log("profileData", profileData)
                    }
                    this.updateWithoutSave(profileData);
                }.bind(this),
                error: function (res) {
                    console.log(res.status)
                }
            })
            this.init()
        }
        catch (error) {
            console.log("An error occurred during Load Data request:", error);
        }
    }

    //updates component's state without saving data
    updateWithoutSave(newValues) {
        let newProfile = Object.assign({}, this.state.profileData, newValues);
        this.setState({
            profileData: newProfile
        })
    }

    //updates component's state and saves data
    updateAndSaveData(newValues) {
        let newProfile = Object.assign({}, this.state.profileData, newValues)
        this.setState({
            profileData: newProfile
        }, this.saveProfile)
    }

    handleUserInput(event) {
        const name = event.target.name;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        if (event.target.type === 'checkbox') {
            this.setState({
                [name]: value
            })
        }
    }

    updateForComponentId(componentId, newValues) {
        let data = {};
        data[componentId] = newValues;
        this.updateAndSaveData(newValues)
    }

    saveProfile() {
        let cookies = Cookies.get('talentAuthToken');
        try {
            $.ajax({
                url: 'https://talentservicesprofile20240417233610.azurewebsites.net/profile/profile/updateTalentProfile',
                headers: {
                    'Authorization': 'Bearer ' + cookies,
                    'Content-Type': 'application/json'
                },
                type: "POST",
                data: JSON.stringify(this.state.profileData),

                success: function (res) {
                    console.log(res)
                    if (res.success == true) {
                        TalentUtil.notification.show("Profile updated sucessfully", "success", null, null)
                    } else {
                        TalentUtil.notification.show("Profile did not update successfully", "error", null, null)
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
            console.log("An error occurred during Save Profile request:", error);
        }
    }

    render() {
       
        const profile = {
            firstName: this.state.profileData.firstName,
            lastName: this.state.profileData.lastName,
            email: this.state.profileData.email,
            phone: this.state.profileData.phone, 
        }

        const selfintro = {
            summary: this.state.profileData.summary,
            description: this.state.profileData.description
        }

        const visastatus = {
            visaStatus: this.state.profileData.visaStatus,
            visaExpiryDate: this.state.profileData.visaExpiryDate
        }

        const profilePhoto = {
            profilePhoto: this.state.profileData.profilePhoto,
            profilePhotoUrl: this.state.profileData.profilePhotoUrl
        }

        return (
            <BodyWrapper reload={this.loadData} loaderData={this.state.loaderData}>
                <section className="page-body">
                    <div className="ui container">
                        <div className="ui container">
                            <div className="profile">
                                <form className="ui form">
                                    <div className="ui grid">
                                        <FormItemWrapper
                                            title='Linked Accounts'
                                            tooltip='Linking to online social networks adds credibility to your profile'
                                        >
                                            <SocialMediaLinkedAccount
                                                controlFunc={this.updateForComponentId}
                                                linkedDetails={this.state.profileData.linkedAccounts}
                                                componentId='SocialMediaLinkedAccount'
                                            />
                                       </FormItemWrapper>
                                        <FormItemWrapper
                                            title='User Details'
                                            tooltip='Enter your contact details'
                                        >
                                            <IndividualDetailSection
                                                controlFunc={this.updateForComponentId}
                                                details={profile}
                                                componentId='contactDetails'
                                            />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='Address'
                                            tooltip='Enter your current address'>
                                            <Address
                                                controlFunc={this.updateForComponentId}
                                                addressDetails={this.state.profileData.address}
                                                componentId='address'
                                            />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='Nationality'
                                            tooltip='Select your nationality'
                                        >
                                            <Nationality
                                                controlFunc={this.updateForComponentId}
                                                componentId='nationality'
                                                nationalityDetails={this.state.profileData.nationality}
                                            />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='Languages'
                                            tooltip='Select languages that you speak'
                                        >
                                            <Language
                                                languageData={this.state.profileData.languages}
                                                controlFunc={this.updateForComponentId}
                                                componentId='languages'
                                            />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='Skills'
                                            tooltip='List your skills'
                                        >
                                            <Skill
                                                skillData={this.state.profileData.skills}
                                                controlFunc={this.updateForComponentId}
                                                componentId='skills'
                                            />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='Work experience'
                                            tooltip='Add your work experience'
                                        >
                                            <Experience
                                                experienceData={this.state.profileData.experience}
                                                updateProfileData={this.updateAndSaveData}
                                                controlFunc={this.updateForComponentId}
                                                componentId='experience'
                                            />
                                        </FormItemWrapper>
                                        {/*<FormItemWrapper*/}
                                        {/*    title='Education'*/}
                                        {/*    tooltip='Add your educational background'*/}
                                        {/*>*/}
                                        {/*    <Education*/}
                                        {/*        educationData={this.state.profileData.education}*/}
                                        {/*        updateProfileData={this.updateAndSaveData}*/}
                                        {/*    />*/}
                                        {/*</FormItemWrapper>*/}
                                        {/*<FormItemWrapper*/}
                                        {/*    title='Certification'*/}
                                        {/*    tooltip='List your certificates, honors and awards'*/}
                                        {/*>*/}
                                        {/*    <Certificate*/}
                                        {/*        certificateData={this.state.profileData.certifications}*/}
                                        {/*        updateProfileData={this.updateAndSaveData}*/}
                                        {/*    />*/}
                                        {/*</FormItemWrapper>*/}
                                        <FormItemWrapper
                                            title='Visa Status'
                                            tooltip='What is your current Visa/Citizenship status?'
                                        >
                                            <VisaStatus
                                                visaDetails={visastatus}
                                                controlFunc={this.updateForComponentId}
                                                componentId='visaStatus'
                                            />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='Status'
                                            tooltip='What is your current status in jobseeking?'
                                        >
                                            <TalentStatus
                                                status={this.state.profileData.jobSeekingStatus}
                                                controlFunc={this.updateForComponentId}
                                                componentId='jobSeekingStatus'
                                            />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='Profile Photo'
                                            tooltip='Please upload your profile photo'
                                            hideSegment={true}
                                        >
                                            <PhotoUpload
                                                imageId={profilePhoto}
                                                controlFunc={this.updateForComponentId}
                                                componentId='photoUpload'
                                                savePhotoUrl='https://talentservicesprofile20240417233610.azurewebsites.net/profile/profile/updateProfilePhoto'
                                            />
                                        </FormItemWrapper>
                                        {/*<FormItemWrapper*/}
                                        {/*    title='Profile Video'*/}
                                        {/*    tooltip='Upload a brief self-introduction video'*/}
                                        {/*    hideSegment={true}*/}
                                        {/*>*/}
                                        {/*    <VideoUpload*/}
                                        {/*        videoName={this.state.profileData.videoName}*/}
                                        {/*        updateProfileData={this.updateWithoutSave}*/}
                                        {/*        saveVideoUrl={'https://talentservicesprofile20240417233610.azurewebsites.net/profile/profile/updateTalentVideo'}*/}
                                        {/*    />*/}
                                        {/*</FormItemWrapper>*/}
                                        {/*<FormItemWrapper*/}
                                        {/*    title='CV'*/}
                                        {/*    tooltip='Upload your CV. Accepted files are pdf, doc & docx)'*/}
                                        {/*    hideSegment={true}*/}
                                        {/*>*/}
                                        {/*    <CVUpload*/}
                                        {/*        cvName={this.state.profileData.cvName}*/}
                                        {/*        cvUrl={this.state.profileData.cvUrl}*/}
                                        {/*        updateProfileData={this.updateWithoutSave}*/}
                                        {/*        saveCVUrl={'https://talentservicesprofile20240417233610.azurewebsites.net/profile/profile/updateTalentCV'}*/}
                                        {/*    />*/}
                                        {/*</FormItemWrapper>*/}
                                        <FormItemWrapper
                                            title='Description'
                                            tooltip='Please add a summary and description'
                                        >
                                             <SelfIntroduction
                                                selfIntroDetails={selfintro}
                                                controlFunc={this.updateForComponentId}
                                                componentId='SelfIntroduction'
                                            />
                                        </FormItemWrapper>
                                    </div>
                                </form>
                            </div >
                        </div>
                    </div>
                </section>
            </BodyWrapper>
        )
    }
}
