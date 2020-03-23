import React, { Component } from 'react'
import { Formatters } from '@future-grid/fgp-graph/lib/extras/formatters';
import { DataServiceV2 } from './DataServiceV2'
import { DataServiceV3 } from './DataServiceV3'
import { GraphLoadHelper } from './GraphLoadHelper';
import moment from 'moment';
import FgpGraph from '@future-grid/fgp-graph';
import { DatePickerWrapper } from '../../MultiReferenceFilterSearch/DatePickerWrapper/DatePickerWrapper'
import './StandardGraphV2.css'

export class StandardGraphV2 extends Component {

    constructor(props){
        super(props);
        this.state = {
            mainGraph: null,
            childGraphs: [],
            sampleEntities : [
                {
                    id: "001350030035b8f9_a",
                    type: 'channel',
                    name: "001350030035b8f9_a"
                },
                {
                    id: "001350030035b8f9_b",
                    type: 'channel',
                    name: "001350030035b8f9_b"
                }
            ],
            sampleRangeCollection : {
                label: 'channel_read_hour',
                name: 'channel_read_hour',
                interval: 3600000,
                series: [
                    {
                        label: 'Avg Voltage',
                        type: 'line',
                        exp: 'data.voltageAvgLvt'
                    }
                ]
            },
            sampleCollections : [
                {
                    label: 'channel_read_hour',
                    name: 'channel_read_hour',
                    interval: 3600000,
                    series: [
                        {
                            label: 'Avg Voltage',
                            type: 'line',
                            exp: 'data.voltageAvgLvt',
                            yIndex: 'left',
                            color: '#d80808'
                        },
                        {
                            label: 'MaxVoltage',
                            type: 'line',
                            exp: 'data.voltageMaxLvt',
                            yIndex: 'left',
                            color: '#2d2d2d'
                        },
                        {
                            label: 'Min Voltage',
                            type: 'line',
                            exp: 'data.voltageMinLvt',
                            yIndex: 'left',
                            color: '#058902'
                        }
                    ],
                    threshold: { min: 0, max: 1000 * 60 * 60 * 24 * 400 }, //  0 ~ 2 days
                    yLabel: 'Voltage',
                    initScales: { left: { min: 150, max: 300 }},
                    globalDateWindow : this.props.globalDateWindow ? this.props.globalDateWindow : [moment().tz('Australia/Melbourne').subtract(10, 'days').startOf('day').valueOf(), moment().tz('Australia/Melbourne').startOf('day').valueOf()],
                    fill: false
                }
            ],
            graphStyles : this.props.graphStyles ? this.props.graphStyles : {
                height: '300px', 
                padding: '10px'
            },
            id : this.props.id  ? this.props.id :`sg_${Math.random().toString(36).substr(2, 11)}`,
            heldDates : [
                this.props.globalDateWindow[0]?this.props.globalDateWindow[0]:
                this.props.externalDateWindow[0]?this.props.globalDateWindow[0]:moment().startOf('day').subtract(7,'days'), 
                this.props.globalDateWindow[1]?this.props.globalDateWindow[1]:
                this.props.externalDateWindow[1]?this.props.globalDateWindow[1]:moment().endOf('day')
            ],
        }
        this.confirmDate = this.confirmDate.bind(this);
        this.holdPreconfirmDate = this.holdPreconfirmDate.bind(this);
    }


    /**
     * 
     * @param {*} props 
     */
    // componentWillReceiveProps(props){

        

    // }


    componentWillReceiveProps(props){
        if(props.highlight && props.highlight.length > 0){
            if(this.state.mainGraph){
                console.info("highlights:", props.highlight);
                this.state.mainGraph.highlightSeries(props.highlight);
            }
        }

        // if(props.externalDateWindow){
        //    this.setState({
        //        heldDates : props.externalDateWindow
        //    })
        // }

        // else if(props.highlight && props.highlight.length == 0) {
        //     if(this.state.mainGraph){
        //         console.info("highlights:", props.highlight);
        //         this.state.mainGraph.highlightSeries([]);
        //     }
        // }
        if(this.props.externalDateWindow !== props.externalDateWindow ){
            if(props.externalDateWindow !== null && props.externalDateWindow !== undefined && props.externalDateWindow.length === 2 && props.externalDateWindow[0] < props.externalDateWindow[1])  
            this.setState({
                heldDates : props.externalDateWindow
            }, () => {
                setTimeout( () => {
                    this.state.mainGraph.updateDatewinow(this.state.heldDates)
                }, 100);
            })
        }
    }


    componentDidMount(){
        let formatter = this.props.timeZone ? new Formatters(this.props.timeZone) : new Formatters('Australia/Melbourne')
        // console.log(this.props, this,state)
        
        let mainGraph;
        if(this.props.debugging === true){
            if(this.props.newDataService == true){
                var dataService = new DataServiceV3(this.props.baseUrl, this.props.externalDateWindow, this.state)
                console.log('loading in new data servicdd')
            }else{
                var dataService = new DataServiceV2(this.props.baseUrl)
            }
            var vdConfig = {
                name: 'device view',
                connectSeparatedPoints: true,
                graphConfig: {
                    features: { 
                        zoom: true,
                        scroll: true,
                        rangeBar: true,
                        legend: formatter.legendForAllSeries,
                    },
                    entities: this.state.sampleEntities,
                    rangeEntity: this.state.sampleEntities[0],
                    rangeCollection: this.state.sampleRangeCollection,
                    collections: this.state.sampleCollections
                },
                dataService: dataService,
                show: true,
                ranges: [
                    { name: '2 days', value: (2 * 1000 * 60 * 60 * 24 ), show: true },
                    { name: '1 week', value: (7 * 1000 * 60 * 60 * 24 ) }
                ],
                initRange: {
                    start: moment().tz('Australia/Melbourne').subtract(2, 'days').startOf('day').valueOf(),
                    end: moment().tz('Australia/Melbourne').add(1, 'days').startOf('day').valueOf()
                },
                interaction: {
                    callback: {
                        highlighCallback: (datetime, series, points) => {
                            // console.debug("selected series: ", series);
                            return [];
                        },
                        selectCallback: series => {
                            // console.debug("choosed series: ", series);
                        }
                    }
                },
                timezone: 'Australia/Melbourne'
                // timezone: 'Pacific/Auckland'
            };
            mainGraph = new FgpGraph(document.getElementById(this.state.id), [
                vdConfig
            ]);
        }else{
            var rawConfigs = [...this.props.configs];
            var completeConfigs = [];
            var dataService;
            rawConfigs.forEach((config, index) => {
                if(this.props.newDataService == true){
                    dataService = new DataServiceV3(this.props.baseUrl, this.props.externalDateWindow, config, this.state.id+"_DSV3_P"+index);
                    // console.log('loading in new data servicdd')
                }else{
                    dataService = new DataServiceV2(this.props.baseUrl);
                }
                var vdConfig = {
                    name: config.name,
                    connectSeparatedPoints: config.connectSeparatedPoints? config.connectSeparatedPoints : true,
                    graphConfig: {
                        hideHeader: config.graphConfig.hideHeader? config.graphConfig.hideHeader: false,
                        features: { 
                            zoom: config.graphConfig.features.zoom === false ? false : true ,
                            scroll: config.graphConfig.features.scroll === false ? false : true ,
                            rangeBar: config.graphConfig.features.rangeBar ? config.graphConfig.features.rangeBar : false ,
                            legend: config.graphConfig.features.legend ? config.graphConfig.features.legend : formatter.legendForAllSeries,
                            exports: ["data"],
                            rangeLocked: config.graphConfig.features.rangeLocked ? config.graphConfig.features.rangeLocked : false,
                            toolbar: config.graphConfig.features.toolbar 
                        },
                        entities: config.graphConfig.entities,
                        rangeEntity: config.graphConfig.rangeEntity,
                        rangeCollection: config.graphConfig.rangeCollection,
                        collections: config.graphConfig.collections,
                        filters: config.graphConfig.filters ? config.graphConfig.filters : null
                    },
                    dataService: config.dataService ? config.dataService : dataService,
                    show: config.show,
                    ranges: config.graphConfig.ranges,
                    initRange: this.props.globalDateWindow ? (
                        {
                            start : this.state.heldDates[0],
                            end : this.state.heldDates[1],
                        }
                    ) : (
                        config.graphConfig.initRange
                    ),
                    interaction: config.graphConfig.interaction,
                    timezone: config.graphConfig.timezone
                };
                completeConfigs.push(vdConfig)
            });

            if(this.props.eventHandlers){
                mainGraph = new FgpGraph(document.getElementById(this.state.id), completeConfigs, this.props.eventHandlers);
            } else {
                mainGraph = new FgpGraph(document.getElementById(this.state.id), completeConfigs);
            }

            
        }
        // render graph
        mainGraph.initGraph();
        
        if(this.props.isParent === true){
            // console.log('> Creating child graphs...')
            var childGraphPropertiesArray = [...this.props.childGraphConfigs]
            var childGraphArray = [...this.state.childGraphs];
            // dataservice for children graphs    Eric 28/02/2020
            var dataService;
            childGraphPropertiesArray.forEach( graphConfig => {
                var childGraphViewConfigs = []
                graphConfig.viewConfigs.forEach( (viewConfig, index) =>{
                    if(this.props.newDataService === true){
                        dataService = new DataServiceV3(this.props.baseUrl, this.props.externalDateWindow, graphConfig, this.state.id+"_DSV3_C"+index);
                    }else{
                        dataService = new DataServiceV2(this.props.baseUrl);
                    }
                    let dateTime = viewConfig.graphConfig.initRange;
                    var graphConf = {
                        name: viewConfig.name,
                        connectSeparatedPoints: viewConfig.connectSeparatedPoints? viewConfig.connectSeparatedPoints : true,
                        graphConfig: {
                            hideHeader: viewConfig.graphConfig.hideHeader? viewConfig.graphConfig.hideHeader: false,
                            features: { 
                                zoom: viewConfig.graphConfig.features.zoom === false ? false : true ,
                                scroll: viewConfig.graphConfig.features.scroll === false ? false : true ,
                                rangeBar: viewConfig.graphConfig.features.rangeBar ? viewConfig.graphConfig.features.rangeBar : false ,
                                legend: viewConfig.graphConfig.features.legend ? viewConfig.graphConfig.features.legend : formatter.legendForAllSeries,
                                exports: ["data"],
                                rangeLocked: viewConfig.graphConfig.features.rangeLocked ? viewConfig.graphConfig.features.rangeLocked : false,
                                toolbar: viewConfig.graphConfig.features.toolbar
                            },
                            entities: viewConfig.graphConfig.entities,
                            rangeEntity: viewConfig.graphConfig.rangeEntity,
                            rangeCollection: viewConfig.graphConfig.rangeCollection,
                            collections: viewConfig.graphConfig.collections,
                            filters: viewConfig.graphConfig.filters ? viewConfig.graphConfig.filters : null
                        },
                        dataService: viewConfig.dataService ? viewConfig.dataService : dataService ,
                        show: viewConfig.show === false ? false : true,
                        ranges: viewConfig.graphConfig.ranges,
                        initRange: this.props.globalDateWindow ? (
                            {
                                start : this.state.heldDates[0],
                                end : this.state.heldDates[1],
                            }
                        ) : (
                            dateTime
                        ),
                        interaction: viewConfig.graphConfig.interaction,
                        timezone: viewConfig.graphConfig.timezone
                    };
                    childGraphViewConfigs.push(graphConf);
                });
                if(this.props.eventHandlers){
                    var graphX = new FgpGraph(document.getElementById(graphConfig.id), childGraphViewConfigs, this.props.eventHandlers);
                }else{
                    var graphX = new FgpGraph(document.getElementById(graphConfig.id), childGraphViewConfigs);
                }
                graphX.initGraph();
                childGraphArray.push(graphX)
            })
            this.setState({
                childGraphs:childGraphArray
            })
            mainGraph.setChildren(childGraphArray)
        }
    
        this.setState({
            formatters : formatter,
            dataService : dataService,
            mainGraph : mainGraph
        })
    }

