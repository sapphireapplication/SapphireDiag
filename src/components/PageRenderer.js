import React from 'react';
import { connect } from 'react-redux';
import Topbar from './TopBar';
import Sidebar from './Sidebar';
import Maincontent from './MainContent';
import Footer from './Footer';
import { CookiesProvider } from "react-cookie";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import DataUsageDiagramFile from './DataUsageDiagram/DataUsageDiagramFile';
import DataUsageDiagram from './DataUsageDiagram/DataUsageDiagram';
import PgmStruChart from './PgmStruChart/PgmStruChart';
import DMDChart from './DMDChart';
import LoginScreen from './LoginScreen';
import { setAuthDetails } from '../actions/TopbarActions';

global.DBNAME = '';
global.SERVERADDR = '';

global.scd = false;

const mapStateToProps = (state) => {
  console.log('shilpi pagerendered mapStateToProps');
  return {
    authDetails: state.topbarReducer.authDetails,
    
  };
};


function PageRenderer(props) {
  const { classes } = props;
  const [open, setOpen] = React.useState(true);
  console.log('Page props',props)




  /*const [authDetails, setAuthDetails] = React.useState({
    ipAddr: '',
    port: '',
    username: '',
    password: '',
    dbName: '',
  });*/

  // setAuthDetails = (e) => {
  //   authDetails = e;
  // };

  // React.useEffect(() => {
  //   console.log('Page renderer use effect', authDetails);
  // }, [authDetails]);

  const onSubmitHandler = (valueObj) => {
    // setAuthDetails((prevState) => ({
    //   ...prevState,
    //   [event.target.id]: event.target.value,
    // }));
    // setAuthDetails(valueObj);

    let authDetails = {
      ipAddr: valueObj.ipAddr,
      port: valueObj.port,
      username: valueObj.username,
      password: valueObj.password,
      dbName: valueObj.dbName,
    };

    
    props.setAuthDetails(authDetails);    
    console.log('anushka',localStorage.getItem('authDetails'));
  };
  // console.log('page renderer', authDetails);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  //console.log("inside Pagerenderer==", props);
  //<Topbar {...props} />
  return (
    <div
      id={'license-application-' + props.currentScreen}
      className={classes.root}
    >
      <Router>
        { localStorage.getItem('authDetails') ?null : (
        <LoginScreen
          onSubmitHandler={onSubmitHandler}
          //authDetails={authDetails}
          {...props}
          />
        )}
        {/*authDetails && authDetails.dbName ?*/}
        { localStorage.getItem('authDetails') ? (
        <Topbar  {...props} />
        ) : null}

        <Switch>
          <Route
            path='/SapphireDiag/:dbname/dusgf'
            exact
            component={() => (
              <Maincontent
                handleDrawerOpen={handleDrawerOpen}
                open={open}
                classes={props.classes}
              >
                <DataUsageDiagramFile {...props} />
              </Maincontent>
            )}
          ></Route>
          <Route
            path='/SapphireDiag/:dbname/dusgf/:entid'
            exact
            component={() => (
              <Maincontent
                handleDrawerOpen={handleDrawerOpen}
                open={open}
                classes={props.classes}
              >
                <DataUsageDiagramFile {...props} />
              </Maincontent>
            )}
          ></Route>
          <Route
            path='/SapphireDiag/:dbname/dusgp'
            exact
            component={() => (
              <Maincontent
                handleDrawerOpen={handleDrawerOpen}
                open={open}
                classes={props.classes}
              >
                <DataUsageDiagram {...props} />
              </Maincontent>
            )}
          ></Route>
          <Route
            path='SapphireDiag/:dbname/dusgp/:pgmid'
            exact
            component={() => (
              <Maincontent
                handleDrawerOpen={handleDrawerOpen}
                open={open}
                classes={props.classes}
              >
                <DataUsageDiagram {...props} />
              </Maincontent>
            )}
          ></Route>

          <Route
            path='/:dbname/scd'
            exact
            component={() => (
              <Maincontent
                handleDrawerOpen={handleDrawerOpen}
                open={open}
                classes={props.classes}
              >
                <PgmStruChart {...props} />
              </Maincontent>
            )}
          ></Route>

          <Route
            path='/:dbname/dmd'
            exact
            component={() => (
              <Maincontent
                handleDrawerOpen={handleDrawerOpen}
                open={open}
                classes={props.classes}
              >
                <DMDChart {...props} />
              </Maincontent>
            )}
          ></Route>
          
          <Route
            path='/SapphireDiag'
            exact
            component={() => (
              <Maincontent
                handleDrawerOpen={handleDrawerOpen}
                open={open}
                classes={props.classes}
              ></Maincontent>
            )}
          ></Route>
        </Switch>
      </Router>

      <Footer {...props} />
    </div>
  );
}

export default connect(mapStateToProps, { setAuthDetails })(PageRenderer);
//export default PageRenderer;
