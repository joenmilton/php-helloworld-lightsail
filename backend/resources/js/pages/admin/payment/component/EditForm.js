import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import Select from 'react-select';
import { 
    loadPaymentSettings,
    savePayment,
    handlePaymentChange,
    loadTransaction
} from '../../../../redux';
import moment from 'moment-timezone';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";

const PaymentForm = ({ 
    id, formType, onClose, parentData,
    saveLoading, payment, settingsLoading, settings, transactionLoading, 
    loadPaymentSettings, savePayment, handlePaymentChange, loadTransaction
}) => {
    const [errors, setError]                        = useState({});

    useEffect(async() => {
        const queryFilter = {
            deal_id: parentData?.dealId
        }
        await loadPaymentSettings(queryFilter);
    }, []);

    const handleSave = async (e) => {

        const updatedPayment = {
            ...payment,
            paid_at: moment(payment.paid_at).tz('Asia/Kolkata').format()
        }
        const response = await savePayment(parentData?.dealId, updatedPayment, parentData?.paymentScreen);
        if(response.httpCode == 422) {
            setError(response.errors)
        }

        if(response.httpCode === 200) {
            onClose()
        }
    }
    const handleFileChange = (e) => {
        handlePaymentChange(payment.id, 'attachment', e.target.files[0])
    }

    const transactionTypeValue = (payment_types, value) => {
        if(value === '') {
            return null
        }

        const payment_type = payment_types.find(p => p.value === value)
        if(!payment_type) {
            return null
        }

        return payment_type
    }

    const handleTransactionTypeChange = (values) => {
        handlePaymentChange(payment.id, 'transaction_type', values.value)
    }

    const bankValue = (banks, bank_id) => {
        if(bank_id === '') {
            return null
        }

        const bank = banks.find(p => p.id === bank_id)
        if(!bank) {
            return null
        }

        return {
            label: bank.name,
            value: bank.id
        }
    }

    const bankOptions = (banks) => {
        return banks.map(p => {
            return {
                label: p.name,
                value: p.id
            }
        })
    }
    
    const handleBankChange = (values) => {
        handlePaymentChange(payment.id, 'bank_id', values.value)
    }

    const productValue = (products, product_id) => {
        if(product_id === '') {
            return null
        }

        const product = products.find(p => p.id === product_id)
        if(!product) {
            return null
        }

        return {
            label: product.name,
            value: product.id
        }
    }

    const productOptions = (products) => {
        return products.map(p => {
            return {
                label: p.name,
                value: p.id
            }
        })
    }

    const handleProductChange = (values) => {
        handlePaymentChange(payment.id, 'product_id', values.value)
    }
    
    const handleTransactionBlur = async(payment) => {
        try {
            await loadTransaction(payment?.transaction_id)
        } catch (error) {

        }
    };

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
                        Create Payment
                    </h2>
                    <div className="row px-4">
                        <div className="col-md-12">

                            <div className="mb-3">
                                <label className="form-label" htmlFor="paid_to_product">
                                    <span className="text-danger me-1">*</span>
                                    Pay to Service
                                </label>
                                <Select
                                    id="product"
                                    classNamePrefix="product-select"
                                    placeholder={"Select Service...."}
                                    closeMenuOnSelect={true}
                                    value={productValue(settings?.available_products, payment.product_id)}
                                    options={productOptions(settings?.available_products)}
                                    onChange={(value) => handleProductChange(value)}
                                />
                                {errors.product_id && (
                                    <div className="d-block invalid-feedback">
                                        {errors.product_id.join(', ')}
                                    </div>
                                )}
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label" htmlFor="paid_amount">
                                    <span className="text-danger me-1">*</span>
                                    Amount
                                </label>
                                <input 
                                    type="text"
                                    id="paid_amount"
                                    name="paid_amount"
                                    value={payment.paid_amount}
                                    onChange={(e) => handlePaymentChange(payment.id, 'paid_amount', e.target.value)}
                                    className="form-control"
                                    autoComplete="off"
                                />
                                {errors.paid_amount && (
                                    <div className="d-block invalid-feedback">
                                        {errors.paid_amount.join(', ')}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label" htmlFor="transaction_type">
                                    <span className="text-danger me-1">*</span>
                                    Transaction Type
                                </label>
                                <Select
                                    id="transaction_type"
                                    classNamePrefix="transaction-type-select"
                                    placeholder={"Select Transaction Type...."}
                                    closeMenuOnSelect={true}
                                    value={transactionTypeValue(settings?.payment_types, payment.transaction_type)}
                                    options={settings?.payment_types}
                                    onChange={(value) => handleTransactionTypeChange(value)}
                                />
                                {errors.transaction_type && (
                                    <div className="d-block invalid-feedback">
                                        {errors.transaction_type.join(', ')}
                                    </div>
                                )}
                            </div>

                            {
                                (payment.transaction_type === 'bank') ? 
                                <>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="bank_account">
                                            <span className="text-danger me-1">*</span>
                                            Bank Account
                                        </label>
                                        <Select
                                            id="bank_account"
                                            classNamePrefix="bank-select"
                                            placeholder={"Select Bank Account...."}
                                            closeMenuOnSelect={true}
                                            value={bankValue(settings?.available_banks, payment.bank_id)}
                                            options={bankOptions(settings?.available_banks)}
                                            onChange={(value) => handleBankChange(value)}
                                        />
                                        {errors.bank_id && (
                                            <div className="d-block invalid-feedback">
                                                {errors.bank_id.join(', ')}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="transaction_id">
                                            <span className="text-danger me-1">*</span>
                                            Transaction ID
                                        </label>

                                        <div className="input-group">
                                            <input 
                                                type="text"
                                                id="transaction_id"
                                                name="transaction_id"
                                                value={payment.transaction_id}
                                                onChange={(e) => handlePaymentChange(payment.id, 'transaction_id', e.target.value)}
                                                className="form-control"
                                                autoComplete="off"
                                                onBlur={async() => await handleTransactionBlur(payment)}
                                            />
                                            {
                                                (transactionLoading || payment?.transaction) ? <div className="input-group-text" style={{background: '#f8f9fa'}}>
                                                    {
                                                        (transactionLoading) ? <div className="spinner-border spinner-18 text-secondary me-2" role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div> : <span className="badge bg-info">Split-{payment?.transaction?.transaction_split*1 + 1}</span>
                                                    }
                                                    
                                                </div> : null
                                            }
                                        </div>
                                        {errors.transaction_id && (
                                            <div className="d-block invalid-feedback">
                                                {errors.transaction_id.join(', ')}
                                            </div>
                                        )}
                                    </div>
                                </> : null
                            }
                            
                            <div className="mb-3">
                                <label className="form-label" htmlFor="description">
                                    Description
                                </label>
                                <textarea 
                                    id="description"
                                    name="description"
                                    value={payment.description}
                                    onChange={(e) => handlePaymentChange(payment.id, 'description', e.target.value)}
                                    className="form-control"
                                    autoComplete="off"
                                ></textarea>
                                {errors.description && (
                                    <div className="d-block invalid-feedback">
                                        {errors.description.join(', ')}
                                    </div>
                                )}
                            </div>
                            {
                                (payment?.transaction && payment?.transaction?.media) ? <div className="mb-3">
                                    <label className="form-label" htmlFor="attachment">
                                        Existing Transaction Image
                                    </label>
                                    <div className="row">
                                        {
                                            payment?.transaction?.media.map((media, index) => {
                                                return (
                                                    <div key={index} className="col-4">
                                                        <a href={media?.file_url} target="_blank" rel="noopener noreferrer">
                                                            <img src={media?.file_url} className="img-fluid" alt={`media-${index}`} />
                                                        </a>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div> : null
                            }
                            
                            <div className="mb-3">
                                <label className="form-label" htmlFor="attachment">
                                    Receipt Attachment
                                </label>
                                <input 
                                    type="file"
                                    id="attachment"
                                    name="attachment"
                                    onChange={handleFileChange}
                                    className="form-control"
                                />
                                {errors.attachment && (
                                    <div className="d-block invalid-feedback">
                                        {errors.attachment.join(', ')}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label" htmlFor="paid_at">
                                    Payment Date
                                </label>
                                <Flatpickr
                                    id="paid_at"
                                    className="form-control bg-white shadow-sm ring-1 ring-neutral-300"
                                    value={payment.paid_at}
                                    options={{
                                        enableTime: true,
                                        dateFormat: "d-M-Y H:i",
                                        time_24hr: true,
                                        defaultHour: 0,
                                        disableMobile: "true"
                                    }}
                                    onChange={([date]) => {
                                        if (date) {
                                            const paid_date = moment(date).tz('Asia/Kolkata').toISOString();
                                            handlePaymentChange(payment.id, 'paid_at', paid_date)
                                        }
                                    }}
                                />
                                {errors.paid_at && (
                                    <div className="d-block invalid-feedback">
                                        {errors.paid_at.join(', ')}
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
                            <button type="button" disabled={(saveLoading || settingsLoading)} className="btn btn-purple w-sm" onClick={handleSave}>
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
    settingsLoading: state.payment.settingsLoading,
    settings: state.payment?.settings,
    saveLoading: state.payment.saveLoading,
    transactionLoading: state.payment.transactionLoading,
    payment: state.payment.detail,
});

const mapDispatchToProps = {
    loadPaymentSettings,
    savePayment,
    handlePaymentChange,
    loadTransaction
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentForm);