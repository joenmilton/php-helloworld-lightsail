import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
    loadPaymentSettings
} from '../../../../../../../redux';
import { SidebarContext } from '../../../../../../../components/Sidebar/contexts/SidebarContext';

const Payments = ({ 
    type, 
    settingsInitialized, settings,
    loadPaymentSettings
}) => {
    const { dealId } = useParams();
    const { toggleSidebar } = useContext(SidebarContext);

    useEffect(async() => {
        if(!settingsInitialized) {
            const queryFilter = {
                deal_id: dealId
            }
            await loadPaymentSettings(queryFilter);
        }
    }, [settingsInitialized])

    const openPaymentsForm = (dealId) => {
        toggleSidebar('payments', '', {dealId: dealId, paymentScreen: settings?.payment_screen})
    }

    return (
        <div className="card-body pt-2">
            <div className="d-flex mt-3">
                <div className="overflow-hidden me-auto">
                    <h5 className="font-size-15 text-truncate logo-txt sub-text mb-1">
                        Manage Payments
                    </h5>
                    <p className="text-muted text-truncate mb-0">Create payment and attach payment receipts.</p>
                </div>
                <div className="align-self-end ms-2">
                    <button type="button" className="btn btn-purple" onClick={() => openPaymentsForm(dealId)}><i className="mdi mdi-plus me-1"></i> Add Payment</button>
                </div>
            </div>
        </div>
    )
}
const mapStateToProps = (state) => ({
    settings: state.payment?.settings,
    settingsInitialized: state.payment.settingsInitialized
});

const mapDispatchToProps = {
    loadPaymentSettings
};

export default connect(mapStateToProps, mapDispatchToProps)(Payments);