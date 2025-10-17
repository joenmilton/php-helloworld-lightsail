
import React, { useEffect, useRef, useContext, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { SidebarContext } from '../../../components/Sidebar/contexts/SidebarContext';
import DealTable from './component/DealTable';
import Filter from '../../../components/Filter';
import { 
    loadDealSettings, setDefaultFilter,
    fetchDealList , updateDealSearchQuery, changeDealView
} from '../../../redux';

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

function ListDeal({
    settingsInitialized, settings, activeCondition,
    deal,
    loadDealSettings, setDefaultFilter, fetchDealList, updateDealSearchQuery, changeDealView
}) {
    const history = useHistory();
    const { toggleSidebar }         = useContext(SidebarContext);
    const  dropdownMenuRef          = useRef(null);

    const [typingTimer, setTypingTimer]         = useState(null);
    const doneTypingInterval = 800;
    const dealSearchInputRef = useRef(null);

    useEffect(async() => {
        if(!settingsInitialized) {
            const response = await loadDealSettings();
            if(response.httpCode === 200 && response?.data?.activeView === 'dealBoard') {
                history.push(`/admin/deals/board`);
            }
        }
    }, [settingsInitialized])
    
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
            q: deal?.searchQuery,
            sortOrder: deal?.sortOrder,
            page: deal?.list?.current_page,
            per_page: deal?.list?.per_page,
        }

        await setDefaultFilter(defaultFilter)
        await fetchDealList(queryFilter, defaultFilter);
    }
    
    const setActiveCondition = async(filter) => {

        const queryFilter = {
            q: deal?.searchQuery,
            sortOrder: deal?.sortOrder,
            page: deal?.list?.current_page,
            per_page: deal?.list?.per_page,
        }

        await setDefaultFilter(filter)
        await fetchDealList(queryFilter, filter);

        if (dropdownMenuRef.current) {
            if(dropdownMenuRef.current.classList.contains('show')) {
                dropdownMenuRef.current.classList.remove('show');
            }
        }
    }








    const onDealSearch = (event, condition) => {
        const input = event.target.value;
        updateDealSearchQuery(input)

        if (input.length > 0) {
            clearTimeout(typingTimer);
            const timer = setTimeout(() => doneTyping(input, condition), doneTypingInterval);
            setTypingTimer(timer);
        } else {
            doneTyping(input)
            clearTimeout(typingTimer);
        }
    }

    const doneTyping = async (input, condition) => {
        const queryFilter = {
            q: input,
            sortOrder: deal?.sortOrder,
            page: deal?.list?.current_page,
            per_page: deal?.list?.per_page,
        }
        await fetchDealList(queryFilter, condition);
    };


    const changeView = async (view) => {
        const newSettings = {
            ...settings,
            activeView: view
        }
        const result = await changeDealView(newSettings);

        if(result.httpCode === 200 && result?.data?.activeView === 'dealBoard') {
            history.push(`/admin/deals/board`);
        }
    }

    const handleFilterChange = async(currentFilter) => {
        const queryFilter = {
            q: deal?.searchQuery,
            sortOrder: deal?.sortOrder,
            page: deal?.list?.current_page,
            per_page: deal?.list?.per_page,
        }

        await fetchDealList(queryFilter, currentFilter);
    }

    return (
        <>
        {
            (settingsInitialized) ? <div className="container-fluid">
                <div className="row mb-2">

                    <div className="col-12">
                        <Filter settings={settings} view={`deals`} onFilterChange={async(data) => handleFilterChange(data)}/>
                    </div>

                    <div className="col-md-6">
                        <div className="btn-toolbar">
                            <div className="btn-group me-2 mb-2 mb-sm-0">
                                <input 
                                    onChange={(event) => onDealSearch(event, activeCondition)} 
                                    ref={dealSearchInputRef}
                                    value={deal?.searchQuery}
                                    placeholder="Search..."
                                    type="text" 
                                    className="form-control bg-white shadow-sm ring-1 ring-neutral-300 input-width-350"
                                />
                            </div>
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
                        <div className="d-flex flex-wrap align-items-start justify-content-md-end mt-2 mt-md-0 gap-2 mb-3">
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
                    <div className="col-md-12">
                        <DealTable />
                    </div>
                </div>
            </div> : null
        }

        </>
    )
}

const mapStateToProps = (state) => ({
    settingsInitialized: state.deal.settingsInitialized,
    settings: state.deal.settings,
    activeCondition: state.deal.activeCondition,

    deal: state.deal
});

const mapDispatchToProps = {
    loadDealSettings,
    setDefaultFilter,
    fetchDealList,
    updateDealSearchQuery,
    changeDealView
};
  
export default connect(mapStateToProps, mapDispatchToProps)(ListDeal);