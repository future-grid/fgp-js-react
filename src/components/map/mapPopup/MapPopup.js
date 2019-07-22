import React, { Component } from 'react'
import './MapPopup.css'

export class MapPopup extends Component {
    constructor(props){
        super(props);
        this.state = {
          
        };
    }

    componentDidUpdate(){
        // console.log(this.props)
    }

    render() {
        return (
            <div className={ this.props.visibility === true ? ("d-block fgpReactMapPopup") : ("d-none")}>
                <span>{this.props.focusedFeature ? this.props.focusedFeature.type : ""}:  {this.props.focusedFeature ? this.props.focusedFeature.name : ""}</span>
            </div>
        )
    }
}

export default MapPopup
