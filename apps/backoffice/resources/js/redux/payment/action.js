
import { 
    getPaymentSettings, 
    getPayment, 
    getPaymentList, 
    createPayment, 
    updatePayment, 
    updatePaymentStatus, 
    deletePayment,
    getTransaction
} from "../../service/PaymentService";
import { getDealPaymentList } from "../../service/DealService";
import notificationService from "../../service/NotificationService";

export const SET_PAYMENT_ACTIVE_CONDITION   = 'SET_PAYMENT_ACTIVE_CONDITION';

export const PAYMENT_SETTINGS_LOADING       = 'PAYMENT_SETTINGS_LOADING';
export const ADD_PAYMENT_SETTINGS           = 'ADD_PAYMENT_SETTINGS';
export const PAYMENT_INITIALIZED            = 'PAYMENT_INITIALIZED';
export const PAYMENT_SET_SAVE_LOADING       = 'PAYMENT_SET_SAVE_LOADING';
export const PAYMENT_QUICK_SET_SAVE_LOADING = 'PAYMENT_QUICK_SET_SAVE_LOADING';
export const ADD_PAYMENT_LIST               = 'ADD_PAYMENT_LIST';
export const PAYMENT_LIST_LOADING           = 'PAYMENT_LIST_LOADING';
export const ADD_PAYMENT                    = 'ADD_PAYMENT';
export const UPDATE_PAYMENT                 = 'UPDATE_PAYMENT';
export const PAYMENT_SET_POPUP_MEDIA        = 'PAYMENT_SET_POPUP_MEDIA';
export const UPDATE_PAYMENT_SORT_ORDER      = 'UPDATE_PAYMENT_SORT_ORDER';
export const BULK_PAYMENT_ACTION_LOADING    = 'BULK_PAYMENT_ACTION_LOADING';
export const SET_BULK_PAYMENT_IDS           = 'SET_BULK_PAYMENT_IDS';
export const TRANSACTION_LOADING            = 'TRANSACTION_LOADING';
export const ADD_PAYMENT_TRANSACTION        = 'ADD_PAYMENT_TRANSACTION';
export const UPDATE_PAYMENT_SEARCH_QUERY    = 'UPDATE_PAYMENT_SEARCH_QUERY';

export const updatePaymentSearchQuery = (value) => ({
    type: UPDATE_PAYMENT_SEARCH_QUERY,
    payload: value,
});

export const loadTransaction = (transactionId) => {
    return async (dispatch) => {
        try {
            dispatch({ type: TRANSACTION_LOADING, payload: true });

            const response = await getTransaction(transactionId);
            if (response.httpCode === 200) {
                dispatch(addPaymentTransaction(response?.data));
            }
            dispatch({ type: TRANSACTION_LOADING, payload: false });
        } catch(error) {
            console.log('Getting transaction error!')
            dispatch({ type: TRANSACTION_LOADING, payload: false });
        }
    }
}

export const addPaymentTransaction = (data) => ({
    type: ADD_PAYMENT_TRANSACTION,
    payload: data,
});


export const setActivePaymentMedia = (paymentId, screen = '', productId = '') => {
    return async (dispatch) => {
        try {
            dispatch({ type: PAYMENT_SET_POPUP_MEDIA, payload: {paymentId: paymentId, flag: true, screen: screen, productId: productId} });
        } catch(error) {
            console.log(error)
        }
    }
}

export const updatePaymentSortOrder = (value) => ({
    type: UPDATE_PAYMENT_SORT_ORDER,
    payload: value,
});

export const loadPaymentSettings = (queryParams) => {
    return async (dispatch) => {
        try {
            dispatch({ type: PAYMENT_SETTINGS_LOADING, payload: true });

            const response = await getPaymentSettings(queryParams);
            if (response.httpCode === 200) {
                const settings = response.data;

                const activeFilter = settings.filters.find(filter => filter.mark_default === true)
                if(activeFilter) {
                    dispatch(setPaymentDefaultFilter(activeFilter));
                    dispatch({ type: SET_PAYMENT_ACTIVE_CONDITION, payload: activeFilter })
                }

                dispatch(addPaymentSettings(settings));
            }

            dispatch({ type: PAYMENT_SETTINGS_LOADING, payload: false });
        } catch (error) {
            dispatch({ type: PAYMENT_SETTINGS_LOADING, payload: false });
        }
    }
}

export const addPaymentSettings = (settings) => ({
    type: ADD_PAYMENT_SETTINGS,
    payload: settings,
});

