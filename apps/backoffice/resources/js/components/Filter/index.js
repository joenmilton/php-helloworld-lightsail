import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { formatString } from '../../utils';
import RuleValue from './RuleValue';

const Filter = ({ 
    filter, settings, view, onFilterChange, listLoading,

    setDefaultFilter, changeCondition, addNewCondition, updateOptionRule, removeCondition, saveFilterCondition, updateOptionValue
}) => {
    const [errors, setError] = useState({});

    const dropdownSharedMenuRef         = useRef(null);
    const createFilterRef               = useRef(null);
    const modalElementRef               = useRef(null);

    useEffect(() => {
        const modalElement = createFilterRef.current;
        modalElementRef.current = modalElement;
    }, []);



    const onConditionChange = (e) => {
        changeCondition(e.target.value)
    }

    const onFilterNewCondition = () => {
        const defaultRule = {
            type: "rule",
            query: { operator : "", rule : "", type : "", value : ""}
        };
        addNewCondition(defaultRule)
    }

    const ruleOptions = (options) => {
        return options && options.length > 0 ? options.map(option => ({
            label: option.label,
            value: option.id,
            type: option.type
        })) : [];
    }

    const handleRuleChange = async (index, data) => {
        if(!data.value || data.value === '') {
            return ;
        }

        const updatedData = {
            rule: data.value, 
            type: data.type, 
            operator: "", 
            value: "" 
        }
        updateOptionRule(index, updatedData)
    }

    const ruleSelectedValue = (index, filter, rules) => {
        const currentRuleQuery = filter?.activeCondition?.rules?.children[index]?.query;
        if(currentRuleQuery?.rule === '') {
            return null;
        }

        const selectedRule = rules.find( r => r.id === currentRuleQuery?.rule)

        return {
            label: selectedRule?.label,
            value: selectedRule?.id
        };
    }







    const operatorOptions = (index, filter, options) => {

        const currentRuleId = filter?.activeCondition?.rules?.children[index]?.query?.rule;
        const currentRule   = options.find(param => param.id === currentRuleId);

        return currentRule && currentRule?.operators && currentRule?.operators.length > 0 ? currentRule.operators.map(option => ({
            label: formatString(option),
            value: option
        })) : [];
    }

    const handleOperatorChange = (index, data) => {
        if(!data.value || data.value === '') {
            return ;
        }

        const updatedData = { 
            operator: data.value, 
            value: (['between', 'not_between'].includes(data.value)) ? ["", ""] : "" 
        }
        updateOptionRule(index, updatedData)
    }
    

    const operatorValue = (index, filter) => {
        const currentRuleQuery = filter?.activeCondition?.rules?.children[index]?.query;
        if(currentRuleQuery?.operator === '') {
            return null;
        }

        return {
            label: formatString(currentRuleQuery?.operator),
            value: currentRuleQuery?.operator
        };
    }
    

    const onRemoveCondition = (index) => {
        removeCondition(index)
    }

    const onFilterInputChange = (e) => {
        let updatedCondition = {};
        const { name, value } = e.target;

        switch (name) {
            case 'name': {
                updatedCondition = {
                    ...filter?.activeCondition,
                    name: value
                }
                setDefaultFilter(updatedCondition)
                break;
            }
            case 'mark_default': {
                updatedCondition = {
                    ...filter?.activeCondition,
                    mark_default: !filter?.activeCondition?.mark_default
                }
                setDefaultFilter(updatedCondition)
                break;
            }
            case 'save_filter': {
                updatedCondition = {
                    ...filter?.activeCondition,
                    save_filter: !filter?.activeCondition?.save_filter
                }
                setDefaultFilter(updatedCondition)
                break;
            }
 
            default:
                break;
        }
    }

    const onClickSharedStatus = (flag) => {
        const updatedCondition = {
            ...filter?.activeCondition,
            is_shared: flag
        }
        setDefaultFilter(updatedCondition)

        if (dropdownSharedMenuRef.current) {
            if(dropdownSharedMenuRef.current.classList.contains('show')) {
                dropdownSharedMenuRef.current.classList.remove('show');
            }
        }
    }



    const updateFilter = async (view) => {
        var updatedCondition = { ...filter?.activeCondition, identifier: view }

        if(updatedCondition?.save_filter) {
            const response = await saveFilterCondition(updatedCondition)
            if(response.httpCode == 422) {
                setError(response.errors)
                return;
            } else if(response.httpCode === 200) {
                const filtersData = response.data;
                
                updatedCondition = response?.data?.filters.find(f => f.id === filtersData.active_id);
            } else {
                return;
            }
        } else {
            updatedCondition = { ...filter?.activeCondition, identifier: view }
        }

        if(updatedCondition) {
            await setDefaultFilter(updatedCondition)
            await onFilterChange(updatedCondition)

            const cancelButton = modalElementRef.current.querySelector('[data-bs-dismiss="modal"]');
            cancelButton.click();
        }






        // if(response.httpCode == 422) {
        //     setError(response.errors)
        // }
        // if(response.httpCode === 200) {
        //     onClose();
        // }
    }
    
    const clearRule = () => {
        const updatedCondition = {
            ...filter?.activeCondition,
            rules: {
                condition: "and",
                children: []
            }
        }
        setDefaultFilter(updatedCondition)
    }


    return (
        <div ref={createFilterRef} className="modal fade bs-example-modal-lg" tabIndex="-1" aria-labelledby="mySmallModalLabel" aria-hidden="true" style={{ display: 'none' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content bg-white">
                    <div className="modal-header border-0">
                        <h5 className="modal-title">
                            { (filter?.activeCondition?.mark_default === true) ? <i className="uil-star me-2"></i> : null }
                            {
                                (filter?.activeCondition && filter?.activeCondition?.id !== '') ? 'Edit Filter' : 'Create New Filter'
                            }
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body p-4 py-0">
                        {
                            (filter?.activeCondition?.is_readonly) ? <div className="mb-3">
                                <blockquote className="blockquote custom-blockpuote blockpuote-primary rounded mb-0 p-2">
                                    <p className="font-size-14 text-reset"><i className="font-size-24 uil-info-circle me-2"></i> This filter is read-only filter with ability to be marked as default, other modifications of the filter are disabled, if you need to extend this filter, create new a one instead.</p>
                                </blockquote>
                            </div> : null
                        }
                        <div className="d-flex justify-content-end align-items-center">
                            {
                                (!filter?.activeCondition?.is_readonly && filter?.activeCondition?.rules?.children.length > 0) ? <div className="me-2 cursor-pointer" onClick={clearRule}>Clear Rules</div> : null
                            }
                            <div className="dropdown dropdown-end">
                                <div className="dropdown-toggle text-dark text-center cursor-pointer" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                                    <i className="uil uil-ellipsis-h font-size-20"></i>
                                </div>
                                <div className="dropdown-menu dropdown-menu-end p-0" ref={dropdownSharedMenuRef}>
                                    <div className="card mb-0" style={{width: '22rem'}}>
                                        <div className="card-body p-0">
                                            <div className="row row-cols-auto g-0 text-center">
                                                <div className="col-md-12">
                                                    <ul className="list-unstyled m-0 p-1">
                                                        {
                                                            (!filter?.activeCondition?.is_readonly && filter?.activeCondition?.id !== '') ? <li className="cursor-pointer dropdown-item mb-1">
                                                                <div className="text-start">Delete</div>
                                                            </li> : <li className="dropdown-item mb-1">
                                                                <div className="text-start text-muted">Delete</div>
                                                            </li>
                                                        }
                                                        {
                                                            (filter?.activeCondition?.is_readonly && !filter?.activeCondition?.mark_default) ? <li className="cursor-pointer dropdown-item mb-1">
                                                                <div className="text-start">Mark as Default</div>
                                                                <div className="text-muted text-start">Applies only for your account</div>
                                                            </li> : null
                                                        }
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            (filter?.activeCondition?.rules?.children.length > 1) ? 
                                <p>
                                    Show records that match 
                                    <select 
                                        onChange={onConditionChange}
                                        value={filter?.activeCondition?.rules?.condition}
                                        className="form-control d-inline-block w-auto bg-white shadow-sm ring-1 ring-neutral-300 p-1 px-2"
                                    >
                                        <option value="and">All</option>
                                        <option value="or">Any</option>
                                    </select> 
                                    of these conditions:
                                </p> : null
                        }
                        
                        <div className="border rounded-2 border-neutral-200 bg-neutral-50 p-4">
                            {
                                (filter?.activeCondition?.rules?.children).map((rule, index) => {
                                    return (
                                        <div key={index} className="position-relative d-flex mb-3">
                                            <div className="d-flex w-full w-auto flex-row justify-content-start">
                                                <div className="position-relative d-flex">
                                                    <div className="w-full me-1" style={{width:'12rem'}}>
                                                        <Select
                                                            id="rule"
                                                            isDisabled={filter?.activeCondition?.is_readonly}
                                                            classNamePrefix="rule-select"
                                                            placeholder={"Select Rule...."}
                                                            closeMenuOnSelect={true}
                                                            value={ruleSelectedValue(index, filter, settings?.rules) || null} 
                                                            options={ruleOptions(settings?.rules)}
                                                            onChange={(values) => handleRuleChange(index, values)}
                                                        />
                                                    </div>
                                                    <div style={{width:'10rem'}}>
                                                        <Select
                                                            id="rule_name"
                                                            isDisabled={filter?.activeCondition?.is_readonly}
                                                            classNamePrefix="rule-name-select"
                                                            placeholder={"Operator..."}
                                                            closeMenuOnSelect={true}
                                                            value={operatorValue(index, filter) || null}
                                                            options={operatorOptions(index, filter, settings?.rules)}
                                                            onChange={(values) => handleOperatorChange(index, values)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-equal ms-1">
                                                {
                                                    (settings && settings?.rules && settings?.rules.length > 0) ? <RuleValue isDisabled={filter?.activeCondition?.is_readonly} query={rule?.query} index={index} settings={settings} updateOptionValue={updateOptionValue} filter={filter}/> : null
                                                }
                                            </div>
                                            {
                                                (!filter?.activeCondition?.is_readonly) ? <div className="position-absolute rule-trash" onClick={() => onRemoveCondition(index)}>
                                                    <i className="d-flex uil-trash-alt align-items-center justify-content-center pt-1 font-size-18 cursor-pointer"></i>
                                                </div> : null
                                            }
                                        </div>
                                    )
                                }) 
                            }
                            
                            <div className="d-flex">
                                {
                                    (!filter?.activeCondition?.is_readonly) ? <p className="cursor-pointer mb-0" onClick={onFilterNewCondition}>+ Add Condition</p> : null
                                }
                            </div>
                        </div>
                        
                        {errors["rules.children"] && (
                            <div className="d-block invalid-feedback">
                                {errors["rules.children"].join(', ')}
                            </div>
                        )}
                        {
                            (filter?.activeCondition?.save_filter) ? <div className="d-grid mt-2 p-2">
                                <div className="row">
                                    <div className="col-6">
                                        <div className="mb-2">
                                            <label className="form-label" htmlFor="filter_name">
                                                <span className="text-danger me-1">*</span>
                                                Filter Name
                                            </label>
                                            <input 
                                                type="text" 
                                                name="name" 
                                                id="filter_name" 
                                                className="form-control bg-white shadow-sm ring-1 ring-neutral-300" 
                                                placeholder="" 
                                                onChange={onFilterInputChange}
                                                value={filter?.activeCondition?.name || ''} 
                                            />
                                            {errors.name && (
                                                <div className="d-block invalid-feedback">
                                                    {errors.name.join(', ')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="mb-2">
                                            <label className="form-label" htmlFor="filter_name">
                                                <span className="text-danger me-1">*</span>
                                                Shared with
                                            </label>
                                            <div className="form-control bg-white shadow-sm ring-1 ring-neutral-300 p-0">

                                                <div className="dropdown dropdown-center">
                                                    <div className="dropdown-toggle text-dark text-center cursor-pointer p-2" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                                                        {(filter?.activeCondition?.is_shared) ? 'Everyone' : 'Private'} <i className="uil-angle-down ms-2"></i>
                                                    </div>
                                                    <div className="dropdown-menu dropdown-menu-end p-0" ref={dropdownSharedMenuRef}>
                                                        <div className="card mb-0" style={{width: '22rem'}}>
                                                            <div className="card-body p-0">
                                                                <div className="row row-cols-auto g-0 text-center">
                                                                    <div className="col-md-12">
                                                                        <ul className="list-unstyled m-0 p-1">
                                                                            <li onClick={() => onClickSharedStatus(false)} className={`cursor-pointer dropdown-item mb-1 ${(!filter?.activeCondition?.is_shared) ? 'active' : ''}`}>
                                                                                <div className="p-2 rounded text-start">
                                                                                    <div>Private</div>
                                                                                    <div className="text-muted">Only the creator can see the filter</div>
                                                                                </div>
                                                                            </li>
                                                                            <li onClick={() => onClickSharedStatus(true)} className={`cursor-pointer dropdown-item ${(filter?.activeCondition?.is_shared) ? 'active' : ''}`}>
                                                                                <div className="p-2 rounded text-start">
                                                                                    <div>Everyone</div>
                                                                                    <div className="text-muted">All user can see and use this filter</div>
                                                                                </div>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="form-check">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                id="formCheck2" 
                                                name="mark_default"
                                                checked={!!filter?.activeCondition?.mark_default}
                                                onChange={onFilterInputChange}
                                            />
                                            <label className="form-check-label" htmlFor="formCheck2">
                                                Mark as default
                                            </label>
                                        </div>
                                    </div>
                                </div>

                            </div> : null
                        }
                    </div>
                    <div className="modal-footer border-0">
                        {
                           (filter?.activeCondition && filter?.activeCondition?.id === '') ? <div className="d-flex justify-content-between align-items-center">
                                    <label className="form-check-label m-0 me-2" htmlFor="flexSwitchCheckChecked">Save filter?</label>
                                    <div>
                                        <div className="form-check form-switch form-switch-md m-0 me-2">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                id="flexSwitchCheckChecked"
                                                name="save_filter"
                                                checked={!!filter?.activeCondition?.save_filter} 
                                                onChange={onFilterInputChange}
                                            />
                                        </div>
                                    </div>
                                </div> : null
                        }
                        {
                            (!filter?.activeCondition?.is_readonly) ? <>
                                <button type="button" className="btn" data-bs-dismiss="modal">
                                    Cancel
                                </button>
                                <button disabled={filter?.saveLoading || listLoading} onClick={() => updateFilter(view)} type="submit" className="btn btn-purple">
                                    {
                                        (filter?.saveLoading) ? 'Filter Saving ...' : (listLoading) ? 'Filtering ...' : (filter?.activeCondition?.save_filter) ? 'Save & Apply' : 'Apply Filters'
                                    }
                                </button>
                            </> : null
                        }
                    </div>

                </div>
            </div>
        </div>
    )
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(Filter);