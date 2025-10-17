import api from "./api";

export const createFilterCondition = async (filter) => {
    try {
        if(filter && filter.id && filter.id !== '') {
            const response = await api.put(`admin/filter/${filter.id}`, filter);
            return response.data;
        } else {
            const response = await api.post(`admin/filter`, filter);
            return response.data;
        }
    } catch (error) {
        throw error;
    }
}