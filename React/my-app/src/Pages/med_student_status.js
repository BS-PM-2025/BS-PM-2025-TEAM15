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
        <div>
          <Course_tree />
        </div>
    );
  }


export default Med_student_status;