import React, { Component } from 'react'
import { MapPopup } from '../mapPopup/MapPopup'
import './NwpMapFGP.css';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON.js';
import {defaults as defaultControls, OverviewMap} from 'ol/control.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
import { layer } from '@fortawesome/fontawesome-svg-core';


/* 
Network Planning Map - The basic map functionality is present here, that includes a popover on hover and support the 
additional features, this map differs as it supports transferring children from a sources parent to the relation of 
the specified target parent children set. When defining styles you may use HTML keywords eg. "red", "blue" 
or color hex values eg. "#ffffff".

Properties to pass into this tool include the following, please note you must provide at MINIMUM one destinationFeatures array entry
  sourceFeaturesParent - This is the source's (where you want to transfer from) Parent device for example a Transformer
                         in a Transformer - ICP relation. an example of the bare minimum for this prop is below.
    sourceFeaturesParent = {
      deviceName : "E00025675COMP",
      lat : -37.8028377815772,
      lng : 174.880836345938
    }

  sourceFeaturesParentStyles - This is the source Parent device's accompanying style, or how it will appear on the map,
                               fillColor is the center of the dot, label is what will appear as the device type in the popup
                               on hover, borderColor is the external stroke of the dot, borderWidth is the width of this stroke
                               an example of the bare minimum for this prop is below.
    sourceFeaturesParentStyles = {
      label : "Transformer",
      borderColor : "blue",
      borderWidth : "1",
      fillColor : "blue",
    }

  sourceFeaturesChildren - This is the source's (where you want to transfer from) Child device array for example a ICP
                         in a Transformer - ICP relation. an example of the bare minimum for this prop is below.
    sourceFeaturesChildren = [
      {
        deviceName : "0012650932WE139",
        lat : -37.801555,
        lng : 174.883438
      },
      {
        deviceName : "0000037032WE096",
        lat : -37.802375,
        lng : 174.878309
      },
      etc.....
    ]

  sourceFeaturesChildrenStyles - This is the source Child device's accompanying style, or how it will appear on the map,
                               fillColor is the center of the dot, label is what will appear as the device type in the popup
                               on hover, borderColor is the external stroke of the dot, borderWidth is the width of this stroke
                               an example of the bare minimum for this prop is below.
    sourceFeaturesChildrenStyles = {
        label : "ICP",
        borderColor : "black",
        borderWidth: "1",
        fillColor : "lightblue"
      }

  destinationFeatures - This is the array of Destination objects, these destination objects will contain both the parent and children
                        objects, this is a more complex structure than the last 2 props, however is quite similar, just more compact. 
                        an example of this destinationFeatures array is below, take time to ensure your data matches this, at minimum
                        for both parent.device object and children.devices array objects must have deviceName, lat and lng properties.
                        you must include all style properties defined as well. In this example I have provided only one destination 
                        feature for space constraints, but you may add as many as you wish, I advise different styles so it is clear
                        which child belongs to which parent, I am using the following convention 
                        BOLD COLOR (red) = PARENT fill and stroke
                        SOFT COLOR, shade of BOLD COLOR (pink) = Child fill, stroke BLACK

    destinationFeatures = [
      {
        parent : {
          device : {
            deviceName : "E000300e9COMP",
            lat : -37.8914305756977,
            lng : 175.120603129093
          },
          style : {
            label : "Transformer",
            borderColor : "red",
            borderWidth : "1",
            fillColor : "red",
          }
        },
        children : {
          devices: [
            {
              deviceName : "0000016378WEBCC",
              lat : -37.892923,
              lng : 175.120257,
            },
            {
              deviceName : "0000001139WE3AA",
              lat : -37.892923,
              lng : 175.120257,
            },
            {
              deviceName : "0000011687WE560",
              lat : -37.890748,
              lng : 175.120469,
            },
            {
              deviceName : "0000011172WE73A",
              lat : -37.891584,
              lng : 175.121162,
            }
          ],
          style: {
            label : "ICP",
            borderColor : "black",
            borderWidth: "1",
            fillColor : "pink"
          }
        }
      }
    ]


Like the other map you can pass through parameters to style the given dots and this is encouraged or the default styles
will be applied, notably.

On click of the source children devices, they will inherit a halo that is the same color as the destination outline to 
communicate the source child device has been swapped to the target parents relation group

I recommend for clarity setting the parent device to a solid, dark color, then the children for that parent to a lighter shade of that color
eg Parent: blue... Child: lightblue
You may use defined html accepted named colors, or hex colors
*/

