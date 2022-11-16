import React from 'react'

function Login() {
  return (
    <>
    <div id='formContainer'>
        <form id='loginFormWidget' action='/loginForm' method='POST'>
            <input className="loginInputs" id="personEmail" name="personEmail" type={"email"} placeholder='Enter Your Email' pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"/>
            <input className="loginInputs" id="password" name="password" type={"password"} placeholder='Enter Your Password'/>
            <input className="loginInputs" type={"submit"} value="Login Up" style={{cursor:"pointer"}}/>
        </form>
    </div>
</>
  )
}

export default Login