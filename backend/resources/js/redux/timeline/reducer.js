import { 
    ADD_TIMELINE_LIST, TIMELINE_LIST_LOADING, SET_TIMELINE_LIST_FILTER
} from "./action";

const initialState = {
    saveLoading: false,
    activeForm: false,
    list: {
        filter: {
            q: '',
            model_id: '',
            fresh: false,
            page: 1,
            per_page: 50,
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
        owner_id: 1,
        description: '',
        note: '',
        completed: false,
    }
}

const timelineReducer = (state = initialState, action) => {
    switch (action.type) {
        case TIMELINE_LIST_LOADING:

            return {
                ...state,
                list: {
                    ...state.list,
                    loading: action.payload,
                },
            };

        case ADD_TIMELINE_LIST:

            return {
                ...state,
                list: {
                    ...state.list,
                    initialized: true,
                    data: (action.payload.data.length > 0) ? (action?.payload?.fresh ? 
                        action.payload.data
                    : [
                        ...state.list.data,
                        ...action.payload.data
                    ]) : [],
                    hasMore: action.payload.current_page !== action.payload.last_page && action.payload.current_page < action.payload.last_page,
                    filter: {
                        ...state.list.filter,
                        page: (action.payload.current_page !== action.payload.last_page && action.payload.current_page < action.payload.last_page) ? state.list.filter.page + 1 : state.list.filter.page,
                    },
                }
            };
        case SET_TIMELINE_LIST_FILTER:
            return {
                ...state,
                list: {
                    ...state.list,
                    filter: {
                        ...state.list.filter,
                        ...action.payload
                    },
                    hasMore: action.payload.hasMore,
                    data: []
                }
            };
        default:
            return state;
    }
}

export default timelineReducer;