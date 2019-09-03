import React, { Component } from 'react';
import './DeviceData.css';
import { Tabs, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ResultTable } from '../../../search/resulttable/ResultTable'; 

export class DeviceData extends Component {
  constructor(props){
    super(props);
    this.state = {


    };  

  }
  componentDidUpdate(){
  }
  render() {
    return (
      <div className="">
          <div className="row col-12 fgReact_assetName alignLeft">
            <span className="">
              {this.props.deviceType ? this.props.deviceType : "Device"}: &nbsp;
              <label className="fgReact_assetLabel">{this.props.deviceExtension.transformer_ext.txName}</label>
            </span>
          </div>
          <div className="row info_r">
            <ul className="col-12 alignLeft info_r_list">
              <li>
                  Site kVA: <label className="fgReact_assetLabel">{this.props.deviceExtension.transformer_ext.rating}</label>
              </li>
              <li>
                  Equipment Type: <label className="fgReact_assetLabel">{this.props.deviceExtension.transformer_ext.equipmentType}</label>
              </li>
              <li>
                  Smart Meters: <label className="fgReact_assetLabel">{this.props.deviceExtension.transformer_ext.smartMeterCount}</label>
              </li>
              <li>
                  TOU Meters: <label className="fgReact_assetLabel">{this.props.deviceExtension.transformer_ext.touMeterCount}</label>
              </li>
              <li>
                  Monthly Meters: <label className="fgReact_assetLabel">{this.props.deviceExtension.transformer_ext.monthlyMeterCount}</label>
              </li>
              <li>
                  Total Meters: <label className="fgReact_assetLabel">{
                    this.props.deviceExtension.transformer_ext.monthlyMeterCount + 
                    this.props.deviceExtension.transformer_ext.touMeterCount +
                    this.props.deviceExtension.transformer_ext.smartMeterCount}</label>
              </li>
            </ul>
          </div>   


       
        {/* <Tabs defaultActiveKey="timeseries" className="fgReact_tabs" id="uncontrolled-tab-example">
          <Tab eventKey="timeseries" title="Time Series">
            
          </Tab>
        </Tabs> */}
      </div>
    )
  }
}

export default DeviceData
