import axios from 'axios';
import moment from 'moment';

export class DataServiceV2{
    constructor(baseUrl){
        this.baseUrl = baseUrl;

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
            console.log('url', url, "ids", ids, "deviceType", deviceType, "interval",interval) 
            return new Promise((resolve, reject) => {
                axios.post(url,
                {
                    "start" : range.start,
                    "end" : range.end,
                    "devices" : ids
                })
                .then(res => {
                    //console.log(res);
                    let result = [];
                    Object.keys(res.data).forEach(key => {
                        res.data[key].id = key;
                        result.push(res.data[key]);
                    });
                    resolve(result)
                });
            });
        };
    }

    

}
 