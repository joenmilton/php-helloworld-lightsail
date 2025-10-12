import { 
    JOURNAL_SETTINGS_LOADING,
    ADD_JOURNAL_SETTINGS,
    JOURNAL_SETTINGS_RESET,
    ADD_JOURNAL,
    ADD_JOURNAL_LIST,
    JOURNAL_SET_SAVE_LOADING,
    JOURNAL_LIST_LOADING,
    JOURNAL_LIST_RELOADING,
    JOURNAL_INITIALIZED,

    ADD_JOURNAL_PROCESSING,
    ADD_PROCESS_REVISION,
    ADD_PROCESS_PROOF,
    ADD_PROCESS_SHEET,
    UPDATE_JOURNAL_PROCESSING,

    UPDATE_JOURNAL_SEARCH_QUERY,
    UPDATE_JOURNAL_SORT_ORDER,



    SET_JOURNAL_ACTIVE_CONDITION,
    ADD_JOURNAL_CONDITION,
    CHANGE_JOURNAL_CONDITION,
    UPDATE_JOURNAL_CONDITION_RULE,
    UPDATE_JOURNAL_CONDITION_VALUE,
    REMOVE_JOURNAL_CONDITION,
    JOURNAL_CONDITION_SET_SAVE_LOADING,
    SET_JOURNAL_DEFAULT_FILTER,
    UPDATE_JOURNAL_FILTER_LIST
} from './action';

const initialState = {
    journalFilterSaveLoading: false,
    settingsLoading: false,
    settingsInitialized: false,
    initialized: false,
    saveLoading: false,
    listLoading: false,
    listReloading: false,
    searchQuery: '',
    sortOrder: '',
    settings: {
        journals: [],
        status: {
            process: [],
            revision: []
        }
    },
    list: {
        loading: false,
        total: 0,
        current_page: 1,
        per_page: 50,
        data: []
    },
    detail: {
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
    },
    processingDetail: {
        id: '',
        paper_id: '',
        publisher_id: '',
        journal_id: '',
        process_status: '',
        url: '',

        revised_by: '',
        activity_id: null,
        revision_date: '',
        submission_date: '',
        status: '',
        shared: false,

        enable_task_attach: false,
        fetch_as: 'new',
        extra_info: []
    },
    revisionDetail: {
        id: '',
        revision_type: 'revision',
        processing_id: '',
        revised_by: '',
        activity_id: null,
        due_date: '',
        submission_date: '',
        rejected_date: '',
        rejected_reason: '',
        status: '',

        enable_task_attach: false,
        fetch_as: 'new',
    },
    proofDetail: {
        id: '',
        processing_id: '',
        accepted_date: '',
        proof_status: '',
        copyright_status: '',
        final_status: ''
    },
    sheetDetail: {
        id: '',
        publisher_status: '',
        submission_date: '',
        due_date: '',
        extra_info: [],
        shared: false,
        current_revision: {
            id: '',
            enable_task_attach: false,
            activity_id: null,
            revised_by: null,
            fetch_as: 'new',
            tech_status: '',
            submission_date: '',
            due_date: '',
            revision_type: 'revision'
        },
        next_revision: {
            flag: false,
            enable_task_attach: false,
            activity_id: null,
            revised_by: null,
            fetch_as: 'new',
            tech_status: '',
            submission_date: '',
            due_date: '',
            revision_type: 'revision'
        }
    },
    activeCondition: {
        id: '',
        name: '',
        identifier: '',
        user_id: '',
        is_shared: false,
        is_readonly: false,
        save_filter: false,
        mark_default: false,
        rules: {
            condition: "and",
            children: []
        } 
    },
}

