import React, { useState, useEffect } from "react";
import TopBar from "./TopBar";
import SideNavigation from "./SideNavigation";

const Layout = ({ children }) => {
    // Track sidebar state in component
    const [sidebarSize, setSidebarSize] = useState("lg");
    const [sidebarEnabled, setSidebarEnabled] = useState(false);

    // Initialize sidebar size when component mounts
    useEffect(() => {
        const handleInitialResize = () => {
            if (window.innerWidth >= 1024 && window.innerWidth <= 1366) {
                document.body.setAttribute('data-sidebar-size', 'sm');
                setSidebarSize("sm");
            }
        };

        // Set initial size
        handleInitialResize();
        
        // Add resize listener
        window.addEventListener("resize", handleInitialResize);
        
        // Cleanup listener
        return () => {
            window.removeEventListener("resize", handleInitialResize);
        };
    }, []);

    // Update body classes/attributes when state changes
    useEffect(() => {
        if (sidebarEnabled) {
            document.body.classList.add('sidebar-enable');
        } else {
            document.body.classList.remove('sidebar-enable');
        }
        
        document.body.setAttribute('data-sidebar-size', sidebarSize);
    }, [sidebarSize, sidebarEnabled]);

    const toggleSidebar = (e) => {
        e.preventDefault();
        const newSidebarEnabled = !sidebarEnabled;
        setSidebarEnabled(newSidebarEnabled);
        
        if (window.innerWidth >= 992) {
            const currentSize = document.body.getAttribute('data-sidebar-size');
            
            if (currentSize === null || currentSize === "lg") {
                setSidebarSize("sm");
            } else if (currentSize === "md") {
                setSidebarSize(currentSize === "md" ? "sm" : "md");
            } else {
                setSidebarSize(currentSize === "sm" ? "lg" : "sm");
            }
        }
    };


    return (
        <div id="layout-wrapper">
            {/* Top bar
            Side Bar */}
            <TopBar toggleSidebar={toggleSidebar}/>
            <SideNavigation toggleSidebar={toggleSidebar}/>
            <div className="main-content">
                <div className="page-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
