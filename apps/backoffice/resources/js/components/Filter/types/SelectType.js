import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

const SelectType = ({ 
    query, index, isDisabled,
    settings, filter,
    updateOptionValue
}) => {
    useEffect(() => {
        // console.log(query)
    }, [query]);

    const getOptions = (rule, options) => {

        const currentRule      = options.find(param => param.id === rule);

        return currentRule?.options.map(option => {
            return {
                label: option.name,
                value: option.id
            }
        })
    }

    const onSelectValueUpdate = (index, data) => {
        updateOptionValue(index, data?.value)
    }


    const selectedOption = (index, filter, options) => {

        const activeRule       = filter?.activeCondition?.rules?.children[index]?.query;
        if(options.length <= 0 || activeRule?.value === '') {
            return null;
        }

        const activeRuleId     = activeRule?.rule;
        const currentRule      = options.find(param => param.id === activeRuleId);
        const selectedOption = currentRule?.options.find(opt => opt.id === activeRule?.value)
        if(!selectedOption) {
            return null
        }

        return {
            label: selectedOption.name,
            value: selectedOption.id
        }
    }

    return (
        <div>
            {
                (query?.operator && query?.operator !== '') ? 
                    <Select
                        classNamePrefix="rule-option-select"
                        isDisabled={isDisabled}
                        placeholder={"Select..."}
                        closeMenuOnSelect={true}
                        value={selectedOption(index, filter, settings?.rules)}
                        options={getOptions(query?.rule, settings?.rules)}
                        onChange={(value) => onSelectValueUpdate(index, value)}
                    /> : null
            }
        </div>
    )
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectType);