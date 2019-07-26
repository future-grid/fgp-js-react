import React, { Component } from 'react';
import './Home.css';
import { Navigation } from '../../navigation/Navigation';
import { Search } from '../../search/Search';
import searchConfig from '../../../configs/searchconfigTA.json'

export class Home extends Component {
  
  render() {
    return (
      <div className="fgReact_home">
        <Navigation
          history={this.props.history}
          currentPage="/Home"
          topNavTitle={this.props.topNavTitle}
          sideNavLogoPath={this.props.sideNavLogoPath}
        />
        <Search
          baseApiUrl="http://thingat-api.thingsat.10.1.14.69.xip.io/thingsat/"
          title="Asset Search"
          defaultSearchColumn="serialNumber"
          defaultSearchType="==*?*"
          searchConfig={searchConfig}
        />
      </div>
    )
  }
}

export default Home
