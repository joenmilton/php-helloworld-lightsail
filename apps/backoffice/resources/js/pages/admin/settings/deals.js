
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchPipelineList, addPipeline, clearPipeline } from '../../../redux';
import AdminSettingsNav from '../../../components/AdminSettingsNav';
import CreatePipelineModal from './component/CreatePipelineModal';
import PipelineListTable from './component/PipelineListTable';

function DealSettings({ deal, fetchPipelineList, addPipeline, clearPipeline }) {

    useEffect(() => {
        fetchPipelineList();
    }, [fetchPipelineList]);

    return (
        <>
            <div className="row g-2">
                <div className="col-lg-auto">
                    <div className="d-flex">
                        <div className="flex-grow-1">
                            <div className="sub-head">Pipelines</div>
                        </div>
                    </div>
                </div>
                <div className="col-auto ms-sm-auto">
                    <div className="justify-content-sm-end">   
                        <button type="button" className="btn btn-purple" data-bs-toggle="modal" data-bs-target=".bs-example-modal-center"><i className="mdi mdi-plus me-1"></i> Create</button>
                        <CreatePipelineModal
                            deal={deal}
                            addPipeline={addPipeline}
                            clearPipeline={clearPipeline}
                        />
                    </div>
                </div>
            </div>
            <div className="card mt-2">
                <div className="card-body p-0">
                    <PipelineListTable />
                </div>
            </div>
        </>
    )
}


const mapStateToProps = (state) => ({
    deal: state.settings.deal,
});

const mapDispatchToProps = {
    fetchPipelineList,
    addPipeline,
    clearPipeline,
};
  
export default connect(mapStateToProps, mapDispatchToProps)(DealSettings);