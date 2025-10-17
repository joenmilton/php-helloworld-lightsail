import React from 'react';
import { connect } from 'react-redux';
import { formatDate } from '../../../../../utils';

function ActivityPreview({ 
    activity
}) {
    return (
        <>
            <div className="mb-2">
                <h2 className="sub-head mb-0">{activity.title}</h2>
            </div>
            {
                (activity.description) ? 
                <div className="mb-4">
                    <div className="d-flex justify-content-start align-items-center">
                        <div className="size-5 mr-3">
                            <i className="uil-align-left fs-5"></i>
                        </div>
                        <div><h6 className="ff-primary mb-0">Description</h6></div>
                    </div>
                    <div className="ml-8">{activity.description}</div>
                </div> : null
            }
            <div className="mb-4">
                <div className="d-flex justify-content-start align-items-center ml-8">
                    <h6 className="ff-primary d-flex align-items-center mb-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        {
                            (activity.activity_loader && activity.activity_loader === 'owner_id') ? <div className="me-4"><div className="spinner-border text-secondary size-4 position-left-top me-1"></div></div> : <></>
                        }
                        <div className="">{activity?.owner?.name}</div>
                    </h6>
                    <div className="ms-2">
                        <i className="uil-calendar-alt me-1"></i> <span>{formatDate(activity.start_time, 'datetime')} - {formatDate(activity.end_time, 'datetime')}</span>
                    </div>
                </div>
                {
                    (activity.reminder_minutes > 0) ? <div className="text-muted">
                        <div className="d-flex justify-content-start align-items-center">
                            <div className="size-5 mr-3">
                                <i className="uil-bell fs-5"></i>
                            </div>
                            <div>Reminder set for {activity.reminder_minutes} {activity.reminder_type} before</div>
                        </div>
                    </div> : <></>
                }
            </div>
        </>
    );
}
const mapStateToProps = (state) => ({
});
const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(ActivityPreview);