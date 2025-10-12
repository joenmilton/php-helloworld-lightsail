import api from "./api";
import { paramSerialize } from '../utils'

export const getProduct = async (productId) => {
    try {
        const response = await api.get(`admin/products/${productId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getProductList = async (queryParams, condition) => {
    try {
        const rules = condition?.rules
        const serializedRules = paramSerialize(rules, 'rules');

        const serializedParams = Object.entries(queryParams)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          .join('&');

        const queryString = `${serializedParams}&${serializedRules}`;

        const response = await api.get(`admin/products?${queryString}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createProduct = async (product) => {
    try {
        const response = await api.post('admin/products', product);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateProduct = async (id, product) => {
    try {
        const response = await api.put(`admin/products/${id}`, product);
        return response.data;
    } catch (error) {
        throw error;
    }
}