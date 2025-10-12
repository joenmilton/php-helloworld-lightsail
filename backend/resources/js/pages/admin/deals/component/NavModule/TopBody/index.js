import React from 'react';
import Activities from './Activities';
import Services from './Services';
import Payments from './Payments';
import Journals from './Journals';
import Notes from './Notes';

export function TopBody({ type }) {
    switch (type) {
        case 'Activities':
            return <Activities type={type}/>;
        case 'Services':
            return <Services type={type}/>;
        case 'Payments':
            return <Payments type={type}/>;
        case 'Journals':
            return <Journals type={type}/>;
        case 'Notes':
            return <Notes type={type}/>;
        default:
            return null;
    }
}