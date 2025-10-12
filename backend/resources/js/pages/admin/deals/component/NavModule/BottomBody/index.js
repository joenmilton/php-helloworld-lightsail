import React from 'react';
import { Activities } from './Activities';
import Payments from './Payments';
import Journals from './Journals';
import { All } from './All';

export function BottomBody({ type }) {
    switch (type) {
        case 'All':
            return <All type={type}/>;
        case 'Activities':
            return <Activities type={type}/>;
        case 'Payments':
            return <Payments type={type}/>;
        case 'Journals':
            return <Journals type={type}/>;   
        default:
            return null;
    }
}