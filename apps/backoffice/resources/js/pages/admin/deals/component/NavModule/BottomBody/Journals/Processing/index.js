import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { formatDate, rgbToRgba, idNameText, idColor, mergeApiDateWithIso } from '../../../../../../../../utils';
import { 
    addJournalProcessing,
    updateProcessOpenFlag
} from '../../../../../../../../redux';
import { SidebarContext } from '../../../../../../../../components/Sidebar/contexts/SidebarContext';
import Submission from './Submission';
import Revision from './Revision';
import CopyProof from './CopyProof';

const Processing = ({
    dealId, paper,
    statusList,
    addJournalProcessing, updateProcessOpenFlag
}) => {
    const { toggleSidebar } = useContext(SidebarContext);

    const onPaperEntryEditButton = (dealId, process) => {
        const { submission, revisions, ...updatedProcessData } = process;

        let updatedProcess = {
            ...updatedProcessData,
            due_date: (process?.due_date) ? mergeApiDateWithIso(process?.due_date) : updatedProcessData?.due_date,
            submission_date: (process?.submission_date) ? mergeApiDateWithIso(process?.submission_date) : updatedProcessData?.submission_date
        };

        addJournalProcessing(updatedProcess)
        toggleSidebar('journal_processing', process?.id, {dealId: dealId})
    }

    const processingOpenClose = (process, flag) => {
        const updatedProcess = {
            ...process,
            is_open: flag,
        };
        updateProcessOpenFlag(updatedProcess)
    }

    return (
        <div className="row">
            <div className="table-responsive">
                <table className="table table-bordered mb-4">
                    <thead>
                        <tr>
                            <th className="text-center">#</th>
                            <th>Publisher</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            (paper?.processing && paper?.processing.length > 0) ? paper?.processing.map((process, processIndex) => {
                                return (
                                    <React.Fragment key={`rev-${processIndex}`}>
                                        <tr>
                                            <th className="text-center" scope="row">
                                                <div>{processIndex + 1}</div>
                                                <div className="font-size-24">
                                                    { (process?.is_open) ? <i className="bx bxs-up-arrow cursor-pointer" onClick={() => processingOpenClose(process, !process?.is_open)}></i> : <i className="bx bxs-down-arrow cursor-pointer" onClick={() => processingOpenClose(process, !process?.is_open)}></i> }
                                                </div>
                                            </th>
                                            <td>
                                                <div>
                                                    <p className="mb-1">Journal : <span className="fw-medium text-muted">{process?.journal?.journal_name}</span></p>
                                                    <p className="mb-1">Publisher : <span className="fw-medium text-muted">{process?.publisher?.name}</span></p>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <p className="mb-1">Submission : 
                                                        <span className="fw-medium text-muted">
                                                            {process?.submission_date ? formatDate(process?.submission_date, 'shortdate') : '-' }
                                                        </span>
                                                    </p>
                                                    <p className="mb-1">Revision : 
                                                        <span className="fw-medium text-muted">
                                                            {process?.due_date ? formatDate(process?.due_date, 'shortdate') : '-' }
                                                        </span>
                                                    </p>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <div 
                                                        style={{
                                                            backgroundColor: rgbToRgba(idColor(statusList?.process, process?.status), 0.1) , 
                                                            color: idColor(statusList?.process, process?.status), 
                                                            border: `1px solid ${idColor(statusList?.process, process?.status)}`
                                                        }} className="badge font-size-12" 
                                                        >
                                                        {idNameText(statusList?.process, process?.status)}
                                                    </div>
                                                    <button className="btn btn-light btn-sm ms-2" onClick={() => onPaperEntryEditButton(dealId, process)}>
                                                        <i className="uil uil-pen"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr key={`rev-${processIndex}`} style={{display: (process?.is_open) ? 'table-row' : 'none'}}>
                                            <td colSpan={6}>
                                                <ol className="activity-checkout mb-0 px-4 mt-3">

                                                    <Submission dealId={dealId} paper={paper} process={process}/>
                                                    <Revision dealId={dealId} paper={paper} process={process}/>
                                                    <CopyProof dealId={dealId} paper={paper} process={process} />

                                                </ol>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                )
                            }) : null
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
const mapStateToProps = (state) => ({
    statusList: state.journal.settings?.status
});

const mapDispatchToProps = {
    addJournalProcessing,
    updateProcessOpenFlag
};

export default connect(mapStateToProps, mapDispatchToProps)(Processing);