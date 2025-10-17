import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { 
    loadJournalSettings,
    addJournalProcessing,
    saveMasterPublisher,
    saveMasterJournal,
    saveMasterActivity,
    saveJournalProcessing
} from '../../../../redux';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';

import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";

const JournalProcessingForm = ({ 
    id, formType, parentData, onClose, 
    settingsInitialized, settingsLoading, settings, saveLoading, processingDetail,
    loadJournalSettings, addJournalProcessing, saveMasterPublisher, saveMasterJournal, saveMasterActivity, saveJournalProcessing
}) => {
    const [errors, setError]                        = useState({});

    useEffect(async() => {
        if(!settingsInitialized) {
            const queryFilter = {
                deal_id: parentData?.dealId
            }
            await loadJournalSettings(queryFilter);
        }
    }, [settingsInitialized])

    const journalProcessingChange = (e) => {
        let updatedRecord = {};
        const { name, value } = e.target;

        switch (name) {
            case 'url': {
                updatedRecord = {
                    ...processingDetail,
                    url: value,
                };
                addJournalProcessing(updatedRecord);
                break;
            }

            default:
                break;
        }
    }

    const revisedByValue = (staffs, staff_id) => {
        if(staff_id === '') {
            return null
        }

        const staff = staffs.find(p => p.id === staff_id)
        if(!staff) {
            return null
        }

        return {
            label: staff.name,
            value: staff.id
        }
    }
    const revisedByOptions = (staffs) => {
        if(!staffs) {
            return [];
        }

        return staffs.map(p => {
            return {
                label: p.name,
                value: p.id
            }
        })
    }
    const handleRevisedByChange = async (values) => {

        let updatedRecord;

        if(!values) {
            updatedRecord = { ...processingDetail, revised_by: '' };
            addJournalProcessing(updatedRecord);
            return;
        }

        updatedRecord = { ...processingDetail, revised_by: values.value };
        addJournalProcessing(updatedRecord);
    }














    const publisherValue = (publishers, publisher_id) => {
        if(publisher_id === '') {
            return null
        }

        const publisher = publishers.find(p => p.id === publisher_id)
        if(!publisher) {
            return null
        }

        return {
            label: publisher.name,
            value: publisher.id
        }
    }
    const publisherOptions = (publishers) => {
        if(!publishers) {
            return [];
        }

        return publishers.map(p => {
            return {
                label: p.name,
                value: p.id
            }
        })
    }
    const handlePublisherCreateOption = async(value, dealId) => {
        const queryFilter = {
            deal_id: dealId
        }

        const newData = await saveMasterPublisher(value, queryFilter);
        if(!newData) {
            return;
        }

        const updatedRecord = { ...processingDetail, publisher_id: newData, journal_id: '' };
        addJournalProcessing(updatedRecord);
    }
    const handlePublisherChange = async (values) => {

        let updatedRecord;

        if(!values) {
            updatedRecord = { ...processingDetail, publisher_id: '', journal_id: '' };
            addJournalProcessing(updatedRecord);
            return;
        }

        updatedRecord = { ...processingDetail, publisher_id: values.value, journal_id: '' };
        addJournalProcessing(updatedRecord);
    }







    const masterJournalValue = (publishers, publisher_id, journal_id) => {
        if(publisher_id === '' || journal_id == '') {
            return null
        }

        const publisher = publishers.find(p => p.id === publisher_id)
        if(!publisher || publisher?.journals <= 0) {
            return null
        }

        const journal = publisher?.journals.find(j => j.id === journal_id)
        if(!journal) {
            return null
        }

        return {
            label: journal.journal_name,
            value: journal.id
        }
    }
    const masterJournalOptions = (publishers, publisher_id) => {
        const foundPublisher = publishers.find(pub => pub.id === publisher_id)
        if(!foundPublisher || foundPublisher?.journals.length <= 0) {
            return [];
        }

        return foundPublisher?.journals.map(j => {
            return {
                label: j.journal_name,
                value: j.id
            }
        })
    }
    const handleMasterJournalCreateOption = async(value, publisher_id, dealId) => {
        const queryFilter = {
            deal_id: dealId
        }

        const newData = await saveMasterJournal(value, publisher_id, queryFilter);
        if(!newData) {
            return;
        }

        const updatedRecord = { ...processingDetail, journal_id: newData };
        addJournalProcessing(updatedRecord);
    }
    const handleMasterJournalChange = async (values) => {

        let updatedRecord;

        if(!values) {
            updatedRecord = { ...processingDetail, journal_id: '' };
            addJournalProcessing(updatedRecord);
            return;
        }

        updatedRecord = { ...processingDetail, journal_id: values.value };
        addJournalProcessing(updatedRecord);
    }





    const taskValue = (tasks, activity_id) => {
        if(activity_id === '') {
            return null
        }

        const task = tasks.find(p => p.id === activity_id)
        if(!task) {
            return null
        }

        return {
            label: task.title,
            value: task.id
        }
    }
    const taskOptions = (tasks) => {
        if(!tasks) {
            return [];
        }

        return tasks.map(p => {
            return {
                label: p.title,
                value: p.id
            }
        })
    }
    const handleTaskChange = async (values) => {

        let updatedRecord;

        if(!values) {
            updatedRecord = { ...processingDetail, activity_id: '' };
            addJournalProcessing(updatedRecord);
            return;
        }

        updatedRecord = { ...processingDetail, activity_id: values.value };
        addJournalProcessing(updatedRecord);
    }
    const handleTaskCreateOption = async(value, dealId, ownerId) => {
        const queryFilter = {
            deal_id: dealId
        }

        const newActivity = {
            id: '',
            module: 'deal',
            module_id: dealId,
            title: value,
            due_date: new Date().toISOString(),
            end_date: new Date().toISOString(),
            start_time: '00:01',
            end_time: '23:59',
            reminder_minutes: 0,
            reminder_type: 'minutes',
            description: '',
            note: '',
            owner_id: ownerId,
            completed: false,
        }

        const newData = await saveMasterActivity(newActivity, queryFilter);
        if(!newData) {
            return;
        }

        const updatedRecord = { ...processingDetail, activity_id: newData };
        addJournalProcessing(updatedRecord);
    }
    
    



    const changeSubmissionDate = (date) => {
        const updatedRecord = {
            ...processingDetail,
            submission_date: new Date(date).toISOString()
        };
        addJournalProcessing(updatedRecord);
    }

    const changeRevisionDate = (date) => {
        const updatedRecord = {
            ...processingDetail,
            due_date: new Date(date).toISOString()
        };
        addJournalProcessing(updatedRecord);
    }

    const onTaskAttachmentInputChange = async(flag) => {
        const updatedRecord = {
            ...processingDetail,
            enable_task_attach: !flag
        };
        addJournalProcessing(updatedRecord);
    }
    
    const taskFetchAsChange = (e) => {

        const updatedRecord = {
            ...processingDetail,
            fetch_as: e.target.value
        };
        addJournalProcessing(updatedRecord);
    }
    

    const publisherStatusValue = (statusList, status_id) => {
        if(status_id === '') {
            return null
        }

        const status = statusList.find(s => s.id === status_id)
        if(!status) {
            return null
        }

        return {
            label: status.name,
            value: status.id
        }
    }
    const publisherStatusOptions = (status) => {
        if(!status) {
            return [];
        }

        return status.map(p => {
            return {
                label: p.name,
                value: p.id
            }
        })
    }
    const handlePublisherStatusChange = async (values) => {

        let updatedRecord;

        if(!values) {
            updatedRecord = { ...processingDetail, status: '' };
            addJournalProcessing(updatedRecord);
            return;
        }

        updatedRecord = { ...processingDetail, process_status: values.value };
        addJournalProcessing(updatedRecord);
    }


    const revisionStatusValue = (statusList, status_id) => {
        if(status_id === '') {
            return null
        }

        const status = statusList.find(s => s.id === status_id)
        if(!status) {
            return null
        }

        return {
            label: status.name,
            value: status.id
        }
    }
    const revisionStatusOptions = (status) => {
        if(!status) {
            return [];
        }

        return status.map(p => {
            return {
                label: p.name,
                value: p.id
            }
        })
    }
    const handleRevisionStatusChange = async (values) => {

        let updatedRecord;

        if(!values) {
            updatedRecord = { ...processingDetail, status: '' };
            addJournalProcessing(updatedRecord);
            return;
        }

        updatedRecord = { ...processingDetail, status: values.value };
        addJournalProcessing(updatedRecord);
    }

    const getExtraValue = (extraInfo, label) => {
        if(!extraInfo || extraInfo === '') {
            return '';
        }

        if (Array.isArray(extraInfo)) {
            const entry = extraInfo.find(info => info.label === label);
            return entry ? entry.value : "";
        }

        return "";
    };


    const setExtraValue = (e) => {
        const name = e.target.name;
        const value = e.target.value;
    
        const extraInfo = processingDetail.extra_info || [];
        const index = extraInfo.findIndex(info => info.label === name);

        if (index !== -1) {
            extraInfo[index].value = value;
        } else {
            extraInfo.push({ label: name, value });
        }

        const updatedRecord = { 
            ...processingDetail, 
            extra_info: extraInfo 
        };

        addJournalProcessing(updatedRecord);
    }
    
    const onShareInputChange = (flag) => {
        const updatedRecord = { 
            ...processingDetail, 
            shared: !flag 
        };

        addJournalProcessing(updatedRecord);
    }

    const handleSave = async(e) => {
        const response = await saveJournalProcessing(processingDetail);
        
        if(response.httpCode == 422) {
            setError(response.errors)
        }

        if(response.httpCode === 200) {
            onClose()
        }
    }

    return (
        <>
           <div className="rightbar-title d-flex align-items-center pe-3">
                <a href="" onClick={(event) => { event.preventDefault(); onClose(); }} className="right-bar-toggle-close ms-auto">
                    <i className="mdi mdi-close noti-icon"></i>
                </a>
            </div>
            <div className="d-flex flex-column h-full w-screen">
                <div className="d-flex flex-column flex-equal overflow-x-hidden overflow-y-scroll py-4">
                    
                    
                    
                    <ul className="nav nav-tabs" role="tablist">
                        <li className="nav-item" role="presentation">
                            <a className="nav-link active" data-bs-toggle="tab" href="#navtabs-home" role="tab" aria-selected="false" tabIndex="-1">
                                <span className="d-block d-sm-none"><i className="fas fa-home"></i></span>
                                <span className="d-none d-sm-block">Status Info</span>    
                            </a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a className="nav-link" data-bs-toggle="tab" href="#navtabs-profile" role="tab" aria-selected="true">
                                <span className="d-block d-sm-none"><i className="far fa-user"></i></span>
                                <span className="d-none d-sm-block">Login Info</span>    
                            </a>
                        </li>
                    </ul>
                    
                    <div className="tab-content p-3">

                        <div className="tab-pane active show" id="navtabs-home" role="tabpanel">
                            <div className="d-flex justify-content-between align-items-center">
                                <h2 className="sub-head mb-3 px-4">Update Publisher Status</h2>
                                <div>
                                    <label className="form-check-label m-0 me-2" htmlFor="flexSwitchCheckChecked">Share with client?</label>
                                    <div>
                                        <div className="form-check form-switch form-switch-md m-0 me-2">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                id="flexSwitchCheckChecked"
                                                name="shared"
                                                checked={processingDetail?.shared || false} 
                                                onChange={() => onShareInputChange(processingDetail?.shared)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row px-4">
                                <div className="col-md-12">
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="publisher">
                                            <span className="text-danger me-1">*</span>
                                            Publisher
                                        </label>
                                        <CreatableSelect
                                            isClearable
                                            placeholder={"Select or create an option..."}
                                            noOptionsMessage={() => "No options found"}
                                            formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
                                            value={publisherValue(settings?.master_publishers, processingDetail.publisher_id)}
                                            options={publisherOptions(settings?.master_publishers)}
                                            onChange={(value) => handlePublisherChange(value)}
                                            onCreateOption={(value) => handlePublisherCreateOption(value, parentData?.dealId)}
                                        />
                                        {errors.publisher_id && (
                                            <div className="d-block invalid-feedback">
                                                {errors.publisher_id.join(', ')}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="journal_name">
                                            <span className="text-danger me-1">*</span>
                                            Journal Name
                                        </label>
                                        <CreatableSelect
                                            isClearable
                                            placeholder={"Select or create an option..."}
                                            noOptionsMessage={() => "No options found"}
                                            formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
                                            value={masterJournalValue(settings?.master_publishers, processingDetail.publisher_id, processingDetail.journal_id)}
                                            options={masterJournalOptions(settings?.master_publishers, processingDetail.publisher_id)}
                                            onChange={(value) => handleMasterJournalChange(value)}
                                            onCreateOption={(value) => handleMasterJournalCreateOption(value, processingDetail.publisher_id, parentData?.dealId)}
                                        />
                                        {errors.journal_id && (
                                            <div className="d-block invalid-feedback">
                                                {errors.journal_id.join(', ')}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="submission_date">Submission Date</label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="bx bx-calendar-event"></i>
                                            </span>
                                            <Flatpickr
                                                id="submission_date"
                                                name="submission_date"
                                                className="form-control"
                                                value={processingDetail.submission_date}
                                                options={{
                                                    enableTime: false,
                                                    dateFormat: "d-M-Y",
                                                    time_24hr: true,
                                                    defaultHour: 0,
                                                    disableMobile: "true"
                                                }}
                                                onChange={([date]) => {
                                                    if (date) {
                                                        changeSubmissionDate(date)
                                                    }
                                                }}
                                            />
                                        </div>
                                        {errors.submission_date && (
                                            <div className="d-block invalid-feedback">
                                                {errors.submission_date.join(', ')}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="status">
                                            Publisher Status
                                        </label>
                                        <Select
                                            id="process_status"
                                            classNamePrefix="process-status-select"
                                            placeholder={"Select Publisher Status...."}
                                            closeMenuOnSelect={true}
                                            value={publisherStatusValue(settings?.status?.process, processingDetail.process_status)}
                                            options={publisherStatusOptions(settings?.status?.process)}
                                            onChange={(value) => handlePublisherStatusChange(value)}
                                        />
                                        {errors.process_status && (
                                            <div className="d-block invalid-feedback">
                                                {errors.process_status.join(', ')}
                                            </div>
                                        )}
                                    </div>

                                    {
                                        (!id) ? <>
                                            <div className="mb-3">
                                                <label className="form-label" htmlFor="status">
                                                    Tech. Status
                                                </label>
                                                <Select
                                                    id="revision_status"
                                                    classNamePrefix="revision-status-select"
                                                    placeholder={"Select A Status...."}
                                                    closeMenuOnSelect={true}
                                                    value={revisionStatusValue(settings?.status?.revision, processingDetail.status)}
                                                    options={revisionStatusOptions(settings?.status?.revision)}
                                                    onChange={(value) => handleRevisionStatusChange(value)}
                                                />
                                                {errors.status && (
                                                    <div className="d-block invalid-feedback">
                                                        {errors.status.join(', ')}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mb-3">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <label className="form-check-label m-0 me-2" htmlFor="flexSwitchCheckChecked">Do you want to attach activity task?</label>
                                                    <div>
                                                        <div className="form-check form-switch form-switch-md m-0 me-2">
                                                            <input 
                                                                className="form-check-input" 
                                                                type="checkbox" 
                                                                id="flexSwitchCheckChecked"
                                                                name="attach_activity"
                                                                checked={processingDetail?.enable_task_attach} 
                                                                onChange={() => onTaskAttachmentInputChange(processingDetail?.enable_task_attach)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                (processingDetail?.enable_task_attach) ? <>
                                                    <div className="mb-3">
                                                        <label className="form-label" htmlFor="journal_name">
                                                            Worked By / Revision By
                                                        </label>
                                                        <Select
                                                            isClearable
                                                            id="revised_by"
                                                            classNamePrefix="owner-select"
                                                            placeholder={"Select A Staff...."}
                                                            closeMenuOnSelect={true}
                                                            value={revisedByValue(settings?.staffs, processingDetail.revised_by)}
                                                            options={revisedByOptions(settings?.staffs)}
                                                            onChange={(value) => handleRevisedByChange(value)}
                                                        />
                                                        {errors.revised_by && (
                                                            <div className="d-block invalid-feedback">
                                                                {errors.revised_by.join(', ')}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {
                                                        (processingDetail?.activity) ? <div className="mb-3">
                                                            <label className="form-label" htmlFor="journal_name">
                                                                Activity
                                                            </label>
                                                            <div>{processingDetail?.activity?.title}</div>
                                                        </div> :
                                                        (processingDetail?.revised_by && processingDetail?.revised_by !== '') ? <>
                                                            <div className="mb-3">
                                                                <span className="me-4">
                                                                    <input
                                                                        className="form-check-input me-2"
                                                                        type="radio"
                                                                        name="visible_to"
                                                                        id="formRadios1"
                                                                        value="new"
                                                                        checked={processingDetail?.fetch_as === 'new'}
                                                                        onChange={taskFetchAsChange}
                                                                    />
                                                                    <label className="form-check-label" htmlFor="formRadios1">
                                                                        New Task
                                                                    </label>
                                                                </span>
                                                                <span className="me-4">
                                                                    <input
                                                                        className="form-check-input me-2"
                                                                        type="radio"
                                                                        name="visible_to"
                                                                        id="formRadios2"
                                                                        value="existing"
                                                                        checked={processingDetail?.fetch_as === 'existing'}
                                                                        onChange={taskFetchAsChange}
                                                                    />
                                                                    <label className="form-check-label" htmlFor="formRadios2">
                                                                        Existing Task
                                                                    </label>
                                                                </span>
                                                            </div>
                                                            {
                                                                (processingDetail?.fetch_as === 'existing') ? <div className="mb-3">
                                                                    <label className="form-label" htmlFor="activity_id">
                                                                        <span className="text-danger me-1">*</span>
                                                                        Select Task (Activity)
                                                                    </label>
                                                                    <CreatableSelect
                                                                        isClearable
                                                                        placeholder={"Select or create a task..."}
                                                                        noOptionsMessage={() => "No options found"}
                                                                        formatCreateLabel={(inputTaskValue) => `Create "${inputTaskValue}"`}
                                                                        value={taskValue(settings?.tasks, processingDetail.activity_id)}
                                                                        options={taskOptions(settings?.tasks)}
                                                                        onChange={(value) => handleTaskChange(value)}
                                                                        onCreateOption={(value) => handleTaskCreateOption(value, parentData?.dealId, processingDetail.revised_by)}
                                                                    />
                                                                    {errors.activity_id && (
                                                                        <div className="d-block invalid-feedback">
                                                                            {errors.activity_id.join(', ')}
                                                                        </div>
                                                                    )}
                                                                </div> : null
                                                            }
                                                        </> : null
                                                    }
                                                </> : null
                                            }
                                        </> : null
                                    }
                                </div>
                            </div>






                        </div>

                        <div className="tab-pane" id="navtabs-profile" role="tabpanel">


                            <h2 className="sub-head mb-3 px-4">
                                Update Login Information
                            </h2>
                            <div className="row px-4">
                                <div className="col-md-12">
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="url">
                                            URL
                                        </label>
                                        <textarea 
                                            id="url"
                                            name="url"
                                            value={processingDetail.url || ""}
                                            onChange={journalProcessingChange}
                                            className="form-control"
                                            autoComplete="off"
                                        ></textarea>
                                        {errors.url && (
                                            <div className="d-block invalid-feedback">
                                                {errors.url.join(', ')}
                                            </div>
                                        )}
                                    </div>
                                    {
                                        (settings?.extra_label) ? settings?.extra_label.map((label, index) => {
                                            return (
                                                <div className="mb-2" key={index}>
                                                    <label className="form-label" htmlFor={label}>{label}</label>
                                                    <input 
                                                        type="text"
                                                        name={label}
                                                        id={label}
                                                        value={getExtraValue(processingDetail?.extra_info, label) || ''}
                                                        onChange={setExtraValue}
                                                        className="form-control bg-white shadow-sm ring-1 ring-neutral-300"
                                                        placeholder=""
                                                    />
                                                </div>
                                            )
                                        }) : null
                                    }
                                </div>
                            </div>



                        </div>
                    </div>

                    
                    
                    


                </div>
                <div>
                    <div className="px-4 py-2 sidebar-footer border-top-custom">
                        <div className="d-flex align-items-start"> 
                            <button type="button" className="btn w-sm ms-auto me-2" onClick={() => { onClose();}}>Cancel</button>
                            <button type="button" disabled={saveLoading || settingsLoading} className="btn btn-purple w-sm" onClick={handleSave}>
                                { (settingsLoading) ? 'Loading...' : (saveLoading) ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
const mapStateToProps = (state) => ({
    settingsInitialized: state.journal.settingsInitialized,
    settingsLoading: state.journal.settingsLoading,
    settings: state.journal.settings,
    saveLoading: state.journal.saveLoading,
    processingDetail: state.journal.processingDetail
});
const mapDispatchToProps = {
    loadJournalSettings,
    addJournalProcessing,
    saveMasterPublisher,
    saveMasterJournal,
    saveMasterActivity,
    saveJournalProcessing
};
export default connect(mapStateToProps, mapDispatchToProps)(JournalProcessingForm);