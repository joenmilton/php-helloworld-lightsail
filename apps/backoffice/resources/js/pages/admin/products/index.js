
import React, { useRef, useContext, useState } from 'react';
import { connect } from 'react-redux';
import { SidebarContext } from '../../../components/Sidebar/contexts/SidebarContext';
import ProductTable from './component/ProductTable';
import { 
    updateProductSearchQuery, fetchProductList
} from '../../../redux';

function ListProduct({
    product, activeCondition,
    updateProductSearchQuery, fetchProductList
}) {
    const { toggleSidebar } = useContext(SidebarContext);

    const [typingTimer, setTypingTimer]         = useState(null);
    const doneTypingInterval = 800;
    const productSearchInputRef = useRef(null);


    const onProductSearch = (event, condition) => {
        const input = event.target.value;
        updateProductSearchQuery(input)

        if (input.length > 0) {
            clearTimeout(typingTimer);
            const timer = setTimeout(() => doneTyping(input, condition), doneTypingInterval);
            setTypingTimer(timer);
        } else {
            doneTyping(input)
            clearTimeout(typingTimer);
        }
    }

    const doneTyping = async (input, condition) => {
        const queryFilter = {
            q: input,
            page: product?.list?.current_page,
            per_page: product?.list?.per_page,
        }
        await fetchProductList(queryFilter, condition);
    };


    return (
        <>
        <div className="container-fluid">
            <div className="row mb-2">

                <div className="col-md-6">
                    <div className="btn-toolbar">
                        <div className="btn-group me-2 mb-2 mb-sm-0">
                            <input 
                                onChange={(event) => onProductSearch(event, activeCondition)} 
                                ref={productSearchInputRef}
                                value={product?.searchQuery}
                                placeholder="Search..."
                                type="text" 
                                className="form-control bg-white shadow-sm ring-1 ring-neutral-300 input-width-350"
                            />
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="d-flex flex-wrap align-items-start justify-content-md-end mt-2 mt-md-0 gap-2 mb-3">
                        <button className="btn btn-purple" onClick={() => toggleSidebar('product')}>Create Service</button>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <ProductTable />
                </div>
            </div>
        </div>
        </>
    )
}

const mapStateToProps = (state) => ({
    activeCondition: state.product.activeCondition,
    product: state.product
});

const mapDispatchToProps = {
    updateProductSearchQuery,
    fetchProductList
};
  
export default connect(mapStateToProps, mapDispatchToProps)(ListProduct);