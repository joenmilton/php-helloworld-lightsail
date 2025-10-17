import React, { useEffect, useState } from 'react';
import { updateStage, addStage, removeStage } from '../../../../redux';
import { connect } from 'react-redux';

function StageTable({deal, updateStage, addStage, removeStage}) {
  const [stages, setStages] = useState([]);

  useEffect(() => {
    if (deal.pipeline?.stages && deal.pipeline?.stages.length > 0) {
      setStages(deal.pipeline.stages);
    }
  }, [deal]);

  const onStageChange = (e, index, field) => {
    const { value } = e.target;
    const updatedStages = [...stages];
    updatedStages[index] = {
      ...updatedStages[index],
      [field]: field === 'sort_order' ? parseInt(value, 10) : value,
    };
    setStages(updatedStages);
    updateStage(index, updatedStages[index]);
  };

  const handleAddNewStage = () => {
    addStage();
  };

  const handleRemoveStage = (index) => {
    removeStage(index);
  };

  return (
      <table className="table mb-0">
          <thead className="table-light">
              <tr>
                  <th><span className="pb-2 d-block fw-medium color-light">Stage Name</span></th>
                  <th><span className="pb-2 d-block fw-medium color-light"></span></th>
                  <th className="w-25"><span className="pb-2 d-block fw-medium color-light">Sort</span></th>
              </tr>
          </thead>
          <tbody>
          {stages.map((stage, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={stage.name}
                  onChange={(e) => onStageChange(e, index, 'name')}
                  className="form-control"
                  placeholder=""
                />
              </td>
              <td>
                <button className="btn btn-default" onClick={() => handleRemoveStage(index)}>
                  <i className="fa fa-trash"></i>
                </button>
              </td>
              <td className="w-25">
                <input
                  type="number"
                  value={stage.sort_order}
                  onChange={(e) => onStageChange(e, index, 'sort_order')}
                  className="form-control"
                  placeholder=""
                />
              </td>
            </tr>
          ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}>
                <button type="submit" className="btn btn-outline-primary" onClick={handleAddNewStage}>Add New Stage</button>
              </td>
            </tr>
          </tfoot>
      </table>
  )
}

const mapStateToProps = (state) => ({
    deal: state.settings.deal,
});

const mapDispatchToProps = {
  updateStage, 
  addStage,
  removeStage
};
  
export default connect(mapStateToProps, mapDispatchToProps)(StageTable);