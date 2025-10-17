import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { useHasPermission } from '../../../../../utils/permissions';

const DealBranch = ({ 
    permissions, initialized, deal
}) => {
    return (
        (useHasPermission(['view deal associates'], permissions)) ?
        <div className="card shadow-sm mb-3">
            <div className="card-header d-flex justify-content-between align-items-center border-bottom-0">
                <h5 className="logo-txt sub-text mb-0">Departments</h5>
            </div>
            <div className="card-body pt-2">
            {
                (!initialized) ? <div className="d-flex align-items-center justify-content-center">
                    <div className="spinner-border text-primary m-1" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div> : 
                <div>
                {
                    (deal?.child_deals?.length > 0 || (deal?.parent_deal && deal?.parent_deal?.pipeline && deal?.parent_deal?.owner) ) ? (
                        <>
                        {deal?.child_deals?.length > 0 && deal.child_deals.map((child, index) => (
                            <div key={index} className="col-span-12">
                                <div className="group position-relative px-2 py-1 hover:bg-neutral-50" style={{ lineHeight: '24px' }}>
                                    <div className="d-grid grid-cols-3 gap-4">
                                        <div className="col-span-1 w-100 justify-self-end truncate text-end text-neutral-500 hover:max-w-none hover:overflow-visible hover:whitespace-normal">
                                            {child?.pipeline?.name || '-'}
                                        </div>
                                        <div className="col-span-2 w-100 justify-self-end truncate text-neutral-500 hover:max-w-none hover:overflow-visible hover:whitespace-normal">
                                            {child?.owner?.name || '-'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {(deal?.parent_deal && deal?.parent_deal?.pipeline && deal?.parent_deal?.owner) && (
                            <div className="col-span-12">
                                <div className="group position-relative px-2 py-1 hover:bg-neutral-50" style={{ lineHeight: '24px' }}>
                                    <div className="d-grid grid-cols-3 gap-4">
                                        <div className="col-span-1 w-100 justify-self-end truncate text-end text-neutral-500 hover:max-w-none hover:overflow-visible hover:whitespace-normal">
                                            {deal?.parent_deal?.pipeline?.name || '-'}
                                        </div>
                                        <div className="col-span-2 w-100 justify-self-end truncate text-neutral-500 hover:max-w-none hover:overflow-visible hover:whitespace-normal">
                                            {deal?.parent_deal?.owner?.name || '-'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {deal?.parent_deal && 
                            deal?.parent_deal?.child_deals && 
                            deal?.parent_deal?.child_deals.length > 0 &&
                            deal?.parent_deal?.child_deals
                                .filter((child) => child.id !== deal.id) // Filter out children that match deal.id
                                .map((child, index) => (
                        <div key={index} className="col-span-12">
                            <div className="group position-relative px-2 py-1 hover:bg-neutral-50" style={{ lineHeight: '24px' }}>
                                <div className="d-grid grid-cols-3 gap-4">
                                    <div className="col-span-1 w-100 justify-self-end truncate text-end text-neutral-500 hover:max-w-none hover:overflow-visible hover:whitespace-normal">
                                        {child?.pipeline?.name || '-'}
                                    </div>
                                    <div className="col-span-2 w-100 justify-self-end truncate text-neutral-500 hover:max-w-none hover:overflow-visible hover:whitespace-normal">
                                        {child?.owner?.name || '-'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                        </>
                    ) : (
                        <div>Deal not assigned to other departments</div>
                    )
                }
                </div>
            }
            </div>
        </div> : null
    )
};

const mapStateToProps = (state) => ({
    permissions: state.common?.settings?.permissions,
    initialized: state.deal?.initialized,
    deal: state.deal.detail,
});

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(DealBranch);