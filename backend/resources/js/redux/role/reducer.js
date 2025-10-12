import { RESET_ROLE_DETAIL, ADD_ROLE, ADD_ROLE_LIST, ROLE_SET_SAVE_LOADING, ADD_PERMISSION_GROUP, UPDATE_INITIAL_PERMISSION } from "./action";

const initialState = {
    saveLoading: false,
    list: {
        loading: false,
        total: 0,
        current_page: 1,
        per_page: 25,
        data: []
    },
    detail: {
        id: '',
        name: '',
        permissions: []
    },
    permission_group: {},
    initial_permission:[]
}
const roleReducer = (state = initialState, action) => {
    switch (action.type) {
        
        case UPDATE_INITIAL_PERMISSION:
            return {
                ...state,
                initial_permission: action.payload,
            };
        case ROLE_SET_SAVE_LOADING:
            return {
                ...state,
                saveLoading: action.payload,
            };
        case RESET_ROLE_DETAIL:
            return {
                ...state,
                detail: action.payload
            };
        case ADD_ROLE:
            return {
                ...state,
                detail: action.payload
            };
        case ADD_ROLE_LIST:
            return {
                ...state,
                list: action.payload,
            };
        case ADD_PERMISSION_GROUP:
            return {
                ...state,
                permission_group: action.payload,
            };
        default:
            return state;
    }
}
export default roleReducer;