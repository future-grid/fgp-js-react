import React, { Component } from 'react';
import './Home.css';
import { Navigation } from '../../navigation/Navigation';
import { Search } from '../../search/Search';
import searchConfig from '../../../configs/WEL.json'

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
          baseApiUrl="https://compass-api.dev.welnet.co.nz/compass/"
          title="WEL Example search"
          defaultSearchColumn="icpNumber"
          defaultSearchType="==*?*"
          searchConfig={searchConfig}
        />
      </div>
    )
  }
}

export default Home
