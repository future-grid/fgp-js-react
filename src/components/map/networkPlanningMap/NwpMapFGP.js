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

export class NwpMapFGP extends Component {
    constructor(props){
        super(props);
        this.state = {
            popupVisible:false,
            focusedFeatures: null,
            focusedGroup: null,
            id: Math.random().toString(36).substr(2, 11),
            points: [],
            swappedDevices: [],
            parentDevices: [],
            thoroughTest: false
        };
    }

    // once the component is ready, build the map
    componentDidMount(){
      this.buildMap() 
    }

    // Creates Feature, Style, GeoJSON, Vector Source and Vector Layer for the Source Device
    buildSourceFeatures(){
      let points = [...this.state.points]
      // BEGIN SOURCE PARENT CODE
      // parent geoJSON
      var geojsonObjectParentSource = {
        'type': 'FeatureCollection',
        'features': [ ]
      };
      var styleFunctionParentSource = this.buildStyle(
        this.props.sourceFeaturesParentStyles.fillColor, 
        this.props.sourceFeaturesParentStyles.borderColor, 
        this.props.sourceFeaturesParentStyles.borderWidth,
        4,
        true
      );

      // creating the parent feature
      let featureObjParentSource = this.buildFeature(
        this.props.sourceFeaturesParent.lat, 
        this.props.sourceFeaturesParent.lng,
        this.props.sourceFeaturesParentStyles.label,
        this.props.sourceFeaturesParent.deviceName,
        false
      )
      points.push([this.props.sourceFeaturesParent.lng, this.props.sourceFeaturesParent.lat])
      geojsonObjectParentSource.features.push(featureObjParentSource)

      // building the vector source with geojson and feature
      var vectorSourceParentSource = new VectorSource({
        features: (new GeoJSON()).readFeatures(geojsonObjectParentSource)
      });
      // creating a vector layer with the source and style
      var vectorLayerParentSource = new VectorLayer({
        source: vectorSourceParentSource,
        style: styleFunctionParentSource,
        key: "parentSource"
      });

      // BEGIN SOURCE CHILD CODE
      var geojsonObjectChildrenSource = {
        'type': 'FeatureCollection',
        'features': [ ]
      };
      
      var styleFunctionChildrenSource = this.buildStyle(
        this.props.sourceFeaturesChildrenStyles.fillColor, 
        this.props.sourceFeaturesChildrenStyles.borderColor, 
        this.props.sourceFeaturesChildrenStyles.borderWidth,
        4,
        true
      );
      
      // creating features for the geojson
      this.props.sourceFeaturesChildren.forEach( feature => {
        let featureObj = this.buildFeature(
          feature.lat, 
          feature.lng, 
          this.props.sourceFeaturesChildrenStyles.label,
          feature.deviceName,
          true,
          this.props.sourceFeaturesParent.deviceName
        );
        if(this.state.thoroughTest === true){
          let featureObjDupe = this.buildFeature(
            feature.lat +0.00007, 
            feature.lng, 
            this.props.sourceFeaturesChildrenStyles.label+"_d",
            feature.deviceName+"_d",
            true,
            this.props.sourceFeaturesParent.deviceName
          );
          geojsonObjectChildrenSource.features.push(featureObjDupe)
        }
        geojsonObjectChildrenSource.features.push(featureObj)
      })
      // creating the source with the features and geojson
      var vectorSourceChildrenSource = new VectorSource({
        features: (new GeoJSON()).readFeatures(geojsonObjectChildrenSource)
      });
      // creating a vector layer with the source and style
      var vectorLayerChildrenSource = new VectorLayer({
        source: vectorSourceChildrenSource,
        style: styleFunctionChildrenSource,
        key: "childSource"
      });
      // returning an object for both child and parent layers to be accessed via
      let tmpParentStyle = {
        deviceName : this.props.sourceFeaturesParent.deviceName,
        borderColor : this.props.sourceFeaturesChildrenStyles.borderColor
      }
      return {parent: vectorLayerParentSource, child:vectorLayerChildrenSource, points:points, parentForSwap: tmpParentStyle}
    }

    // pass through the fill, border, width, radius and a return function flag
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

