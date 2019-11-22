import React, { Component } from 'react';
import './fgpReact-Page.css';
import axios from "axios";
import {Navigation} from '../Navigation/Navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// a simple container
export class DevicePage extends Component {
  constructor(props){
    super(props);
    this.state = {
      deviceName : this.props.deviceNameOverride ? this.props.deviceNameOverride : window.location.pathname.split('/')[2],
      deviceNameAsMeterLookup : this.props.deviceNameAsMeterLookup ? this.props.deviceNameAsMeterLookup : false,
      deviceType : this.props.deviceType,
      childDeviceNames : [],

      isBefore1910 : this.props.isBefore1910 ? this.props.isBefore1910 : false,

      mapType: this.props.mapType ? this.props.mapType : "none",
      mapProjection: this.props.mapProjection ? this.props.mapProjection : "EPSG:4326",
      mapParentColors: this.props.mapParentColors ? this.props.mapParentColors : {fillColor: "pink", borderColor : "red"},
      mapChildrenColors: this.props.mapChildrenColors ? this.props.mapChildrenColors : [{fillColor: "lightblue", borderColor : "blue"}, {fillColor: "lightyellow", borderColor : "yellow"}, {fillColor: "lightgreen", borderColor : "green"}, {fillColor: "lightslategray", borderColor : "purple"}, {fillColor: "lightsalmon", borderColor : "orange"}],

      breadCrumbPath: this.props.breadCrumbPath ? this.props.breadCrumbPath : null,
      hasBreadCrumbs: this.props.hasBreadCrumbs && this.props.breadCrumbPath ? this.props.hasBreadCrumbs : false,
      breadCrumbDeviceTypes: this.props.breadCrumbDeviceTypes,
      breadCrumbDeviceImages: this.props.breadCrumbDeviceImages,
      breadCrumbDeviceUrlPaths: this.props.breadCrumbDeviceUrlPaths,


      lookupKey : this.props.lookupKey ? this.props.lookupKey : "name",

      showWidget : this.props.showWidget ? this.props.showWidget : "show",
      
      baseUrl: this.props.baseUrl,
      deviceTypeTitleCasing : this.props.deviceTypeTitleCasing ? this.props.deviceTypeTitleCasing : "none",

      relationParentNames: this.props.relationParentNames ? this.props.relationParentNames : [],
      relationChildNames: this.props.relationChildNames ? this.props.relationChildNames : [],
      childrenWithLocationAndStyles: this.props.childrenWithLocationAndStyles ?  this.props.childrenWithLocationAndStyles : [],
      childrenWithLocationAndStylesLoaded : this.props.childrenWithLocationAndStyles ? true :  false,

      relations: {parents:[], children:[]},
      hasDeviceRelationsLoaded : false,

      extensionNames : this.props.extensionNames,
      extensions: null,
      hasDeviceExtensionLoaded : false,

      fauxNavItems : this.props.isLoadingNavItems ? 
        this.props.isLoadingNavItems :
        [
          {      
            key:"home01",
            linkTo:"/",
            fontAwesomeIcon:"home",
            fontAwesomeLib:"fa",
            description: "Home"
          }
        ] ,
      fauxNavLogo : this.props.isLoadingNavLogo,
      fauxNavTitle : this.props.isLoadingNavTitle,
      hasAllLoaded: false
    };
    this.fetchExtensions = this.fetchExtensions.bind(this);
    this.fetchRelations = this.fetchRelations.bind(this);
    this.getDeviceNameAsMeterLookup = this.getDeviceNameAsMeterLookup.bind(this);
    this.allResolved = this.allResolved.bind(this);
  }

  componentDidMount(){
    if(this.state.deviceNameAsMeterLookup){
      this.getDeviceNameAsMeterLookup();
    }
    if(this.props.extensionNames){
      this.fetchExtensions()
    }else{
      this.setState({
        extensions : {},
        hasDeviceExtensionLoaded : true
      });
    }
    if(this.props.relationChildNames){
      this.fetchRelations();
    }else{
      this.setState({
        childrenWithLocationAndStylesLoaded : true,
        childrenWithLocationAndStyles : this.props.childrenWithLocationAndStyles ? this.props.childrenWithLocationAndStyles : [],
        hasDeviceRelationsLoaded : true
      });
    }
  }

