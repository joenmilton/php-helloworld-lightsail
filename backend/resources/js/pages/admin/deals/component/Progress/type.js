import React from 'react';

export function Type({ status, type, labelValue, stageId, processing }) {
    switch (type) {
        case 'present':
            return <Present status={status} label={labelValue} stage={stageId} processing={processing}/>;
        case 'future':
            return <Future status={status} label={labelValue} stage={stageId} processing={processing}/>;
        case 'past':
            return <Past status={status} label={labelValue} stage={stageId} processing={processing}/>;
        default:
            return null;
    }
}

export function Past({status, label, stage, processing}) {
    return (
        <span className="d-flex align-items-center px-4 py-2 text-base font-medium">
            {
                (status === '1') ? 
                <span className="progress-round d-flex size-7 flex-shrink-0 align-items-center justify-content-center rounded-circle bg-success">
                    <svg className={`size-6 text-white ${processing == stage ? 'd-none' : 'd-block'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg>
                    <svg data-slot="icon" className={`animate-spin size-6 text-neutral-500 ${processing == stage ? 'd-block' : 'd-none'}`}  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-loading=""><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                </span> : (status === '2') ? 
                <span className="progress-round d-flex size-7 flex-shrink-0 align-items-center justify-content-center rounded-circle bg-success">
                    <svg className={`size-6 text-white ${processing == stage ? 'd-none' : 'd-block'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg>
                </span> : 
                <span className="progress-round d-flex size-7 flex-shrink-0 align-items-center justify-content-center rounded-circle bg-danger">
                    <svg className={`size-6 text-white ${processing == stage ? 'd-none' : 'd-block'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z"></path></svg>
                </span>
            }
            <span className="ms-3 fw-bold">{label}</span>
        </span>
    );
}

export function Present({status, label, stage, processing}) {
    return (
        <span className="d-flex align-items-center px-4 py-2 text-base font-medium">
            {
                (status === '1') ? 
                <>
                    <span className="progress-round d-flex size-7 flex-shrink-0 align-items-center justify-content-center rounded-circle border-neutral-400 border-success">
                        <svg className={`size-6 text-success ${processing == stage ? 'd-none' : 'd-block'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg>
                        <svg data-slot="icon" className={`animate-spin size-6 text-neutral-500 ${processing == stage ? 'd-block' : 'd-none'}`}  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-loading=""><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    </span>
                    <span className="ms-3 fw-bold">{label}</span>
                </> : (status === '2') ? 
                <>
                    <span className="progress-round d-flex size-7 flex-shrink-0 align-items-center justify-content-center rounded-circle bg-success">
                        <svg className={`size-6 text-white ${processing == stage ? 'd-none' : 'd-block'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg>
                    </span>
                    <span className="ms-3 fw-bold">{label}</span>
                </> : 
                <>
                    <span className="progress-round d-flex size-7 flex-shrink-0 align-items-center justify-content-center rounded-circle bg-danger">
                        <svg className={`size-6 text-white ${processing == stage ? 'd-none' : 'd-block'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z"></path></svg>
                    </span>
                    <span className="ms-3 fw-bold" style={{color: '#64748b'}}>{label}</span>
                </>
            }
        </span>
    );
}

export function Future({status, label, stage, processing}) {
    return (
        <span className="d-flex align-items-center px-4 py-2 text-base font-medium">
            {
                (status === '1') ? 
                <span className="progress-round d-flex size-7 flex-shrink-0 align-items-center justify-content-center rounded-circle rounded-circle border-neutral-400 border-gray">
                    <svg className={`size-6 text-gray ${processing == stage ? 'd-none' : 'd-block'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z"></path></svg>
                    <svg data-slot="icon" className={`animate-spin size-6 text-neutral-500 ${processing == stage ? 'd-block' : 'd-none'}`}  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-loading=""><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                </span> : 
                (status === '2') ?
                <span className="progress-round d-flex size-7 flex-shrink-0 align-items-center justify-content-center rounded-circle border-neutral-400 border-success">
                    <svg className={`size-6 text-success ${processing == stage ? 'd-none' : 'd-block'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg>
                </span> : 
                <span className="progress-round d-flex size-7 flex-shrink-0 align-items-center justify-content-center rounded-circle border-neutral-400 border-danger">
                    <svg className={`size-6 text-danger ${processing == stage ? 'd-none' : 'd-block'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z"></path></svg>
                </span>
            }
            <span className="ms-3 fw-bold">{label}</span>
        </span>
    );
}