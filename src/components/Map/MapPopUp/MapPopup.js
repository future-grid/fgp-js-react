import React, { Component } from 'react'
import './MapPopup.css'

export class MapPopup extends Component {
    constructor(props){
        super(props);
        this.state = {
          
        };
    }

    /* This component works as a popup, typically used on hover for use in the FGP React based open layers maps, you can display as many or as little
       properties of the `focusedFeature` as you like using the props to configure what is shown, this is configured through
       properties passed through to the given map props config. An example of this is as follows (NwpMapFGP.js)

       visibility={this.state.popupVisible}
       focusedFeatures={this.state.focusedFeatures}
       propertiesToDisplay={this.props.popupDisplayValues} where there `propertiesToDisplay` is as follows below  
        propertiesToDisplay={ [{label:"yourLabel", data:"yourDataAttributeName"}]} are defined in wherever the map is hosted eg.welnetExample.js
            propertiesToDisplay={[
                {
                  label: "Lat",
                  data: "lat"
                }, 
                {
                  label: "Lng",
                  data: "lng"
                }, 
                {
                  label: "Original Parent",
                  data: "originParent"
                }
              ]}

       You should note that type and device name are showed always
    */
    render() {
        return (
            <div className={ this.props.visibility === true ? ("d-block fgpReactMapPopup") : ("d-none")}>
                {/* <span>{this.props.focusedFeature ? this.props.focusedFeature.type : ""}: {this.props.focusedFeature ? this.props.focusedFeature.name : ""}</span>
                {
                    this.props.propertiesToDisplay && this.props.visibility === true ? 
                    this.props.propertiesToDisplay.map(function(prop, index ){
                        return <div key={index}><span>{this.props.focusedFeature[prop] ? prop + ": " : ""}</span><span>{this.props.focusedFeature[prop] ? this.props.focusedFeature[prop] : ""}</span></div>
                    },this) :
                    null
                } */}
                {
                    this.props.focusedFeatures ?
                        this.props.focusedFeatures.map(function(feature, index){
                            return (
                                <div className={"fgpReactMapPopupFocusItem"} key={index}>
                                    <span>{feature.type}: {feature.name}</span>
                                    {
                                        this.props.propertiesToDisplay && this.props.visibility === true ? 
                                            this.props.propertiesToDisplay.map(function(displayProperty, index ){
                                                return (
                                                    <div key={index}>
                                                        <span>{feature[displayProperty.data] ? displayProperty.label + ": " : ""}</span><span>{feature[displayProperty.data] ? feature[displayProperty.data] : ""}</span>
                                                    </div>
                                                )
                                            })
                                        :
                                        null
                                    }
                                </div>    
                            )
                        },this) :
                        // console.log(this.props.focusedFeatures)
                        // :
                        false
                }
            </div>
        )
    }
}

export default MapPopup
