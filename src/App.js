import React from 'react';
//Global Footer
import { FloatingFooter } from './components/floatingfooter/FloatingFooter';
// Router
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom' ;
import { ProtectedRoute } from './components/auth/ProtectedRoute';
// Global CSS
import './App.css';
// Branding Config
import BrandingConfig from './configs/brandingconfig.json'
// Pages
import { Home } from './components/pages/home/Home';
import { WelnetExamplePage } from './components/pages/welnetexamplepage/WelnetExamplePage';
import { Login } from './components/login/Login';
// import { Users } from './components/pages/users/Users';
import { AssetPage } from './components/pages/assetpage/AssetPage';
// Font Awesome Icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faMap } from '@fortawesome/free-solid-svg-icons';
library.add(faSearch);
library.add(faUsers);
library.add(faPlus);
library.add(faMinus);
library.add(faSpinner);
library.add(faDownload);
library.add(faSignOutAlt);
library.add(faHome);
library.add(faMap);


function App() {

  return (
    <Router>
      <div className="App">
         <Switch>
          <ProtectedRoute path="/Home" exact 
            component={props => 
              <Home 
                 topNavTitle={BrandingConfig.topNavTitle}
                 sideNavLogoPath={BrandingConfig.sideNavLogoPath}
                 {...props}
              />
            }
          />  

          {/* Example of a protected routed (needs auth) which will have a value after the '/' in the address bar */}
          <ProtectedRoute path="/Asset/:handle"
            component={props => 
              <AssetPage                 
                topNavTitle={BrandingConfig.topNavTitle}
                sideNavLogoPath={BrandingConfig.sideNavLogoPath}
                {...props}
              />
            }
          />  
          
          <ProtectedRoute path="/WelnetExample/:handle"
            component={props => 
              <WelnetExamplePage                 
                topNavTitle={BrandingConfig.topNavTitle}
                sideNavLogoPath={BrandingConfig.sideNavLogoPath}
                {...props}
              />
            }
          />  
          
          {/* Example of an unprotected route, no auth required */}
          <Route exact path="/"  
            component={props => 
              <Login                 
                loginTitle={BrandingConfig.loginTitle}
                sideNavLogoPath={BrandingConfig.sideNavLogoPath}
                {...props}
              />
            }
          />  
          {/* Example of rendering without a component */}
          <Route exact path="*" component={() => "404 NOT FOUND"}  />  
        </Switch>
        <FloatingFooter />
      </div>
    </Router>
  );
}

export default App;
