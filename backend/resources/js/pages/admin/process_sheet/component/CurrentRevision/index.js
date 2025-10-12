import React, { useState } from 'react';
import { connect } from 'react-redux';
import { 
    addProcessSheet,
    saveMasterActivity
} from '../../../../../redux';

import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";

const CurrentRevision = ({ 
    sheetDetail, parentData,
    settings,
    addProcessSheet, saveMasterActivity
}) => {
    const [errors, setError]                        = useState({});

    const duedateValue = (date) => {
        if(!date) { return '' }
        return new Date(date).toISOString()
    }

    const changeRevisionSubmissionDate = (date) => {
        const updatedRecord = {
            ...sheetDetail,
            current_revision: {
                ...sheetDetail.current_revision,
                submission_date: (date) ? new Date(date).toISOString() : ''
            }
        };
        addProcessSheet(updatedRecord);
    }

    const changeRevisionDueDate = (date) => {
        const updatedRecord = {
            ...sheetDetail,
            current_revision: {
                ...sheetDetail.current_revision,
                due_date: (date) ? new Date(date).toISOString() : ''
            }
        };
        addProcessSheet(updatedRecord);
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
            updatedRecord = { 
                ...sheetDetail, 
                current_revision: {
                    ...sheetDetail.current_revision,
                    tech_status: ''
                }
            };
            addProcessSheet(updatedRecord);
            return;
        }

        updatedRecord = { 
            ...sheetDetail, 
            current_revision: {
                ...sheetDetail.current_revision,
                tech_status: values.value 
            }
        };
        addProcessSheet(updatedRecord);
    }


    const onCurrentTaskAttachmentInputChange = (flag) => {
        console.log('onCurrentTaskAttachmentInputChange');
        const updatedRecord = {
            ...sheetDetail,
            current_revision: {
                ...sheetDetail.current_revision,
                enable_task_attach: !flag
            }
        };
        addProcessSheet(updatedRecord);
    }


    const currentRevisedByValue = (staffs, staff_id) => {
        console.log('currentRevisedByValue');
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
    const currentRevisedByOptions = (staffs) => {
        console.log('currentRevisedByOptions');
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
    const handleCurrentRevisedByChange = async (values) => {
        console.log('handleCurrentRevisedByChange');
        let updatedRecord;

        if(!values) {
            updatedRecord = { 
                ...sheetDetail, 
                current_revision: {
                    ...sheetDetail.current_revision,
                    revised_by: '' 
                }
            };
            addProcessSheet(updatedRecord);
            return;
        }

        updatedRecord = { 
            ...sheetDetail, 
            current_revision: {
                ...sheetDetail.current_revision,
                revised_by: values.value 
            }
        };
        addProcessSheet(updatedRecord);
    }


    const currentTaskFetchAsChange = (e) => {
        console.log('currentTaskFetchAsChange');
        const updatedRecord = {
            ...sheetDetail,
            current_revision: {
                ...sheetDetail.current_revision,
                fetch_as: e.target.value
            }
        };
        addProcessSheet(updatedRecord);
    }


    const currentTaskValue = (tasks, activity_id) => {
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
    const currentTaskOptions = (tasks) => {
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
    const handleCurrentTaskChange = async (values) => {

        let updatedRecord;

        if(!values) {
            updatedRecord = { 
                ...sheetDetail, 
                current_revision: {
                    ...sheetDetail.current_revision,
                    activity_id: '' 
                }
            };
            addProcessSheet(updatedRecord);
            return;
        }

        updatedRecord = { 
            ...sheetDetail, 
            current_revision: {
                ...sheetDetail.current_revision,
                activity_id: values.value 
            }
        };
        addProcessSheet(updatedRecord);
    }
    const handleCurrentTaskCreateOption = async(value, dealId, ownerId) => {
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

        const updatedRecord = { 
            ...sheetDetail, 
            current_revision: {
                ...sheetDetail.current_revision, 
                activity_id: newData   
            }
        };
        addProcessSheet(updatedRecord);
    }

    return (
        <div className="row">
            <div className="col-md-12">

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
                            value={duedateValue(sheetDetail?.current_revision?.submission_date)}
                            options={{
                                enableTime: false,
                                dateFormat: "d-M-Y",
                                time_24hr: true,
                                defaultHour: 0,
                                disableMobile: "true"
                            }}
                            onChange={([date]) => {
                                if (date) {
                                    changeRevisionSubmissionDate(date)
                                }
                            }}
                        />
                        <span className="input-group-text">
                            <i onClick={() => changeRevisionSubmissionDate(null)} className="bx bx-revision"></i>
                        </span>
                    </div>
                    {errors.submission_date && (
                        <div className="d-block invalid-feedback">
                            {errors.submission_date.join(', ')}
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor="due_date">Revision Due Date</label>
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="bx bx-calendar-event"></i>
                        </span>
                        <Flatpickr
                            id="due_date"
                            name="due_date"
                            className="form-control"
                            value={duedateValue(sheetDetail?.current_revision?.due_date)}
                            options={{
                                enableTime: false,
                                dateFormat: "d-M-Y",
                                time_24hr: true,
                                defaultHour: 0,
                                disableMobile: "true"
                            }}
                            onChange={([date]) => {
                                if (date) {
                                    changeRevisionDueDate(date)
                                }
                            }}
                        />
                        <span className="input-group-text">
                            <i onClick={() => changeRevisionDueDate(null)} className="bx bx-revision"></i>
                        </span>
                    </div>
                    {errors.due_date && (
                        <div className="d-block invalid-feedback">
                            {errors.due_date.join(', ')}
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor="tech_status">
                        Tech. Status
                    </label>
                    <Select
                        id="tech_status"
                        classNamePrefix="tech-status-select"
                        placeholder={"Select A Status...."}
                        closeMenuOnSelect={true}
                        value={revisionStatusValue(settings?.status?.revision, sheetDetail?.current_revision?.tech_status)}
                        options={revisionStatusOptions(settings?.status?.revision)}
                        onChange={(value) => handleRevisionStatusChange(value)}
                    />
                    {errors.tech_status && (
                        <div className="d-block invalid-feedback">
                            {errors.tech_status.join(', ')}
                        </div>
                    )}
                </div>
                {
                    (!sheetDetail?.submission || !sheetDetail?.submission?.activity_id || sheetDetail?.submission?.activity_id === '') ? <div className="alert alert-danger alert-top-border alert-dismissible fade show">
                        <i className="uil uil-exclamation-octagon font-size-16 text-danger me-2"></i>
                        Contact Journal / Technical Head to attach <b>Manuscript Task</b> with the submission main entry!
                    </div> : (!sheetDetail?.current_revision?.activity_id || sheetDetail?.current_revision?.activity_id === '')  ? 
                    <>
                        <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <label className="form-check-label m-0 me-2" htmlFor="currentFlexSwitchCheckChecked">Do you want to attach activity task?</label>
                                <div>
                                    <div className="form-check form-switch form-switch-md m-0 me-2">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            id="currentFlexSwitchCheckChecked"
                                            name="current_attach_activity"
                                            checked={sheetDetail?.current_revision?.enable_task_attach} 
                                            onChange={() => onCurrentTaskAttachmentInputChange(sheetDetail?.current_revision?.enable_task_attach)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            (sheetDetail?.current_revision?.enable_task_attach) ? <>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="current_revised_by">
                                        Worked By / Revision By
                                    </label>
                                    <Select
                                        id="current_revised_by"
                                        classNamePrefix="current-owner-select"
                                        placeholder={"Select A Staff...."}
                                        closeMenuOnSelect={true}
                                        value={currentRevisedByValue(settings?.staffs, sheetDetail?.current_revision?.revised_by)}
                                        options={currentRevisedByOptions(settings?.staffs)}
                                        onChange={(value) => handleCurrentRevisedByChange(value)}
                                    />
                                    {errors.revised_by && (
                                        <div className="d-block invalid-feedback">
                                            {errors.revised_by.join(', ')}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <span className="me-4">
                                        <input
                                            className="form-check-input me-2"
                                            type="radio"
                                            name="current_visible_to"
                                            id="currentFormRadios1"
                                            value="new"
                                            checked={sheetDetail?.current_revision?.fetch_as === 'new'}
                                            onChange={currentTaskFetchAsChange}
                                        />
                                        <label className="form-check-label" htmlFor="currentFormRadios1">
                                            New Task
                                        </label>
                                    </span>
                                </div>
                            </> : null
                        }
                    </> : null
                }
            </div>
        </div>
    );
};
const mapStateToProps = (state) => ({
    settings: state.journal.settings,
});
const mapDispatchToProps = {
    addProcessSheet, 
    saveMasterActivity
};
export default connect(mapStateToProps, mapDispatchToProps)(CurrentRevision);