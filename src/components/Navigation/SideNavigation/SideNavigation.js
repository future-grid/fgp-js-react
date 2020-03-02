import React, { Component } from 'react';
import './fgpReact-SideNavigation.css';
import {SideNavigationItem} from './SideNavigationItem/SideNavigationItem'

export class SideNavigation extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentPage : props.currentPage,
      isOpen : props.isOpen,
      items : props.items ? props.items : null
    };
  }

  render() {
    return (
      <div className={"fgReact-SideNavigation " + (this.props.isOpen === true ? "fgReact-SideNavigation-open " : "")}>
        <div className={"fgReact_compass2 "+ (this.props.isOpen === true ? "fgReact_compass-active2 " : "")} onClick={this.props.handler}>
          <div className="fgReact_logo-thingsat" style={this.props.sideNavLogo ? ({backgroundImage :'url('+this.props.sideNavLogo+')'}) : {backgroundImage :'url(./fgp-logo.png)'}}>
          </div>
        </div>
        {
          this.props.helperArrow === true ? (
            <div className={"helperArrowCont"} >
            {
              this.props.isOpen === true ? (
                <div className={"helperArrow helperArrow-extended"} onClick={this.props.handler}>
                  &lt; <br/> &lt; <br/> &lt; <br/>        
                </div>
              ) : (
                <div className={"helperArrow"} onClick={this.props.handler}>
                  &gt; <br/> &gt; <br/> &gt; <br/>        
                </div>
              )
            }
          </div>
          ) : ""
        }

        {
          this.props.items.map((item) => {
            return (
            <SideNavigationItem
              key={item.key}
              extensionShown={this.props.isOpen}
              currentPage={this.props.currentPage}
              linkTo={item.linkTo}
              fontAwesomeIcon={item.fontAwesomeIcon}
              fontAwesomeLib={item.fontAwesomeLib}
              description={item.description}

            />
            )
          })
        }
        {/* Always have sign out */}
        <SideNavigationItem
          history={this.props.history}
          extensionShown={this.props.isOpen}
          currentPage={this.props.currentPage}
          linkTo={"/Signout"}
          fontAwesomeIcon="sign-out-alt"
          fontAwesomeLib="fa"
          description="Sign Out"
          isSignOut={true}
          signOutMethod={this.props.signOutMethod}
        />
        <div className="fgReact_SideNavigationBuildVersion">
          {this.props.isOpen === true && this.props.buildVersion && this.props.buildVersion !== null ?
          <a href={this.props.buildVersion.linkTo} target="_blank">
            <div >
                <span style={{paddingLeft: '10px'}}>Version: {this.props.buildVersion.version}</span>
            </div>
          </a>

          : null}
          {this.props.isOpen === true && this.props.buildEnv && this.props.buildEnv !== null ?
            <div >
                <span style={{paddingLeft: '10px'}}>Env: {this.props.buildEnv}</span>
            </div>
          : null}
        </div>

      </div>
    )
  }
}

export default SideNavigation
