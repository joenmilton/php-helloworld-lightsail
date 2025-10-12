import { NOTIFICATION_INITIALIZED, ADD_NOTIFICATION_LIST, NOTIFICATION_LIST_LOADING } from "./action";
const initialState = {
    initialized: false,
    listLoading: false,
    list: {
        notifications: {
            total: 0,
            current_page: 1,
            per_page: 500,
            data: []
        },
        unread_count: 0
    }
}
const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case NOTIFICATION_INITIALIZED:
            return {
                ...state,
                initialized: action.payload,
            };
        case NOTIFICATION_LIST_LOADING:
            return {
                ...state,
                listLoading: action.payload,
            };
        case ADD_NOTIFICATION_LIST:
            return {
                ...state,
                list: action.payload,
            };
        default:
            return state;
    }
};
export default notificationReducer;