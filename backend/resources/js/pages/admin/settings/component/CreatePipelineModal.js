import React, { useEffect, useRef, useState } from 'react';
import { createPipeline } from '../../../../service/PipelineService';
import { useHistory } from 'react-router-dom';

const CreatePipelineModal = ({ deal, addPipeline, clearPipeline }) => {
    const createPipelineRef = useRef(null);
    const modalElementRef   = useRef(null);
    const history = useHistory();

    const [errors, setError]                       = useState({});
    useEffect(() => {
        clearPipeline();
        
        const handleModalClose = () => {
            clearPipeline();
            setError({})
        };

        const modalElement = createPipelineRef.current;
        modalElement.addEventListener('hidden.bs.modal', handleModalClose);
        modalElementRef.current = modalElement;

        return () => {
            modalElement.removeEventListener('hidden.bs.modal', handleModalClose);
        };
    }, [clearPipeline]);

    const pipelineChange = (e) => {
        e.preventDefault();
        let updatedRecord = {};

        switch (e.target.name) {
            case 'name': {
                updatedRecord = {
                    ...deal.pipeline,
                    name: e.target.value,
                };
                addPipeline(updatedRecord);
                break;
            }
            default:
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError({})

        const response = await createPipeline(deal.pipeline)
        if(response.httpCode == 422) {
            setError(response.errors)
        }
        if(response.httpCode == 200) {
            const cancelButton = modalElementRef.current.querySelector('[data-bs-dismiss="modal"]');
            cancelButton.click();
            clearPipeline();

            history.push(`/admin/settings/deals/pipeline/${response.data.id}/edit`);
        }
    }
    
    return (
        <div ref={createPipelineRef} className="modal fade bs-example-modal-center" tabIndex="-1" aria-labelledby="mySmallModalLabel" aria-hidden="true" style={{ display: 'none' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-white">
                    <form id="create_pipeline" className="form-horizontal" onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">Create Pipeline</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label" htmlFor="pipeline_name">
                                    * Pipeline Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={deal?.pipeline?.name}
                                    onChange={pipelineChange}
                                    className="form-control"
                                    id="pipeline_name"
                                    placeholder=""
                                />
                                {errors.name && (
                                    <div className="d-block invalid-feedback">
                                        {errors.name.join(', ')}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn" data-bs-dismiss="modal">
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-purple">
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePipelineModal;