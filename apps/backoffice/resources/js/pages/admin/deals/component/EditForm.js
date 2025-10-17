import React, { useRef, useContext, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { addDeal, saveDeal, handleDealChange, changeExpectedCloseDate } from '../../../../redux';
import { useHistory } from 'react-router-dom';
import notificationService from '../../../../service/NotificationService';
import { customFieldValue, updateCustomFields } from '../../../../utils';

import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";

const DealForm = ({ 
    id, formType, onClose, 
    deal, settings, custom_fields, saveLoading, 
    addDeal, saveDeal, handleDealChange, changeExpectedCloseDate
}) => {
    const [errors, setError]                        = useState({});
    const history = useHistory();

    useEffect(() => {
        console.log('open trigger')
    }, []);

    const changeDueDate = (date) => {
        changeExpectedCloseDate(new Date(date).toISOString())
    }

    const dealChange = (e) => {
        let updatedRecord = {};
        const { name, value } = e.target;

        switch (name) {
            case 'pipeline': 
                addDeal({
                    ...deal,
                    pipeline_id: value,
                    stage_id: '',
                });
                break;
            default:
                const foundCustomField = custom_fields.find(param => param.name === name);
                if (foundCustomField) {

                    const updatedCustomFields = updateCustomFields(deal.temp_custom_fields, {field_name: name, field_value: value})
                    updatedRecord = {
                        ...deal,
                        temp_custom_fields: updatedCustomFields,
                    };
                    addDeal(updatedRecord);
                }
                break;
        }
    };

    
    const handleSave = async (e) => {
        const response = await saveDeal(deal);

        if(response.httpCode == 422) {
            setError(response.errors)
        }

        if(response.httpCode === 200) {
            notificationService.success('Stage updated!');
            onClose();
            history.push(`/admin/deals/${response.data.id}/edit`);
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
                            (deal.name) ? deal.name : 'Create Deal'
                        }
                    </h2>
                    <div className="row px-4">
                        <div className="col-md-12">
                            <div className="mb-3">
                                <label className="form-label" htmlFor="deal_name">
                                    <span className="text-danger me-1">*</span>
                                    Deal Name
                                </label>
                                <input 
                                    type="text"
                                    name="name"
                                    id="deal_name"
                                    value={deal.name}
                                    onChange={(e) => handleDealChange('name', e.target.value)}
                                    className="form-control"
                                    placeholder=""
                                />
                                {errors.name && (
                                    <div className="d-block invalid-feedback">
                                        {errors.name.join(', ')}
                                    </div>
                                )}
                            </div>
                            {
                                (!id) ? <>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            <span className="text-danger me-1">*</span>
                                            Pipeline
                                        </label>
                                        <select 
                                            name="pipeline"
                                            className="form-control" 
                                            value={deal.pipeline_id} 
                                            onChange={dealChange} 
                                        >
                                            <option value="">Select Pipeline</option>
                                            {settings.pipelines.map(pipeline => (
                                                <option key={pipeline.id} value={pipeline.id}>
                                                    {pipeline.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.pipeline_id && (
                                            <div className="d-block invalid-feedback">
                                                {errors.pipeline_id.join(', ')}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            <span className="text-danger me-1">*</span>
                                            Stage
                                        </label>
                                        <select
                                            name="stage"
                                            className="form-control"
                                            value={deal.stage_id}
                                            onChange={(e) => handleDealChange('stage_id', e.target.value)}
                                        >
                                            <option value="">Select Stage</option>
                                            {settings.pipelines
                                                .filter(pipeline => pipeline.id === deal.pipeline_id)
                                                .flatMap(pipeline => pipeline.stages)
                                                .map(stage => (
                                                    <option key={stage.id} value={stage.id}>
                                                        {stage.name}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                        {errors.stage_id && (
                                            <div className="d-block invalid-feedback">
                                                {errors.stage_id.join(', ')}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="amount">Amount</label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="bx bx-rupee"></i>
                                            </span>
                                            <input
                                                type="text"
                                                name="amount"
                                                id="amount"
                                                value={deal.amount}
                                                onChange={(e) => handleDealChange('amount', e.target.value)}
                                                className="form-control"
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="expected_close_date">Expected Close Date</label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="bx bx-calendar-event"></i>
                                            </span>
                                            <Flatpickr
                                                id="expected_close_date"
                                                className="form-control"
                                                value={deal.expected_close_date}
                                                options={{
                                                    enableTime: false,
                                                    dateFormat: "d-M-Y",
                                                    time_24hr: true,
                                                    defaultHour: 0,
                                                    disableMobile: "true"
                                                }}
                                                onChange={([date]) => {
                                                    if (date) {
                                                        changeDueDate(date)
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </> : <></>
                            }
                            {
                                (custom_fields && custom_fields.length > 0) ? custom_fields.map((field, index) => {
                                    return (
                                        <div key={index} className="mb-3">
                                            <label className="form-label" htmlFor={field.name}>
                                                {field.label}
                                            </label>
                                            <input 
                                                type="text"
                                                id={field.name}
                                                name={field.name}
                                                value={customFieldValue(deal.temp_custom_fields, field.name) || ''} 
                                                onChange={dealChange}
                                                className="form-control"
                                                autoComplete="off"
                                            />
                                            {errors[field.name] && (
                                                <div className="d-block invalid-feedback">
                                                    {errors[field.name].join(', ')}
                                                </div>
                                            )}
                                        </div>
                                    )
                                }) : <></>
                            }
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
    saveLoading: state.deal.saveLoading,
    custom_fields: state.common?.settings?.custom_fields?.deal,
    deal: state.deal.detail,
    settings: state.common.settings,
});

const mapDispatchToProps = {
    addDeal,
    saveDeal,
    handleDealChange,
    changeExpectedCloseDate
};

export default connect(mapStateToProps, mapDispatchToProps)(DealForm);