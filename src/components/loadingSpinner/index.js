// src/components/Spinner.js
import React from 'react';
import { ThreeDots } from 'react-loader-spinner';

function SpinnerDots() {
  return (   
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
  );
}

export default SpinnerDots;