    // creates the feature (marker), if is a source child device pass through flag isSourceChild
    buildFeature(lat, lng, label, deviceName, isSourceChild, parentName){
      let feature;
      if(isSourceChild === true){
        feature = {
          'type' : "Feature",
          'id': '_' + Math.random().toString(36).substr(2, 11),
          'geometry': {
            'type': "Point",
            'crs': {
              'type': 'name',
              'properties': {
                'name': 'EPSG:4326'
              }
            },
            'coordinates': [
              lng,
              lat
            ]
          },
          "geometry_name": "geom",
          "properties": {
            lat : lat,
            lng : lng,
            type : label,
            id : '_' + Math.random().toString(36).substr(2, 11),
            name : deviceName,
            isSwapped : false,
            // firstTimeSwapped: true,
            originParent : parentName,
            currentParent : parentName
          }
        }
      }else{
        feature = {
          'type' : "Feature",
          'id': '_' + Math.random().toString(36).substr(2, 11),
          'geometry': {
            'type': "Point",
            'crs': {
              'type': 'name',
              'properties': {
                'name': 'EPSG:4326'
              }
            },
            'coordinates': [
              lng,
              lat
            ]
          },
          "geometry_name": "geom",
          "properties": {
            "lat":  lat,
            "lng": lng,
            "type": label,
            "id": '_' + Math.random().toString(36).substr(2, 11),
            "name": deviceName,
          }
        }
      }
      return feature;
    }


    buildMap(){
      if(this.props.sourceFeaturesChildren){
        let vectorLayerParentSource = this.buildSourceFeatures().parent;
        let vectorLayerChildrenSource = this.buildSourceFeatures().child
        let specialParentSwapStyle = this.buildSourceFeatures().parentForSwap;
        let points = [...this.state.points] 
        points.push(this.buildSourceFeatures().points)
        
        /* //// //// //// //// //// //// //// //// //// //// //// */
        // BEGIN TARGET CODE (goes through parents, then children)
        let targetDestinationLayers = [];
        let tmpParents = [...this.state.parentDevices];
        tmpParents.push(specialParentSwapStyle);
        this.props.destinationFeatures.forEach(destinationFeature => {
          // creating a geoJSON each time for the parent
          var geojsonObjectParentTarget = {
            'type': 'FeatureCollection',
            'features': []
          };
          // creating a geoJSON each time for the child
          var geojsonObjectChildrenTarget = {
            'type': 'FeatureCollection',
            'features': []
          };
  
          var styleFunctionChildrenTarget = this.buildStyle(
            destinationFeature.children.style.fillColor,
            destinationFeature.children.style.borderColor, 
            destinationFeature.children.style.borderWidth, 
            4,
            true
          );
            
          // Setting up the target children features
          destinationFeature.children.devices.forEach( feature => {
            let featureObj = this.buildFeature(
              feature.lat,
              feature.lng,
              destinationFeature.children.style.label,
              feature.deviceName,
              false
            );
            // Removing the push of children so that you get the center between two parents
            // points[0].push([feature.lng, feature.lat])
            geojsonObjectChildrenTarget.features.push(featureObj)
          })
  
          // creating the parent target feature
          // parent target  style 
          var styleFunctionParentTarget = this.buildStyle(
            destinationFeature.parent.style.fillColor,
            destinationFeature.parent.style.borderColor, 
            destinationFeature.parent.style.borderWidth,
            4,
            true
          );
  
          let featureObjParentTarget =  this.buildFeature(
            destinationFeature.parent.device.lat,
            destinationFeature.parent.device.lng,
            destinationFeature.parent.style.label,
            destinationFeature.parent.device.deviceName,
            false
          );
          // points[0].push([destinationFeature.parent.device.lng, destinationFeature.parent.device.lat])
          geojsonObjectParentTarget.features.push(featureObjParentTarget) 
  
          // creating the layer for this target device(parent)
          var vectorSourceParentTarget = new VectorSource({
            features: (new GeoJSON()).readFeatures(geojsonObjectParentTarget)
          });
          // creating the layer for this target device(child)
          var vectorSourceChildrenTarget = new VectorSource({
            features: (new GeoJSON()).readFeatures(geojsonObjectChildrenTarget)
          });
    
    
          var vectorLayerParentTarget = new VectorLayer({
            source: vectorSourceParentTarget,
            style: styleFunctionParentTarget,
            key: destinationFeature.parent.device.deviceName + "_p"
          });
  
          var vectorLayerChildrenTarget = new VectorLayer({
            source: vectorSourceChildrenTarget,
            style: styleFunctionChildrenTarget,
            key: destinationFeature.parent.device.deviceName + "_c"
          });
  
          tmpParents.push({
            deviceName : destinationFeature.parent.device.deviceName,
            borderColor : destinationFeature.parent.style.borderColor
          });
  
          this.setState({
            parentDevices : tmpParents
          })
          
          targetDestinationLayers.push(vectorLayerChildrenTarget)
          targetDestinationLayers.push(vectorLayerParentTarget)
  
        });      
        // vector layer for the child source devices is now complete
        // END TARGET CODE  =  targetDestinationLayers
        /* //// //// //// //// //// //// //// //// //// //// //// */
  
        // getting there center of the points
        var getCentroid = function (coord) {
          var totalLen = 0;
          coord.forEach(arr => {
            totalLen += arr.length
          })
          let totalX = 0;
          let totalY = 0;
          coord.flat().forEach(location => {
            totalX += location[0];
            totalY += location[1];
          })
          let center = [totalX/totalLen, totalY/totalLen];;
          return center;
         }
  
        // get center
        var layerCenter = getCentroid(points);
  
        // adding the layers
        var finalLayers = []
        finalLayers.push(new TileLayer({source: new OSM()}))
        finalLayers.push(vectorLayerChildrenSource)
        finalLayers.push(vectorLayerParentSource)
        targetDestinationLayers.forEach(layer =>{
          finalLayers.push(layer)
        })
  
        //initializing the map with its layers etc
        var map = new Map({
          controls: defaultControls().extend([
            new OverviewMap()
          ]),
          layers: finalLayers,
          target: this.state.id,
          view: new View({
            center: layerCenter,
            zoom: 16,
            projection: 'EPSG:4326'
          })
        });
        
        // setting the state
        this.setState({
          map:map,
          featuresLayerChildren:vectorLayerChildrenSource,
          featuresLayerParent:vectorLayerParentSource,
          targetDestinationLayers:targetDestinationLayers
        })
  
        // binding the hover event (popup dialogue)
        map.on('pointermove', this.handleMapHover.bind(this));     
        // binding the zoom event (resize dots)
        map.getView().on('change:resolution', this.handleMapZoom.bind(this, map));     
        // binding the on click handler
        map.on('click', this.handleMapClick.bind(this, map))
        // making sure its the right dimension
        map.updateSize() 
      }else{
        var map = new Map({
          controls: defaultControls().extend([
            new OverviewMap()
          ]),
          layers: [new TileLayer({source: new OSM()})],
          target: this.state.id,
          view: new View({
            zoom: 3,
            center : [140, -25],
            projection: 'EPSG:4326'
          })
        });
        map.updateSize() 
      }
    }

