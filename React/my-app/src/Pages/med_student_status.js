import React, { useState, useEffect } from "react";
import Select from "react-select";
import Progress from "../Components/Progress";
import axios from "axios";
import StudentStatusEditor from "../Components/StudentStatusEditor";
import Course_tree from "../Components/Course_tree";

console.log("✅ Requestsubmissions_student loaded");
// To what endpoint to send
 const BASE_URL = 'http://localhost:8000/api/?/';
 const user_id = localStorage.getItem('user_id');

 function Med_student_status() {
    return (
        <div>
           {/* userId = is used to get the corrent user_id */}
          <Course_tree userId={user_id} />
        </div>
    );
  }


export default Med_student_status;