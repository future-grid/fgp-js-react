import axios from 'axios';
import moment from 'moment';
import graphLoadHelper from './GraphLoadHelper';

export class DataServiceV3{
    constructor(baseUrl, initialTimeWindow, config){
        console.log("ARGGGGGGs>>\n",arguments)
        this.baseUrl = baseUrl;
        this.loadedTimeRange = initialTimeWindow;
        this.storedResult = [];
        
        // this.timeCache = graphLoadHelper

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
            console.log("FETCH DATA ARGS >>>", arguments) 
            console.log(ids, deviceType, interval, range, fields)

            // if we request data before the start of the init range
            if( range.start < this.loadedTimeRange[0] ){
                reload = true;
                newLoadBefore = true;
            }

            if(range.end > this.loadedTimeRange[1]){
                reload = true;
                newLoadAfter = true;
            }

            // scrolling in
            if(range.start > this.loadedTimeRange[0] && range.end < this.loadedTimeRange[1]){
                reload = false
            }

            if(reload === false){
                return new Promise((resolve, reject) => {
                    resolve(this.storedResult)
                })
            }else{
                var savedResult = [];
                if(newLoadBefore === true && newLoadAfter === false){ // only get data before
                    savedResult = this.storedResult;
                    // range.end = savedResult[0].timestamp
                }else if(newLoadBefore === false && newLoadAfter === true){ // only get data after

                }
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
                            console.log(res.data[key])
                        });
                        this.storedResult=result;
                        resolve(result)
                    });
                });
            }
        };

        this.compareTimeStamps = ( interval, timestamp ) => {

        }
    }

    

}
 