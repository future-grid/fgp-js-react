import React, { Component } from 'react'
import FgpGraph from '@future-grid/fgp-graph';
import DataService from './DataService';
import { Formatters } from '@future-grid/fgp-graph/lib/extras/formatters';
import moment from 'moment';
import './standardGraph.css';

export class StandardGraph extends Component {
    constructor(props){
        super(props);
        this.state = {
            dataService : new DataService(
                this.props.deviceType, 
                this.props.baseUrl, 
                this.props.backUpInterval,
                this.props.backupFields,
                this.props.backupEntities,
                this.props.graphVersion ? this.props.graphVersion : null
                ),
            formatters : this.props.timeZone ? new Formatters(this.props.timeZone) : new Formatters(Intl.DateTimeFormat().resolvedOptions().timeZone),
            id : this.props.id ? this.props.id :`sg_${Math.random().toString(36).substr(2, 11)}`
        }
        console.log("Standard Graph Props => ", this.props)
    }

    buildConfig(){
        let rangeCollection = this.props.rangeCollection;
        let collections = this.props.collections;
        let ranges = this.props.ranges;
        let initRange = this.props.initRange ? this.props.initRange : {
            start: moment().tz('Australia/Adelaide').subtract(2, 'days').startOf('day').valueOf(),
            end: moment().tz('Australia/Adelaide').add(1, 'days').startOf('day').valueOf()
        };        
        let vfConfig = {
            name: this.props.graphName ? this.props.graphName : "Device View",
            graphConfig: {
                features: {
                    zoom: this.props.zoom ? this.props.zoom : true,
                    scroll: this.props.scroll ? this.props.scroll : true,
                    rangeBar: this.props.rangeBar ? this.props.rangeBar : true,
                    legend: this.state.formatters.legendForAllSeries
                },
                entities: this.props.entities,
                rangeEntity: {
                    id: this.props.deviceName,
                    type: this.props.deviceType,
                    name: this.props.deviceName
                },
                rangeCollection: rangeCollection,
                collections: collections
            },
            dataService: this.state.dataService,
            show: true,
            ranges: ranges,
            initRange: initRange,
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
            timezone: this.props.timeZone
        }
        this.renderGraph(vfConfig)
    }

    renderGraph(config){
        let graph = new FgpGraph(document.getElementById(this.state.id),[
            config
        ])
        graph.initGraph()
    } 

    componentDidMount(){        
        this.buildConfig()
    }

    render() {
        
        var graphContainer = {
            height: this.props.graphHeight, 
            padding: this.props.graphPadding
        };
        return (
            <div id={this.state.id} style={graphContainer}></div>
        )
    }
}



export default StandardGraph
