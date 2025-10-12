import React, { useEffect } from 'react';
import { connect } from 'react-redux';

const TextType = ({ 
    query, index,
    updateOptionValue
}) => {
    useEffect(() => {

    }, [query]);

    const onTextUpdate = (index, value) => {
        updateOptionValue(index, value)
    }

    return (
        <div>
            {
                (query?.operator && query?.operator !== '') ? 
                    <input value={query?.value} onChange={(e) => onTextUpdate(index, e.target.value)} className="form-control bg-white shadow-sm ring-1 ring-neutral-300" type="text" /> : null
            }
        </div>
    )
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(TextType);