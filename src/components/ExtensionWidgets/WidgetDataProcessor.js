// Asset data processor for ThingsAt / FGP React Library
export default class WidgetDataProcessor {
  // iterates over the mutable columns in the JSON config and will return the thing to mutate them with, will otherwise just return 'plain'
  constructor(deviceConfig){
    this.deviceConfig = deviceConfig
    
  }
  
  getFormat(key) {
    for(let i=0; i<this.deviceConfig.mutatedColumns.length; i++){
      if(key === this.deviceConfig.mutatedColumns[i].key) {
        return this.deviceConfig.mutatedColumns[i].style;
      }
    }
    
    return 'plain';
  }

  // iterates over the redirectable columns in the JSON config and will return its given redirect.
  // also replaces all asterisks with the given value (for things like employeeID or whatever)
  getRedirect(key, value) {
    for(let i=0; i<this.deviceConfig.redirectColumns.length; i++){
      if(key === this.deviceConfig.redirectColumns[i].key) {
        return this.deviceConfig.redirectColumns[i].redirectTo.replace("*", value);
      }
    }
    return null; // there is no redirect given.
  }

  // converts a camelCased string into seperate words with capitals
  wordConvert(given) {
    let temp = given.split(/(?=[A-Z])/); // split word at capitals
    temp[0] = this.capitalise(temp[0]);
    temp.map(word => this.capitalise(word));
      
    return temp.join(" "); // return completed string
  }

  capitalise(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  // will return an array of pairs with titles and data for display. will remove any columns mentioned in this.deviceConfig.json
  // group all of the data from the API call into one neat little bundle thing
  cleanData (data) {
    // new array for where the cleanedData will be stored
    let cleanedData = new Array();

    // iterate over each category
    data.map(category => {
    // for each key value pair in the category
    for(let [key, value] of Object.entries(category.data)) {
        // if it is not in the blacklist defined in the JSON
        if(!this.deviceConfig.excludedColumns.includes(key)){
        // add it to the list of data with some prettifying
        // console.log(`${key}, ${value}, ${this.getFormat(key)}, ${this.getRedirect(key, value)}`);
        cleanedData.push({
            title : key,
            data : value,
            style : this.getFormat(key),
            key : Date.now() + Math.random(), // key to make React happier :)
            redirect : this.getRedirect(key, value),
            extension: category.relationship
        });
        }
    }
    });

    return this.cleanRelationshipData(cleanedData);
  }

  // excludes, mutates, redirects, renames data by specific category and key, rather than just key (handled by cleanData)
  cleanRelationshipData (data) {
    // new array for where the cleaned data will be stored
    let cleanedData = this.relationshipExclude(data);
    // iterates over the list of excluded data
    cleanedData = cleanedData.map(point => {
      let newpoint = new Object();
      Object.assign(point, newpoint); // copy data over instead of reference, makes JSON configs possible.
      // passes relevant values through functions configured by the JSON file
      newpoint.title = this.relationshipRename(point);
      newpoint.style = this.relationshipFormat(point);
      newpoint.redirect = this.relationshipRedirect(point);
      newpoint.data = point.data;
      newpoint.extension = point.extension;
      newpoint.key = point.key;

      return newpoint;
    });

    return cleanedData;
  }

  // removes data from the given list if its extension and key match exclusions in the JSON
  relationshipExclude (data) {
    let excludedData = new Array();
    // iterates over the data given
    data.map(point => {
      let excluded = false;
      
      // iterates over the list of excluded extension/key pairs
      for (let i=0; i<this.deviceConfig.relation_excludedColumns.length; i++) {
        // if the given point does not match both the given extension AND key
        if((this.deviceConfig.relation_excludedColumns[i].extension === point.extension
          && this.deviceConfig.relation_excludedColumns[i].key === point.title)) {
            // push to the array
           excluded = true;
        }
      }

      if (!excluded) { excludedData.push(point) }; // if not excluded, then add it to the array
    });

    return excludedData;
  }

  // mutates the title of the data if configured by the JSON
  relationshipRename(point) {
    // iterates over the list of renaming extension/key pairs
    for(let i=0; i<this.deviceConfig.relation_renameColumns.length; i++) {
      if((this.deviceConfig.relation_renameColumns[i].extension === point.extension
        && this.deviceConfig.relation_renameColumns[i].key === point.title)) {
          return this.deviceConfig.relation_renameColumns[i].desiredKey; // change the title to the desired one
      }
    }

    return this.wordConvert(point.title);
  }

  // mutates the style of the data if configured by the JSON
  relationshipFormat(point) {
    //
    for(let i=0; i<this.deviceConfig.relation_mutatedColumns.length; i++) {
      if((this.deviceConfig.relation_mutatedColumns[i].extension === point.extension
        && this.deviceConfig.relation_mutatedColumns[i].key === point.title)) {
          return this.deviceConfig.relation_mutatedColumns[i].style; // change the title to the desired one
      }
    }

    return point.style;
  }

  // mutates the redirect of the data if configured by the JSON
  relationshipRedirect(point) {
    //
    for(let i=0; i<this.deviceConfig.relation_redirectColumns.length; i++) {
      if((this.deviceConfig.relation_redirectColumns[i].extension === point.extension
        && this.deviceConfig.relation_redirectColumns[i].key === point.title)) {
          let newredirect = this.deviceConfig.relation_redirectColumns[i].redirect;
          newredirect = newredirect.replace("*", point.data);
          return newredirect;
      }
    }

    return point.redirect;
  }
}

