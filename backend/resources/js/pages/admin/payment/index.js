import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import FilterBar from '../../../components/FilterBar';
import PaymentTable from './component/PaymentTable';
import { 
    loadPaymentSettings, 
    fetchPaymentList,
    bulkDeletePayment,
    updatePaymentSearchQuery,
    setBulkPaymentIds,

    setPaymentDefaultFilter,
    changePaymentCondition,
    addNewPaymentCondition,
    removePaymentCondition,
    savePaymentFilterCondition,
    updatePaymentOptionRule,
    updatePaymentOptionValue
} from '../../../redux';

function ListPayment({
    settingsInitialized, settings, payment, 
    loadPaymentSettings, fetchPaymentList, bulkDeletePayment, updatePaymentSearchQuery, setBulkPaymentIds,

    setPaymentDefaultFilter, changePaymentCondition, addNewPaymentCondition, removePaymentCondition, savePaymentFilterCondition, updatePaymentOptionRule, updatePaymentOptionValue
}) {
    const [typingTimer, setTypingTimer]     = useState(null);
    const doneTypingInterval                = 800;

    useEffect(async() => {
        if(!settingsInitialized) {
            const queryFilter = {}
            await loadPaymentSettings(queryFilter);
        }
    }, [settingsInitialized])

    const handleFilterBarUpdate = async(data) => {

        switch (data.action) {
            case 'fetchList': 
                await fetchPaymentList(data?.queryFilter, {...data?.filter, screen: 'no_split'})
                break;

            case 'bulkDelete': 
                await bulkDeletePayment(data?.bulkIds)
                await fetchPaymentList(data?.queryFilter, data?.filter)
                break;

            default:
                return null;
        }
    }

    const handlePaymentSearch = (event, condition) => {
        const input = event.target.value;
        updatePaymentSearchQuery(input)

        if (input.length > 0) {
            clearTimeout(typingTimer);
            const timer = setTimeout(() => doneTyping(input, condition), doneTypingInterval);
            setTypingTimer(timer);
        } else {
            doneTyping(input, condition)
            clearTimeout(typingTimer);
        }
    }

    const doneTyping = async (input, condition) => {
        const queryFilter = {
            q: input,
            sortOrder: payment?.sortOrder,
            page: payment?.list?.current_page,
            per_page: payment?.list?.per_page,
        }
        await fetchPaymentList(queryFilter, condition);
    };

    return (
        <>
        {
            (settingsInitialized) ? <div className="container-fluid">

                <FilterBar 
                    onFilterBarUpdate={async(data) => await handleFilterBarUpdate(data)}
                    onInputSearch={(event, condition) => handlePaymentSearch(event, condition)} 
                    view={`payments`} 
                    settings={settings} 
                    module={payment}
                    availableActions={['bulk_action', 'search']}
                    activeCondition={payment?.activeCondition}

                    setDefaultFilter ={setPaymentDefaultFilter}
                    changeCondition ={changePaymentCondition}
                    addNewCondition ={addNewPaymentCondition}
                    updateOptionRule ={updatePaymentOptionRule}
                    removeCondition ={removePaymentCondition}
                    saveFilterCondition ={savePaymentFilterCondition}
                    updateOptionValue={updatePaymentOptionValue}
                />
                <div className="row">
                    <div className="col-md-12">
                        <PaymentTable />
                    </div>
                </div>
            </div> : null
        }
        </>
    )
}

const mapStateToProps = (state) => ({
    settingsInitialized: state.payment.settingsInitialized,
    settings: state.payment.settings,
    payment: state.payment
});

const mapDispatchToProps = {
    loadPaymentSettings,
    fetchPaymentList,
    bulkDeletePayment,
    updatePaymentSearchQuery,
    setBulkPaymentIds,

    setPaymentDefaultFilter, changePaymentCondition, addNewPaymentCondition, removePaymentCondition, savePaymentFilterCondition, updatePaymentOptionRule, updatePaymentOptionValue
};
export default connect(mapStateToProps, mapDispatchToProps)(ListPayment);