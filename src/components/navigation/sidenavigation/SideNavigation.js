import React, { Component } from 'react';
import './SideNavigation.css';
import { SideNavigationItem } from  './sidenavigationitem/SideNavigationItem';

export class SideNavigation extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentPage : props.currentPage,
      isOpen : props.isOpen
    };
  }

  render() {
    return (
      <div className={"fgReact-SideNavigation " + (this.props.isOpen === true ? "fgReact-SideNavigation-open " : "")}>
        <div className={"fgReact_compass2 "+ (this.props.isOpen === true ? "fgReact_compass-active2 " : "")} onClick={this.props.handler}>
          <div className="fgReact_logo-thingsat" style={this.props.sideNavLogoPath ? ({backgroundImage :'url(../'+this.props.sideNavLogoPath+')'}) : {backgroundImage :'url(./fgp-logo.png)'}}>
          </div>
        </div>
        
        <SideNavigationItem
          extensionShown={this.props.isOpen}
          currentPage={this.props.currentPage}
          linkTo="/Home"
          fontAwesomeIcon="home"
          fontAwesomeLib="fas"
          description="Home"
        />

        <SideNavigationItem
          extensionShown={this.props.isOpen}
          currentPage={this.props.currentPage}
          linkTo="/WelnetExample/E00025675COMP"
          fontAwesomeIcon="map"
          fontAwesomeLib="fas"
          description="WEL Map Example"
        />
        
        {/* the signout button always needs history as a prop to properly sign out */}
        <SideNavigationItem
          history={this.props.history}
          extensionShown={this.props.isOpen}
          currentPage={this.props.currentPage}
          isSignOut={true}
          linkTo="/Signout"
          fontAwesomeIcon="sign-out-alt"
          fontAwesomeLib="fa"
          description="Sign Out"
        />
      </div>
    )
  }
}

export default SideNavigation
