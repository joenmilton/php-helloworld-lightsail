import React, { useEffect, useState, useRef, useContext } from 'react';
import { connect } from 'react-redux';
import Filter from '../Filter';
import { SidebarContext } from '../Sidebar/contexts/SidebarContext';
import { makeSingular, capitalizeFirstLetter } from '../../utils';

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

const FilterBar = ({ 
    onFilterBarUpdate, onChangeView, onInputSearch,
    view, settings, module, availableActions, activeCondition,

    setDefaultFilter, changeCondition, addNewCondition, updateOptionRule, removeCondition, saveFilterCondition, updateOptionValue
}) => {
    const  dropdownMenuRef                  = useRef(null);
    const { toggleSidebar }                 = useContext(SidebarContext);

    const onNewFilterClick = async () => {
        if(activeCondition && activeCondition?.id && activeCondition?.id != '') {
            await setDefaultFilter(defaultFilter)
        }

        if (dropdownMenuRef.current) {
            if(dropdownMenuRef.current.classList.contains('show')) {
                dropdownMenuRef.current.classList.remove('show');
            }
        }
    }

    const onEditFilterClick = () => {
        if (dropdownMenuRef.current) {
            if(dropdownMenuRef.current.classList.contains('show')) {
                dropdownMenuRef.current.classList.remove('show');
            }
        }
    }

    const onClearFilterClick = async() => {
        const queryFilter = {
            q: module?.searchQuery,
            sortOrder: module?.sortOrder,
            page: module?.list?.current_page,
            per_page: module?.list?.per_page,
        }

        await setDefaultFilter(defaultFilter)
        await onFilterBarUpdate({ action: 'fetchList', queryFilter: queryFilter, filter: defaultFilter })
    }

    const setActiveCondition = async(filter) => {

        const queryFilter = {
            q: module?.searchQuery,
            sortOrder: module?.sortOrder,
            page: module?.list?.current_page,
            per_page: module?.list?.per_page,
        }

        await setDefaultFilter(filter)
        await onFilterBarUpdate({ action: 'fetchList', queryFilter: queryFilter, filter: filter })

        if (dropdownMenuRef.current) {
            if(dropdownMenuRef.current.classList.contains('show')) {
                dropdownMenuRef.current.classList.remove('show');
            }
        }
    }

    const handleFilterChange = async(currentFilter) => {

        const queryFilter = {
            q: module?.searchQuery,
            sortOrder: module?.sortOrder,
            page: module?.list?.current_page,
            per_page: module?.list?.per_page,
        }

        await onFilterBarUpdate({ action: 'fetchList', queryFilter: queryFilter, filter: currentFilter })
    }

    const bulkDelete = async(bulkIds, currentFilter) => {
        if(bulkIds.length <= 0) {
            return false;
        }

        const queryFilter = {
            q: module?.searchQuery,
            sortOrder: module?.sortOrder,
            page: module?.list?.current_page,
            per_page: module?.list?.per_page,
        }

        await onFilterBarUpdate({ action: 'bulkDelete', bulkIds: bulkIds, queryFilter: queryFilter, filter: currentFilter})
    }

    return (
        <div className="row mb-2">
            <div className="col-12">
                <Filter 
                    filter={module} listLoading={module?.listLoading} settings={settings} view={view} onFilterChange={async(data) => handleFilterChange(data)}
                    setDefaultFilter={setDefaultFilter}
                    changeCondition={changeCondition}
                    addNewCondition={addNewCondition}
                    updateOptionRule={updateOptionRule}
                    removeCondition={removeCondition}
                    saveFilterCondition={saveFilterCondition}
                    updateOptionValue={updateOptionValue}
                />
            </div>
            <div className="col-md-6">
                <div className="btn-toolbar">
                    {
                        (availableActions.some(item => item === 'search')) ? <div className="btn-group me-2 mb-2 mb-sm-0">
                            <input 
                                onChange={(event) => onInputSearch(event, activeCondition)} 
                                value={module?.searchQuery}
                                placeholder="Search..."
                                type="text" 
                                className="form-control bg-white shadow-sm ring-1 ring-neutral-300 input-width-350"
                            />
                        </div> : null
                    }
                    <div className="btn-group dropend me-2 mb-2 mb-sm-0">
                        <div className="dropdown dropdown-center">
                            <button type="button" className="btn btn-white dropdown-toggle text-dark" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                                {
                                    (activeCondition && activeCondition?.id !== '') ? activeCondition?.name : 'Filters'
                                }
                                <i className="uil-angle-down ms-2"></i>
                            </button>
                            <div className="dropdown-menu dropdown-menu-end p-0" ref={dropdownMenuRef}>
                                <div className="card mb-0" style={{width: '22rem'}}>
                                    <div className="card-header p-2">
                                        <div className="row row-cols-auto g-0 text-center">
                                            <div className="col pe-2">
                                                <div className="p-1" data-bs-toggle="modal" data-bs-target=".bs-example-modal-lg" onClick={async() => await onNewFilterClick()}>
                                                    <p className="mb-0 cursor-pointer">New Filter</p>
                                                </div>
                                            </div>
                                            {
                                                (activeCondition?.id !== '') ? <>
                                                    <div className="col border-start px-2">
                                                        <div className="p-1" data-bs-toggle="modal" data-bs-target=".bs-example-modal-lg" onClick={onEditFilterClick}>
                                                            <p className="mb-0 cursor-pointer">Edit</p>
                                                        </div>
                                                    </div>
                                                    <div className="col border-start px-2">
                                                        <div className="p-1" onClick={onClearFilterClick}>
                                                            <p className="mb-0 cursor-pointer">Clear Filter</p>
                                                        </div>
                                                    </div>
                                                </> : null
                                            }
                                        </div>
                                        <div className="col-12 mt-2">
                                            <input 
                                                type="text" 
                                                className="form-control bg-white shadow-sm ring-1 ring-neutral-300"
                                            />
                                        </div>
                                    </div>
                                    <div className="card-body p-2">
                                        <div className="sub-head p-2">Available Filters</div>
                                        <ul className="list-unstyled m-0">
                                        {
                                            (settings?.filters && settings?.filters.length > 0) ? settings?.filters.map((filter, index) => {
                                                return (
                                                    <li key={index} className="cursor-pointer mb-1" onClick={async() => await setActiveCondition(filter)}>
                                                        <div className={`dropdown-item p-2 rounded ${(activeCondition && activeCondition?.id !== '' && activeCondition?.id === filter.id) ? 'active' : ''}`}>
                                                            { (filter.mark_default === true) ? <i className="uil-star me-2"></i> : null }
                                                            {filter.name}
                                                        </div>
                                                    </li>
                                                )
                                            }) : null
                                        }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="btn-group me-2 mb-2 mb-sm-0">
                        {
                            (activeCondition?.id === '') ?<button type="button" className="btn p-0 px-2 border-0" data-bs-toggle="modal" data-bs-target=".bs-example-modal-lg" onClick={async() => await onNewFilterClick()}>
                                <i className="uil-filter font-size-20"></i>
                            </button> : 
                            <button type="button" className="btn p-0 px-2 border-0" data-bs-toggle="modal" data-bs-target=".bs-example-modal-lg" onClick={onEditFilterClick}>
                                <i className="uil-edit-alt font-size-20"></i>
                            </button>
                        }
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="d-flex flex-wrap align-items-start justify-content-md-end gap-2">
                {
                    (availableActions.some(item => item === 'bulk_action')) ? <div className="dropdown">
                        <button type="button" className="btn btn-white dropdown-toggle text-dark" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                            {
                                (module?.bulkActionLoading) ? <div className="spinner-border spinner-18 text-secondary me-2" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div> : null
                            }
                            Bulk Action {(module?.bulkIds && module?.bulkIds.length > 0) ? '('+module?.bulkIds.length+' Selected)' : ''}
                            <i className="uil-angle-down ms-2"></i>
                        </button>
                        <div className="dropdown-menu dropdown-menu-end p-0">
                            <div className="card mb-0 p-2">
                                <div className="card-body p-0">
                                    <ul className="list-unstyled m-0">
                                        <li className="cursor-pointer" >
                                            <div className={`dropdown-item p-2 rounded ${((module?.bulkIds && module?.bulkIds.length <= 0) ? 'text-muted' : '')}`} onClick={async() => await bulkDelete(module?.bulkIds, activeCondition)}>
                                                <i className="uil-trash-alt me-2"></i>
                                                Delete
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div> : null
                }
                {
                    (availableActions.some(item => item === 'deal_board')) ? (
                        (settings?.activeLoader && settings?.activeLoader == 'dealView') ? <div className="d-flex align-items-center justify-content-center">
                                <div className="spinner-border text-primary m-1" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div> : (availableActions.some(item => item === 'deal_board') && settings?.activeView) ? <>
                                <button className={`btn ${(settings?.activeView == 'dealTable') ? 'btn-secondary' : 'btn-light'}`} onClick={async() => await onChangeView('dealTable')}>
                                    <i className="uil-grid"></i>
                                </button>
                                <button className={`btn ${(settings?.activeView == 'dealBoard') ? 'btn-secondary' : 'btn-light'}`} onClick={async() => await onChangeView('dealBoard')}>
                                    <i className="uil-grids"></i>
                                </button>
                            </> : null
                    ) : null
                }
                {
                    (availableActions.some(item => item === 'create')) ? <div className="d-flex flex-wrap align-items-start justify-content-md-end gap-2">
                        <button className="btn btn-purple" onClick={() => toggleSidebar(view)}>Create {capitalizeFirstLetter(makeSingular(view))}</button>
                    </div> : null
                }
                </div>
            </div>
        </div>
    )
};
const mapStateToProps = (state) => ({

});
const mapDispatchToProps = {

};
export default connect(mapStateToProps, mapDispatchToProps)(FilterBar);