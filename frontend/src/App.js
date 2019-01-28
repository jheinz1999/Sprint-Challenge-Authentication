import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';

import LoginPage from './components/LoginPage.js';
import JokesPage from './components/JokesPage.js';

class App extends Component {
  render() {

    if (this.props.location.pathname === '/') {

      if (!localStorage.token)
        this.props.history.push('/login');

      else
        this.props.history.push('/jokes');

    }

    return (
      <div className="App">

        <Route
          exact
          path='/login'
          render={props => <LoginPage {...props} />}
        />

        <Route
          exact
          path='/jokes'
          render={props => <JokesPage {...props} />}
        />

      </div>
    );
  }
}

export default withRouter(App);
