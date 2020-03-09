import React, { Component } from 'react'
import { Form, Dropdown } from 'react-bootstrap';
import { MapPopup } from '../MapPopUp/MapPopup'
import { BasicMapDrawSelector } from '../BasicMapDrawSelector/BasicMapDrawSelector'
import './BasicMapFGP.css';
import Map from 'ol/Map.js';
import Feature from 'ol/Feature';
import View from 'ol/View.js';
import Polygon from 'ol/geom/Polygon';
import {fromLonLat} from 'ol/proj';
import 'ol/ol.css';
import Point from 'ol/geom/Point';
import GeoJSON from 'ol/format/GeoJSON.js';
import {defaults as defaultControls, OverviewMap} from 'ol/control.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import Draw, {createRegularPolygon, createBox} from 'ol/interaction/Draw';
import {Circle as CircleStyle, Circle, Fill, Stroke, Style} from 'ol/style.js';
import {get as getProjection} from 'ol/proj';
import {WMTS, TileArcGISRest} from 'ol/source';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import {getWidth, getTopLeft} from 'ol/extent';

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




    constructor(props) {
        super(props);
        this.state = {
            popupVisible: false,
            focusedFeature: null,
            focusedGroup: null,
            selectedFeatures: [],
            vectorLayerSelectedFeatures: [],
            compiledSelectedFeatures: [],
            hasChildren: this.props.featuresChildren ? true : false,
            id: Math.random().toString(36).substr(2, 11),
            draw: null,
            map: null,
            drawInt: null,
            drawType: 'None',
            drawSource: null,
            highlight: null,
            highlightLayer: null,
            selectedFeaturesStyle: this.props.selectedFeaturesStyle
                ? this.props.selectedFeaturesStyle
                : {
                    fillColor: 'lightgoldenrodyellow',
                    borderColor: 'orange',
                    radius: 4,
                    borderWidth: 2
                },
            initialLoad : true,
            lockedDevices : null
        };
        this.featureWithProperties = [];
        // this.buildMap = this.buildMap.bind(this)
        this.updateExternalLayers = this.updateExternalLayers.bind(this);
    }


    componentWillUpdate(props){
        if(this.state.initialLoad === true){
        }else{
            if(this.props.featuresChildren === this.state.lockedDevices){
            }else{
                this.buildMap();
            }
        }

        if(this.props.mapHighlightPoints && this.props.mapHighlightPoints.length > 0){

            let realPoints = [];
            this.props.mapHighlightPoints.forEach(_p => {
                if(_p && _p != ""){
                    realPoints.push(_p);
                }
            });

            if(realPoints.length  === 0){
                return 0;
            }

            // highlight on map
            const layers = this.state.featuresLayerChildren;
            // demo data
            // props.mapHighlightPoints = ["001350030033dfe4"];

            // clear layer

            console.info("clear highlight layer");
            const highlightLayer = this.state.highlightLayer;
            if(highlightLayer){
                highlightLayer.getSource().clear();
            }

            console.info("highlight points : ", this.props.mapHighlightPoints);

            this.featureWithProperties= [];
            this.props.mapHighlightPoints.forEach(point => {
                layers.forEach(layer => {
                    // put all features together
                    let features = layer.getSource().getFeatures();
                    features.forEach(feature => {
                        const props = feature.getProperties();
                        if(props.name === point){
                            let coordinates = feature.getGeometry().getCoordinates();
                            let _newFeature = new Feature({
                                geometry: new Point(coordinates),
                                properties: feature.getProperties()
                            });
                            highlightLayer.getSource().addFeature(_newFeature);
                            this.featureWithProperties.push(feature.getProperties());
                        }
                    });
                });
            });
        } else {

        }

    }


    createInteractions() {
        this.props.mapInteractions.forEach(interaction => {
            if (interaction.type === 'draw') {
                this.setState({
                    drawInteraction: true,
                    drawType: 'None'
                });
            }
            if (interaction.type === 'redirect') {
                this.setState({
                    redirectInteraction: true
                });
            }

            if(interaction.type == 'highlight'){
                this.setState({
                    highlight: interaction.func
                });
            }

        });
    }

    buildMap() {
        this.createInteractions();

        var hasChildrenIn = this.state.hasChildren;
        if (
            this.props.featuresParent.lat === 0 &&
            this.props.featuresParent.lng === 0 &&
            this.props.featuresChildren.length === 0
        ) {
            this.setState({
                noMapData: true
            });
        } else {
          const pointStyler = (point) => {
            const ret = CircleStyle({
              radius: 4,
              fill: new Fill({
                color: point.values && point.values.fillColor ? point.values.fillColor : 'black'
              }),
              stroke: new Stroke({
                color: point.values && point.values.strokeColor ? point.values.strokeColor : 'black',
                width: point.values && point.values.strokeWidth ? point.values.strokeWidth : 1
              })
            });
            console.log('Returning CircleStyle', ret);
            return ret;
          }
          const styleFunctionChildren = (idx) => {
            const currentLayer = this.props.featuresChildren[idx];
            const style = currentLayer.style;
            const fillColour = style.fillColor ? style.fillColor : 'black';
            const strokeColour = style.borderColor ?  style.borderColor : 'black';
            console.log(`idx=${idx}, fillColor=${fillColour}, strokeColour=${strokeColour}`);
            const ret = new Style({
              image: new CircleStyle({
                radius: 4,
                fill: new Fill({color: fillColour}),
                stroke: new Stroke({color: strokeColour, width: 1})
              })
            });
            return ret;
          };
            function styleZoomer(type, radius, index) {
                if (type === 'parent') {
                    return new CircleStyle({
                        radius: radius,
                        fill: new Fill({
                            color: this.props.featuresParentStyles.fillColor
                        }),
                        stroke: new Stroke({
                            color: this.props.featuresParentStyles.borderColor,
                            width: 1
                        })
                    });
                } else if (type === 'child') {
                    return new CircleStyle({
                        radius: radius,
                        fill: new Fill({
                            color: this.props.featuresChildren[index].style
                                .fillColor
                        }),
                        stroke: new Stroke({
                            color: this.props.featuresChildren[index].style
                                .borderColor,
                            width: 1
                        })
                    });
                } else if (type === 'selectedFeatures') {
                    return new CircleStyle({
                        radius: radius,
                        fill: new Fill({
                            color: this.state.selectedFeaturesStyle.fillColor
                        }),
                        stroke: new Stroke({
                            color: this.state.selectedFeaturesStyle.borderColor,
                            width: 1
                        })
                    });
                }
            }
            styleZoomer = styleZoomer.bind(this); // binding the state

            // parent style - blue inner, dark blue outer
            var imageParent = styleZoomer('parent', 4);
            var stylesParent = {
                Point: new Style({
                    image: imageParent
                })
            };
            var styleFunctionParent = function(feature) {
                return stylesParent[feature.getGeometry().getType()];
            };

            var imageSelectedFeatures = styleZoomer('selectedFeatures', 4);
            var stylesSelectedFeatures = {
                Point: new Style({
                    image: imageSelectedFeatures
                })
            };
            var styleFunctionSelectedFeatures = function(feature) {
                return stylesSelectedFeatures[feature.getGeometry().getType()];
            };
            this.setState({
                compiledSelectedFeatureStyle: styleFunctionSelectedFeatures,
                styleFunctionParent: styleFunctionParent
            });

            // intitializing the geojson
            let points = [];

            // setting the style, labels and location for the children which are passed through props
            if (hasChildrenIn === true) {
                console.log('have children', this.props.featuresChildren);
                var vectorLayerChildrenArr = [];
                var geojsonObjectChildren = {
                    type: 'FeatureCollection',
                    features: []
                };

                //iterating through the types of children
                for (var x = 0; x < this.props.featuresChildren.length; x++) {
                    this.props.featuresChildren[x].children.forEach(child => {
                        //console.log('plotting child', child)
                        // console.log(child)
                        let featureObj = {
                            type: 'Feature',
                            id:
                                '_' +
                                Math.random()
                                    .toString(36)
                                    .substr(2, 11),
                            additionalInfo: child.additionalInfo,
                            geometry: {
                                type: 'Point',
                                crs: {
                                    type: 'name',
                                    properties: {
                                        name: this.props.mapProjection
                                    }
                                },
                                coordinates: [child.lng, child.lat]
                            },
                            geometry_name: 'geom',
                            properties: {
                                childLayerIndex: x,
                                lat: child.lat,
                                lng: child.lng,
                                //type: this.props.featuresChildren[x].deviceType,
                                id:
                                    '_' +
                                    Math.random()
                                        .toString(36)
                                        .substr(2, 11),
                                name: child.name,
                                description: child.description,
                                // borderColor: this.props.featuresChildren[x]
                                //     .style.borderColor,
                                // borderWidth: this.props.featuresChildren[x]
                                //     .style.borderWidth,
                                // fillColor: this.props.featuresChildren[x].style
                                //     .fillColor,
                                additionalInfo: child
                            }
                        };
                        if (
                            isNaN(child.lat) === false &&
                            isNaN(child.lng) === false &&
                            child.lat !== 0 &&
                            child.lng !== 0
                        ) {
                            points.push([child.lng, child.lat]);
                            geojsonObjectChildren.features.push(featureObj);
                        }
                    });

                    var vectorSourceChildren = new VectorSource({
                        features: new GeoJSON().readFeatures(
                            geojsonObjectChildren
                        )
                    });
                    var vectorLayerChildren = new VectorLayer({
                      source: vectorSourceChildren,
                      style: function (feature){
                        const idx = feature && feature.values_ ? feature.values_.childLayerIndex : 0;
                        return styleFunctionChildren(idx);
                      }
                    });
                    this.setState({
                        vectorSourceChildren: vectorSourceChildren
                    });
                    vectorLayerChildrenArr.push(vectorLayerChildren);
                }
            }

            var geojsonObjectParent = {
                type: 'FeatureCollection',
                features: []
            };

            // setting the style, labels and location for the parent
            let featureObjParent = {
                type: 'Feature',
                id:
                    '_' +
                    Math.random()
                        .toString(36)
                        .substr(2, 11),
                geometry: {
                    type: 'Point',
                    crs: {
                        type: 'name',
                        properties: {
                            name: this.props.mapProjection
                        }
                    },
                    coordinates: [
                        this.props.featuresParent.lng,
                        this.props.featuresParent.lat
                    ]
                },
                geometry_name: 'geom',
                properties: {
                    lat: this.props.featuresParent.lat,
                    lng: this.props.featuresParent.lng,
                    type: this.props.featuresParentStyles.label,
                    id:
                        '_' +
                        Math.random()
                            .toString(36)
                            .substr(2, 11),
                    name: this.props.featuresParent.deviceName,
                    description: this.props.featuresParent.deviceDescription,
                    additionalInfo: this.props.featuresParent.additionalInfo,
                    borderColor: this.props.featuresParentStyles.borderColor,
                    borderWidth: this.props.featuresParentStyles.borderWidth,
                    fillColor: this.props.featuresParentStyles.fillColor
                }
            };
            if (
                isNaN(this.props.featuresParent.lng) === false &&
                isNaN(this.props.featuresParent.lat) === false &&
                this.props.featuresParent.lng !== 0 &&
                this.props.featuresParent.lat !== 0 &&
                this.props.featuresParent.lng !== null &&
                this.props.featuresParent.lat !== null
            ) {
                points.push([
                    this.props.featuresParent.lng,
                    this.props.featuresParent.lat
                ]);
                geojsonObjectParent.features.push(featureObjParent);
                console.log('pushing despite null', featureObjParent);
            }

            var geojsonObjectSelectedFeatures = {
                type: 'FeatureCollection',
                features: []
            };

            // setting the style, labels and location for the parent

            // creates a vector source
            var vectorSourceParent = new VectorSource({
                features: new GeoJSON().readFeatures(geojsonObjectParent)
            });


            var vectorLayerParent = new VectorLayer({
                source: vectorSourceParent,
                style: styleFunctionParent
            });

            // creates a vector source
            var vectorSourceSelectedFeatures = new VectorSource({
                features: new GeoJSON().readFeatures(
                    geojsonObjectSelectedFeatures
                )
            });

            var vectorLayerSelectedFeatures = new VectorLayer({
                source: vectorSourceSelectedFeatures,
                style: styleFunctionSelectedFeatures
            });

            var getCentroid = function(coord) {
                var center = coord.reduce(
                    function(x, y) {
                        return [
                            x[0] + y[0] / coord.length,
                            x[1] + y[1] / coord.length
                        ];
                    },
                    [0, 0]
                );
                return center;
            };
            // get center
            var layerCenter = getCentroid(points);
            if(this.state.map !== null){
                let mapElem = document.getElementById(this.state.id);
                mapElem.innerHTML = "";
            }else{
                console.log('map is null')
            }
            var map = null;
            if (hasChildrenIn === true) {
                // var totalLayers = [...vectorLayerChildrenArr];
                // totalLayers.push()
                // totalLayers.push(vectorLayerParent)
                map = new Map({
                    controls: defaultControls().extend([new OverviewMap()]),
                    layers: [new TileLayer({ source: new OSM() })],
                    target: this.state.id,
                    view: new View({
                        center: layerCenter,
                        zoom: 16,
                        projection: this.props.mapProjection
                    })
                });
            } else {
                map = new Map({
                    controls: defaultControls().extend([new OverviewMap()]),
                    layers: [
                        new TileLayer({
                            source: new OSM()
                        })
                    ],
                    target: this.state.id,
                    view: new View({
                        center: layerCenter,
                        zoom: 16,
                        projection: this.props.mapProjection
                    })
                });
            }

            this.setState({map: map});

            // add external layers
            if(this.props.mapLayers){
                this.props.mapLayers.forEach((layer)=>{
                  this.addExternalLayers(map, layer);
                });
              }

            vectorLayerChildrenArr.forEach(layer => {
                map.addLayer(layer);
            });




            // add highlight layer
            let highlightLayer = new VectorLayer({
                source: new VectorSource({
                    features: []
                }),
                style: new Style({
                    image: new Circle({
                        radius: 4,
                        stroke: new Stroke({
                            color: 'red',
                            width: 1
                        }),
                        fill: new Fill({
                            color: 'red'
                        })
                    })
                })
            });

            this.setState({highlightLayer: highlightLayer});
            map.addLayer(highlightLayer);


            let drawSource = new VectorSource({wrapX: false});
            let drawLayer = new VectorLayer({
                    source: drawSource
            });
            map.addLayer(drawLayer);

            this.setState({drawSource : drawSource});


            if (hasChildrenIn === true) {
                this.setState({
                    map: map,
                    //featuresLayerChildren: vectorLayerChildrenArr,
                    featuresLayerParent: vectorLayerParent,
                    vectorLayerSelectedFeatures: vectorLayerSelectedFeatures
                });
            } else {
                this.setState({
                    map: map,
                    vectorLayerSelectedFeatures: vectorLayerSelectedFeatures,
                    featuresLayerParent: vectorLayerParent
                });
            }
            map.addLayer(vectorLayerParent);
            map.addLayer(vectorLayerSelectedFeatures);



            // map.add
            // binding the hover event (popup dialogue)
            map.on('pointermove', this.handleMapHover.bind(this));
            map.on('singleclick', this.handleMapSelect.bind(this, map));// replace with singleclick

            map.on('dblclick', this.handleMapClick.bind(this, map));


            // this.handleDrawingSelection.bind(this, map)
            // changing the size of the features on the map with zoom level
            map.getView().on('change:resolution', function(evt) {
                var currZoomLevel = map.getView().getZoom();
                var radius;
                if (currZoomLevel > 18) {
                    radius = 6;
                } else if (currZoomLevel > 15) {
                    radius = 4;
                } else if (currZoomLevel > 13) {
                    radius = 2;
                } else if (currZoomLevel > 10) {
                    radius = 2;
                } else {
                    radius = 1;
                }
                var stylesParent = new Style({
                    image: styleZoomer('parent', radius)
                });
                var stylesSelectedFeatures = new Style({
                    image: styleZoomer('selectedFeatures', radius)
                });
                vectorLayerParent.setStyle(stylesParent);
                vectorLayerSelectedFeatures.setStyle(stylesSelectedFeatures);

                // if (hasChildrenIn === true) {
                //     for (var x = 0; x < vectorLayerChildrenArr.length; x++) {
                //         var stylesChild = new Style({
                //             image: styleZoomer('child', radius, x)
                //         });
                //         vectorLayerChildrenArr[x].setStyle(stylesChild);
                //     }
                // }
                if(hasChildrenIn === true){
                  for(var x = 0; x < vectorLayerChildrenArr.length; x ++){
                    console.log('setStyleFunctionChildren(',x,')');
                    if(vectorLayerChildrenArr[x].getSource()){
                      var sf = vectorLayerChildrenArr[x].getSource().getFeatures();
                      //console.log(sf)
                      sf.forEach(function(feature){
                        const idx = feature && feature.values_ ? feature.values_.childLayerIndex : 0;
                        var childImage = styleFunctionChildren(idx).getImage();
                        childImage.setRadius(radius);
                        var stylesChild = new Style({image: childImage});
                        feature.setStyle(stylesChild);
                      });
                    }
                  }
                }

                // change radius size for highlight layers
                highlightLayer.setStyle(new Style({
                    image: new Circle({
                        radius: radius,
                        stroke: new Stroke({
                            color: 'red',
                            width: 1
                        }),
                        fill: new Fill({
                            color: 'red'
                        })
                    })
                }));

            });
            map.updateSize();
        }
        this.setState({
            lockedDevices : this.props.featuresChildren
        })
    }
    addExternalLayers(map, layer){
        if(layer.active && layer.source.type === 'WMTS'){
        let projection = getProjection(layer.projection ? layer.projection : "EPSG:4326");
        let projectionExtent = projection.getExtent();
        let size = getWidth(projectionExtent) / 256;
        let resolutions = new Array(30);
        let matrixIds = new Array(30);
        for (var z = 0; z < 30; ++z) {
            // generate resolutions and matrixIds arrays for this WMTS
            resolutions[z] = size / Math.pow(2, z);
            matrixIds[z] = z;
        }
        let tileLayer = new TileLayer({
                source: new WMTS({
                type: WMTS,
                url: layer.source.url,
                format: layer.source.format ? layer.source.format : 'image/png',
                projection: projection,
                tileGrid: new WMTSTileGrid({
                    origin: getTopLeft(projectionExtent),
                    resolutions: resolutions,
                    matrixIds: matrixIds
                }),
                style: layer.source.style ? layer.source.style : 'default',
                wrapX: layer.source.wrapX ? layer.source.wrapX : true
                })
        })
        tileLayer.set('name', layer.name);
        map.addLayer(tileLayer);
        }
        else if(layer.active && layer.source.type === 'ArcGIS'){
        let tileLayer = new TileLayer({
                source: new TileArcGISRest({
                url: layer.source.url
                })
        })
        tileLayer.set('name', layer.name);
        map.addLayer(tileLayer);
    }
    }
    updateExternalLayers(event){
        const layerName = event.target.value;
        this.props.mapLayers.forEach((layer)=>{
        if(layer.name === layerName){
            layer.active = !layer.active;
            if(!layer.active){
            this.state.map.getLayers().getArray().forEach(_layer => {
                if (_layer && _layer.get('name') === layerName) {
                this.state.map.removeLayer(_layer);
                }
            });
            } else{
            this.addExternalLayers(this.state.map, layer);
            }
        }});
    }

    componentDidMount() {
        this.buildMap();
        this.setState({
            initialLoad : false
        })
    }

    // different on click handlers
    showDeviceExtensionPopUp(deviceId, type) {
        // gets an extension for the device and creates an overlay
    }

    goto(deviceId, type) {
        // redirects to the asset page of device type
    }

    createGroup() {
        // creates a group of assets with a drawing shape
    }

    handleDrawingSelection(event){
        this.setState({
            drawType: event.target.value
        }, () => {
            const _map = this.state.map;
            let draw = this.state.drawInt;
            _map.removeInteraction(draw);
            if (this.state.drawType != 'None') {
                let drawType = this.state.drawType;
                const drawSource = this.state.drawSource;
                let geoType = null;
                if(this.state.drawType === "Circle"){
                    drawType = 'Circle';
                    geoType = createRegularPolygon();
                } else if(this.state.drawType === "Square"){
                    drawType = 'Circle';
                    geoType = createRegularPolygon(4); // default
                } else if(this.state.drawType === "Polygon"){
                    drawType = 'Polygon';
                    geoType = null;
                }
                const layers = this.state.featuresLayerChildren;
                const highlight = this.state.highlight;
                function addInteraction() {
                    let value = drawType;
                    draw = new Draw({
                        source: drawSource,
                        type: value,
                        geometryFunction: geoType
                    });
                    // add event listender
                    draw.on('drawstart', (e) => {
                        // clean source
                        drawSource.clear();
                    });


                    draw.on('drawend', (e) => {
                        // find all features in this area
                        const area = e.feature.getGeometry();
                        let allFeatures = [];
                        layers.forEach(layer => {
                            // put all features together
                            let features = layer.getSource().getFeatures();
                            allFeatures = allFeatures.concat(features);
                        });

                        let selectedPoints = [];
                        allFeatures.forEach(feature => {
                            if(area.intersectsExtent(feature.getGeometry().getExtent())){
                                // put it in
                                const existFeature = selectedPoints.filter( _selected => {
                                    return _selected.getId() === feature.getId();
                                });

                                if(existFeature.length === 0){
                                    selectedPoints.push(feature);
                                }
                            }
                        });

                        // call outside
                        if(selectedPoints.length > 0){
                            let points = [];
                            selectedPoints.forEach(_feature => {
                                points.push(_feature.getProperties());
                            });
                            highlight(points);
                        } else {
                            highlight([]);
                        }
                    })

                    _map.addInteraction(draw);

                }
                addInteraction();
                this.setState({drawInt: draw});
                console.log('Is a Square nibba');
            } else {
                const _map = this.state.map;
                const highlight = this.state.highlight;
                const drawSource = this.state.drawSource;
                drawSource.clear();
                let draw = this.state.drawInt;
                _map.removeInteraction(draw);
                highlight([]);
            }
        });
    }


    handleMapSelect(map, event){
        console.info("start select point on map!");
        // tell outside I got something to highlight
        let callback = this.state.highlight;
        let selectedFeatures = [];
        this.state.map.forEachFeatureAtPixel(event.pixel, feature => {
            const fP = feature.getProperties();
            console.info("found feature: ", fP);
            const foundExistFeature = selectedFeatures.filter(existFeature => {
                const existP = existFeature.getProperties();
                return fP.name && fP.name === existP.name;
            });
            if(foundExistFeature.length === 0 && fP.name){
                console.info("same feature not found ", feature);
                selectedFeatures.push(feature);
            } else {
                console.info("same feature found, ignroe ", foundExistFeature);
            }
        });

        if(selectedFeatures.length > 0){

            let coordinates = [];
            //
            console.info("start adding feature into highlight array!");
            let featuresNeedRemove = [];
            selectedFeatures.forEach(_feature => {
                const newFeature = _feature.getProperties();
                coordinates = _feature.getGeometry().getCoordinates();
                // exists?
                const featureExist = this.featureWithProperties.filter(_f => {
                    return _f.name === newFeature.name;
                });

                if(featureExist.length === 0){
                    console.info("highlight device not found, create one!", _feature);
                    this.featureWithProperties.push(_feature.getProperties());
                } else {
                    console.info("highlight device exist! ", featureExist);
                    featuresNeedRemove = featuresNeedRemove.concat(featureExist);
                }

            });
            //
            if(featuresNeedRemove.length > 0){
                console.info("need to remove:  ", featuresNeedRemove);
                let newHighlightArray = [];

                this.featureWithProperties.forEach(_f => {

                    let needsToRemove = false;
                    featuresNeedRemove.forEach(_r => {
                        if(_r.name === _f.name){
                            needsToRemove = true;
                        }
                    });

                    if(!needsToRemove){
                        newHighlightArray.push(_f);
                    }
                });

                this.featureWithProperties = newHighlightArray;
            }


            console.info("send highlight points to graph!", this.featureWithProperties);
            // just need to add one point on highlight layer
            if(coordinates.length > 0 && featuresNeedRemove.length === 0 ){
                let _newFeature = new Feature({
                    geometry: new Point(coordinates),
                    properties: {}
                });
                this.state.highlightLayer.getSource().addFeature(_newFeature);
            } else if(coordinates.length > 0 && featuresNeedRemove.length != 0 ) {
                // remove highlight point on map
                const highlightFeatures = this.state.highlightLayer.getSource().getFeatures();
                let featureRM = null;
                highlightFeatures.forEach(_f => {
                    const coor = _f.getGeometry().getCoordinates();

                    if(coor[0] === coordinates[0] && coor[1] === coordinates[1]){
                        // found it
                        featureRM = _f;
                    }
                });

                if(featureRM){
                    this.state.highlightLayer.getSource().removeFeature(featureRM);
                }

            }

            if(this.featureWithProperties.length === 0){
                if(callback){
                    callback(["bring all back"]);
                }
            } else {
                if(callback){
                    callback(this.featureWithProperties);
                }
            }
        }




        // else {
        //     // clean highlight
        //     this.state.highlightLayer.getSource().clear();
        //     this.setState({featureWithProperties: []});
        //     callback([]);
        // }


    }



    handleMapClick(map, event) {
        if (this.state.redirectInteraction !== true) {
            if (this.state.drawType === 'None') {
                let selectedFeatures = [...this.state.selectedFeatures];
                let highlightFeatures = [];
                let resettingFeatures = [];
                // adding or removing feature from list of selected features, then setting state
                this.state.map.forEachFeatureAtPixel(event.pixel, feature => {
                    this.state.selectedFeatures.indexOf(feature) === -1
                        ? selectedFeatures.push(feature)
                        : resettingFeatures.push(
                            selectedFeatures.splice(
                                this.state.selectedFeatures.indexOf(feature),
                                1
                            )[0]
                        );
                });
                selectedFeatures.forEach((feature)=>{
                    highlightFeatures.push(feature.getProperties());
                })
                if (this.props.isHighlightRow) {
                    this.props.highlightRow(highlightFeatures);
                }

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
                    Point: new Style({
                        image: image
                    })
                };
                // Returning the actual style function, needed for first time creation, not modifying functions
                var style = function(feature) {
                    return styles[feature.getGeometry().getType()];
                };

                selectedFeatures.map(feature => {
                    feature.setStyle(style);
                });

                resettingFeatures.map(feature => {
                    let fProps = feature.getProperties();
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
                        Point: new Style({
                            image: image2
                        })
                    };
                    // Returning the actual style function, needed for first time creation, not modifying functions
                    var style2 = function(feature) {
                        return styles2[feature.getGeometry().getType()];
                    };
                    feature.setStyle(style2);
                });
                this.setState({
                    selectedFeatures: selectedFeatures,
                    map: map
                });
            }
        } else if (this.state.redirectInteraction === true && this.state.drawType == "None") {


            let selectedFeatures = [...this.state.selectedFeatures];
            let resettingFeatures = [];
            // redirecting
            this.state.map.forEachFeatureAtPixel(event.pixel, feature => {
                let p = feature.getProperties();
                if(p && p.type && p.name){
                    // disable dblclick for zoom in
                    event.stopPropagation();
                    event.preventDefault();
                    window.open(
                        `http://${window.location.host}/${
                            feature.getProperties().type
                        }/${feature.getProperties().name}`,
                        '_blank'
                    );

                }

            });
        }
    }

    handleMapHover(event) {
        if (this.state.drawType === 'None' || this.state.drawInteraction !== true) {
            let featureArr = [];
            this.state.map.forEachFeatureAtPixel(event.pixel, feature => {
                const prop = feature.getProperties();
                if(prop && prop.name){
                    featureArr.push(feature.values_);
                }

            });
            if (featureArr.length > 0) {
                this.setState({
                    focusedFeatures: featureArr,
                    popupVisible: true
                });
            } else {
                this.setState({
                    focusedFeature: null,
                    popupVisible: false
                });
            }
        }
    }

    render() {
        return (
            <div className={"d"} style={{"display" : "contents"}}>
                <div className={"w-100 map fgpReactMap"} id={this.state.id}>
                {this.props.mapLayers ?
                    <div className=" fgpReactMapLayer">
                        <Dropdown>
                        <Dropdown.Toggle variant="" id="dropdown-basic">
                            LAYERS
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{padding: '0'}}>
                            {this.props.mapLayers.map(layer => {
                            return(
                                <Dropdown.Item key={layer.name}> <Form.Check type="checkbox" onChange={this.updateExternalLayers} value={layer.name} checked={layer.active} label={layer.name} /></Dropdown.Item>
                            )
                            })}
                        </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    :""
                }
                </div>
                <MapPopup visibility={this.state.popupVisible} focusedFeatures={this.state.focusedFeatures} mapPopupInfo={this.props.mapPopupInfo} showDescriptionOnHover={this.props.showDescriptionOnHover}
                />
                {   this.state.drawInteraction === true ? (
                        <BasicMapDrawSelector
                            handleDrawingSelection={this.handleDrawingSelection.bind(this)}
                            drawType={this.state.drawType}
                            selectedFeatures={this.state.selectedFeatures}
                        />
                    ) : null
                    }
            </div>
        );
    }
}

export default BasicMapFGP
