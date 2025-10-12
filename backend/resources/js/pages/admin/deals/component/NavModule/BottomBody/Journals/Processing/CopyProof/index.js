import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { SidebarContext } from '../../../../../../../../../components/Sidebar/contexts/SidebarContext';
import { formatDate, rgbToRgba, idNameText, idColor, mergeApiDateWithIso } from '../../../../../../../../../utils';
import { 
    addProcessProof
} from '../../../../../../../../../redux';

const CopyProof = ({
    dealId, paper, process,
    statusList,
    addProcessProof
}) => {
    const { toggleSidebar } = useContext(SidebarContext);


    const onPaperProofCreateButton = (dealId, processId) => {
        const proofDetail = {
            id: '',
            processing_id: processId,
            accepted_date: '',
            proof_status: '',
            copyright_status: ''
        }
        addProcessProof(proofDetail)
        toggleSidebar('process_proof', null, {dealId: dealId, processId: processId})
    }

    const onPaperProofEditButton = (dealId, proof) => {
        const updatedProof = {
            ...proof,
            accepted_date: (proof?.accepted_date) ? mergeApiDateWithIso(proof?.accepted_date) : proof?.accepted_date,
        }
        console.log(proof)
        addProcessProof(updatedProof)
        toggleSidebar('process_proof', null, {dealId: dealId})
    }
    



    return (
        <>
            <li className="checkout-item">
                <div className="avatar checkout-icon">
                    <div className="avatar-title rounded-circle bg-primary">
                        <i className="bx bxs-award text-white font-size-20"></i>
                    </div>
                </div>
                <div className="feed-item-list">
                    <div>
                        <div className="d-flex justify-content-between align-items-center border-bottom-0 mb-4">
                            <div className="overflow-hidden me-auto">
                                <h4 className="mb-1">Copy & Proof</h4>
                                <p className="text-muted text-truncate">You can check Copy and Proof status here </p>
                            </div>
                            <div className="ms-2">
                                {
                                    (!process.proof) ? <button type="button" className="btn btn-purple" onClick={() => onPaperProofCreateButton(dealId, process?.id)}>
                                        <i className="mdi mdi-plus me-1"></i> Add New Copy & Proof
                                    </button> : null
                                }
                            </div>
                        </div>
                        
                        <div className="mb-3 me-4">
                            <div className="row">
                                {
                                    (process.proof) ? <div className="col-xl-6 col-md-12">
                                        <div className="card">
                                            <div className="card-body p-3">

                                                <div className="d-flex align-items-start">
                                                    <div className="flex-grow-1 overflow-hidden">
                                                        <h5 className="font-size-15 mb-1 text-truncate"><span className="text-reset">Copy & Proof</span></h5>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        <div>
                                                            <button className="btn btn-light btn-sm" onClick={() => onPaperProofEditButton(dealId, process?.proof)}>
                                                                <i className="uil uil-pen"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-2">
                                                    <p className="text-muted font-size-13 mb-2">Accepted Date</p>
                                                    <h5 className="font-size-14 mb-0">{process?.proof?.accepted_date ? formatDate(process?.proof?.accepted_date, 'shortdate') : '-' }</h5>
                                                </div>
                                                <div className="mt-2">
                                                    <p className="text-muted font-size-13 mb-2">Proof Status</p>
                                                    <div 
                                                        style={{
                                                            backgroundColor: rgbToRgba(idColor(statusList?.proof, process?.proof?.proof_status), 0.1) , 
                                                            color: idColor(statusList?.proof, process?.proof?.proof_status), 
                                                            border: `1px solid ${idColor(statusList?.proof, process?.proof?.proof_status)}`
                                                        }} className="badge font-size-12" 
                                                        >
                                                        {idNameText(statusList?.proof, process?.proof?.proof_status)}
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    <p className="text-muted font-size-13 mb-2">Copyright Status</p>
                                                    <div 
                                                        style={{
                                                            backgroundColor: rgbToRgba(idColor(statusList?.copyright, process?.proof?.copyright_status), 0.1) , 
                                                            color: idColor(statusList?.copyright, process?.proof?.copyright_status), 
                                                            border: `1px solid ${idColor(statusList?.copyright, process?.proof?.copyright_status)}`
                                                        }} className="badge font-size-12" 
                                                        >
                                                        {idNameText(statusList?.copyright, process?.proof?.copyright_status)}
                                                    </div>
                                                </div>

                                                <div className="mt-2">
                                                    <p className="text-muted font-size-13 mb-2">Final Status</p>
                                                    <div 
                                                        style={{
                                                            backgroundColor: rgbToRgba(idColor(statusList?.final, process?.proof?.final_status), 0.1) , 
                                                            color: idColor(statusList?.final, process?.proof?.final_status), 
                                                            border: `1px solid ${idColor(statusList?.final, process?.proof?.final_status)}`
                                                        }} className="badge font-size-12" 
                                                        >
                                                        {idNameText(statusList?.final, process?.proof?.final_status)}
                                                    </div>
                                                </div>
                                            </div>
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
    addProcessProof
};

export default connect(mapStateToProps, mapDispatchToProps)(CopyProof);