import { createBank, updateBank, getBankList, updateBankAccountStatus } from "../../service/BankService";
import notificationService from "../../service/NotificationService";

export const BANK_SET_SAVE_LOADING          = 'BANK_SET_SAVE_LOADING';
export const ADD_BANK_LIST                  = 'ADD_BANK_LIST';
export const ADD_BANK                       = 'ADD_BANK';
export const BANK_QUICK_SET_SAVE_LOADING    = 'BANK_QUICK_SET_SAVE_LOADING';

export const changeBankAccountStatus = (bankId, status) => {
    return async (dispatch) => {
        try {
            dispatch({ type: BANK_QUICK_SET_SAVE_LOADING, payload: {bankId: bankId, flag: true} });
            const response = await updateBankAccountStatus(bankId, status);
            if (response.httpCode === 200) {
                const list = response?.data;

                dispatch({ type: BANK_QUICK_SET_SAVE_LOADING, payload: {bankId: bankId, flag: true} });
                notificationService.success('Bank account status updated!');
                return true;
            }

            dispatch({ type: BANK_QUICK_SET_SAVE_LOADING, payload: {bankId: bankId, flag: true} });
            notificationService.error('Bank account updated failed!');
            return false;
        } catch (error) {
            console.error("Failed to fetch bank:", error);
            dispatch({ type: BANK_QUICK_SET_SAVE_LOADING, payload: {bankId: bankId, flag: true} });
            notificationService.error('Bank account updated failed!');
            return false;
        }
    };
};


export const fetchBankList = (page, perPage) => {
    return async (dispatch) => {
        try {
            const response = await getBankList(page, perPage);
            if (response.httpCode === 200) {
              const list = response.data;
              dispatch(addBankList(list));
            }
        } catch (error) {
            console.error("Failed to fetch bank:", error);
        }
    };
};
export const addBankList = (list) => ({
    type: ADD_BANK_LIST,
    payload: list,
});


export const saveBank = (bank) => {
    return async (dispatch) => {
        try {
            dispatch({ type: BANK_SET_SAVE_LOADING, payload: true });
            let response;
            if (!bank.id) {
                response = await createBank(bank);
            } else {
                response = await updateBank(bank.id, bank);
            }

            if (response.httpCode === 200) {
                const list = response.data
                dispatch(addBankList(list));

                //Reset Detail
                dispatch(addBank({
                    id: '',
                    name: '',
                    detail: ''
                }));

                notificationService.success( (!bank.id) ? 'Bank Account created!' : 'Bank Account updated!');
            }
            dispatch({ type: BANK_SET_SAVE_LOADING, payload: false });

            return response;
        } catch (error) {
            console.error("Failed to save User:", error);
            
            dispatch({ type: BANK_SET_SAVE_LOADING, payload: false });
            notificationService.error('Failed to save User');
        }
    };
};

export const addBank = (bank) => ({
    type: ADD_BANK,
    payload: bank,
});