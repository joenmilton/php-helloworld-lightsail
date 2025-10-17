
import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { loadClonePipelineList, loadCloneUserList, cloneDeal } from '../../../../../../redux';
import Select from 'react-select';
import { useHasPermission } from '../../../../../../utils/permissions';

function Clone({ 
    permissions, clone, deal,
    loadClonePipelineList, loadCloneUserList, cloneDeal 
}) {
    const { dealId }                = useParams();
    const  dropdownMenuRef          = useRef(null);
    const [dealClone, setDealClone]   = useState({ pipeline: null, owner: null });

    const onOpenCloner = async(dealId) => {
        if (dropdownMenuRef.current) {
            if(!dropdownMenuRef.current.classList.contains('show')) {
                return ;
            }

            setDealClone({ pipeline: null, owner: null})
            await loadClonePipelineList(dealId)
        }
    }

    const handlePipelineChange = async (dealId, data) => {
        if(!data.value || data.value === '') {
            return ;
        }

        setDealClone({ ...dealClone, pipeline: data })
        await loadCloneUserList(dealId, data.value)
    }

    const handleCloneOwnerChange = async (dealId, data) => {
        if(!data.value || data.value === '') {
            return ;
        }

        setDealClone({ ...dealClone, owner: data })
    }

    const onDealClone = async (dealId) => {
        await cloneDeal(dealId, dealClone)

        dropdownMenuRef.current.classList.remove('show');
    }
    


    const pipelineOptions = (options) => {
        return options && options.length > 0 ? options.map(option => ({
            label: option.name,
            value: option.id,
            isDisabled: (option.exists === 1) ? true : false
        })) : [];
    }
    
    const cloneOwnerOptions = (options) => {
        return options && options.length > 0 ? options.map(option => ({
            label: option.name,
            value: option.id
        })) : [];
    }

    

    return (
        (useHasPermission(['attach deal associates'], permissions) && deal?.status === '2') ?
        <div className="dropdown">
            <div onClick={() => onOpenCloner(dealId)} className="btn btn-link text-reset dropdown-toggle shadow-none p-1 mx-4" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                <i className="uil-data-sharing fs-5"></i>
            </div>
            <div className="dropdown-menu dropdown-menu-end p-0" ref={dropdownMenuRef}>
                <div className="card mb-0" style={{width: '22rem'}}>
                    <div className="card-header justify-content-between d-flex align-items-center">
                        <h4 className="card-title">Associate Deal to Department</h4>
                    </div>
                    <div className="card-body">
                        {
                            (clone?.pipelineListLoading) ? <div className="d-flex align-items-center justify-content-center mb-3">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div> : 
                            <div className="mb-3">
                                <label className="form-label" htmlFor="pipeline">
                                    <span className="text-danger me-1">*</span>
                                    Department
                                </label>
                                <Select
                                    id="pipeline"
                                    classNamePrefix="pipeline-select"
                                    placeholder={"Select Pipeline...."}
                                    closeMenuOnSelect={true}
                                    value={dealClone.pipeline}
                                    options={pipelineOptions(clone?.pipelineList)}
                                    onChange={(values) => handlePipelineChange(dealId, values)}
                                />
                            </div>
                        }
                        {
                            (!clone?.pipelineListLoading) ? (clone?.userListLoading) ? <div className="d-flex align-items-center justify-content-center mb-3">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div> : 
                            <div className="mb-3">
                                <label className="form-label" htmlFor="deal_owner">
                                    <span className="text-danger me-1">*</span>
                                    Deal Owner
                                </label>
                                <Select
                                    id="deal_owner"
                                    classNamePrefix="owner-select"
                                    placeholder={"Select Deal Owner...."}
                                    closeMenuOnSelect={true}
                                    value={dealClone.owner}
                                    options={cloneOwnerOptions(clone?.userList)}
                                    onChange={(values) => handleCloneOwnerChange(dealId, values)}
                                />
                            </div> : null
                        }
                        <div className="mb-0">
                            <button disabled={clone?.saveLoading}  onClick={() => onDealClone(dealId)} data-bs-auto-close="inside" className="btn btn-purple w-100">
                                {(clone?.saveLoading) ? 'Cloning...' : 'Clone'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div> : null
    )
}
const mapStateToProps = (state) => ({
    permissions: state.common?.settings?.permissions,
    deal: state.deal.detail,
    clone: state.deal.clone,
});

const mapDispatchToProps = {
    loadClonePipelineList,
    loadCloneUserList,
    cloneDeal
};
  
export default connect(mapStateToProps, mapDispatchToProps)(Clone);