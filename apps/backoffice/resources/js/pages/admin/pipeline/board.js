
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import KanbanBoard from '../../KanbanBoard';

function PipelineBoard({  }) {
    const { pipelineId }        = useParams();

    return (
        <>
            <div>
                <KanbanBoard pipelineId={pipelineId}/>
            </div>
        </>
    )
}


const mapStateToProps = (state) => ({

});

const mapDispatchToProps = {

};
export default connect(mapStateToProps, mapDispatchToProps)(PipelineBoard);