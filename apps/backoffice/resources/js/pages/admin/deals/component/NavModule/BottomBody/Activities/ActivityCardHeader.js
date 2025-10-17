
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { 
    setQuickUpdate
} from '../../../../../../../redux';
import { rgbToRgba } from '../../../../../../../utils';

const ActivityCardHeader = ({ activityItem, index, settings, setQuickUpdate }) => {

    const onActivityQuickUpdate = (data) => {
        setQuickUpdate(data)
    }

    return (
        <div className="card-header d-flex justify-content-between align-items-center">
            <div className="form-check position-relative mb-0">
                { (activityItem.activity_loader && activityItem.activity_loader === 'completed') ? <div className="spinner-border text-secondary size-4 position-left-top me-1"></div> : <></> }
                <input onChange={() => {}} onClick={() => onActivityQuickUpdate({activity_id: activityItem.id, data: activityItem.completed ? 0 : 100, type: 'completed'})} checked={activityItem.completed} className="green form-check-input" type="radio" id={`activityCheck-${index}`} />
                <label className="form-check-label" htmlFor={`activityCheck-${index}`}>
                    <strong className="text-truncate mb-0 user-select-none">
                        {
                            (activityItem.completed) ? (<s>{activityItem.title}</s>) : activityItem.title
                        }
                    </strong>
                </label>
            </div>
            <div>
                <div className="dropdown">
                    <a 
                        style={{
                            backgroundColor: rgbToRgba(activityItem.activity_type.color, 0.1) , 
                            color: activityItem?.activity_type?.color, 
                            border: `1px solid ${activityItem?.activity_type?.color}`
                        }} className="badge d-flex align-items-center font-size-12 p-1" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"
                    >
                        { (activityItem.activity_loader && activityItem.activity_loader === 'activity_type_id') ? <div className="spinner-border text-secondary size-4 me-1"></div> : <></> }
                        <i className={`${activityItem?.activity_type?.icon} me-1`}></i>
                        {activityItem?.activity_type?.name}
                        <i className="mdi mdi-chevron-down ms-2"></i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-end">
                    {
                        (settings?.activity_types && settings?.activity_types.length > 0) ? settings?.activity_types.map((type, index) => {
                            return (
                                <div onClick={() => onActivityQuickUpdate({activity_id: activityItem.id, data: type.id, type: 'activity_type_id'})} key={index} className="dropdown-item cursor-pointer px-3">
                                    <i className={`${type.icon} me-2`}></i>
                                    {type.name}
                                </div>
                            )
                        }) : <></>
                    }
                    </div>
                </div>
            </div>
        </div>
    )
}
const mapStateToProps = (state) => ({
    settings: state.activity.settings,
});

const mapDispatchToProps = {
    setQuickUpdate
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityCardHeader);