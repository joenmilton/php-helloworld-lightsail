import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import TaskContent from './TaskContent'; // Import TaskContent component

const Container = styled.div`
  margin-bottom: 8px;
`;

const Task = ({ task, index }) => {
  const handleClick = () => {
    console.log({ task, index });
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Container
          onClick={handleClick}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
          aria-roledescription="Press space bar to lift the task"
        >
          <TaskContent taskId={task.id} /> {/* Use TaskContent component */}
        </Container>
      )}
    </Draggable>
  );
};

export default Task;