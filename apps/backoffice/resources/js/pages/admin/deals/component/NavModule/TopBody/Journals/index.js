import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
    loadJournalSettings, loadActivitySettings,
    addJournal
} from '../../../../../../../redux';
import { SidebarContext } from '../../../../../../../components/Sidebar/contexts/SidebarContext';


const Journals = ({ 
    type, journalSettingsInitialized, activitySettingsInitialized,
    loadJournalSettings, loadActivitySettings, addJournal
}) => {
    const { dealId } = useParams();
    const { toggleSidebar } = useContext(SidebarContext);

    useEffect(async() => {
        if(!journalSettingsInitialized) {
            const queryFilter = {
                deal_id: dealId
            }
            await loadJournalSettings(queryFilter);
        }
    }, [journalSettingsInitialized])

    useEffect(async() => {
        if(!activitySettingsInitialized) {
            const queryFilter = {
                skip: ['filters', 'rules']
            }
            await loadActivitySettings(queryFilter);
        }
    }, [activitySettingsInitialized])

    const onJournalsCreateButton = (dealId) => {
        const journalDetail = {
            id: '',
            journalable_id: '',
            journalable_type: 'App\\Models\\Deal',
            paper: '',
            domain_id: '',
            service_id: '',
            confirmation_date: '',
            deadline: '',
            processing: [],
            users: []
        }
        addJournal(journalDetail);

        toggleSidebar('deal_journal', null, {dealId: dealId})
    }

    return (
        <div className="card-body pt-2">
            <div className="d-flex mt-3">
                <div className="overflow-hidden me-auto">
                    <h5 className="font-size-15 text-truncate logo-txt sub-text mb-1">
                        Manage Journals
                    </h5>
                    <p className="text-muted text-truncate mb-0">You can add journal papers and control it's status.</p>
                </div>
                <div className="align-self-end ms-2">
                    <button type="button" className="btn btn-purple" onClick={() => onJournalsCreateButton(dealId)}><i className="mdi mdi-plus me-1"></i> Add Paper</button>
                </div>
            </div>
        </div>
    )
}
const mapStateToProps = (state) => ({
    journalSettingsInitialized: state.journal.settingsInitialized,
    activitySettingsInitialized: state.activity.settingsInitialized,
});

const mapDispatchToProps = {
    loadJournalSettings,
    loadActivitySettings,
    addJournal
};

export default connect(mapStateToProps, mapDispatchToProps)(Journals);