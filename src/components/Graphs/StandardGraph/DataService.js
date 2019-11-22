import axios from "axios"
export default class DataService {
    constructor(deviceType, baseUrl, backUpInterval, backupFields, backupEntities, version){
        this.deviceType = deviceType;
        this.baseUrl = baseUrl;
        this.backUpInterval = backUpInterval ? backUpInterval : null;
        this.backupFields = backupFields ? backupFields : null;
        this.backupEntities = backupEntities ? backupEntities : null;
        this.version = version ? version : null ;
    };

    fetchFirstNLast(ids, interval, fields) {
        if(ids[0] === undefined || ids[0] === null){
            ids = this.backupEntities;
        }else{
            this.backupEntities = ids
        }
        if(interval){
            this.backUpInterval = interval
        }else{
            this.backUpInterval = interval
        }
        if(fields[0]){
            this.backupFields = fields
        }else{
            fields = this.backupFields
        }
        console.log("DATA SERVICE LOGGING : Fetch First N Last > ")
        console.log("IDS => ", ids)
        console.log("INTERVAL => ", interval)
        console.log("FIELDS => ", fields)
        return new Promise((resolve, reject) => {
            axios.get(`${this.baseUrl}${this.deviceType}/${interval}/${ids[0]}/first-last`)
            .then(res => { 
                //console.log(res.data);
                res.id = ids[0];
                resolve([res]) 
                console.log("DATA SERVICE LOGGING : Fetch First N Last < ")
            });
        });
        // console.log(fields);
         
    };
    fetchdata (ids, interval, range, fields) {
        if(ids[0] === undefined || ids[0] === null){
            ids = this.backupEntities;
        }else{
            this.backupEntities = ids
        }
        if(interval){
            this.backUpInterval = interval
        }else{
            this.backUpInterval = interval
        }
        if(fields[0]){
            this.backupFields = fields
        }else{
            fields = this.backupFields
        }
        console.log("DATA SERVICE LOGGING : Fetch Data > ")
        console.log("IDS => ", ids)
        console.log("INTERVAL => ", interval)
        console.log("FIELDS => ", fields)
        console.log("RANGE => ", range)

        if(this.version === "wel"){
            return new Promise((resolve, reject) => {
                axios.post(`${this.baseUrl}${this.deviceType}/${interval}`,
                {
                    "start" : parseInt(range.start),
                    "end" : parseInt(range.end),
                    "devices": [ids[0]],
                    "fields": fields
                },
                {headers: {
                    'Content-Type': 'application/json',
                }})
                .then(res => { 
                    //console.log(res);
                    res = res.data[ids[0]];
                    res.id = ids[0];
                    resolve([res]) 
                    console.log("DATA SERVICE LOGGING : Fetch Data < (wel) ")
                });
            });
        }else{
            return new Promise((resolve, reject) => {
                axios.post(`${this.baseUrl}${this.deviceType}/${interval}`,
               {
                    "start" : parseInt(range.start),
                    "end" : parseInt(range.end),
                    "devices": [ids[0]]
                },
                {headers: {
                    'Content-Type': 'application/json',
                }})
                .then(res => { 
                    //console.log(res);
                    res = res.data[ids[0]];
                    res.id = ids[0];
                    resolve([res]) 
                    console.log("DATA SERVICE LOGGING : Fetch Data < ")
                }). catch( res => {
    
                });
            });
            
        }
    }
}
