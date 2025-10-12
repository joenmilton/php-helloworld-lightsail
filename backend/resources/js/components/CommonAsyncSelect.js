import React, { useCallback } from 'react';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash/debounce';

const CommonAsyncSelect = ({ 
    value,
    onChange,
    loadOptions,
    placeholder = "Select...",
    isMulti = false,
    isClearable = true,
    isDisabled = false,
    cacheOptions = true,
    defaultOptions = false,
    loadingMessage = () => "Loading...",
    noOptionsMessage = ({ inputValue }) => 
        !inputValue || inputValue.length < 2 
            ? "Type at least 2 characters..." 
            : "No options found",
    debounceTimeout = 500,
    className = '',
    ...props
}) => {
    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#0d6efd' : state.isFocused ? '#e9ecef' : 'white',
            color: state.isSelected ? 'white' : 'black',
            '&:active': {
                backgroundColor: state.isSelected ? '#0d6efd' : '#e9ecef'
            }
        }),
        control: (provided, state) => ({
            ...provided,
            boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(13, 110, 253, 0.25)' : provided.boxShadow,
            borderColor: state.isFocused ? '#86b7fe' : '#ced4da',
            '&:hover': {
                borderColor: state.isFocused ? '#86b7fe' : '#ced4da'
            }
        }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 })
    };

    // Debounce the loadOptions function
    const debouncedLoadOptions = useCallback(
        debounce((inputValue, callback) => {
            loadOptions(inputValue)
                .then(options => {
                    callback(options);
                })
                .catch(error => {
                    console.error('Error loading options:', error);
                    callback([]);
                });
        }, debounceTimeout),
        [loadOptions, debounceTimeout]
    );

    return (
        <AsyncSelect
            value={value}
            onChange={onChange}
            loadOptions={debouncedLoadOptions}
            className={className}
            classNamePrefix="select"
            placeholder={placeholder}
            isMulti={isMulti}
            isClearable={isClearable}
            isDisabled={isDisabled}
            styles={customStyles}
            cacheOptions={cacheOptions}
            defaultOptions={defaultOptions}
            loadingMessage={loadingMessage}
            noOptionsMessage={noOptionsMessage}
            getOptionValue={(option) => option.value}
            getOptionLabel={(option) => option.label}
            menuPortalTarget={document.body}
            {...props}
        />
    );
};

export default CommonAsyncSelect; 