import { BaseEdge, getBezierPath } from 'reactflow';
import "../Components_css/Course_tree.css"

const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY ,data}) => {
  const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY });
  const color = data?.type === 'strong' ? 'red' : 'blue';
  return (
    <path
      id={id}
      d={edgePath}
      fill="none"
      stroke="#555"
      strokeWidth={3}
      markerEnd="url(#arrowhead)" // ✅ arrow!
     
    />
  );
};

export default CustomEdge;

