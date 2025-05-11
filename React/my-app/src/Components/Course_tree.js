// import React from 'react';
// import 'react-flow-renderer/dist/style.css';
// import { Card, CardContent, CardActions, Typography, Button } from '@mui/material';
// import { useState, useCallback } from 'react';
// import ReactFlow, { Background, Controls } from 'react-flow-renderer';
// import 'react-flow-renderer/dist/style.css';


// const CourseCardNode = ({ data }) => {
//   return (
//     <Card
//       sx={{
//         width: 200,
//         padding: 1,
//         backgroundColor:
//           data.status === 'Completed'
//             ? '#d0f0c0'
//             : data.status === 'In Progress'
//             ? '#fff3cd'
//             : '#f8d7da',
//       }}
//     >
//       <CardContent>
//         <Typography variant="h6">{data.title}</Typography>
//         <Typography variant="body2">Status: {data.status}</Typography>
//         <Typography variant="body2">Grade: {data.grade}</Typography>
//       </CardContent>
//       <CardActions>
//         <Button size="small" onClick={() => alert(`More info about ${data.title}`)}>
//           Learn More
//         </Button>
//       </CardActions>
//     </Card>
//   );
// };


// export default  function Course_tree() {
//     const nodeTypes = {
//       courseCard: CourseCardNode,
//     };
//   // Demo statuses to cycle through
// const statusOptions = ['Completed', 'In Progress', 'Locked'];
// const gradeOptions = ['A', 'B+', '-', '-', '-', 'C'];

// // 🔸 Generate 20 nodes
// const nodes = Array.from({ length: 20 }, (_, i) => ({
//   id: `${i + 1}`,
//   type: 'courseCard',
//   data: {
//     title: `Course ${i + 1}`,
//     status: statusOptions[i % statusOptions.length],
//     grade: gradeOptions[i % gradeOptions.length],
//   },
//   position: {
//     x: (i % 5) * 250, // 5 per row
//     y: Math.floor(i / 5) * 250,
//   },
// }));

// // 🔸 Connect each course to the next to simulate progression
// // const edges = Array.from({ length: 19 }, (_, i) => ({
// //   id: `e${i + 1}-${i + 2}`,
// //   source: `${i + 1}`,
// //   target: `${i + 2}`,
// // }));

// const edges = [
//   { id: 'e1-2', source: '1', target: '2' },
//   { id: 'e2-3', source: '2', target: '3', animated: true, color:'red'},
// ];

//   return (
//     <div>
//     <div style={{ width: '1500px', height: '1000px', border: '3px solid blue' }}>
//     <div style={{ marginLeft: '1px', width: '100%', height: '100%' }}>
//     <h2 style={{ color: 'red' }}>Hello from Course Tree</h2>  {/* TEST MARKER */}
//     <div style={{ height: '100%' }}>
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         fitView
//       >
//         <Background />
//         <Controls />
//       </ReactFlow>

//     </div>
//     </div>
// </div>
// </div>
      
//   );
// }



import React from 'react';
import ReactFlow, { Background, Controls,Handle,Position } from 'react-flow-renderer';
import 'react-flow-renderer/dist/style.css';
import { Card, CardContent, CardActions, Typography, Button } from '@mui/material';
import { ClassNames } from '@emotion/react';
import "../Components_css/Course_tree.css"
import CustomEdge from './Edges_tree';


// 🔹 Custom node: displays course card
const CourseCardNode = ({ data }) => {
  return (
    <Card
      sx={{
        width: 200,
        padding: 1,
        backgroundColor:
          data.status === 'Completed'
            ? '#d0f0c0'
            : data.status === 'In Progress'
            ? '#fff3cd'
            : '#f8d7da',
      }}
    >

      <Handle type="target" position={Position.Top} />

      <CardContent>
        <Typography variant="h6">{data.title}</Typography>
        <Typography variant="body2">Status: {data.status}</Typography>
        <Typography variant="body2">Grade: {data.grade}</Typography>
      </CardContent>

      <CardActions>
        <Button size="small" onClick={() => alert(`More info about ${data.title}`)}>
          Learn More
        </Button>
      </CardActions>

      {/* 🔴 Outgoing edge handle */}
      <Handle type="source" position={Position.Bottom} />
    </Card>
  );
};

const nodeTypes = {
  courseCard: CourseCardNode,
};

export default function Course_tree() {
  const nodeTypes = {
    courseCard: CourseCardNode,
  };

  // Demo statuses to cycle through
const statusOptions = ['Completed', 'In Progress', 'Locked'];
const gradeOptions = ['A', 'B+', '-', '-', '-', 'C'];

// const courseData = [
//   { id: '1', title: 'Math 101', status: 'Completed', grade: 'A' },
//   { id: '2', title: 'Physics 101', status: 'In Progress', grade: 'B+' },
//   { id: '3', title: 'Chemistry 101', status: 'Locked', grade: '-' },
// ]
// 🔸 Generate 20 nodes
// const nodes = courseData.map((course, i) => ({
//   id: `${course.id}`,   // or just `i + 1` if no ID
//   type: 'courseCard',
//   data: {
//     title: course.title,
//     status: course.status,
//     grade: course.grade,
//   },
//   position: {
//     x: (i % 5) * 250,
//     y: Math.floor(i / 5) * 250,
//   },
// }));

const nodes = Array.from({ length: 20 }, (_, i) => ({
  id: `${i + 1}`,  // ✅ string ID
  type: 'courseCard',
  data: {
    title: `Course ${i + 1}`,  // ✅ properly interpolated string
    status: statusOptions[i % statusOptions.length],
    grade: gradeOptions[i % gradeOptions.length],
  },
  position: {
    x: (i % 5) * 250,
    y: Math.floor(i / 5) * 250,
  },
}));

const edgeTypes = {
  custom: CustomEdge,
};
// 🔸 Connect each course to the next to simulate progression
const edges = [
  
  { id: 'e1-2', source: '1', target: '2', type:'custom' },
  { id: 'e2-3', source: '2', target: '4', animated: true , type:'custom'},
];
console.log("well")
console.log("Edges being passed to ReactFlow:", edges);
return (
  <div className="course-tree-wrapper">
    <div className="course-tree-inner">
      <h2 className="course-tree-title">Hello from Course Tree</h2>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.5, includeHiddenNodes: false }}
        className="flow-grid"
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        panOnScroll={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  </div>
);
}
