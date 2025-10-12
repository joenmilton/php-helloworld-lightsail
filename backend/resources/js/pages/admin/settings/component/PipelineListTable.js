import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

function PipelineListTable({deal}) {

    const [pipelineList, setPipelineList] = useState([]);

    useEffect(() => {
        if (deal.listPipeline && deal.listPipeline.length > 0) {
            setPipelineList(deal.listPipeline);
        }
    }, [deal]);

    return (
        <table className="table mb-0">
            <thead className="table-light">
                <tr>
                    <th className="fw-medium color-light">#</th>
                    <th className="fw-medium color-light">Pipeline</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
            {pipelineList.map((pipeline, index) => (
                <tr key={index}>
                    <th className="" scope="row">{index + 1}</th>
                    <td>
                        <ul className="nav nav-pills">
                            <li className="nav-item">
                                <Link to={`/admin/settings/deals/pipeline/${pipeline?.id}/edit`} className="nav-item ff-primary text-primary me-3">
                                    {pipeline?.name}
                                </Link>
                                <Link to={`/admin/pipeline/${pipeline?.id}/board`} className="nav-item ff-primary text-secondary">
                                    <i className="uil-apps"></i>
                                </Link>
                            </li>
                        </ul>
                    </td>
                    <td>
                        <div className="dropdown mb-0 d-flex justify-content-end">
                            <a className="btn btn-link text-muted p-1 mt-n2 dropdown-toggle-split dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-haspopup="true">
                                <i className="mdi mdi-dots-vertical font-size-20"></i>
                            </a>
                        
                            <div className="dropdown-menu dropdown-menu-end">
                                <Link to={`/admin/settings/deals/pipeline/${pipeline.id}/edit`} className="dropdown-item">
                                    <i className="fa fa-edit me-2"></i>
                                    Edit
                                </Link>
                                <a className="dropdown-item" href="#"><i className="fa fa-trash me-2"></i>Delete</a>
                            </div>
                        </div>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}

const mapStateToProps = (state) => ({
    deal: state.settings.deal
});

const mapDispatchToProps = {

};
  
export default connect(mapStateToProps, mapDispatchToProps)(PipelineListTable);