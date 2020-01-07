<h1> Future Grid <br>
React Library Guide </h1>

*  [Summary](#summary)
*  [Quick Start](#quick-start)
*  [Components](#components)



## Summary
<p> The following guid will allow you to install and get acquainted with the Future Grid React Library <br>
    The library is host to a multitude of components written in <code>React 16.0</code> which help make up the out of the box <i> Compass </i> User Interface that is deployed with the Future Grid Application.
    <br>
    The components listed are in alphabetical order however a shortened list below has been created that form the basis of the most used components in the library which you can navigate to or search on immediately, these include.
      * <code>Navigation</code>

      * <code>Page</code>

      * <code>DevicePage</code>

      * <code>Search</code>
</p>

## Quick Start
<p>
  This is an example of how to use the FGP React Library, you should be able to create a project just like this one running in a matter of minutes.
  <br>
  In this guide it is assumed you have <b><i>npm</i></b> installed .
</p>
  * <h5> Step 1 - Setting up a React app</h5>
    <span> Firstly, create a new <code>React</code> application using the following command in your terminal, if you already have an existing <code>React</code> app, you can skip this step. </span>
    <br>
    <code>$ npx create-react-app < your-app-name ></code>
    <br>
    You will then want to navigate into the directory of whatever you have named your app

  * <h5> Step 2 - Installing the package</h5>
    <span> Run the following command from the terminal to install the Future Grid React Library, ensuring that you have root permissions to do so, ensure that you have by using <i>sudo</i></span>
    <br>
    <code>$ sudo npm i @chizzele-/fgp_react_lib</code>
    <br>

  * <h5> Step 3 - Import some components into your <i>App.js</i> file</h5>
    <span> At the very top of your <i>App.js</i> file you will find the standard <code>React</code> imports, underneath these you should include the following import to get you started </span>
      <code>
        import {RouteWrap, Page, Navigation} from '@chizzele-/fgp_react_lib';
      </code>
    <br>

  * <h5> Step 4 - Setting up the components</h5>
    <span> When using the Future Grid Component Library, if your application requires routing, more than a single page or a navigation, it is recommended to follow the following structure inside the <code>return()</code> <i>App.js</i> If you have built a new app, you may find that a div with a className of App is present, place the following component structure inside those tags</span>
    <br>
    <code>
    < RouteWrap > <br>
    &nbsp;&nbsp;< Page  >
    <br>
    &nbsp;&nbsp;< Navigation />
    <br>
    &nbsp;&nbsp;</ Page >
    <br>
    </ RouteWrap >
    </code><br>
    Next we need to configure these components by passing through props so they work as we want.

  * <h5> Step 6 - Configuring the components </h5>
    <span> Now that the components have been included in your project you can begin to use them. In this quickstart guide we will be using the 3 building block components to get a simple page working, these are the 3 imported and included in the last step, <i>RouteWrap, Page </i> and <i> Navigation</i> </span>. For more information on the implementation and usage of these components please refer to sections dedicated to these components further in this document.
    <br>
    <br>
    Firstly, lets give our <i>Page</i> component the following props, <br>
    <code>
      < Page exact path={"/"} >
    </code>
    <br>
    <br>
    Next, lets fill out the <i>Navigation</i> component that is nested inside the <i>Page</i> component.
    <br>
    <code>
      < Navigation <br>
      &nbsp;&nbsp;topNavTitle={"Home Title"}<br>
      &nbsp;&nbsp;sideNavLogo={logo}<br>
      &nbsp;&nbsp;currentPage={"/"}<br>
      &nbsp;&nbsp;items={navItems}<br>
      />
    </code>
    <br>
    before we put out first component on the page, we will need to define a variable that will hold our navigation links and their properties, you can do this whichever way you please, in fact you could type them out every time in the <code>Navigation</code> component itself each time you use it, but this can become cumbersome, instead, it is recommended to declare a <code>const</code> or <code>var</code> to hold these links for easier modification, and consistency in your configuration of the properties of the <code>Navigation</code> component. Here is an example, written inside the <code>App()</code> function found in <i>App.js</i>.
    <br>
    <code>
      const navigationItems = [{ <br>
        &nbsp;&nbsp;key:"home01"<br>
        &nbsp;&nbsp;linkTo:"/",<br>
        &nbsp;&nbsp;fontAwesomeIcon:"home",<br>
        &nbsp;&nbsp;fontAwesomeLib:"fa",<br>
        &nbsp;&nbsp;description: "Home"<br>
      }];
    </code>
    <br>
    This configuration suggests that we have one navigation link at "/", this is the same as we have defined as the <code>currentPage</code> property for our Navigation component and as such when we navigate to  "/" this navigation icon will be highlighted.




## Components
The FGP Component Library comes out of box with many React components built to interact and utilise the Future Grid API and application to speed up front-end development time, these include the following.
<!-- Navigation,
Map,
View,
GeoJSON,
defaultControls,
OverviewMap,
TileLayer,
VectorLayer,
CircleStyle,
Fill,
Stroke,
Style,
VectorSource,
TopNavigation,
SideNavigation,
SideNavigationItem,
RouteWrap,
Icons,
DeviceWidget,
library,
Breadcrumbs,
Breadcrumb,
DeviceDataRow,
Page,
DevicePage,
BasicMapFGP,
NwpMapFGP,
Auth,
Search,
FontAwesomeIcon,
SearchRow,
MapPopup,
ExternalLinkPage,
ExternalLink,
FgTabs,
ChildExtensionList,
ResultTable,
StandardGraph,
StandardGraphV2,
MultiTableFilterSearch,
FilterSearchRow,
MultiReferenceFilterSearch,
DatePickerWrapper -->

<h4>Navigation</h4>
*  [RouteWrap](#quick-start)
*  [Navigation](#summary)

<h4>Pages</h4>
*  [Page](#components)
*  [DevicePage](#components)
*  [ExternalLinkPage](#components)

<h4>Searches and Results</h4>
*  [Search](#components)
<!-- *  [ResultTable](#components) -->
*  [ChildExtensionList](#quick-start)

<h4>Graphs</h4>
*  [StandardGraphV2](#components)

<h4>Maps</h4>
*  [BasicMapFGP](#quick-start)

<h4>Device Widgets</h4>
*  [DeviceWidget](#quick-start)

<h4>Other Widgets</h4>
*  [DatePickerWrapper](#quick-start)


# Navigation
The navigation components provided in the FGP React library allow you to quickly spin up routing and expandable side-menu-style navigation which is configurable through a javascript object. <br>
As a side note, if you wish to have a navigation path of simply "/" as your home page, you should pass an additional prop of `exact` to the component, for consistency in the code it is recommended you do this for all non-device pages.

## RouteWrap
The `<RouteWrap><RouteWrap/>` Component is used to wrap all of the components in a given application that require to be navigated to and works on a modified version of `React-Router-Dom`. Within in the component you may specify both components that can be navigated to, and components that cannot, for this reason it is advised that you should let `RouteWrap` be the first child Element in your `App.js` File, with all other components nested inside it.
<br>
<b>This component does not require any props to be passed through. </b><br>
In most React Apps, the first element found in the `App.js` is the root `<div className="App"></div>`, you should nest the `RouteWrap` component inside of this.
### Implementation
<code>
`<RouteWrap>` <br>
  &nbsp;...&nbsp;<br>
`</RouteWrap>`
</code>
### Props
No properties are required for this component
<br>

## Navigation
The `<Navigation />` Component is provided as a consistent and easy to configure solution to navigating around a React App built using this library. The Navigation component requires several properties to be passed through to it to work as intended and can be either nested inside a `<Device Page/>`, `<Page/>`, `<ExternalLinkPage/>` or just be outside these components, it is flexible and works as a standalone component, you can even use it with your own custom built components, or simply just any inbuilt `JSX` components like a `<div>` however you <b>cannot</b> nest things inside the `Navigation` Component itself.
<br>
### Implementation
<code>
&nbsp;...&nbsp;<br>
`<Navigation` <br>
    &nbsp; `isOpen={true/false}` <br>
    &nbsp; `topNavTitle={String}`<br>
    &nbsp; `sideNavLogo={Image}`<br>
    &nbsp; `currentPage={String}`<br>
    &nbsp; `items={ArrayOfObjects}`<br>
`/>`<br>
&nbsp;...&nbsp;<br>
</code>
### Props
* `isOpen` : A variable of true / false typically set in the top-most component's state to control whether or not the side navigation is extended or collapsed by default.(`false` if not given).
* `topNavTitle` : A string which denotes what will be shown in the top section of the navigation page.
* `sideNavLogo` : Use `import yourImg from 'path/to/image'` to import an image, then pass it through to the navigation component by it's import name you have given it. This logo will be shown in the top left hand corner of the navigation bar and is recommended to be a square image
* `currentPage` : A string used to describe the current pages's route, that is to say, if you were on the "Home" page with a path of "/Home" and this was the Navigation component used on that page, then your `currentPage` prop would be `"/Home"`. When the current route = currentPage then it will have a highlight colour present on the navigation item and navigation item extension to indicate that it is the active route.
* `items` : Is an array of objects that lets the navigation component know what to render and what navigation links are accessible. For each array element, an icon, extension and route will be created. It is recommended that you define your items in a top level component and pass through as a variable to the component's props to make the navigation links more maintainable, an example of the items array is as follows:
<br>
<code>`const navItems = [ `<br> &nbsp;`{` <br> &nbsp; &nbsp;`key:"home",` <br> &nbsp; &nbsp; &nbsp;`linkTo:"/",` <br> &nbsp; &nbsp; &nbsp;`fontAwesomeIcon:"home",` <br> &nbsp; &nbsp; &nbsp;`fontAwesomeLib:"fa",` <br> &nbsp; &nbsp; &nbsp;`description: "Home"` <br> &nbsp;
`}`<br>`];`    
</code>


# Pages
The Pages components provided in the FGP React library allow you spin up json/Javascript Object-configurable pages that tie into the Future Grid Application design, they also allow passthrough of data retrieved to be accessible to child components nested within these Pages components.

## Page
The `<Page>...</Page>` component is a simple component that renders all components within it with styles that are made to fit the navigation component's existence.
### Implementation
<code>
`<Page exact path={"/"}` <br>
    `...`<br>
`</Page>`<br>
</code>
### Props
* `path` : When the Page component is a direct child of `<RouteWrap> </RouteWrap` you may provide it a path for purposes of navigation.


## DevicePage
The `<DevicePage>...</DevicePage>` Component aims to make building individual device pages much faster, when implemented with the Future-Grid API the Device Page Component is capable of retrieving a multitude of different points of data, relations and extensions which can the be passed through to the children of this component when the property `dataLink={true}` is given to the child component. More often than not, you will want to implement the `<DeviceWidget/>` component as a direct child of the Device Page to render much of the data made available by the DevicePage component.
### Implementation
<code>
`<DevicePage` <br>
    &nbsp;&nbsp; `showWidget={"hide"}`<br>
    &nbsp;&nbsp; `isFluid={false}`<br>
    &nbsp;&nbsp; `isBefore1910={false}`<br>
    &nbsp;&nbsp; `path={"/nmi/"}`<br>
    &nbsp;&nbsp; `deviceType={"nmi"}`<br>
    &nbsp;&nbsp; `deviceTypeTitleCasing={"upper"}`<br>
    &nbsp;&nbsp; `mapType={"basic"}`<br>
    &nbsp;&nbsp; `mapProjection={"EPSG:4326"}`<br>
    &nbsp;&nbsp; `isLoadingNavTitle={"Compass - loading Nmi"}  `<br>
    &nbsp;&nbsp; `isLoadingNavItems={this.props.navItems}`<br>
    &nbsp;&nbsp; `isLoadingNavLogo={this.props.logo}`<br>
    &nbsp;&nbsp; `extensionNames={["location", "nmi"]}`<br>
    &nbsp;&nbsp; `relationChildNames={["meter_nmi"]}`<br>
    &nbsp;&nbsp; `baseUrl={this.props.baseApiUrl}`<br>
    &nbsp;&nbsp; `relationParentNames={["nmi_lvcircuit", "nmi_transformer"]}`<br>
    &nbsp;&nbsp; `hasBreadCrumbs={true}`<br>
    &nbsp;&nbsp; `breadCrumbPath={"nmi->lvcircuit|->transformer->feeder->zonesub->gxp"}`<br>
    &nbsp;&nbsp; `breadCrumbDeviceTypes={["nmi", "lv_circuit","transformer", "feeder", "zone_sub", "gxp"]}`<br>
    &nbsp;&nbsp; `breadCrumbDeviceUrlPaths={["nmi","lvc","transformer","feeder","zone_sub","gxp"]}`<br>
    &nbsp;&nbsp; `breadCrumbDeviceImages={[nmiImg, circuitImg, transformerImg, feederImg, substationImg, gxpImg]}`<br>
`</DevicePage>`<br>
</code>
### Props
As there are a particularly high number of props for this component, I will be denoting essential or required props with a `*` in this list.
* `path` : When the Device Page component is a direct child of `<RouteWrap> </RouteWrap` you may provide it a path for purposes of navigation.
* `baseUrl`* : The base API URL inclusive of the application name eg.`https://www.myApi/app-name/`, it is recommended to set this in the `App.js` file and then pass down to children and pages through properties for ease of code maintenance
* `isFluid` : When set to `true` the component will implement a Bootstrap `container-fluid` CSS class, if set to `false` the component will implement a `container` css class, children components from the library will also inherit this property, by default this is set to `false`
* `isBefore1910` : This property should be given if the version of the Future Grid API you are using is before the 19.10 release, by default this property is set to `false`
* `deviceType`* : The type of device this page is the focus of, for example on a NMI page the device type in the Future Grid platform is found to be `nmi`
* `deviceTypeTitleCasing` : Changes the title deviceType to be UPPERCASE(`upper`), lowercase(`lower`), Camel Case(`camel`) or raw(`none`), by default `none` is set
* `extensionNames` : An array of strings of the extension names available to the device type specified, this can be found within the Future Grid Application design
* `relationChildNames` : An array of strings of the child_DEVICE relationship names available to the device type specified, this can be found within the Future Grid Application design
* `relationParentNames` : An array of strings of the DEVICE_parent relationship names available to the device type specified, this can be found within the Future Grid Application design
* `mapType` : The type of map to be rendered in the device widget (if included), by default this is set to `none`. Currently there is one map available for this property, to use this pass the parameter `basic` to this prop
* `mapProjection` : The type of map projection the latitude/longitude of the locations you have given the device require, by default this is set to `"EPSG:4326"`
* `isLoadingNavTitle` : Whilst the DevicePage Component is retrieving data you may have a custom title
* `isLoadingNavItems` : Whilst the DevicePage Component is retrieving data you may have a custom selection of navItems
* `isLoadingNavLogo` : Whilst the DevicePage Component is retrieving data you may have a custom selection of the top left logo
* `hasBreadCrumbs`  : Denotes whether or not the `DeviceWidget` component (if included) will have a relationship breadcrumb path
* `breadCrumbPath`*  : If you elect to set `hasBreadCrumb{true}` then you must supply a valid breadcrumb path (device hierarchy path), you should do this starting from the current device and using `->` to indicate which device will come after the previous device. using `|->` means that there is no relation from this device to the next, so it should use the previous device type to find the relation. In our example there is no relation between lvcircuit and transformer so the breadcrumb path will find the related transformer by getting the relation from the nmi.
* `breadCrumbDeviceTypes`* : If you elect to set `hasBreadCrumb{true}` then you must supply a valid breadcrumb array of device types that follows your `breadCrumbPath`, these device types can be found in the Future Grid Application design
* `breadCrumbDeviceUrlPaths`* : If you elect to set `hasBreadCrumb{true}` then you must supply a valid breadcrumb array of url paths that follows your `breadCrumbPath`, these url paths should match the `path` any given device type's page. for example, in our exampled lvcircuit (deviceType:lv_circuit) will redirect to `/lvc/`

* `breadCrumbDeviceImages`* : If you elect to set `hasBreadCrumb{true}` then you must supply a valid image array that follows your `breadCrumbPath`, these images will be displayed to the left of the breadcrumb

* `childrenWithLocationAndStyles` : If you are not able to easily retrieve the devices with a simple child_device relation and wish to map these children on the device page, you can pass through your own array of children with location information and style information, the format of the objects in the array should follow the following format. <br>
`[{
  `</br>&nbsp;&nbsp;
  `deviceType: 'meter',` </br> &nbsp;&nbsp;
    `children: [{ ` </br> &nbsp;&nbsp;&nbsp;&nbsp; `name : "<child device identifier>"` <br> &nbsp;&nbsp;&nbsp;&nbsp; `lat : "<latitude val>"` </br>&nbsp;&nbsp;&nbsp;&nbsp;`lng : "<longitude val>"` </br> &nbsp;&nbsp;&nbsp;&nbsp;`style : {` </br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`fillColor:'yourColor(hex or name)',` <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`corderColor: 'yourColor(hex or name)',` <br> &nbsp;&nbsp;&nbsp;&nbsp; `},`<br> &nbsp;&nbsp;&nbsp;&nbsp;`type : "<what the identifier is eg. meter serial, meter id>"` <br> &nbsp;&nbsp;`}]` <br>`}]`

  * `childrenWithLocationAndStylesLoaded`* : You must handle the validation of these devices being loaded before attempting to render the map, when `false` the map will not be loaded, when `true` it is assumed all data is in the correct format and ready.

  * `lookupKey` : In the case where you will not be selecting the device by something rather than it's default lookup, you can specify the key used. For example `meter_number`.

  * `deviceNameOverride` : In a case where you need a very specific device to be displayed on the page you may give the name of the device as a property, otherwise the DevicePage component will grab the device name from the url

## ExternalLinkPage
  The `<ExternalLinkPage>...</ExternalLinkPage>` Component aims to make building a page that has the purpose of showing multiple links that can be redirected to within an organisations intranet streamlined. This is done with the aid of a JSON Configuration file which can be updated to reflect changes to the links. You can choose to nest a `Navigation` component inside or adjacent to the `ExternalLinkPage` Component.
  ### Implementation
  <code>
  `<ExternalLinkPage` <br>
      &nbsp;&nbsp; `title={"Asset Management"}`<br>
      &nbsp;&nbsp; `path={"/AssetManagement"}`<br>
      &nbsp;&nbsp; `isFluid={true}`<br>
      &nbsp;&nbsp; `config={assetLinksConfig}`<br>
  `</ExternalLinkPage>`<br>
  </code>

### Props

* `title` : The title shown at the top of the page

* `path` : When the External Link Page component is a direct child of `<RouteWrap> </RouteWrap` you may provide it a path for purposes of navigation.

* `isFluid` : When set to `true` the component will implement a Bootstrap `container-fluid` CSS class, if set to `false` the component will implement a `container` css class, children components from the library will also inherit this property, by default this is set to `false`

* `config` : An imported JSON file or javascript object which denotes what and how the links should be displayed, an example can be found at "https://drive.google.com/file/d/16kMDnjA21FW6doBlQfdP5CHM5O8l-hHc/view?usp=sharing"


# Searches and Results
For many of the use cases for Future Grid Application designs, references are created with data found within the relevant reference tables, these are often required to be searched upon for visibility of the network, hierarchy, events and other information. The Search and Results components directly tie into the Future Grid Application design specifications through configurable JSON/Javascript Object configurations.

## Search
The `<Search />` component allows you to quickly spin up a searching interface to perform filtered searches on a single reference table with multiple criteria found in a Future Grid Application design. The results are then produced in a resulting table which can be configured to redirect, mutate, perform operations and redefine results. The search is made up of several components, most notably `SearchRow` and `ResultTable` and `DatePickerWrapper`. Currently the search will call for 5 pages (125 records) to be loaded at a time and DOES NOT REFRESH based on pagination.

### Implementation
<code>
`<Search` <br>
    &nbsp;&nbsp; `title={"Asset Search"}`<br>
    &nbsp;&nbsp; `baseApiUrl={"Asset Search"}`<br>
    &nbsp;&nbsp; `path={"/AssetManagement"}`<br>
    &nbsp;&nbsp; `isFluid={true}`<br>
    &nbsp;&nbsp; `searchConfig={assetSearchConfig}`<br>
    &nbsp;&nbsp; `defaultSearchColumn="assetType"`<br>
    &nbsp;&nbsp; `defaultSearchColumn="==*?*"`<br>
    &nbsp;&nbsp; `filterableResults={false}`<br>
    &nbsp;&nbsp; `openInNewPage={true}`<br>
`/>`<br>
</code>
### Props
* `title` : The title shown at the top of the page

* `isFluid` : When set to `true` the component will implement a Bootstrap `container-fluid` CSS class, if set to `false` the component will implement a `container` css class, children components from the library will also inherit this property, by default this is set to `false`

* `searchConfig` : An imported JSON file or javascript object which denotes what and how the links should be displayed, an example can be found at https://drive.google.com/file/d/16kMDnjA21FW6doBlQfdP5CHM5O8l-hHc/view?usp=sharing

* `baseApiUrl`* : The base API URL inclusive of the application name eg.`https://www.myApi/app-name/`, it is recommended to set this in the `App.js` file and then pass down to children and pages through properties for ease of code maintenance
`defaultSearchColumn`* : Which column from your config you wish to be selected first by default in the search rows. <b>NOTE</b>: Please check that that if you are setting this to a field which has an `isDt` flag that you set the `defaultSearchType` to an applicable type

* `defaultSearchType`* : Which search type from your config you wish to be selected first by default in the search rows. <b>NOTE</b>: Please check that that if you are setting `defaultSearchColumn` to a column which has an `isDt` flag that you set the this searching type to the expression of either `greater than`, or `less than` found in our sample configuration.

* `filterableResults` : When set to `true` allows each column to be filtered after a search is made, otherwise when `false` the search field will not appear. (advised when dates, times, numbers and strings are all in the same result as unpredictable things may happen).

* `openInNewPage` : When set to `true` any redirect defined for a column will open in a new tab or page (depending on browser preferences), when `false`, redirects will occur in the same window. It is recommended to set this to `true`.


### Search Configuration Properties
In most cases it is easiest to create a JSON file containing your configuration, however in our sample you may have found some confusion, the configuration is broken into a few separate parts, these include the following.
 #### Columns :
 This is an array of objects which represent the columns that will be displayed in the resulting table from a search. A column object will always require the following 3 properties, they are case sensitive. Please note that when you are setting up your configurations and observing the application XML for the reference model, you should camelCase all fields which are presented with a `_` to separate words. for example <i>my_field</i> becomes <i>myField</i>
 1. `"accessor" : "columnName"` : The field you are referencing from the model.
 2. `"Header" : "Column Name"` : The title you wish to give the column.
 3. `"minWidth" : 210` : The initial width of the column, please note users can modify the column width.


 In addition to these 3 core properties there are multiple configuration options available that you can provide, these are not required but can be of aid with certain data presentation requirements, these include. <br> <b>Note</b>:  Some of these properties come in pairs and rely on each other.

* `"fgpMutate" : "mutationParam"` : Giving a column this property allows you to mutate the data that is shown in the field, this is particularily useful when you want to round numbers, format dates or append symbols
  * Supported criteria : `date` - Will format a timestamp to a date with `moment` formatting of (`ll`) by default.
  * Supported criteria : `round` - Will round a decimal number to 2 decimal places by default.


* `"fgpMutateConfig" : "parameter"` : Giving a column this property in conjunction with the `fgpMutate` property will allow you to control certain things depending on  the mutation type. <b>Note</b> This must be used with `fgpMutate` to result in a change. a list of parameters is as follows.
  * Supported Parameter for `date` : Format string from `moment`, for example `YY-MM`
  * Supported Parameter for `round` : integer of decimal places to round to


* `"fgpAdditionalSymbol" : "symbolToAppend"` : Giving a column this property <b>only when used in conjunction with the `"fgpMutate" : "round" ` property </b> will allow you to append a symbol to the end of the string, this is helpful for percentages.


* `"fgpValueMutate" : "delimiter"` : Giving a column this property in conjunction with `fgpValueMutateIndex` will allow you mutate the value (not the redirect) of the data based on the delimiter. If no index is given, 0 will be used

* `"fgpValueMutateIndex" : integer` : Giving a column this property in conjunction with `fgpValueMutate` will allow you mutate the value (not the redirect) of the data based on the delimiter and based on the integer you provide, for example lets say we have Data = <i>Hello-World</i> but we just want to show <i>Hello</i> we would use the following config. `"fgpValueMutate" : "-"`, `"fgpValueMutateIndex" : 0`.


* `"fgpRedirect" : "/path/"` : Giving a column this property with a path will enable the field of this data to be clickable, redirecting the user to the pathname + the data found in the field, for example `"fgpRedirect" : "/meter/"` with data in the field being `helloWorld` would result in a redirect to `.../meter/helloWorld`. This is very helpful for routing search result information to device pages rendered with `DevicePage`.


* `"fgpRedirectMutate" : "delimiter"` : This property works the same as `fgpValueMutate` however it only mutates the way in which the redirect works, leaving the data shown untouched. If no index is given, 0 will be used


* `"fgpRedirectMutateIndex" : integer` : This property works the same as `fgpValueMutateIndex` however it only mutates the way in which the redirect works, leaving the data shown untouched.


* `"fgpRedirectRow" : "/path/"` :  Giving a column this property <b> only in conjunction with `fgpRedirectRowPath`</b> will allow you to pass additional information column information from the row to the redirect, see `fgpRedirectRowPath` for an example.

* `"fgpRedirectRowPath" : "columnName->columnName"` : Giving a column this property <b> only in conjunction with `fgpRedirectRow`</b> will allow you to pass additional information from each column in a given row.
for example. <br>  lets say we had <br>`columnName:data` of  `col1: "World", col2: "Tuesday", col3 : "LetsGo"` <br>, giving a configuration of `"fgpRedirectRow" : "/Hello/" , "fgpRedirectRowPath" : "col1->col3"->col2` will result in a URL of  `../Hello/World/LetsGo/Tuesday`. <br> This is helpful for passing event data to pages


* `"fgpLimitRedirectCriteria" : "criteria"` : Limit the redirect action to only occur when the criteria is met. <br> <b>You must use the next property `fgpLimitRedirectAccessor` in conjunction with this property for it to render correctly </b>
  * Supported criteria : `notEmpty`


* `"fgpLimitRedirectAccessor" : "columnName"` : Apply the criteria specified in the `fgpLimitRedirectCriteria` to this column, For example lets use this configuration <br> `{"accessor" : meterId,  "Header" : "Meter ID", "fgpRedirect" : "/meter/", "fgpLimitRedirectCriteria" : "notEmpty", "fgpLimitRedirectAccessor" : "isSmartMeter"}` <br> The outcome from this configuration is displaying `meterId` information with the header <i>Meter ID</i> , furthermore, if the column `isSmartMeter` in the same row is <b>NOT</b> empty, , you will be able to click on the  `meterId` data to be redirected to `.../meter/<meterId data>`. If the `isSmartMeter` column <b>IS</b> empty, the `meterId` wil be shown but you will not be redirected on click. <br> <b>You must use the previous property `fgpLimitRedirectCriteria` in conjunction with this property for it to render correctly



# Other Widgets
The FGP React Library comes with an set of custom built React components which are usable and helpful to other applications outside of the regular use cases generally requested of customers. This section will detail and outline the implementation and use of these components.

## DatePickerWrapper
The DatePickerWrapper component is a simple and easy to utilise date picker component that is based on the react-datepicker component. It allows support for custom event handling on change of dates, custom initialised dates, multiple formats of dates and custom styling of the container itself.

### Implementation
<code>
  <DatePickerWrapper <br>
    &nbsp;&nbsp;&nbsp;&nbsp;date={"2019-11-16"}<br>
    &nbsp;&nbsp;&nbsp;&nbsp;dateFormat={"yyyy-MM-dd"}
    handleChange={this.props.myFunc}<br>
  />
</code>

### Props
* `customClasses` : A String of css classes to apply to the datePicker wrapper.
* `date` : The date the picker will initialise to
* `handleChange` : A function passed through props to handle what happens when the datePicker is changed
* `dateFormat` : The format in which the date should be displayed in the input field for the date picker, by default this will be set to "yyyy-MM-dd". Valid formats mimic that of a MomentJs date format String
* `placeholderText` : In a case where there is no date selected, provide a String for what should be shown, by default this will be set to "Select a day"
