import { 
    BILLABLE_INITIALIZED,
    BILLABLE_SET_SAVE_LOADING,
    ADD_BILLABLE,
    ADD_BILLABLE_VIEW,
    UPDATE_PRODUCT_BASIC,
    UPDATE_PRODUCT,
    ADD_PRODUCT,
    REMOVE_PRODUCT,
    UPDATE_TAX_TYPE
} from './action';
import { calculateAmount, calculateSubTotal, calculateTax, calculateTotal } from './Calculations'

const initialState = {
    saveLoading: false,
    initialized: false,
    detail: {
        id: "",
        tax_type: "no_tax",
        subtotal: 0,
        total: 0,
        total_tax: 0,
        taxes: [],
        has_discount: true,
        total_discount: 0,
        products: []
    },
    viewDetail: {
        id: "",
        tax_type: "no_tax",
        subtotal: 0,
        total: 0,
        total_tax: 0,
        taxes: [],
        has_discount: true,
        total_discount: 0,
        products: []
    }
}

const billableReducer = (state = initialState, action) => {
    switch (action.type) {
        case BILLABLE_SET_SAVE_LOADING:
            return {
                ...state,
                saveLoading: action.payload,
            };
        case BILLABLE_INITIALIZED:
            return {
                ...state,
                initialized: action.payload,
            };
        case ADD_BILLABLE:
            return {
                ...state,
                detail: action.payload
            };
        case ADD_BILLABLE_VIEW:
            return {
                ...state,
                viewDetail: action.payload
            };
            


        case UPDATE_PRODUCT_BASIC:
            const basicUpdatedProducts = state.detail.products.map((product) =>
                product.id === action.payload.id
                    ? { ...product, ...action.payload }
                    : product
            );
            return {
                ...state,
                detail: {
                    ...state.detail,
                    products: basicUpdatedProducts
                }
            };

        case ADD_PRODUCT:
            const newProduct = {
                ...action.payload,
                amount: calculateAmount(action.payload)
            };
            const newProductsList = [...state.detail.products, newProduct];
            const totalDiscountAfterAdd = newProductsList.reduce((acc, product) => {
                return acc + ( (product.discount_type === 'percent') ?  ((Number(product.unit_price) * Number(product.qty) * Number(product.discount_total)) / 100) :  Number(product.discount_total));
            }, 0);

            const subTotalAfterAdd = calculateSubTotal(newProductsList);
            const taxAfterAdd = calculateTax(newProductsList, state.detail.tax_type);
            const totalTaxAfterAdd = taxAfterAdd.reduce((acc, t) => acc + t.total, 0);
            const totalAfterAdd = calculateTotal(subTotalAfterAdd, totalTaxAfterAdd, state.detail.tax_type);
        
            return {
                ...state,
                detail: {
                    ...state.detail,
                    products: newProductsList,
                    subtotal: subTotalAfterAdd,
                    taxes: taxAfterAdd,
                    total_tax: totalTaxAfterAdd,
                    total: totalAfterAdd,
                    has_discount: totalDiscountAfterAdd > 0,
                    total_discount: totalDiscountAfterAdd
                }
            };

        case UPDATE_PRODUCT:
            const updatedProducts = state.detail.products.map((product) =>
                product.id === action.payload.id
                    ? { ...product, ...action.payload, amount: calculateAmount({ ...product, ...action.payload }) }
                    : product
            );

            const totalDiscountAfterUpdate = updatedProducts.reduce((acc, product) => {
                return acc + ( (product.discount_type === 'percent') ?  ((Number(product.unit_price) * Number(product.qty) * Number(product.discount_total)) / 100) :  Number(product.discount_total));
            }, 0);

            const newSubTotal = calculateSubTotal(updatedProducts);
            const newTax = calculateTax(updatedProducts, state.detail.tax_type);
            const totalTax = newTax.reduce((acc, t) => acc + t.total, 0);
            const newTotal = calculateTotal(newSubTotal, totalTax, state.detail.tax_type);
        
            return {
                ...state,
                detail: {
                    ...state.detail,
                    products: updatedProducts,
                    subtotal: newSubTotal,
                    taxes: newTax,
                    total_tax: totalTax,
                    total: newTotal,
                    has_discount: totalDiscountAfterUpdate > 0,
                    total_discount: totalDiscountAfterUpdate
                }
            };
    
        case REMOVE_PRODUCT:
            const filteredProducts = state.detail.products.filter(
                (product) => product.id !== action.payload.id
            );

            const totalDiscountAfterRemove = filteredProducts.reduce((acc, product) => {
                return acc + ( (product.discount_type === 'percent') ?  ((Number(product.unit_price) * Number(product.qty) * Number(product.discount_total)) / 100) :  Number(product.discount_total));
            }, 0);

            const subTotalAfterRemove = calculateSubTotal(filteredProducts);
            const taxAfterRemove = calculateTax(filteredProducts, state.detail.tax_type);
            const totalTaxAfterRemove = taxAfterRemove.reduce((acc, t) => acc + t.total, 0);
            const totalAfterRemove = calculateTotal(subTotalAfterRemove, totalTaxAfterRemove, state.detail.tax_type);
        
            return {
                ...state,
                detail: {
                    ...state.detail,
                    products: filteredProducts,
                    subtotal: subTotalAfterRemove,
                    taxes: taxAfterRemove,
                    total_tax: totalTaxAfterRemove,
                    total: totalAfterRemove,
                    has_discount: totalDiscountAfterRemove > 0,
                    total_discount: totalDiscountAfterRemove
                }
            };
    
        case UPDATE_TAX_TYPE:
            const recalculatedTax = calculateTax(state.detail.products, action.payload);
            const recalculatedTotalTax = recalculatedTax.reduce((acc, t) => acc + t.total, 0);
            const recalculatedTotal = calculateTotal(state.detail.subtotal, recalculatedTotalTax, action.payload);
        
            return {
                ...state,
                detail: {
                    ...state.detail,
                    tax_type: action.payload,
                    taxes: recalculatedTax,
                    total_tax: recalculatedTotalTax,
                    total: recalculatedTotal
                }
            };
    
        default:
            return state;
    }
};
export default billableReducer;




