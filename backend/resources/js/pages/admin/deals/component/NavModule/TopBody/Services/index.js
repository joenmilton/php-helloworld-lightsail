import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
    fetchBillable
} from '../../../../../../../redux';
import { SidebarContext } from '../../../../../../../components/Sidebar/contexts/SidebarContext';

const Services = ({
    initialized, 
    viewBillable, 
    saveLoading, 
    fetchBillable 
}) => {
    const { dealId } = useParams();
    const { toggleSidebar } = useContext(SidebarContext);

    useEffect(() => {
        const initialize = async () => {
            await fetchBillable(dealId);
        };

        initialize();
    }, [dealId]);

    const openServicesForm = (dealId) => {
        toggleSidebar('services', dealId)
    }

    return (
        <div className="card-body pt-2">
            <div className="d-flex my-3">
                <div className="overflow-hidden me-auto">
                    <h5 className="font-size-15 text-truncate logo-txt sub-text mb-1">
                        Service Summary
                    </h5>
                    <p className="text-muted text-truncate mb-0">Manage services with add or update.</p>
                </div>
                <div className="align-self-end ms-2">
                    <button type="button" className="btn btn-purple" onClick={() => openServicesForm(dealId)}>Add / Update Service</button>
                </div>
            </div>
            <div className="d-block">
                <div className="py-2">
                {
                    (!initialized) ? <div className="d-flex align-items-center justify-content-center">
                        <div className="spinner-border text-primary m-1" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div> : 

                    <div className="table-responsive">
                        <table className="table align-middle table-nowrap table-centered mb-0">
                            <thead>
                                <tr>
                                    <th style={{width:'70px'}}>No.</th>
                                    <th>Service</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Discount</th>
                                    <th className="text-end" style={{width:'120px'}}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                (viewBillable?.products) ? viewBillable?.products.map((product, index) => {
                                    const discount = product.discount_type === 'percent' 
                                        ? ((Number(product.unit_price) * Number(product.qty) * Number(product.discount_total)) / 100) 
                                        : Number(product.discount_total);
                                    return (
                                        <tr key={index}>
                                            <th scope="row">{String(index + 1).padStart(2, '#')}</th>
                                            <td>
                                                <div>
                                                    <h5 className="text-truncate font-size-14 mb-1">{product?.name}</h5>
                                                </div>
                                            </td>
                                            <td>{product.unit_price}</td>
                                            <td>{product.qty}</td>
                                            <td>{discount}</td>
                                            <td className="text-end">{product.amount}</td>
                                        </tr>
                                    )
                                }) : <></>
                            }
                            <tr>
                                <th scope="row" colSpan="5" className="text-end">
                                    Sub Total
                                    {
                                        (viewBillable.has_discount) ? <div className="text-muted">(includes discount of {viewBillable.total_discount})</div> : <></>
                                    }
                                </th>
                                <td className="text-end">
                                    {viewBillable.subtotal.toFixed(2)}
                                </td>
                            </tr>
                            { viewBillable.taxes.map((taxItem) => (
                                <tr key={taxItem.key}>
                                    <th scope="row" colSpan="5" className="border-0 text-end">
                                        {taxItem.label}  ({taxItem.rate}%)
                                    </th>
                                    <td className="border-0 text-end">{taxItem.total.toFixed(2)}</td>
                                </tr>
                            ))}
                            <tr>
                                <th scope="row" colSpan="5" className="border-0 text-end">Total</th>
                                <td className="border-0 text-end"><h4 className="m-0 fw-semibold">{viewBillable.total.toFixed(2)}</h4></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                }
                </div>
            </div>
        </div>
    )
}
const mapStateToProps = (state) => ({
    initialized: state.billable.initialized,
    viewBillable: state.billable.viewDetail,
    saveLoading: state.billable.saveLoading,
});

const mapDispatchToProps = {
    fetchBillable
};

export default connect(mapStateToProps, mapDispatchToProps)(Services);