  componentDidUpdate(){
    // this.allResolved();  
  }

  getDeviceNameAsMeterLookup(){
    axios.get(
      `${this.state.baseUrl}${this.state.deviceType}/${this.state.lookupKey}/${this.state.deviceName}`
    ).then(resp => {
      this.setState({
        deviceNameAsMeterLookup : resp.data.description
      })
    })
  }

  allResolved(){
    if(this.state.hasDeviceExtensionLoaded === true){
      this.setState({
        hasAllLoaded : true
      });
    }
  }

  fetchExtensions(){
    
    axios.post(`${this.state.baseUrl}${this.state.deviceType}/${this.state.lookupKey}/${this.state.deviceName}`,{
      "extensions" : this.state.extensionNames
    }).then( response => {
      this.setState({
        extensions: response.data,
        hasDeviceExtensionLoaded: true
      })
    }).catch( err => {
      console.log("Here is your error, Dev -_-`", err)
    }) 
  }


  fetchRelations(){
    let relationObj = {...this.state.relations};
    this.state.relationParentNames.forEach( relation =>{
      axios.get(`${this.state.baseUrl}${this.state.deviceType}/${this.state.deviceName}/relation/${relation}?isParent=true`    
      ).then( response => {
        response.data["relationName"] = relation
        relationObj.parents.push(response.data);
      }).catch(err => {
        console.log("Here is your error, Dev -_-`", err)
      })
    });

    for(var x = 0; x < this.state.relationChildNames.length; x++){
      let iteratorZ = 0;
      axios.get(`${this.state.baseUrl}${this.state.deviceType}/${this.state.deviceName}/relation/${this.state.relationChildNames[x]}`    
      ).then( response => {
        response.data["relationName"] = this.state.relationChildNames[iteratorZ]
        if(response.data.length > 0){
          let childType = response.data[0].type;
          relationObj.children.push(response.data);
          let deviceNames = [];
          response.data.forEach( child => {
            deviceNames.push(child.name);
          })
          let tmpChildDeviceNames = [...this.state.childDeviceNames]
          tmpChildDeviceNames.push({type:childType, deviceNames: deviceNames})
          this.setState({
            childDeviceNames : tmpChildDeviceNames
          })

          if(this.state.isBefore1910 === true){
            axios.post(
              `${this.state.baseUrl}${childType}/location`,
              {
                "devices" : deviceNames,
                "timestamp" : new Date().getTime()
              }
            ).then(response =>{
              let copyOfChildren = [...this.state.childrenWithLocationAndStyles]
              let childArr = [];
              response.data.forEach( child => {
                if(child === null ){
  
                }else{
                  var temp = {
                    lat: child["lat"] ? child.lat : null,
                    lng: child["lng"] ? child.lng : null,
                    name : child.deviceName              
                  };
                  childArr.push(temp)
                }
              })
             
              copyOfChildren.push({
                deviceType : childType, 
                children : childArr, 
                style: this.state.mapChildrenColors[iteratorZ]})
              this.setState({
                childrenWithLocationAndStyles: copyOfChildren
              })
              iteratorZ ++;
              if(iteratorZ === this.state.relationChildNames.length){
                this.setState({
                  childrenWithLocationAndStylesLoaded : true
                })
              }
            }).catch(err => {
              console.log("Here is your error, Dev -_-` circa copy children loop pre 1910", err)
            })
          }else{  
            axios.post(
              `${this.state.baseUrl}${childType}`,
              {
                "devices" : deviceNames,
                "extensions" : ["location"],
                "timestamp" : new Date().getTime()
              }
            ).then(response =>{
              console.log(response)
              let childArr = [];
              response.data.forEach( child => {
                if(child === null || !child["location"] === true){
  
                }else{
                  var temp = {
                    lat: child.location["lat"] ? child.location.lat : child.location["latitude"] ? child.location.latitude: null,
                    lng: child.location["lng"] ? child.location.lng : child.location["longitude"] ? child.location.longitude: null,
                    name : child.device.name
                  }                    
                  console.log("Temp => ", temp)
                  childArr.push(temp)
                }
              })
              let copyOfChildren = [...this.state.childrenWithLocationAndStyles]
              copyOfChildren.push({
                deviceType : childType, 
                children : childArr, 
                style: this.state.mapChildrenColors[iteratorZ]})
              this.setState({
                childrenWithLocationAndStyles: copyOfChildren
              })
              iteratorZ ++;
              if(iteratorZ === this.state.relationChildNames.length){
                this.setState({
                  childrenWithLocationAndStylesLoaded : true
                })
              }
            }).catch(err => {
              console.log("Here is your error, Dev -_-`", err)
            }) 
          }
        }else{
          console.log('we out baby')
          this.setState({
            childrenWithLocationAndStylesLoaded : true
          });
        }
        console.log("Here is your relations, Dev -_-`", response.data)
      }).catch(err => {
        console.log("Here is your error, Dev -_-`", err)
      })
    }
    
    this.setState({
      relations : relationObj,
      hasDeviceRelationsLoaded : true
    })
  }

