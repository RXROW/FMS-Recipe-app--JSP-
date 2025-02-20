import React from 'react'
import Header from '../Shared/Header/Header'
import img from '../../assets/images/eating.png'

const Dashboard = (loginData) => {
  // console.log("from dashboard" + loginData.loginData.userName)
  return (
    <div> 
    

<Header
        title={`Welcome ${loginData?.loginData?.userName}`}
        decsription={
          "This is a welcoming screen for the entry of the application ,you can now see the options"
        }
        img={img}
      />



    </div>
  )
}

export default Dashboard