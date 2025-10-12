import { 
  getPipeline, updatePipeline, getPipelineList,
} from "../../service/PipelineService";
import { 
  getBankList
} from "../../service/SettingsService";

import notificationService from "../../service/NotificationService";
import { PIPELINE_SET_SAVE_LOADING } from "../common/action";

export const ADD_PIPELINE     = 'ADD_PIPELINE';
export const CLEAR_PIPELINE   = 'CLEAR_PIPELINE';
export const UPDATE_STAGE     = 'UPDATE_STAGE';
export const ADD_STAGE        = 'ADD_STAGE';
export const REMOVE_STAGE     = 'REMOVE_STAGE';
export const ADD_PIPELINE_LIST     = 'ADD_PIPELINE_LIST';
export const ADD_DEPENDENTS_LIST     = 'ADD_DEPENDENTS_LIST';


export const fetchPipelineList = () => {
  return async (dispatch) => {
      try {
          const response = await getPipelineList();
          if (response.httpCode === 200) {
            const list = response.data;
            dispatch(addPipelineList(list));
          }
      } catch (error) {
          console.error("Failed to fetch pipeline:", error);
      }
  };
};

export const fetchPipeline = (id) => {
  return async (dispatch) => {
      try {
          const response = await getPipeline(id);
          if (response.httpCode === 200) {
            const pipeline = response.data;
            if (!pipeline.stages || pipeline.stages.length === 0) {
              pipeline.stages = [{ id: '', name: '', sort_order: 1 }];
            }
            dispatch(addPipeline(pipeline));
          }
      } catch (error) {
          console.error("Failed to fetch pipeline:", error);
      }
  };
};

export const savePipeline = (pipeline) => {
  return async (dispatch) => {
    try {
      dispatch({ type: PIPELINE_SET_SAVE_LOADING, payload: true });
      const response = await updatePipeline(pipeline.id, pipeline); // Replace with your API call
      if (response.httpCode === 200) {
        dispatch(addPipeline(response.data));
        notificationService.success('Pipeline updated!');
      }

      dispatch({ type: PIPELINE_SET_SAVE_LOADING, payload: false });
    } catch (error) {
      console.error("Failed to save pipeline:", error);
      
      dispatch({ type: PIPELINE_SET_SAVE_LOADING, payload: false });
      notificationService.error('Failed to save pipeline');
    }
  };
};



export const addPipelineList = (list) => ({
  type: ADD_PIPELINE_LIST,
  payload: list,
});

export const addPipeline = (pipeline) => ({
  type: ADD_PIPELINE,
  payload: pipeline,
});

export const clearPipeline = () => ({
  type: CLEAR_PIPELINE,
  payload: {
    listPipeline: [],
    pipeline: {
      id: '',
      name: '',
      stages: [],
      visibility_group: null
    }
  }
});

export const updateStage = (index, stage) => ({
  type: UPDATE_STAGE,
  payload: { index, stage },
});

export const addStage = () => ({
  type: ADD_STAGE,
});

export const removeStage = (index) => ({
  type: REMOVE_STAGE,
  payload: index,
});

export const addDependentsList = (list, type) => ({
  type: ADD_DEPENDENTS_LIST,
  payload: {
    list: list,
    type: type
  },
});
