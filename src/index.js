// import React from "react";
import "./styles/fgpReact-BaseStyles.css";
import {Navigation} from './components/Navigation/Navigation';
import {TopNavigation} from  './components/Navigation/TopNavigation/TopNavigation';
import {SideNavigation} from  './components/Navigation/SideNavigation/SideNavigation';
import {SideNavigationItem} from  './components/Navigation/SideNavigation/SideNavigationItem/SideNavigationItem';
import {Page} from './components/Pages/Page';
import {DevicePage} from './components/Pages/DevicePage';
import {RouteWrap} from './components/RouteWrap/RouteWrap';
import {Auth} from './components/rude_auth/auth';
import {Search} from './components/Search/Search';
import {SearchRow} from './components/Search/searchrow/SearchRow';
import {ResultTable} from './components/Search/resulttable/ResultTable';
import {DeviceWidget} from './components/ExtensionWidgets/DeviceWidget'
import {DeviceDataRow} from './components/ExtensionWidgets/DeviceDataRow'
import {library} from '@fortawesome/fontawesome-svg-core';
import {BasicMapFGP} from './components/Map/BasicMapFGP/BasicMapFGP'
import {NwpMapFGP} from './components/Map/NwpMapFGP/NwpMapFGP';
import {NwpMapFGPV2} from './components/Map/NwpMapFGP/NwpMapFGPV2';
import {MapPopup} from './components/Map/MapPopUp/MapPopup'
import {Breadcrumbs} from './components/Breadcrumbs/Breadcrumbs'
import {Breadcrumb} from './components/Breadcrumbs/Breadcrumbs'
import {FgTabs} from './components/TabWidgets/FgTabs/FgTabs';
import {StandardGraph} from './components/Graphs/StandardGraph/StandardGraph';
import {StandardGraphV2} from './components/Graphs/StandardGraphV2/StandardGraphV2';
import {ChildExtensionList} from './components/TabWidgets/ChildExtensionList/ChildExtensionList';
import {ExternalLinkPage} from './components/Pages/ExternalLinkPage/ExternalLinkPage'
import {ExternalLink} from './components/Pages/ExternalLinkPage/ExternalLink'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {FilterSearchRow} from './components/MultiTableFilterSearch/FilterSearchRow/FilterSearchRow';
import {MultiTableFilterSearch} from './components/MultiTableFilterSearch/MultiTableFilterSearch'
import {MultiReferenceFilterSearch} from './components/MultiReferenceFilterSearch/MultiReferenceFilterSearch'
import { DatePickerWrapper } from './components/MultiReferenceFilterSearch/DatePickerWrapper/DatePickerWrapper'
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON.js';
import {defaults as defaultControls, OverviewMap} from 'ol/control.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

const iconList = Object
  .keys(Icons)
  .filter(key => key !== "fas" && key !== "prefix" )
  .map(icon => Icons[icon])

library.add(...iconList)



   
export { 
    Navigation,
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
    NwpMapFGPV2,
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
    DatePickerWrapper
  }