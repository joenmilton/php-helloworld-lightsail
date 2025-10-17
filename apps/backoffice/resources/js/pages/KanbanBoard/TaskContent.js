import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils';
import { useHasPermission } from '../../utils/permissions';

const TaskContent = ({ permissions, task }) => {

    return (
        <div className="card task-box">
            <div className="card-body p-0">
                <div className="task-box-border">
                    <div className="deal-border-color"></div>
                    <div className="d-flex justify-content-between align-items-center p-3 py-2">
                        <div>
                            <h5 className="font-size-15 mb-1">{task?.name}</h5>
                            {
                                (useHasPermission(['view deal payment'], permissions)) ? <div><i className="fas fa-rupee-sign me-1"></i>{task?.amount}</div> : null
                            }
                        </div>
                        <div>
                            <div className="d-flex flex-column">
                                {
                                    (task?.is_loading) ? <div className="spinner-border spinner-24  text-secondary m-1" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div> : <Link to={`/admin/deals/${task?.id}/edit`} className="btn btn-link text-muted p-1 mt-n2 dropdown-toggle-split dropdown-toggle"><i className="uil-external-link-alt font-size-18"></i></Link>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-footer p-3 py-1 bg-transparent border-top d-flex align-items-center">
                <div className="flex-grow-1">
                    {
                        (task?.contact) ? <div className="avatar-group dropdown">
                            <div className="avatar-group-item" role="button" data-bs-toggle="dropdown" aria-haspopup="true">
                                <div className="d-block">
                                    <div className="avatar-sm">
                                        <div className="avatar-title rounded-circle bg-primary">
                                            {
                                                (task?.contact?.name).charAt(0) || '-'
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="dropdown-menu dropdown-menu-end p-2">
                            {
                                (useHasPermission(['view deal client'], permissions)) ? <div className="text-muted">
                                    <h5 className="font-size-15 mb-2">{task?.contact?.name}</h5>
                                    <p className="mb-1">{task?.contact?.email}</p>
                                    <p className="mb-1">{task?.contact?.mobile}</p>
                                </div> : null
                            }
                            </div>
                        </div> : null
                    }
                    
                </div>
                <div className="flex-shrink-0 ms-2">
                    <ul className="list-inline mb-0">
                        <li className="list-inline-item">
                            <div className="text-muted font-size-13"><i className="uil-calendar-alt me-1"></i>{formatDate(task?.expected_close_date, 'date')}</div>
                        </li>
                        <li className="list-inline-item">
                            <div className="btn btn-link text-muted p-0">
                                <i className="uil-server-alt"></i>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state, ownProps) => {
    // Assuming you have a tasks slice in your Redux state
    const task = state?.kanban?.board?.tasks[ownProps.taskId] ?? null;
    return {
        permissions: state.common?.settings?.permissions,
        task: task
    };
};

export default connect(mapStateToProps)(TaskContent);