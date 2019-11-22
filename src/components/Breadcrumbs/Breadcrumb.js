import React, { Component } from 'react'
import './Breadcrumbs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
export class Breadcrumb extends Component {
    constructor(props){
        super(props);
        this.state= {   

        }
        this.goTo = this.goTo.bind(this)
    }

    goTo(){
        window.open(`${window.origin}/${this.props.redirect}/${this.props.deviceName}`)
    }

    render() {
        return (
            <li key={this.props.keyL} className={"breadcrumb breadcrumbs"}>
                <a onClick={this.goTo}>
                    <img src={this.props.img} className={'bcImg'}>
                    </img>
                    &nbsp;
                    {this.props.deviceType}: 
                    {this.props.deviceName}
                </a>
                {
                    this.props.allCrumbsLoaded === true ?
                    "" :
                    <FontAwesomeIcon className="centerSpinner fa-spin" icon={["fas", "spinner"]}/>
                }
            </li>
        )
    }
}

export default Breadcrumb
