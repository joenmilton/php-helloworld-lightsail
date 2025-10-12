import React, { useEffect } from 'react';
import { connect } from 'react-redux';

const NumericType = ({ 
    query, index,
    filter, updateOptionValue
}) => {
    useEffect(() => {

    }, [query]);

    const onNumberUpdate = (index, value) => {
        updateOptionValue(index, value)
    }

    const onBetweenNumberUpdate = (index, value, betweenIndex) => {
        const currentRuleQuery = filter?.activeCondition?.rules?.children[index]?.query;
        const updatedValue = currentRuleQuery?.value.map((item, i) => i === betweenIndex ? value : item);

        updateOptionValue(index, updatedValue)
    }

    return (
        <div>
            {
                (query?.operator && query?.operator !== '') ? 
                    (['between', 'not_between'].includes(query?.operator)) ? <div className="row m-0">
                        <div className="col-6 p-0">
                            <input 
                                value={query?.value[0]} 
                                onChange={(e) => onBetweenNumberUpdate(index, e.target.value, 0)} 
                                className="form-control bg-white shadow-sm ring-1 ring-neutral-300" 
                                type="number" 
                            />
                        </div>
                        <div className="col-6 p-0">
                            <input 
                                value={query?.value[1]} 
                                onChange={(e) => onBetweenNumberUpdate(index, e.target.value, 1)} 
                                className="form-control bg-white shadow-sm ring-1 ring-neutral-300" 
                                type="number" 
                            />
                        </div>
                    </div> : 
                    <input value={query?.value} onChange={(e) => onNumberUpdate(index, e.target.value)} className="form-control bg-white shadow-sm ring-1 ring-neutral-300" type="number" /> : 
                    null
            }
        </div>
    )
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(NumericType);