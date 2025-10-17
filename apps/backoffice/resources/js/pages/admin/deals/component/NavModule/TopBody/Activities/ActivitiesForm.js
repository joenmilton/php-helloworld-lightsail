import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
    changeActivityForm, 
    addActivity, saveActivity,
    updateDueDate, updateEndDate,
    updateStartTime, updateEndTime
} from '../../../../../../../redux';
import Select from 'react-select';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";

const ActivitiesForm = ({ 
    settingsInitialized, settings, activity, saveLoading,
    changeActivityForm, 
    addActivity, saveActivity,
    updateDueDate, updateEndDate,
    updateStartTime, updateEndTime
}) => {
    const [errors, setError]    = useState({});
    const { dealId }            = useParams();

    const changeDueDate = (date) => {
        updateDueDate(new Date(date).toISOString())
    }
    const changeEndDate = (date) => {
        updateEndDate(new Date(date).toISOString())
    }
    const changeStartTime = (time) => {
        updateStartTime(time)
    }
    const changeEndTime = (time) => {
        updateEndTime(time)
    }
    const updateReminder = (minute) => {
        let updatedRecord = {
            ...activity.detail,
            reminder_minutes: minute,
        };
        addActivity(updatedRecord);
    }
    const updateActivityType = (id) => {
        let updatedRecord = {
            ...activity.detail,
            activity_type_id: id,
        };
        addActivity(updatedRecord);
    }
    
    const activityFormChange = (e) => {
        let updatedRecord = {};
        switch (e.target.name) {
            case 'title': {
                updatedRecord = {
                    ...activity.detail,
                    title: e.target.value,
                };
                addActivity(updatedRecord);
                break;
            }
            case 'reminder_minutes': {
                updatedRecord = {
                    ...activity.detail,
                    reminder_minutes: e.target.value,
                };
                addActivity(updatedRecord);
                break;
            }
            case 'reminder_type': {
                updatedRecord = {
                    ...activity.detail,
                    reminder_type: e.target.value,
                };
                addActivity(updatedRecord);
                break;
            }
            case 'description': {
                updatedRecord = {
                    ...activity.detail,
                    description: e.target.value,
                };
                addActivity(updatedRecord);
                break;
            }
            case 'note': {
                updatedRecord = {
                    ...activity.detail,
                    note: e.target.value,
                };
                addActivity(updatedRecord);
                break;
            }
            case 'completed': {
                updatedRecord = {
                    ...activity.detail,
                    completed: e.target.checked,
                };
                addActivity(updatedRecord);
                break;
            }
            
            default:
                break;
        }
    };


    const updateActivityForm = async () => {
        const updatedActivity = {
            ...activity.detail,
            module: 'deal',
            module_id: dealId
        }

        const response = await saveActivity(updatedActivity);

        if(response.httpCode == 422) {
            setError(response.errors)
        }

        if(response.httpCode === 200) {
            changeActivityForm(false)
        }
    }


    const formatTime = (date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };


    const changeToSearch = () => {
        changeActivityForm(false)
    }

    const assignedUserOption = (users) => {
        if(!users || users.length <= 0) {
            return null;
        }

        return users.map(user => {
            return {
                label: user.name,
                value: user.id,
            }
        })
    }

    const handleAssignedUserChange = (data, users) => {

        const dataValues = data.map(item => item.value);
        const selectedUsers = users.filter(user => dataValues.includes(user.id));
        
        const updatedRecord = {
            ...activity.detail,
            users: selectedUsers,
        };
        addActivity(updatedRecord);
    }

    const assignedUserValue = (users) => {
        if(!users || users.length <= 0) {
            return []
        }

        return users.map(user => {
            return {
                label: user.name,
                value: user.id,
            }
        })
    }
    
    return (
        <>
        {
            (!settingsInitialized) ? <div className="d-flex align-items-center justify-content-center">
                <div className="spinner-border text-primary m-1" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div> : 
            <>
                <div className="card-body pt-4">
                    <div className="mb-3">
                        <label className="form-label">
                            <span className="text-danger me-1">*</span>
                            <b>Title</b>
                        </label>
                        <input 
                            type="text" 
                            name="title" 
                            className="form-control bg-white shadow-sm ring-1 ring-neutral-300" 
                            value={activity.detail.title}
                            onChange={activityFormChange} 
                        />
                        {errors.title && (
                            <div className="d-block invalid-feedback">
                                {errors.title.join(', ')}
                            </div>
                        )}
                    </div>
                    <div className="mb-3">
                        {
                            (settings?.activity_types && settings?.activity_types.length > 0) ? settings?.activity_types.map((type, index) => {
                                return (
                                    <button key={index} onClick={() => updateActivityType(type.id)} type="button" className={`btn btn-outline-secondary border border-2 px-2 py-1 me-2 ${(activity.detail.activity_type_id === type.id) ? 'active' : ''}`}>
                                        <i className={`fs-5 ${type.icon}`}></i> {type?.name}
                                    </button>
                                )
                            }) : <></>
                        }
                        {errors.activity_type_id && (
                            <div className="d-block invalid-feedback">
                                {errors.activity_type_id.join(', ')}
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
                                        value={activity.detail.due_date}
                                        options={{
                                            enableTime: false,
                                            dateFormat: "d-M-Y",
                                            time_24hr: true,
                                            defaultHour: 0,
                                            disableMobile: "true"
                                        }}
                                        onChange={([date]) => {
                                            if (date) {
                                                changeDueDate(date)
                                            }
                                        }}
                                    />
                                </div>
                                <div className="position-relative flex-grow-0">
                                    <Flatpickr
                                        className="form-control bg-white shadow-sm ring-1 ring-neutral-300 sm:max-w-[150px]"
                                        value={activity.detail.start_time}
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
                                                changeStartTime(formattedTime)
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
                                        value={activity.detail.end_time}
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
                                                changeEndTime(formattedTime)
                                            }
                                        }}
                                    />
                                </div>
                                <div className="position-relative flex-grow-1">
                                    <Flatpickr
                                        className="form-control bg-white shadow-sm ring-1 ring-neutral-300"
                                        value={activity.detail.end_date}
                                        options={{
                                            dateFormat: "d-M-Y",
                                            defaultDate: "",
                                            time_24hr: true,
                                            defaultHour: 0,
                                            disableMobile: "true"
                                        }}
                                        onChange={([date]) => {
                                            if (date) {
                                                changeEndDate(date)
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
                                    className={`ps-5 form-control bg-white shadow-sm ring-1 ring-neutral-300 ${activity.detail.reminder_minutes <= 0 ? 'input-disabled' : ''}`}
                                    value={activity.detail.reminder_minutes}
                                    onChange={activityFormChange}
                                    disabled={activity.detail.reminder_minutes <= 0}
                                /> 
                                {activity.detail.reminder_minutes > 0 ? (
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
                                    className={`form-control bg-white shadow-sm ring-1 ring-neutral-300 ${activity.detail.reminder_minutes <= 0 ? 'input-disabled' : ''}`}
                                    name="reminder_type"
                                    value={activity.detail.reminder_type}
                                    onChange={activityFormChange}
                                    disabled={activity.detail.reminder_minutes <= 0}
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
                            value={assignedUserValue(activity.detail.users) || []}
                            options={assignedUserOption(settings?.users)}
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
                            value={activity.detail.description}
                            className="form-control bg-white shadow-sm ring-1 ring-neutral-300"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">
                            <b>Note</b>
                        </label>
                        <textarea 
                            name="note"
                            onChange={activityFormChange}
                            value={activity.detail.note}
                            className="form-control bg-white shadow-sm ring-1 ring-neutral-300"
                        />
                    </div>
                </div>

                <div className="card-footer">
                    <div className="d-flex align-items-center justify-content-end">
                        <div className="form-check form-switch form-switch-md me-2">
                            <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Mark as completed</label>
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="flexSwitchCheckChecked"
                                name="completed"
                                checked={activity.detail.completed}
                                onChange={activityFormChange}
                            />
                        </div>
                        <button className="btn btn-white me-2" onClick={changeToSearch}>Cancel</button>

                        <button type="button" disabled={saveLoading} className="btn btn-purple" onClick={updateActivityForm}>
                            {saveLoading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </>
        }

        </>
    )
}
const mapStateToProps = (state) => ({
    settingsInitialized: state.activity.settingsInitialized,
    saveLoading: state.activity.saveLoading,
    activity: state.activity,
    settings: state.activity.settings
});

const mapDispatchToProps = {
    addActivity,
    saveActivity,
    changeActivityForm,
    updateDueDate,
    updateEndDate,
    updateStartTime,
    updateEndTime,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivitiesForm);