import React, { useState, } from 'react';
import { connect } from 'react-redux';
import { 
    addProcessSheet,
    saveProcessSheet
} from '../../../../redux';

import CurrentRevision from './CurrentRevision';
import NextRevision from './NextRevision';

import Select from 'react-select';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";

const ProcessSheetForm = ({ 
    id, formType, parentData, onClose, 
    settingsInitialized, settingsLoading, settings, saveLoading, sheetDetail,
    addProcessSheet, saveProcessSheet
}) => {
    const [errors, setError]                        = useState({});

    const duedateValue = (date) => {
        if(!date) { return '' }
        return new Date(date).toISOString()
    }

    const changeProcessSubmissionDate = (date) => {
        const updatedRecord = {
            ...sheetDetail,
            submission_date: (date) ? new Date(date).toISOString() : ''
        };
        addProcessSheet(updatedRecord);
    }

    const changeProcessDueDate = (date) => {
        const updatedRecord = {
            ...sheetDetail,
            due_date: (date) ? new Date(date).toISOString() : ''
        };
        addProcessSheet(updatedRecord);
    }

    const processStatusValue = (statusList, status_id) => {
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
    const processStatusOptions = (status) => {
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
    const handleProcessStatusChange = async (values) => {

        let updatedRecord;

        if(!values) {
            updatedRecord = { ...sheetDetail, publisher_status: '' };
            addProcessSheet(updatedRecord);
            return;
        }

        updatedRecord = { ...sheetDetail, publisher_status: values.value };
        addProcessSheet(updatedRecord);
    }



    const handleSave = async(e) => {
        const response = await saveProcessSheet(sheetDetail);

        if(response.httpCode == 422) {
            setError(response.errors)
        }

        if(response.httpCode === 200) {
            onClose()
        }
    }
    

    const openNewRevision = async(flag) => {
        const updatedRecord = { 
            ...sheetDetail, 
            next_revision: {
                ...sheetDetail.next_revision,
                flag: flag
            }
        };
        addProcessSheet(updatedRecord);
    }

    const getExtraValue = (extraInfo, label) => {
        if(!extraInfo || extraInfo === '') {
            return '';
        }

        if (Array.isArray(extraInfo)) {
            const entry = extraInfo.find(info => info.label === label);
            return entry ? entry.value : "";
        }

        return "";
    };

    const setExtraValue = (e) => {
        const name = e.target.name;
        const value = e.target.value;
    
        const extraInfo = sheetDetail.extra_info || [];
        const index = extraInfo.findIndex(info => info.label === name);

        if (index !== -1) {
            extraInfo[index].value = value;
        } else {
            extraInfo.push({ label: name, value });
        }

        const updatedRecord = { 
            ...sheetDetail, 
            extra_info: extraInfo 
        };

        addProcessSheet(updatedRecord);
    }
    
    const setUrl = (e) => {
        const updatedRecord = { 
            ...sheetDetail, 
            url: e.target.value 
        };
        addProcessSheet(updatedRecord);
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





                    <ul className="nav nav-tabs" role="tablist">
                        <li className="nav-item" role="presentation">
                            <a className="nav-link active" data-bs-toggle="tab" href="#navtabs-home" role="tab" aria-selected="false" tabIndex="-1">
                                <span className="d-block d-sm-none"><i className="fas fa-home"></i></span>
                                <span className="d-none d-sm-block">Status Info</span>    
                            </a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a className="nav-link" data-bs-toggle="tab" href="#navtabs-profile" role="tab" aria-selected="true">
                                <span className="d-block d-sm-none"><i className="far fa-user"></i></span>
                                <span className="d-none d-sm-block">Login Info</span>    
                            </a>
                        </li>
                    </ul>

                    <div className="tab-content p-3">
                        <div className="tab-pane active show" id="navtabs-home" role="tabpanel">
          

                            <h2 className="sub-head mb-3 px-4">
                                Update Paper Status
                            </h2>
                            <div className="row px-4">
                                <div className="col-md-12">

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="submission_date">Submission Date</label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="bx bx-calendar-event"></i>
                                            </span>
                                            <Flatpickr
                                                id="submission_date"
                                                name="submission_date"
                                                className="form-control"
                                                value={duedateValue(sheetDetail.submission_date)}
                                                options={{
                                                    enableTime: false,
                                                    dateFormat: "d-M-Y",
                                                    time_24hr: true,
                                                    defaultHour: 0,
                                                    disableMobile: "true"
                                                }}
                                                onChange={([date]) => {
                                                    if (date) {
                                                        changeProcessSubmissionDate(date)
                                                    }
                                                }}
                                            />
                                            <span className="input-group-text">
                                                <i onClick={() => changeProcessSubmissionDate(null)} className="bx bx-revision"></i>
                                            </span>
                                            
                                        </div>

                                        {errors.submission_date && (
                                            <div className="d-block invalid-feedback">
                                                {errors.submission_date.join(', ')}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="due_date">Revision Due Date</label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="bx bx-calendar-event"></i>
                                            </span>
                                            <Flatpickr
                                                id="due_date"
                                                name="due_date"
                                                className="form-control"
                                                value={duedateValue(sheetDetail.due_date)}
                                                options={{
                                                    enableTime: false,
                                                    dateFormat: "d-M-Y",
                                                    time_24hr: true,
                                                    defaultHour: 0,
                                                    disableMobile: "true"
                                                }}
                                                onChange={([date]) => {
                                                    if (date) {
                                                        changeProcessDueDate(date)
                                                    }
                                                }}
                                            />
                                            <span className="input-group-text">
                                                <i onClick={() => changeProcessDueDate(null)} className="bx bx-revision"></i>
                                            </span>
                                        </div>
                                        {errors.submission_date && (
                                            <div className="d-block invalid-feedback">
                                                {errors.submission_date.join(', ')}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="publisher_status">
                                            Publisher Status
                                        </label>
                                        <Select
                                            id="publisher_status"
                                            classNamePrefix="publisher-status-select"
                                            placeholder={"Select A Status...."}
                                            closeMenuOnSelect={true}
                                            value={processStatusValue(settings?.status?.process, sheetDetail.publisher_status)}
                                            options={processStatusOptions(settings?.status?.process)}
                                            onChange={(value) => handleProcessStatusChange(value)}
                                        />
                                        {errors.publisher_status && (
                                            <div className="d-block invalid-feedback">
                                                {errors.publisher_status.join(', ')}
                                            </div>
                                        )}
                                    </div>
                                    <div className="card">
                                        <div className="card-body p-4">
                                            <div className="d-flex justify-content-between align-items-center border-bottom-0 mb-4">
                                                {
                                                    (!sheetDetail?.next_revision?.flag) ? <h5 className="card-title">{(sheetDetail?.current_revision?.revision_type === 'submission') ? 'Tech. Submission #S' : 'Tech. Revision #R'}{(sheetDetail?.current_revision?.revision_type !== 'submission') ? sheetDetail?.current_revision?.serial : ''}</h5> :
                                                    <h5 className="card-title">Tech. Revision #New</h5>
                                                }
                                                
                                                <div className="text-primary cursor-pointer" onClick={() => openNewRevision(!sheetDetail?.next_revision?.flag)}>
                                                    {
                                                        (!sheetDetail?.next_revision?.flag) ? <div className="user-select-none"><i className="uil-plus"></i> New Revision</div> : <div className="user-select-none"> <i className="uil-arrow-left"></i> Back</div>
                                                    }
                                                </div>
                                            </div>
                                            {
                                                (!sheetDetail?.next_revision?.flag) ? <CurrentRevision sheetDetail={sheetDetail} parentData={parentData}/> : <NextRevision sheetDetail={sheetDetail} parentData={parentData}/>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                        <div className="tab-pane" id="navtabs-profile" role="tabpanel">

                            <h2 className="sub-head mb-3 px-4">
                                Update Login Information
                            </h2>
                            <div className="row px-4">
                                <div className="col-md-12">
                                    <div className="mb-2">
                                        <label className="form-label" htmlFor="url">URL</label>
                                        <input 
                                            type="text"
                                            name="url"
                                            id="url"
                                            value={sheetDetail?.url || ''}
                                            onChange={setUrl}
                                            className="form-control bg-white shadow-sm ring-1 ring-neutral-300"
                                            placeholder=""
                                        />
                                    </div>
                                    {
                                        (settings?.extra_label) ? settings?.extra_label.map((label, index) => {
                                            return (
                                                <div className="mb-2" key={index}>
                                                    <label className="form-label" htmlFor={label}>{label}</label>
                                                    <input 
                                                        type="text"
                                                        name={label}
                                                        id={label}
                                                        value={getExtraValue(sheetDetail?.extra_info, label) || ''}
                                                        onChange={setExtraValue}
                                                        className="form-control bg-white shadow-sm ring-1 ring-neutral-300"
                                                        placeholder=""
                                                    />
                                                </div>
                                            )
                                        }) : null
                                    }
                                </div>
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
    sheetDetail: state.journal.sheetDetail
});
const mapDispatchToProps = {
    addProcessSheet,
    saveProcessSheet
};
export default connect(mapStateToProps, mapDispatchToProps)(ProcessSheetForm);