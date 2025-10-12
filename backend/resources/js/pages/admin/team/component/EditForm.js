import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { addTeam, saveTeam } from '../../../../redux';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const TeamForm = ({ 
    id, formType, onClose,
    settings, saveLoading, team,
    addTeam, saveTeam
}) => {
    const [errors, setError]        = useState({});
    const animatedComponents        = makeAnimated();

    const teamChange = (e) => {
        let updatedRecord = {};
        const { name, value } = e.target;

        switch (name) {
            case 'name': {
                updatedRecord = {
                    ...team,
                    name: value,
                };
                addTeam(updatedRecord);
                break;
            }
            case 'description': {
                updatedRecord = {
                    ...team,
                    description: value,
                };
                addTeam(updatedRecord);
                break;
            }
            default:
                break;
        }
    };


    const memberOptions = (options) => {
        return options && options.length > 0 ? options.map(option => {
            return {
                label: `${option.name} - [ ${option.email} ]`,
                value: option.id
            }
        }): []
    }

    const handleMemberChange = (values, b) => {
        const filtered = (settings?.admins).filter(item => values.some(aItem => aItem.value === item.id));
        const updatedRecord = {
            ...team,
            members: filtered,
        };
        addTeam(updatedRecord);
    }

    const handleManagerChange = (selected, b) => {
        const updatedmembers = (team?.members && team?.members.length > 0) ? team?.members.map(member => {
            return {
                ...member,
                is_manager: member.id === selected.value ? true : false,
            }
        }) : []
        const updatedRecord = {
            ...team,
            members: updatedmembers
        }
        addTeam(updatedRecord);
    }
    

    const selectedManager = (members) => {
        const manager = members.find(member => {
            return member.is_manager
        })

        return (manager) ? {
            label: `${manager.name} - [ ${manager.email} ]`,
            value: manager.id
        } : null
    }

    const handleSave = async (e) => {

        const response = await saveTeam(team);

        if(response.httpCode == 422) {
            setError(response.errors)
        }

        if(response.httpCode === 200) {
            onClose();
        }
    }

    return (
        <>
            <div className="rightbar-title d-flex align-items-center pe-3">
                <a href="" onClick={(event) => { event.preventDefault(); onClose(); }} className="right-bar-toggle-close ms-auto">
                    <i className="mdi mdi-close noti-icon"></i>
                </a>
            </div>
            <div className="d-flex flex-column h-full w-screen">
                <div className="d-flex flex-column flex-equal overflow-x-hidden overflow-y-scroll py-4">
                    <h2 className="sub-head mb-3 px-4">
                        {
                            (team.name) ? team.name : 'Create Team'
                        }
                    </h2>
                    <div className="row px-4">
                        <div className="col-md-12">

                            <div className="mb-3">
                                <label className="form-label" htmlFor="name">
                                    <span className="text-danger me-1">*</span>
                                    Team Name
                                </label>
                                <input 
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={team.name}
                                    onChange={teamChange}
                                    className="form-control"
                                    placeholder=""
                                />
                                {errors.name && (
                                    <div className="d-block invalid-feedback">
                                        {errors.name.join(', ')}
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="description">
                                    <span className="text-danger me-1">*</span>
                                    Team Description
                                </label>
                                <textarea 
                                    id="description"
                                    name="description"
                                    onChange={teamChange}
                                    value={team.description} 
                                    className="form-control"
                                ></textarea>
                                {errors.description && (
                                    <div className="d-block invalid-feedback">
                                        {errors.description.join(', ')}
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="team_members">
                                    <span className="text-danger me-1">*</span>
                                    Team Members
                                </label>
                                <Select
                                    id="team_members"
                                    value={memberOptions(team?.members)}
                                    classNamePrefix="team-select"
                                    components={animatedComponents}
                                    closeMenuOnSelect={false}
                                    isMulti
                                    options={memberOptions(settings?.admins)}
                                    onChange={(values) => handleMemberChange(values)}
                                />
                                {errors.members && (
                                    <div className="d-block invalid-feedback">
                                        {errors.members.join(', ')}
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="manager_name">
                                    <span className="text-danger me-1">*</span>
                                    Manager
                                </label>
                                <Select
                                    id="manager_name"
                                    value={selectedManager(team?.members)}
                                    classNamePrefix="team-select"
                                    closeMenuOnSelect={true}
                                    options={memberOptions(team?.members)}
                                    onChange={(values) => handleManagerChange(values)}
                                />
                                {errors.is_manager && (
                                    <div className="d-block invalid-feedback">
                                        {errors.is_manager.join(', ')}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="px-4 py-2 sidebar-footer border-top-custom">
                        <div className="d-flex align-items-start"> 
                            <button type="button" className="btn w-sm ms-auto me-2" onClick={() => { onClose();}}>Cancel</button>
                            <button type="button" disabled={saveLoading} className="btn btn-purple w-sm" onClick={handleSave}>
                                {saveLoading ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const mapStateToProps = (state) => ({
    settings: state.common.settings,
    saveLoading: state.team.saveLoading,
    team: state.team.detail
});

const mapDispatchToProps = {
    addTeam,
    saveTeam
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamForm);