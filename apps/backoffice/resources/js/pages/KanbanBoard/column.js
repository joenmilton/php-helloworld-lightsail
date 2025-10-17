import React from 'react';
import { connect } from 'react-redux';
import { updateShrink } from '../../redux';
import styled from 'styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Task from './task';

const TaskList = styled.div`
  transition: background-color 0.2s ease;
  background-color: 'inherit';
  border: ${props => (props.isDraggingOver ? '1px dashed #c9c9c9' : '0')};
  border-radius: 0.4rem;
  flex-grow: 1;
  min-height: 100px;
`;

const Container = styled.div`
  margin: 8px;
  background-color: white;
  width: 220px;
  display: flex;
  flex-direction: column;
`;

class InnerList extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.tasks !== this.props.tasks;
  }

  render() {
    return this.props.tasks.map((task, index) => (
      <Task key={task.id} task={task} index={index} />
    ));
  }
}

class Column extends React.Component {

  handleUpdateShrink = async () => {
    const { column, updateShrink } = this.props;
    await updateShrink(column.id, !column.shrink);
  };

  render() {
    const { column, index, draggable, tasks } = this.props;

    if (draggable) {
      return (
        <Draggable draggableId={column.id} index={index}>
          {(provided, snapshot) => (
            <Container
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              className="task-list"
              style={{ minWidth: column.shrink ? '100px' : '320px' }}
            >
              <div className="card column-card shadow-none h-100">
                <div className="card-header bg-transparent border-bottom d-flex justify-content-between align-items-center" {...provided.dragHandleProps}>
                  <div className="align-items-start d-inline-block text-truncate">{column.title}</div>
                  <div className="cursor-pointer" onClick={this.handleUpdateShrink}>
                    {
                      (column.shrink) ?
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg> :
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    }
                  </div>
                </div>

                <Droppable droppableId={column.id} type="task">
                  {(provided, snapshot) => (

                    <div className="simplebar-wrapper position-relative">
                      <div className="simplebar-height-auto-observer-wrapper"><div className="simplebar-height-auto-observer"></div></div>
                      <div className="simplebar-mask">
                        <div className="simplebar-offset" style={{ right: -15, bottom: 0 }}>
                          <div className="simplebar-content-wrapper" style={{ height: 'auto', overflow: 'hidden scroll' }}>
                            <div className="simplebar-content px-2 pt-3">
                              <div className="tasks">
                                <TaskList
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                  isDraggingOver={snapshot.isDraggingOver}
                                >
                                  <InnerList tasks={tasks} />
                                  {provided.placeholder}
                                </TaskList>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Droppable>
              </div>
            </Container>
          )}
        </Draggable>
      );
    } else {
      return (
        <Container 
          className="task-list" 
          style={{ minWidth: column.shrink ? '100px' : '320px' }}
        >
          <div className="card column-card shadow-none h-100">
            <div className="card-header bg-transparent border-bottom d-flex justify-content-between align-items-center">
              <div className="align-items-start d-inline-block text-truncate">{column.title}</div>
              <div className="cursor-pointer" onClick={this.handleUpdateShrink}>
              {
                (column.shrink) ?
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg> :
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg>
              }
              </div>
            </div>
            <Droppable droppableId={column.id} type="task">
              {(provided, snapshot) => (
                <div className="simplebar-wrapper position-relative simplebar-wrapper-pipeline">
                  <div className="simplebar-height-auto-observer-wrapper"><div className="simplebar-height-auto-observer"></div></div>
                  <div className="simplebar-mask">
                    <div className="simplebar-offset" style={{ right: -15, bottom: 0 }}>
                      <div className="simplebar-content-wrapper" style={{ height: 'auto', overflow: 'hidden scroll' }}>
                        <div className="simplebar-content px-2 pt-3">
                          <div className="tasks">
                            <TaskList
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              isDraggingOver={snapshot.isDraggingOver}
                            >
                              <InnerList tasks={tasks} />
                              {provided.placeholder}
                            </TaskList>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Droppable>
          </div>
        </Container>
      );
    }
  }
}

const mapDispatchToProps = {
  updateShrink,
};

export default connect(null, mapDispatchToProps)(Column);