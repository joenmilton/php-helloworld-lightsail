import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import FilterBar from '../../../components/FilterBar';
import ActivityTable from './component/ActivityTable';
import { 
    loadActivitySettings, 
    fetchActivityList, 
    updateActivitySearchQuery,

    setActivityDefaultFilter,
    changeActivityCondition,
    addNewActivityCondition,
    removeActivityCondition,
    saveActivityFilterCondition,
    updateActivityOptionRule,
    updateActivityOptionValue
} from '../../../redux';

function ListActivity({
    settingsInitialized, settings, activity,
    loadActivitySettings, fetchActivityList, updateActivitySearchQuery,

    setActivityDefaultFilter, changeActivityCondition, addNewActivityCondition, removeActivityCondition, saveActivityFilterCondition, updateActivityOptionRule, updateActivityOptionValue
}) {

    const [typingTimer, setTypingTimer]     = useState(null);
    const doneTypingInterval                = 800;

    useEffect(async() => {
        if(!settingsInitialized) {
            const queryFilter = {}
            await loadActivitySettings(queryFilter);
        }
    }, [settingsInitialized])


    const handleFilterBarUpdate = async(data) => {
        switch (data.action) {
            case 'fetchList': 
                await fetchActivityList(data?.queryFilter, data?.filter)
                break;

            case 'bulkDelete': 
                // await bulkDeletePayment(data?.bulkIds)
                // await fetchPaymentList(data?.queryFilter, data?.filter)
                break;

            default:
                return null;
        }
    }

    const handleActivitySearch = (event, condition) => {
        const input = event.target.value;
        updateActivitySearchQuery(input)

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
            sortOrder: activity?.sortOrder,
            page: activity?.list?.current_page,
            per_page: activity?.list?.per_page,
        }
        await fetchActivityList(queryFilter, condition);
    };

    return (
        <>
        {
            (settingsInitialized) ? <div className="container-fluid">
                <FilterBar 
                    onFilterBarUpdate={async(data) => await handleFilterBarUpdate(data)} 
                    onInputSearch={(event, condition) => handleActivitySearch(event, condition)}
                    view={`activites`} 
                    settings={settings}
                    module={activity}
                    availableActions={['bulk_action', 'search']}
                    activeCondition={activity?.activeCondition}

                    setDefaultFilter ={setActivityDefaultFilter}
                    changeCondition ={changeActivityCondition}
                    addNewCondition ={addNewActivityCondition}
                    updateOptionRule ={updateActivityOptionRule}
                    removeCondition ={removeActivityCondition}
                    saveFilterCondition ={saveActivityFilterCondition}
                    updateOptionValue={updateActivityOptionValue}
                />

                <div className="row">
                    <div className="col-md-12">
                        <ActivityTable />
                    </div>
                </div>
            </div> : null
        }
        </>
    )
}

const mapStateToProps = (state) => ({
    settingsInitialized: state.activity.settingsInitialized,
    settings: state.activity.settings,
    activity: state.activity
});

const mapDispatchToProps = {
    loadActivitySettings,
    fetchActivityList,
    updateActivitySearchQuery,

    setActivityDefaultFilter, changeActivityCondition, addNewActivityCondition, removeActivityCondition, saveActivityFilterCondition, updateActivityOptionRule, updateActivityOptionValue
};
export default connect(mapStateToProps, mapDispatchToProps)(ListActivity);