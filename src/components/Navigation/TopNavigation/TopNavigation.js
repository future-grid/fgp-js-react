import React, { Component } from 'react';
import './fgpReact-TopNavigation.css';

export class TopNavigation extends Component {
  constructor(props){
    super(props);
    this.state = {
      isOpen: props.isOpen
    };
  }

  render() {
    return (
      <div className={"closedheader " + (this.props.isOpen === true ? "openheader" : "")}>
        <div className="companyLogo">
          {this.props.topNavTitle ? this.props.topNavTitle : "Compass"}
        </div> 
        {
          this.props.isDashboard === true ? (
            <div> 
              <button className={"fgpToggleDash"} onClick={this.props.topNavAction}>
                classic view
              </button>
            </div>
          ) : this.props.isDashboard === false ? (
            <div> 
              <button className={"fgpToggleDash"} onClick={this.props.topNavAction}>
                modern view
              </button>
            </div>
          ) : (
            ""
          )
        }
      </div>
    )
  }
}

export default TopNavigation
