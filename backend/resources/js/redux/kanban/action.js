import { getBoardData, updateBoardSorting } from "../../service/BoardService";
import notificationService from "../../service/NotificationService";

export const BOARD_SET_LOADING             = 'BOARD_SET_LOADING';
export const UPDATE_BOARD                  = 'UPDATE_BOARD';
export const UPDATE_SHRINK                 = 'UPDATE_SHRINK';



export const getBoardList = (pipelineId) => {
    return async (dispatch) => {
        try {
            dispatch(setBoardLoading(true))
            const response = await getBoardData(pipelineId);
  
            if (response.httpCode === 200) {
                const list = response.data;
                dispatch(updateBoard(list))
                dispatch(setBoardLoading(false))
            }
        } catch (error) {
            dispatch(setBoardLoading(false))
            console.error("Failed to fetch pipeline:", error);
        }
    };
};

export const updateBoardList = (pipelineId, data, columnList, type, draggableId) => {
    return async (dispatch) => {
        try {
            const loadingDeal = {
                ...data.tasks[draggableId],
                is_loading: true
            }
            const newData = {
                ...data,
                tasks: {
                    ...data.tasks,
                    [draggableId]: loadingDeal
                }
            }
            dispatch(updateBoard(newData))

            const response = await updateBoardSorting(pipelineId, {data, columnList, type})
            if (response.httpCode === 200) {
                const list = response.data;

                const updatedList = {
                    ...list,
                    columns: data.columns
                } 
                dispatch(updateBoard(updatedList))
            }
            
        } catch (error) {
            console.error("Failed to update board list:", error);
        }
    };
};





export const setBoardLoading = (flag) => ({
    type: BOARD_SET_LOADING, 
    payload: flag
})

export const updateShrink = (columnId, flag) => ({
    type: UPDATE_SHRINK, 
    payload: { columnId: columnId, flag:flag }
})

export const updateBoard = (data) => ({
    type: UPDATE_BOARD, 
    payload: data
});

export const resetBoard = () => ({

});