export class NwpMapFGPV2 extends Component {
  constructor(props){
      super(props);
      this.state = {
          popupVisible:false,
          focusedFeatures: null,
          focusedGroup: null,
          projection : this.props.projection ? this.props.projection : 'EPSG:4326',
          id: this.props.id ? this.props.id : Math.random().toString(36).substr(2, 11),
          points: [],
          devices : [],
          swappedDevices: [],
          parentDevices: [],
          thoroughTest: false,
          mapReady : false
      };
      this.extractFeatures = this.extractFeatures.bind(this);
      this.buildFeature = this.buildFeature.bind(this);
      this.buildMap = this.buildMap.bind(this);
      this.buildSource = this.buildSource.bind(this);
  }

  // once the component is ready, build the map
  componentDidMount(){
    this.extractFeatures();
  }


  // expected input
  /*
    device = {
      parent : {
        lat : lat,
        lng : lng,
        deviceName : deviceName
        deviceId : deviceId
      },
      children : [
        {
          lat : lat,
          lng : lng,
          deviceName : deviceName
          deviceId : deviceId,
          currentParent : currentParent,
          originParent :  originParent
        },
        {
          lat : lat,
          lng : lng,
          deviceName : deviceName
          deviceId : deviceId
          currentParent : currentParent,
          originParent :  originParent
        },
        
      ],
      style : {
        parent : {
          borderColor : borderColor,
          fillColor : fillColor,
          borderWidth : borderWidth,
          label : label
        },
        child : {
          borderColor : borderColor,
          fillColor : fillColor,
          borderWidth : borderWidth,
          label : label
        }
      }
    }
  */

  // takes the devices passed in by props, and generates features for use with open layers
  // expected input is above
  extractFeatures(){
    let devices = [...this.props.devices];
    let processedDevices = [];
    // for each device create a single parent feature, and child features.
    devices.forEach( (device, i) => {
      console.log(device)
      let parentDevice = device.parent;
      console.log(parentDevice)
      // building the parent feature
      let parentFeature = this.buildFeature(parentDevice.lat, parentDevice.lng, device.style.parent, parentDevice.deviceName, parentDevice.deviceId, true);
      let childrenFeatures = [];
      // building the child features
      device.parent.children.forEach( child => {
        let childFeature = this.buildFeature(child.lat, child.lng, device.style.child, child.deviceName, child.deviceId, false, device.originParentName, device.originParentId)
        childrenFeatures.push({
          feature : childFeature,
          lat : child.lat,
          lng : child.lng,
          deviceName : child.deviceName,
          deviceId : child.deviceId,
          originParentName : parentDevice.name ,
          currentParentName : parentDevice.name ,
          currentParentId :parentDevice.id,
          originParentId :parentDevice.id 
        });
      });
      // recreating the array with the feature property 
      processedDevices.push(
        {
          parent : {
            feature : parentFeature,
            lat : device.parent.lat,
            lng : device.parent.lng,
            deviceName : device.parent.name,
            deviceId : device.parent.name            
          },
          children : childrenFeatures,
          style : {
            parent : device.style.parent,
            child  : device.style.child
          }
        }
      )
    }); 
    // setting the state to the new array 
    this.setState({
      devices : processedDevices
    })
    // calling the buildMap function
    this.buildMap(processedDevices);
  }


  buildStyle(fillColor, borderColor, borderWidth, radius, returnFunc){
    var image = new CircleStyle({
      radius: radius,
      fill: new Fill({
        color: fillColor
      }),
      stroke: new Stroke({
        color: borderColor, 
        width: borderWidth
      })
    });
    var styles = {
      'Point': new Style({
        image: image
      })
    };
    // Returning the actual style function, needed for first time creation, not modifying functions
    if(returnFunc === true){
      var style = function(feature) {
        return styles[feature.getGeometry().getType()];
      };  
    }else{
      // returning just updated styles and not the function
      var style = styles.Point;
    }
    return style;
  }

