import React, { Component } from 'react'
import './Breadcrumbs.css'
import {Breadcrumb} from './Breadcrumb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";

export class Breadcrumbs extends Component {
    constructor(props){
        super(props);
        this.state = {
            hierarchyPath: this.props.breadCrumbPath ,
            hierarchyDeviceTypes : this.props.breadCrumbDeviceTypes,
            hierarchyDeviceTypeImages : this.props.breadCrumbDeviceImages,
            hierarchyDeviceTypeUrlPaths : this.props.breadCrumbDeviceUrlPaths,

            deviceName: this.props.deviceName,
            deviceType: this.props.deviceType,
            finalCrumbs :[],
            relationsArray : [],
            baseUrl: this.props.baseUrl,
            crumbsLoaded : false,
            allCrumbsLoaded :false,

            breadCrumbTimeout : false,
            breadCrumbHide : false
        };        
        this.formRelations = this.formRelations.bind(this);
        this.buildBreadcrumbData = this.buildBreadcrumbData.bind(this);
    }

    componentDidMount(){
        this.formRelations();
    }

    formRelations(){
        
        let wholeTree = [...this.state.hierarchyPath.split("->")];
        let wholeTreeDeviceTypes = [...this.state.hierarchyDeviceTypes]
        let wholeTreeDeviceTypeImages = [...this.state.hierarchyDeviceTypeImages]
        let wholeTreeDeviceTypeUrlPaths = [...this.state.hierarchyDeviceTypeUrlPaths]

        let mainBranch = [];
        let segmentedBranches = [];
        
        for(var x = 0; x < wholeTree.length-1; x++){
            if(wholeTree[x+1].split("|").length === 2){ // has a divider
                mainBranch.push({
                    relation : `${wholeTree[x]}_${wholeTree[x+1].split("|")[0]}`,
                    deviceType: `${wholeTreeDeviceTypes[x]}`,
                    img: wholeTreeDeviceTypeImages[x+1],
                    urlPath: wholeTreeDeviceTypeUrlPaths[x+1],
                    isSplitBranch: true
                })
                // removing from whole tree
                wholeTree.splice(x+1,1);
                wholeTreeDeviceTypes.splice(x+1,1);
                wholeTreeDeviceTypeImages.splice(x+1,1);
                wholeTreeDeviceTypeUrlPaths.splice(x+1,1);
                // wholeTreeDeviceTypes.splice(x+1,1);
                x--; //setting back position
            }else{
                mainBranch.push({
                    relation:`${wholeTree[x]}_${wholeTree[x+1]}`,
                    deviceType: `${wholeTreeDeviceTypes[x]}`,
                    img: wholeTreeDeviceTypeImages[x+1],
                    urlPath: wholeTreeDeviceTypeUrlPaths[x+1],
                    isSplitBranch: false
                })
            }
        }

        this.setState({ relationTree: mainBranch }, () => {
            this.buildBreadcrumbData()
          }); 
    }

    async buildBreadcrumbData(){
        let deviceName = this.state.deviceName;
        let deviceType = this.state.deviceType;
        let formedRelations =  [...this.state.relationTree];
        let breadcrumbs = []
        
        for(var x = 0;  x < formedRelations.length; x++){
            await axios.get(`${this.state.baseUrl}${formedRelations[x].deviceType}/${deviceName}/relation/${formedRelations[x].relation}?isParent=true`    
            ).then( response => {
                response.data["relationName"] = `${formedRelations[x].relation}`;
                formedRelations[x].isSplitBranch === false ? deviceName = response.data.name : null;
                breadcrumbs.push(
                    {
                       redirect: formedRelations[x].urlPath,
                       img: formedRelations[x].img,
                       deviceName: response.data.name,
                       deviceType: response.data.type,
                       key: `${response.data.name}_ki`
                    }
                )
                this.setState({
                    crumbsLoaded : true,
                    finalCrumbs : breadcrumbs
                });
            }).catch(err => {
                console.log("Here is your error, Dev -_-`", err)
            })
        }
        this.setState({
            allCrumbsLoaded : true 
        });
    }

    render() {
        window.setTimeout(()=>{
            if(this.state.crumbsLoaded === false){
                this.setState({
                    breadCrumbTimeout: true
                })
            }
            window.clearTimeout()
        },10000)
        // window.setTimeout(()=>{
        //     if(this.state.crumbsLoaded === false && this.state.breadCrumbTimeout === true){
        //         // this.setState({
        //         //     breadCrumbHide: true
        //         // })
        //     }
        //     window.clearTimeout()
        // },15000)
        return (
            <div className={(this.state.crumbsLoaded === true ? "text-left "  : "text-center ") + " breadcrumbs " + (this.props.isFluid === true ? " container-fluid " : " container ") + (this.state.breadCrumbHide === true ? " d-none " : "  ")}>
            {
                this.state.crumbsLoaded === true ? 
                    <ul className={"breadcrumb"}>
                        {
                            this.state.finalCrumbs.map( crumb => {
                                return (
                                    <Breadcrumb
                                        key={crumb.key}
                                        keyL={crumb.key}
                                        deviceName={crumb.deviceName}
                                        img={crumb.img}
                                        deviceType={crumb.deviceType}
                                        redirect={crumb.redirect}
                                        allCrumbsLoaded={this.state.allCrumbsLoaded}
                                    />
                                )
                            })  
                        }
                    </ul> 
                    : this.state.breadCrumbTimeout === false ? (
                        <FontAwesomeIcon className="centerSpinner fa-spin" icon={["fas", "spinner"]}/>
                    ) : (
                        "Parent relation hierarchy not found"
                    )

                    
            }
            </div>
        )
    }
}

export default Breadcrumbs
