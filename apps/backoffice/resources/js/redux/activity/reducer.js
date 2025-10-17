import { 
    ACTIVITY_SET_SAVE_LOADING, ADD_DEAL_ACTIVITY_LIST, SET_LIST_FILTER, ADD_ACTIVITY, UPDATE_ACTIVITY, ACTIVITY_FORM_FLAG, UPDATE_DUE_DATE, UPDATE_END_DATE, UPDATE_START_TIME, UPDATE_END_TIME ,
    ACTIVITY_LOADING, ACTIVITY_QUICK_SET_SAVE_LOADING, ACTIVITY_DETAIL_QUICK_SET_SAVE_LOADING, ACTIVITY_QUICK_TOGGLE, ACTIVITY_DETAIL_QUICK_TOGGLE, ACTIVITY_DETAIL_INNER_TOGGLE, ACTIVITY_INNER_TOGGLE,  
    UPDATE_ACTIVITY_LIST, ADD_SEARCH_LIST, ACTIVITY_DEAL_LIST_LOADING, ACTIVITY_LIST_LOADING,
    ACTIVITY_SETTINGS_LOADING, ADD_ACTIVITY_SETTINGS,

    ADD_ACTIVITY_LIST, UPDATE_ACTIVITY_SORT_ORDER, SET_BULK_ACTIVITY_IDS, BULK_ACTIVITY_ACTION_LOADING, UPDATE_ACTIVITY_SEARCH_QUERY,
    
    
    SET_ACTIVITY_ACTIVE_CONDITION,
    ADD_ACTIVITY_CONDITION,
    CHANGE_ACTIVITY_CONDITION,
    UPDATE_ACTIVITY_CONDITION_RULE,
    UPDATE_ACTIVITY_CONDITION_VALUE,
    REMOVE_ACTIVITY_CONDITION,
    ACTIVITY_CONDITION_SET_SAVE_LOADING,
    SET_ACTIVITY_DEFAULT_FILTER,
    UPDATE_ACTIVITY_FILTER_LIST

} from "./action";

