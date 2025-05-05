import React from 'react';
import ReactFlow, { Background, Controls } from 'react-flow-renderer';
import 'react-flow-renderer/dist/style.css';
import { Card, CardContent, CardActions, Typography, Button } from '@mui/material';

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
    </Card>
  );
};

export default function Course_tree() {
  const nodeTypes = {
    courseCard: CourseCardNode,
  };

  // Demo statuses to cycle through
const statusOptions = ['Completed', 'In Progress', 'Locked'];
const gradeOptions = ['A', 'B+', '-', '-', '-', 'C'];

// 🔸 Generate 20 nodes
const nodes = Array.from({ length: 20 }, (_, i) => ({
  id: `${i + 1}`,
  type: 'courseCard',
  data: {
    title: `Course ${i + 1}`,
    status: statusOptions[i % statusOptions.length],
    grade: gradeOptions[i % gradeOptions.length],
  },
  position: {
    x: (i % 5) * 250, // 5 per row
    y: Math.floor(i / 5) * 250,
  },
}));

// 🔸 Connect each course to the next to simulate progression
const edges = Array.from({ length: 19 }, (_, i) => ({
  id: `e${i + 1}-${i + 2}`,
  source: `${i + 1}`,
  target: `${i + 2}`,
}));
  return (
    <div style={{ width: '1200px', height: '100%', border: '3px solid blue' }}>
    <div style={{ width: '150%', height: '100%' }}>
    <h2 style={{ color: 'red' }}>Hello from Course Tree</h2>  {/* TEST MARKER */}
      <ReactFlow  nodes={nodes}
  edges={edges}
  nodeTypes={nodeTypes}
  fitView
  fitViewOptions={{ padding: 0.5, includeHiddenNodes: false }}

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
