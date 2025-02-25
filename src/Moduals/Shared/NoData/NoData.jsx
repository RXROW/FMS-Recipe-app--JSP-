  /* eslint-disable no-unused-vars */
  import React from 'react'
  import Nodata from "../../../assets/images/No-Data.png";
  // src\assets\images\No-Data.png
  export default function NoData() {
    return (
      <div className=' text-center'>
        <img src={Nodata} alt="NoData" />
        <h3>No Data Available!</h3>
      </div>
    )
  }
