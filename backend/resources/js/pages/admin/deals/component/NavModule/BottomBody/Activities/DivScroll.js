import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useParams } from 'react-router-dom';

import { 
    fetchDealActivityList,
    setFilter
} from '../../../../../../../redux';

import ActivityCardHeader from './ActivityCardHeader'
import ActivityCardBody from './ActivityCardBody'
import ActivityCardFooter from './ActivityCardFooter';

const DivScroll = ({ saveLoading, settings, activity, setFilter, fetchDealActivityList }) => {
    const { dealId } = useParams();

    useEffect(() => {
        const initialize = async () => {
            const filterData = {
                ...activity.scrollList.filter,
                model_id: dealId,
                page: 1,
                hasMore: false
            };
            await setFilter(filterData);
            await fetchDealActivityList(filterData, 'fetch');
        };

        if (!activity.scrollList.initialized) {
            initialize();
        }
    }, [dealId, activity?.scrollList?.initialized, setFilter, fetchDealActivityList]);

    useEffect(() => {
        // console.log(activity);
    }, [activity]);

    const fetchNext = () => {
        if(activity?.scrollList?.hasMore && !activity?.scrollList?.loading) {
            const nextFilter = {
                ...activity.scrollList.filter,
                page: activity.scrollList.filter.page,
                hasMore: true
            };
            fetchDealActivityList(nextFilter);
        }
    };

    return (
        <div>
            <InfiniteScroll
                dataLength={activity?.scrollList?.data.length}
                next={fetchNext}
                hasMore={activity?.scrollList?.hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={
                    <p className="pt-4" style={{ textAlign: 'center' }}>
                        <b>Yay! You have seen it all</b>
                    </p>
                }
            >
                {activity?.scrollList?.data.map((activityItem, index) => (
                    <div key={index} style={itemStyle}>
                        <div className="card">
                            <ActivityCardHeader activityItem={activityItem} index={index}/>
                            <ActivityCardBody activityItem={activityItem} index={index}/>
                            <ActivityCardFooter activityItem={activityItem} index={index}/>
                        </div>
                    </div>
                ))}
            </InfiniteScroll>
        </div>
    )
}

const itemStyle = {

};

const mapStateToProps = (state) => ({
    saveLoading: state.activity.saveLoading,
    settings: state.common.settings,
    activity: state.activity
});

const mapDispatchToProps = {
    setFilter,
    fetchDealActivityList
};

export default connect(mapStateToProps, mapDispatchToProps)(DivScroll);
