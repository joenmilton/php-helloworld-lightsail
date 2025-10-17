import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { 
    setQuickUpdate
} from '../../../../../../../redux';
import { formatDate } from '../../../../../../../utils';

const ActivityCardBody = ({ activityItem, index, settings, setQuickUpdate }) => {

    const onActivityQuickUpdate = (data) => {
        setQuickUpdate(data)
    }

    return (
        <div className="card-body">
            {
                (activityItem.description) ? 
                <div className="mb-4">
                    <div className="d-flex justify-content-start align-items-center">
                        <div className="size-5 mr-3">
                            <i className="uil-align-left fs-5"></i>
                        </div>
                        <div><h6 className="ff-primary mb-0">Description</h6></div>
                    </div>
                    <div className="ml-8">{activityItem.description}</div>
                </div> : <></>
            }
            <div className="d-flex justify-content-start align-items-center ml-8">
                <div className="btn-group dropdown">
                    <h6 className="ff-primary d-flex align-items-center mb-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        {
                            (activityItem.activity_loader && activityItem.activity_loader === 'owner_id') ? <div className="me-4"><div className="spinner-border text-secondary size-4 position-left-top me-1"></div></div> : <></>
                        }
                        <div className="">{activityItem?.owner?.name} <i className="mdi mdi-chevron-down fs-5"></i></div>
                    </h6>
                    <div className="dropdown-menu">
                        {    
                            (settings?.admins && settings?.admins.length > 0) ? settings?.admins.map((user, index) => {
                                return (
                                    <div onClick={() => onActivityQuickUpdate({activity_id: activityItem.id, data: user.id, type: 'owner_id'})} key={index} className="dropdown-item cursor-pointer px-3">
                                        {user.name}
                                    </div>
                                )
                            }) : <></>
                        }
                    </div>
                </div>
                <div className="ms-2">
                    <i className="uil-calendar-alt me-1"></i> <span>{formatDate(activityItem.start_time)} - {formatDate(activityItem.end_time)}</span>
                </div>
            </div>
            {
                (activityItem.reminder_minutes > 0) ? <div className="text-muted">
                    <div className="d-flex justify-content-start align-items-center">
                        <div className="size-5 mr-3">
                            <i className="uil-bell fs-5"></i>
                        </div>
                        <div>Reminder set for {activityItem.reminder_minutes} {activityItem.reminder_type} before</div>
                    </div>
                </div> : <></>
            }
        </div>
    )
}
const mapStateToProps = (state) => ({
    settings: state.common.settings,
});

const mapDispatchToProps = {
    setQuickUpdate
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityCardBody);