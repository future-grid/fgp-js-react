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
import { timeout } from 'q';


/* 
Network Planning Map - The basic map functionality is present here, that includes a popover on hover and support the 
additional features, this map supports 2 types of parent devices and 2 types of children device arrays
The first type is a source Parent/Child device set, these devices will be used to transfer from, to other other set.
The source Parent will be a singular device where as the children will be an array of objects
The second type is a destination Parent/Child device set, these devices will be transferred to.
The destination array will be host to an array of an arrays of objects for an example see the below samples

Like the other map you can pass through parameters to style the given dots and this is encouraged or the default styles
will be applied, notably.

On click of the source children devices, they will inherit a halo that is the same color as the destination outline to 
communicate the source child device has been swapped to the target parents relation group

I recommend for clarity setting the parent device to a solid, dark color, then the children for that parent to a lighter shade of that color
eg Parent: blue... Child: lightblue
You may use defined html accepted named colors, or hex colors

Properties to pass through to this Component (it will handle everything else)
- featuresChildrenStyles =  an object specifies the styling of the children dots, an example of this is ...
  featuresChildrenStyles : {
                            label : "ICP",
                            borderColor : "red",
                            borderWidth: "1",
                            fillColor : "pink"
                          }

- featuresChildren: should be an array of objects of the child devices, an example of this is ...
  featuresChildren[0]:  {
                          deviceName: "0012650932WE139",
                          lat: -37.801555,
                          lng: 174.883438,
                        }

- featuresParentStyles: an object specifies the styling of the parent dot, an example of this is ...
  featuresParentStyles :  {
                            label : "Transformer",
                            borderColor : "blue",
                            borderWidth : "1",
                            fillColor : "lightblue"
                          }

 - featuresParent: this is an object, singular, an example of this object is the following
   -featuresParent: {
                      deviceName: "E00025675COMP",
                      lat: -37.8028377815772,
                      lng: 174.880836345938,
                    }
*/

export class NwpMapFGP extends Component {
    constructor(props){
        super(props);
        this.state = {
            popupVisible:false,
            focusedFeature: null,
            focusedGroup: null,
            id: Math.random().toString(36).substr(2, 11),
            points: [],
            sourceParentVectorLayer: undefined,
            sourceChildVectorLayer: undefined,
            targetParentVectorLayers: [],
            targetChildVectorLayers: [],
        };
    }
    
    // toggles the swap of a child device to/from the source to target parents, this is invoked generally with a click callback on the map
    swapChild(){

    }

    buildSourceFeatures(){
      let points = [...this.state.points]
      // BEGIN SOURCE PARENT CODE
      // parent geoJSON
      var geojsonObjectParentSource = {
        'type': 'FeatureCollection',
        'features': [ ]
      };
      var imageParentSource = new CircleStyle({
        radius: 4,
        fill: new Fill({
          color: this.props.sourceFeaturesParentStyles.fillColor
        }),
        stroke: new Stroke({
          color: this.props.sourceFeaturesParentStyles.borderColor, 
          width: this.props.sourceFeaturesParentStyles.borderWidth
        })
      });
      var stylesParentSource = {
        'Point': new Style({
          image: imageParentSource
        })
      };
      // creating the style function
      var styleFunctionParentSource = function(feature) {
        return stylesParentSource[feature.getGeometry().getType()];
      };      

      // creating the parent feature
      let featureObjParentSource = {
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
            this.props.sourceFeaturesParent.lng,
            this.props.sourceFeaturesParent.lat
          ]
        },
        "geometry_name": "geom",
        "properties": {
          "lat":  this.props.sourceFeaturesParent.lat,
          "lng": this.props.sourceFeaturesParent.lng,
          "type": this.props.sourceFeaturesParentStyles.label,
          "id": '_' + Math.random().toString(36).substr(2, 11),
          "name": this.props.sourceFeaturesParent.deviceName,
        }
      }
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
      // vector layer for the parent source device is now complete

      // BEGIN SOURCE CHILD CODE
      var geojsonObjectChildrenSource = {
        'type': 'FeatureCollection',
        'features': [ ]
      };
      var imageChildSource = new CircleStyle({
        radius: 4,
        fill: new Fill({
          color: this.props.sourceFeaturesChildrenStyles.fillColor
        }),
        stroke: new Stroke({
          color: this.props.sourceFeaturesChildrenStyles.borderColor, 
          width: this.props.sourceFeaturesChildrenStyles.borderWidth
        })
      });
      var stylesChildSource = {
        'Point': new Style({
          image: imageChildSource
        })
      };
      // creating the styleHandler for the features
      var styleFunctionChildrenSource = function(feature) {
        return stylesChildSource[feature.getGeometry().getType()];
      };
      // creating features for the geojson
      this.props.sourceFeaturesChildren.forEach( feature => {
        let featureObj = {
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
              feature.lng,
              feature.lat
            ]
          },
          "geometry_name": "geom",
          "properties": {
            "lat":  feature.lat,
            "lng": feature.lng,
            "type": this.props.sourceFeaturesChildrenStyles.label,
            "id": '_' + Math.random().toString(36).substr(2, 11),
            "name": feature.deviceName,
          }
        }
        points.push([feature.lng, feature.lat])
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
      // vector layer for the child source devices is now complete
      // updating state var
      // this.setState({
      //   points:points
      // })
      // returning an object for both child and parent layers to be accessed via
      // this.buildSourceFeatures().parent/this.buildSourceFeatures().child
      return {parent: vectorLayerParentSource, child:vectorLayerChildrenSource, points:points}
    }

    buildTargetFeatures(){
      
    }


    buildmap(){

      

      let vectorLayerParentSource = this.buildSourceFeatures().parent;
      let vectorLayerChildrenSource = this.buildSourceFeatures().child
      let points = [...this.state.points] 
      points.push(this.buildSourceFeatures().points)
      console.log(points)
      

      

      /* //// //// //// //// //// //// //// //// //// //// //// */
      // BEGIN TARGET CODE (goes through parents, then children)
      let targetDestinationLayers = [];
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

        // target child style 
        var imageChildTarget = new CircleStyle({
          radius: 4,
          fill: new Fill({
            color: destinationFeature.children.style.fillColor
          }),
          stroke: new Stroke({
            color: destinationFeature.children.style.borderColor, 
            width: destinationFeature.children.style.borderWidth
          })
        });
        var stylesChildTarget = {
          'Point': new Style({
            image: imageChildTarget
          })
        };
        var styleFunctionChildrenTarget = function(feature) {
          return stylesChildTarget[feature.getGeometry().getType()];
        };
          
        // Setting up the target children features
        if(destinationFeature.children.devices){
          destinationFeature.children.devices.forEach( feature => {
            let featureObj = {
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
                  feature.lng,
                  feature.lat
                ]
              },
              "geometry_name": "geom",
              "properties": {
                "lat":  feature.lat,
                "lng": feature.lng,
                "type": destinationFeature.children.style.label,
                "id": '_' + Math.random().toString(36).substr(2, 11),
                "name": feature.deviceName,
              }
            }
            points[0].push([feature.lng, feature.lat])
            geojsonObjectChildrenTarget.features.push(featureObj)
          })
        }else{
          // have to figure out what to do here
          
        }


        // creating the parent target feature
        // parent target  style 
        var imageParentTarget = new CircleStyle({
          radius: 4,
          fill: new Fill({
            color: destinationFeature.parent.style.fillColor
          }),
          stroke: new Stroke({
            color: destinationFeature.parent.style.borderColor, 
            width: destinationFeature.parent.style.borderWidth
          })
        });
        var stylesParentTarget = {
          'Point': new Style({
            image: imageParentTarget
          })
        };
        var styleFunctionParentTarget = function(feature) {
          return stylesParentTarget[feature.getGeometry().getType()];
        };

        let featureObjParentTarget = {
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
              destinationFeature.parent.device.lng,
              destinationFeature.parent.device.lat
            ]
          },
          "geometry_name": "geom",
          "properties": {
            "lat":  destinationFeature.parent.device.lat,
            "lng": destinationFeature.parent.device.lng,
            "type": destinationFeature.parent.style.label,
            "id": '_' + Math.random().toString(36).substr(2, 11),
            "name": destinationFeature.parent.device.deviceName,
          }
        }
        points[0].push([destinationFeature.parent.device.lng, destinationFeature.parent.device.lat])
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

        targetDestinationLayers.push(vectorLayerChildrenTarget)
        targetDestinationLayers.push(vectorLayerParentTarget)

      });


      
      // vector layer for the child source devices is now complete
      // END TARGET CODE  =  targetDestinationLayers
      /* //// //// //// //// //// //// //// //// //// //// //// */

      this.setState({
        points:points
      })


      //building the "swapped" styles, which are the the solid fill color of the sourceChild, with the thicker halo of the color of the destinationChild
      // let availableSwappableStyles = [];
      // this.props.destinationFeaturesChildren.forEach(childrenDeviceSetObject => {
      //   // first, creating the swapped styles
      //   var tmpImg = new CircleStyle({
      //     radius: 4,
      //     fill: new Fill({
      //       color: this.props.sourceFeaturesParentStyles.fillColor
      //     }),
      //     stroke: new Stroke({
      //       color: childrenDeviceSetObject.style.borderColor, 
      //       width: (childrenDeviceSetObject.style.borderWidth + 1)
      //     })
      //   });
      //   var tmpStyles = {
      //     'Point': new Style({
      //       image: tmpImg
      //     })
      //   };
      //   var toggleableChildStyle = function(feature) {
      //     return tmpStyles[feature.getGeometry().getType()];
      //   };

      //   // whilst we are in the foreach, we may as well make use of the loop and define the target child styles 
      //   // and also create the vector source, layer and features for good measure
      //   var tmpChildImg = new CircleStyle({
      //     radius: 4,
      //     fill: new Fill({
      //       color: this.props.sourceFeaturesParentStyles.fillColor
      //     }),
      //     stroke: new Stroke({
      //       color: childrenDeviceSetObject.style.borderColor, 
      //       width: childrenDeviceSetObject.style.borderWidth
      //     })
      //   });
      //   var tmpChildStyles = {
      //     'Point': new Style({
      //       image: tmpChildImg
      //     })
      //   };
      //   var toggleableChildStyle = function(feature) {
      //     return tmpChildStyles[feature.getGeometry().getType()];
      //   };


      //   // pushing into the relevant arrays
      //   availableSwappableStyles.push(toggleableChildStyle)
      // })
      // // setting this as a state variable so we can access it anywhere, this should also stay relatively static after first creation
      // this.setState({
      //   availableSwappableStyles : availableSwappableStyles
      // });



      
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
      map.getView().on('change:resolution', this.handleMapMove.bind(this, map));     
      // making sure its the right dimension
      map.updateSize() 
    }

    componentDidMount(){
      this.buildmap()
      
    }

    // different on click handlers
    showDeviceExtensionPopUp(deviceId, type){
      // gets an extension for the device and creates an overlay
    }

    goto(deviceId, type){
      // redirects to the asset page of device type
    }

    createGroup(){
      // creates a group of assets with a drawing shape
      
    }


    

    handleMapClick(event){
      this.state.map.updateSize()
      let feature = this.state.map.forEachFeatureAtPixel(event.pixel, feature => {    
        return feature
      });     
      if(feature){
        this.setState({
          focusedFeature: feature.values_,
          popupVisible: true
        })
      }else{
        this.setState({
          focusedFeature: null,
          popupVisible: false
        })
      }
    }

    handleMapHover(event){
      let feature = this.state.map.forEachFeatureAtPixel(event.pixel, feature => {    
        return feature
      });     
      if(feature){
        this.setState({
          focusedFeature: feature.values_,
          popupVisible: true
        })
      }else{
        this.setState({
          focusedFeature: null,
          popupVisible: false
        })
      }
    }

    handleMapMove(map, event){
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
        
        // let tvlps = this.state.vectorLayerParentSource
        // let tvlcs = this.state.vectorLayerChildrenSource
        // tvlps.setStyle(newStyleSourceParent);
        // tvlcs.setStyle(newStyleSourceChild);
        let finalLayers = map.getLayers();
        finalLayers.forEach(layer => {
          // we don't want to edit the tile layer, leave this
          if(layer.getType() === "TILE"){
          // find the sources first and set them first as they are easily modified by their key
          }else {  
            let layerKey = layer.getProperties().key;
            if(layerKey== "parentSource"){
              // creating a style based on the source style in props
              compiledStyle = new Style({
                image: new CircleStyle({
                  radius: radius,
                  fill: new Fill({
                    color: this.props.sourceFeaturesParentStyles.fillColor
                  }),
                  stroke: new Stroke({
                    color: this.props.sourceFeaturesParentStyles.borderColor, 
                    width: this.props.sourceFeaturesParentStyles.borderWidth
                  })
                })
              })
              
            }else if(layerKey == "childSource"){
              compiledStyle = new Style({
                image: new CircleStyle({
                  radius: radius,
                  fill: new Fill({
                    color: this.props.sourceFeaturesChildrenStyles.fillColor
                  }),
                  stroke: new Stroke({
                    color: this.props.sourceFeaturesChildrenStyles.borderColor,
                    width: this.props.sourceFeaturesChildrenStyles.borderWidth
                  })
                })
              })
            }else if(layerKey.split("_")[1] == "c"){
              var originalStyle = this.props.destinationFeatures.map( feature => {
                if(feature.parent.device.deviceName == layerKey.split("_")[0]){
                  return feature.children.style
                }
              })
              originalStyle = originalStyle[0];
              compiledStyle = new Style({
                image: new CircleStyle({
                  radius: radius,
                  fill: new Fill({
                    color: originalStyle.fillColor
                  }),
                  stroke: new Stroke({
                    color: originalStyle.borderColor, 
                    width: originalStyle.borderWidth
                  })
                })
              })
            }else if(layerKey.split("_")[1] == "p"){
              var originalStyle = this.props.destinationFeatures.map( feature => {
                if(feature.parent.device.deviceName == layerKey.split("_")[0]){
                  return feature.parent.style
                }
              })
              originalStyle = originalStyle[0];
              compiledStyle = new Style({
                image: new CircleStyle({
                  radius: radius,
                  fill: new Fill({
                    color: originalStyle.fillColor
                  }),
                  stroke: new Stroke({
                    color: originalStyle.borderColor, 
                    width: originalStyle.borderWidth
                  })
                })
              })
            }
            layer.setStyle(compiledStyle)
          }
          
        })    
    }

    render() {
        

        return (
          <div className={"w-100 map fgpReactMap"} id={this.state.id}>
            <MapPopup
              visibility={this.state.popupVisible}
              focusedFeature={this.state.focusedFeature}
            />
          </div>
        )
    }
}

export default NwpMapFGP