const initialState = {
    activityFilterSaveLoading: false,
    saveLoading: false,
    activityLoading: false,
    activeForm: false,
    listLoading: false,
    searchQuery: '',
    sortOrder: '',
    bulkActionLoading: false,
    bulkIds: [],
    list: {
        loading: false,
        total: 0,
        current_page: 1,
        per_page: 25,
        data: []
    },
    scrollList: {
        filter: {
            q: '',
            model_id: '',
            page: 1,
            per_page: 200,
        },
        initialized: false,
        hasMore: false,
        data: [],
        loading: false
    },
    detail: {
        id: '',
        title: '',
        activity_type_id: '',
        due_date: new Date().toISOString(),
        end_date: new Date().toISOString(),
        start_time: '05:00',
        end_time: '23:59',
        reminder_minutes: 30,
        reminder_type: 'minutes',
        description: '',
        note: '',
        completed: false,
        users: []
    },
    updateDetail: {
        flag: false,
        id: '',
        title: '',
        activity_type_id: '',
        due_date: new Date().toISOString(),
        end_date: new Date().toISOString(),
        start_time: '05:00',
        end_time: '23:59',
        reminder_minutes: 30,
        reminder_type: 'minutes',
        description: '',
        note: '',
        completed: false,
        users: []
    },
    settingsLoading: false,
    settingsInitialized: false,
    settings: {
        activity_types: [],
        users: []
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
const activityReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTIVITY_LOADING:
            return {
                ...state,
                activityLoading: action.payload
            }
        case SET_BULK_ACTIVITY_IDS:
            return {
                ...state,
                bulkIds: action.payload 
            }
        case BULK_ACTIVITY_ACTION_LOADING:
            return {
                ...state,
                bulkActionLoading: action.payload
            }
        case UPDATE_ACTIVITY_SEARCH_QUERY:
            return {
                ...state,
                searchQuery: action.payload
            }
        case UPDATE_ACTIVITY_SORT_ORDER:
            return {
                ...state,
                sortOrder: action.payload
            }
        case ACTIVITY_SETTINGS_LOADING:
            return {
                ...state,
                settingsLoading: action.payload,
            };
        case ADD_ACTIVITY_SETTINGS:
            return {
                ...state,
                settingsInitialized: true,
                settings: action.payload,
            };

        case ACTIVITY_DEAL_LIST_LOADING:
            return {
                ...state,
                scrollList: {
                    ...state.scrollList,
                    loading: action.payload,
                },
            };

        case ACTIVITY_DETAIL_QUICK_TOGGLE:
            if(action?.payload?.key) {
                return {
                    ...state,
                    detail: {
                        ...state.detail,
                        [action.payload.key]: action.payload.flag
                    }
                }
            } else {
                return {
                    ...state,
                    detail: {
                        ...state.detail,
                        ...action.payload
                    }
                };
            }


        case ACTIVITY_QUICK_TOGGLE:
            const quickToggleIndex = state.scrollList.data.findIndex(item => item.id === action.payload.activity_id);
            
            if (quickToggleIndex !== -1) {
                const updatedData = [
                    ...state.scrollList.data.slice(0, quickToggleIndex),
                    { ...state.scrollList.data[quickToggleIndex], [action.payload.key]: action.payload.flag },
                    ...state.scrollList.data.slice(quickToggleIndex + 1),
                ];
                return {
                    ...state,
                    scrollList: {
                        ...state.scrollList,
                        data: updatedData,
                    },
                };
            }
            return state;

        case ACTIVITY_DETAIL_INNER_TOGGLE: {
            const { activity_id, key, inner_id, inner_key, flag } = action.payload;
            const updatedDetailInner = state.detail[key].map(inner =>
                inner.id === inner_id
                    ? { ...inner, [inner_key]: flag }
                    : inner
            );

            return {
                ...state,
                detail: {
                    ...state.detail,
                    [key]: updatedDetailInner 
                }
            };
        }

        case ACTIVITY_INNER_TOGGLE:

            const { activity_id, key, inner_id, inner_key, flag } = action.payload;
            const activityInnerToggleIndex = state.scrollList.data.findIndex(item => item.id === activity_id);
        
            if (activityInnerToggleIndex !== -1) {
                const updatedInner = state.scrollList.data[activityInnerToggleIndex][key].map(inner =>
                    inner.id === inner_id
                        ? { ...inner, [inner_key]: flag }
                        : inner
                );
        
                const updatedData = [
                    ...state.scrollList.data.slice(0, activityInnerToggleIndex),
                    { 
                        ...state.scrollList.data[activityInnerToggleIndex], 
                        [key]: updatedInner 
                    },
                    ...state.scrollList.data.slice(activityInnerToggleIndex + 1),
                ];
        
                return {
                    ...state,
                    scrollList: {
                        ...state.scrollList,
                        data: updatedData,
                    },
                };
            }
            return state;
            
        case ACTIVITY_DETAIL_QUICK_SET_SAVE_LOADING:
            return {
                ...state,
                detail: {
                    ...state.detail,
                    activity_loader: action.payload.type
                }
            }

        case ACTIVITY_QUICK_SET_SAVE_LOADING:
            const quickIndex = state.scrollList.data.findIndex(item => item.id === action.payload.activity_id);
            if (quickIndex !== -1) {
                const updatedData = [
                    ...state.scrollList.data.slice(0, quickIndex),
                    { ...state.scrollList.data[quickIndex], activity_loader: action.payload.type },
                    ...state.scrollList.data.slice(quickIndex + 1),
                ];
                return {
                    ...state,
                    scrollList: {
                        ...state.scrollList,
                        data: updatedData,
                    },
                };
            }
            return state;

        case ACTIVITY_SET_SAVE_LOADING:
            return {
                ...state,
                saveLoading: action.payload,
            };
        case SET_LIST_FILTER:
            return {
                ...state,
                scrollList: {
                    ...state.scrollList,
                    filter: {
                        ...state.scrollList.filter,
                        ...action.payload
                    },
                    hasMore: action.payload.hasMore,
                    data: []
                }
            };
        case UPDATE_ACTIVITY_LIST:
            const updateIndex = state.scrollList.data.findIndex(item => item.id === action.payload.id);
            let updatedData;
            if (updateIndex !== -1) {
                updatedData = [
                    ...state.scrollList.data.slice(0, updateIndex),
                    {
                        ...state.scrollList.data[updateIndex], 
                        ...action.payload
                    },
                    ...state.scrollList.data.slice(updateIndex + 1),
                ];
            } else {
                updatedData = [
                    action.payload,
                    ...state.scrollList.data,
                ];
            }
            return {
                ...state,
                scrollList: {
                    ...state.scrollList,
                    data: updatedData,
                },
            };
        case ACTIVITY_LIST_LOADING:
            return {
                ...state,
                listLoading: action.payload,
            };
        case ADD_ACTIVITY_LIST:
            return {
                ...state,
                initialized: true,
                list: {
                    ...state.list,
                    ...action.payload
                }
            };
        case ADD_DEAL_ACTIVITY_LIST:
            return {
                ...state,
                scrollList: {
                    ...state.scrollList,
                    initialized: true,
                    data: [
                        ...state.scrollList.data,
                        ...action.payload.data
                    ],
                    hasMore: action.payload.current_page !== action.payload.last_page && action.payload.current_page < action.payload.last_page,
                    filter: {
                        ...state.scrollList.filter,
                        page: (action.payload.current_page !== action.payload.last_page && action.payload.current_page < action.payload.last_page) ? state.scrollList.filter.page + 1 : state.scrollList.filter.page,
                    },
                }
            };
        case ADD_SEARCH_LIST:
            return {
                ...state,
                scrollList: {
                    ...state.scrollList,
                    initialized: true,
                    data: action.payload.data,
                    hasMore: action.payload.current_page !== action.payload.last_page && action.payload.current_page < action.payload.last_page,
                    filter: {
                        ...state.scrollList.filter,
                        page: (action.payload.current_page !== action.payload.last_page && action.payload.current_page < action.payload.last_page) ? state.scrollList.filter.page + 1 : state.scrollList.filter.page,
                    },
                }
            };
        case ADD_ACTIVITY:
            return {
                ...state,
                detail: action.payload
            };
        case UPDATE_ACTIVITY:
            return {
                ...state,
                updateDetail: action.payload
            };
        case ACTIVITY_FORM_FLAG:
            return {
                ...state,
                activeForm: action.payload
            };
        case UPDATE_DUE_DATE:
            return {
                ...state,
                detail: {
                    ...state.detail,
                    due_date: action.payload
                }
            };
        case UPDATE_END_DATE:
            return {
                ...state,
                detail: {
                    ...state.detail,
                    end_date: action.payload
                }
            };
        case UPDATE_START_TIME:
            return {
                ...state,
                detail: {
                    ...state.detail,
                    start_time: action.payload
                }
            };
        case UPDATE_END_TIME:
            return {
                ...state,
                detail: {
                    ...state.detail,
                    end_time: action.payload
                }
            };






        case UPDATE_ACTIVITY_FILTER_LIST:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    filters: action.payload
                }
            };

        case SET_ACTIVITY_ACTIVE_CONDITION:
            return {
                ...state,
                activeCondition: action.payload
            };



        case ACTIVITY_CONDITION_SET_SAVE_LOADING:
            return {
                ...state,
                activityFilterSaveLoading: action.payload
            }
        case SET_ACTIVITY_DEFAULT_FILTER:
            return {
                ...state,
                activeCondition: action.payload
            }
        case CHANGE_ACTIVITY_CONDITION:
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
        case ADD_ACTIVITY_CONDITION:
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
        case UPDATE_ACTIVITY_CONDITION_RULE:
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
        case UPDATE_ACTIVITY_CONDITION_VALUE:
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
        case REMOVE_ACTIVITY_CONDITION:
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

export default activityReducer;