import React from 'react';
import axios from 'axios';

export default class LoginPage extends React.Component {

  state = {

    username: '',
    password: '',
    err: null

  }

  handleChange = e => {

    this.setState({
      [e.target.name]: e.target.value,
      err: null
    });

  }

  signUp = e => {

    const { username, password } = this.state;

    console.log(process.env.REACT_APP_SERVER_HOST);

    axios.post(`${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/api/register`, { username, password })
      .then(res => {
        localStorage.token = res.data.token;
        this.props.history.push('/jokes');
      })
      .catch(err => this.setState({err: err.response.data.message}));

  }

  signIn = e => {



  }

  render() {

    return (

      <form className='login-form' onSubmit={e => e.preventDefault()}>

        <input
          type='text'
          name='username'
          placeholder='username'
          value={this.state.username}
          onChange={this.handleChange}
          required
        />

        <br />

        <input
          type='password'
          name='password'
          placeholder='password'
          value={this.state.password}
          onChange={this.handleChange}
          required
        />

        <br />

        {this.state.err && <p>{this.state.err}</p>}

        <button onClick={this.signIn}>Sign In</button>
        <button onClick={this.signUp}>Sign Up</button>

      </form>

    );

  }

}
