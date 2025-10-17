import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { formatDate } from '../../../../../utils';
import { 
    setDetailQuickUpdate,
    setDetailQuickToggle,
    setDetailInnerToggle
} from '../../../../../redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import the styles

const ActivityComment = ({ 
    activity,
    setDetailQuickUpdate, setDetailQuickToggle, setDetailInnerToggle
}) => {

    const onActivityQuickUpdate = async (data) => {

        const result  = await setDetailQuickUpdate(data)
        if(result && data.type === 'comment') {
            await cancelCommenting(data.activity_id)
        }
    };

    const quickToggle = (data) => {
        setDetailQuickToggle(data)
    };

    const cancelCommenting = async (activityId) => {
        await setDetailQuickToggle({activity_id: activityId, flag: '', key: 'comment_text' })
        await setDetailQuickToggle({activity_id: activityId, flag: false, key: 'commenting_toggle' })
    };


    const onActivityInnerUpdate = async (data) => {
        await setDetailQuickUpdate(data)
    };

    const innerToggle = (data) => {
        setDetailInnerToggle(data)
    };
    const cancelInnerCommenting = async (activityId, commentId) => {
        await setDetailInnerToggle({activity_id: activityId, key: 'comments', inner_id: commentId, inner_key: 'editing', flag: false})
    };



    return (
        <>
            <div className="d-flex justify-content-start align-items-center cursor-pointer user-select-none">
                <div className="size-5 mr-3">
                    <i className="uil-comment-alt-message fs-5"></i>
                </div>
                <div>
                    <h6 className="ff-primary mb-0"  onClick= {() => quickToggle({activity_id: activity.id, flag: !activity.comments_toggle, key: 'comments_toggle' })}>
                        Comments ({activity?.comments && activity?.comments.length > 0 ? activity?.comments.length : '0' })
                        {(activity.comments_toggle) ? <i className="mdi mdi-chevron-down fs-5 ms-2"></i> : <i className="mdi mdi-chevron-right fs-5 ms-2"></i>}
                    </h6>
                </div>
            </div>
            <div className={`justify-content-end align-items-center ${(activity.commenting_toggle) ? 'd-none' : 'd-flex'}`}>
                <div className="card-link cursor-pointer text-primary user-select-none" onClick={() => quickToggle({activity_id: activity.id, flag: !activity.commenting_toggle, key: 'commenting_toggle' })}>+ Add Comment</div>
            </div>
            <div className="align-items-center">
                <div className={`${(activity.commenting_toggle) ? 'd-block' : 'd-none'}`}>
                    <div className="mb-2">
                        <ReactQuill value={activity.comment_text} onChange={(value) => quickToggle({activity_id: activity.id, flag: value, key: 'comment_text' })}/>
                    </div>
                    <div className="d-flex align-items-center justify-content-end">
                        <button className="btn btn-white me-2" onClick={() => cancelCommenting(activity.id)}>Cancel</button>
                        <button type="button" disabled={(activity.activity_loader && activity.activity_loader === 'comment')} onClick={() => onActivityQuickUpdate({activity_id: activity.id, data: activity.comment_text, type: 'comment'})} className="btn btn-purple">
                            {(activity.activity_loader && activity.activity_loader === 'comment') ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>


            <div className={`mt-4 chat-conversation ${activity.comments_toggle ? 'd-block' : 'd-none'}`}>
                <ul className="list-unstyled mb-0">
                {
                    (activity.comments && activity.comments.length > 0) ? (
                        activity.comments.map((comment, index) => (

                            <li key={index} className={(comment?.is_author) ? `right` : ``}>
                                {
                                    (comment?.is_author) ? <div className={`mb-3 ${(comment?.editing === true) ? 'd-block' : 'd-none'}`}>
                                        <div className="mb-2">
                                            <ReactQuill 
                                                value={comment.comment_text} 
                                                onChange={(value) => innerToggle({activity_id:activity.id, key: 'comments', inner_id:comment.id, inner_key: 'comment_text', flag: value})}
                                            />
                                        </div>
                                        <div className="d-flex align-items-center justify-content-end">
                                            <button className="btn btn-white me-2" onClick={() => cancelInnerCommenting(activity.id, comment.id)}>Cancel</button>
                                            <button type="button" disabled={(activity.activity_loader && activity.activity_loader === 'inner_comment')} onClick={() => onActivityInnerUpdate({activity_id: activity.id, data: comment.comment_text, type: 'inner_comment', inner_id: comment.id})} className="btn btn-purple">
                                                {(activity.activity_loader && activity.activity_loader === 'inner_comment') ? 'Saving...' : 'Save'}
                                            </button>
                                        </div>
                                    </div> : null
                                }
                                <div className={`conversation-list mb-3 ${(comment?.editing !== true) ? 'd-block' : 'd-none'}`}>
                                    <div className="ctext-wrap">
                                        <div className="chat-avatar">
                                            <div><strong>{comment?.user?.name}</strong></div>
                                            <div className="font-size-12 text-muted" data-bs-toggle="tooltip" data-bs-placement="top" title={formatDate(comment?.created_at, 'datetime')}>{formatDate(comment?.created_at, 'time')}</div>
                                            <div className="font-size-12 text-muted">{formatDate(comment?.created_at, 'shortdate')}</div>
                                        </div>
                                        <div className="ctext-wrap-content text-wrap text-break" dangerouslySetInnerHTML={{ __html: comment.body}}></div>
                                        {
                                            (comment?.is_owner) ? <div className="dropdown align-self-start">
                                                <div className="dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    <i className="uil uil-ellipsis-v"></i>
                                                </div>
                                                <div className="dropdown-menu">
                                                    <div className="dropdown-item" onClick={() => innerToggle({activity_id:activity.id, key: 'comments', inner_id:comment.id, inner_key: 'editing', flag: true})}>Edit</div>
                                                    <div className="dropdown-item text-muted">Delete</div>
                                                </div>
                                            </div> : null
                                        }
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : null
                }
                </ul>
            </div>
        </>
    );
};
const mapStateToProps = (state) => ({
    activity: state.activity?.detail
});
const mapDispatchToProps = {
    setDetailQuickUpdate, 
    setDetailQuickToggle,
    setDetailInnerToggle
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityComment);