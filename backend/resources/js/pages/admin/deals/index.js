import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import FilterBar from '../../../components/FilterBar';
import DealTable from './component/DealTable';

import { 
    loadDealSettings,
    fetchDealList,
    changeDealView,
    updateDealSearchQuery,
    setBulkDealIds,



    setDealDefaultFilter,
    changeDealCondition,
    addNewDealCondition,
    removeDealCondition,
    saveDealFilterCondition,
    updateDealOptionRule,
    updateDealOptionValue
} from '../../../redux';

function ListDeal({
    settingsInitialized, settings, deal,
    loadDealSettings, fetchDealList, changeDealView, updateDealSearchQuery, setBulkDealIds,

    setDealDefaultFilter, changeDealCondition, addNewDealCondition, updateDealOptionRule, removeDealCondition, saveDealFilterCondition, updateDealOptionValue
}) {
    const history = useHistory();
    const [typingTimer, setTypingTimer]     = useState(null);
    const [selectedIds, setSelectedIds]     = useState([]);

    const doneTypingInterval                = 800;

    useEffect(async() => {
        if(!settingsInitialized) {
            const response = await loadDealSettings();
            if(response.httpCode === 200 && response?.data?.activeView === 'dealBoard') {
                history.push(`/admin/deals/board`);
            }
        }
    }, [settingsInitialized])
    
    const handleFilterBarUpdate = async(data) => {

        switch (data?.action) {
            case 'fetchList': 
                await fetchDealList(data?.queryFilter, data?.filter);
                setBulkDealIds([])
                break;

            case 'bulkDelete': 
                // await bulkDeletePayment(data?.bulkIds)
                await fetchDealList(data?.queryFilter, data?.filter)
                break;
            
            default:
                return null;
        }
    }

    const handleChangeView = async (view) => {
        const newSettings = {
            ...settings,
            activeView: view
        }
        const result = await changeDealView(newSettings);

        if(result.httpCode === 200 && result?.data?.activeView === 'dealBoard') {
            history.push(`/admin/deals/board`);
        }
    }

    const handleDealSearch = (event, condition) => {
        const input = event.target.value;
        updateDealSearchQuery(input)

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
            sortOrder: deal?.sortOrder,
            page: deal?.list?.current_page,
            per_page: deal?.list?.per_page,
        }
        await fetchDealList(queryFilter, condition);
    };


    return (
        <>
        {
            (settingsInitialized) ? <div className="container-fluid">
                <FilterBar 
                    onFilterBarUpdate={async(data) => handleFilterBarUpdate(data)} 
                    onChangeView={async(changeView) => handleChangeView(changeView)}
                    onInputSearch={(event, condition) => handleDealSearch(event, condition)}
                    view={`deals`} 
                    settings={settings} 
                    module={deal}
                    availableActions={['create', 'deal_board', 'search']}
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                    activeCondition={deal?.activeCondition}

                    setDefaultFilter ={setDealDefaultFilter}
                    changeCondition ={changeDealCondition}
                    addNewCondition ={addNewDealCondition}
                    updateOptionRule ={updateDealOptionRule}
                    removeCondition ={removeDealCondition}
                    saveFilterCondition ={saveDealFilterCondition}
                    updateOptionValue={updateDealOptionValue}
                />
                <div className="row">
                    <div className="col-md-12">
                        <DealTable />
                    </div>
                </div>
            </div> : null
        }
        </>
    )
}

const mapStateToProps = (state) => ({
    settingsInitialized: state.deal.settingsInitialized,
    settings: state.deal.settings,
    deal: state.deal
});

const mapDispatchToProps = {
    loadDealSettings,
    fetchDealList,
    changeDealView,
    updateDealSearchQuery,
    setBulkDealIds,

    setDealDefaultFilter, changeDealCondition,  addNewDealCondition,  updateDealOptionRule,  removeDealCondition, saveDealFilterCondition, updateDealOptionValue
};
  
export default connect(mapStateToProps, mapDispatchToProps)(ListDeal);