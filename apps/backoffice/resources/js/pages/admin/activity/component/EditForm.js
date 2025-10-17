import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { mergeApiDateWithIso } from '../../../../utils';
import { 
    loadActivitySettings, 
    fetchActivity, 
    setDetailQuickUpdate, 
    fetchActivityList,
    updateActivityDetail,
    saveActivity
} from '../../../../redux';
import ActivityAttachment from './FormElements/ActivityAttachment';
import ActivityComment from './FormElements/ActivityComment';
import ActivityPreview from './ActivityPreview';
import ActivityEditForm from './ActivityForm';

const ActivityForm = ({ 
    id, formType, onClose, 
    settingsInitialized, activityLoading, activityData, activity, activeCondition, activityUpdateDetail, saveLoading,
    loadActivitySettings, fetchActivity, setDetailQuickUpdate, fetchActivityList, updateActivityDetail, saveActivity
}) => {
    const [errors, setError] = useState({});

    useEffect(async() => {
        if(!settingsInitialized) {
            await loadActivitySettings();
        }

        if(settingsInitialized) {
            await fetchActivity(id);
        }

    }, [id, settingsInitialized])

    const onActivityQuickUpdate = async (data) => {
        await setDetailQuickUpdate(data)

        const queryFilter = {
            q: activityData?.searchQuery,
            sortOrder: activityData?.sortOrder,
            page: 1,
            per_page: activityData?.list?.per_page,
        }

        await fetchActivityList(queryFilter, activeCondition);
    }

    const onCancelActivityUpdate = (action = 'cancel') => {
        const updatedDetail = {
            flag: false,
            id: '',
            title: '',
            activity_type_id: '',
            due_date: new Date().toISOString(),
            end_date: new Date().toISOString(),
            start_time: '05:00',
            end_time: '23:59',
            reminder_minutes: 30,
            reminder_type: 'minutes',
            description: '',
            note: '',
            completed: false,
            users: []
        }
        updateActivityDetail(updatedDetail)

        if(action === 'close') {
            onClose();
        }
    }

    const formatTime = (dateString) => {
        const date = new Date(dateString.replace(' ', 'T')); // Replace space with 'T' for ISO format
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const onUpdateActivity = (flag) => {
        const updatedDetail = {
            ...activity,
            due_date: (activity.start_time) ? mergeApiDateWithIso(activity.start_time) : activity.start_time,
            end_date: (activity.end_time) ? mergeApiDateWithIso(activity.end_time) : activity.end_time,
            start_time: (activity.start_time) ? formatTime(activity.start_time): '',
            end_time: (activity.end_time) ? formatTime(activity.end_time) : '',
            flag: flag
        }
        updateActivityDetail(updatedDetail)
    }

    const handleSave = async(e) => {
        const activityData = {
            id: activityUpdateDetail?.id,
            title: activityUpdateDetail?.title,
            activity_type_id: activityUpdateDetail?.activity_type_id,
            due_date: activityUpdateDetail?.due_date,
            end_date: activityUpdateDetail?.end_date,
            start_time: activityUpdateDetail?.start_time,
            end_time: activityUpdateDetail?.end_time,
            reminder_minutes: activityUpdateDetail?.reminder_minutes,
            reminder_type: activityUpdateDetail?.reminder_type,
            description: activityUpdateDetail?.description,
            note: activityUpdateDetail?.note,
            users: activityUpdateDetail?.users
        }

        const response = await saveActivity(activityData);
        if(response.httpCode == 422) {
            setError(response.errors)
        }

        if(response.httpCode === 200) {
            onCancelActivityUpdate('cancel');
        }

    }

    return (
        <>
            <div className="rightbar-title d-flex align-items-center pe-3">
                <a href="" onClick={(event) => { event.preventDefault(); onCancelActivityUpdate('close') }} className="right-bar-toggle-close ms-auto">
                    <i className="mdi mdi-close noti-icon"></i>
                </a>
            </div>
            <div className="d-flex flex-column h-full w-screen">
                <div className="d-flex flex-column flex-equal overflow-x-hidden overflow-y-scroll py-4">
                    <div className="row px-4 mt-4">
                        {
                            (!settingsInitialized || activityLoading) ? <div className="d-flex align-items-center justify-content-center">
                                <div className="spinner-border text-primary m-1" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div> : 
                            <>
                                {
                                    (activityUpdateDetail?.flag) ? <ActivityEditForm errors={errors}/> : 
                                    <>
                                        <div className="progress progress-xl animated-progess mb-2">
                                            <div className="progress-bar bg-success" role="progressbar" style={{width: activity?.activity_percentage+'%'}} aria-valuenow={activity?.activity_percentage} aria-valuemin="0" aria-valuemax="100">{activity?.activity_percentage+'%'}</div>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <div className="me-3">

                                            </div>
                                            <div>
                                                <button className="btn btn-white px-2 py-1 me-2" style={{lineHeight: '25px'}} onClick={() =>onUpdateActivity(!activityUpdateDetail?.flag)}>
                                                    <i className="uil-edit-alt me-1"></i>
                                                    Edit
                                                </button>
                                                {
                                                    (activity.completed && activity.is_owner) ? <button disabled={(activity.activity_loader && activity.activity_loader === 'completed')} onClick={() => onActivityQuickUpdate({activity_id: activity.id, data: 0, type: 'completed'})} className="btn btn-white position-relative px-4 py-1 me-2" style={{lineHeight: '25px'}}>
                                                        { (activity.activity_loader && activity.activity_loader === 'completed') ? <div className="spinner-border text-secondary size-4 position-left-top my-1 ms-1 me-1"></div> : null }
                                                        Reopen
                                                    </button> : null
                                                }
                                                {
                                                    (activity.completed) ? <div className="badge bg-success font-size-12 cursor-pointer">Completed</div> : 
                                                    <>
                                                        <div className="btn-group" role="group">
                                                            <button disabled={(activity.activity_loader && activity.activity_loader === 'completed')} id="btnGroupVerticalDrop1" type="button" className="btn btn-purple position-relative px-4 py-1 me-2 dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{lineHeight: '25px'}}>
                                                                { (activity.activity_loader && activity.activity_loader === 'completed') ? <div className="spinner-border text-secondary size-4 position-left-top my-1 ms-1 me-1"></div> : null }
                                                                In-progress {(activity?.activity_percentage > 0 && activity?.activity_percentage < 100) ? activity?.activity_percentage+'%' : ''} <i className="mdi mdi-chevron-down"></i>
                                                            </button>
                                                            <div className="dropdown-menu" aria-labelledby="btnGroupVerticalDrop1">
                                                                <div className="dropdown-item cursor-pointer" onClick={() => onActivityQuickUpdate({activity_id: activity.id, data: 0, type: 'completed'})}>0 Percentage</div>
                                                                <div className="dropdown-item cursor-pointer" onClick={() => onActivityQuickUpdate({activity_id: activity.id, data: 10, type: 'completed'})}>10 Percentage</div>
                                                                <div className="dropdown-item cursor-pointer" onClick={() => onActivityQuickUpdate({activity_id: activity.id, data: 20, type: 'completed'})}>20 Percentage</div>
                                                                <div className="dropdown-item cursor-pointer" onClick={() => onActivityQuickUpdate({activity_id: activity.id, data: 30, type: 'completed'})}>30 Percentage</div>
                                                                <div className="dropdown-item cursor-pointer" onClick={() => onActivityQuickUpdate({activity_id: activity.id, data: 40, type: 'completed'})}>40 Percentage</div>
                                                                <div className="dropdown-item cursor-pointer" onClick={() => onActivityQuickUpdate({activity_id: activity.id, data: 50, type: 'completed'})}>50 Percentage</div>
                                                                <div className="dropdown-item cursor-pointer" onClick={() => onActivityQuickUpdate({activity_id: activity.id, data: 60, type: 'completed'})}>60 Percentage</div>
                                                                <div className="dropdown-item cursor-pointer" onClick={() => onActivityQuickUpdate({activity_id: activity.id, data: 70, type: 'completed'})}>70 Percentage</div>
                                                                <div className="dropdown-item cursor-pointer" onClick={() => onActivityQuickUpdate({activity_id: activity.id, data: 80, type: 'completed'})}>80 Percentage</div>
                                                                <div className="dropdown-item cursor-pointer" onClick={() => onActivityQuickUpdate({activity_id: activity.id, data: 90, type: 'completed'})}>90 Percentage</div>
                                                                <div className="dropdown-item cursor-pointer" onClick={() => onActivityQuickUpdate({activity_id: activity.id, data: 100, type: 'completed'})}>Completed</div>
                                                            </div>
                                                        </div>
                                                    </>
                                                }
                                            </div>
                                        </div>
                                        <ActivityPreview activity={activity}/>
                                        <ActivityAttachment />
                                        <ActivityComment />
                                    </>
                                }
                            </>
                        }
                    </div>
                </div>
                {
                    (activityUpdateDetail?.flag) ? <div>
                        <div className="px-4 py-2 sidebar-footer border-top-custom">
                            <div className="d-flex align-items-start"> 
                                <button type="button" className="btn w-sm ms-auto me-2" onClick={() => onCancelActivityUpdate('cancel')}>Cancel</button>
                                <button type="button" disabled={saveLoading} className="btn btn-purple w-sm" onClick={handleSave}>
                                    {(saveLoading) ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div> : null
                }
            </div>
        </>
    );
};
const mapStateToProps = (state) => ({
    settingsInitialized: state.activity.settingsInitialized,
    activityLoading: state.activity?.activityLoading,
    activityData: state.activity,
    activity: state.activity?.detail,
    activeCondition: state.activity.activeCondition,
    activityUpdateDetail: state.activity?.updateDetail,
    saveLoading: state.journal.saveLoading
});
const mapDispatchToProps = {
    loadActivitySettings,
    fetchActivity,
    setDetailQuickUpdate,
    fetchActivityList,
    updateActivityDetail,
    saveActivity
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityForm);