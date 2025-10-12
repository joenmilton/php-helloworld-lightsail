
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { associateDealOwner } from '../../../../../../redux';
import { useHasPermission } from '../../../../../../utils/permissions';

function Owner({ 
    permissions, settings, deal,
    associateDealOwner 
}) {
    const { dealId }        = useParams();

    const onOwnerUpdate = async (ownerId, dealId) => {
        console.log('fxsfdfdsf')
        await associateDealOwner(ownerId, dealId)
    }

    const selectedAdmin =(settings && settings?.admins) ? settings?.admins.find(admin => admin.id === deal?.owner_id) : null;

    return (
        (useHasPermission(['change deal owner'], permissions)) ?
        <div className="btn-group dropdown">
            <h6 className="ff-primary d-flex align-items-center mb-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <div className="">{selectedAdmin ? selectedAdmin.name : ''} <i className="mdi mdi-chevron-down fs-5"></i></div>
            </h6>
            <div className="dropdown-menu">
                {    
                    (settings?.admins && settings?.admins.length > 0) ? settings?.admins.map((user, index) => {
                        return (
                            (user.id !== deal?.owner_id) ? <div key={index} onClick={() => onOwnerUpdate(user.id, dealId)} className="dropdown-item cursor-pointer px-3">
                                {user.name}
                            </div> : null
                        )
                    }) : null
                }
            </div>
        </div> : <div className="btn-group">
            <h6 className="ff-primary d-flex align-items-center mb-0">
                <div className="">{selectedAdmin ? selectedAdmin.name : ''}</div>
            </h6>
        </div>
    )
}
const mapStateToProps = (state) => ({
    permissions: state.common?.settings?.permissions,
    settings: state.common.settings,
    deal: state.deal.detail,
});

const mapDispatchToProps = {
    associateDealOwner
};
  
export default connect(mapStateToProps, mapDispatchToProps)(Owner);

