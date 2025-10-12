import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { SidebarContext } from '../../../../../../../../../components/Sidebar/contexts/SidebarContext';
import { formatDate, rgbToRgba, idNameText, idColor, mergeApiDateWithIso } from '../../../../../../../../../utils';
import { 
    addProcessRevision
} from '../../../../../../../../../redux';

const Submission = ({
    dealId, paper, process,
    statusList,
    addProcessRevision
}) => {
    const { toggleSidebar } = useContext(SidebarContext);

    const onPaperSubmissionEditButton = (dealId, revision) => {
        const updatedRevision = {
            ...revision,
            due_date: (revision?.due_date) ? mergeApiDateWithIso(revision?.due_date) : revision?.due_date,
            submission_date: (revision?.submission_date) ? mergeApiDateWithIso(revision?.submission_date) : revision?.submission_date
        }
        addProcessRevision(updatedRevision)
        toggleSidebar('process_revision', null, {dealId: dealId})
    }

    return (
        <>
            <li className={`checkout-item ${process.submission ? 'activated' : ''}`}>
                <div className="avatar checkout-icon">
                    <div className="avatar-title rounded-circle bg-primary">
                        <i className="bx bx-book-open jpt text-white font-size-20"></i>
                    </div>
                </div>
                <div className="feed-item-list">
                    <div>
                        <div className="d-flex justify-content-between align-items-center border-bottom-0 mb-4 me-2">
                            <div className="overflow-hidden me-auto">
                                <h4 className="mb-1">Submission</h4>
                                <p className="text-muted text-truncate">You can check initial submission here</p>
                            </div>
                            <div className="ms-2">
                                
                            </div>
                        </div>

                        <div className="mb-3 me-4">
                            <div className="row">
                                {
                                    (process.submission) ? <div className="col-xl-6 col-md-12">
                                        <div className="card">
                                            <div className="card-body p-3">

                                                <div className="d-flex align-items-start">
                                                    <div className="flex-shrink-0 avatar rounded-circle me-2">
                                                        <div className="avatar-title rounded-circle bg-primary">
                                                            #S
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1 overflow-hidden">
                                                        <h5 className="font-size-15 mb-1 text-truncate"><span className="text-reset">{process?.submission?.staff ? process?.submission?.staff?.name : '-'}</span></h5>
                                                        <span className="badge badge-soft-danger font-size-12"><i className="mdi mdi-clock-outline font-size-14 me-1 align-middle"></i>{process?.submission?.duedate_text}</span>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        <div>
                                                            <button className="btn btn-light btn-sm" onClick={() => onPaperSubmissionEditButton(dealId, process?.submission)}>
                                                                <i className="uil uil-pen"></i>
                                                            </button>
                                                        </div>
                                                        {
                                                            (process?.current_revision_id === process?.submission?.id) ? <div className="lh-1">
                                                                <button className="btn btn-light-subtle btn-sm pt-1 py-0 lh-1"><i className="bx bxs-star text-warning"></i></button>
                                                            </div> : null
                                                        }
                                                    </div>
                                                </div>

                                                <div className="mt-2">
                                                    <p className="text-muted font-size-13 mb-2">Submission Date</p>
                                                    <h5 className="font-size-14 mb-0">{process?.submission?.submission_date ? formatDate(process?.submission?.submission_date, 'shortdate') : '-' }</h5>
                                                </div>
                                                <div className="mt-2">
                                                    <p className="text-muted font-size-13 mb-2">Status</p>
                                                    <div 
                                                        style={{
                                                            backgroundColor: rgbToRgba(idColor(statusList?.revision, process?.submission?.status), 0.1) , 
                                                            color: idColor(statusList?.revision, process?.submission?.status), 
                                                            border: `1px solid ${idColor(statusList?.revision, process?.submission?.status)}`
                                                        }} className="badge font-size-12" 
                                                        >
                                                        {idNameText(statusList?.revision, process?.submission?.status)}
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                (process?.submission?.activity) ? <div className="card-footer px-3 py-2 bg-transparent border-top d-flex align-items-center cursor-pointer" onClick={() => toggleSidebar('activities', process?.submission?.activity?.id)}>
                                                    <div className="flex-grow-1">
                                                        <h5 className="font-size-15 my-2 text-truncate"><span className="text-reset">{process?.submission?.activity?.title}</span></h5>
                                                    </div>
                                                    <div className="flex-shrink-0 ms-2">
                                                        <ul className="list-inline mb-0">
                                                            <li className="list-inline-item">
                                                                <span className="text-muted font-size-13"><i className="mdi mdi-comment-text-outline me-1"></i>{process?.submission?.activity?.comments_count}</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div> : null
                                            }
                                        </div>
                                    </div> : null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        </>
    )
}
const mapStateToProps = (state) => ({
    statusList: state.journal.settings?.status
});

const mapDispatchToProps = {
    addProcessRevision
};

export default connect(mapStateToProps, mapDispatchToProps)(Submission);