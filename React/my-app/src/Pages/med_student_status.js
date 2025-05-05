import React, { useState, useEffect } from "react";
import Select from "react-select";
import Progress from "../Components/Progress";
import axios from "axios";
import StudentStatusEditor from "../Components/StudentStatusEditor";
import Course_tree from "../Components/Course_tree";
console.log("✅ Requestsubmissions_student loaded");

// To what endpoint to send
 const BASE_URL = 'http://localhost:8000/api/?/';

 function Med_student_status() {
    return (
<div style={{ flexGrow: 1, height: '100%', padding: '1rem' }}>
{/* If there's a sidebar, it would be before this in your layout */}
        <div style={{ flexGrow: 1, height: '100%' }}>
          <Course_tree />
        </div>
      </div>
    );
  }


export default Med_student_status;