import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {Meteor} from 'meteor/meteor';
import { Link } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const mapStateToProps = (state) => {
  return{}
}

const mapDispatchToProps = (dispatch) => {
 return {}
}
const App  = class App extends Component {
  constructor(props) {
      super(props);
  }

  render() {
    return (
      <div className="app-container">
        <MuiThemeProvider>
          <div className="bodyContainer">
            {
              this.props.children
              // ||
              // <LoginPage/>
            }
          </div>
        </MuiThemeProvider>
      </div>

    );
  }
}

const AppConnected = connect(mapStateToProps, mapDispatchToProps)(App)
export default AppConnected
