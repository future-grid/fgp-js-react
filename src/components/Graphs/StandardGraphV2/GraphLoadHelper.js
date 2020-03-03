import moment from  'moment';
import axios from 'axios';

const MAX_BYTE_SIZE = 5000000; // maximum bite size we can store in a browser chunk
const LOCAL_STORAGE_KEY = 'fgp_graph_store_'
const LOCAL_STORAGE_KEY_PS = 'fgp_graph_store_ps_'

// each device line is roughly 30kb for one field for one day, we do not want to allow too much caching as this may kill the users browser, 
// all cache will be killed on window close as to free up resources for subsequent pages 

// the graph load helper will allow for up to 5 partitions to be kept at one time on one page for each graph, by this calculation at most it will hold
// MAX     -  1 (graph) * 6 (max on one page) * 5 (partition limit) * 5000000 (bytes allowed in a chunk) =  150000000 bytes = 150mb in cache (browser storage)
// TYPICAL -  1 (graph) * 3 (typical qty) * 1 (single partition) * 5000000 = 15mb


export default class GraphLoadHelper {
    constructor(initialTimeRange, config, id){
        this.MAX_BYTE_SIZE = MAX_BYTE_SIZE; // this is the maximum size for the lowest spec browser for the byte size for a local storage item.
        this.LOCAL_STORAGE_KEY = LOCAL_STORAGE_KEY + id; // key which will be a combination of the device and this prefix
        this.LOCAL_STORAGE_KEY_PS = LOCAL_STORAGE_KEY_PS + id; // count of stores of the same key 
        console.log(
            "GraphLoadHelper Log > \n " +
            "> config ", config,
            "> id ", id,
            "> initWindow ", initialTimeRange
        );
    }

    checkStorageKey(){
        let exists;
        sessionStorage.getItem(this.LOCAL_STORAGE_KEY) ? exists = true : exists = false;
        return exists;
    }

    checkData(){
        if(`${sessionStorage.getItem(this.LOCAL_STORAGE_KEY_PS)}_0`){
            return true;
        }else{
            return false;
        }
    }





    loadInData(result, timeRange, interval){
        console.log("Graph Load Help log > \n",
        "> Result : ", result,
        "> Time Range : ", timeRange,
        "> Interval : ", interval
        );
        // first check to see if any of our saved storage data's have any timestamps in the range given

        // if there is data in the time range specified, check the interval

        // if the intervals are the same, then we need to piece together the data

        // save the data into session storage in a serialized JSON format and send a TRUE flag back to the graph to continue.

        // Keep track of the storage partitkion keys to ensure that we have not overloaded our buffer
    }

    // takes an interval from oa graph config and checks the storage to see if we havge data assigned to it already
    verifyInteral(intervalType){

    }

    //stitch data together by timestamp
    stitchData(){

    }



    // breaks the data into json packets which are suitable for the max size of a local storage item
    setStorageItems(data){
        let stringifiedData = JSON.stringify(data); 
        if(new Blob([stringifiedData]).size < this.MAX_BYTE_SIZE){
            // clear
            sessionStorage.removeItem(this.LOCAL_STORAGE_KEY_PS+'_0')
            // setting partition size
            sessionStorage.setItem(this.LOCAL_STORAGE_KEY_PS, 1)
        }else{
            // clear
            sessionStorage.removeItem(this.LOCAL_STORAGE_KEY_PS+'_0')
            sessionStorage.removeItem(this.LOCAL_STORAGE_KEY_PS+'_1')
            sessionStorage.removeItem(this.LOCAL_STORAGE_KEY_PS+'_2')
            sessionStorage.removeItem(this.LOCAL_STORAGE_KEY_PS+'_3')
            sessionStorage.removeItem(this.LOCAL_STORAGE_KEY_PS+'_4')
            // if the size of the object is too big, we need to break it up
            // create partitions
            let partitions = Math.ceil(new Blob([stringifiedData]).size/this.MAX_BYTE_SIZE);
            let partitionSize = Math.ceil(data.length / partitions);
            var partitionedArrays = [];
            for(var i = 0; i < partitions; i++){
                partitionedArrays.push([...data].splice( (i*partitionSize), partitionSize))
                sessionStorage.setItem(
                    this.LOCAL_STORAGE_KEY_PS+"_"+i, //the key
                    JSON.stringify([...data].splice( (i*partitionSize), partitionSize))
                );
            }  
            sessionStorage.setItem(this.LOCAL_STORAGE_KEY_PS, partitions)
        }
    }

    fetchDataFromLs(){
        let partitionCount = `${sessionStorage.getItem(this.LOCAL_STORAGE_KEY_PS)}`;
        let data = [];
        // sticking together the array from storage based on partition size  and returning
        for (let x = 0; x < partitionCount; x++) {
            let temp = JSON.parse(sessionStorage.getItem(this.LOCAL_STORAGE_KEY_PS+'_'+x));
            data = data.concat(temp)
        }
        return data;
    }

    setStorageKey(){
        sessionStorage.setItem(this.LOCAL_STORAGE_KEY, true);
    }

    setTimestamp(){
        sessionStorage.setItem(this.LOCAL_STORAGE_KEY_TS, moment().valueOf())
    }
}