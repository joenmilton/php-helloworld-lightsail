import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { 
    loadJournalSettings,
    addProcessProof,
    saveProcessProof
} from '../../../../redux';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';

import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";

const ProcessProofForm = ({ 
    id, formType, parentData, onClose, 
    settingsInitialized, settingsLoading, settings, saveLoading, proofDetail, 
    loadJournalSettings, addProcessProof, saveProcessProof
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


    
    const changeAcceptedDate = (date) => {
        const updatedRecord = {
            ...proofDetail,
            accepted_date: new Date(date).toISOString()
        };
        addProcessProof(updatedRecord);
    }


    const statusValue = (statusList, status_id) => {
        if(status_id === '') {
            return null
        }

        const status = statusList.find(s => s.id === status_id)
        if(!status) {
            return null
        }

        return {
            label: status.name,
            value: status.id
        }
    }
    const statusOptions = (status) => {
        if(!status) {
            return [];
        }

        return status.map(p => {
            return {
                label: p.name,
                value: p.id
            }
        })
    }

    const handleCopyrightStatusChange = async (values) => {

        let updatedRecord;

        if(!values) {
            updatedRecord = { ...proofDetail, copyright_status: '' };
            addProcessProof(updatedRecord);
            return;
        }

        updatedRecord = { ...proofDetail, copyright_status: values.value };
        addProcessProof(updatedRecord);
    }

    const handleProofStatusChange = async (values) => {

        let updatedRecord;

        if(!values) {
            updatedRecord = { ...proofDetail, proof_status: '' };
            addProcessProof(updatedRecord);
            return;
        }

        updatedRecord = { ...proofDetail, proof_status: values.value };
        addProcessProof(updatedRecord);
    }

    const handleFinalStatusChange = async (values) => {

        let updatedRecord;

        if(!values) {
            updatedRecord = { ...proofDetail, final_status: '' };
            addProcessProof(updatedRecord);
            return;
        }

        updatedRecord = { ...proofDetail, final_status: values.value };
        addProcessProof(updatedRecord);
    }


    const handleSave = async(e) => {
        const response = await saveProcessProof(proofDetail);
        
        if(response.httpCode == 422) {
            setError(response.errors)
        }

        if(response.httpCode === 200) {
            onClose()
        }
    }

    const acceptedDateValue = (date) => {
        if(!date) { return '' }
        return new Date(date).toISOString()
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
                        Create Copy & Proof
                    </h2>
                    <div className="row px-4">
                        <div className="col-md-12">

                            <div className="mb-3">
                                <label className="form-label" htmlFor="accepted_date">Accepted Date</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bx bx-calendar-event"></i>
                                    </span>
                                    <Flatpickr
                                        id="accepted_date"
                                        name="accepted_date"
                                        className="form-control"
                                        value={acceptedDateValue(proofDetail.accepted_date)}
                                        options={{
                                            enableTime: false,
                                            dateFormat: "d-M-Y",
                                            time_24hr: true,
                                            defaultHour: 0,
                                            disableMobile: "true"
                                        }}
                                        onChange={([date]) => {
                                            if (date) {
                                                changeAcceptedDate(date)
                                            }
                                        }}
                                    />
                                </div>
                                {errors.accepted_date && (
                                    <div className="d-block invalid-feedback">
                                        {errors.accepted_date.join(', ')}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label" htmlFor="copyright_status">
                                    Copyright Status
                                </label>
                                <Select
                                    id="copyright_status"
                                    classNamePrefix="copyright-status-select"
                                    placeholder={"Select A Status...."}
                                    closeMenuOnSelect={true}
                                    value={statusValue(settings?.status?.copyright, proofDetail.copyright_status)}
                                    options={statusOptions(settings?.status?.copyright)}
                                    onChange={(value) => handleCopyrightStatusChange(value)}
                                />
                                {errors.copyright_status && (
                                    <div className="d-block invalid-feedback">
                                        {errors.copyright_status.join(', ')}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label" htmlFor="proof_status">
                                    Proof Status
                                </label>
                                <Select
                                    id="proof_status"
                                    classNamePrefix="copyright-status-select"
                                    placeholder={"Select A Status...."}
                                    closeMenuOnSelect={true}
                                    value={statusValue(settings?.status?.proof, proofDetail.proof_status)}
                                    options={statusOptions(settings?.status?.proof)}
                                    onChange={(value) => handleProofStatusChange(value)}
                                />
                                {errors.proof_status && (
                                    <div className="d-block invalid-feedback">
                                        {errors.proof_status.join(', ')}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label" htmlFor="final_status">
                                    Final Status
                                </label>
                                <Select
                                    id="final_status"
                                    classNamePrefix="copyright-status-select"
                                    placeholder={"Select A Status...."}
                                    closeMenuOnSelect={true}
                                    value={statusValue(settings?.status?.final, proofDetail.final_status)}
                                    options={statusOptions(settings?.status?.final)}
                                    onChange={(value) => handleFinalStatusChange(value)}
                                />
                                {errors.final_status && (
                                    <div className="d-block invalid-feedback">
                                        {errors.final_status.join(', ')}
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
    saveLoading: state.journal.saveLoading,
    proofDetail: state.journal.proofDetail
});
const mapDispatchToProps = {
    loadJournalSettings,
    addProcessProof,
    saveProcessProof
};
export default connect(mapStateToProps, mapDispatchToProps)(ProcessProofForm);