import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { fetchProductList, addProduct } from '../../../../../redux';
import DataTable from 'react-data-table-component';
import { SidebarContext } from '../../../../../components/Sidebar/contexts/SidebarContext';

function ProductTable({ 
    product, activeCondition,
    fetchProductList, addProduct
}) {
    const { toggleSidebar } = useContext(SidebarContext);

    useEffect(() => {
        const queryFilter = {
            q: product?.searchQuery,
            sortOrder: product?.sortOrder,
            page: 1,
            per_page: product?.list?.per_page,
        }
        fetchProductList(queryFilter, activeCondition);
    }, [fetchProductList]);

    const handlePerRowsChange = async (newPerPage, page, condition) => {
        const queryFilter = {
            q: product?.searchQuery,
            sortOrder: product?.sortOrder,
            page: product?.list?.current_page,
            per_page: newPerPage,
        }
        fetchProductList(queryFilter, condition);
    };

    const handlePageChange = (current_page, condition) => {
        const queryFilter = {
            q: product?.searchQuery,
            sortOrder: product?.sortOrder,
            page: current_page,
            per_page: product?.list?.per_page,
        }
        fetchProductList(queryFilter, condition);
    };

    const handleSelectedRowsChange = ({ selectedRows }) => {
        const ids = selectedRows.map(row => row.id);
        // setSelectedIds(ids);
        console.log(ids)
    };


    const openProductForm = async (productId) => {
        const productIndex = product?.list?.data.findIndex(item => item.id === productId);
        if (productIndex !== -1) {
            addProduct(product?.list?.data[productIndex])
            toggleSidebar('product', productId)
        }
    }


    const columns = [
        {
            name: 'Product Name',
            cell: (row) => (
                <div className="d-block fw-semibold ff-primary text-primary cursor-pointer" onClick={() => openProductForm(row?.id)}>
                    {row?.name} <cite className="font-size-10 text-muted">{row?.sku}</cite>
                </div>
            ),
            sortable: true,
        },
        {
            name: 'Unit Price',
            cell: (row) => (
                <div>
                    <span className="fw-medium ff-primary font-size-14 me-2"><i className="fas fa-rupee-sign me-1"></i>{row?.unit_price}</span>
                </div>
            ),
            sortable: false,
        },
        {
            name: 'Tax Rate',
            cell: (row) => (
                <div>
                    <span className="fw-medium ff-primary font-size-14 me-2">{row?.tax_rate}%</span>
                </div>
            ),
            sortable: false,
        },
        {
            name: 'Status',
            cell: (row) => (
                (row.is_active) ? <i className="mdi mdi-circle superadmin-status text-success mx-1"></i> : <i className="mdi mdi-circle superadmin-status text-danger mx-1"></i>
            ),
            sortable: false,
        },
        {
            maxWidth: '60px',
            minWidth: '60px',
            cell: (row) => (
                <div className="dropdown mb-0 d-flex justify-content-end">
                    <a className="btn btn-link text-muted p-1 mt-n2 dropdown-toggle-split dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-haspopup="true">
                        <i className="mdi mdi-dots-vertical font-size-20"></i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item px-3" href="#"><i className="uil-calender me-1"></i>Create Activity</a>
                        <a className="dropdown-item px-3" href="#"><i className="uil-edit me-1"></i>Edit</a>
                        <a className="dropdown-item px-3" href="#"><i className="uil-trash-alt me-1"></i>Delete</a>
                    </div>
                </div>
            )
        }
    ];

    const customStyles = {
        responsiveWrapper: {
            style: {
                overflow: 'visible !important'
            },
        },
        tableWrapper: {
            style: {
                display: 'block'
            }
        }
    };

    return (
        <div className="table-container mb-4">
            <DataTable
                customStyles={customStyles}
                title=""
                columns={columns}
                data={product?.list?.data}
                progressPending={product?.listLoading}
                pagination
                paginationServer
                paginationTotalRows={product?.list?.total}
                onChangeRowsPerPage={(perPage, page) => handlePerRowsChange(perPage, page, activeCondition)}
                onChangePage={(page) => handlePageChange(page, activeCondition)}
                selectableRows
                onSelectedRowsChange={handleSelectedRowsChange}
                paginationPerPage={product?.list?.per_page}
            />
        </div>
        
    );
}

const mapStateToProps = (state) => ({
    activeCondition: state.product.activeCondition,
    product: state.product
});

const mapDispatchToProps = {
    fetchProductList,
    addProduct
};
  
export default connect(mapStateToProps, mapDispatchToProps)(ProductTable);