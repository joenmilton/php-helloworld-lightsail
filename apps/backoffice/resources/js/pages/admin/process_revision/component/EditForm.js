import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { 
    loadJournalSettings,
    addProcessRevision,
    saveMasterActivity,
    saveProcessRevision
} from '../../../../redux';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';

import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";

const ProcessRevisionForm = ({ 
    id, formType, parentData, onClose, 
    settingsInitialized, settingsLoading, settings, saveLoading, revisionDetail, 
    loadJournalSettings, addProcessRevision, saveMasterActivity, saveProcessRevision
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
            updatedRecord = { ...revisionDetail, activity_id: '' };
            addProcessRevision(updatedRecord);
            return;
        }

        updatedRecord = { ...revisionDetail, activity_id: values.value };
        addProcessRevision(updatedRecord);
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

        const updatedRecord = { ...revisionDetail, activity_id: newData };
        addProcessRevision(updatedRecord);
    }
    


    const changeSubmissionDate = (date) => {
        const updatedRecord = {
            ...revisionDetail,
            submission_date: new Date(date).toISOString()
        };
        addProcessRevision(updatedRecord);
    }

    const changeRevisionDate = (date) => {
        const updatedRecord = {
            ...revisionDetail,
            due_date: new Date(date).toISOString()
        };
        addProcessRevision(updatedRecord);
    }

    const onTaskAttachmentInputChange = async(flag) => {
        const updatedRecord = {
            ...revisionDetail,
            enable_task_attach: !flag
        };
        addProcessRevision(updatedRecord);
    }
  
    const taskFetchAsChange = (e) => {

        const updatedRecord = {
            ...revisionDetail,
            fetch_as: e.target.value
        };
        addProcessRevision(updatedRecord);
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
            updatedRecord = { ...revisionDetail, revised_by: '' };
            addProcessRevision(updatedRecord);
            return;
        }

        updatedRecord = { ...revisionDetail, revised_by: values.value };
        addProcessRevision(updatedRecord);
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
            updatedRecord = { ...revisionDetail, status: '' };
            addProcessRevision(updatedRecord);
            return;
        }

        updatedRecord = { ...revisionDetail, status: values.value };
        addProcessRevision(updatedRecord);
    }


    const handleSave = async(e) => {
        const response = await saveProcessRevision(revisionDetail);
        
        if(response.httpCode == 422) {
            setError(response.errors)
        }

        if(response.httpCode === 200) {
            onClose()
        }
    }

    const duedateValue = (date) => {
        if(!date) { return '' }
        return new Date(date).toISOString()
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
                    <h2 className="sub-head mb-3 px-4">
                        Create Paper Revision
                    </h2>
                    <div className="row px-4">
                        <div className="col-md-12">

                            {
                                (revisionDetail?.revision_type === 'revision') ? <div className="mb-3">
                                    <label className="form-label" htmlFor="due_date">Revision Due Date</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="bx bx-calendar-event"></i>
                                        </span>
                                        <Flatpickr
                                            id="due_date"
                                            name="due_date"
                                            className="form-control"
                                            value={duedateValue(revisionDetail.due_date)}
                                            options={{
                                                enableTime: false,
                                                dateFormat: "d-M-Y",
                                                time_24hr: true,
                                                defaultHour: 0,
                                                disableMobile: "true"
                                            }}
                                            onChange={([date]) => {
                                                if (date) {
                                                    changeRevisionDate(date)
                                                }
                                            }}
                                        />
                                    </div>
                                    {errors.due_date && (
                                        <div className="d-block invalid-feedback">
                                            {errors.due_date.join(', ')}
                                        </div>
                                    )}
                                </div> : null
                            }
                            
                            <div className="mb-3">
                                <label className="form-label" htmlFor="submission_date">{(revisionDetail?.revision_type === 'revision') ? 'Revision' : ''} Submission Date</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bx bx-calendar-event"></i>
                                    </span>
                                    <Flatpickr
                                        id="submission_date"
                                        name="submission_date"
                                        className="form-control"
                                        value={duedateValue(revisionDetail.submission_date)}
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
                                    Tech. Status
                                </label>
                                <Select
                                    id="revision_status"
                                    classNamePrefix="revision-status-select"
                                    placeholder={"Select A Status...."}
                                    closeMenuOnSelect={true}
                                    value={revisionStatusValue(settings?.status?.revision, revisionDetail.status)}
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
                                                checked={revisionDetail?.enable_task_attach} 
                                                onChange={() => onTaskAttachmentInputChange(revisionDetail?.enable_task_attach)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                (revisionDetail?.enable_task_attach) ? <>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="journal_name">
                                            Worked By / Revision By
                                        </label>
                                        <Select
                                            id="revised_by"
                                            classNamePrefix="owner-select"
                                            placeholder={"Select A Staff...."}
                                            closeMenuOnSelect={true}
                                            value={revisedByValue(settings?.staffs, revisionDetail.revised_by)}
                                            options={revisedByOptions(settings?.staffs)}
                                            onChange={(value) => handleRevisedByChange(value)}
                                        />
                                        {errors.revised_by && (
                                            <div className="d-block invalid-feedback">
                                                {errors.revised_by.join(', ')}
                                            </div>
                                        )}
                                    </div>
                                    {   (revisionDetail?.activity) ? <div className="mb-3">
                                            <label className="form-label" htmlFor="journal_name">
                                                Activity
                                            </label>
                                            <div>{revisionDetail?.activity?.title}</div>
                                        </div> :
                                        (revisionDetail?.revised_by && revisionDetail?.revised_by !== '') ? <>
                                            <div className="mb-3">
                                                <span className="me-4">
                                                    <input
                                                        className="form-check-input me-2"
                                                        type="radio"
                                                        name="visible_to"
                                                        id="formRadios1"
                                                        value="new"
                                                        checked={revisionDetail?.fetch_as === 'new'}
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
                                                        checked={revisionDetail?.fetch_as === 'existing'}
                                                        onChange={taskFetchAsChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="formRadios2">
                                                        Existing Task
                                                    </label>
                                                </span>
                                            </div>
                                            {
                                                (revisionDetail?.fetch_as === 'existing') ? <div className="mb-3">
                                                    <label className="form-label" htmlFor="activity_id">
                                                        <span className="text-danger me-1">*</span>
                                                        Select Task (Activity)
                                                    </label>
                                                    <CreatableSelect
                                                        isClearable
                                                        placeholder={"Select or create a task..."}
                                                        noOptionsMessage={() => "No options found"}
                                                        formatCreateLabel={(inputTaskValue) => `Create "${inputTaskValue}"`}
                                                        value={taskValue(settings?.tasks, revisionDetail.activity_id)}
                                                        options={taskOptions(settings?.tasks)}
                                                        onChange={(value) => handleTaskChange(value)}
                                                        onCreateOption={(value) => handleTaskCreateOption(value, parentData?.dealId, revisionDetail.revised_by)}
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
                        </div>
                    </div>
                </div>
                <div>
                    <div className="px-4 py-2 sidebar-footer border-top-custom">
                        <div className="d-flex align-items-start"> 
                            <button type="button" className="btn w-sm ms-auto me-2" onClick={() => { onClose();}}>Cancel</button>
                            <button type="button" disabled={saveLoading || settingsLoading} className="btn btn-purple w-sm" onClick={handleSave}>
                                {(saveLoading || settingsLoading) ? 'Saving...' : 'Save'}
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
    revisionDetail: state.journal.revisionDetail
});
const mapDispatchToProps = {
    loadJournalSettings,
    addProcessRevision,
    saveMasterActivity,
    saveProcessRevision
};
export default connect(mapStateToProps, mapDispatchToProps)(ProcessRevisionForm);