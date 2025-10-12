import { getDealStatusReport, getPipelineUsers } from "../../service/ReportService";

export const fetchPipelineUsers = (pipeline) => {
    return async (dispatch) => {
        try {
            return await getPipelineUsers(pipeline);
        } catch (error) {
            return null;
        }
    }
}

export const fetchDealStatusReport = (formData) => {
    return async (dispatch) => {
        try {
            const response = await getDealStatusReport(formData);
            if (response.httpCode === 200) {
                return response.data;
            }
        } catch (error) {
            throw handleError(error);
        }
    };
};

  // Handle API errors
const handleError = (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return {
            message: error.response.data.message || 'An error occurred',
            errors: error.response.data.errors || {},
            status: error.response.status
        };
    } else if (error.request) {
        // The request was made but no response was received
        return {
            message: 'No response from server',
            status: 0
        };
    } else {
        // Something happened in setting up the request that triggered an Error
        return {
            message: error.message,
            status: 0
        };
    }
}