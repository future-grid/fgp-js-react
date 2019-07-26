import React, { Component } from 'react'
import * as ol from 'ol';
// import Map from 'ol/Map.js';
import View from 'ol/View.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import Circle from 'ol/geom/Circle.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
import {
    interaction, layer, custom, control, //name spaces
    Interactions, Overlays, Controls,     //group
    Map, Layers, Overlay, Util //objects
  } from "react-openlayers";


import './MapFGP.css';
export class MapFGP extends Component {
    constructor(props){
        super(props);
        this.state = {
            icpMarkers : this.props.markers,
            icpLayer : []
        };
    }

    render() {
        var geojsonObject = {
            'type': 'FeatureCollection',
            'crs': {
              'type': 'name',
              'properties': {
                'name': 'EPSG:3857'
              }
            },
            'features': [{
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': [19514291.235482115,-4549771.9135484705]
              }
            }]
        }
        var vectorSource = new VectorSource({
            features: (new GeoJSON()).readFeatures(geojsonObject)
          });
          var image = new CircleStyle({
            radius: 5,
            fill: null,
            stroke: new Stroke({color: 'red', width: 1})
          });
          var styles = {
            'Point': new Style({
              image: image
            }),
            'LineString': new Style({
              stroke: new Stroke({
                color: 'green',
                width: 1
              })
            }),
            'MultiLineString': new Style({
              stroke: new Stroke({
                color: 'green',
                width: 1
              })
            }),
            'MultiPoint': new Style({
              image: image
            }),
            'MultiPolygon': new Style({
              stroke: new Stroke({
                color: 'yellow',
                width: 1
              }),
              fill: new Fill({
                color: 'rgba(255, 255, 0, 0.1)'
              })
            }),
            'Polygon': new Style({
              stroke: new Stroke({
                color: 'blue',
                lineDash: [4],
                width: 3
              }),
              fill: new Fill({
                color: 'rgba(0, 0, 255, 0.1)'
              })
            }),
            'GeometryCollection': new Style({
              stroke: new Stroke({
                color: 'magenta',
                width: 2
              }),
              fill: new Fill({
                color: 'magenta'
              }),
              image: new CircleStyle({
                radius: 10,
                fill: null,
                stroke: new Stroke({
                  color: 'magenta'
                })
              })
            }),
            'Circle': new Style({
              stroke: new Stroke({
                color: 'red',
                width: 2
              }),
              fill: new Fill({
                color: 'rgba(255,0,0,0.2)'
              })
            })
          };
          var styleFunction = function(feature) {
            return styles[feature.getGeometry().getType()];
          };
        return (
            <div className="col-12">
                hello I am map
                <Map view={{center: [this.props.lat, this.props.lng], zoom: 11}} onClick={ event =>{
                    console.log('sup niga', event)
                }}>
                    <Layers>
                        <layer.Tile/>
                        <layer.Vector 
                        source={vectorSource} 
                        style={styleFunction}
                         />
                    </Layers>
                    <Overlays>
                        {/* <Overlay 
                            ref={comp => this.overlayComp = comp}
                            element="#popup" /> */}
                    </Overlays>
                    <Controls attribution={false} zoom={true}>
                        {/* <control.Rotate /> */}
                        {/* <control.ScaleLine /> */}
                        {/* <control.FullScreen /> */}
                        {/* <control.OverviewMap /> */}
                        {/* <control.ZoomSlider /> */}
                        {/* <control.ZoomToExtent /> */}
                        <control.Zoom />
                    </Controls>
                    <Interactions>
                        {/* <interaction.Select style={selectedMarkerStyle} />
                        <interaction.Draw source={markers} type='Point' />
                        <interaction.Modify features={markers.features} /> */}
                    </Interactions>
                </Map>

                <custom.Popup ref={comp => this.popupComp = comp}>
                </custom.Popup>
            </div>
        )
    }
}

export default MapFGP

