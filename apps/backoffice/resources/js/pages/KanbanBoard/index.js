import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from './column';
import { updateBoardList, getBoardList } from '../../redux'; 

const Container = styled.div`
  display: flex;
`;

const InnerList = React.memo(({ draggable, column, taskMap, index }) => {
    const tasks = column.taskIds.map(taskId => taskMap[taskId]);
    return <Column draggable={draggable} column={column} tasks={tasks} index={index} />;
});

const KanbanBoard = ({ pipelineId, boardLoading, board, getBoardList, updateBoardList }) => {

    useEffect(async() => {
        await getBoardList(pipelineId)
    }, [pipelineId, getBoardList]);

    const onDragStart = (start, provided) => {
        provided.announce(
            `You have lifted the task in position ${start.source.index + 1}`
        );
    };

    const onDragUpdate = (update, provided) => {
        const message = update.destination
        ? `You have moved the task to position ${update.destination.index + 1}`
        : `You are currently not over a droppable area`;

        provided.announce(message);
    };

    const onDragEnd = async (result, provided) => {

        const message = result.destination
        ? `You have moved the task from position ${result.source.index + 1} to ${result.destination.index + 1}`
        : `The task has been returned to its starting position of ${result.source.index + 1}`;

        provided.announce(message);

        const { destination, source, draggableId, type } = result;
        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        if (type === 'column') {
            const newColumnOrder = Array.from(board.columnOrder);
            newColumnOrder.splice(source.index, 1);
            newColumnOrder.splice(destination.index, 0, draggableId);

            const newState = {
                ...board,
                columnOrder: newColumnOrder,
            };
            await updateBoardList(pipelineId, newState, [], 'column', draggableId)
            return;
        }

        const home = board.columns[source.droppableId];
        const foreign = board.columns[destination.droppableId];

        //reorder inside same list
        if (home === foreign) {
            const newTaskIds = Array.from(home.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);

            const newHome = {
                ...home,
                taskIds: newTaskIds,
            };

            const newState = {
                ...board,
                columns: {
                    ...board.columns,
                    [newHome.id]: newHome,
                },
            };

            await updateBoardList(pipelineId, newState, [newHome.id], 'task', draggableId)
            return;
        }

        // moving from one list to another
        const homeTaskIds = Array.from(home.taskIds);
        homeTaskIds.splice(source.index, 1);
        const newHome = {
            ...home,
            taskIds: homeTaskIds,
        };

        const foreignTaskIds = Array.from(foreign.taskIds);
        foreignTaskIds.splice(destination.index, 0, draggableId);
        const newForeign = {
            ...foreign,
            taskIds: foreignTaskIds,
        };

        const newState = {
            ...board,
            columns: {
                ...board.columns,
                [newHome.id]: newHome,
                [newForeign.id]: newForeign,
            },
        };
        await updateBoardList(pipelineId, newState, [newHome.id, newForeign.id], 'task', draggableId)
    };

    return (
        <div className="container-fluid">
            <div className="row mb-2">
                <div className="col-md-12">
                    {
                        (boardLoading) ? <div className="d-flex align-items-center justify-content-center">
                            <div className="spinner-border text-primary m-1" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div> : 
                        <DragDropContext onDragStart={onDragStart} onDragUpdate={onDragUpdate} onDragEnd={onDragEnd}>
                            <Droppable droppableId="all-columns" direction="horizontal" type="column">
                                {provided => (
                                <Container 
                                    className="card shadow-none border-0 bg-transparent"
                                    {...provided.droppableProps} 
                                    ref={provided.innerRef}
                                >
                                    <div className="task-board">
                                        {board.columnOrder.map((columnId, index) => {
                                        const column = board.columns[columnId];
                                        return <InnerList 
                                            draggable={false}
                                            key={column.id} 
                                            column={column} 
                                            taskMap={board.tasks} 
                                            index={index} 
                                        />;
                                        })}
                                        {provided.placeholder}
                                    </div>
                                </Container>
                                )}
                            </Droppable>
                        </DragDropContext>
                    }
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    boardLoading: state.kanban.boardLoading,
    board: state.kanban.board
});

const mapDispatchToProps = {
    getBoardList,
    updateBoardList
};
  
export default connect(mapStateToProps, mapDispatchToProps)(KanbanBoard);