  render() {
    const childrenWithProps = React.Children.map(this.props.children, child =>{
      // passing props through to children by cloning the element if the `dataLink` attribute is set to true 
      if(child.props["dataLink"] === true){
        return( React.cloneElement(child, {
          isDataLinked: true,
          isBefore1910 : this.state.isBefore1910,
          isFluid : this.props.isFluid,
          isOpen : this.props.isOpen,
          deviceName: this.state.deviceName,
          deviceType:  this.state.deviceType,
          mapType:  this.state.mapType,
          mapProjection : this.state.mapProjection,
          mapParentColors : this.state.mapParentColors,
          mapChildrenColors : this.state.mapChildrenColors,
          deviceTypeTitleCasing : this.state.deviceTypeTitleCasing,
          hasBreadCrumbs: this.state.hasBreadCrumbs,
          breadCrumbPath: this.state.breadCrumbPath,
          breadCrumbDeviceTypes: this.state.breadCrumbDeviceTypes,
          breadCrumbDeviceImages: this.state.breadCrumbDeviceImages,
          breadCrumbDeviceUrlPaths: this.state.breadCrumbDeviceUrlPaths,
          showWidget : this.state.showWidget,
          baseUrl:  this.state.baseUrl,
          relationParentNames:  this.state.relationParentNames,
          relationChildNames:  this.state.relationChildNames,
          relations:  this.state.relations,
          childrenWithLocationAndStyles: this.state.childrenWithLocationAndStyles,
          childrenWithLocationAndStylesLoaded: this.state.childrenWithLocationAndStylesLoaded,
          extensionNames:  this.state.extensionNames,
          extensions:  this.state.extensions,
          childDeviceNames: this.state.childDeviceNames,
          lookupKey : this.state.lookupKey,
          deviceNameAsMeterLookup : this.state.deviceNameAsMeterLookup,
          mapInteractions : this.props.mapInteractions ? this.props.mapInteractions : []
        }))
      }else{
        return child
      }
    })
    return (
      <div className={(this.props.noFgHome === true ? " ": " fgReact_home ") + (this.props.isOpen === true ? " fgReact_home-ext " : "  ")}>      
        { 
          this.state.hasDeviceExtensionLoaded === true && 
          this.state.hasDeviceRelationsLoaded === true &&
          this.state.childrenWithLocationAndStylesLoaded === true ? (
            // Rendering children with passed through props after extensions are loaded
            <div className="col-12">
              {childrenWithProps}
            </div>            
          ) : 
            // loads a false navigation to simulate a working page 
            <div>
              <Navigation 
                handler={this.props.handler}
                topNavTitle={this.state.fauxNavTitle}
                sideNavLogo={this.state.fauxNavLogo}
                currentPage={""}
                isOpen={false}
                items={this.state.fauxNavItems}
              />
              <FontAwesomeIcon className="centerSpinner fa-spin" icon={["fas", "spinner"]}/>
            </div>
        }
      </div>
    )
  }
}

export default DevicePage
