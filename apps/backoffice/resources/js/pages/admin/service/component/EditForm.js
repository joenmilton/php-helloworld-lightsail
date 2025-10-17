import React, { 
    useContext, 
    useEffect, 
    useState, 
    useCallback 
} from 'react';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import { 
    saveBillable,
    fetchBillable,
    handleUpdateProduct,
    handleBasicProductChange,
    handleProductChange,
    handleAddProduct,
    handleRemoveProduct,
    handleTaxTypeChange

} from '../../../../redux';
import { SidebarContext } from '../../../../components/Sidebar/contexts/SidebarContext'
import { getProductList } from '../../../../service/ProductService';
import AsyncSelect from 'react-select/async';

const ServiceForm = ({ 
    id, formType, onClose, 
    billable, initialized, saveLoading,
    fetchBillable, 

    saveBillable,
    handleUpdateProduct,
    handleBasicProductChange,
    handleProductChange,
    handleAddProduct,
    handleRemoveProduct,
    handleTaxTypeChange
}) => {
    const [errors, setError]                        = useState({});
    const { toggleSidebar } = useContext(SidebarContext);
    
    useEffect(() => {
        const initialize = async () => {
            await fetchBillable(id);
        };

        if (!initialized) {
            initialize();
        }
    }, [id, initialized]);


    const fetchSearchOptions = async (inputValue) => {
        if (!inputValue) {
            return [];
        }

        const response = await getProductList({
            page: 1,
            per_page: 1000,
            q: inputValue
        });
    
        if(response.httpCode === 200) {
            const products = response?.data?.data;
            return products.map(item => ({
                ...item,
                value: item.id,
                label: item.name,
            }));
        }
    
        return []
    };

    const debouncedFetchOptions = useCallback(
        debounce((inputValue, callback) => {
            fetchSearchOptions(inputValue).then(callback);
        }, 500),
        []
    );

    const handleSearchChange = (selectedOption, id) => {
        const updatedProduct = {
            id: id,
            description: selectedOption?.description,
            discount_total: '0.00',
            discount_type: 'fixed',
            name: selectedOption?.name,
            note: '',
            product_id: selectedOption?.id,
            qty: '1.00',
            sku: selectedOption?.sku,
            tax_label:selectedOption?.tax_label,
            tax_rate: selectedOption?.tax_rate,
            unit: selectedOption?.unit,
            unit_price: selectedOption?.unit_price
        }

        handleUpdateProduct(updatedProduct)
    };


    const selectedOption = (id) => {
        const product = billable?.products.find(product => product.product_id === id);
        return product ? { label: product.name, value: product.product_id } : null;
    };

    const resetProduct = (id) => {
        handleBasicProductChange(id, 'name', '')
        handleBasicProductChange(id, 'product_id', null)
    }
    




    const handleSave = async (e) => {
        const response = await saveBillable(id, billable);

        if(response.httpCode == 422) {
            setError(response.errors)
        }

        if(response.httpCode === 200) {
            onClose()
        }
    }

    return (
        <>
            <div className="rightbar-title d-flex align-items-center pe-3">
                <a href="" onClick={(event) => { event.preventDefault(); onClose(); }} className="right-bar-toggle-close ms-auto">
                    <i className="mdi mdi-close noti-icon"></i>
                </a>
            </div>
            <div className="d-flex flex-column h-full w-screen" style={{maxWidth: '60rem'}}>
                <div className="d-flex flex-column flex-equal overflow-x-hidden overflow-y-scroll py-4">
                    <h2 className="sub-head mb-3 px-4">
                        Update Services
                    </h2>

                    <div className="row px-4">
                        <div className="col-md-12">
                            <div className="d-flex justify-content-start align-items-center">
                                <div className="form-check mb-2 me-2">
                                    <input 
                                        className="form-check-input" 
                                        type="radio"
                                        value="exclusive"
                                        id="exclusiveTax"
                                        checked={billable.tax_type === 'exclusive'}
                                        onChange={() => handleTaxTypeChange('exclusive')}
                                    />
                                    <label className="form-check-label" htmlFor="exclusiveTax">
                                        Tax Exclusive
                                    </label>
                                </div>
                                <div className="form-check mb-2 me-2">
                                    <input 
                                        className="form-check-input" 
                                        id="inclusiveTax"
                                        type="radio"
                                        value="inclusive"
                                        checked={billable.tax_type === 'inclusive'}
                                        onChange={() => handleTaxTypeChange('inclusive')}
                                    />
                                    <label className="form-check-label" htmlFor="inclusiveTax">
                                        Tax Inclusive
                                    </label>
                                </div>
                                <div className="form-check mb-2">
                                    <input 
                                        className="form-check-input" 
                                        id="noTax"
                                        type="radio"
                                        value="no_tax"
                                        checked={billable.tax_type === 'no_tax'}
                                        onChange={() => handleTaxTypeChange('no_tax')}
                                    />
                                    <label className="form-check-label" htmlFor="noTax">
                                        No Tax
                                    </label>
                                </div>
                            </div>

                            <div className="d-flex mt-2">
                                <div className="table-responsive w-100">
                                    <table className="billable table mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>SERVICE</th>
                                                <th><div className="float-end">QTY</div></th>
                                                <th><div className="float-end">UNIT PRICE</div></th>
                                                <th><div className="float-end">TAX</div></th>
                                                <th><div className="float-end">DISCOUNT</div></th>
                                                <th><div className="float-end">AMOUNT</div></th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                (billable?.products) ? billable?.products.map((product, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <th scope="row">
                                                                <div className="d-flex justify-content-start input-width-250 search-box">
                                                                {
                                                                    (product?.product_id && product?.product_id != '') ? <div className="position-relative w-100">
                                                                        <div onClick={() => resetProduct(product?.id)} className="position-absolute d-flex align-items-center justify-content-center search-close">
                                                                            <i className="uil-times-circle"></i>
                                                                        </div>
                                                                        <input 
                                                                            onChange={(e) => ({})}
                                                                            value={product.name}
                                                                            readOnly
                                                                            className="billable-input form-control rounded-2 p-2" 
                                                                            type="text"
                                                                        />
                                                                    </div> : 
                                                                    <AsyncSelect
                                                                        className="mb-2 w-100"
                                                                        cacheOptions
                                                                        value={() => selectedOption(product?.product_id)}
                                                                        loadOptions={debouncedFetchOptions}
                                                                        defaultOptions
                                                                        onChange={(selected) => handleSearchChange(selected, product?.id)}
                                                                    />
                                                                }
                                                                </div>
                                                            </th>
                                                            <td>
                                                                <div className="d-flex justify-content-end input-width-50">
                                                                    <input 
                                                                        onChange={(e) => handleProductChange(product.id, 'qty', e.target.value)}
                                                                        value={product.qty}
                                                                        className="billable-input form-control p-2" 
                                                                        type="text" 
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex justify-content-end input-width-70">
                                                                    <input 
                                                                        onChange={(e) => handleProductChange(product.id, 'unit_price', e.target.value)}
                                                                        value={product.unit_price}
                                                                        className="billable-input form-control p-2" 
                                                                        type="text" 
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex justify-content-end position-relative">
                                                                    <div className="position-absolute label-tax-percentage">%</div>
                                                                    <input 
                                                                        onChange={(e) => handleProductChange(product.id, 'tax_rate', e.target.value)}
                                                                        value={product.tax_rate}
                                                                        className="billable-input form-control p-2 pe-4 input-width-90 input-left-radius" 
                                                                        type="text" 
                                                                    />
                                                                    <input 
                                                                        onChange={(e) => handleProductChange(product.id, 'tax_label', e.target.value)}
                                                                        value={product.tax_label}
                                                                        className="billable-input form-control p-2 input-width-50 input-right-radius" 
                                                                        type="text" 
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex justify-content-end input-width-90">
                                                                    <input 
                                                                        onChange={(e) => handleProductChange(product.id, 'discount_total', e.target.value)}
                                                                        value={product.discount_total}
                                                                        className="billable-input form-control p-2 input-width-50 input-right-border0 input-left-radius" 
                                                                        type="text" 
                                                                    />
                                                                    <select 
                                                                        className="billable-input form-control p-2 input-width-50 input-left-border0 input-right-radius" 
                                                                        onChange={(e) => handleProductChange(product.id, 'discount_type', e.target.value)} 
                                                                        value={product.discount_type}
                                                                    >
                                                                        <option value="fixed">
                                                                            INR
                                                                        </option>
                                                                        <option value="percent">%</option>
                                                                    </select>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex justify-content-end">
                                                                    {product.amount}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div dataii={product.id} className="cursor-pointer" onClick={() => handleRemoveProduct(product.id)}>
                                                                    <i className="uil-trash-alt"></i>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                }): <></>
                                            }
                                            <tr>
                                                <th scope="row" colSpan="7" className="text-start">
                                                    <span className="cursor-pointer text-primary" onClick={() => handleAddProduct()}>+ Add New Service</span>
                                                </th>
                                            </tr>
                                            <tr>
                                                <th scope="row" colSpan="5" className="text-end">
                                                    <div>Sub Total</div>
                                                    {
                                                        (billable.has_discount) ? <div className="text-muted">(includes discount of {billable.total_discount})</div> : <></>
                                                    }
                                                </th>
                                                <td className="text-end">{billable.subtotal.toFixed(2)}</td>
                                            </tr>
                                            { billable.taxes.map((taxItem) => (
                                                <tr key={taxItem.key}>
                                                    <th scope="row" colSpan="5" className="border-0 text-end">
                                                        {taxItem.label}  ({taxItem.rate}%)
                                                    </th>
                                                    <td className="border-0 text-end">{taxItem.total.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <th scope="row" colSpan="5" className="border-0 text-end">Total</th>
                                                <td className="border-0 text-end"><h4 className="m-0 fw-semibold">{billable.total.toFixed(2)}</h4></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div>
                    <div className="px-4 py-2 sidebar-footer border-top-custom">
                        <div className="d-flex align-items-start"> 
                            <button type="button" className="btn w-sm ms-auto me-2" onClick={() => { onClose();}}>Cancel</button>
                            <button type="button" disabled={saveLoading} className="btn btn-purple w-sm" onClick={handleSave}>
                                {saveLoading ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const mapStateToProps = (state) => ({
    initialized: state.billable.initialized,
    billable: state.billable.detail,
    saveLoading: state.billable.saveLoading,
});

const mapDispatchToProps = {
    saveBillable,
    fetchBillable,
    handleUpdateProduct,
    handleBasicProductChange,
    handleProductChange,
    handleAddProduct,
    handleRemoveProduct,
    handleTaxTypeChange
};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceForm);