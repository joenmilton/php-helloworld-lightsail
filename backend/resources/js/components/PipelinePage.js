import React, { useContext } from 'react';
import { SidebarContext } from '../contexts/SidebarContext';

const PipelinePage = () => {
  const { toggleSidebar } = useContext(SidebarContext);

  return (
    <div>
      <h1>Pipeline Page</h1>
      <button onClick={() => toggleSidebar('pipeline')}>Create Pipeline</button>
    </div>
  );
};

export default PipelinePage;