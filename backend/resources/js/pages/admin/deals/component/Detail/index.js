import React, { useState, useContext } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { changeDealExpectedCloseDate } from '../../../../../redux';
import { SidebarContext } from '../../../../../components/Sidebar/contexts/SidebarContext';
import { customFieldLabel, formatDate } from '../../../../../utils';
import { useHasPermission } from '../../../../../utils/permissions';

import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";

const DealDetail = ({ 
    saveLoading, custom_fields, permissions, initialized, deal,
    changeDealExpectedCloseDate
}) => {
    const { toggleSidebar } = useContext(SidebarContext);
    const { dealId }        = useParams();

    const [isDateEditing, setIsDateEditing]         = useState(false);
    const [selectedDate, setSelectedDate]   = useState(null);

    const handleExpectedCloseDateChange = async(date, dealId) => {

        const updatedCloseDate = new Date(date).toISOString()

        await changeDealExpectedCloseDate(dealId, updatedCloseDate);
        
        setSelectedDate(date);
        setIsDateEditing(false);
    };

    const expectedCloseDateValue = (date) => {
        return new Date(date).toISOString()
    }

    const openDealForm = async (dealId) => {
        toggleSidebar('deals', dealId)
    }

    return (
        <div className="card shadow-sm mb-3">
            <div className="card-header d-flex justify-content-between align-items-center border-bottom-0">
                <h5 className="logo-txt sub-text mb-0">Details</h5>
                {
                    ((useHasPermission(['edit own deals', 'edit all deals', 'edit team deals'], permissions))) ? <div className="btn btn-light text-secondary px-1 p-0" onClick={() => openDealForm(deal?.id)}>
                        <i className="fs-5 uil-edit"></i>
                    </div> : null
                }
                
            </div>
            <div className="card-body pt-2" style={{ minHeight: '125px' }}>
                {
                    (!initialized) ? <div className="d-flex align-items-center justify-content-center">
                        <div className="spinner-border text-primary m-1" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div> : <div>
                        <div className="d-grid grid-cols-12 gap-y-1">
                            {
                                (useHasPermission(['view deal payment'], permissions)) ? <>
                                    <div className="col-span-12">
                                        <div className="group position-relative px-2 py-1 hover:bg-neutral-50" style={{ lineHeight: '24px' }}>
                                            {
                                                (!deal?.has_products) ? <button className="btn btn-white d-none group-hover:block absolute-positioned px-1 py-0 me-4">
                                                    <i className="uil-edit-alt" style={{ fontSize: '15px' }}></i>
                                                </button> : <></>
                                            }
                                            
                                            <div className="d-grid grid-cols-3 gap-4">
                                                <div className="col-span-1 w-100 justify-self-end truncate text-end text-neutral-500 hover:max-w-none hover:overflow-visible hover:whitespace-normal">Amount</div>
                                                <div className="col-span-2 break-words text-neutral-800"><i className="fas fa-rupee-sign me-1"></i>{deal?.amount}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-12">
                                        <div className="group position-relative px-2 py-1 hover:bg-neutral-50" style={{ lineHeight: '24px' }}>
                                            <div className="d-grid grid-cols-3 gap-4">
                                                <div className="col-span-1 w-100 justify-self-end truncate text-end text-neutral-500 hover:max-w-none hover:overflow-visible hover:whitespace-normal">Paid</div>
                                                <div className="col-span-2 break-words text-neutral-800"><i className="fas fa-rupee-sign me-1"></i>{deal?.paid_amount}</div>
                                            </div>
                                        </div>
                                    </div>
                                </> : null
                            }
                            <div className="col-span-12">
                                <div className="group position-relative px-2 py-1 hover:bg-neutral-50" style={{ lineHeight: '24px' }}>
                                    {
                                        (!isDateEditing) ? <button className="btn btn-white d-none group-hover:block absolute-positioned px-1 py-0 me-4" onClick={() => setIsDateEditing(!isDateEditing)}>
                                            <i className="uil-edit-alt" style={{ fontSize: '15px' }}></i>
                                        </button> : null
                                    }
                                    <div className="d-grid grid-cols-3 gap-4">
                                        <div className="col-span-1 w-100 justify-self-end truncate text-end text-neutral-500 hover:max-w-none hover:overflow-visible hover:whitespace-normal">Expected Close Date</div>
                                        <div className="col-span-2 break-words text-neutral-800">
                                        {isDateEditing ? (
                                            <Flatpickr
                                                style={{paddingTop: '2px', paddingBottom: '2px'}}
                                                className="form-control"
                                                value={expectedCloseDateValue(deal?.expected_close_date)}
                                                options={{
                                                    enableTime: false,
                                                    dateFormat: "d-M-Y",
                                                    time_24hr: true,
                                                    defaultHour: 0,
                                                    disableMobile: "true"
                                                }}
                                                onChange={async(date) => await handleExpectedCloseDateChange(date, deal?.id)}
                                            />
                                        ) : (
                                            formatDate(deal?.expected_close_date, 'date')
                                        )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                (deal?.customFields) ? deal?.customFields.map((field, index) => {
                                    return (
                                        <div key={index} className="col-span-12">
                                            <div className="group position-relative px-2 py-1 hover:bg-neutral-50" style={{ lineHeight: '24px' }}>
                                                <div className="d-grid grid-cols-3 gap-4">
                                                    <div className="col-span-1 w-100 justify-self-end truncate text-end text-neutral-500 hover:max-w-none hover:overflow-visible hover:whitespace-normal">{customFieldLabel(custom_fields, field.field_name)}</div>
                                                    <div className="col-span-2 w-100 justify-self-end truncate text-neutral-500 hover:max-w-none hover:overflow-visible hover:whitespace-normal">{(field.field_value && field.field_value != '')  ? field.field_value : '-'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }) : null
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
    )
};

const mapStateToProps = (state) => ({
    permissions: state.common?.settings?.permissions,
    custom_fields: state.common?.settings?.custom_fields?.deal,
    initialized: state.deal?.initialized,
    saveLoading: state.deal.saveLoading,
    deal: state.deal.detail,
});

const mapDispatchToProps = {
    changeDealExpectedCloseDate
};

export default connect(mapStateToProps, mapDispatchToProps)(DealDetail);