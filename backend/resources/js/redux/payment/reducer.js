import { 
    PAYMENT_SETTINGS_LOADING,
    ADD_PAYMENT_SETTINGS,
    PAYMENT_INITIALIZED,
    PAYMENT_SET_SAVE_LOADING,
    PAYMENT_QUICK_SET_SAVE_LOADING,
    PAYMENT_LIST_LOADING,
    ADD_PAYMENT_LIST,
    ADD_PAYMENT,
    UPDATE_PAYMENT,
    PAYMENT_SET_POPUP_MEDIA,
    UPDATE_PAYMENT_SORT_ORDER,
    BULK_PAYMENT_ACTION_LOADING,
    SET_BULK_PAYMENT_IDS,
    UPDATE_PAYMENT_SEARCH_QUERY,
    TRANSACTION_LOADING,
    ADD_PAYMENT_TRANSACTION,

    SET_PAYMENT_ACTIVE_CONDITION,
    ADD_PAYMENT_CONDITION,
    CHANGE_PAYMENT_CONDITION,
    UPDATE_PAYMENT_CONDITION_RULE,
    UPDATE_PAYMENT_CONDITION_VALUE,
    REMOVE_PAYMENT_CONDITION,
    PAYMENT_CONDITION_SET_SAVE_LOADING,
    SET_PAYMENT_DEFAULT_FILTER,
    UPDATE_PAYMENT_FILTER_LIST
} from './action';

