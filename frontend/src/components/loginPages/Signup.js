import React from 'react'

function Signup() {
  return (
    <>
        <div id='formContainer'>
            <form id='signFormWidget' action='/signupForm' method='POST'>
                <input className="loginInputs" id="personEmail" name="personEmail" type={"email"} placeholder='Enter Your Email' pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"/>
                <input className="loginInputs" id="personName" name="personName" type={"text"} placeholder='Enter Your Name'/>
                <input className="loginInputs" id="Age" name="personAge" type={"number"} placeholder='Enter Your Age'/>
                <input className="loginInputs" id="password" name="password" type={"password"} placeholder='Enter Your Password'/>
                <input className="loginInputs" type={"submit"} value="Sign Up" style={{cursor:"pointer"}}/>
            </form>
        </div>
    </>
  )
}

Signup.propTypes = {}

export default Signup
