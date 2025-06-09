
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactFlow, { Background, Handle, Position,Controls } from 'react-flow-renderer';
import { Card, CardContent, CardActions, Typography, Button } from '@mui/material';
import '../Components_css/Course_tree.css';
import CustomEdge from './Edges_tree';
import CircularProgress from '@mui/material/CircularProgress';


// 🔹 Custom Node Component
const CourseCardNode = ({ data }) => (
  
  <Card sx={{
    width: 200,
    padding: 1,
    zIndex: 10, // 👈 brings the card above all edges
    position: 'relative',
    backgroundColor:
      
      data.status === 'Completed'
        ? '#a5d8a7'
        : data.status === 'Failed'
        ? '#f09d9d':
        data.status === 'In Progress' ?
         '#fce7be' : 
         '#d2d2d2'
  }}>
    
    <Handle type="target" position={Position.Top} />
    <CardContent>
      <Typography variant="h6">{data.title}</Typography>
      <Typography variant="body2">Status: {data.status}</Typography>
      <Typography variant="body2">Grade: {data.grade}</Typography>
      <Typography variant="body2">Year: {data.year}</Typography>
      <Typography variant="body2">semester: {data.semester}</Typography>
      <Typography variant="body2">dep: {data.depend_on}</Typography>
      {/* <Typography variant="body2">Grade: {data.grade}</Typography> */}
    </CardContent>
    
    <Handle type="source" position={Position.Bottom} />
  </Card>
);

// 🔸 Main Component
export default function Course_tree({ userId: propUserId }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const nodeTypes = { courseCard: CourseCardNode };
  const edgeTypes = { custom: CustomEdge };
  const user_id = localStorage.getItem('user_id');
  const [noCourses, setNoCourses] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const user_id =  propUserId  
        console.log(user_id)
        const response = await axios.get('http://localhost:8000/api/graph/', {
          params: { user_id },
        });
        
         // Get user's course progress (this assumes a working endpoint)
      
      const userResponse = await axios.post('http://localhost:8000/api/graph/',null, {
        params: { user_id },
      });
        const data = response.data.courses;
       
        if (Object.keys(data).length === 0) {
          setNoCourses(true);
        } else {
          setNoCourses(false);
        }
        console.log("wl",noCourses)
        const spacingX = 250;              // horizontal spacing between courses
        const spacingY = 60;               // vertical spacing between course rows
        const semesterSpacingY = 500;      // vertical spacing between semesters
        const yearPadding = 100;           // space between years
        const semesterOrder = ["first", "second"];
        const userCourses = userResponse.data.courses; // Assuming response has a key called "courses"
        const userCourseMap = {};
        
        
        userCourses.forEach(c => {
          const isInProgress = c.finish !== true;
          userCourseMap[c.name] = {
            grade: isInProgress ? "-" : c.grade,
            status: 
              c.finish === true 
                ? c.grade >= 60
                  ? 'Completed'
                  : 'Failed'
                : c.finish !== null ?
                 'In Progress' : " "
                
          };
        });
        let nodeId = 1;
        let newNodes = [];
        let newEdges = [];
        let courseIdMap = {};
        let yearOffsetY = 0;
  
        Object.entries(data).forEach(([year, semesters], yearIndex) => {
          let maxSemesterHeight = 0;
          
          semesterOrder.forEach((semester, semIndex) => {
            const courses = semesters[semester] || [];
            const rows = Math.ceil(courses.length / 6);
            const semesterHeight = semesterSpacingY + rows * spacingY;
            newNodes.push({
              id: `label-${year}-${semester}`,
              type: 'default',
              data: { label: `Year ${year} - ${semester}` },
              position: { x: -220, y: yearOffsetY + semIndex * semesterSpacingY  },
              draggable: false,
              selectable: false,
              style: {
                background: 'transparent',
                border: 'none',
                color: 'black',
                fontWeight: 'bold',
                fontSize: '16px',       
              }
            });
            courses.forEach((course, i) => {
              const id = `${nodeId++}`;
              courseIdMap[course.name] = id;
  
              const row = Math.floor(i / 6);
              const col = i % 6;
              const x = col * spacingX;
              const y = yearOffsetY + semIndex * semesterSpacingY + row * spacingY;
              
              const userData = userCourseMap[course.name] || {};
              const status = userData.status || 'Locked';
              const grade = userData.grade ?? '-';  
              newNodes.push({
                id,
                type: 'courseCard',
                position: { x, y },
                data: {
                  title: course.name,
                  year: course.year,
                  semester: course.semester,
                  status: status,
                  grade: grade,
                  depend_on: course.depend_on || null
                }
              });
  
              if (course.depend_on && courseIdMap[course.depend_on]) {
                newEdges.push({
                  id: `e-${courseIdMap[course.depend_on]}-${id}`,
                  source: courseIdMap[course.depend_on],
                  target: id,
                  
                  type: 'smoothstep',
                  style: {
                    strokeWidth: 2,
                    stroke: '#555',
                    
                    markerEnd: 'url(#arrowhead)', // 👈 this adds the arrow
                    
                  },
                  data: { type: 'strong' }
                });
              }
            });
  
            maxSemesterHeight += semesterHeight;
          });
  
          yearOffsetY += maxSemesterHeight + yearPadding ;
        });
  
        console.log(newNodes);
        setNodes(newNodes);
        setEdges(newEdges);
      } catch (error) {
        setNoCourses(true);
        console.error('Error fetching course data:', error);
      }
        setLoading(false); // End loading
    };
  
    fetchData();
  }, []);

  return (
    <div className="course-tree-wrapper">
  <div className="course-tree-inner">
  {loading ? (
  <div style={{ padding: "2rem", textAlign: "center" }}>
  <CircularProgress />
  <Typography variant="body1" style={{ marginTop: "1rem" }}>Loading course graph...</Typography>
</div>
) : noCourses ? (
  <div style={{ padding: "20px", color: "red", fontWeight: "bold" }}>
    ⚠️ No courses found for this user.
  </div> 
    ) : (
      <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        fitView
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        fitViewOptions={{ padding: 0.5, includeHiddenNodes: false }}
        className="flow-grid"
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        panOnScroll={true}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        translateExtent={[[0, -100], [1500, 4500]]} //amount of space in the graph
      >
        <svg>
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="10"
              refY="3.5"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L10,3.5 L0,7" fill="#555" />
            </marker>
          </defs>
        </svg>
        <Background />
      </ReactFlow>
      </div>
    )}
  </div>
</div>
  );
}

