import React, { Component } from 'react'
import { MapPopup } from '../MapPopUp/MapPopUp'
import { BasicMapDrawSelector } from '../BasicMapDrawSelector/BasicMapDrawSelector'
import './BasicMapFGP.css';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON.js';
import {defaults as defaultControls, OverviewMap} from 'ol/control.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import Draw, {createRegularPolygon, createBox} from 'ol/interaction/Draw';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';


/* 
Basic Map - The basic map functionality is present here, that includes a popover on hover and support for 
            a children device set and a single parent device

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

export class BasicMapFGP extends Component {
    constructor(props){
        super(props);
        this.state = {
            popupVisible:false,
            focusedFeature: null,
            focusedGroup: null,
            selectedFeatures: [],
            vectorLayerSelectedFeatures : [],
            compiledSelectedFeatures : [],
            hasChildren : this.props.featuresChildren ? true : false,
            id: Math.random().toString(36).substr(2, 11),
            draw : null,
            selectedFeaturesStyle : this.props.selectedFeaturesStyle ? this.props.selectedFeaturesStyle : {fillColor:'lightgoldenrodyellow', borderColor:"orange", radius:4, borderWidth:2}
        };
        // this.buildMap = this.buildMap.bind(this)
    }

    createInteractions(){
      this.props.mapInteractions.forEach( interaction => {
        if(interaction.type === "draw"){
          this.setState({
            drawInteraction : true,
            drawType : "None"  
          })
        }
        if(interaction.type === "redirect"){
          this.setState({
            redirectInteraction : true,
          })
        }
      });
    }
    
    buildMap(){
      this.createInteractions();


      var hasChildrenIn = this.state.hasChildren
      if(this.props.featuresParent.lat === 0 &&
        this.props.featuresParent.lng === 0 && 
        this.props.featuresChildren.length === 0 ){
        this.setState({
          noMapData : true,
        });
      }else{
        function styleZoomer(type, radius, index){
          if(type === "parent"){
            return new CircleStyle({
              radius: radius,
              fill: new Fill({color: this.props.featuresParentStyles.fillColor}),
              stroke: new Stroke({color: this.props.featuresParentStyles.borderColor, width: 1})
            })
          }else if(type === "child"){
            return new CircleStyle({
              radius: radius,
              fill: new Fill({color: this.props.featuresChildren[index].style.fillColor}),
              stroke: new Stroke({color: this.props.featuresChildren[index].style.borderColor, width: 1})
            })
          }else if(type === "selectedFeatures"){
            return new CircleStyle({
              radius: radius,
              fill: new Fill({color: this.state.selectedFeaturesStyle.fillColor}),
              stroke: new Stroke({color: this.state.selectedFeaturesStyle.borderColor, width: 1})
            })
          }
        }
        styleZoomer = styleZoomer.bind(this); // binding the state
  
        // parent style - blue inner, dark blue outer
        var imageParent = styleZoomer("parent", 4)
        var stylesParent = {
          'Point': new Style({
            image: imageParent
          })
        };
        var styleFunctionParent = function(feature) {
          return stylesParent[feature.getGeometry().getType()];
        };      

        var imageSelectedFeatures = styleZoomer("selectedFeatures", 4)
        var stylesSelectedFeatures  = {
          'Point': new Style({
            image: imageSelectedFeatures
          })
        }
        var styleFunctionSelectedFeatures = function(feature) {
          return stylesSelectedFeatures[feature.getGeometry().getType()];
        };     
        this.setState({
          compiledSelectedFeatureStyle : styleFunctionSelectedFeatures,
          styleFunctionParent : styleFunctionParent
        })
  
        // intitializing the geojson
        let points = [];
  
  
        // setting the style, labels and location for the children which are passed through props
        if(hasChildrenIn === true){
          console.log("have children", this.props.featuresChildren)
          var vectorLayerChildrenArr=[];
          var geojsonObjectChildren = {
            'type': 'FeatureCollection',
            'features': [ ]
          };  
  
          //iterating through the types of children
          for(var x = 0; x < this.props.featuresChildren.length; x++ ){
            // creating styles of the children
            var image = styleZoomer("child", 4, x)
            var styles = {
              'Point': new Style({
                image: image
              })
            };
            var styleFunctionChildren = function(feature) {
              return styles[feature.getGeometry().getType()];
            };
            this.props.featuresChildren[x].children.forEach( child =>{
              console.log('plotting child', child)
              // console.log(child)
              let featureObj = {
                'type' : "Feature",
                'id': '_' + Math.random().toString(36).substr(2, 11),
                'geometry': {
                  'type': "Point",
                  'crs': {
                    'type': 'name',
                    'properties': {
                      'name': this.props.mapProjection
                    }
                  },
                  'coordinates': [
                    child.lng,
                    child.lat
                  ]
                },
                "geometry_name": "geom",
                "properties": {
                  "lat":  child.lat,
                  "lng": child.lng,
                  "type": this.props.featuresChildren[x].deviceType,
                  "id": '_' + Math.random().toString(36).substr(2, 11),
                  "name": child.name,
                  "borderColor": this.props.featuresChildren[x].style.borderColor,
                  "borderWidth": this.props.featuresChildren[x].style.borderWidth,
                  "fillColor": this.props.featuresChildren[x].style.fillColor,
                }
              }
              if(isNaN(child.lat) === false && isNaN(child.lng) === false &&
                   child.lat !== 0 && child.lng !== 0){
                    points.push([child.lng, child.lat])
                    geojsonObjectChildren.features.push(featureObj)
              }
            })
            var vectorSourceChildren = new VectorSource({
              features: (new GeoJSON()).readFeatures(geojsonObjectChildren)
            });
            var vectorLayerChildren = new VectorLayer({
              source: vectorSourceChildren,
              style: styleFunctionChildren
            });
            this.setState({
              styleFunctionChildren : styleFunctionChildren,
              vectorSourceChildren: vectorSourceChildren
            })
            vectorLayerChildrenArr.push(vectorLayerChildren)
          }
        }
        
        var geojsonObjectParent = {
          'type': 'FeatureCollection',
          'features': [ ]
        };
  
        // setting the style, labels and location for the parent
        let featureObjParent = {
          'type' : "Feature",
          'id': '_' + Math.random().toString(36).substr(2, 11),
          'geometry': {
            'type': "Point",
            'crs': {
              'type': 'name',
              'properties': {
                'name': this.props.mapProjection
              }
            },
            'coordinates': [
              this.props.featuresParent.lng,
              this.props.featuresParent.lat
            ]
          },
          "geometry_name": "geom",
          "properties": {
            "lat":  this.props.featuresParent.lat,
            "lng": this.props.featuresParent.lng,
            "type": this.props.featuresParentStyles.label,
            "id": '_' + Math.random().toString(36).substr(2, 11),
            "name": this.props.featuresParent.deviceName,
            "borderColor": this.props.featuresParentStyles.borderColor,
            "borderWidth": this.props.featuresParentStyles.borderWidth,
            "fillColor": this.props.featuresParentStyles.fillColor,
          }
        }
        if(isNaN(this.props.featuresParent.lng) === false && isNaN(this.props.featuresParent.lat) === false &&
        this.props.featuresParent.lng !== 0 && this.props.featuresParent.lat !== 0 &&
        this.props.featuresParent.lng !== null && this.props.featuresParent.lat !== null){
          points.push([this.props.featuresParent.lng, this.props.featuresParent.lat])
          geojsonObjectParent.features.push(featureObjParent)
          console.log('pushing despite null', featureObjParent)
        }
        
        
        var geojsonObjectSelectedFeatures = {
          'type': 'FeatureCollection',
          'features': [ ]
        };
  
        // setting the style, labels and location for the parent

  

        // creates a vector source
        var vectorSourceParent = new VectorSource({
          features: (new GeoJSON()).readFeatures(geojsonObjectParent)
        });
  
        var vectorLayerParent = new VectorLayer({
          source: vectorSourceParent,
          style: styleFunctionParent
        });
        
        // creates a vector source
        var vectorSourceSelectedFeatures = new VectorSource({
          features: (new GeoJSON()).readFeatures(geojsonObjectSelectedFeatures)
        });
  
        var vectorLayerSelectedFeatures = new VectorLayer({
          source: vectorSourceSelectedFeatures,
          style: styleFunctionSelectedFeatures
        });
        
        var getCentroid = function (coord) {
          var center = coord.reduce(function (x, y) {
              return [x[0] + y[0] / coord.length, x[1] + y[1] / coord.length]
          }, [0, 0])
          return center;
        }
        // get center
        var layerCenter = getCentroid(points);
        if(hasChildrenIn === true){
          // var totalLayers = [...vectorLayerChildrenArr];
          // totalLayers.push()
          // totalLayers.push(vectorLayerParent)
            var map = new Map({
              controls: defaultControls().extend([
                new OverviewMap()
              ]),
              layers: [new TileLayer({source: new OSM()})],
              target: this.state.id,
              view: new View({
                center: layerCenter,
                zoom: 16,
                projection: this.props.mapProjection
              })
            });
        }else{
          var map = new Map({
            controls: defaultControls().extend([
              new OverviewMap()
            ]),
            layers: [
              new TileLayer({
                source: new OSM()
              }),
            ],
            target: this.state.id,
            view: new View({
              center: layerCenter,
              zoom: 16,
              projection: this.props.mapProjection
            })
          });
        }
        vectorLayerChildrenArr.forEach( layer => {
          map.addLayer(layer)
        })
        
        if(hasChildrenIn === true){
            this.setState({
              map:map,
              featuresLayerChildren:vectorLayerChildrenArr,
              featuresLayerParent:vectorLayerParent,
              vectorLayerSelectedFeatures:vectorLayerSelectedFeatures
            })
        }else{
          this.setState({
            map:map,
            vectorLayerSelectedFeatures:vectorLayerSelectedFeatures,
            featuresLayerParent:vectorLayerParent
          })
        }
        map.addLayer(vectorLayerParent)
        map.addLayer(vectorLayerSelectedFeatures)
        // map.add
        // binding the hover event (popup dialogue)
        map.on('pointermove', this.handleMapHover.bind(this));     
        map.on('click', this.handleMapClick.bind(this, map))
        // this.handleDrawingSelection.bind(this, map)
        // changing the size of the features on the map with zoom level 
        map.getView().on('change:resolution', function(evt) {
          var currZoomLevel = map.getView().getZoom();
          var radius
          if(currZoomLevel>18){
            radius = 6;
          }else if(currZoomLevel>15){
            radius = 4;
          }else if(currZoomLevel>13){
            radius = 2;
          }else if(currZoomLevel>10){
            radius = 2;
          }else{
            radius = 1;
          }
          var stylesParent = new Style({image: styleZoomer("parent", radius)});
          var stylesSelectedFeatures = new Style({image: styleZoomer("selectedFeatures", radius)});
          vectorLayerParent.setStyle(stylesParent);
          vectorLayerSelectedFeatures.setStyle(stylesSelectedFeatures);
  
          if(hasChildrenIn === true){
            for(var x = 0; x < vectorLayerChildrenArr.length; x ++){
              var stylesChild = new Style({image: styleZoomer("child", radius, x)});
              vectorLayerChildrenArr[x].setStyle(stylesChild)
            }
          }
        });     
        map.updateSize() 
      }
    }

    componentDidMount(){
      this.buildMap()
      
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

    handleDrawingSelection(event){
      // console.log(map, event)
      this.setState({
        drawType : event.target.value
      });      
      console.log(this.state.map)
      // this.state.map

    }

    handleMapClick(map, event){
      if(this.state.redirectInteraction !== true){
        if(this.state.drawType === "None"){
          let selectedFeatures = [...this.state.selectedFeatures]
          let resettingFeatures = [];
          // adding or removing feature from list of selected features, then setting state
          this.state.map.forEachFeatureAtPixel(event.pixel, feature => {    
            this.state.selectedFeatures.indexOf(feature) === -1 ? selectedFeatures.push(feature) : resettingFeatures.push(selectedFeatures.splice(this.state.selectedFeatures.indexOf(feature), 1)[0]);
          });
  
          var image = new CircleStyle({
            radius: this.state.selectedFeaturesStyle.radius,
            fill: new Fill({
              color: this.state.selectedFeaturesStyle.fillColor
            }),
            stroke: new Stroke({
              color: this.state.selectedFeaturesStyle.borderColor, 
              width: this.state.selectedFeaturesStyle.borderWidth
            })
          });
          var styles = {
            'Point': new Style({
              image: image
            })
          };
          // Returning the actual style function, needed for first time creation, not modifying functions
          var style = function(feature) {
            return styles[feature.getGeometry().getType()];
          };  
        
          selectedFeatures.map( feature => {
            feature.setStyle(style)
          })
  
          resettingFeatures.map( feature => {
            let fProps = feature.getProperties()
            var image2 = new CircleStyle({
              radius: 4,
              fill: new Fill({
                color: fProps.fillColor
              }),
              stroke: new Stroke({
                color: fProps.borderColor, 
                width: fProps.borderWidth
              })
            });
            var styles2 = {
              'Point': new Style({
                image: image2
              })
            };
            // Returning the actual style function, needed for first time creation, not modifying functions
            var style2 = function(feature) {
              return styles2[feature.getGeometry().getType()];
            };  
            feature.setStyle(style2)
          })
          this.setState({
            selectedFeatures : selectedFeatures,
            map: map
          })
          
        }else if(this.state.drawType === "Square"){
          let draw;
          let value = this.state.drawType;
          map.removeInteraction(draw)
          let source = this.state.vectorSourceChildren
          function addInteraction(source){
            var geometryFunction;
            value = 'Circle';
            geometryFunction = createRegularPolygon(4);
            draw = new Draw({
              source: source,
              type: value,
              geometryFunction: geometryFunction
            });
            map.addInteraction(draw);
          }
          
          addInteraction(source);
          console.log('Is a Square nibba') 
        } 
      }else if(this.state.redirectInteraction === true){
        let selectedFeatures = [...this.state.selectedFeatures]
        let resettingFeatures = [];
        // redirecting
        this.state.map.forEachFeatureAtPixel(event.pixel, feature => {    
          window.open ( `http://${window.location.host}/${feature.getProperties().type}/${feature.getProperties().name}`, '_blank' )
        });
      }
    }

    handleMapHover(event){
      if(this.state.drawType === "None" || this.state.drawInteraction !== true){
        let featureArr = [];
        this.state.map.forEachFeatureAtPixel(event.pixel, feature => {    
          featureArr.push(feature.values_);
        });     
        if(featureArr.length > 0){
          this.setState({
            focusedFeatures: featureArr,
            popupVisible: true
          })
        }else{
          this.setState({
            focusedFeature: null,
            popupVisible: false
          })
        }
      }
    }

    render() {
        

        return (
          <div className={"w-100 map fgpReactMap"} id={this.state.id}>
            {/* {this.state.noMapData === true ? <div className={"noMapData"}>No Location Data</div> : null} */}
            <MapPopup
              visibility={this.state.popupVisible}
              focusedFeatures={this.state.focusedFeatures}
            />
            {/* {
              this.state.drawInteraction === true ? (
                <BasicMapDrawSelector
                  handleDrawingSelection={this.handleDrawingSelection.bind(this)}
                  drawType={this.state.drawType}
                  selectedFeatures={this.state.selectedFeatures}
                />
              ) : (
                null
              )
            } */}
          </div>
        )
    }
}

export default BasicMapFGP

