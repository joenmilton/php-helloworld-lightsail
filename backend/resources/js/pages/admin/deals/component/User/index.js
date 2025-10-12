import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { handleDealChange, changeDealSharedUsers } from '../../../../../redux';
import { customFieldLabel } from '../../../../../utils';
import { useHasPermission } from '../../../../../utils/permissions';
import Select from 'react-select';

const DealUser = ({ 
    permissions, settings, initialized, saveLoading, deal,
    handleDealChange, changeDealSharedUsers
}) => {
    const { dealId }                            = useParams();
    const [isUserEditing, setIsUserEditing]     = useState(false);
    const [errors, setError]                    = useState({});

    const assignedUserOption = (users, ownerId) => {
        if(!users || users.length <= 0) {
            return null;
        }

        const formatedList = users.map(user => {
            return {
                label: user.name,
                value: user.id,
            }
        })

        return formatedList.filter(user => {
            return ownerId !== user.value
        })
    }

    const handleAssignedUserChange = (data, users) => {

        const dataValues = data.map(item => item.value);
        const selectedUsers = users.filter(user => dataValues.includes(user.id));
        
        handleDealChange('users', selectedUsers);
    }

    const assignedUserValue = (users, ownerId) => {
        if(!users || users.length <= 0) {
            return []
        }

        const formatedList = users.map(user => {
            return {
                label: user.name,
                value: user.id,
            }
        })

        return formatedList.filter(user => {
            return ownerId !== user.value
        })
    }

    const changeSharedUsers = async(users) => {
        const updatedUsers = (users && users.length > 0) ? users.map(user => {
            return {
                id: user.id,
                name: user.name
            }
        }) : [];
        await changeDealSharedUsers(dealId, updatedUsers);

        setIsUserEditing(false)
    }

    return (
        (useHasPermission(['view deal journals', 'view all journals'], permissions)) ? 
        <div className="card shadow-sm mb-0 mb-3">
            <div className="card-header d-flex justify-content-between align-items-center border-bottom-0">
                <h5 className="logo-txt sub-text mb-0">Deal Shared With</h5>
            </div>
            <div className="card-body pt-2">
                {
                    (!isUserEditing) ? <div className="d-flex justify-content-between align-items-center border-bottom-0">
                        <div className="avatar-group">
                            {
                                (deal?.users && deal.users.length > 0) ? deal?.users.map((user, index) =>  {
                                    return (
                                        <span key={index} className="badge badge-soft-primary me-2 mb-2">{user?.name}</span>
                                    )
                                }) : null
                            }
                        </div>
                        <div>
                            <div className="avatar mx-auto cursor-pointer" onClick={() => setIsUserEditing(true)}>
                                <span className="avatar-title bg-primary-subtle rounded-circle">
                                    <i className="fas fa-user-edit font-size-16 text-primary"></i>
                                </span>
                            </div>
                        </div>
                    </div> : 
                    <div className="mb-3">
                        <label className="form-label">
                            Select Users
                        </label>
                        <div className="d-flex justify-content-between align-items-center border-bottom-0">
                            <Select
                                id="shared_with"
                                isMulti
                                classNamePrefix="shared_with-select"
                                placeholder={"Select User...."}
                                closeMenuOnSelect={true}
                                menuPlacement="top"
                                value={assignedUserValue(deal?.users, deal?.owner_id) || []}
                                options={assignedUserOption(settings?.deal_users, deal?.owner_id)}
                                onChange={(values) => handleAssignedUserChange(values, settings?.deal_users)}
                                styles={{
                                    container: (provided) => ({
                                        ...provided,
                                        flexGrow: 1,
                                        marginRight: '10px'
                                    }),
                                }}
                            />
                            <button className="btn btn-primary align-top align-top-button" onClick={() => changeSharedUsers(deal?.users)}>Update</button>
                        </div>
                        {errors.users && (
                            <div className="d-block invalid-feedback">
                                {errors.users.join(', ')}
                            </div>
                        )}
                    </div>
                }
            </div>
        </div> : <>Not assigned</>
    )
};

const mapStateToProps = (state) => ({
    permissions: state.common?.settings?.permissions,
    initialized: state.deal?.initialized,
    saveLoading: state.deal.saveLoading,
    settings: state.deal.settings,
    deal: state.deal.detail,
});

const mapDispatchToProps = {
    handleDealChange,
    changeDealSharedUsers
};

export default connect(mapStateToProps, mapDispatchToProps)(DealUser);