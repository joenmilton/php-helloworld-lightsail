import React, { useEffect } from 'react';
import { connect } from 'react-redux';

const Notes = ({ type }) => {
    return (
        <div className="card-body pt-2">
            <div className="d-flex mt-3">
                <div className="overflow-hidden me-auto">
                    <h5 className="font-size-15 text-truncate logo-txt sub-text mb-1">
                        Manage Notes
                    </h5>
                    <p className="text-muted text-truncate mb-0">You can create notes for you and your team and keep track of important info here.</p>
                </div>
                <div className="align-self-end ms-2">
                    <button type="button" className="btn btn-purple"><i className="mdi mdi-plus me-1"></i> Add Notes</button>
                </div>
            </div>
            <div className="search-box mt-4">
                <div className="position-relative">
                    <input type="text" className="form-control rounded bg-light border-2" placeholder="Search..." />
                    <i className="bx bx-search search-icon"></i>
                </div>
            </div>
        </div>
    )
}
const mapStateToProps = (state) => ({

});

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(Notes);