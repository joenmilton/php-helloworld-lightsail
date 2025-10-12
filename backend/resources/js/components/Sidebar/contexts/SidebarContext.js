import React, { createContext, useState } from 'react';

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [formType, setFormType] = useState(null);
    const [formId, setFormId] = useState(null);
    const [parentData, setParentData] = useState(null);

    const toggleSidebar = (type = null, id = null, newData = null) => {
        setIsOpen(!isOpen);
        setFormType(type);
        setFormId(id);
        setParentData(newData);
    };

    return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar, formType, formId, parentData }}>
        {children}
    </SidebarContext.Provider>
    );
};