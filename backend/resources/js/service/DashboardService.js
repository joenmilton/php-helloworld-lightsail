import api from "./api";
import { paramSerialize } from '../utils'

export const getDashboardStats = async (queryParams) => {
    try {
        const serializedParams = Object.entries(queryParams)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');

        const queryString = `${serializedParams}`;
        const response = await api.get(`admin/dashboard/stats/dashboard?${queryString}`);
        return response.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const getClientDealStats = async (queryParams) => {
    try {
        const serializedParams = Object.entries(queryParams)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
        const queryString = `${serializedParams}`;
        const response = await api.get(`admin/dashboard/stats/client-deal?${queryString}`);
        return response.data;
    } catch (error) {   
        console.log(error)
        throw error;
    }
}

export const getStatsByCreatedDate = async (queryParams) => {
        try {
            const serializedParams = Object.entries(queryParams)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                .join('&');

            const queryString = `${serializedParams}`;
            const response = await api.get(`admin/dashboard/stats/by-created-date?${queryString}`);
            return response.data;
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

export const getStatsCreatedVsClosed = async (queryParams) => {
    try {
        const serializedParams = Object.entries(queryParams)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');

        const queryString = `${serializedParams}`;
        const response = await api.get(`admin/dashboard/stats/created-vs-closed?${queryString}`);
        return response.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}
