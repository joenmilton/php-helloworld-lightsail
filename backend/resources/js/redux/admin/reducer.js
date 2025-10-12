import { RESET_ADMIN_DETAIL, UPDATE_ACTIVE_TAB, ADD_ADMIN, ADD_ADMIN_LIST, ADMIN_SET_SAVE_LOADING } from "./action";

const initialState = {
    activeTab: 'user',
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
        email: '',
        password:'',
        password_confirmation: '',
        is_superadmin: 0,
        role_id: false,
    }
}
const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADMIN_SET_SAVE_LOADING:
            return {
                ...state,
                saveLoading: action.payload,
            };
        case UPDATE_ACTIVE_TAB:
            return {
                ...state,
                activeTab: action.payload,
            };
        case RESET_ADMIN_DETAIL:
            return {
                ...state,
                detail: action.payload
            };
        case ADD_ADMIN:
            return {
                ...state,
                detail: action.payload
            };
        case ADD_ADMIN_LIST:
            return {
                ...state,
                list: action.payload,
            };
        default:
            return state;
    }
}
export default adminReducer;