    handleMapClick(map, event){
      if(this.state.parentDevices.length > 0){
        let feature = this.state.map.forEachFeatureAtPixel(event.pixel, feature => { 
          return feature
        });     
        let featureArr = []

        this.state.map.forEachFeatureAtPixel(event.pixel, feature => { 
          featureArr.push(feature)
        });    
        let newStyleFunction;
        // has clicked on a feature
        if(featureArr.length > 0){
          featureArr.forEach(feature => {
            let featureProperties = feature.getProperties();
            if(featureProperties.hasOwnProperty('isSwapped')){
              // getting the current position in the parent device array to find which 
              let currentParentDeviceIndex = this.state.parentDevices.map(parentDevice =>{
                return parentDevice.deviceName
              }).indexOf(featureProperties.currentParent)
              let newStyleIndex;
              // if at the end of the array, reset back to 0, else increment by one, set the feature's currentParent
              if(this.state.parentDevices[currentParentDeviceIndex + 1]){
                newStyleIndex = currentParentDeviceIndex + 1;
                feature.setProperties({currentParent: this.state.parentDevices[newStyleIndex].deviceName }) 
              }else{
                newStyleIndex = 0
                feature.setProperties({currentParent: this.state.parentDevices[newStyleIndex].deviceName}) ;
              }
              // getting a temp copy of the state of the swapped devices and getting the index of the current feature in the array
              let tmpStateSwappedDevices = [...this.state.swappedDevices];
              let indexOfThisDevice = tmpStateSwappedDevices.map(swappedDevice => {
                return swappedDevice.deviceName
              }).indexOf(featureProperties.name);
              // if this has not been swapped (on origin parent), set styles accordingly
              if(featureProperties.isSwapped === false || newStyleIndex !== 0 ){
                feature.setProperties({isSwapped : true, currentParentStyles : {borderColor:this.state.parentDevices[newStyleIndex].borderColor} });
                // not in the state array of swapped devices, so push it in 
                if(indexOfThisDevice === -1){
                  tmpStateSwappedDevices.push({
                    deviceName: featureProperties.name,
                    originParent: featureProperties.originParent,
                    currentParent: featureProperties.currentParent
                  });
                // is there, so we update the device properties
                }else{
                  tmpStateSwappedDevices[indexOfThisDevice].deviceName = featureProperties.name;
                  tmpStateSwappedDevices[indexOfThisDevice].originParent = featureProperties.originParent;
                  tmpStateSwappedDevices[indexOfThisDevice].currentParent = featureProperties.currentParent;
                }
                // create style function dependant on zoom level
                var currZoomLevel = map.getView().getZoom();
                var radius;
                if(currZoomLevel>18){
                  radius = 7;
                }else if(currZoomLevel>15){
                  radius = 5;
                }else if(currZoomLevel>13){
                  radius = 3;
                }else if(currZoomLevel>10){
                  radius = 2;
                }else{
                  radius = 1;
                }
                newStyleFunction = this.buildStyle(
                  this.props.sourceFeaturesChildrenStyles.fillColor,
                  this.state.parentDevices[newStyleIndex].borderColor,
                  this.props.sourceFeaturesChildrenStyles.borderWidth,
                  radius,
                  true
                );
              }else{
                // go back to old styles and reset the swapped flag, remove from state swappedDevices
                feature.setProperties({isSwapped : false, currentParentStyles : {borderColor:this.props.sourceFeaturesChildrenStyles.borderColor}});
                tmpStateSwappedDevices.splice(indexOfThisDevice,1)
              }
              this.setState({
                swappedDevices : tmpStateSwappedDevices
              });
              feature.setStyle(newStyleFunction);
            }
          });
        }
      }
    }

