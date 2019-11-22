import React, { Component } from 'react'
import "./externalLink.css"

export class ExternalLink extends Component {
    constructor(props){
        super(props);
        console.log(window.location)
        console.log(window.location.href);
    }
    render() {
        return (
            <li className={"text-left ls-none"} style={{"padding" : "6px 0"}}>
                <a title={this.props.itemDesc} target={"_blank"} className={"links"} href={this.props.itemLink}>
                    <div className={"links_tooltip categoryContainer"}>
                       > {this.props.itemName} 
                       {/* <span className={"tooltipText"}>{this.props.itemDesc}</span> */}
                    </div>
                </a>
            </li>
        )
    }
}

export default ExternalLink