    // for use with double-confirm datepicker graph
    confirmDate(){
        this.props.handleExternalDateWindow([moment(this.state.heldDates[0]).startOf('day').valueOf(), moment(this.state.heldDates[1]).endOf('day').valueOf()])

    }

    holdPreconfirmDate(dateWindow){
        this.setState({
            heldDates : dateWindow
        })
    }

   



    render() {
        return (
            <div className={"container-fluid"}>
                { this.props.includeDatePicker === "double" ? (
                        <div className={"row"}>
                            <div  className={"d-flex align-items-center m-left-10px m-right-2px"}>
                                Start:
                            </div>
                            <div style={{"width":  "120px"}}>
                                <DatePickerWrapper 
                                    date={this.props.externalDateWindow[0]}
                                    handleChange={(date) => {
                                        this.props.handleExternalDateWindow([moment(date).startOf('day').valueOf(), this.props.externalDateWindow[1]])
                                    }}
                                />
                            </div>
                            <div className={"d-flex align-items-center  m-left-10px m-right-2px"}>
                                End:
                            </div>
                            <div style={{"width":  "120px"}}>
                                <DatePickerWrapper 
                                    date={this.props.externalDateWindow[1]}
                                    handleChange={(date) => {
                                        this.props.handleExternalDateWindow([this.props.externalDateWindow[0], moment(date).endOf('day').valueOf()])
                                    }}
                                />
                            </div>
                        </div>

                    ) : this.props.includeDatePicker === "single" ? (
                        <div className={"row"}>
                            <div>
                                <DatePickerWrapper 
                                    date={this.props.externalDateWindow[0]}
                                    handleChange={(date) => {
                                        this.props.handleExternalDateWindow([moment(date).startOf('day').valueOf(), moment(date).endOf('day').valueOf()])
                                    }}
                                />
                            </div>
                        </div>
                    ) : this.props.includeDatePicker === "double-confirm" ? (
                        <div className={"row"}>
                            <div  className={"d-flex align-items-center m-left-10px m-right-2px"}>
                                Start:
                            </div>
                            <div style={{"width":  "120px"}}>
                                <DatePickerWrapper 
                                    date={this.state.heldDates[0]}
                                    handleChange={(date) => {
                                        this.holdPreconfirmDate([moment(date).startOf('day').valueOf(), this.state.heldDates[1]])
                                    }}
                                />
                            </div>
                            <div className={"d-flex align-items-center  m-left-10px m-right-2px"}>
                                End:
                            </div>
                            <div style={{"width":  "120px"}}>
                                <DatePickerWrapper 
                                    date={this.state.heldDates[1]}
                                    handleChange={(date) => {
                                        this.holdPreconfirmDate([this.state.heldDates[0], moment(date).endOf('day').valueOf()])
                                    }}
                                />
                            </div>
                            <div style={{"width":  "120px"}}>
                                <button className={"btn btn-primary"} onClick={this.confirmDate}>
                                   Confirm
                                </button>
                            </div>
                        </div>
                    ) : (
                        ""
                    )
                }
                <div className={"w-100"} style={{"marginBottom" : "20px"}}>
                    <div id={this.state.id} style={this.state.graphStyles}>

                    </div>
                </div>
                {
                    this.state.isParent === true ? (
                        this.state.childGraphConfigs.map( childGraph => {
                            return(
                                <div className={"w-100"} style={{"marginBottom" : "20px"}}>
                                    <div id={childGraph.id} style={this.state.graphStyles}>

                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        null
                    )
                }
            </div>
        )
    }
}

export default StandardGraphV2
