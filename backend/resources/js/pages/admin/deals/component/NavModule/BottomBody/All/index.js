import React, { useState } from 'react';
import DivScroll from './DivScroll';

export const All = () => {
    return (
        <div>
            <DivScroll />
        </div>
    )
}



// import React, { useEffect } from 'react';
// import { connect } from 'react-redux';

// const All = ({ type }) => {
//     return (
//         <div className="timeline">
//             <div className="timeline-item d-flex align-items-start">
//                 <div className="timeline-icon"><i className="fs-6 uil uil-plus"></i></div>
//                 <div className="timeline-content">
//                     <p className="mb-0">Admin associated <a href="#" className="text-primary">Jacobson-Lind</a></p>
//                 </div>
//             </div>
//             <div className="timeline-item d-flex align-items-start">
//                 <div className="timeline-icon"><i className="fs-6 uil uil-plus"></i></div>
//                 <div className="timeline-content">
//                     <p className="mb-0">Josiane Predovic PhD associated <a href="#" className="text-success">Keyon Lebsack</a></p>
//                 </div>
//             </div>
//             <div className="timeline-item d-flex align-items-start">
//                 <div className="timeline-icon"><i className="fs-6 uil uil-plus"></i></div>
//                 <div className="timeline-content">
//                     <p className="mb-0">The record has been created by Josiane Predovic PhD</p>
//                 </div>
//             </div>
//             <div className="timeline-item d-flex align-items-start">
//                 <div className="timeline-icon"><i className="fs-6 uil uil-plus"></i></div>
//                 <div className="timeline-content">
//                     <p className="mb-0">New call has been logged</p>
//                     <span className="text-muted">- June 20, 2024 15:00</span>
//                     <div className="call-details mt-3 p-3">
//                         <div className="d-flex align-items-center">
//                             <div className="me-2"><i className="bi bi-clock-history"></i></div>
//                             <p className="mb-0"><strong>Josiane Predovic PhD</strong> logged a call on March 16, 2024 22:57</p>
//                             <div className="ms-auto"><span className="badge bg-warning text-dark">Left voice message</span></div>
//                         </div>
//                         <p className="mt-2">Et harum et porro dolore voluptatem. Minus cupiditate vero perferendis occaecati odio. Est ut necessitatibus rerum blanditiis enim provident. Error sed voluptates ut natus eos ipsam.</p>
//                     </div>
//                     <a href="#" className="pin-link">Pin on top</a>
//                 </div>
//             </div>
//         </div>
//     )
// }
// const mapStateToProps = (state) => ({

// });

// const mapDispatchToProps = {

// };

// export default connect(mapStateToProps, mapDispatchToProps)(All);