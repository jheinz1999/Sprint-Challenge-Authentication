import React from 'react';
import axios from 'axios';

export default class JokesPage extends React.Component {

  state = {

    loggedIn: null,
    jokes: null,
    time: 3

  }

  componentDidMount() {

    if (!localStorage.token) {

      this.setState({loggedIn: false}, () => setTimeout(this.redirect, 1000));

    }

    else {

      const options = {
        headers: {
          Authorization: localStorage.token
        }
      }

      axios.get(`${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/api/jokes`, options)
        .then(res => this.setState({loggedIn: true, jokes: res.data}))
        .catch(err => this.setState({loggedIn: false}));

    }

  }

  redirect = () => {

    this.setState({time: this.state.time - 1}, () => {
      if (this.state.time > 0)
        setTimeout(this.redirect, 1000);
      else
        this.props.history.push('/login');
    })

  }

  signOut = () => {

    localStorage.clear();
    this.props.history.push('/login');

  }

  render() {

    const { loggedIn, jokes } = this.state;

    if (loggedIn === null)
      return <h1>Logging in...</h1>

    else if (!loggedIn)
      return <h1>You are not logged in. Redirecting in {this.state.time}</h1>

    else {

      return (

        <div className='jokes'>

          <button onClick={this.signOut}>Sign Out</button>

          {jokes.map(joke => <p>{joke.joke}</p>)}

        </div>

      );

    }

  }

}
