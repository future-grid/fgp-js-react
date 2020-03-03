import axios from 'axios';
import moment from 'moment';
import GraphLoadHelper from './GraphLoadHelper';

export class DataServiceV3{
    constructor(baseUrl, initialTimeWindow, config, graphServiceId){
        console.log("ARGGGGGGs>>\n",arguments)
        this.baseUrl = baseUrl;
        this.savedTimeRange = initialTimeWindow;
        this.savedResult = [];
        this.savedInterval = "";
        this.id = graphServiceId
        this.graphLoadHelper = new GraphLoadHelper(initialTimeWindow, config, graphServiceId)

        // if we have no cache configured for this graph in this session yet, init one(there should never be one intit'd already unless there is conflict with IDs)
        if(!this.graphLoadHelper.checkStorageKey()){
            this.graphLoadHelper.setStorageKey();
        }

        this.fetchFirstNLast = (ids, deviceType, interval, fields) => {
            let url = `${this.baseUrl}${deviceType}/${interval}/${ids[0]}/first-last`
            console.log('url', url, "ids", ids, "deviceType", deviceType, "interval",interval) 
            return new Promise((resolve, reject) => {
                // sample data for first and last
                axios.get(url).then(resp=>{
                    console.log('I am resp', resp)
                    resp.id = ids[0]
                    resolve([resp])
                }).catch(err => {
                    var resp = {
                        first : {
                            timestamp : moment().subtract(10, "days").startOf('day').valueOf()
                        },
                        end : { 
                            timestamp : moment().endOf('day').valueOf()
                        },
                        id : ids[0]
                    }
                    resolve([resp])
                })
            });
    
        };
        this.fetchdata = (ids, deviceType, interval, range, fields) => {
            let url = `${this.baseUrl}${deviceType}/${interval}`
            var reload = true
            var newLoadBefore = false;
            var newLoadAfter = false;

            // console.log("FETCH DATA ARGS >>>", arguments) 
            // console.log(ids, deviceType, interval, range, fields)

            // if we request data before the start of the init range

            console.log(
                `DATASERVICE-V3 logs > \n
                Interval s/n ${this.savedInterval} / ${interval}\n
                Start TS s/n ${this.savedTimeRange[0]} / ${range.start}
                End   TS s/n ${this.savedTimeRange[1]} / ${range.end}
                Fields   s/n ${fields}`
            );


            if(range.start > this.savedTimeRange[0] && range.end < this.savedTimeRange[1] ){
                reload = false
            }else{

                if( range.start < this.savedTimeRange[0] ){
                    reload = true;
                    newLoadBefore = true;
                    this.savedTimeRange[0] = range.start;
                }
    
                if(range.end > this.savedTimeRange[1]){
                    reload = true;
                    newLoadAfter = true;
                    this.savedTimeRange[1] = range.end;
                }else

                if(interval !== this.savedInterval){
                    reload = true;
                    this.savedInterval = interval;
                }
            }


            // scrolling in
 

            if(reload === false){
                return new Promise((resolve, reject) => {
                    resolve(this.savedResult)
                })
            }else{
                // var savedResult = [];
                // if(newLoadBefore === true && newLoadAfter === false){ // only get data before
                //     savedResult = this.storedResult;
                //     // range.end = savedResult[0].timestamp
                // }else if(newLoadBefore === false && newLoadAfter === true){ // only get data after

                // }
                return new Promise((resolve, reject) => {
                    axios.post(url,
                    {
                        "start" : range.start,
                        "end" : range.end,
                        "devices" : ids,
                        "fields" : fields
                    })
                    .then(res => {
                        //console.log(res);
                        let result = [];
                        Object.keys(res.data).forEach(key => {
                            res.data[key].id = key;
                            result.push(res.data[key]);
                            // console.log(res.data[key])
                        });
                        this.savedResult=result;
                        this.savedTimeRange[0] = range.start;
                        this.savedTimeRange[1] = range.end;
                        this.savedInterval = interval;
                        this.graphLoadHelper.loadInData(result, this.savedTimeRange, this.savedInterval);
                        resolve(result)
                    });
                });
            }
        };

        this.compareTimeStamps = ( interval, timestamp ) => {

        }
    }

    

}
 