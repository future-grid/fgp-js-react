import React, { Component } from 'react'
import { MapPopup } from './mapPopup/MapPopup'
import './MapFGP2.css';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON.js';
import {defaults as defaultControls, OverviewMap} from 'ol/control.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';

//  Sample Feature object
// {
//   'type' : "Feature",
//   'id': '_' + Math.random().toString(36).substr(2, 11),
//   'geometry': {
//     'type': "Point",
//     'coordinates': [
//       19514291.235482115,
//       -4549771.9135484705
//     ]
//   },
//   "geometry_name": "geom",
//   "properties": {
//     "lat":  -4549771.9135484705,
//     "lng": 19514291.235482115,
//     "id": "F384jfE",
//     "type": "Feeder",
//     "name": "John Cena",
//   }
// }



export class MapFGP2 extends Component {
    constructor(props){
        super(props);
        this.state = {
            popupVisible:false,
            focusedFeature: null,
        };
    }
    
    buildmap(){
      var image = new CircleStyle({
        radius: this.props.radius,
        fill: new Fill({
          color: 'pink'
        }),
        stroke: new Stroke({color: 'red', width: 1})
      });

      var imageParent = new CircleStyle({
        radius: this.props.radius,
        fill: new Fill({
          color: 'lightblue'
        }),
        stroke: new Stroke({color: 'blue', width: 1})
      });
      
      var styles = {
        'Point': new Style({
          image: image
        })
      };

      var stylesParent = {
        'Point': new Style({
          image: imageParent
        })
      };

      var styleFunctionParent = function(feature) {
        return stylesParent[feature.getGeometry().getType()];
      };      

      var styleFunctionChildren = function(feature) {
        return styles[feature.getGeometry().getType()];
      };
    
      // intitializing the geojson
      let points = [];
      var geojsonObjectChildren = {
        'type': 'FeatureCollection',
        'features': [ ]
      };

      // this will need to be tweaked from project to project depending on data structure
      // in this example I am using a list of ICP extensions/locations from a tx relation
      this.props.featuresChildren.forEach( feature => {
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
            "type": "ICP",
            "id": '_' + Math.random().toString(36).substr(2, 11),
            "name": feature.deviceName,
          }
        }
        points.push([feature.lng, feature.lat])
        geojsonObjectChildren.features.push(featureObj)
      })
      
      // let pointsP = [];
      var geojsonObjectParent = {
        'type': 'FeatureCollection',
        'features': [ ]
      };

      // this will need to be tweaked from project to project depending on data structure
      // in this example I am using a list of ICP extensions/locations from a tx relation
      console.log(this.props.featuresParent)
      // this.props.featuresParent.forEach( feature => {
        let featureObjParent = {
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
              this.props.featuresParent.lng,
              this.props.featuresParent.lat
            ]
          },
          "geometry_name": "geom",
          "properties": {
            "lat":  this.props.featuresParent.lat,
            "lng": this.props.featuresParent.lng,
            "type": "Transformer",
            "id": '_' + Math.random().toString(36).substr(2, 11),
            "name": this.props.featuresParent.deviceName,
          }
        }
        points.push([this.props.featuresParent.lng, this.props.featuresParent.lat])
        geojsonObjectParent.features.push(featureObjParent)
      // })
      
      // creates a vector source
      var vectorSourceChildren = new VectorSource({
        features: (new GeoJSON()).readFeatures(geojsonObjectChildren)
      });

      var vectorSourceParent = new VectorSource({
        features: (new GeoJSON()).readFeatures(geojsonObjectParent)
      });
      
      var vectorLayerChildren = new VectorLayer({
        source: vectorSourceChildren,
        style: styleFunctionChildren
      });

      var vectorLayerParent = new VectorLayer({
        source: vectorSourceParent,
        style: styleFunctionParent
      });
      
      var getCentroid = function (coord) {
        var center = coord.reduce(function (x, y) {
            return [x[0] + y[0] / coord.length, x[1] + y[1] / coord.length]
        }, [0, 0])
        return center;
       }
      // get center
      var layerCenter = getCentroid(points);

      var map = new Map({
        controls: defaultControls().extend([
          new OverviewMap()
        ]),
        layers: [
          new TileLayer({
            source: new OSM()
          }),
          vectorLayerChildren,
          vectorLayerParent
        ],
        target: 'map',
        view: new View({
          center: layerCenter,
          zoom: this.props.zoom,
          projection: 'EPSG:4326'
        })
      });
      
      this.setState({
        map:map,
        featuresLayerChildren:vectorLayerChildren,
        featuresLayerParent:vectorLayerParent
      })
      map.on('pointermove', this.handleMapHover.bind(this));      
      // map.on('click', this.handleMapClick.bind(this));      
      map.updateSize() // making sure its the right dimension
    }

    componentDidMount(){
      this.buildmap()
    }

    buildLayers(){
      
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

    componentDidUpdate(){

    }


    render() {
        

        return (
          <div className={"w-100 map fgpReactMap"} id="map">
            <MapPopup
              visibility={this.state.popupVisible}
              focusedFeature={this.state.focusedFeature}
            />
          </div>
        )
    }
}

export default MapFGP2

