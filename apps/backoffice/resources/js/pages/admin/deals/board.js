
import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select, { components } from 'react-select';
import { SidebarContext } from '../../../components/Sidebar/contexts/SidebarContext';
import { 
    loadDealSettings,
    changeDealView,
    changePipelineDefault,
    addDealSettings
} from '../../../redux';
import KanbanBoard from '../../KanbanBoard';

const defaultFilter = {
    id: '',
    name: '',
    identifier: '',
    user_id: '',
    is_shared: false,
    is_readonly: false,
    rules: {
        condition: "and",
        children: []
    } 
}


function BoardDeal({
    settingsInitialized, settings,
    loadDealSettings, changeDealView, changePipelineDefault,  addDealSettings
}) {
    const history = useHistory();
    const { toggleSidebar }         = useContext(SidebarContext);

    useEffect(async() => {
        if(!settingsInitialized) {
            const response = await loadDealSettings();
            if(response.httpCode === 200 && response?.data?.activeView === 'dealTable') {
                history.push(`/admin/deals`);
            }
        }
    }, [settingsInitialized])

    const changeView = async (view) => {
        const newSettings = {
            ...settings,
            activeView: view
        }
        const result = await changeDealView(newSettings);
    
        if(result.httpCode === 200 && result?.data?.activeView === 'dealTable') {
            history.push(`/admin/deals`);
        }
    }


    const changeDefaultPipeline = async (pipelineId) => {
        const newSettings = {
            ...settings,
            activeLoader: 'defaultPipeline',
            activePipeline: pipelineId
        }

        await changePipelineDefault(newSettings);
    }

    const pipelineOptions = (options) => {
        return options && options.length > 0 ? options.map(option => ({
            label: option.name,
            value: option.id,
            default: option.default
        })) : [];
    }

    const CustomOption = (props) => {
        return (
            <components.Option {...props}>
                {(props.data.default === true) ?  <i className="uil-pricetag-alt" style={{ marginRight: 10 }}></i> : null}
                {props.data.label}
            </components.Option>
        );
    };
    const CustomSingleValue = (props) => {
        return (
            <components.SingleValue {...props}>
                {(props.data.default === true) ?  <i className="uil-pricetag-alt" style={{ marginRight: 10 }}></i> : null}
                {props.data.label}
            </components.SingleValue>
        );
    };

    const selectedPipeline = (pipelineId, pipelines) => {
        const selected = pipelines.find(p => p.id === pipelineId)
        if(!selected) {
            return null;
        }

        return {
            label: selected.name,
            value: selected.id,
            default: selected.default,
        }
    }
    
    const handlePipelineChange = (data) => {
        const updatedSettings = {
            ...settings,
            activePipeline: data.value
        }
        addDealSettings(updatedSettings)
    }

    const selected = selectedPipeline(settings?.activePipeline, settings?.pipelines);

    return (
        <>
        {
            (settingsInitialized) ? <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-md-6">
                        <div className="d-flex flex-wrap align-items-start justify-content-md-start mt-2 mt-md-0 gap-2">
                            <Select
                                id="pipeline"
                                classNamePrefix="pipeline-select"
                                placeholder={"Select Pipeline...."}
                                closeMenuOnSelect={true}
                                value={selected}
                                options={pipelineOptions(settings?.pipelines)}
                                onChange={(values) => handlePipelineChange(values)}
                                components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
                            />
                            {
                                (settings?.activeLoader == 'defaultPipeline') ? <div className="d-flex align-items-center justify-content-center">
                                    <div className="spinner-border text-primary m-1" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div> : (!selected?.default) ? <button onClick={() => changeDefaultPipeline(settings?.activePipeline)} className="btn btn-white p-0 px-2">
                                    <i className="uil-pricetag-alt font-size-24"></i>
                                </button> : null
                            }
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="d-flex flex-wrap align-items-start justify-content-md-end mt-2 mt-md-0 gap-2">
                            {
                                (settings?.activeLoader == 'dealView') ? <div className="d-flex align-items-center justify-content-center">
                                    <div className="spinner-border text-primary m-1" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div> : null
                            }
                            <button className={`btn ${(settings?.activeView == 'dealTable') ? 'btn-secondary' : 'btn-light'}`} onClick={async() => changeView('dealTable')}>
                                <i className="uil-grid"></i>
                            </button>
                            <button className={`btn ${(settings?.activeView == 'dealBoard') ? 'btn-secondary' : 'btn-light'}`} onClick={async() => changeView('dealBoard')}>
                                <i className="uil-grids"></i>
                            </button>
                            <button className="btn btn-purple" onClick={() => toggleSidebar('deals')}>Create Deal</button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <KanbanBoard pipelineId={settings?.activePipeline}/>
                </div>
            </div> : null
        }

        </>
    )
}

const mapStateToProps = (state) => ({
    settingsInitialized: state.deal.settingsInitialized,
    settings: state.deal.settings,
});

const mapDispatchToProps = {
    loadDealSettings,
    changeDealView,
    changePipelineDefault,
    addDealSettings
};
  
export default connect(mapStateToProps, mapDispatchToProps)(BoardDeal);