// calculations.js
export const calculateAmount = (product) => {
    const unitPrice = Number(product.unit_price);
    const qty = Number(product.qty);
    const discount = Number(product.discount_total);
    
    let discountAmount = 0;
    if (product.discount_type === 'percent') {
        discountAmount = (unitPrice * qty * discount) / 100;
    } else if (product.discount_type === 'fixed') {
        discountAmount = discount;
    }

    return (unitPrice * qty - discountAmount).toFixed(2);
};


export const calculateSubTotal = (products) => {
    return products.reduce((total, product) => {
        return total + Number(calculateAmount(product));
    }, 0);
};
  
export const calculateTax = (products, taxType) => {
    const taxTotals = {};

    products.forEach((product) => {
        const unitPrice = Number(product.unit_price);
        const qty = Number(product.qty);
        const taxRate = Number(product.tax_rate);
        const discount = Number(product.discount_total);

        // Calculate discount amount based on discount_type
        let discountAmount = 0;
        if (product.discount_type === 'percent') {
            discountAmount = (unitPrice * qty * discount) / 100;
        } else if (product.discount_type === 'fixed') {
            discountAmount = discount; // Assuming discount is a fixed amount
        }

        const amountBeforeTax = (unitPrice * qty) - discountAmount;

        if (taxType === 'inclusive' || taxType === 'exclusive') {
            const taxAmount = taxType === 'inclusive'
                ? amountBeforeTax - (amountBeforeTax / (1 + taxRate / 100))
                : amountBeforeTax * (taxRate / 100);

            const label = product.tax_label == '' ? 'GST' : product.tax_label
            const taxKey = `${label}${taxRate.toFixed(3)}`;
            if (!taxTotals[taxKey]) {
                taxTotals[taxKey] = {
                    key: taxKey,
                    rate: taxRate.toFixed(3),
                    label: label,
                    total: 0,
                };
            }
            taxTotals[taxKey].total += taxAmount;
        }
    });

    return Object.values(taxTotals).sort((a, b) => parseFloat(a.rate) - parseFloat(b.rate));
};
  
export const calculateTotal = (subTotal, totalTax, taxType) => {
    return (taxType === 'inclusive') ? subTotal : subTotal + totalTax;
};
  