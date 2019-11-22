import React, { Component } from 'react';
import './fgpReact-SideNavigationItem.css';
import { NavLink} from 'react-router-dom' ;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import auth from '../../../rude_auth/auth';

export class SideNavigationItem extends Component {
  constructor(props){
    super(props);
    this.state = {
      extensionShown : props.extensionShown,
      currentPage : props.currentPage,
      linkTo : props.linkTo,
      fontAwesomeLib : props.fontAwesomeLib,
      fontAwesomeIcon : props.fontAwesomeIcon,
      description : props.description,
      isSignOut : this.props.isSignOut
    };
  }

  render() {
    return (
      <div className={"fgReact_SideNavigationItem " + (this.props.linkTo === this.props.currentPage ? "fgReact_SideNavigationItem-active " : "") + (this.props.extensionShown ? "fgReact_SideNavigationItem-open" : "")} title={this.props.description}>
        {
          this.state.isSignOut === true ? (
            <div>
              <div className={"fgReact_SideNavigationItemIcon " + (this.props.linkTo === this.props.currentPage ? "fgReact_SideNavigationItemIcon-active" : "") }
                onClick={()=> {
                  auth.logout(() => {
                    this.props.history.push("/");
                  })
                }}
              > 
                  <FontAwesomeIcon icon={[this.props.fontAwesomeLib, this.props.fontAwesomeIcon]}/>
              </div>
                { this.props.extensionShown ? <div className="fgReact_SideNavigationItemIconExtension">{this.props.description}</div> : null }
            </div>
          ) : (
            <NavLink to={this.props.linkTo} >
              <div className={"fgReact_SideNavigationItemIcon " + (this.props.linkTo === this.props.currentPage ? "fgReact_SideNavigationItemIcon-active" : "") }>
                <FontAwesomeIcon icon={[this.props.fontAwesomeLib, this.props.fontAwesomeIcon]}/>
              </div>
              
              { this.props.extensionShown ? <div className="fgReact_SideNavigationItemIconExtension">{this.props.description}</div> : null }
            </NavLink>
          )
        }
        
      </div>
    )
  }
}

export default SideNavigationItem
