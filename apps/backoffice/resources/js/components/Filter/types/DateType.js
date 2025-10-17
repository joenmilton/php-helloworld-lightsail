import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";

const DateType = ({ 
    query, index,
    settings, 
    filter, updateOptionValue
}) => {
    const [dateOption, setDateOption] = useState([]);

    useEffect(() => {
        setDateOption([])
        const dropValues = settings?.rules.find(rule => rule.id === query.rule)
        if(query && query?.operator && 
            query?.operator !== '' && 
            dropValues && dropValues?.operatorsOptions &&
            dropValues?.operatorsOptions[query?.operator]
        ) {
            const formattedOption = Object.entries(dropValues?.operatorsOptions[query?.operator]).map(([value, label]) => ({ label, value }));
            setDateOption(formattedOption)
        }
    }, [query.operator]);



    const selectedDateOption = (index, filter, options) => {

        const activeRule       = filter?.activeCondition?.rules?.children[index]?.query;
        if(activeRule?.value === '') {
            return null;
        }

        const activeRuleId     = activeRule?.rule;
        const currentRule      = options.find(param => param.id === activeRuleId);
        const operator         = activeRule?.operator;

        return {
            value: activeRule?.value,
            label: currentRule.operatorsOptions[operator][activeRule?.value]
        }
    }
    
    const onDateValueUpdate = (index, data) => {
        updateOptionValue(index, data?.value)
    }

    const onDateUpdate = (index, value) => {
        const date = new Date(value).toISOString();
        updateOptionValue(index, date)
    }
    
    const selectedDate = (index, filter) => {
        const currentRuleQuery = filter?.activeCondition?.rules?.children[index]?.query;
        if(currentRuleQuery?.operator === '') {
            return '';
        }

        return currentRuleQuery?.value
    }

    const onBetweenDateUpdate = (index, value, betweenIndex) => {
        const date = new Date(value).toISOString();

        const currentRuleQuery = filter?.activeCondition?.rules?.children[index]?.query;
        const updatedValue = currentRuleQuery?.value.map((item, i) => i === betweenIndex ? date : item);

        updateOptionValue(index, updatedValue)
    }

    const selectedBetweenDate = (index, filter, betweenIndex) => {
        const currentRuleQuery = filter?.activeCondition?.rules?.children[index]?.query;
        if(currentRuleQuery?.operator === '') {
            return '';
        }

        return currentRuleQuery?.value[betweenIndex]
    }


    return (
        <div>
            {
                (query?.operator && query?.operator !== '') ? 
                    (dateOption.length > 0) ?
                    <Select
                        classNamePrefix="rule-oporent-select"
                        placeholder={"Select..."}
                        closeMenuOnSelect={true}
                        value={selectedDateOption(index, filter, settings?.rules)}
                        options={dateOption}
                        onChange={(value) => onDateValueUpdate(index, value)}
                    /> : (['between', 'not_between'].includes(query?.operator)) ? 
                    <>
                        <div className="row m-0">
                            <div className="col-6 p-0">
                                <Flatpickr
                                    className="form-control bg-white shadow-sm ring-1 ring-neutral-300"
                                    value={selectedBetweenDate(index, filter, 0)}
                                    options={{
                                        enableTime: false,
                                        dateFormat: "d-M-Y",
                                        time_24hr: true,
                                        defaultHour: 0,
                                        disableMobile: "true"
                                    }}
                                    onChange={([date]) => {
                                        if (date) {
                                            onBetweenDateUpdate(index, date, 0)
                                        }
                                    }}
                                />
                            </div>
                            <div className="col-6 p-0">
                                <Flatpickr
                                    className="form-control bg-white shadow-sm ring-1 ring-neutral-300"
                                    value={selectedBetweenDate(index, filter, 1)}
                                    options={{
                                        enableTime: false,
                                        dateFormat: "d-M-Y",
                                        time_24hr: true,
                                        defaultHour: 0,
                                        disableMobile: "true"
                                    }}
                                    onChange={([date]) => {
                                        if (date) {
                                            onBetweenDateUpdate(index, date, 1)
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </> : 
                    <Flatpickr
                        className="form-control bg-white shadow-sm ring-1 ring-neutral-300"
                        value={selectedDate(index, filter, settings?.rules)}
                        options={{
                            enableTime: false,
                            dateFormat: "d-M-Y",
                            time_24hr: true,
                            defaultHour: 0,
                            disableMobile: "true"
                        }}
                        onChange={([date]) => {
                            if (date) {
                                onDateUpdate(index, date)
                            }
                        }}
                    /> : null
            }
        </div>
    )
};

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(DateType);