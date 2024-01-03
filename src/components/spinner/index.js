// src/components/Spinner.js
import React from 'react';
import { ThreeDots } from 'react-loader-spinner';

function SpinnerDots() {
  return (
    <div class="content-body">
  
      <div className="container-fluid">
<div style={{  position:"relative",top:"25pc",display: "flex", alignItems: "center", justifyContent: "center" , backgroundColor:"#f0f6fe", }}>
      <ThreeDots
        height={80}
        width={80}
        radius={9}
        color="#04306f"
        ariaLabel="loading"
        wrapperStyle={{}}
        wrapperClass=""
        timeout={5000}
      />
    </div>
    </div>
    </div>
    
  );
}

export default SpinnerDots;
