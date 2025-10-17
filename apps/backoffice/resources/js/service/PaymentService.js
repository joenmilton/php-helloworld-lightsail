import api from "./api";
import { paramSerialize } from '../utils'

export const getPaymentSettings = async (queryParams) => {
    try {

        const serializedParams = Object.entries(queryParams)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');

        const queryString = `${serializedParams}`;
        const response = await api.get(`admin/payments/table/settings?${queryString}`);
        return response.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const updatePaymentStatus = async (paymentId, status) => {
    try {
        const response = await api.post(`admin/payments/${paymentId}/status`, {
            status: status
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getPayment = async (paymentId) => {
    try {
        const response = await api.get(`admin/payments/${paymentId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getPaymentList = async (queryParams, condition) => {
    try {
        const rules = condition?.rules
        const serializedRules = paramSerialize(rules, 'rules');

        const serializedParams = Object.entries(queryParams)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');

        const queryString = `${serializedParams}&${serializedRules}`;

        const response = await api.get(`admin/payments?${queryString}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updatePayment = async (paymentId, formData) => {
    try {
        const headers = {
            'Accept': '*',
            'Content-Type': 'multipart/form-data'
        };

        const response = await api.post(`admin/payments/${paymentId}`, formData, {
            headers
        });

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createPayment = async (payment) => {
    try {
        const headers = {
            'Accept': '*',
            'Content-Type': 'multipart/form-data'
        };

        const response = await api.post('admin/payments', payment, {
            headers
        });

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deletePayment = async (bulkIds) => {
    try {
        const response = await api.post(`admin/payments/delete/bulk`, {
            ids: bulkIds
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getTransaction = async (transactionId) => {
    try {
        const response = await api.get(`admin/payments/transaction/${transactionId}`);

        return response.data;
    } catch (error) {
        throw error;
    }
}