import api from "./api";

export const getContactReferenceList = async (contactId, params) => {
    try {
        const response = await api.get(`admin/contact/${contactId}/internal-references`, {
            params
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getContact = async (contactId) => {
    try {
        const response = await api.get(`admin/contact/${contactId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getContactList = async (params) => {
    try {
        const response = await api.get(`admin/contact`, {
            params
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createContact = async (contact) => {
    try {
        const response = await api.post('admin/contact', contact);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateContact = async (id, contact) => {
    try {
        const response = await api.put(`admin/contact/${id}`, contact);
        return response.data;
    } catch (error) {
        throw error;
    }
}