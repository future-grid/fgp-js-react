import React, { Component } from 'react'
import {ResultTable} from '../../Search/resulttable/ResultTable';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class ChildExtensionList extends Component {
    constructor(props){
        super(props);
        this.state={
            data : null
        }
        this.getChildExt = this.getChildExt.bind(this);
        console.log("hey g here they are",this.props)
    }
    

    getChildExt(){
        let selectedDeviceNames;
        this.props.childDeviceNames.forEach( childType => {
            childType.type === this.props.childType ? selectedDeviceNames = childType.deviceNames : null;
        });
        axios.post(`${this.props.baseUrl}${this.props.childType}/${this.props.childExtension}`,
            {devices : selectedDeviceNames}
        ).then( resp => {
            this.setState({
                data: resp.data
            });
        }).catch( err => {
            console.log('Here is your error dev -_-` >ChildExtensionList< : ', err)
        })
    }
    componentDidMount(){
        this.getChildExt();
    }

    render() {
        return (
        <div className={"fgReact_componentContainer " + (this.props.isFluid === true ? " container-fluid " : " container ")}>
            {
                this.state.data !== null ? (
                    
                    <ResultTable
                        columns={this.props.tableConfig.columns}
                        data={this.state.data}
                        showPageSizeOptions={false}
                        showPageJump={false}
                        filterable={true}
                        showPagination={this.state.data.length < 15 ? false : true}
                        defaultPageSize={this.state.data.length < 15 ? this.state.data.length : 15}
                        openInNewPage={this.props.openInNewPage}
                    />
                ) : (
                    <FontAwesomeIcon className="centerSpinner fa-spin" icon={["fas", "spinner"]}/>
                )

            }
        </div>
        )
    }
}

export default ChildExtensionList
