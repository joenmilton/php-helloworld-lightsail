import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import NoSplit from './screen/NoSplit';
import ServiceSplit from './screen/ServiceSplit';
import { savePaymentAttachment, setActivePaymentMedia } from '../../../../../../../redux';

const Payments = ({ 
    saveLoading, settingsInitialized, settings, popupMedia,
    savePaymentAttachment, setActivePaymentMedia
}) => {
    const createFilterRef               = useRef(null);
    const modalElementRef               = useRef(null);
    const fileInputRef                  = useRef(null);

    const [errors, setError]            = useState({});

    useEffect(() => {
        const modalElement = createFilterRef.current;
        modalElementRef.current = modalElement;
    }, []);

    const renderContent = () => {
        if (!settingsInitialized) return <>
            <div className="d-flex align-items-center justify-content-center">
                <div className="spinner-border text-primary m-1" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        </>;

        switch (settings?.payment_screen) {
            case 'no_split':
                return <NoSplit />;
            case 'service_split':
                return <ServiceSplit />;
            default:
                return null;
        }
    }

    const handleFileChange = async (e, payment, payment_screen) => {
        setError({})

        const response = await savePaymentAttachment(payment, e.target.files[0], payment_screen);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        if(response.httpCode == 422) {
            setError(response.errors)
        }

        if(response.httpCode === 200) {
            setActivePaymentMedia(payment.id, payment_screen, payment?.product_id)
        }
    }

    return (
        <div className="card-body pt-2">
            <div className="d-block">
                <div ref={createFilterRef} className="modal fade bs-payment-modal-lg" tabIndex="-1" aria-labelledby="mySmallModalLabel" aria-hidden="true" style={{ display: 'none' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content bg-white">
                            <div className="modal-header border-0">
                                <h5 className="modal-title">
                                    Payment Receipts
                                </h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-6">
                                        <div className="row">
                                            {
                                                (saveLoading) ? <div className="d-flex align-items-center justify-content-center">
                                                    <div className="spinner-border text-primary m-1" role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                </div> : 
                                                (popupMedia?.media.length > 0) ? popupMedia?.media.map((media, index) => {
                                                    return (
                                                        <div key={index} className="col-4">
                                                            <div className="border border-1 mb-2">
                                                                <a href={media?.file_url} target="_blank" rel="noopener noreferrer">
                                                                    <img src={media?.file_url} className="img-fluid" alt={`media-${index}`} />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )
                                                }) : <div className="col-12">
                                                    <div className="text-center">No payment receipt attached!</div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="text-center">
                                            <div className="mb-3">
                                                <label className="form-label" htmlFor="attachment">Add Attachment</label>
                                                <input 
                                                    type="file"
                                                    id="attachment"
                                                    name="attachment"
                                                    ref={fileInputRef}
                                                    onChange={(event) => handleFileChange(event, popupMedia, settings?.payment_screen)}
                                                    className="form-control"
                                                />
                                                {errors['attachment'] && (
                                                    <div className="d-block invalid-feedback">
                                                        {errors['attachment'].join(', ')}
                                                    </div>
                                                )}
                                            </div>
                                            {/* <div className="mb-3">OR Update Info</div> */}
                                        </div>

                                        {/* <div className="text-start">
                                            <div className="mb-3">
                                                <label className="form-label" htmlFor="attachment">Add Attachment</label>
                                                <input />
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="py-2">
                    {renderContent()}
                </div>
            </div>
        </div>
    )
}
const mapStateToProps = (state) => ({
    saveLoading: state.payment?.saveLoading,
    settingsInitialized: state.payment?.settingsInitialized,
    settings: state.payment?.settings,
    popupMedia: state.payment?.popupMedia
});

const mapDispatchToProps = {
    savePaymentAttachment,
    setActivePaymentMedia
};

export default connect(mapStateToProps, mapDispatchToProps)(Payments);