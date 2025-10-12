import React, { useContext } from 'react';
import { SidebarContext } from './contexts/SidebarContext'; 
import DealForm from '../../pages/admin/deals/component/EditForm';
import AdminForm from '../../pages/admin/admin/component/EditForm';
import RoleForm from '../../pages/admin/role/component/EditForm';
import TeamForm from '../../pages/admin/team/component/EditForm';
import ContactForm from '../../pages/admin/contact/component/EditForm';
import ProductForm from '../../pages/admin/products/component/EditForm';
import ServiceForm from '../../pages/admin/service/component/EditForm';
import PaymentForm from '../../pages/admin/payment/component/EditForm';
import JournalForm from '../../pages/admin/journal/component/EditForm';
import JournalProcessingForm from '../../pages/admin/journal_processing/component/EditForm';
import ProcessRevisionForm from '../../pages/admin/process_revision/component/EditForm';
import ProcessProofForm from '../../pages/admin/process_proof/component/EditForm';
import ProcessSheetForm from '../../pages/admin/process_sheet/component/EditForm';
import ActivityForm from '../../pages/admin/activity/component/EditForm';
import BankForm from '../../pages/admin/bank/component/EditForm';

const Sidebar = () => {
    const { isOpen, toggleSidebar, formType, formId, parentData } = useContext(SidebarContext);

    if (!isOpen) return null;

    const renderForm = () => {
        switch (formType) {
            case 'deals':
            return <DealForm parentData={parentData} id={formId} formType={formType} onClose={(type) => toggleSidebar(type)} />;

            case 'admin':
            return <AdminForm parentData={parentData} id={formId} formType={formType} onClose={(type) => toggleSidebar(type)} />;
            
            case 'role':
            return <RoleForm parentData={parentData} id={formId} formType={formType} onClose={(type) => toggleSidebar(type)} />;

            case 'team':
            return <TeamForm parentData={parentData} id={formId} formType={formType} onClose={(type) => toggleSidebar(type)} />;

            case 'bank':
            return <BankForm parentData={parentData} id={formId} formType={formType} onClose={(type) => toggleSidebar(type)} />;

            case 'deal_contact':
            return <ContactForm parentData={parentData} id={formId} formType={formType} onClose={(type) => toggleSidebar(type)} />;

            case 'product':
            return <ProductForm parentData={parentData} id={formId} formType={formType} onClose={(type) => toggleSidebar(type)} />;

            case 'services':
            return <ServiceForm parentData={parentData} id={formId} formType={formType} onClose={(type) => toggleSidebar(type)} />;

            case 'payments':
            return <PaymentForm parentData={parentData} id={formId} formType={formType} onClose={(type) => toggleSidebar(type)} />;
    
            case 'deal_journal':
            return <JournalForm parentData={parentData} id={formId} formType={formType} onClose={(type) => toggleSidebar(type)} />;
            
            case 'journal_processing':
            return <JournalProcessingForm parentData={parentData} id={formId} formType={formType} onClose={(type) => toggleSidebar(type)} />;

            case 'process_revision':
            return <ProcessRevisionForm parentData={parentData} id={formId} formType={formType} onClose={(type) => toggleSidebar(type)} />;

            case 'process_proof':
                return <ProcessProofForm parentData={parentData} id={formId} formType={formType} onClose={(type) => toggleSidebar(type)} />;

            case 'process_sheet':
                return <ProcessSheetForm parentData={parentData} id={formId} formType={formType} onClose={(type) => toggleSidebar(type)} />;

            case 'activities':
            return <ActivityForm parentData={parentData} id={formId} formType={formType} onClose={(type) => toggleSidebar(type)} />;
                
            default:
            return null;
        }
    };

    return (
    <div>
        <div className="sidebar-overlay"></div>
        <div className="sidebar right-bar">
            {renderForm()}
        </div>
    </div>

    );
};

export default Sidebar;