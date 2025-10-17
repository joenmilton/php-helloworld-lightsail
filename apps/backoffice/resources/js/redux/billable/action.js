import { getBillable, createBillable } from "../../service/BillableService";
import notificationService from "../../service/NotificationService";

import { UPDATE_DEAL } from "../deals/action";
export const BILLABLE_INITIALIZED            = 'BILLABLE_INITIALIZED';
export const BILLABLE_SET_SAVE_LOADING       = 'BILLABLE_SET_SAVE_LOADING';
export const ADD_BILLABLE                    = 'ADD_BILLABLE';
export const ADD_BILLABLE_VIEW               = 'ADD_BILLABLE_VIEW';


export const UPDATE_PRODUCT_BASIC            = 'UPDATE_PRODUCT_BASIC';
export const UPDATE_PRODUCT                  = 'UPDATE_PRODUCT';
export const ADD_PRODUCT                     = 'ADD_PRODUCT';
export const REMOVE_PRODUCT                  = 'REMOVE_PRODUCT';
export const UPDATE_TAX_TYPE                 = 'UPDATE_TAX_TYPE';




export const fetchBillable = (dealId) => {
    return async (dispatch) => {
        try {
            dispatch({type: BILLABLE_INITIALIZED, payload: false})
            const response = await getBillable(dealId);
            if (response.httpCode === 200) {
                const list = response.data;
                dispatch(addBillable(list));
                dispatch(addBillableView(list));
            }
            dispatch({type: BILLABLE_INITIALIZED, payload: true})
        } catch (error) {
            console.error("Failed to fetch products:", error);
            dispatch({type: BILLABLE_INITIALIZED, payload: true})
            return null;
        }
    };
};

export const saveBillable = (dealId, bill) => {
    return async (dispatch) => {
        try {
            dispatch({ type: BILLABLE_SET_SAVE_LOADING, payload: true });

            const response = await createBillable(dealId, bill);
            if (response.httpCode === 200) {
                const list = response.data;

                dispatch(addBillable(list));
                dispatch(addBillableView(list));


                dispatch({
                    type: UPDATE_DEAL,
                    payload: { 
                        has_products: list?.products.length > 0 ? 1 : 0,
                        amount: list?.total
                    }
                });

                notificationService.success( (!bill.id) ? 'Service list updated!' : 'Service list updated!');
            }
            dispatch({ type: BILLABLE_SET_SAVE_LOADING, payload: false });

            return response;
        } catch (error) {
            console.error("Failed to update service:", error);
            
            dispatch({ type: BILLABLE_SET_SAVE_LOADING, payload: false });
            notificationService.error('Failed to update service');
        }
    };
};



export const addBillable = (data) => ({
    type: ADD_BILLABLE,
    payload: data
});

export const addBillableView = (data) => ({
    type: ADD_BILLABLE_VIEW,
    payload: data
});






export const handleUpdateProduct = (data) => {
    return (dispatch) => {
        dispatch({
            type: UPDATE_PRODUCT,
            payload: data
        });
    }
};

export const handleBasicProductChange = (id, field, value) => {
    return (dispatch) => {
        dispatch({
            type: UPDATE_PRODUCT_BASIC,
            payload: { id, [field]: value }
        });
    }
};

export const handleProductChange = (id, field, value) => {
    return (dispatch) => {
        dispatch({
            type: UPDATE_PRODUCT,
            payload: { id, [field]: value }
        });
    }
};

export const handleAddProduct = () => {
    return (dispatch) => {
        const newProduct = {
            id: new Date().toISOString(),
            amount: 0,
            description: '',
            discount_total: 0,
            discount_type: 'fixed',
            name: '',
            qty: 1,
            sku: '',
            tax_label: 'GST',
            tax_rate: 0,
            unit_price: 0
        }
        dispatch({ type: ADD_PRODUCT, payload: newProduct });
    }
};

export const handleRemoveProduct = (id) => {
    return (dispatch) => {
        dispatch({ type: REMOVE_PRODUCT, payload: { id } });
    }
};

export const handleTaxTypeChange = (taxType) => {
    return (dispatch) => {
        dispatch({ type: UPDATE_TAX_TYPE, payload: taxType });
    }
};