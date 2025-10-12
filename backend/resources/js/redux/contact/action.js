import { getContact, getContactList, createContact, updateContact } from "../../service/ContactService";
import notificationService from "../../service/NotificationService";

export const CONTACT_SET_SAVE_LOADING       = 'CONTACT_SET_SAVE_LOADING';
export const ADD_CONTACT_LIST               = 'ADD_CONTACT_LIST';
export const ADD_CONTACT                    = 'ADD_CONTACT';

export const fetchContactList = (params) => {
    return async (dispatch) => {
        try {
            const response = await getContactList(params);
            if (response.httpCode === 200) {
                const list = response.data;
                dispatch(addContactList(list));
            }
        } catch (error) {
            console.error("Failed to fetch contact:", error);
            return null;
        }
    };
};

export const fetchContact = (id) => {
    return async (dispatch) => {
        try {
            const response = await getContact(id);
            if (response.httpCode === 200) {
                const contact = response.data;
                dispatch(addContact(contact));
            }
        } catch (error) {
            console.error("Failed to fetch contact:", error);
        }
    };
};

export const saveContact = (contact) => {
    return async (dispatch) => {
        try {
            dispatch({ type: CONTACT_SET_SAVE_LOADING, payload: true });

            let response;
            if (!contact.id) {
                response = await createContact(contact);
            } else {
                response = await updateContact(contact.id, contact);
            }

            if (response.httpCode === 200) {
                dispatch(addContact(response.data));
                dispatch({ type: CONTACT_SET_SAVE_LOADING, payload: false });

                notificationService.success( (!contact.id) ? 'Client created!' : 'Client updated!');
                return response;
            }

            dispatch({ type: CONTACT_SET_SAVE_LOADING, payload: false });
            return response;
        } catch (error) {
            console.error("Failed to save contact:", error);
            return false;
        }
    };
};

export const saveContactLoading = (flag) => ({
    type: CONTACT_SET_SAVE_LOADING,
    payload: flag
});

export const addContactList = (contact) => ({
    type: ADD_CONTACT_LIST,
    payload: contact
});

export const addContact = (contact) => ({
    type: ADD_CONTACT,
    payload: contact
});