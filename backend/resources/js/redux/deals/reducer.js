import { DEAL_SET_SAVE_LOADING } from "../common/action";

import { 
    BILL_INITIALIZED,
    DEAL_LIST_LOADING,
    ADD_DEAL_LIST,
    ADD_DEAL,
    UPDATE_DEAL,
    UPDATE_EXPECTED_CLOSE_DATE,
    PROCESSING_STAGE,
    DEAL_ACTION_SAVE_LOADING,

    CLEAR_CLONE,
    AVAILABLE_CLONE_PIPELINES,
    AVAILABLE_CLONE_USERS,
    CLONE_PIPELINES_LOADING,
    CLONE_USERS_LOADING,
    CLONE_ACTION_SAVE_LOADING,

    DEAL_SETTINGS_LOADING,
    ADD_DEAL_SETTINGS,
    UPDATE_DEAL_SEARCH_QUERY,
    UPDATE_DEAL_SORT_ORDER,
    BULK_DEAL_ACTION_LOADING,
    SET_BULK_DEAL_IDS,



    SET_DEAL_ACTIVE_CONDITION,
    ADD_DEAL_CONDITION,
    CHANGE_DEAL_CONDITION,
    UPDATE_DEAL_CONDITION_RULE,
    UPDATE_DEAL_CONDITION_VALUE,
    REMOVE_DEAL_CONDITION,
    DEAL_CONDITION_SET_SAVE_LOADING,
    SET_DEAL_DEFAULT_FILTER,
    UPDATE_DEAL_FILTER_LIST,
} from './action';

const initialState = {
    dealFilterSaveLoading: false,
    settingsLoading: true,
    actionLoading: false,
    saveLoading: false,
    initialized: false,
    processingStage: false,
    listLoading: false,
    searchQuery: '',
    sortOrder: '',
    clone: {
        saveLoading: false,
        pipelineListLoading: false,
        pipelineList: [],
        userListLoading: false,
        userList: []
    },
    list: {
        total: 0,
        current_page: 1,
        per_page: 25,
        data: []
    },
    detail: {
        id: '',
        name: '',
        pipeline_id: '',
        stage_id: '',
        owner_id: '',
        amount: 0.00,
        paid_amount: 0.00,
        expected_close_date: new Date().toISOString(),
        custom_fields: [],
        temp_custom_fields: [],
        users: []
    },
    settingsInitialized: false,
    settings: {
        activeLoader: '',
        activeView: '',
        pipelines: [],
        activePipeline: '',
        filters: [],
        rules: []
    },
    bulkActionLoading: false,
    bulkIds: [],
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

const dealReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_BULK_DEAL_IDS:
            return {
                ...state,
                bulkIds: action.payload 
            }
        case BULK_DEAL_ACTION_LOADING:
            return {
                ...state,
                bulkActionLoading: action.payload
            }
        case UPDATE_DEAL_SORT_ORDER:
            return {
                ...state,
                sortOrder: action.payload
            }
        case UPDATE_DEAL_SEARCH_QUERY:
            return {
                ...state,
                searchQuery: action.payload
            }
        case CLEAR_CLONE:
            return {
                ...state,
                clone: {
                    ...state.clone,
                    pipelineList: [],
                    userList: []
                }
            }
        case AVAILABLE_CLONE_PIPELINES:
            return {
                ...state,
                clone: {
                    ...state.clone,
                    pipelineList: action.payload,
                    userList: []
                }
            }
        case AVAILABLE_CLONE_USERS:
            return {
                ...state,
                clone: {
                    ...state.clone,
                    userList: action.payload
                }
            }
        case CLONE_PIPELINES_LOADING:
            return {
                ...state,
                clone: {
                    ...state.clone,
                    pipelineListLoading: action.payload
                }
            }
        case CLONE_USERS_LOADING:
            return {
                ...state,
                clone: {
                    ...state.clone,
                    userListLoading: action.payload
                }
            }
        case CLONE_ACTION_SAVE_LOADING:
            return {
                ...state,
                clone: {
                    ...state.clone,
                    saveLoading: action.payload
                }
            }
            




        case BILL_INITIALIZED:
            return {
                ...state,
                initialized: action.payload,
                clone: (!action.payload) ? {
                    pipelineListLoading: false,
                    pipelineList: [],
                    userListLoading: false,
                    userList: []
                } : state.clone,
                detail: (!action.payload) ? {
                    id: '',
                    name: '',
                    pipeline_id: '',
                    stage_id: '',
                    amount: 0.00,
                    paid_amount: 0.00,
                    expected_close_date: new Date().toISOString(),
                    custom_fields: [],
                    temp_custom_fields: []
                } : state.detail
            };
        case DEAL_ACTION_SAVE_LOADING:
            return {
                ...state,
                actionLoading: action.payload,
            };
        case DEAL_SET_SAVE_LOADING:
            return {
                ...state,
                saveLoading: action.payload,
            };

        case DEAL_LIST_LOADING:
            return {
                ...state,
                listLoading: action.payload,
            };
        case ADD_DEAL_LIST:
            return {
                ...state,
                list: action.payload,
            };
        case ADD_DEAL:
            return {
                ...state,
                detail: action.payload
            };
        case UPDATE_DEAL:
            return {
                ...state,
                detail: {
                    ...state.detail,
                    ...action.payload
                }
            };

        case UPDATE_EXPECTED_CLOSE_DATE:
            return {
                ...state,
                detail: {
                    ...state.detail,
                    expected_close_date: action.payload
                }
            };
        case PROCESSING_STAGE:
            return {
                ...state,
                processingStage: action.payload,
            };




        case DEAL_SETTINGS_LOADING:
            return {
                ...state,
                settingsLoading: action.payload,
            };
        case ADD_DEAL_SETTINGS:
            return {
                ...state,
                settingsInitialized: true,
                settings: action.payload,
            };






        case UPDATE_DEAL_FILTER_LIST:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    filters: action.payload
                }
            };

        case SET_DEAL_ACTIVE_CONDITION:
            return {
                ...state,
                activeCondition: action.payload
            };



        case DEAL_CONDITION_SET_SAVE_LOADING:
            return {
                ...state,
                dealFilterSaveLoading: action.payload
            }
        case SET_DEAL_DEFAULT_FILTER:
            return {
                ...state,
                activeCondition: action.payload
            }
        case CHANGE_DEAL_CONDITION:
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
        case ADD_DEAL_CONDITION:
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
        case UPDATE_DEAL_CONDITION_RULE:
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
        case UPDATE_DEAL_CONDITION_VALUE:
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
        case REMOVE_DEAL_CONDITION:
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
export default dealReducer;