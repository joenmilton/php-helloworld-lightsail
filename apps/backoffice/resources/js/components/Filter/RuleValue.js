import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import TextType from './types/TextType';
import DateType from './types/DateType';
import SelectType from './types/SelectType';
import NumericType from './types/NumericType';

const RuleValue = ({ 
    isDisabled, settings, query, index,
    filter, updateOptionValue
}) => {
    switch (query?.type) {
        case 'text':
            return <TextType isDisabled={isDisabled} settings={settings} index={index} query={query} updateOptionValue={updateOptionValue} filter={filter}/>;

        case 'date':
            return <DateType isDisabled={isDisabled} settings={settings} index={index} query={query} updateOptionValue={updateOptionValue} filter={filter}/>;

        case 'select':
            return <SelectType isDisabled={isDisabled} settings={settings} index={index} query={query} updateOptionValue={updateOptionValue} filter={filter}/>;

        case 'numeric':
            return <NumericType isDisabled={isDisabled} settings={settings} index={index} query={query} updateOptionValue={updateOptionValue} filter={filter}/>;
        default:
        return null;
    }
    
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(RuleValue);