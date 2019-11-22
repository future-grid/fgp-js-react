import React, { Component } from 'react'
import { Formatters } from '@future-grid/fgp-graph/lib/extras/formatters';
import { DataServiceV2 } from './DataServiceV2'
import moment from 'moment';
import FgpGraph from '@future-grid/fgp-graph';
import './StandardGraphV2.css'

export class StandardGraphV2 extends Component {
    constructor(props){
        super(props);
        this.state = {
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
            id : this.props.id  ? this.props.id :`sg_${Math.random().toString(36).substr(2, 11)}`
        }
    }



    componentDidMount(){
        let formatter = this.props.timeZone ? new Formatters(this.props.timeZone) : new Formatters('Australia/Melbourne')
        let dataService = new DataServiceV2(this.props.baseUrl)

        if(this.props.debugging === true){
            var vdConfig = {
                name: 'device view',
                graphConfig: {
                    features: { 
                        zoom: true,
                        scroll: true,
                        rangeBar: true,
                        legend: formatter.legendForAllSeries
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
            var graph1 = new FgpGraph(document.getElementById(this.state.id), [
                vdConfig
            ]);
        }else{
            var rawConfigs = [...this.props.configs];
            var completeConfigs = [];
            rawConfigs.forEach(config => {
                var vdConfig = {
                    name: config.name,
                    graphConfig: {
                        features: { 
                            zoom: config.graphConfig.features.zoom === false ? false : true ,
                            scroll: config.graphConfig.features.scroll === false ? false : true ,
                            rangeBar: config.graphConfig.features.rangeBar === false ? false : true ,
                            legend: formatter.legendForAllSeries
                        },
                        entities: config.graphConfig.entities,
                        rangeEntity: config.graphConfig.rangeEntity,
                        rangeCollection: config.graphConfig.rangeCollection,
                        collections: config.graphConfig.collections
                    },
                    dataService: dataService,
                    show: config.show,
                    ranges: config.graphConfig.ranges,
                    initRange: this.props.globalDateWindow ? (
                        {
                            start : this.props.globalDateWindow[0],
                            end : this.props.globalDateWindow[1],
                        }
                    ) : (
                        config.graphConfig.initRange
                    ),
                    interaction: config.graphConfig.interaction,
                    timezone: config.graphConfig.timezone
                };
                completeConfigs.push(vdConfig)
            });
            var graph1 = new FgpGraph(document.getElementById(this.state.id), completeConfigs);
        }
        // render graph
        graph1.initGraph();
        
        if(this.props.isParent === true){
            console.log('> Creating child graphs...')
            var childGraphPropertiesArray = [...this.props.childGraphConfigs]
            var childGraphArray = [...this.state.childGraphs];
            childGraphPropertiesArray.forEach( graphConfig => {
                var childGraphViewConfigs = []
                graphConfig.viewConfigs.forEach( viewConfig =>{
                    let dateTime = viewConfig.graphConfig.initRange
                    var graphConf = {
                        name: viewConfig.name,
                        graphConfig: {
                            features: { 
                                zoom: viewConfig.graphConfig.features.zoom === false ? false : true ,
                                scroll: viewConfig.graphConfig.features.scroll === false ? false : true ,
                                rangeBar: viewConfig.graphConfig.features.rangeBar === false ? false : true ,
                                legend: formatter.legendForAllSeries
                            },
                            entities: viewConfig.graphConfig.entities,
                            rangeEntity: viewConfig.graphConfig.rangeEntity,
                            rangeCollection: viewConfig.graphConfig.rangeCollection,
                            collections: viewConfig.graphConfig.collections
                        },
                        dataService: dataService,
                        show: viewConfig.show === false ? false : true,
                        ranges: viewConfig.graphConfig.ranges,
                        initRange: this.props.globalDateWindow ? (
                            {
                                start : this.props.globalDateWindow[0],
                                end : this.props.globalDateWindow[1],
                            }
                        ) : (
                            dateTime
                        ),
                        interaction: viewConfig.graphConfig.interaction,
                        timezone: viewConfig.graphConfig.timezone
                    };
                    childGraphViewConfigs.push(graphConf)
                })
                var graphX = new FgpGraph(document.getElementById(graphConfig.id), childGraphViewConfigs);
                graphX.initGraph();
                childGraphArray.push(graphX)
            })
            this.setState({
                childGraphs:childGraphArray
            })
            graph1.setChildren(childGraphArray)
        }
    
        this.setState({
            formatters : formatter,
            dataService : dataService,
            graph1 : graph1
        })
    }

   



    render() {
        return (
            <div className={"container-fluid"}>
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