  buildSource(processedDevice){
    var points = [...this.state.points];
    // First creating Open Layers objects for the parent
    // Initializing the Geo Json
    var parentGeoJson = {
      'type': 'FeatureCollection',
      'features': [processedDevice.parent.feature]
    };
    // Creating the style function
    var parentStyleFunction = this.buildStyle(
      processedDevice.style.parent.fillColor, 
      processedDevice.style.parent.borderColor, 
      processedDevice.style.parent.borderWidth,
      4,
      true
    );
    // pushing lat and long into the points for calculation
    points.push(processedDevice.parent.lng, processedDevice.parent.lat)
    // initializing the vector source
    var parentVectorSource = new VectorSource({
      features : (new GeoJSON()).readFeatures(parentGeoJson)
    });
    // initializing the vector layer
    var parentVectorLayer = new VectorLayer({
      source : parentVectorSource,
      style : parentStyleFunction,
      key : 'parent_' + processedDevice.parent.deviceId
    });
    // Second creating Open Layers objects for the children
    // Initializing the Geo Json
    var childGeoJson = {
      'type': 'FeatureCollection',
      'features': []
    };
    //pushing all features
    processedDevice.children.forEach(child => {
      childGeoJson.features.push(child.feature);
    });
    // Creating the style function
    var childStyleFunction = this.buildStyle(
      processedDevice.style.child.fillColor, 
      processedDevice.style.child.borderColor, 
      processedDevice.style.child.borderWidth,
      4,
      true
    );
    // initializing the vector source
    var childVectorSource = new VectorSource({
      features : (new GeoJSON()).readFeatures(childGeoJson)
    });
    // initializing the vector layer
    var childVectorLayer = new VectorLayer({
      source : childVectorSource,
      childStyleFunction,
      key: 'child_' + processedDevice.parent.deviceId
    });

    let processedSourceObj = {
      parentVectorLayer : parentVectorLayer,
      childVectorLayer : childVectorLayer,
      points : points
    }
    return processedSourceObj;
  }


  buildMap(processedDeviceArray){
    var tempProcessedDeviceArray = [...processedDeviceArray];
    var layerArr = [];
    var points = [...this.state.points];
    let sources;
    //pushing the OSM layer, then pushing in the compiled layers
    layerArr.push(new TileLayer({
      source: new OSM()
    }));
    tempProcessedDeviceArray.forEach( (device, i) => {
       sources = this.buildSource(device);
       layerArr.push(sources.parentVectorLayer, sources.childVectorLayer);
       points.push(sources.points)
    });
    
    console.log('Source Array : ', layerArr)

    // getting center
    var getCentroid = function (coOrd) {
      var totalLen = 0;
      coOrd.forEach(arr => {
        totalLen += arr.length
      })
      let totalX = 0;
      let totalY = 0;
      coOrd.flat().forEach(location => {
        totalX += location[0];
        totalY += location[1];
      })
      let center = [totalX/totalLen, totalY/totalLen];;
      return center;
    }
    var layerCenter = getCentroid(points);

    // making the map
    let nwpMap = new Map({
      controls: defaultControls().extend([
        new OverviewMap()
      ]),
      layers : layerArr,
      target : this.state.id,
      view : new View({
        center : layerCenter,
        zoom : 16,
        projection : this.state.projection
      })
    })
    this.setState({
      map : nwpMap,
      layerArr : layerArr,
      mapReady : true
    });
    console.log("layers", nwpMap.getLayers());
    nwpMap.getLayers().forEach(layer => {
      console.log('layer props', layer.getProperties())
      console.log('layer props', layer.getKeys())
    })
    console.log("properties", nwpMap.getProperties());
    console.log("view", nwpMap.getView());
    
    
    nwpMap.updateSize()
  }

  // child.lat, child.lng, device.style.child, child.deviceName, child.deviceId, false, device.originParent
  buildFeature(latitude, longitude, styleObj, deviceName, deviceId, data, isParent, parentDeviceName, parentDeviceId, channels){
    let feature; 
    // making a child feature 
    if(isParent === false){
        feature = {
          'type' : "Feature",
          'id': '_' + deviceId,
          'geometry': {
            'type': "Point",
            'crs': {
              'type': 'name',
              'properties': {
                'name': 'EPSG:4326'
              }
            },
            'coordinates': [
              longitude,
              latitude
            ]
          },
          "geometry_name": "geom",
          "properties": {
            lat : latitude,
            lng : longitude,
            type : styleObj.label,
            id : '_' + deviceId,
            name : deviceName,
            isSwapped : false,
            // firstTimeSwapped: true,
            originParentName : parentDeviceName,
            currentParentName : parentDeviceName,
            originParentNameId : parentDeviceId,
            currentParentId : parentDeviceId,
            channels: channels
          }
        }
    }else{
      feature = {
        'type' : "Feature",
        'id': '_' + deviceId,
        'geometry': {
          'type': "Point",
          'crs': {
            'type': 'name',
            'properties': {
              'name': 'EPSG:4326'
            }
          },
          'coordinates': [
            longitude,
            latitude
          ]
        },
        "geometry_name": "geom",
        "properties": {
          "lat":  latitude,
          "lng": longitude,
          "type": styleObj.label,
          "id": '_' + deviceId,
          "name": deviceName,
        }
      }
    }
    return feature;
  }
   

    render() {
        return (
          
                <div className={"w-100 map fgpReactMap"} id={this.state.id}>
                  <MapPopup
                    visibility={this.state.popupVisible}
                    focusedFeatures={this.state.focusedFeatures}
                    propertiesToDisplay={this.props.propertiesToDisplay}
                  />
                </div>

            
        )
    }
}

export default NwpMapFGPV2

