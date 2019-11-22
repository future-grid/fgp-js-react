import React, { Component } from 'react';
import './fgpReact-Page.css';
// a simple container
export class Page extends Component {
  constructor(props){
    super(props);
    this.state = {
      
    };
  }
  render() {
    return (
      <div className="fgReact_home">      
        {this.props.children}
      </div>
    )
  }
}

export default Page
