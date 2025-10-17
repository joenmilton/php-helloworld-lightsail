
import { getProduct, getProductList, createProduct, updateProduct } from "../../service/ProductService";
import notificationService from "../../service/NotificationService";

export const PRODUCT_LIST_LOADING           = 'PRODUCT_LIST_LOADING';
export const PRODUCT_SET_SAVE_LOADING       = 'PRODUCT_SET_SAVE_LOADING';
export const ADD_PRODUCT_LIST               = 'ADD_PRODUCT_LIST';
export const ADD_PRODUCT                    = 'ADD_PRODUCT';
export const UPDATE_PRODUCT_SEARCH_QUERY    = 'UPDATE_PRODUCT_SEARCH_QUERY';

export const updateProductSearchQuery = (value) => ({
    type: UPDATE_PRODUCT_SEARCH_QUERY,
    payload: value,
});

export const fetchProductList = (queryParams, condition) => {
    return async (dispatch) => {
        try {
            dispatch({ type: PRODUCT_LIST_LOADING, payload: true });
            const response = await getProductList(queryParams, condition);
            if (response.httpCode === 200) {
                const list = response.data;
                dispatch(addProductList(list));
            }
            dispatch({ type: PRODUCT_LIST_LOADING, payload: false });
        } catch (error) {
            dispatch({ type: PRODUCT_LIST_LOADING, payload: false });
            console.error("Failed to fetch product:", error);
        }
    };
};

export const fetchProduct = (id) => {
    return async (dispatch) => {
        try {
            const response = await getProduct(id);
            if (response.httpCode === 200) {
                const product = response.data;
                dispatch(addProduct(product));
            }
        } catch (error) {
            console.error("Failed to fetch product:", error);
        }
    };
};

export const saveProduct = (product) => {
    return async (dispatch) => {
        try {
            dispatch({ type: PRODUCT_SET_SAVE_LOADING, payload: true });

            let response;
            if (!product.id) {
                response = await createProduct(product);
            } else {
                response = await updateProduct(product.id, product);
            }

            if (response.httpCode === 200) {
                dispatch(addProductList(response.data));
                dispatch({ type: PRODUCT_SET_SAVE_LOADING, payload: false });

                notificationService.success( (!product.id) ? 'Product created!' : 'Product updated!');
                return response;
            }

            dispatch({ type: PRODUCT_SET_SAVE_LOADING, payload: false });
            return false;
        } catch (error) {
            console.error("Failed to save product:", error);
            return false;
        }
    };
};

export const saveProductLoading = (flag) => ({
    type: PRODUCT_SET_SAVE_LOADING,
    payload: flag
});

export const addProductList = (list) => ({
    type: ADD_PRODUCT_LIST,
    payload: list
});

export const addProduct = (product) => ({
    type: ADD_PRODUCT,
    payload: product
});