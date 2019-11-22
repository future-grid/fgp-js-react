import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom' ;


export class RouteWrap extends Component {
  constructor(props){
    super(props);
    this.state={
      isOpen: false
    }
    this.toggleNav = this.toggleNav.bind(this);
  }

  toggleNav(){
    this.setState({
      isOpen : !isOpen
    })
    console.log('nav was changed to', this.state.isOpen)
  }

  render() {
    return (
        <Router>
            <Switch>
                {
                  React.Children.map(this.props.children, child =>{
                    return( React.cloneElement(child, {
                      isOpen: this.state.isOpen,
                      toggleNav : this.toggleNav
                    }))
                  })
                }
            </Switch>
        </Router>
    )
  }
}

export default RouteWrap
