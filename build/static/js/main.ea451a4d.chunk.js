(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{13:function(e){e.exports={baseUrl:"http://thingat-api.thingsat.10.1.14.69.xip.io/thingsat/",assetToEmp:"/relation/asset_employee?isParent=true",assetStatus:"/asset_status/?timestamp=",computerExt:"/computer_ext/?timestamp=",empToAsset:"/relation/asset_employee?isParent=false",multiAssetExtension:"asset/asset_ext",multiEmpExtension:"employee/employee_ext",empExtension:"/employee_ext",assetEvent:"asset/asset_event/",buExt:"business_unit/name/",buToAsset:"/relation/asset_business_unit",buToEmp:"/relation/employee_business_unit"}},23:function(e){e.exports={sideNavLogoPath:"fgp-logo.png",topNavTitle:"Compass",loginTitle:"Compass Login"}},40:function(e,t,a){},42:function(e,t,a){e.exports=a.p+"static/media/nav-leaf.eba8e0b7.svg"},46:function(e){e.exports={columns:[{accessor:"serialNumber",Header:"Serial Number",minWidth:210,fgpRedirect:"/Asset/"},{accessor:"employeeId",Header:"Employee ID",minWidth:180},{accessor:"businessUnit",Header:"Business Unit",minWidth:120},{accessor:"orgUnit",Header:"Organisation Unit",minWidth:240},{accessor:"division",Header:"Division",minWidth:180}],searchingColumns:[{column:"serialNumber",label:"SERIAL NUMBER"},{column:"employeeId",label:"EMPLOYEE ID"},{column:"businessUnit",label:"BUSINESS UNIT"},{column:"orgUnit",label:"ORGANISATION UNIT"},{column:"division",label:"DIVISION"}],searchingTypes:[{key:"==*?*",label:"Include"},{key:'=="*?*"',label:"Like"},{key:"<?",label:"Less Than"},{key:">?",label:"Greater Than"},{key:"<=?",label:"Less Than or Equal To"},{key:">=?",label:"Greater Than or Equal To"},{key:'!="?"',label:"Not Equal To"},{key:'=="?"',label:"Equal To"},{key:"=isnull=true",label:"Is Null"},{key:"=isnull=false",label:"Not Null"}],locationColumns:["icpLat","icpLng"],customer:"serial_number",reference:"asset_reference",defaultQtyRecordsToRetrieve:125,defaultStartFrom:0,hz:!1,map:{centre:[-37.569041,175.148775]}}},49:function(e,t,a){e.exports=a(97)},54:function(e,t,a){},55:function(e,t,a){},64:function(e,t,a){},65:function(e,t,a){},66:function(e,t,a){},67:function(e,t,a){},68:function(e,t,a){},69:function(e,t,a){},72:function(e,t,a){},73:function(e,t,a){},8:function(e){e.exports={excludedColumns:["lastLogon","type"],mutatedColumns:[{key:"legacyCost",style:"currency"},{key:"lastLogon",style:"datetime"},{key:"lastLogonAsDate",style:"datetime"},{key:"lastChange",style:"datetime"},{key:"lastChangeAsDate",style:"datetime"},{key:"timestamp",style:"datetime"}],redirectColumns:[{key:"name",redirectTo:"/Asset/*"},{key:"department",redirectTo:"/super/*/test"}],relation_excludedColumns:[{extension:"assetInfo",key:"name"},{extension:"assetInfo",key:"timestamp"},{extension:"assetExtension",key:"name"}],relation_mutatedColumns:[{extension:"assetExtension",key:"daasCostPrimitive",style:"currency"},{extension:"assetExtension",key:"daasCost",style:"currency"}],relation_redirectColumns:[{extension:"employeeAssigned",key:"name",redirect:"/Employee/*"}],relation_renameColumns:[{extension:"employeeAssigned",key:"name",desiredKey:"Employee ID"}]}},90:function(e,t,a){},94:function(e,t,a){},95:function(e,t,a){},97:function(e,t,a){"use strict";a.r(t);var n=a(0),s=a.n(n),i=a(41),r=a.n(i),o=(a(54),a(3)),c=a(4),l=a(6),p=a(5),u=a(7),h=a(42),m=a.n(h),d=(a(55),function(e){function t(){return Object(o.a)(this,t),Object(l.a)(this,Object(p.a)(t).apply(this,arguments))}return Object(u.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return s.a.createElement("footer",{className:"fgReact_floatingfooter"},s.a.createElement("a",{href:"http://www.future-grid.com/"},s.a.createElement("img",{alt:"go to future grid website",href:"",src:m.a}),"2019 \xa9 Future-Grid"))}}]),t}(n.Component)),g=a(21),f=a(22),y=a(43),v=new(function(){function e(){Object(o.a)(this,e),this.authenticated=localStorage.getItem("fgpReact_authoken")}return Object(c.a)(e,[{key:"login",value:function(e,t){"admin"===e.user&&"password"===e.pass&&(localStorage.setItem("fgpReact_authoken","true"),this.authenticated="true",t())}},{key:"logout",value:function(e){localStorage.setItem("fgpReact_authoken","false"),this.authenticated="false",e()}},{key:"isAuthenticated",value:function(){var e=localStorage.getItem("fgpReact_authoken");return"true"===e?this.authenticated:"false"===e?this.authenticated:(localStorage.setItem("fgpReact_authoken","false"),this.authenticated)}}]),e}()),b=function(e){var t=e.component,a=Object(y.a)(e,["component"]);return s.a.createElement(f.b,Object.assign({},a,{render:function(e){return"true"===v.isAuthenticated()?s.a.createElement(t,e):s.a.createElement(f.a,{to:{pathname:"/",state:{from:e.location}}})}}))},E=(a(64),a(23)),C=(a(65),a(14)),N=(a(66),a(67),function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(l.a)(this,Object(p.a)(t).call(this,e))).state={isOpen:e.isOpen},a}return Object(u.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return s.a.createElement("div",{className:"closedheader "+(!0===this.props.isOpen?"openheader":"")},s.a.createElement("div",{className:"companyLogo"},this.props.topNavTitle?this.props.topNavTitle:"Compass"),!0===this.props.isDashboard?s.a.createElement("div",null,s.a.createElement("button",{className:"fgpToggleDash",onClick:this.props.topNavAction},"classic view")):!1===this.props.isDashboard?s.a.createElement("div",null,s.a.createElement("button",{className:"fgpToggleDash",onClick:this.props.topNavAction},"modern view")):"")}}]),t}(n.Component)),S=(a(68),a(69),a(19)),O=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(l.a)(this,Object(p.a)(t).call(this,e))).state={extensionShown:e.extensionShown,currentPage:e.currentPage,linkTo:e.linkTo,fontAwesomeLib:e.fontAwesomeLib,fontAwesomeIcon:e.fontAwesomeIcon,description:e.description,isSignOut:a.props.isSignOut},a}return Object(u.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this;return s.a.createElement("div",{className:"fgReact_SideNavigationItem "+(this.props.linkTo===this.props.currentPage?"fgReact_SideNavigationItem-active ":"")+(this.props.extensionShown?"fgReact_SideNavigationItem-open":""),title:this.props.description},!0===this.state.isSignOut?s.a.createElement("div",null,s.a.createElement("div",{className:"fgReact_SideNavigationItemIcon "+(this.props.linkTo===this.props.currentPage?"fgReact_SideNavigationItemIcon-active":""),onClick:function(){v.logout(function(){e.props.history.push("/")})}},s.a.createElement(S.a,{icon:[this.props.fontAwesomeLib,this.props.FontAwesomeIcon]})),this.props.extensionShown?s.a.createElement("div",{className:"fgReact_SideNavigationItemIconExtension"},this.props.description):null):s.a.createElement(g.b,{to:this.props.linkTo},s.a.createElement("div",{className:"fgReact_SideNavigationItemIcon "+(this.props.linkTo===this.props.currentPage?"fgReact_SideNavigationItemIcon-active":"")},s.a.createElement(S.a,{icon:[this.props.fontAwesomeLib,this.props.FontAwesomeIcon]})),this.props.extensionShown?s.a.createElement("div",{className:"fgReact_SideNavigationItemIconExtension"},this.props.description):null))}}]),t}(n.Component),k=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(l.a)(this,Object(p.a)(t).call(this,e))).state={currentPage:e.currentPage,isOpen:e.isOpen},a}return Object(u.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return s.a.createElement("div",{className:"fgReact-SideNavigation "+(!0===this.props.isOpen?"fgReact-SideNavigation-open ":"")},s.a.createElement("div",{className:"fgReact_compass2 "+(!0===this.props.isOpen?"fgReact_compass-active2 ":""),onClick:this.props.handler},s.a.createElement("div",{className:"fgReact_logo-thingsat",style:this.props.sideNavLogoPath?{backgroundImage:"url(../"+this.props.sideNavLogoPath+")"}:{backgroundImage:"url(./fgp-logo.png)"}})),s.a.createElement(O,{extensionShown:this.props.isOpen,currentPage:this.props.currentPage,linkTo:"/Home",FontAwesomeIcon:"home",fontAwesomeLib:"fas",description:"Home"}),s.a.createElement(O,{history:this.props.history,extensionShown:this.props.isOpen,currentPage:this.props.currentPage,isSignOut:!0,linkTo:"/Signout",FontAwesomeIcon:"sign-out-alt",fontAwesomeLib:"fa",description:"Sign Out"}))}}]),t}(n.Component),x=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(l.a)(this,Object(p.a)(t).call(this,e))).state={isOpen:!1,currentPage:a.props.currentPage,isDashboard:a.props.isDashboard},a.toggleNav=a.toggleNav.bind(Object(C.a)(a)),a}return Object(u.a)(t,e),Object(c.a)(t,[{key:"toggleNav",value:function(){this.setState(function(e){return{isOpen:!e.isOpen}})}},{key:"render",value:function(){return s.a.createElement("header",null,s.a.createElement(N,{isOpen:this.state.isOpen,isDashboard:this.props.isDashboard,topNavAction:this.props.topNavAction,topNavTitle:this.props.topNavTitle}),s.a.createElement(k,{history:this.props.history,currentPage:this.props.currentPage,isOpen:this.state.isOpen,handler:this.toggleNav,sideNavLogoPath:this.props.sideNavLogoPath}))}}]),t}(n.Component),T=a(26),w=(a(72),a(73),function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(l.a)(this,Object(p.a)(t).call(this,e))).state={},a}return Object(u.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this;return s.a.createElement("div",{className:"col-12 fgReact_searchrow d-inline-flex align-items-center"},s.a.createElement("div",{className:"col-md-3 col-12 fgReact_searchInputContainer d-md-inline-flex align-items-center"},s.a.createElement("select",{className:"form-control",value:this.props.searchingColumn,onChange:this.props.updateSearchingColumn},">",this.props.searchingColumns.map(function(e,t){return s.a.createElement("option",{key:t,value:e.column},e.label)}))),s.a.createElement("div",{className:"col-md-3 col-12 d-md-inline-flex align-items-center fgReact_searchInputContainer"},s.a.createElement("select",{className:"form-control ",value:this.props.searchingType,onChange:this.props.updateSearchingType},this.props.searchingTypes.map(function(e,t){return s.a.createElement("option",{key:t,value:e.key},e.label)}))),s.a.createElement("div",{className:"col-md-3 col-12 d-md-inline-flex align-items-center fgReact_searchInputContainer "},s.a.createElement("input",{className:"form-control",placeholder:"Keyword...",value:this.props.searchingKeyword,onChange:this.props.updateKeyword})),!0===this.props.isFirst?s.a.createElement("div",{className:"d-inline-flex align-items-center col-1 "},s.a.createElement("div",{className:"fgReact_plusButtonOuter d-md-inline-flex align-items-center",onClick:this.props.addSearchCriteria},s.a.createElement(S.a,{className:"fgReact_plusButton",icon:["fas","plus"]}))):s.a.createElement("div",{className:"d-inline-flex align-items-center col-1 "},s.a.createElement("div",{className:"fgReact_minusButtonOuter d-md-inline-flex align-items-center",onClick:function(){return e.props.removeSearchCriteria(e.props.indexKey)}},s.a.createElement(S.a,{className:"fgReact_minusButton",icon:["fas","minus"]}))),!0===this.props.isFirst?s.a.createElement("div",{className:"d-inline-flex align-items-center col-1 "},s.a.createElement("div",{className:"fgReact_searchButtonOuter d-md-inline-flex align-items-center",onClick:this.props.makeSearch},s.a.createElement(S.a,{className:"fgReact_searchButton",icon:["fas","search"]}))):"")}}]),t}(n.Component)),R=a(17),j=a.n(R),_=(a(90),a(47)),I=(a(91),a(25)),L=a.n(I),A=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(l.a)(this,Object(p.a)(t).call(this,e))).state={},a.buildData=a.buildData.bind(Object(C.a)(a)),a.buildColumns=a.buildColumns.bind(Object(C.a)(a)),a}return Object(u.a)(t,e),Object(c.a)(t,[{key:"buildData",value:function(e){return e.forEach(function(e){}),e}},{key:"buildColumns",value:function(e){return this.props.ignoreBuildCols||e.forEach(function(e){e.fgpRedirect?e.Cell=function(t){return s.a.createElement(g.b,{to:e.fgpRedirect+t.value},t.value)}:e.fgpMutate&&"date"===e.fgpMutate&&(e.Cell=function(e){return s.a.createElement(L.a,{date:e.value,format:"lll"})})}),e}},{key:"render",value:function(){return s.a.createElement("div",{className:"ResultTable"},s.a.createElement("span",{className:"ResultTable-title"},this.props.title),s.a.createElement(_.a,{showPagination:this.props.showPagination,showPageSizeOptions:this.props.showPageSizeOptions,showPageJump:this.props.showPageJump,filterable:this.props.filterable,data:this.buildData(this.props.data),columns:this.buildColumns(this.props.columns),minRows:this.props.defaultRowSize,pageSizeOptions:this.props.defaultRowSizeArray}))}}]),t}(n.Component),P=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(l.a)(this,Object(p.a)(t).call(this,e))).state={searchConfig:{searchingTypes:a.props.searchConfig.searchingTypes,searchingColumns:a.props.searchConfig.searchingColumns,columns:a.props.searchConfig.columns,locationColumns:a.props.searchConfig.locationColumns,customer:a.props.searchConfig.customer,reference:a.props.searchConfig.reference,defaultQtyRecordsToRetrieve:a.props.searchConfig.defaultQtyRecordsToRetrieve,startFrom:0,searchDirection:"%20asc",apiUrl:a.props.baseApiUrl+a.props.searchConfig.reference,hz:a.props.searchConfig.hz,map:a.props.searchConfig.map},searchRows:[{searchingType:a.props.defaultSearchType,searchingColumn:a.props.defaultSearchColumn,searchingKeyword:"",isFirst:!0,indexKey:Math.random()}],hasLoaded:!1,data:j.a.get(a.props.baseApiUrl+a.props.searchConfig.reference+"/data/"+a.props.searchConfig.defaultQtyRecordsToRetrieve+"/"+a.props.searchConfig.defaultStartFrom+"/"+a.props.searchConfig.customer+a.props.searchConfig.searchDirection).then(function(e){a.setState({data:e.data}),a.setState({hasLoaded:!0})}).catch(function(e){console.log(e)})},a.addSearchCriteria=a.addSearchCriteria.bind(Object(C.a)(a)),a.removeSearchCriteria=a.removeSearchCriteria.bind(Object(C.a)(a)),a.makeSearch=a.makeSearch.bind(Object(C.a)(a)),a}return Object(u.a)(t,e),Object(c.a)(t,[{key:"addSearchCriteria",value:function(){var e={searchingType:this.props.defaultSearchType,searchingColumn:this.props.defaultSearchColumn,searchingKeyword:"",isFirst:!1,indexKey:Math.random()};this.setState(function(t){return{searchRows:t.searchRows.concat([e])}})}},{key:"makeSearch",value:function(){var e=this;this.setState({hasLoaded:!1});var t=[];this.state.searchRows.forEach(function(a){if("==*?*"===a.searchingType||'=="*?*"'===a.searchingType){var n=[],s=null;if('=="*?*"'===a.searchingType)s=a.searchingKeyword;else if("==*?*"===a.searchingType)for(var i=0;i<a.searchingKeyword.split(",").length;i++)n.push(a.searchingKeyword.split(",")[i].trim());if("all"!==a.searchingColumn){if('=="*?*"'===a.searchingType)t.push(a.searchingColumn+a.searchingType.replace("?",s)+"");else if("==*?*"===a.searchingType){var r="";n.forEach(function(e,t){var s=a.searchingColumn+""+'=="*?*"'.replace("?",e);t<n.length-1?r+=s+",":r+=s}),t.push(r)}}else if("all"===a.searchingColumn&&null!==a.searchingKeyword&&""!==a.searchingKeyword.trim())if('=="*?*"'===a.searchingType){var o="(";e.props.SearchConfig.searchingColumns.forEach(function(e,t){"all"!==e.column&&(t<this.props.SearchConfig.searchingColumns.length-1?o+=e.column+""+a.searchingType.replace("?",s)+",":o+=e.column+""+a.searchingType.replace("?",s))}),o+=")",t.push(o)}else"==*?*"===a.searchingType&&(r="",n.forEach(function(e,t){var a="(";this.props.SearchConfig.searchingColumns.forEach(function(t,n){"all"!==t.column&&(n<this.props.SearchConfig.searchingColumns.length-1?a+=t.column+""+'=="*?*"'.replace("?",e)+",":a+=t.column+""+'=="*?*"'.replace("?",e))}),a+=")",t<n.length-1?r+=a+",":r+=a}),t.push(r))}else if("all"!==a.searchingColumn)if(-1!==a.searchingKeyword.indexOf("'")||-1!==a.searchingKeyword.indexOf('"')){var c=a.searchingKeyword.replace('"','\\"');c='"'+c+'"',t.push(a.searchingColumn+a.searchingType.replace("?",c)+"")}else t.push(a.searchingColumn+a.searchingType.replace("?",a.searchingKeyword)+"");else"all"===a.searchingColumn&&(o="(",e.props.SearchConfig.searchingColumns.forEach(function(e,t){"all"!==e.column&&(t<this.props.SearchConfig.searchingColumns.length-1?o+=e.column+""+a.searchingType.replace("?",s)+",":o+=e.column+""+a.searchingType.replace("?",s))}),o+=")",t.push(o))});var a=this.props.baseApiUrl+this.props.searchConfig.reference+"/data/"+this.props.searchConfig.defaultQtyRecordsToRetrieve+"/"+this.props.searchConfig.defaultStartFrom+"/"+this.props.searchConfig.customer+this.props.searchConfig.searchDirection;t&&t.length>0&&(a=a+"?"+t.join(";")),j.a.get(a).then(function(t){e.setState({data:t.data}),e.setState({hasLoaded:!0})}).catch(function(e){console.error(e)})}},{key:"removeSearchCriteria",value:function(e){var t=this.state.searchRows.findIndex(function(t){return t.indexKey===e}),a=Object(T.a)(this.state.searchRows);a.splice(t,1),this.setState({searchRows:a})}},{key:"updateKeyword",value:function(e,t,a){var n=this.state.searchRows.findIndex(function(e){return e.indexKey===t}),s=Object(T.a)(this.state.searchRows);s[n][e]=a.target.value,this.setState({searchRows:s})}},{key:"updateSearchingColumn",value:function(e,t,a){var n=this.state.searchRows.findIndex(function(e){return e.indexKey===t}),s=Object(T.a)(this.state.searchRows);s[n][e]=a.target.value,this.setState({searchRows:s})}},{key:"updateSearchingType",value:function(e,t,a){var n=this.state.searchRows.findIndex(function(e){return e.indexKey===t}),s=Object(T.a)(this.state.searchRows);s[n][e]=a.target.value,this.setState({searchRows:s})}},{key:"render",value:function(){var e=this;return s.a.createElement("div",{className:"fgReact_workingArea"},s.a.createElement("div",{className:"container fgReact_SearchPageTitle"},this.props.title),!0===this.props.hideFilter?"":s.a.createElement("div",{className:"container fgReact_componentContainer"},s.a.createElement("div",{className:"col-12"},s.a.createElement("div",null,this.state.searchRows.map(function(t,a){return s.a.createElement(w,{key:t.indexKey,indexKey:t.indexKey,addSearchCriteria:e.addSearchCriteria,removeSearchCriteria:e.removeSearchCriteria,searchingKeyword:t.searchingKeyword,searchingType:t.searchingType,searchingColumn:t.searchingColumn,updateKeyword:e.updateKeyword.bind(e,"searchingKeyword",t.indexKey),updateSearchingType:e.updateSearchingType.bind(e,"searchingType",t.indexKey),updateSearchingColumn:e.updateSearchingColumn.bind(e,"searchingColumn",t.indexKey),makeSearch:e.makeSearch,searchingTypes:e.props.searchConfig.searchingTypes,searchingColumns:e.props.searchConfig.searchingColumns,isFirst:t.isFirst})})))),s.a.createElement("div",{className:"container fgReact_componentContainer"},this.state.hasLoaded?s.a.createElement(A,{data:this.state.data,columns:this.props.searchConfig.columns,redirectTo:this.props.redirectTo}):s.a.createElement(S.a,{className:"centerSpinner fa-spin",icon:["fas","spinner"]})))}}]),t}(n.Component),D=a(46),K=function(e){function t(){return Object(o.a)(this,t),Object(l.a)(this,Object(p.a)(t).apply(this,arguments))}return Object(u.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return s.a.createElement("div",{className:"fgReact_home"},s.a.createElement(x,{history:this.props.history,currentPage:"/Home",topNavTitle:this.props.topNavTitle,sideNavLogoPath:this.props.sideNavLogoPath}),s.a.createElement(P,{baseApiUrl:"http://thingat-api.thingsat.10.1.14.69.xip.io/thingsat/",title:"Asset Search",defaultSearchColumn:"serialNumber",defaultSearchType:"==*?*",searchConfig:D}))}}]),t}(n.Component),U=(a(94),function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(l.a)(this,Object(p.a)(t).call(this,e))).state={user:"",pass:""},a}return Object(u.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){"true"===v.isAuthenticated()?this.props.history.push("/Home"):this.props.history.push("/")}},{key:"render",value:function(){var e=this;return s.a.createElement("div",{className:"loginContainer"},s.a.createElement("div",{className:"container-fluid loginInner  h-100 text-left"},s.a.createElement("div",{className:" col-12 text-centre titlelogin"},s.a.createElement("span",null,this.props.loginTitle?this.props.loginTitle:"Login")),s.a.createElement("form",{className:"col-6 offset-3 loginForm"},s.a.createElement("div",{className:"form-group"},s.a.createElement("label",{htmlFor:"exampleInputEmail1"},"Username"),s.a.createElement("input",{type:"text",className:"form-control form-control-lg",id:"exampleInputEmail1","aria-describedby":"emailHelp",onChange:function(t){e.setState({user:t.target.value})},placeholder:"Enter username"})),s.a.createElement("div",{className:"form-group"},s.a.createElement("label",{htmlFor:"exampleInputPassword1"},"Password"),s.a.createElement("input",{type:"password",className:"form-control form-control-lg",id:"exampleInputPassword1",onChange:function(t){e.setState({pass:t.target.value})},placeholder:"Password"})),s.a.createElement("button",{className:"btn btn-primary",onClick:function(){v.login(e.state,function(){e.props.history.push("/Home")})}},"Log in"))))}}]),t}(n.Component)),F=a(48),H=(a(95),a(40),function(e){function t(e){return Object(o.a)(this,t),Object(l.a)(this,Object(p.a)(t).call(this,e))}return Object(u.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return s.a.createElement("span",null,"".concat(this.props.title,"  : "),s.a.createElement("label",{className:"fgReact_assetLabel"},"datetime"===this.props.style?s.a.createElement(L.a,{date:this.props.data,format:"lll"}):"currency"===this.props.style?s.a.createElement("span",null,"A$".concat(this.props.data)):s.a.createElement("span",null,this.props.data)))}}]),t}(n.Component)),B=function(e){function t(e){return Object(o.a)(this,t),Object(l.a)(this,Object(p.a)(t).call(this,e))}return Object(u.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return s.a.createElement("div",{className:"container fgReact_assetDataContainer"},!0===this.props.hasMap?"":s.a.createElement("div",{className:"col-md-12"},s.a.createElement("div",{className:"row col-md-12 fgReact_assetName alignLeft"},s.a.createElement("span",{className:""},"Asset: \xa0",s.a.createElement("label",{className:"fgReact_assetLabel"},this.props.assetName))),s.a.createElement("div",{className:"row info_r"},s.a.createElement("ul",{className:"col-md-6 alignLeft info_r_list"},this.props.data?this.props.data.map(function(e,t){if("object"!==typeof e.data)return e.redirect?s.a.createElement("li",{key:e.key},s.a.createElement("a",{className:"fgReact_assetRedirect",href:e.redirect}," ",s.a.createElement(H,{key:e.key,title:e.title,data:e.data,style:e.style})," ")):s.a.createElement("li",{key:e.key},s.a.createElement(H,{key:e.key,title:e.title,data:e.data,style:e.style}))}):""))))}}]),t}(n.Component),M=a(13),z=a(8),Q=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(l.a)(this,Object(p.a)(t).call(this,e))).state={hasAssetInfoLoaded:!1,hasAssetExtensionLoaded:!1,hasEmployeeAssignedToLoaded:!1,hasAssetStatusLoaded:!1,hasComputerExtensionLoaded:!1,hasAssetEventsLoaded:!1,hasRenderedYet:!1,assetName:a.props.match.params.handle,assetInfo:j.a.get(M.baseUrl+"asset/name/"+a.props.match.params.handle).then(function(e){a.setState({assetInfo:e.data})}).then(function(){a.setState({hasAssetInfoLoaded:!0})}),assetExtension:j.a.get(M.baseUrl+"asset/name/"+a.props.match.params.handle+"/asset_ext").then(function(e){a.setState({assetExtension:e.data})}).then(function(){a.setState({hasAssetExtensionLoaded:!0})}),employeeAssignedTo:j.a.get(M.baseUrl+"asset/"+a.props.match.params.handle+M.assetToEmp).then(function(e){a.setState({employeeAssignedTo:e.data})}).catch(function(e){console.log("caught, likely not assigned \n> error:",e)}).then(function(){a.setState({hasEmployeeAssignedToLoaded:!0})}),assetStatus:j.a.get(M.baseUrl+"asset/name/"+a.props.match.params.handle+M.assetStatus+(new Date).getTime()).then(function(e){a.setState({assetStatus:e.data})}).then(function(){a.setState({hasAssetStatusLoaded:!0})}),computerExtension:j.a.get(M.baseUrl+"asset/name/"+a.props.match.params.handle+M.computerExt+(new Date).getTime()).then(function(e){a.setState({computerExtension:e.data})}).then(function(){a.setState({hasComputerExtensionLoaded:!0})}),assetEventsLoaded:!1,assetEvents:j.a.get(M.baseUrl+M.assetEvent+a.props.match.params.handle+"/start").then(function(e){console.log(e.data.start),j.a.post(M.baseUrl+M.assetEvent,{start:e.data.start,end:(new Date).getTime(),devices:[a.props.match.params.handle]}).then(function(e){a.setState({assetEvents:e.data[a.props.match.params.handle].data,assetEventsLoaded:!0})}).catch(function(e){a.setState({assetEvents:null,assetEventsLoaded:!0})})}).catch(function(e){a.setState({assetEvents:null,assetEventsLoaded:!1})}).then(function(){a.setState({hasAssetEventsLoaded:!0})})},a}return Object(u.a)(t,e),Object(c.a)(t,[{key:"componentDidUpdate",value:function(){this.state.hasAssetInfoLoaded&&this.state.hasAssetExtensionLoaded&&this.state.hasEmployeeAssignedToLoaded&&this.state.hasAssetStatusLoaded&&this.state.hasComputerExtensionLoaded&&this.state.hasAssetEventsLoaded&&!this.state.hasRenderedYet&&(this.cleanData(),this.setState({hasRenderedYet:!0}))}},{key:"getFormat",value:function(e){for(var t=0;t<z.mutatedColumns.length;t++)if(e===z.mutatedColumns[t].key)return z.mutatedColumns[t].style;return"plain"}},{key:"getRedirect",value:function(e,t){for(var a=0;a<z.redirectColumns.length;a++)if(e===z.redirectColumns[a].key)return z.redirectColumns[a].redirectTo.replace("*",t);return null}},{key:"wordConvert",value:function(e){var t=this,a=e.split(/(?=[A-Z])/);return a[0]=this.capitalise(a[0]),a.map(function(e){return t.capitalise(e)}),a.join(" ")}},{key:"capitalise",value:function(e){return e.charAt(0).toUpperCase()+e.slice(1)}},{key:"cleanData",value:function(){var e=this,t=[{data:this.state.assetExtension,relationship:"assetExtension"},{data:this.state.assetInfo,relationship:"assetInfo"},{data:this.state.employeeAssignedTo,relationship:"employeeAssigned"},{data:this.state.assetStatus,relationship:"assetStatus"},{data:this.state.computerExtension,relationship:"computerExtension"}],a=new Array;t.map(function(t){for(var n=0,s=Object.entries(t.data);n<s.length;n++){var i=s[n],r=Object(F.a)(i,2),o=r[0],c=r[1];z.excludedColumns.includes(o)||a.push({title:o,data:c,style:e.getFormat(o),key:Date.now()+Math.random(),redirect:e.getRedirect(o,c),extension:t.relationship})}}),this.cleanRelationshipData(a)}},{key:"cleanRelationshipData",value:function(e){var t=this,a=this.relationshipExclude(e);a=a.map(function(e){var a=new Object;return Object.assign(e,a),a.title=t.relationshipRename(e),a.style=t.relationshipFormat(e),a.redirect=t.relationshipRedirect(e),a.data=e.data,a.extension=e.extension,a.key=e.key,a}),console.log(a),this.setState({cleanData:a})}},{key:"relationshipExclude",value:function(e){var t=new Array;return e.map(function(e){for(var a=!1,n=0;n<z.relation_excludedColumns.length;n++)z.relation_excludedColumns[n].extension===e.extension&&z.relation_excludedColumns[n].key===e.title&&(a=!0);a||t.push(e)}),t}},{key:"relationshipRename",value:function(e){for(var t=0;t<z.relation_renameColumns.length;t++)if(z.relation_renameColumns[t].extension===e.extension&&z.relation_renameColumns[t].key===e.title)return z.relation_renameColumns[t].desiredKey;return this.wordConvert(e.title)}},{key:"relationshipFormat",value:function(e){for(var t=0;t<z.relation_mutatedColumns.length;t++)if(z.relation_mutatedColumns[t].extension===e.extension&&z.relation_mutatedColumns[t].key===e.title)return z.relation_mutatedColumns[t].style;return e.style}},{key:"relationshipRedirect",value:function(e){for(var t=0;t<z.relation_redirectColumns.length;t++)if(z.relation_redirectColumns[t].extension===e.extension&&z.relation_redirectColumns[t].key===e.title){var a=z.relation_redirectColumns[t].redirect;return a=a.replace("*",e.data)}return e.redirect}},{key:"render",value:function(){return s.a.createElement("div",{className:"fgReact_home"},s.a.createElement(x,{currentPage:"/Home",history:this.props.history,topNavTitle:this.props.topNavTitle,sideNavLogoPath:this.props.sideNavLogoPath}),s.a.createElement(B,{hasMap:!1,assetName:this.state.assetName,data:this.state.cleanData,deviceConfig:z,history:this.props.history}))}}]),t}(n.Component),W=a(12),q=a(9);W.b.add(q.f),W.b.add(q.i),W.b.add(q.e),W.b.add(q.d),W.b.add(q.h),W.b.add(q.a),W.b.add(q.g),W.b.add(q.b),W.b.add(q.c);var G=function(){return s.a.createElement(g.a,null,s.a.createElement("div",{className:"App"},s.a.createElement(f.d,null,s.a.createElement(b,{path:"/Home",exact:!0,component:function(e){return s.a.createElement(K,Object.assign({topNavTitle:E.topNavTitle,sideNavLogoPath:E.sideNavLogoPath},e))}}),s.a.createElement(b,{path:"/Asset/:handle",component:function(e){return s.a.createElement(Q,Object.assign({topNavTitle:E.topNavTitle,sideNavLogoPath:E.sideNavLogoPath},e))}}),s.a.createElement(f.b,{exact:!0,path:"/",component:function(e){return s.a.createElement(U,Object.assign({loginTitle:E.loginTitle,sideNavLogoPath:E.sideNavLogoPath},e))}}),s.a.createElement(f.b,{exact:!0,path:"*",component:function(){return"404 NOT FOUND"}})),s.a.createElement(d,null)))};a(96);r.a.render(s.a.createElement(G,null),document.getElementById("root"))}},[[49,1,2]]]);
//# sourceMappingURL=main.ea451a4d.chunk.js.map