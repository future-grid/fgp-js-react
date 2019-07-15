import React, { Component } from 'react'
import NavLeaf from './nav-leaf.svg';
import './FloatingFooter.css';

export class FloatingFooter extends Component {
  render() {
    return (
      <footer className="fgReact_floatingfooter">
        <a href="http://www.future-grid.com/"> 
          <img alt="go to future grid website" href="" src={NavLeaf}></img>
          2019 © Future-Grid
        </a>
      </footer>
    )
  }
}

export default FloatingFooter
