import { 
    CONDITION_SET_SAVE_LOADING,
    ADD_CONDITION,
    CHANGE_CONDITION,
    UPDATE_CONDITION_RULE,
    UPDATE_CONDITION_VALUE,
    REMOVE_CONDITION,
    SET_DEFAULT_FILTER,
} from './action';

const initialState = {
    saveLoading: false,
    initialized: false,
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
    }
}

const filterReducer = (state = initialState, action) => {
    switch (action.type) {
        
        case CONDITION_SET_SAVE_LOADING:
            return {
                ...state,
                saveLoading: action.payload
            }
        case SET_DEFAULT_FILTER:
            return {
                ...state,
                activeCondition: action.payload
            }
        case CHANGE_CONDITION:
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
        case ADD_CONDITION:
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
        case UPDATE_CONDITION_RULE:
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


        case UPDATE_CONDITION_VALUE:
            console.log('heeee here')
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

        case REMOVE_CONDITION:
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
export default filterReducer;