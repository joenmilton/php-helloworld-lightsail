import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Result from './Result';
import Owner from './Owner';
import Clone from './Clone';

function ActionModule({ actionLoading}) {
    return (
        <>
            <div className="d-flex flex-wrap align-items-start align-items-center justify-content-md-end mt-2 mt-md-0 gap-2 mb-4">
                {
                    (actionLoading) ? <div className="me-4"><div className="spinner-border text-secondary size-4 me-1"></div></div> : <></>
                }
                <Result />
                <Clone />
                <Owner />
                <div className="dropdown">
                    <a className="btn btn-link text-reset dropdown-toggle shadow-none" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="uil uil-ellipsis-h"></i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item px-3" href="#"><i className="uil-trash me-1"></i>Delete</a>
                    </div>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = (state) => ({
    actionLoading: state.deal.actionLoading
});

const mapDispatchToProps = {
};
  
export default connect(mapStateToProps, mapDispatchToProps)(ActionModule);