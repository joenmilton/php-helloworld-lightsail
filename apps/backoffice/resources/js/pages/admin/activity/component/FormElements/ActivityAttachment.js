import React, { useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { formatDate, formatFileSize } from '../../../../../utils';
import { 
    setDetailQuickUpdate,
    setDetailQuickToggle
} from '../../../../../redux';

const ActivityAttachment = ({ 
    activity,
    setDetailQuickUpdate, setDetailQuickToggle
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
            await setDetailQuickUpdate(data, formData)
            return ;
        }
    };

    const quickToggle = (data) => {
        setDetailQuickToggle(data)
    };

    return (
        <>
            <div className="d-flex justify-content-start align-items-center cursor-pointer user-select-none mb-4" onClick= {() => quickToggle({activity_id: activity.id, flag: !activity.attachments_toggle, key: 'attachments_toggle' })}>
                <div className="size-5 mr-3">
                    <i className="uil-paperclip fs-5"></i>
                </div>
                <div>
                    <h6 className="ff-primary mb-0">
                        Attachments ({activity?.media && activity?.media.length > 0 ? activity?.media.length : '0' })
                        {(activity.attachments_toggle) ? <i className="mdi mdi-chevron-down fs-5 ms-2"></i> : <i className="mdi mdi-chevron-right fs-5 ms-2"></i>}
                    </h6>
                </div>
            </div>

            <div className={`ml-8 mb-4 ${(activity.attachments_toggle) ? 'd-block' : 'd-none'}`}>
                {
                    (activity?.media && activity?.media.length > 0) ? activity?.media.map((media, index) => {
                        return (
                            <div key={index} className="d-flex align-items-start align-items-center justify-content-center mb-3 me-4">
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
                    })  : null
                }


                <div className="d-flex justify-content-start align-items-center">
                    <input
                        className="form-control"
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={(event) => onActivityQuickUpdate({activity_id: activity.id, data: event.target.files[0], type: 'attachment'})}
                    />
                    <button onClick={handleUploadButtonClick} className="btn btn-purple position-relative d-flex align-items-center px-4">
                        {(activity.activity_loader && activity.activity_loader === 'attachment') ? <div className="spinner-border text-secondary size-4 position-left"></div> : <></>}
                        <div>Select File</div>
                    </button>
                </div>
            </div>
        </>
    );
};
const mapStateToProps = (state) => ({
    activity: state.activity?.detail
});
const mapDispatchToProps = {
    setDetailQuickUpdate, 
    setDetailQuickToggle
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityAttachment);