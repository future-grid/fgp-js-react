import React, { Component } from 'react';
import './AssetData.css';
import { Tabs, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ResultTable } from '../../../search/resulttable/ResultTable'; 
import Moment from 'react-moment';
import NavLink from 'react-bootstrap/NavLink';
import AssetDataRow from './AssetDataRow';

export class AssetData extends Component {
  constructor(props){
    super(props);
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
                  <label className="fgReact_assetLabel">{this.props.assetName}</label>
                </span>
              </div>
              <div className="row info_r">
                <ul className="col-md-6 alignLeft info_r_list">
                {
                    // Iterates over the data set and renders each as a title and label
                    // Will not work for things that pass in objects/lists/null.
                    this.props.data ? 
                    this.props.data.map((row, i) => {
                      if(typeof row.data !== 'object') {
                        if(row.redirect) {
                          return ( // if there is a redirect, render the row with the redirect
                            <li key={row.key}>
                              <a className="fgReact_assetRedirect" href={row.redirect}> <AssetDataRow key={row.key} title={row.title} data={row.data} style={row.style} /> </a>
                            </li>
                          )
                        } else {
                          return ( // if there is no redirect, render the row on its own
                            <li key={row.key}>
                              <AssetDataRow key={row.key} title={row.title} data={row.data} style={row.style} />
                            </li>
                          )
                        }
                      }
                    }) : ""
                  }
                </ul>
              </div>
            </div>
            
        }
        {/* <Tabs defaultActiveKey="events" className="fgReact_tabs" id="uncontrolled-tab-example">
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
        </Tabs> */}
      </div>
    )
  }
}

export default AssetData
