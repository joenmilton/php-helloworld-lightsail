import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import ActivitiesSearch from './ActivitiesSearch';
import ActivitiesForm from './ActivitiesForm';
import { 
    loadActivitySettings
} from '../../../../../../../redux';

const Activities = ({ 
    activity, settingsInitialized,
    loadActivitySettings
}) => {

    useEffect(async() => {
        if(!settingsInitialized) {
            await loadActivitySettings();
        }
    }, [settingsInitialized])

    return (
        (activity.activeForm) ? <ActivitiesForm /> : <ActivitiesSearch />
    )
}
const mapStateToProps = (state) => ({
    settingsInitialized: state.activity.settingsInitialized,
    activity: state.activity
});

const mapDispatchToProps = {
    loadActivitySettings
};

export default connect(mapStateToProps, mapDispatchToProps)(Activities);