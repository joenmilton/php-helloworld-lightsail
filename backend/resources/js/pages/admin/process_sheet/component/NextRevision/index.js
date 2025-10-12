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

const NextRevision = ({ 
    sheetDetail, parentData,
    settings,
    addProcessSheet, saveMasterActivity
}) => {
    const [errors, setError]                        = useState({});

    const duedateValue = (date) => {
        if(!date) { return '' }
        return new Date(date).toISOString()
    }

    const changeNextRevisionSubmissionDate = (date) => {
        const updatedRecord = {
            ...sheetDetail,
            next_revision: {
                ...sheetDetail.next_revision,
                submission_date: (date) ? new Date(date).toISOString() : ''
            }
        };
        addProcessSheet(updatedRecord);
    }

    const changeNextRevisionDueDate = (date) => {
        const updatedRecord = {
            ...sheetDetail,
            next_revision: {
                ...sheetDetail.next_revision,
                due_date: (date) ? new Date(date).toISOString() : ''
            }
        };
        addProcessSheet(updatedRecord);
    }


    const nextRevisionStatusValue = (statusList, status_id) => {
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
    const nextRevisionStatusOptions = (status) => {
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
    const handleNextRevisionStatusChange = async (values) => {

        let updatedRecord;

        if(!values) {
            updatedRecord = { 
                ...sheetDetail, 
                next_revision: {
                    ...sheetDetail.next_revision,
                    tech_status: ''
                }
            };
            addProcessSheet(updatedRecord);
            return;
        }

        updatedRecord = { 
            ...sheetDetail, 
            next_revision: {
                ...sheetDetail.next_revision,
                tech_status: values.value 
            }
        };
        addProcessSheet(updatedRecord);
    }

    const onNextTaskAttachmentInputChange = (flag) => {
        const updatedRecord = {
            ...sheetDetail,
            next_revision: {
                ...sheetDetail.next_revision,
                enable_task_attach: !flag
            }
        };
        addProcessSheet(updatedRecord);
    }


    const nextRevisedByValue = (staffs, staff_id) => {
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
    const nextRevisedByOptions = (staffs) => {
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
    const handleNextRevisedByChange = async (values) => {

        let updatedRecord;

        if(!values) {
            updatedRecord = { 
                ...sheetDetail, 
                next_revision: {
                    ...sheetDetail.next_revision,
                    revised_by: '' 
                }
            };
            addProcessSheet(updatedRecord);
            return;
        }

        updatedRecord = { 
            ...sheetDetail, 
            next_revision: {
                ...sheetDetail.next_revision,
                revised_by: values.value 
            }
        };
        addProcessSheet(updatedRecord);
    }


    const nextTaskFetchAsChange = (e) => {

        const updatedRecord = {
            ...sheetDetail,
            next_revision: {
                ...sheetDetail.next_revision,
                fetch_as: e.target.value
            }
        };
        addProcessSheet(updatedRecord);
    }


    const nextTaskValue = (tasks, activity_id) => {
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
    const nextTaskOptions = (tasks) => {
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
    const handleNextTaskChange = async (values) => {

        let updatedRecord;

        if(!values) {
            updatedRecord = { 
                ...sheetDetail, 
                next_revision: {
                    ...sheetDetail.next_revision,
                    activity_id: '' 
                }
            };
            addProcessSheet(updatedRecord);
            return;
        }

        updatedRecord = { 
            ...sheetDetail, 
            next_revision: {
                ...sheetDetail.next_revision,
                activity_id: values.value 
            }
        };
        addProcessSheet(updatedRecord);
    }
    const handleNextTaskCreateOption = async(value, dealId, ownerId) => {
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
            next_revision: {
                ...sheetDetail.next_revision, 
                activity_id: newData   
            }
        };
        addProcessSheet(updatedRecord);
    }

    return (
        <div className="row">
            <div className="col-md-12">

                <div className="mb-3">
                    <label className="form-label" htmlFor="next_submission_date">Submission Date</label>
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="bx bx-calendar-event"></i>
                        </span>
                        <Flatpickr
                            id="next_submission_date"
                            name="next_submission_date"
                            className="form-control"
                            value={duedateValue(sheetDetail?.next_revision?.submission_date)}
                            options={{
                                enableTime: false,
                                dateFormat: "d-M-Y",
                                time_24hr: true,
                                defaultHour: 0,
                                disableMobile: "true"
                            }}
                            onChange={([date]) => {
                                if (date) {
                                    changeNextRevisionSubmissionDate(date)
                                }
                            }}
                        />
                        <span className="input-group-text">
                            <i onClick={() => changeNextRevisionSubmissionDate(null)} className="bx bx-revision"></i>
                        </span>
                    </div>
                    {errors?.next_revision?.submission_date && (
                        <div className="d-block invalid-feedback">
                            {errors?.next_revision?.submission_date.join(', ')}
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor="next_due_date">Revision Due Date</label>
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="bx bx-calendar-event"></i>
                        </span>
                        <Flatpickr
                            id="next_due_date"
                            name="next_due_date"
                            className="form-control"
                            value={duedateValue(sheetDetail?.next_revision?.due_date)}
                            options={{
                                enableTime: false,
                                dateFormat: "d-M-Y",
                                time_24hr: true,
                                defaultHour: 0,
                                disableMobile: "true"
                            }}
                            onChange={([date]) => {
                                if (date) {
                                    changeNextRevisionDueDate(date)
                                }
                            }}
                        />
                        <span className="input-group-text">
                            <i onClick={() => changeNextRevisionDueDate(null)} className="bx bx-revision"></i>
                        </span>
                    </div>
                    {errors?.next_revision?.due_date && (
                        <div className="d-block invalid-feedback">
                            {errors?.next_revision?.due_date.join(', ')}
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor="next_tech_status">
                        Tech. Status
                    </label>
                    <Select
                        id="next_tech_status"
                        classNamePrefix="next-tech-status-select"
                        placeholder={"Select A Status...."}
                        closeMenuOnSelect={true}
                        value={nextRevisionStatusValue(settings?.status?.revision, sheetDetail?.next_revision?.tech_status)}
                        options={nextRevisionStatusOptions(settings?.status?.revision)}
                        onChange={(value) => handleNextRevisionStatusChange(value)}
                    />
                    {errors?.next_revision?.tech_status && (
                        <div className="d-block invalid-feedback">
                            {errors?.next_revision?.tech_status.join(', ')}
                        </div>
                    )}
                </div>
                
                {
                    (!sheetDetail?.submission || !sheetDetail?.submission?.activity_id || sheetDetail?.submission?.activity_id === '') ? <div className="alert alert-danger alert-top-border alert-dismissible fade show">
                        <i className="uil uil-exclamation-octagon font-size-16 text-danger me-2"></i>
                        Contact Journal / Technical Head to attach <b>Manuscript Task</b> with the submission main entry!
                    </div> : (!sheetDetail?.next_revision?.activity_id || sheetDetail?.next_revision?.activity_id === '') ? 
                    <>
                        <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <label className="form-check-label m-0 me-2" htmlFor="nextFlexSwitchCheckChecked">Do you want to attach activity task?</label>
                                <div>
                                    <div className="form-check form-switch form-switch-md m-0 me-2">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            id="nextFlexSwitchCheckChecked"
                                            name="next_attach_activity"
                                            checked={sheetDetail?.next_revision?.enable_task_attach} 
                                            onChange={() => onNextTaskAttachmentInputChange(sheetDetail?.next_revision?.enable_task_attach)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="next_revised_by">
                                Worked By / Revision By
                            </label>
                            <Select
                                id="next_revised_by"
                                classNamePrefix="next-owner-select"
                                placeholder={"Select A Staff...."}
                                closeMenuOnSelect={true}
                                value={nextRevisedByValue(settings?.staffs, sheetDetail?.next_revision?.revised_by)}
                                options={nextRevisedByOptions(settings?.staffs)}
                                onChange={(value) => handleNextRevisedByChange(value)}
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
                                    name="next_visible_to"
                                    id="nextFormRadios1"
                                    value="new"
                                    checked={sheetDetail?.next_revision?.fetch_as === 'new'}
                                    onChange={nextTaskFetchAsChange}
                                />
                                <label className="form-check-label" htmlFor="nextFormRadios1">
                                    New Task
                                </label>
                            </span>
                        </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(NextRevision);