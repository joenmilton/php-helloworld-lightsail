import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
    changeActivityForm,
    fetchDealActivityList,
    setFilter
} from '../../../../../../../redux';

const ActivitiesSearch = ({ activity, changeActivityForm, setFilter, fetchDealActivityList }) => {
    const [typingTimer, setTypingTimer] = useState(null);
    const doneTypingInterval = 800;
    const inputRef = useRef(null);
    const { dealId } = useParams();

    const onActivitySearch = (event) => {
        const input = event.target.value;
        if (input.length > 0) {
            clearTimeout(typingTimer);
            const timer = setTimeout(() => doneTyping(input), doneTypingInterval);
            setTypingTimer(timer);
        } else {
            doneTyping(input)
            clearTimeout(typingTimer);
        }
    }

    const doneTyping = async (input) => {
        const filterData = {
            ...activity.scrollList.filter,
            model_id: dealId,
            hasMore: true,
            q: input
        };
        await setFilter(filterData);
        await fetchDealActivityList(filterData, 'search');
    };

    const clearInput = () => {
        clearTimeout(typingTimer);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        doneTyping('');
    };

    
    const changeToForm = () => {
        changeActivityForm(true)
    }

    return (
        <div className="card-body pt-2">
            <div className="d-flex mt-3">
                <div className="overflow-hidden me-auto">
                    <h5 className="font-size-15 text-truncate logo-txt sub-text mb-1">
                        Manage Activities
                    </h5>
                    <p className="text-muted text-truncate mb-0">Schedule and manage activities with contacts and sales reps.</p>
                </div>
                <div className="align-self-end ms-2">
                    <button type="button" className="btn btn-purple" onClick={changeToForm}><i className="mdi mdi-plus me-1"></i> Add Activity</button>
                </div>
            </div>
            <div className="search-box mt-4">
                <div className="position-relative">
                    <div className="position-absolute d-flex align-items-center justify-content-center search-close" onClick={clearInput}>
                        <i className="uil-times-circle"></i>
                    </div>
                    <input 
                        type="text" 
                        className="form-control rounded bg-light border-2" 
                        placeholder="Search..." 
                        onChange={onActivitySearch} 
                        ref={inputRef}
                    />
                    <i className="bx bx-search search-icon"></i>
                </div>
            </div>
        </div>
    )
}
const mapStateToProps = (state) => ({
    activity: state.activity
});

const mapDispatchToProps = {
    changeActivityForm,
    setFilter,
    fetchDealActivityList
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivitiesSearch);