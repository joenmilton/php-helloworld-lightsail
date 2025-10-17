import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { addBank, saveBank } from '../../../../redux';

const BankForm = ({ 
    id, formType, parentData, onClose,
    saveLoading, bank,
    addBank, saveBank
}) => {
    const [errors, setError]        = useState({});

    const bankChange = (e) => {
        let updatedRecord = {};
        const { name, value } = e.target;

        switch (name) {
            case 'name': {
                updatedRecord = {
                    ...bank,
                    name: value,
                };
                addBank(updatedRecord);
                break;
            }
            case 'detail': {
                updatedRecord = {
                    ...bank,
                    detail: value,
                };
                addBank(updatedRecord);
                break;
            }
            default:
                break;
        }
    };

    const handleSave = async (e) => {
        const response = await saveBank(bank);

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
                        { (bank.name) ? bank.name : 'Create Client' }
                    </h2>
                    <div className="row px-4">
                        <div className="col-md-12">
                            <div className="mb-3">
                                <label className="form-label" htmlFor="name">
                                    <span className="text-danger me-1">*</span>
                                    Bank Account Name
                                </label>
                                <input 
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={bank.name}
                                    onChange={bankChange}
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
                                <label className="form-label" htmlFor="detail">
                                    <span className="text-danger me-1">*</span>
                                    Detail (Description)
                                </label>
                                <textarea 
                                    id="detail"
                                    name="detail"
                                    type="text" 
                                    className="form-control" 
                                    value={bank?.detail}
                                    onChange={bankChange}
                                ></textarea>
                                {errors.detail && (
                                    <div className="d-block invalid-feedback">
                                        {errors.name.join(', ')}
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
    saveLoading: state.bank.saveLoading,
    bank: state.bank.detail
});

const mapDispatchToProps = {
    addBank,
    saveBank
};

export default connect(mapStateToProps, mapDispatchToProps)(BankForm);