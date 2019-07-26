import React, { Component } from 'react';
import './Login.css';
import auth from '../auth/auth';

export class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      user: "",
      pass: ""
    };
  }

  componentDidMount(){
    auth.isAuthenticated() === "true" ?  this.props.history.push("/Home") : this.props.history.push("/")
  }

  render() {
    
    return (
      
      <div className="loginContainer">
      <div className="container-fluid loginInner  h-100 text-left">
      <div className=" col-12 text-centre titlelogin">
        <span>{this.props.loginTitle ? this.props.loginTitle : "Login"}</span>
      </div>
        <form className="col-6 offset-3 loginForm">
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Username</label>
          <input type="text" className="form-control form-control-lg" id="exampleInputEmail1" aria-describedby="emailHelp"  
          onChange={(value)=>{
            this.setState({
              user : value.target.value
            })
          }} placeholder="Enter username" />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input type="password" className="form-control form-control-lg" id="exampleInputPassword1" 
          onChange={(value)=>{
            this.setState({
              pass : value.target.value
            })
          }} placeholder="Password" />
        </div>
        <button  className="btn btn-primary" onClick={
          () => {
            auth.login( this.state, () => {
              this.props.history.push("/Home")
            })
          }
        } >
        
        Log in</button>
        </form>
      </div>
    </div>
    )
  }
}

export default Login
