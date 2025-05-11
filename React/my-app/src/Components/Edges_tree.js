import { BaseEdge, getBezierPath } from 'reactflow';
import "../Components_css/Course_tree.css"

const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY }) => {
  const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      className="custom-edge"
    />
  );
};

export default CustomEdge;