const journalReducer = (state = initialState, action) => {
    switch (action.type) {
        case JOURNAL_SETTINGS_RESET:
            return {
                ...state,
                settingsInitialized: action.payload,
            };
        case JOURNAL_INITIALIZED:
            return {
                ...state,
                initialized: action.payload,
            };
        case JOURNAL_LIST_LOADING:
            return {
                ...state,
                listLoading: action.payload,
            };
        case JOURNAL_LIST_RELOADING:
            return {
                ...state,
                listReloading: action.payload,
            };
        case JOURNAL_SETTINGS_LOADING:
            return {
                ...state,
                settingsLoading: action.payload,
            };
        case ADD_JOURNAL_SETTINGS:
            return {
                ...state,
                settingsInitialized: true,
                settings: action.payload,
            };
        case ADD_JOURNAL:
            return {
                ...state,
                detail: action.payload
            };
        case ADD_JOURNAL_PROCESSING:
            return {
                ...state,
                processingDetail: action.payload
            };
        case ADD_PROCESS_REVISION:
            return {
                ...state,
                revisionDetail: action.payload
            };
        case ADD_PROCESS_PROOF:
            return {
                ...state,
                proofDetail: action.payload
            };
        case ADD_PROCESS_SHEET:
            return {
                ...state,
                sheetDetail: action.payload
            };
        case JOURNAL_SET_SAVE_LOADING:
            return {
                ...state,
                saveLoading: action.payload,
            };
        case ADD_JOURNAL_LIST:
            return {
                ...state,
                list: action.payload,
            };


        case UPDATE_JOURNAL_SEARCH_QUERY:
            return {
                ...state,
                searchQuery: action.payload
            }
        case UPDATE_JOURNAL_SORT_ORDER:
            return {
                ...state,
                sortOrder: action.payload
            }

        case UPDATE_JOURNAL_PROCESSING:

            return {
                ...state,
                list: {
                    ...state.list,
                    data: state?.list?.data.map(dt => {
                        return {
                            ...dt,
                            processing: dt?.processing.map(proc => {
                                return {
                                    ...proc,
                                    is_open: (action?.payload?.id === proc?.id) ? action?.payload?.is_open : false
                                }
                            })
                        }
                    })
                }
            }










        case UPDATE_JOURNAL_FILTER_LIST:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    filters: action.payload
                }
            };

        case SET_JOURNAL_ACTIVE_CONDITION:
            return {
                ...state,
                activeCondition: action.payload
            };



        case JOURNAL_CONDITION_SET_SAVE_LOADING:
            return {
                ...state,
                journalFilterSaveLoading: action.payload
            }
        case SET_JOURNAL_DEFAULT_FILTER:
            return {
                ...state,
                activeCondition: action.payload
            }
        case CHANGE_JOURNAL_CONDITION:
            return {
                ...state,
                activeCondition: {
                    ...state.activeCondition,
                    rules: {
                        ...state.activeCondition.rules,
                        condition: action.payload
                    }
                }
            }
        case ADD_JOURNAL_CONDITION:
            return {
                ...state,
                activeCondition: {
                    ...state.activeCondition,
                    rules: {
                        ...state.activeCondition.rules,
                        children: [
                            ...state.activeCondition.rules.children,
                            action.payload
                        ]
                    }
                }
            };
        case UPDATE_JOURNAL_CONDITION_RULE:
            const updatedChildren = state.activeCondition.rules.children.map((child, idx) => 
                idx === action.payload.index ? { ...child, query: { ...child.query, ...action.payload.data } } : child
            );
            return {
                ...state,
                activeCondition: {
                    ...state.activeCondition,
                    rules: {
                        ...state.activeCondition.rules,
                        children: updatedChildren
                    }
                }
            };
        case UPDATE_JOURNAL_CONDITION_VALUE:
            const updatedValueChildren = state.activeCondition.rules.children.map((child, idx) => 
                idx === action.payload.index ? { ...child, query: { ...child.query, value: action.payload.value } } : child
            );

            return {
                ...state,
                activeCondition: {
                    ...state.activeCondition,
                    rules: {
                        ...state.activeCondition.rules,
                        children: updatedValueChildren
                    }
                }
            };
        case REMOVE_JOURNAL_CONDITION:
            const filteredChildren = state.activeCondition.rules.children.filter((_, idx) => 
                idx !== action.payload
            );
            return {
                ...state,
                activeCondition: {
                    ...state.activeCondition,
                    rules: {
                        ...state.activeCondition.rules,
                        children: filteredChildren
                    }
                }
            };





        default:
            return state;
    }
};
export default journalReducer;