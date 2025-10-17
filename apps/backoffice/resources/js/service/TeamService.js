import api from "./api";

export const getTeamList = async (page, perPage) => {
    try {
        const response = await api.get(`admin/team`, {
            params: {
                page: page,
                per_page: perPage
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createTeam = async (team) => {
    try {
        const response = await api.post('admin/team', team);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateTeam = async (id, team) => {
    try {
        const response = await api.put(`admin/team/${id}`, team);
        return response.data;
    } catch (error) {
        throw error;
    }
}