export const changePaymentStatus = (paymentId, status) => {
    return async (dispatch) => {
        try {
            dispatch({ type: PAYMENT_QUICK_SET_SAVE_LOADING, payload: {screen: 'no_split', paymentId: paymentId, flag: true} });
            const response = await updatePaymentStatus(paymentId, status);
            if (response.httpCode === 200) {
                const list = response?.data;

                dispatch({ type: PAYMENT_QUICK_SET_SAVE_LOADING, payload: {screen: 'no_split', paymentId: paymentId, flag: false} });
                notificationService.success('Payment status updated!');
                return true;
            }

            dispatch({ type: PAYMENT_QUICK_SET_SAVE_LOADING, payload: {screen: 'no_split', paymentId: paymentId, flag: false} });
            notificationService.error('Payment updated failed!');
            return false;
        } catch (error) {
            console.error("Failed to fetch payment:", error);
            dispatch({ type: PAYMENT_QUICK_SET_SAVE_LOADING, payload: {screen: 'no_split', paymentId: paymentId, flag: false} });
            notificationService.error('Payment updated failed!');
            return false;
        }
    };
};

export const fetchDealPaymentList = (params, screen) => {
    return async (dispatch) => {
        try {
            dispatch({type: PAYMENT_INITIALIZED, payload: false})
            const response = await getDealPaymentList(params);
            if (response.httpCode === 200) {
                const list = response.data;
                dispatch(addPaymentList({data: list, screen: screen}));
            }
            dispatch({type: PAYMENT_INITIALIZED, payload: true})
        } catch (error) {
            console.error("Failed to fetch payment:", error);
            dispatch({type: PAYMENT_INITIALIZED, payload: true})
            return null;
        }
    };
}

export const fetchPaymentList = (params, condition) => {
    return async (dispatch) => {
        try {
            dispatch({ type: PAYMENT_LIST_LOADING, payload: true });
            const response = await getPaymentList(params, condition);
            if (response.httpCode === 200) {
                const list = response.data;
                dispatch({ type: SET_BULK_PAYMENT_IDS, payload: [] });
                dispatch(addPaymentList({data: list, screen: 'no_split'}));
            }
            dispatch({ type: PAYMENT_LIST_LOADING, payload: false });
        } catch (error) {
            dispatch({ type: PAYMENT_LIST_LOADING, payload: false });
            console.error("Failed to fetch payment:", error);
        }
    };
};

export const fetchPayment = (id) => {
    return async (dispatch) => {
        try {
            const response = await getPayment(id);
            if (response.httpCode === 200) {
                const payment = response.data;
                dispatch(addPayment(payment));
            }
        } catch (error) {
            console.error("Failed to fetch payment:", error);
        }
    };
};

export const savePaymentAttachment = (payment, file, screen = '', fetch = true) => {
    return async (dispatch) => {
        try {
            dispatch({ type: PAYMENT_SET_SAVE_LOADING, payload: true });

            const formData = new FormData();
            formData.append('payment_id', payment.id);
            formData.append('_method', 'put');

            if(file) {
                formData.append('attachment', file);
            }
            const response = await updatePayment(payment.id, formData);
            if (response.httpCode === 200) {

                if(fetch) {
                    dispatch(addPaymentList({data: response.data, screen: screen}));
                }
                
                dispatch({ type: PAYMENT_SET_SAVE_LOADING, payload: false });
                notificationService.success('Payment updated!');
                return response;
            }

            dispatch({ type: PAYMENT_SET_SAVE_LOADING, payload: false });
            return response;
        } catch (error) {
            dispatch({ type: PAYMENT_SET_SAVE_LOADING, payload: false });
            console.error("Failed to save attachment:", error);
            return false;
        }
    };
};

export const savePayment = (dealId, payment, screen = '') => {
    return async (dispatch) => {
        try {
            dispatch({ type: PAYMENT_SET_SAVE_LOADING, payload: true });

            const formData = new FormData();
            if(payment.attachment) {
                formData.append('attachment', payment.attachment);
            }
            formData.append('description', payment.description);
            formData.append('deal_id', dealId);
            formData.append('paid_amount', payment.paid_amount);
            formData.append('paid_at', payment.paid_at);
            formData.append('product_id', payment.product_id);
            formData.append('transaction_type', payment.transaction_type);
            formData.append('bank_id', payment.bank_id);
            formData.append('transaction_id', payment.transaction_id);
            if(payment?.transaction && payment?.transaction?.media && payment?.transaction?.media.length > 0) {
                payment?.transaction?.media.map((media, index) => {
                    formData.append('existing_media['+index+']', media.id); 
                })
            }

            const response = await createPayment(formData);
            if (response.httpCode === 200) {
                dispatch(addPaymentList({data: response.data, screen: screen}));
                const restDetail = {
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
                }
                dispatch(addPayment(restDetail));
                dispatch({ type: PAYMENT_SET_SAVE_LOADING, payload: false });

                notificationService.success('Payments added!');
                return response;
            }

            dispatch({ type: PAYMENT_SET_SAVE_LOADING, payload: false });
            return response;
        } catch (error) {
            console.error("Failed to save payment:", error);
            return false;
        }
    };
};

