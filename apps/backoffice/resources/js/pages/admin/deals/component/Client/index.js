import React, { useContext, useCallback } from 'react';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import { useParams } from 'react-router-dom';
import { saveContactLoading, addContact, detachDealContact } from '../../../../../redux';
import { SidebarContext } from '../../../../../components/Sidebar/contexts/SidebarContext';
import { customFieldLabel } from '../../../../../utils';
import { useHasPermission } from '../../../../../utils/permissions';
import { changeDealInternalReference } from '../../../../../redux/deals/action';
import { getContactReferenceList } from '../../../../../service/ContactService';
import CommonAsyncSelect from '../../../../../components/CommonAsyncSelect';

const DealClient = ({ 
    saveLoading, contactSaveLoading, custom_fields, permissions, initialized, deal,
    saveContactLoading, addContact, detachDealContact, changeDealInternalReference
}) => {
    const { toggleSidebar } = useContext(SidebarContext);
    const { dealId }        = useParams();
    
    const openContactForm = async (contact) => {
        if (contact && contact.id) {
            addContact(contact)
            toggleSidebar('deal_contact', contact.id, {dealId: dealId})
        }
    }
    const detachContact = async (dealId) => {
        saveContactLoading(true)
        await detachDealContact(dealId)
        saveContactLoading(false)
    }
    const onContactCreateButton = () => {
        toggleSidebar('deal_contact', null, {dealId: dealId})
    }


    const fetchSearchOptions = async (inputValue) => {
        if (!inputValue) {
            return [];
        }

        const response = await getContactReferenceList(deal?.contact?.id, {
            page: 1,
            per_page: 1000,
            q: inputValue
        });
    
        if(response.httpCode === 200) {
            const users = response?.data?.data;
            const options = users.map(item => ({
                value: item.id,
                label: item.name,
            }));
            return options;
        }
    
        return []
    };


    const handleSearchChange = async (selectedOption, dealId) => {
        changeDealInternalReference(dealId, selectedOption?.value ?? '-')
    };

    return (
        (useHasPermission(['view deal client'], permissions)) ? 
        <div className="card shadow-sm mb-0 mb-3">
            <div className="card-header d-flex justify-content-between align-items-center border-bottom-0">
                <h5 className="logo-txt sub-text mb-0">Client</h5>
                {
                    (!deal?.contact_id) ? 
                        (contactSaveLoading) ? 
                            <div className="d-flex align-items-center justify-content-center">
                                <div className="spinner-border text-primary m-1" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div> : 
                            (
                                (useHasPermission(['attach own client', 'attach all client', 'update own client', 'update all client'], permissions)) ? 
                                <button onClick={onContactCreateButton} className="btn btn-light text-secondary px-1 p-0">
                                    <i className="fs-5 uil-plus"></i>
                                </button> : null
                            ) : <></> 
                }
            </div>
            <div className="card-body pt-2">
                {
                    (!initialized) ? <div className="d-flex align-items-center justify-content-center">
                        <div className="spinner-border text-primary m-1" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div> : 
                    (deal?.contact && deal?.contact_id) ? <div>
                        <div className="d-flex align-items-start">
                            <div className="flex-shrink-0 avatar rounded-circle me-3">
                                <img src={deal?.contact?.profile_pic} alt="" className="img-fluid rounded-circle" />
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                                <h5 className="font-size-15 mb-1 text-truncate">
                                    <div className="text-black text-opacity-75">
                                        {deal?.contact?.name}
                                    </div>
                                </h5>
                                <span className="badge badge-soft-danger mb-0">{deal?.contact?.email}</span>
                            </div>
                            {
                                (contactSaveLoading) ? <div className="d-flex align-items-center justify-content-center">
                                    <div className="spinner-border text-primary m-1" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div> : 
                                (
                                    (useHasPermission(['attach own client', 'attach all client', 'update own client', 'update all client'], permissions) && deal?.status == 1) ? <div className="flex-shrink-0 dropdown">
                                        <button className="btn btn-light text-secondary px-2 py-1 me-2" onClick={() => openContactForm(deal?.contact)}>Edit</button>
                                        <button className="btn btn-light text-secondary px-2 py-1" onClick={() => detachContact(deal?.id)}>
                                            <i className="uil-times"></i>
                                        </button>
                                    </div> : null
                                )
                            }
                        </div>
                        <div>
                            <ul className="list-unstyled mt-4 mb-0 text-muted">
                                <li>
                                    <div className="d-flex align-items-center py-2">
                                        <div className="flex-grow-0 text-black text-opacity-75 me-2">
                                            Ref.
                                        </div>
                                        <div className="flex-grow-1">
                                            <CommonAsyncSelect
                                                value={deal?.internal_reference ? [{
                                                    value: deal.internal_reference.id,
                                                    label: deal.internal_reference.name,
                                                }] : []}
                                                placeholder="Personal Reference"
                                                isClearable={true}
                                                className="mb-2"
                                                loadOptions={fetchSearchOptions}
                                                onChange={(e) => handleSearchChange(e, deal?.id)}
                                                debounceTimeout={300}
                                                isDisabled={deal?.status != 1}
                                            />
                                        </div>
                                    </div>
                                </li>
                                
                                <li>
                                    <div className="d-flex align-items-center py-2">
                                        <div className="flex-grow-1">
                                            Mobile
                                        </div>
                                        <div className="flex-shrink-0">
                                            <div>{deal?.contact?.country_code} {deal?.contact?.mobile}</div>
                                        </div>
                                    </div>
                                </li>
                                {
                                    (deal?.contact?.custom_fields) ? deal?.contact?.custom_fields.map((field, index) => {
                                        return (
                                            <li key={index}>
                                                <div className="d-flex align-items-center py-2">
                                                    <div className="flex-grow-1">
                                                        {customFieldLabel(custom_fields, field.field_name)}
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        <div>{field.field_value ?? '-'}</div>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    }) : <></>
                                }

                            </ul>
                        </div>
                    </div>: <div>
                        <div className="text-muted">
                            There is no client associated with this deal yet. 
                            {
                                ((useHasPermission(['attach own client', 'attach all client'], permissions))) ? 
                                <div>
                                    To associate a client, please click the 
                                    <span>
                                        <button onClick={onContactCreateButton} className="btn btn-light text-secondary px-1 p-0"><i className="fs-5 uil-plus"></i></button>
                                    </span> 
                                    icon.
                                </div>: null
                            }
                        </div>
                    </div>
                }
                
            </div>
        </div> : null
    )
};

const mapStateToProps = (state) => ({
    permissions: state.common?.settings?.permissions,
    custom_fields: state.common?.settings?.custom_fields?.contact,
    initialized: state.deal?.initialized,
    saveLoading: state.deal.saveLoading,
    contactSaveLoading: state.contact.saveLoading,
    deal: state.deal.detail,
});

const mapDispatchToProps = {
    addContact,
    saveContactLoading,
    detachDealContact,
    changeDealInternalReference
};

export default connect(mapStateToProps, mapDispatchToProps)(DealClient);