const initialState = {
    paymentFilterSaveLoading: false,
    transactionLoading: false,
    settingsLoading: false,
    saveLoading: false,
    initialized: false,
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
    listData: {
        included: [],
        excluded: []
    },
    popupMedia: {
        payment_id: '',
        media: []
    },
    detail: {
        id: '',
        product_id: '',
        attachment: null,
        paid_amount: '0.00',
        description: '',
        transaction_type: 'bank',
        bank_id: '',
        transaction_id: '',
        paid_at: new Date().toISOString(),
        status: 0,
    },
    settingsInitialized: false,
    settings: {
        payment_screen: '',
        available_products: [],
        filters: [],
        rules: []
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

const paymentReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_PAYMENT_TRANSACTION:
            return {
                ...state,
                detail: {
                    ...state.detail,
                    transaction: action.payload
                },
            };
        case TRANSACTION_LOADING:
            return {
                ...state,
                transactionLoading: action.payload,
            };
        case SET_BULK_PAYMENT_IDS:
            return {
                ...state,
                bulkIds: action.payload 
            }
        case BULK_PAYMENT_ACTION_LOADING:
            return {
                ...state,
                bulkActionLoading: action.payload
            }
        case UPDATE_PAYMENT_SORT_ORDER:
            return {
                ...state,
                sortOrder: action.payload
            }
        case UPDATE_PAYMENT_SEARCH_QUERY:
            return {
                ...state,
                searchQuery: action.payload
            }
        case PAYMENT_SETTINGS_LOADING:
            return {
                ...state,
                settingsLoading: action.payload,
            };
        case ADD_PAYMENT_SETTINGS:
            return {
                ...state,
                settingsInitialized: true,
                settings: action.payload,
            };
        case PAYMENT_SET_SAVE_LOADING:
            return {
                ...state,
                saveLoading: action.payload,
            };
        case PAYMENT_INITIALIZED:
            return {
                ...state,
                initialized: action.payload,
            };

        case PAYMENT_SET_POPUP_MEDIA:
            if(action.payload?.screen === 'no_split') {

                const payment = state?.list?.data.find(pay => pay.id === action.payload?.paymentId)
                if(!payment) {
                    return {
                        ...state,
                        popupMedia: {
                            payment_id: '',
                            product_id: '',
                            media: []
                        }
                    }
                }

                return {
                    ...state,
                    popupMedia: {
                        ...payment,
                        product_id: '',
                    }
                }
            }

            if(action.payload?.screen === 'service_split') {

                if(action.payload?.productId !== '') {

                    const product = state.listData.included.find(product => product.product_id === action.payload?.productId)
                    if(!product || !product?.payments || product?.payments.length <= 0) {
                        return {
                            ...state,
                            popupMedia: {
                                payment_id: '',
                                product_id: '',
                                media: [],
                            }
                        }
                    }

                    const payment = product?.payments.find(pay => pay.id === action.payload?.paymentId)
                    if(!payment) {
                        return {
                            ...state,
                            popupMedia: {
                                payment_id: '',
                                product_id: '',
                                media: []
                            }
                        }
                    }

                    return {
                        ...state,
                        popupMedia: {
                            ...payment,
                            product_id: action.payload?.productId,
                        }
                    }
                }
                if(action.payload?.productId === '') {

                    const payment = state.listData.excluded.find(pay => pay.id === action.payload?.paymentId)
                    if(!payment) {
                        return {
                            ...state,
                            popupMedia: {
                                payment_id: '',
                                product_id: '',
                                media: []
                            }
                        }
                    }

                    return {
                        ...state,
                        popupMedia: {
                            ...payment,
                            product_id: action.payload?.productId,
                        }
                    }
                }
            }
            return state;

        case PAYMENT_QUICK_SET_SAVE_LOADING:
            if(action.payload?.screen === 'no_split') {
                const quickIndex = state.list.data.findIndex(item => item.id === action.payload.paymentId);
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
            }
            if(action.payload?.screen === 'service_split') {

                if(action.payload?.productId !== '') {
                    return {
                        ...state,
                        listData: {
                            ...state.listData,
                            included: state.listData.included.map(product => {
                                if (product.product_id === action.payload?.productId) {
                                    return {
                                        ...product,
                                        payments: product.payments.map(payment => {
                                            if (payment.id === action.payload?.paymentId) {
                                                return { ...payment, is_loading: action.payload.flag };
                                            }
                                            return payment;
                                        })
                                    };
                                }
                                return product;
                            })
                        }
                    }
                }
                if(action.payload?.productId === '') {
                    return {
                        ...state,
                        listData: {
                            ...state.listData,
                            excluded: state.listData.excluded.map(pay => {
                                if (pay.id === action.payload?.paymentId) {
                                    return { ...pay, is_loading: action.payload.flag };
                                }
                                return pay;
                            })
                        }
                    }
                }
            }
            return state;
        case PAYMENT_LIST_LOADING:
            return {
                ...state,
                listLoading: action.payload,
            };
        case ADD_PAYMENT_LIST:
            if(action.payload?.screen && action.payload?.screen == 'no_split') {
                return {
                    ...state,
                    initialized: true,
                    list: {
                        ...state.list,
                        ...action.payload?.data
                    }
                };
            } else if(action.payload?.screen && action.payload?.screen == 'service_split') {
                return {
                    ...state,
                    initialized: true,
                    listData: action.payload?.data
                };
            }
            return state;

        case ADD_PAYMENT:
            return {
                ...state,
                detail: action.payload
            };
        case UPDATE_PAYMENT:
            return {
                ...state,
                detail: {
                    ...state.detail,
                    ...action.payload
                }
            };






        case UPDATE_PAYMENT_FILTER_LIST:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    filters: action.payload
                }
            };

        case SET_PAYMENT_ACTIVE_CONDITION:
            return {
                ...state,
                activeCondition: action.payload
            };



        case PAYMENT_CONDITION_SET_SAVE_LOADING:
            return {
                ...state,
                paymentFilterSaveLoading: action.payload
            }
        case SET_PAYMENT_DEFAULT_FILTER:
            return {
                ...state,
                activeCondition: action.payload
            }
        case CHANGE_PAYMENT_CONDITION:
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
        case ADD_PAYMENT_CONDITION:
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
        case UPDATE_PAYMENT_CONDITION_RULE:
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
        case UPDATE_PAYMENT_CONDITION_VALUE:
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
        case REMOVE_PAYMENT_CONDITION:
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
export default paymentReducer;