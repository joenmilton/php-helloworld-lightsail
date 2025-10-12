
import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { 
    setQuickUpdate,
    setQuickToggle,
    setInnerToggle
} from '../../../../../../../redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import the styles
import { formatFileSize, formatDate } from '../../../../../../../utils';

const ActivityCardFooter = ({ 
    activityItem, index, settings, saveLoading, 
    setQuickUpdate, setQuickToggle, setInnerToggle
}) => {

    const fileInputRef = useRef(null);
    const handleUploadButtonClick = () => {
        fileInputRef.current.click();
    };
    const onActivityQuickUpdate = async (data) => {

        if(data.type === 'attachment') {
            const formData = new FormData();
            
            formData.append('activity_id', data.activity_id);
            formData.append('type', data.type);
            formData.append('data', data.data);
            await setQuickUpdate(data, formData)
            return ;
        }

        const result  = await setQuickUpdate(data)
        if(result && data.type === 'comment') {
            cancelCommenting(data.activity_id)
        }
    };
    const quickToggle = (data) => {
        setQuickToggle(data)
    };
    const cancelCommenting = async (activityId) => {
        await setQuickToggle({activity_id: activityId, flag: '', key: 'comment_text' })
        await setQuickToggle({activity_id: activityId, flag: false, key: 'commenting_toggle' })
    };



    const onActivityInnerUpdate = async (data) => {
        await setQuickUpdate(data)
    };
    const innerToggle = (data) => {
        setInnerToggle(data)
    };
    const cancelInnerCommenting = async (activityId, commentId) => {
        await setInnerToggle({activity_id: activityId, key: 'comments', inner_id: commentId, inner_key: 'comment_text', flag: ''})
        await setInnerToggle({activity_id: activityId, key: 'comments', inner_id: commentId, inner_key: 'editing', flag: false})
    };



    return (
        <>
        <div className="card-footer py-3">
            <div className="d-flex justify-content-start align-items-center cursor-pointer user-select-none" onClick= {() => quickToggle({activity_id: activityItem.id, flag: !activityItem.attachments_toggle, key: 'attachments_toggle' })}>
                <div className="size-5 mr-3">
                    <i className="uil-paperclip fs-5"></i>
                </div>
                <div>
                    <h6 className="ff-primary mb-0">
                        Attachments ({activityItem?.media && activityItem?.media.length > 0 ? activityItem?.media.length : '0' })
                        {(activityItem.attachments_toggle) ? <i className="mdi mdi-chevron-down fs-5 ms-2"></i> : <i className="mdi mdi-chevron-right fs-5 ms-2"></i>}
                    </h6>
                </div>
            </div>
            <div className={`ml-8 mt-4 ${(activityItem.attachments_toggle) ? 'd-block' : 'd-none'}`}>

                {
                    (activityItem?.media && activityItem?.media.length > 0) ? activityItem?.media.map((media, index) => {
                        return (
                            <div key={index} className="d-flex align-items-start align-items-center justify-content-center mb-3">
                                <div className="flex-shrink-0 file-avatar rounded-circle me-3">
                                    <span className="progress-round d-flex w-100 flex-shrink-0 rounded-circle bg-success">
                                        <svg className="text-white d-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg>
                                    </span>
                                </div>
                                <div className="flex-grow-1 overflow-hidden">
                                    <h5 className="font-size-15 mb-1 text-truncate">
                                        {media.file_name} <span className="text-muted">{formatFileSize(media.file_size)}</span>
                                    </h5>
                                    <div className="text-muted">{formatDate(media.created_at)}</div>
                                </div>
                                <div className="flex-shrink-0 dropdown">
                                    <a href={media?.file_url} target="_blank" className="btn btn-light text-secondary px-2 py-1 me-2">
                                        View
                                    </a>
                                    <button className="btn btn-light text-secondary px-2 py-1">
                                        <i className="uil-times"></i>
                                    </button>
                                </div>
                            </div>
                        )
                    })  : <></>
                }


                <div className="d-flex justify-content-start align-items-center ml-8 mt-4">
                    <input
                        className="form-control"
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={(event) => onActivityQuickUpdate({activity_id: activityItem.id, data: event.target.files[0], type: 'attachment'})}
                    />
                    <button onClick={handleUploadButtonClick} className="btn btn-purple position-relative d-flex align-items-center px-4">
                        {(activityItem.activity_loader && activityItem.activity_loader === 'attachment') ? <div className="spinner-border text-secondary size-4 position-left"></div> : <></>}
                        <div>Select File</div>
                    </button>
                </div>
            </div>
        </div>
        {
            (activityItem?.comments && activityItem?.comments.length > 0) ? 
                <div className="card-footer py-3">
                    <div className="d-flex justify-content-start align-items-center cursor-pointer user-select-none" onClick= {() => quickToggle({activity_id: activityItem.id, flag: !activityItem.comments_toggle, key: 'comments_toggle' })}>
                        <div className="size-5 mr-3">
                            <i className="uil-comment-alt-message fs-5"></i>
                        </div>
                        <div>
                            <h6 className="ff-primary mb-0">
                                Comments ({activityItem?.comments.length})
                                {(activityItem.comments_toggle) ? <i className="mdi mdi-chevron-down fs-5 ms-2"></i> : <i className="mdi mdi-chevron-right fs-5 ms-2"></i>}
                            </h6>
                        </div>
                    </div>
                    <div className={`ml-8 mt-4 ${activityItem.comments_toggle ? 'd-block' : 'd-none'}`}>
                        <div className="">
                            {activityItem.comments && activityItem.comments.length > 0 ? (
                                activityItem.comments.map((comment, index) => (
                                    <div key={index}>

                                        <div className={`mb-3 ${(comment?.editing === true) ? 'd-block' : 'd-none'}`}>
                                            <div className="mb-2">
                                            <ReactQuill 
                                                value={comment.comment_text} 
                                                onChange={(value) => innerToggle({activity_id:activityItem.id, key: 'comments', inner_id:comment.id, inner_key: 'comment_text', flag: value})}
                                            />
                                            </div>
                                            <div className="d-flex align-items-center justify-content-end">
                                                <button className="btn btn-white me-2" onClick={() => cancelInnerCommenting(activityItem.id, comment.id)}>Cancel</button>
                                                <button type="button" disabled={(activityItem.activity_loader && activityItem.activity_loader === 'inner_comment')} onClick={() => onActivityInnerUpdate({activity_id: activityItem.id, data: comment.comment_text, type: 'inner_comment', inner_id: comment.id})} className="btn btn-purple">
                                                    {(activityItem.activity_loader && activityItem.activity_loader === 'inner_comment') ? 'Saving...' : 'Save'}
                                                </button>
                                            </div>
                                        </div>

                                        <div className={`mb-3 ${(comment?.editing !== true) ? 'd-block' : 'd-none'}`}>
                                            <div className="card m-0 mt-4 p-3">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div><strong>{comment?.user?.name}</strong> left a comment</div>
                                                    <div className="text-muted">{formatDate(comment?.created_at)}</div>
                                                </div>
                                                <div className="mt-4" dangerouslySetInnerHTML={{ __html: comment.body }}></div>
                                            </div>
                                            <div className="d-flex justify-content-end py-1">
                                                <div className="text-primary cursor-pointer me-2" onClick={() => innerToggle({activity_id:activityItem.id, key: 'comments', inner_id:comment.id, inner_key: 'editing', flag: true})}>Edit</div>
                                                <div className="text-danger cursor-pointer">Delete</div>
                                            </div>
                                        </div>

                                    </div>
                                ))
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </div>
            : <></>
        }
        
        <div className="card-footer card-footer-bg py-3">
            <div className="align-items-center">
                <div className={`justify-content-end align-items-center ${(activityItem.commenting_toggle) ? 'd-none' : 'd-flex'}`}>
                    <div className="card-link cursor-pointer text-primary user-select-none" onClick={() => quickToggle({activity_id: activityItem.id, flag: !activityItem.commenting_toggle, key: 'commenting_toggle' })}>+ Add Comment</div>
                </div>
                <div className={`${(activityItem.commenting_toggle) ? 'd-block' : 'd-none'}`}>
                    <div className="mb-2">
                        <ReactQuill value={activityItem.comment_text} onChange={(value) => quickToggle({activity_id: activityItem.id, flag: value, key: 'comment_text' })}/>
                    </div>
                    <div className="d-flex align-items-center justify-content-end">
                        <button className="btn btn-white me-2" onClick={() => cancelCommenting(activityItem.id)}>Cancel</button>
                        <button type="button" disabled={(activityItem.activity_loader && activityItem.activity_loader === 'comment')} onClick={() => onActivityQuickUpdate({activity_id: activityItem.id, data: activityItem.comment_text, type: 'comment'})} className="btn btn-purple">
                            {(activityItem.activity_loader && activityItem.activity_loader === 'comment') ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
const mapStateToProps = (state) => ({
    settings: state.common.settings,
    saveLoading: state.activity.saveLoading,
});

const mapDispatchToProps = {
    setQuickUpdate,
    setQuickToggle,
    setInnerToggle
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityCardFooter);