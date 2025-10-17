import React, { useContext, useState } from 'react';
import { connect } from 'react-redux';
import { addProduct, saveProduct } from '../../../../redux';
import notificationService from '../../../../service/NotificationService';
import { customFieldValue, updateCustomFields } from '../../../../utils';
import { SidebarContext } from '../../../../components/Sidebar/contexts/SidebarContext'

import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";

const ProductForm = ({ 
    id, formType, onClose, 
    product, settings, custom_fields, saveLoading, 
    addProduct, saveProduct
}) => {
    const [errors, setError]                        = useState({});
    const { toggleSidebar } = useContext(SidebarContext);
    
    const productChange = (e) => {
        let updatedRecord = {};
        const { name, value } = e.target;

        switch (name) {
            case 'name': {
                updatedRecord = {
                    ...product,
                    name: value,
                };
                addProduct(updatedRecord);
                break;
            }
            case 'sku': {
                updatedRecord = {
                    ...product,
                    sku: value,
                };
                addProduct(updatedRecord);
                break;
            }
            case 'description': {
                updatedRecord = {
                    ...product,
                    description: value,
                };
                addProduct(updatedRecord);
                break;
            }
            case 'unit_price': {
                updatedRecord = {
                    ...product,
                    unit_price: value,
                };
                addProduct(updatedRecord);
                break;
            }
            case 'direct_cost': {
                updatedRecord = {
                    ...product,
                    direct_cost: value,
                };
                addProduct(updatedRecord);
                break;
            }
            case 'tax_rate': {
                updatedRecord = {
                    ...product,
                    tax_rate: value,
                };
                addProduct(updatedRecord);
                break;
            }
            case 'tax_label': {
                updatedRecord = {
                    ...product,
                    tax_label: value,
                };
                addProduct(updatedRecord);
                break;
            }
            case 'unit': {
                updatedRecord = {
                    ...product,
                    unit: value,
                };
                addProduct(updatedRecord);
                break;
            }

            case 'is_active': {
                updatedRecord = {
                    ...product,
                    is_active: e.target.checked,
                };
                addProduct(updatedRecord);
                break;
            }
            
            default:
                const foundCustomField = custom_fields.find(param => param.name === name);
                if (foundCustomField) {

                    const updatedCustomFields = updateCustomFields(product.temp_custom_fields, {field_name: name, field_value: value})
                    updatedRecord = {
                        ...product,
                        temp_custom_fields: updatedCustomFields,
                    };
                    addProduct(updatedRecord);
                }
                break;
        }
    };

    
    const handleSave = async (e) => {
        const response = await saveProduct(product);

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
                            (product.name) ? product.name : 'Create Service'
                        }
                    </h2>

                    <div className="row px-4">
                        <div className="col-md-12">
                            <div className="mb-3">
                                <label className="form-label" htmlFor="service_name">
                                    <span className="text-danger me-1">*</span>
                                    Service Name
                                </label>
                                <input 
                                    type="text"
                                    name="name"
                                    id="service_name"
                                    value={product.name}
                                    onChange={productChange}
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
                                <label className="form-label" htmlFor="sku">
                                    Code
                                </label>
                                <input 
                                    type="text"
                                    name="sku"
                                    id="sku"
                                    value={product.sku}
                                    onChange={productChange}
                                    className="form-control"
                                    placeholder=""
                                />
                                {errors.sku && (
                                    <div className="d-block invalid-feedback">
                                        {errors.sku.join(', ')}
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="description">
                                    Description
                                </label>
                                <textarea 
                                    type="text"
                                    name="description"
                                    id="description"
                                    value={product.description || ''}
                                    onChange={productChange}
                                    className="form-control"
                                    placeholder=""
                                ></textarea>
                                {errors.description && (
                                    <div className="d-block invalid-feedback">
                                        {errors.description.join(', ')}
                                    </div>
                                )}
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="unit_price">
                                            <span className="text-danger me-1">*</span>
                                            Unit Price
                                        </label>
                                        <input 
                                            type="text"
                                            id="unit_price"
                                            name="unit_price"
                                            value={product.unit_price}
                                            onChange={productChange}
                                            className="form-control"
                                            placeholder=""
                                        />
                                        {errors.unit_price && (
                                            <div className="d-block invalid-feedback">
                                                {errors.unit_price.join(', ')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="direct_cost">
                                            Direct Cost
                                        </label>
                                        <input 
                                            type="text"
                                            name="direct_cost"
                                            id="direct_cost"
                                            value={product.direct_cost}
                                            onChange={productChange}
                                            className="form-control"
                                            placeholder=""
                                        />
                                        {errors.direct_cost && (
                                            <div className="d-block invalid-feedback">
                                                {errors.direct_cost.join(', ')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="tax_rate">
                                            Tax Rate
                                        </label>
                                        <input 
                                            type="text"
                                            id="tax_rate"
                                            name="tax_rate"
                                            value={product.tax_rate}
                                            onChange={productChange}
                                            className="form-control"
                                            placeholder=""
                                        />
                                        {errors.tax_rate && (
                                            <div className="d-block invalid-feedback">
                                                {errors.tax_rate.join(', ')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="tax_label">
                                            Tax Label
                                        </label>
                                        <input 
                                            type="text"
                                            id="tax_label"
                                            name="tax_label"
                                            value={product.tax_label}
                                            onChange={productChange}
                                            className="form-control"
                                            placeholder=""
                                        />
                                        {errors.tax_label && (
                                            <div className="d-block invalid-feedback">
                                                {errors.tax_label.join(', ')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="unit">
                                    Unit (no, kg, lot)
                                </label>
                                <input 
                                    type="text"
                                    id="unit"
                                    name="unit"
                                    value={product.unit}
                                    onChange={productChange}
                                    className="form-control"
                                    placeholder=""
                                />
                                {errors.unit && (
                                    <div className="d-block invalid-feedback">
                                        {errors.unit.join(', ')}
                                    </div>
                                )}
                            </div>
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
                                                value={customFieldValue(product.temp_custom_fields, field.name) || ''} 
                                                onChange={productChange}
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
                            <div className="mb-2">
                                <div className="form-check form-switch form-switch-md me-2">
                                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Mark as Active</label>
                                    <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        id="flexSwitchCheckChecked"
                                        name="is_active"
                                        checked={product.is_active}
                                        onChange={productChange}
                                    />
                                </div>
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
    saveLoading: state.product.saveLoading,
    custom_fields: state.common?.settings?.custom_fields?.product,
    product: state.product.detail,
    settings: state.common.settings,
});

const mapDispatchToProps = {
    addProduct,
    saveProduct
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductForm);