import React, { Component } from 'react';
import './AssetData.css';
import { Tabs, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ResultTable } from '../../../search/resulttable/ResultTable'; 

export class AssetData extends Component {
  constructor(props){
    super(props);
    this.state = {


    };  

  }
  componentDidUpdate(){
    console.log(this.props)
  }
  render() {
    return (
      <div className="container fgReact_assetDataContainer">
        {
          this.props.hasMap === true ?
            // render a map  
            ""
            :
            <div className="col-md-12">
              <div className="row col-md-12 fgReact_assetName alignLeft">
                <span className="">
                  Asset: &nbsp;
                  <label className="fgReact_assetLabel">{this.props.assetExtension.serialNumber}</label>
                </span>
              </div>
              <div className="row info_r">
                <ul className="col-md-6 alignLeft info_r_list">
                  <li>
                     Current Status: <label className="fgReact_assetLabel">{this.props.assetStatus.status}</label>
                  </li>
                  <li>
                     Asset Name: <label className="fgReact_assetLabel">{this.props.assetExtension.name}</label>
                  </li>
                  <li>
                     Employee Assigned: <label className="fgReact_assetLabel">{ 
                       this.props.employeeAssignedTo.name === undefined ? "Unassigned" : this.props.employeeAssignedTo.name
                     }</label>
                  </li>
                  <li>
                     Cost: <label className="fgReact_assetLabel">{this.props.assetExtension.cost ? "$" + this.props.assetExtension.cost / 100 : "Uknown Cost"}</label>
                  </li>
                  <li>
                     Department: <label className="fgReact_assetLabel">{this.props.assetExtension.department}</label>
                  </li>
                  <li>
                     Model ID: <label className="fgReact_assetLabel">{this.props.assetExtension.modelId}</label>
                  </li>
                  <li>
                     Operating System: <label className="fgReact_assetLabel">{this.props.computerExtension.operatingSystem}</label>
                  </li>
                  <li>
                     Org Unit: <label className="fgReact_assetLabel">{this.props.assetExtension.orgUnit}</label>
                  </li>
                </ul>
              </div>
            </div>
            
        }
        <Tabs defaultActiveKey="events" className="fgReact_tabs" id="uncontrolled-tab-example">
          <Tab eventKey="events" title="Events">
            {
            this.props.assetEventsLoaded === true ?  
            <ResultTable 
              defaultRowSize={3}
              defaultRowSizeArray={[3,5,10,20,50]}
              data={this.props.assetEvents}
              columns={
                [ {"accessor":"eventTs", "Header":"Date", "minWidth" : 60 , "fgpMutate": "date"},
                  {"accessor":"eventDetails", "Header":"Event Details", "minWidth" : 200}
                ]
              }
              ignoreBuildCols={false}
            /> : 
                this.props.assetEventsLoaded.length  ?  
                  <FontAwesomeIcon className="centerSpinner fa-spin" icon={["fas", "spinner"]}/>
                :
                  "No event data present"
          }
          </Tab>
        </Tabs>
      </div>
    )
  }
}

export default AssetData
