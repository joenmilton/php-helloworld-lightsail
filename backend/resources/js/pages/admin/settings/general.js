
import React, { useEffect  } from 'react';
import { connect } from 'react-redux';

function GeneralSettings() {

    useEffect(() => {

    }, []);

    return (
        <div className="row g-2">
            <div className="col-lg-auto">
                <div className="d-flex">
                    <div className="flex-grow-1">
                        <div className="sub-head">General</div>
                    </div>
                </div>
            </div>
            <div className="col-auto ms-sm-auto">
                <div className="justify-content-sm-end">   

                </div>
            </div>
        </div>
    )
}


const mapStateToProps = (state) => ({
    settings: state.settings,
});

const mapDispatchToProps = {

};
  
export default connect(mapStateToProps, mapDispatchToProps)(GeneralSettings);