export const handlePaymentChange = (id, field, value) => {
    return (dispatch) => {
        dispatch({
            type: UPDATE_PAYMENT,
            payload: { id, [field]: value }
        });
    }
};



export const savePaymentLoading = (flag) => ({
    type: PAYMENT_SET_SAVE_LOADING,
    payload: flag
});

export const addPaymentList = (payment) => ({
    type: ADD_PAYMENT_LIST,
    payload: payment
});

export const addPayment = (payment) => ({
    type: ADD_PAYMENT,
    payload: payment
});


export const bulkDeletePayment = (bulkIds) => {
    return async (dispatch) => {
        try {
            dispatch({ type: BULK_PAYMENT_ACTION_LOADING, payload: true });
            const response = await deletePayment(bulkIds);
            if (response.httpCode === 200) {

                dispatch({ type: SET_BULK_PAYMENT_IDS, payload: [] });
                dispatch({ type: BULK_PAYMENT_ACTION_LOADING, payload: false });
                return true;
            }
            
            dispatch({ type: BULK_PAYMENT_ACTION_LOADING, payload: false });
            return false
        } catch (error) {
            dispatch({ type: BULK_PAYMENT_ACTION_LOADING, payload: false });
            return false;
        }
    }
}

export const setBulkPaymentIds = (bulkIds) => {
    return async (dispatch) => {
        dispatch({ type: SET_BULK_PAYMENT_IDS, payload: bulkIds });
    }
}














import { createFilterCondition } from "../../service/FilterService";

export const ADD_PAYMENT_CONDITION                  = 'ADD_PAYMENT_CONDITION';
export const CHANGE_PAYMENT_CONDITION               = 'CHANGE_PAYMENT_CONDITION';
export const UPDATE_PAYMENT_CONDITION_RULE          = 'UPDATE_PAYMENT_CONDITION_RULE';
export const UPDATE_PAYMENT_CONDITION_VALUE         = 'UPDATE_PAYMENT_CONDITION_VALUE';
export const REMOVE_PAYMENT_CONDITION               = 'REMOVE_PAYMENT_CONDITION';
export const PAYMENT_CONDITION_SET_SAVE_LOADING     = 'PAYMENT_CONDITION_SET_SAVE_LOADING';

import { SET_DEFAULT_FILTER } from "../filter/action";
export const SET_PAYMENT_DEFAULT_FILTER             = 'SET_PAYMENT_DEFAULT_FILTER';

export const UPDATE_PAYMENT_FILTER_LIST             = 'UPDATE_PAYMENT_FILTER_LIST';

export const setPaymentDefaultFilter = (data) => {
    return async (dispatch) => {
        try {
            await dispatch({ type: SET_DEFAULT_FILTER, payload: data });
            await dispatch({ type: SET_PAYMENT_DEFAULT_FILTER, payload: data });
        } catch (error) {
            console.log('clear default filter error')
        }
    }
}


export const changePaymentCondition = (condition) => ({
    type: CHANGE_PAYMENT_CONDITION,
    payload: condition
});

export const addNewPaymentCondition = (rule) => ({
    type: ADD_PAYMENT_CONDITION,
    payload: rule
});

export const updatePaymentOptionRule = (index, data) => ({
    type: UPDATE_PAYMENT_CONDITION_RULE,
    payload: { index, data }
});

export const updatePaymentOptionValue = (index, value) => ({
    type: UPDATE_PAYMENT_CONDITION_VALUE,
    payload: {index, value}
});

export const removePaymentCondition = (index) => ({
    type: REMOVE_PAYMENT_CONDITION,
    payload: index
});

export const savePaymentFilterCondition = (paymentFilter) => {
    return async (dispatch) => {
        try {
            dispatch({type: PAYMENT_CONDITION_SET_SAVE_LOADING, payload: true})

            const response = await createFilterCondition(paymentFilter);
            if (response.httpCode === 200) {
                dispatch({type: UPDATE_PAYMENT_FILTER_LIST, payload: response?.data?.filters})
            }

            dispatch({type: PAYMENT_CONDITION_SET_SAVE_LOADING, payload: false})
            return response;
        } catch (error) {
            console.error("Failed to fetch products:", error);
            dispatch({type: PAYMENT_CONDITION_SET_SAVE_LOADING, payload: false})
            notificationService.error('Failed to save filter');
        }
    };
};
