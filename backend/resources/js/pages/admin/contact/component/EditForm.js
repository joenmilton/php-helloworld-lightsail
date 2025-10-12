import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import { customFieldValue, updateCustomFields } from '../../../../utils';
import { saveContactLoading, addContact, saveContact, associateDealContact, fetchDeal } from '../../../../redux';
import { getContactList } from '../../../../service/ContactService';
import AsyncSelect from 'react-select/async';
import { useHasPermission } from '../../../../utils/permissions';

const ContactForm = ({ 
    id, formType, parentData, onClose,
    permissions, custom_fields, saveLoading, contact,
    saveContactLoading, addContact, saveContact, associateDealContact, fetchDeal
}) => {
    const [errors, setError]        = useState({});
    const [newReferences, setNewReferences] = useState([]);

    const fetchSearchOptions = async (inputValue) => {
        if (!inputValue) {
            return [];
        }
      
        const response = await getContactList({
            page: 1,
            per_page: 1000,
            q: inputValue
        });
    
        if(response.httpCode === 200) {
            const users = response?.data?.data;
            return users.map(item => ({
                value: item.id,
                label: item.name,
            }));
        }
    
        return []
    };

    const debouncedFetchOptions = useCallback(
        debounce((inputValue, callback) => {
            fetchSearchOptions(inputValue).then(callback);
        }, 500),
        []
    );

    const handleSearchChange = async (selectedOption) => {
        if(formType === 'deal_contact') {
            saveContactLoading(true)
            const result = await associateDealContact(selectedOption.value, parentData.dealId);
            saveContactLoading(false)
            onClose();
        }
    };

    const contactChange = (e) => {
        let updatedRecord = {};
        const { name, value } = e.target;

        switch (name) {
            case 'name': {
                updatedRecord = {
                    ...contact,
                    name: value,
                };
                addContact(updatedRecord);
                break;
            }
            case 'mobile': {
                updatedRecord = {
                    ...contact,
                    mobile: value,
                };
                addContact(updatedRecord);
                break;
            }
            case 'email': {
                updatedRecord = {
                    ...contact,
                    email: value,
                };
                addContact(updatedRecord);
                break;
            }
            default:
                const foundCustomField = custom_fields.find(param => param.name === name);
                if (foundCustomField) {

                    const updatedCustomFields = updateCustomFields(contact.temp_custom_fields, {field_name: name, field_value: value})
                    updatedRecord = {
                        ...contact,
                        temp_custom_fields: updatedCustomFields,
                    };
                    addContact(updatedRecord);
                }
                break;
        }
    };

    const handleReferenceChange = (index, value) => {
        const updatedReferences = [...newReferences];
        updatedReferences[index] = value;
        setNewReferences(updatedReferences);
    };

    const handleAddReference = () => {
        setNewReferences([...newReferences, '']);
    };

    const handleRemoveReference = (index) => {
        const updatedReferences = newReferences.filter((_, i) => i !== index);
        setNewReferences(updatedReferences);
    };

    const handleSave = async (e) => {
        // Prepare the contact data with new references
        const contactDataToSave = {
            ...contact,
            new_references: newReferences.filter(ref => ref.trim() !== '') // Only include non-empty references
        };

        const response = await saveContact(contactDataToSave);
        if(response.httpCode == 422) {
            setError(response.errors)
        }

        if(response.httpCode === 200) {
            onClose();
            if(formType === 'deal_contact') {
                saveContactLoading(true)
                await associateDealContact(response?.data?.id, parentData.dealId);
                saveContactLoading(false)
            }
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
                    {
                        (useHasPermission(['attach own client', 'attach all client'], permissions) && formType === 'deal_contact' && !id) ? 
                        <div className="row px-4 mt-4">
                            <div className="col-md-12">
                                <div className="mb-4 p-4 bg-light border border-1 rounded-2 border-secondary ">
                                    <label className="form-label" htmlFor="searchName">
                                        Select Client
                                    </label>
                                    <AsyncSelect
                                        id="searchName"
                                        className="mb-2"
                                        cacheOptions
                                        loadOptions={debouncedFetchOptions}
                                        defaultOptions
                                        onChange={handleSearchChange}
                                    />
                                    <span className="text-muted">Use this field to find and associate exisiting contact instead of creating new one.</span>
                                </div> 
                                <h5 className="text-center">OR</h5>
                            </div>
                        </div> : <></>
                    }
                    {
                        (useHasPermission(['update own client', 'update all client'], permissions)) ? <>
                            <h2 className="sub-head mb-3 px-4">
                                { (contact.name) ? contact.name : 'Create Client' }
                            </h2>
                            <div className="row px-4">
                                <div className="col-md-12">
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="client_name">
                                            <span className="text-danger me-1">*</span>
                                            Client Name
                                        </label>
                                        <input 
                                            id="client_name"
                                            type="text"
                                            name="name"
                                            value={contact.name}
                                            onChange={contactChange}
                                            className="form-control"
                                            autoComplete="off"
                                        />
                                        {errors.name && (
                                            <div className="d-block invalid-feedback">
                                                {errors.name.join(', ')}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="mobile">
                                            <span className="text-danger me-1">*</span>
                                            Mobile
                                        </label>
                                        <input 
                                            type="text"
                                            name="mobile"
                                            id="mobile"
                                            value={contact.mobile}
                                            onChange={contactChange}
                                            className="form-control"
                                            autoComplete="off"
                                        />
                                        {errors.mobile && (
                                            <div className="d-block invalid-feedback">
                                                {errors.mobile.join(', ')}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="email">
                                            <span className="text-danger me-1">*</span>
                                            Email
                                        </label>
                                        <input 
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={contact.email}
                                            onChange={contactChange}
                                            className="form-control"
                                            autoComplete="off"
                                        />
                                        {errors.email && (
                                            <div className="d-block invalid-feedback">
                                                {errors.email.join(', ')}
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
                                                        value={customFieldValue(contact.temp_custom_fields, field.name) || ''} 
                                                        onChange={contactChange}
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

                                    <div className="mb-3">
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Internal Reference</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    (contact.internal_references && contact.internal_references.length > 0) ? contact.internal_references.map((reference, index) => {
                                                        return (
                                                            <tr key={`existing-${index}`}>
                                                                <td>{index + 1}</td>
                                                                <td>{reference.name}</td>
                                                            </tr>
                                                        )
                                                    }) : null
                                                }
                                                {
                                                    newReferences.map((reference, index) => (
                                                        <tr key={`new-${index}`}>
                                                            <td>{(contact.internal_references ? contact.internal_references.length : 0) + index + 1}</td>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <input 
                                                                        type="text"
                                                                        className="form-control me-2"
                                                                        value={reference}
                                                                        onChange={(e) => handleReferenceChange(index, e.target.value)}
                                                                        placeholder="Enter internal reference"
                                                                    />
                                                                    <button 
                                                                        type="button" 
                                                                        className="btn btn-sm btn-outline-danger"
                                                                        onClick={() => handleRemoveReference(index)}
                                                                        title="Remove reference"
                                                                    >
                                                                        <i className="mdi mdi-close"></i>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                                {
                                                    (!contact.internal_references || contact.internal_references.length === 0) && newReferences.length === 0 && (
                                                        <tr>
                                                            <td colSpan={2} className="text-center">No internal reference found</td>
                                                        </tr>
                                                    )
                                                }
                                            </tbody>
                                        </table>
                                        <button className="btn btn-primary" onClick={handleAddReference}>
                                            <i className="mdi mdi-plus"></i>
                                            Add Reference
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </> : null
                    }
                </div>
                {
                    (useHasPermission(['update own client', 'update all client'], permissions)) ? <div>
                        <div className="px-4 py-2 sidebar-footer border-top-custom">
                            <div className="d-flex align-items-start"> 
                                <button type="button" className="btn w-sm ms-auto me-2" onClick={() => { onClose();}}>Cancel</button>
                                <button type="button" disabled={saveLoading} className="btn btn-purple w-sm" onClick={async() => await handleSave(contact)}>
                                    {saveLoading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div> : null
                }
            </div>
        </>
    );
};

const mapStateToProps = (state) => ({
    permissions: state.common?.settings?.permissions,
    custom_fields: state.common?.settings?.custom_fields?.contact,
    saveLoading: state.contact.saveLoading,
    contact: state.contact.detail
});

const mapDispatchToProps = {
    addContact,
    saveContact,
    saveContactLoading,
    associateDealContact,
    fetchDeal
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactForm);