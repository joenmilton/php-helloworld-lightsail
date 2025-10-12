import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { 
    loadJournalSettings,
    addJournal,
    saveMasterDomain,
    saveMasterService,
    saveJournal
} from '../../../../redux';
import CreatableSelect from 'react-select/creatable';

import Select from 'react-select';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";

const JournalForm = ({ 
    id, formType, parentData, onClose, 
    settingsInitialized, settingsLoading, settings, journal, saveLoading,
    loadJournalSettings, addJournal, saveMasterDomain, saveMasterService, saveJournal
}) => {
    const [errors, setError]                        = useState({});

    useEffect(async() => {
        if(!settingsInitialized) {
            const queryFilter = {
                deal_id: parentData?.dealId
            }
            await loadJournalSettings(queryFilter);
        }
    }, [settingsInitialized])
    
    const changeConfirmationDate = (date) => {
        const updatedRecord = {
            ...journal,
            confirmation_date: new Date(date).toISOString()
        };
        addJournal(updatedRecord);
    }

    const changeDeadline = (date) => {
        const updatedRecord = {
            ...journal,
            deadline: new Date(date).toISOString()
        };
        addJournal(updatedRecord);
    }

    const journalChange = (e) => {
        let updatedRecord = {};
        const { name, value } = e.target;

        switch (name) {
            case 'paper': {
                updatedRecord = {
                    ...journal,
                    paper: value,
                };
                addJournal(updatedRecord);
                break;
            }

            default:
                break;
        }
    }

    const domainValue = (domains, domain_id) => {
        if(domain_id === '') {
            return null
        }

        const domain = domains.find(p => p.id === domain_id)
        if(!domain) {
            return null
        }

        return {
            label: domain.name,
            value: domain.id
        }
    }
    const domainOptions = (domains) => {
        if(!domains) {
            return []
        }

        return domains.map(p => {
            return {
                label: p.name,
                value: p.id
            }
        })
    }

    const handleDomainCreateOption = async(value, dealId) => {
        const queryFilter = {
            deal_id: dealId
        }

        const newData = await saveMasterDomain(value, queryFilter);
        if(!newData) {
            return;
        }

        const updatedRecord = { ...journal, domain_id: newData };
        addJournal(updatedRecord);
    }

    const handleDomainChange = async (values) => {

        let updatedRecord;

        if(!values) {
            updatedRecord = { ...journal, domain_id: '' };
            addJournal(updatedRecord);
            return;
        }

        updatedRecord = { ...journal, domain_id: values.value };
        addJournal(updatedRecord);
    }

    const serviceValue = (services, service_id) => {
        if(service_id === '') {
            return null
        }

        const service = services.find(p => p.id === service_id)
        if(!service) {
            return null
        }

        return {
            label: service.name,
            value: service.id
        }
    }
    const serviceOptions = (services) => {
        if(!services) {
            return [];
        }
        
        return services.map(p => {
            return {
                label: p.name,
                value: p.id
            }
        })
    }
    const handleServiceCreateOption = async(value, dealId) => {
        const queryFilter = {
            deal_id: dealId
        }

        const newData = await saveMasterService(value, queryFilter);
        if(!newData) {
            return;
        }

        const updatedRecord = { ...journal, service_id: newData };
        addJournal(updatedRecord);
    }
    const handleServiceChange = async(values) => {
        let updatedRecord ;

        if(!values) {
            updatedRecord = { ...journal, service_id: '' };
            addJournal(updatedRecord);
            return;
        }

        updatedRecord = { ...journal, service_id: values.value };
        addJournal(updatedRecord);
    }


    const assignedUserOption = (users) => {
        if(!users || users.length <= 0) {
            return null;
        }

        return users.map(user => {
            return {
                label: user.name,
                value: user.id,
            }
        })
    }

    const handleAssignedUserChange = (data, users) => {

        const dataValues = data.map(item => item.value);
        const selectedUsers = users.filter(user => dataValues.includes(user.id));
        
        const updatedRecord = {
            ...journal,
            users: selectedUsers,
        };

        addJournal(updatedRecord);
    }

    const assignedUserValue = (users) => {
        if(!users || users.length <= 0) {
            return []
        }

        return users.map(user => {
            return {
                label: user.name,
                value: user.id,
            }
        })
    }



    const handleSave = async(e) => {
        const updatedJournal = {
            ...journal,
            journalable_id: parentData?.dealId
        }

        const response = await saveJournal(updatedJournal);
        
        if(response.httpCode == 422) {
            setError(response.errors)
        }

        if(response.httpCode === 200) {
            onClose()
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
                        Create Journal Paper
                    </h2>
                    <div className="row px-4">
                        <div className="col-md-12">
                            <div className="mb-3">
                                <label className="form-label" htmlFor="paper">
                                    <span className="text-danger me-1">*</span>
                                    Paper
                                </label>
                                <input 
                                    type="text"
                                    id="paper"
                                    name="paper"
                                    value={journal.paper}
                                    onChange={journalChange}
                                    className="form-control"
                                    autoComplete="off"
                                />
                                {errors.paper && (
                                    <div className="d-block invalid-feedback">
                                        {errors.paper.join(', ')}
                                    </div>
                                )}
                            </div>


                            <div className="mb-3">
                                <label className="form-label" htmlFor="domain">
                                    <span className="text-danger me-1">*</span>
                                    Domain
                                </label>
                                <CreatableSelect
                                    isClearable
                                    placeholder={"Select or create an option..."}
                                    noOptionsMessage={() => "No options found"}
                                    formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
                                    value={domainValue(settings?.master_domains, journal.domain_id)}
                                    options={domainOptions(settings?.master_domains)}
                                    onChange={(value) => handleDomainChange(value)}
                                    onCreateOption={(value) => handleDomainCreateOption(value, parentData?.dealId)}
                                />
                                {errors.domain_id && (
                                    <div className="d-block invalid-feedback">
                                        {errors.domain_id.join(', ')}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label" htmlFor="service">
                                    <span className="text-danger me-1">*</span>
                                    Service
                                </label>
                                <CreatableSelect
                                    isClearable
                                    placeholder={"Select or create an option..."}
                                    noOptionsMessage={() => "No options found"}
                                    formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
                                    value={serviceValue(settings?.master_services, journal.service_id)}
                                    options={serviceOptions(settings?.master_services)}
                                    onChange={(value) => handleServiceChange(value)}
                                    onCreateOption={(value) => handleServiceCreateOption(value, parentData?.dealId)}
                                />
                                {errors.service_id && (
                                    <div className="d-block invalid-feedback">
                                        {errors.service_id.join(', ')}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label" htmlFor="confirmation_date">Confirmation Date</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bx bx-calendar-event"></i>
                                    </span>
                                    <Flatpickr
                                        id="confirmation_date"
                                        name="confirmation_date"
                                        className="form-control"
                                        value={journal.confirmation_date}
                                        options={{
                                            enableTime: false,
                                            dateFormat: "d-M-Y",
                                            time_24hr: true,
                                            defaultHour: 0,
                                            disableMobile: "true"
                                        }}
                                        onChange={([date]) => {
                                            if (date) {
                                                changeConfirmationDate(date)
                                            }
                                        }}
                                    />
                                </div>
                                {errors.confirmation_date && (
                                    <div className="d-block invalid-feedback">
                                        {errors.confirmation_date.join(', ')}
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="deadline">Deadline</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bx bx-calendar-event"></i>
                                    </span>
                                    <Flatpickr
                                        id="deadline"
                                        name="deadline"
                                        className="form-control"
                                        value={journal.deadline}
                                        options={{
                                            enableTime: false,
                                            dateFormat: "d-M-Y",
                                            time_24hr: true,
                                            defaultHour: 0,
                                            disableMobile: "true"
                                        }}
                                        onChange={([date]) => {
                                            if (date) {
                                                changeDeadline(date)
                                            }
                                        }}
                                    />
                                </div>
                                {errors.deadline && (
                                    <div className="d-block invalid-feedback">
                                        {errors.deadline.join(', ')}
                                    </div>
                                )}
                            </div>


                            <div className="mb-3">
                                <label className="form-label">
                                    Publication Sheet Assign To
                                </label>
                                <Select
                                    id="shared_with"
                                    isMulti
                                    classNamePrefix="shared_with-select"
                                    placeholder={"Select User...."}
                                    closeMenuOnSelect={true}
                                    value={assignedUserValue(journal?.users) || []}
                                    options={assignedUserOption(settings?.publication_staffs)}
                                    onChange={(values) => handleAssignedUserChange(values, settings?.publication_staffs)}
                                />
                            </div>

                        </div>
                    </div>
                </div>
                <div>
                    <div className="px-4 py-2 sidebar-footer border-top-custom">
                        <div className="d-flex align-items-start"> 
                            <button type="button" className="btn w-sm ms-auto me-2" onClick={() => { onClose();}}>Cancel</button>
                            <button type="button" disabled={saveLoading || settingsLoading} className="btn btn-purple w-sm" onClick={handleSave}>
                                {(saveLoading || settingsLoading) ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const mapStateToProps = (state) => ({
    settingsInitialized: state.journal.settingsInitialized,
    settingsLoading: state.journal.settingsLoading,
    settings: state.journal.settings,
    journal: state.journal.detail,
    saveLoading: state.journal.saveLoading
});

const mapDispatchToProps = {
    loadJournalSettings,
    addJournal,
    saveMasterDomain,
    saveMasterService,
    saveJournal
};

export default connect(mapStateToProps, mapDispatchToProps)(JournalForm);