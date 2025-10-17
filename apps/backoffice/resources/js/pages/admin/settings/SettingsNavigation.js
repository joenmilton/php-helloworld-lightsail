import React, { useState, useEffect } from 'react';
import AdminSettingsNav from '../../../components/AdminSettingsNav';

const SettingsNavigation = ({ children, currentPath = '' }) => {

    return (
        <div className="container">
            <div className="row mb-2">
                <div className="col-md-3">
                    <nav className="sticky-nav">
                        <div className="custom-accordion">
                            <AdminSettingsNav currentPath={currentPath}/>
                        </div>
                    </nav>
                </div>
                <div className="col-md-9">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default SettingsNavigation;