    handleMapHover(event){
      let featureArray = [];
      this.state.map.forEachFeatureAtPixel(event.pixel, feature => {    
        featureArray.push(feature.values_)
      });     
      if(featureArray.length > 0){
        this.setState({
          focusedFeatures: featureArray,
          popupVisible: true
        })
      }else{
        this.setState({
          focusedFeatures: null,
          popupVisible: false
        })
      }
    }

    // on move / zoom of the map we remake styles to change the size of the markers 
    handleMapZoom(map, event){
        var currZoomLevel = map.getView().getZoom();
        var radius;
        var compiledStyle;
        if(currZoomLevel>18){
          radius = 7;
        }else if(currZoomLevel>15){
          radius = 5;
        }else if(currZoomLevel>13){
          radius = 3;
        }else if(currZoomLevel>10){
          radius = 2;
        }else{
          radius = 1;
        }
        
        let finalLayers = map.getLayers();
        finalLayers.forEach(layer => {
          // we don't want to edit the tile layer, leave this
          if(layer.getType() === "TILE"){
          // find the sources first and set them first as they are easily modified by their key
          }else {  
            let layerKey = layer.getProperties().key;
            if(layerKey == "parentSource"){
              compiledStyle = this.buildStyle(
                this.props.sourceFeaturesParentStyles.fillColor,
                this.props.sourceFeaturesParentStyles.borderColor,
                this.props.sourceFeaturesParentStyles.borderWidth,
                radius,
                false
              ); 
            // special case in the childsource, as we will need it render modified styles when selected 
            }else if(layerKey == "childSource"){
              let source = layer.getSource();
              let features = source.getFeatures();
              features.forEach(feature =>  {
                // if the feature has a modified style use this modified style
                if(feature.getStyle() !== null){
                  let borderColor = feature.getProperties().currentParentStyles.borderColor
                  let featureSpecificCompiledStyle = this.buildStyle(
                    this.props.sourceFeaturesChildrenStyles.fillColor,
                    borderColor,
                    this.props.sourceFeaturesChildrenStyles.borderWidth,
                    radius,
                    true
                  );
                  feature.setStyle(featureSpecificCompiledStyle)
                }
              });
              compiledStyle = this.buildStyle(
                this.props.sourceFeaturesChildrenStyles.fillColor,
                this.props.sourceFeaturesChildrenStyles.borderColor,
                this.props.sourceFeaturesChildrenStyles.borderWidth,
                radius,
                false
              );  
            // if the layer is a child target
            }else if(layerKey.split("_")[1] == "c"){
              var originalStyle = this.props.destinationFeatures.filter( feature => {
                if(feature.parent.device.deviceName == layerKey.split("_")[0]){
                  return feature.children.style
                }
              })
              // debugger
              originalStyle = originalStyle[0].children.style;
              compiledStyle = this.buildStyle(
                originalStyle.fillColor,
                originalStyle.borderColor,
                originalStyle.borderWidth,
                radius,
                false
              );  
            // if the layer is a parent target
            }else if(layerKey.split("_")[1] == "p"){
              var originalStyle = this.props.destinationFeatures.filter( feature => {
                if(feature.parent.device.deviceName == layerKey.split("_")[0]){
                  return feature.parent.style
                }
              })
              originalStyle = originalStyle[0].parent.style
              compiledStyle = this.buildStyle(
                originalStyle.fillColor,
                originalStyle.borderColor,
                originalStyle.borderWidth,
                radius,
                false
              );  
            }
            layer.setStyle(compiledStyle)
          }
        });    
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

export default NwpMapFGP

