import { 
    CONTACT_SET_SAVE_LOADING,
    ADD_CONTACT_LIST,
    ADD_CONTACT
} from './action';

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
        email: '',
        mobile: '',
        custom_fields: [],
        temp_custom_fields: []
    }
}

const contactReducer = (state = initialState, action) => {
    switch (action.type) {
        case CONTACT_SET_SAVE_LOADING:
            return {
                ...state,
                saveLoading: action.payload,
            };
        case ADD_CONTACT_LIST:
            return {
                ...state,
                list: action.payload,
            };
        case ADD_CONTACT:
            return {
                ...state,
                detail: action.payload
            };
        default:
            return state;
    }
};
export default contactReducer;