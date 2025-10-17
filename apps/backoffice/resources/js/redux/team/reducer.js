import { RESET_TEAM_DETAIL, UPDATE_ACTIVE_TAB, ADD_TEAM, ADD_TEAM_LIST, TEAM_SET_SAVE_LOADING } from "./action";

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
        description: '',
        members: []
    }
}
const teamReducer = (state = initialState, action) => {
    switch (action.type) {
        case TEAM_SET_SAVE_LOADING:
            return {
                ...state,
                saveLoading: action.payload,
            };
        case UPDATE_ACTIVE_TAB:
            return {
                ...state,
                activeTab: action.payload,
            };
        case RESET_TEAM_DETAIL:
            return {
                ...state,
                detail: action.payload
            };
        case ADD_TEAM:
            return {
                ...state,
                detail: action.payload
            };
        case ADD_TEAM_LIST:
            return {
                ...state,
                list: action.payload,
            };
        default:
            return state;
    }
}
export default teamReducer;