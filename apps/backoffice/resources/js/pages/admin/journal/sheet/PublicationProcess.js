import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import FilterBar from '../../../../components/FilterBar';
import SheetTable from '../component/SheetTable';

import { 
    loadJournalSettings,
    updateJournalSearchQuery,
    fetchJournalPaperList,

    setJournalDefaultFilter,
    changeJournalCondition,
    addNewJournalCondition,
    removeJournalCondition,
    saveJournalFilterCondition,
    updateJournalOptionRule,
    updateJournalOptionValue
} from '../../../../redux';

const defaultFilter = {
    id: '',
    name: '',
    identifier: '',
    user_id: '',
    is_shared: false,
    is_readonly: false,
    rules: {
        condition: "and",
        children: []
    } 
}

function PublicationProcess ({
    settingsInitialized, settings, journal,
    loadJournalSettings, updateJournalSearchQuery, fetchJournalPaperList,

    setJournalDefaultFilter, changeJournalCondition, addNewJournalCondition, removeJournalCondition, saveJournalFilterCondition, updateJournalOptionRule, updateJournalOptionValue
}) {
    const [typingTimer, setTypingTimer]     = useState(null);
    const [selectedIds, setSelectedIds]     = useState([]);
    const doneTypingInterval                = 800;
    
    useEffect(async() => {
        if(!settingsInitialized) {
            const queryFilter = {}
            await loadJournalSettings(queryFilter);
        }
    }, [settingsInitialized])


    const handleFilterBarUpdate = async(data) => {
        switch (data?.action) {
            case 'fetchList': 
                await fetchJournalPaperList(data?.queryFilter, data?.filter);
                break;
            
            default:
                return null;
        }
    }
    const handleJournalSearch = (event, condition) => {
        const input = event.target.value;
        updateJournalSearchQuery(input)

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
            sortOrder: journal?.sortOrder,
            page: journal?.list?.current_page,
            per_page: journal?.list?.per_page,
        }
        await fetchJournalPaperList(queryFilter, condition);
    };

    return (
        <>
        {
            (settingsInitialized) ? <div className="container-fluid">
                <FilterBar 
                    onFilterBarUpdate={async(data) => handleFilterBarUpdate(data)} 
                    onInputSearch={(event, condition) => handleJournalSearch(event, condition)}
                    view={`papers`} 
                    settings={settings} 
                    module={journal}
                    availableActions={['search']}
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                    activeCondition={journal?.activeCondition}

                    setDefaultFilter ={setJournalDefaultFilter}
                    changeCondition ={changeJournalCondition}
                    addNewCondition ={addNewJournalCondition}
                    updateOptionRule ={updateJournalOptionRule}
                    removeCondition ={removeJournalCondition}
                    saveFilterCondition ={saveJournalFilterCondition}
                    updateOptionValue={updateJournalOptionValue}
                />

                <div className="row">
                    <div className="col-md-12">
                        <SheetTable />
                    </div>
                </div>


         




            </div> : null
        }
        </>
    )
}
const mapStateToProps = (state) => ({
    settingsInitialized: state.journal.settingsInitialized,
    settings: state.journal.settings,
    journal: state.journal
});

const mapDispatchToProps = {
    loadJournalSettings, 
    updateJournalSearchQuery, 
    fetchJournalPaperList,

    setJournalDefaultFilter, changeJournalCondition, addNewJournalCondition, removeJournalCondition, saveJournalFilterCondition, updateJournalOptionRule, updateJournalOptionValue
};
export default connect(mapStateToProps, mapDispatchToProps)(PublicationProcess);