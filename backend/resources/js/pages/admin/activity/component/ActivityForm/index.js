import React, {useState} from 'react';
import { connect } from 'react-redux';
import { formatDate } from '../../../../../utils';
import { 
    updateActivityDetail
} from '../../../../../redux';

import Select from 'react-select';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";

function ActivityForm({ 
    errors,
    settings, activityUpdateDetail,
    updateActivityDetail
}) {

    const duedateValue = (date) => {
        if(!date) { return '' }
        return new Date(date).toISOString()
    }

    const formatTime = (date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };
    
    const activityFormChange = (e) => {
        let updatedRecord = {};
        switch (e.target.name) {
            case 'title': {
                updatedRecord = {
                    ...activityUpdateDetail,
                    title: e.target.value,
                };
                updateActivityDetail(updatedRecord);
                break;
            }
            case 'reminder_minutes': {
                updatedRecord = {
                    ...activityUpdateDetail,
                    reminder_minutes: e.target.value,
                };
                updateActivityDetail(updatedRecord);
                break;
            }
            case 'reminder_type': {
                updatedRecord = {
                    ...activityUpdateDetail,
                    reminder_type: e.target.value,
                };
                updateActivityDetail(updatedRecord);
                break;
            }
            case 'description': {
                updatedRecord = {
                    ...activityUpdateDetail,
                    description: e.target.value,
                };
                updateActivityDetail(updatedRecord);
                break;
            }
            default:
                break;
        }
    };

    const changeActivityTime = (value, type = 'start_time') => {
        const updatedRecord = {
            ...activityUpdateDetail,
            [type]: value,
        };
        updateActivityDetail(updatedRecord);
    }

    const changeActivityDate = (date, type='due_date') => {
        const updatedRecord = {
            ...activityUpdateDetail,
            [type]: new Date(date).toISOString()
        };
        updateActivityDetail(updatedRecord);
    }

    const updateReminder = (minute) => {
        const updatedRecord = {
            ...activityUpdateDetail,
            reminder_minutes: minute,
        };
        updateActivityDetail(updatedRecord);
    }


    const assignedUserOption = (users, ownerId) => {
        if(!users || users.length <= 0) {
            return null;
        }

        const formatedList = users.map(user => {
            return {
                label: user.name,
                value: user.id,
            }
        })

        return formatedList.filter(user => {
            return ownerId !== user.value
        })
    }

    const handleAssignedUserChange = (data, users) => {

        const dataValues = data.map(item => item.value);
        const selectedUsers = users.filter(user => dataValues.includes(user.id));
        
        const updatedRecord = {
            ...activityUpdateDetail,
            users: selectedUsers,
        };
        updateActivityDetail(updatedRecord);
    }

    const assignedUserValue = (users, ownerId) => {
        if(!users || users.length <= 0) {
            return []
        }

        const formatedList = users.map(user => {
            return {
                label: user.name,
                value: user.id,
            }
        })

        return formatedList.filter(user => {
            return ownerId !== user.value
        })
    }

    return (
        <>
            <div className="mb-3">
                <label className="form-label">
                    <span className="text-danger me-1">*</span>
                    <b>Title</b>
                </label>
                <input 
                    type="text" 
                    name="title" 
                    className="form-control bg-white shadow-sm ring-1 ring-neutral-300" 
                    value={activityUpdateDetail.title}
                    onChange={activityFormChange} 
                />
                {errors.title && (
                    <div className="d-block invalid-feedback">
                        {errors.title.join(', ')}
                    </div>
                )}
            </div>


            <div className="mb-3 d-grid grid-cols-12 gap-x-4">
                <div className="col-span-12 sm:col-span-6 position-relative">
                    <label className="form-label"><span className="text-danger me-1">*</span><b>Start Date</b></label>
                    <div className="d-flex align-items-center space-x-1">
                        <div className="position-relative flex-grow-1">
                            <Flatpickr
                                className="form-control bg-white shadow-sm ring-1 ring-neutral-300"
                                value={duedateValue(activityUpdateDetail.due_date)}
                                options={{
                                    enableTime: false,
                                    dateFormat: "d-M-Y",
                                    time_24hr: true,
                                    defaultHour: 0,
                                    disableMobile: "true"
                                }}
                                onChange={([date]) => {
                                    if (date) {
                                        changeActivityDate(date, 'due_date')
                                    }
                                }}
                            />
                        </div>
                        <div className="position-relative flex-grow-0">
                            <Flatpickr
                                className="form-control bg-white shadow-sm ring-1 ring-neutral-300 sm:max-w-[150px]"
                                value={activityUpdateDetail.start_time}
                                placeholder='HH:mm'
                                options={{
                                    enableTime: true,
                                    noCalendar: true,
                                    dateFormat: "H:i",
                                    time_24hr: true,
                                    defaultHour: 0,
                                    disableMobile: "true"
                                }}
                                onChange={([date]) => {
                                    if (date) {
                                        const formattedTime = formatTime(date);
                                        changeActivityTime(formattedTime, 'start_time')
                                    }
                                }}
                            />
                        </div>
                        <div className="position-absolute" style={{right:'-12px',fontSize:'20px'}}> - </div>
                    </div>
                </div>

                <div className="col-span-12 sm:col-span-6 position-relative">
                    <label className="form-label"><b>End Date</b></label>
                    <div className="d-flex align-items-center space-x-1">
                        <div className="position-relative flex-grow-0">
                            <Flatpickr
                                className="form-control bg-white shadow-sm ring-1 ring-neutral-300 sm:max-w-[150px]"
                                value={activityUpdateDetail.end_time}
                                placeholder='HH:mm'
                                options={{
                                    enableTime: true,
                                    noCalendar: true,
                                    dateFormat: "H:i",
                                    time_24hr: true,
                                    defaultHour: 0,
                                    disableMobile: "true"
                                }}
                                onChange={([date]) => {
                                    if (date) {
                                        const formattedTime = formatTime(date);
                                        changeActivityTime(formattedTime, 'end_time')
                                    }
                                }}
                            />
                        </div>
                        <div className="position-relative flex-grow-1">
                            <Flatpickr
                                className="form-control bg-white shadow-sm ring-1 ring-neutral-300"
                                value={duedateValue(activityUpdateDetail.end_date)}
                                options={{
                                    dateFormat: "d-M-Y",
                                    defaultDate: "",
                                    time_24hr: true,
                                    defaultHour: 0,
                                    disableMobile: "true"
                                }}
                                onChange={([date]) => {
                                    if (date) {
                                        changeActivityDate(date, 'end_date')
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>


            <div className="mb-3">
                <label className="form-label"><b>Reminder</b></label>
                <div className="d-flex align-items-center">
                    <div className="position-relative me-2">
                        <input 
                            type="number" 
                            name="reminder_minutes"
                            className={`ps-5 form-control bg-white shadow-sm ring-1 ring-neutral-300 ${activityUpdateDetail.reminder_minutes <= 0 ? 'input-disabled' : ''}`}
                            value={activityUpdateDetail.reminder_minutes}
                            onChange={activityFormChange}
                            disabled={activityUpdateDetail.reminder_minutes <= 0}
                        /> 
                        {activityUpdateDetail.reminder_minutes > 0 ? (
                            <button onClick={() => {updateReminder(0)}} className="btn btn-white notifiy-position btn-custom-color border-0 position-absolute px-2 py-1">
                                <i className="uil-times"></i>
                            </button>
                        ) : (
                            <button onClick={() => {updateReminder(30)}} className="btn notifiy-position btn-custom-color border-0 position-absolute px-2 py-1">
                                <i className="uil-bell"></i>
                            </button>
                        )}
                    </div>
                    <div className="d-flex align-items-center space-x-2">
                        <select
                            className={`form-control bg-white shadow-sm ring-1 ring-neutral-300 ${activityUpdateDetail.reminder_minutes <= 0 ? 'input-disabled' : ''}`}
                            name="reminder_type"
                            value={activityUpdateDetail.reminder_type}
                            onChange={activityFormChange}
                            disabled={activityUpdateDetail.reminder_minutes <= 0}
                        >
                            <option>minutes</option>
                            <option>hours</option>
                            <option>days</option>
                            <option>weeks</option>
                        </select>
                    </div>
                    <p className="text-muted m-0 ms-2">before start</p>
                </div>
            </div>


            <div className="mb-3">
                <label className="form-label">
                    <b>Assign To</b>
                </label>
                <Select
                    id="shared_with"
                    isMulti
                    classNamePrefix="shared_with-select"
                    placeholder={"Select User...."}
                    closeMenuOnSelect={true}
                    value={assignedUserValue(activityUpdateDetail.users, activityUpdateDetail?.owner_id) || []}
                    options={assignedUserOption(settings?.users, activityUpdateDetail?.owner_id)}
                    onChange={(values) => handleAssignedUserChange(values, settings?.users)}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">
                    <b>Description</b>
                </label>
                <textarea 
                    name="description"
                    onChange={activityFormChange}
                    value={activityUpdateDetail.description}
                    className="form-control bg-white shadow-sm ring-1 ring-neutral-300"
                />
            </div>

        </>
    );
}
const mapStateToProps = (state) => ({
    activityUpdateDetail: state.activity?.updateDetail,
    settings: state.activity.settings
});
const mapDispatchToProps = {
    updateActivityDetail
};
export default connect(mapStateToProps, mapDispatchToProps)(ActivityForm);