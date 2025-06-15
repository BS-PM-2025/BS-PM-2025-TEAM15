import React from "react";
import {useState} from "react";
import styles from '../App.css';

export default function Progress({progress}) {

    return (
        
            // <div style={{ width: "100%", backgroundColor: "#eee", borderRadius: "10px", height: "20px" }}>
            //     <div 
            //         style={{ 
            //             width: `${progress}%`,
            //             backgroundColor: "#4caf50",
            //             height: "100%",
            //             borderRadius: "10px",
            //             transition: "width 0.3s"
            //         }}
            //     ></div>
            // </div> 
            <div class="loader" ></div>
    );
  }