import React, { Component } from 'react';
import './AssetData.css';
import Moment from 'react-moment';

export class AssetDataRow extends Component {
    constructor(props) {
        super(props);

    }

    render () {
        return (
            <span >
                {`${this.props.title}  : `} 
                <label className="fgReact_assetLabel" >{
                    this.props.style === 'datetime' ? <Moment date={this.props.data} format={"lll"}></Moment> : // date time style
                    this.props.style === 'currency' ? <span>{`A$${this.props.data}`}</span> : // currency style
                                               <span>{this.props.data}</span> // default style
                }</label>
            </span>
        )
    }
}

export default AssetDataRow;