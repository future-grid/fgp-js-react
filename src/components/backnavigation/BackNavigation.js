import React, { Component } from 'react';
import './BackNavigation.css';
import { NavLink} from 'react-router-dom' ;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class BackNavigation extends Component {
  constructor(props){
    super(props);
    this.state = {
      linkTo : props
    };
    if(this.state.linkTo){
      console.log('params = ', this.props);
    }
  }

  render() {
    return (
      <div className="App-BackNavigation">
        <div className="App-BackNavigation-logo">
          {/* <NavLink to="/" >
              <img 
                alt="Navigate home" 
                src={ChizzeleBlueLogo} />
          </NavLink> */}
        </div>  
        <div className="App-BackNavigation-chevron">
          <NavLink 
            to="/" 
            className="blueText"
            >
            <FontAwesomeIcon className="App-home-link-item-icon" icon={['fas', 'chevron-left']}/>              
          </NavLink>
        </div>
      </div>
    )
  }
}

export default BackNavigation
