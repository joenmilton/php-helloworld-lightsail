import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useParams } from 'react-router-dom';
import { formatDate } from '../../../../../../../utils';

import { 
    fetchTimeline,
    setTimelineFilter
} from '../../../../../../../redux';

const DivScroll = ({ timeline, setTimelineFilter, fetchTimeline }) => {
    const { dealId } = useParams();

    useEffect(() => {
        const initialize = async () => {
            const filterData = {
                ...timeline.list.filter,
                fresh: true,
                page: 1,
                model_id: dealId,
                hasMore: false
            };
            await setTimelineFilter(filterData);
            await fetchTimeline(dealId, filterData);
        };

        initialize();
    }, [dealId, fetchTimeline]);

    const fetchNext = async (dealId) => {
        if(timeline?.list?.hasMore && !timeline?.list?.loading) {
            const nextFilter = {
                ...timeline.list.filter,
                page: timeline.list.filter.page,
                fresh: false,
                hasMore: true
            };
            await fetchTimeline(dealId, nextFilter);
        }
    };

    return (
        <div>
            {
                timeline?.list?.loading ? <div className="d-flex align-items-center justify-content-center"><div className="spinner-border text-primary m-1" role="status"><span className="sr-only">Loading...</span></div></div> : <InfiniteScroll
                    dataLength={timeline?.list?.data.length}
                    next={() => fetchNext(dealId)}
                    hasMore={timeline?.list?.hasMore}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                        <p className="pt-4" style={{ textAlign: 'center' }}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                >
                    <div className="timeline">
                        {timeline?.list?.data.map((timelineItem, index) => (
                            <div key={index} style={itemStyle} className="timeline-item d-flex align-items-start">
                                <div className="timeline-icon"><i className="fs-6 uil uil-plus"></i></div>
                                <div className="timeline-content">
                                    <p className="mb-0"> <span dangerouslySetInnerHTML={{ __html: timelineItem.timeline_message }}></span> - <span className="text-muted">{formatDate(timelineItem.updated_at, 'datetime')}</span></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </InfiniteScroll>
            }

        </div>
    )
}

const itemStyle = {

};

const mapStateToProps = (state) => ({
    timeline: state.timeline
});

const mapDispatchToProps = {
    fetchTimeline,
    setTimelineFilter
};

export default connect(mapStateToProps, mapDispatchToProps)(DivScroll);
