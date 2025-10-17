import {
    BANK_SET_SAVE_LOADING, ADD_BANK, ADD_BANK_LIST, BANK_QUICK_SET_SAVE_LOADING
} from './action'

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
        detail: ''
    }
}

const bankReducer = (state = initialState, action) => {
    switch (action.type) {
        case BANK_QUICK_SET_SAVE_LOADING:
            const quickIndex = state.list.data.findIndex(item => item.id === action.payload.bankId);
            if (quickIndex !== -1) {
                const updatedData = [
                    ...state.list.data.slice(0, quickIndex),
                    { ...state.list.data[quickIndex], is_loading: action.payload.flag },
                    ...state.list.data.slice(quickIndex + 1),
                ];
                return {
                    ...state,
                    list: {
                        ...state.list,
                        data: updatedData,
                    },
                };
            }
            return state;
        case BANK_SET_SAVE_LOADING:
            return {
                ...state,
                saveLoading: action.payload,
            };
        case ADD_BANK:
            return {
                ...state,
                detail: action.payload
            };
        case ADD_BANK_LIST:
            return {
                ...state,
                list: action.payload,
            };
        default:
            return state;
    }
};
export default bankReducer;