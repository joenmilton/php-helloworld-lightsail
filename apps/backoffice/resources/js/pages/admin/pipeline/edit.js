
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import AdminSettingsNav from '../../../components/AdminSettingsNav';
import { addPipeline, fetchPipeline, savePipeline, addDependentsList, fetchTeamList, fetchAdminList } from '../../../redux';
import StageTable from './component/StageTable';
import Select from 'react-select';

function EditPipeline({ saveLoading, deal, team, admin, addPipeline, savePipeline, fetchPipeline, addDependentsList, fetchTeamList, fetchAdminList }) {
    const { pipelineId }        = useParams();
    const [errors, setError]    = useState({});

    useEffect(() => {
        if(pipelineId) {
            fetchPipeline(pipelineId);
        }
        fetchAdminList(1, 1000);
        fetchTeamList(1, 1000);

    }, [pipelineId, fetchPipeline, fetchTeamList, fetchAdminList]);


    const pipelineChange = (e) => {

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

            case 'visible_to': {
                
                updatedRecord = {
                    ...deal.pipeline,
                    visible_to: e.target.value,
                    visibility_group: {
                        dependents: [],
                        type: e.target.value
                    },
                };
                addPipeline(updatedRecord);
                break;
            }
            
            default:
                break;
        }
    };


    const visiblityOptions = (options) => {
        return options && options.length > 0 ? options.map(option => {
            return {
                label: option.name,
                value: option.id
            }
        }): []
    }

    const teamSelectedValues = (options) => {

        let formattedOutput = options.map(formatedItem => {
            let matchedTeam = (team?.list?.data).find(team => team.id === formatedItem.dependable_id);
            if (matchedTeam) {
                return {
                    label: matchedTeam.name,
                    value: matchedTeam.id
                };
            } 
            return null
        }).filter(item => item !== null); // Remove null entries if any

        return formattedOutput
    }

    const userSelectedValues = (options) => {

        let formattedOutput = options.map(formatedItem => {

            let matchedTeam = (admin?.list?.data).find(admin => (admin.id).toString() === (formatedItem.dependable_id).toString());
            if (matchedTeam) {
                return {
                    label: matchedTeam.name,
                    value: matchedTeam.id
                };
            } 
            return null
        }).filter(item => item !== null); // Remove null entries if any
        return formattedOutput
    }


    const handleVisiblityChange = (selected, type = 'teams') => {

        const dependents = selected.map(data => {
            return {
                dependable_id: data.value
            }
        })

        addDependentsList(dependents, type)
    }
    


    const handleSave = () => {
        savePipeline(deal.pipeline);
    };

    return (
        <div className="col-md-9">
            <div className="row g-2">
                <div className="col-lg-auto">
                    <div className="d-flex">
                        <div className="flex-grow-1">
                            <div className="sub-head">Edit Pipeline</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card mt-2">
                <div className="card-body">
                    <div className="mb-3">
                        <label className="form-label" htmlFor="pipeline_name">
                            * Pipeline Name
                        </label>
                        <input
                            id="pipeline_name"
                            type="text"
                            name="name"
                            value={deal?.pipeline?.name}
                            onChange={pipelineChange}
                            className="form-control"
                            placeholder=""
                        />
                        {errors.name && (
                            <div className="d-block invalid-feedback">
                                {errors.name.join(', ')}
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <div>
                            <label className="form-label">
                                Visible to
                            </label>
                        </div>
                        <span className="me-4">
                            <input
                                className="form-check-input me-2"
                                type="radio"
                                name="visible_to"
                                id="formRadios1"
                                value="all"
                                checked={deal?.pipeline?.visibility_group !== null && deal?.pipeline?.visibility_group?.type === 'all'}
                                onChange={pipelineChange}
                            />
                            <label className="form-check-label" htmlFor="formRadios1">
                                Entire Company
                            </label>
                        </span>
                        <span className="me-4">
                            <input
                                className="form-check-input me-2"
                                type="radio"
                                name="visible_to"
                                id="formRadios2"
                                value="teams"
                                checked={deal?.pipeline?.visibility_group !== null && deal?.pipeline?.visibility_group?.type === 'teams'}
                                onChange={pipelineChange}
                            />
                            <label className="form-check-label" htmlFor="formRadios2">
                                Team
                            </label>
                        </span>
                        <span className="me-4">
                            <input
                                className="form-check-input me-2"
                                type="radio"
                                name="visible_to"
                                id="formRadios3"
                                value="users"
                                checked={deal?.pipeline?.visibility_group !== null && deal?.pipeline?.visibility_group?.type === 'users'}
                                onChange={pipelineChange}
                            />
                            <label className="form-check-label" htmlFor="formRadios3">
                                User
                            </label>
                        </span>
                    </div>
                    {
                        (deal?.pipeline?.visibility_group !== null && deal?.pipeline?.visibility_group?.type === 'teams') ?
                        <div className="mb-4">
                            <Select
                                value={teamSelectedValues(deal?.pipeline?.visibility_group?.dependents)}
                                classNamePrefix="team-select"
                                closeMenuOnSelect={false}
                                isMulti
                                options={visiblityOptions(team?.list?.data)}
                                onChange={(values) => handleVisiblityChange(values, 'teams')}
                            />
                        </div> : <></>
                    }
                    {
                        (deal?.pipeline?.visibility_group !== null && deal?.pipeline?.visibility_group?.type === 'users') ?
                        <div className="mb-4">
                            <Select
                                value={userSelectedValues(deal?.pipeline?.visibility_group?.dependents)}
                                classNamePrefix="team-select"
                                closeMenuOnSelect={false}
                                isMulti
                                options={visiblityOptions(admin?.list?.data)}
                                onChange={(values) => handleVisiblityChange(values, 'users')}
                            />
                        </div> : <></>
                    }

                    <div className="mb-3">
                        <blockquote className="blockquote custom-blockpuote blockpuote-primary rounded mb-0 p-2">
                            <p className="font-size-14 text-reset"><i className="font-size-24 uil-info-circle me-2"></i> This is the primary pipeline, hence, visibility cannot be changed.</p>
                        </blockquote>
                    </div>
                </div>

                <div className="table-responsive">
                    <StageTable />
                </div>

                <div className="modal-footer p-3">
                    <button className="btn btn-purple" disabled={saveLoading} onClick={handleSave}>
                        {saveLoading ? 'Saving...' : 'Save'}
                    </button>
                </div>

            </div>
        </div>
    )
}


const mapStateToProps = (state) => ({
    saveLoading: state.settings.saveLoading,
    deal: state.settings.deal,
    team: state.team,
    admin: state.admin
});

const mapDispatchToProps = {
    fetchPipeline,
    addDependentsList,
    savePipeline,
    addPipeline,

    fetchTeamList,
    fetchAdminList
};
  
export default connect(mapStateToProps, mapDispatchToProps)(EditPipeline);