import { 
    PRODUCT_SET_SAVE_LOADING,
    PRODUCT_LIST_LOADING,
    ADD_PRODUCT_LIST,
    ADD_PRODUCT,
    UPDATE_PRODUCT_SEARCH_QUERY
} from './action';

const initialState = {
    listLoading: false,
    saveLoading: false,
    searchQuery: '',
    sortOrder: '',
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
        sku: '',
        description: '',
        unit_price: '',
        direct_cost: '',
        tax_rate: 0.00,
        tax_label: 'TAX',
        unit: '',
        custom_fields: [],
        is_active: true
    }
}

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_PRODUCT_SEARCH_QUERY:
            return {
                ...state,
                searchQuery: action.payload
            }
        case PRODUCT_LIST_LOADING:
            return {
                ...state,
                listLoading: action.payload,
            };
        case PRODUCT_SET_SAVE_LOADING:
            return {
                ...state,
                saveLoading: action.payload,
            };
        case ADD_PRODUCT_LIST:
            return {
                ...state,
                list: action.payload,
            };
        case ADD_PRODUCT:
            return {
                ...state,
                detail: action.payload
            };
        default:
            return state;
    }
};
export default productReducer;