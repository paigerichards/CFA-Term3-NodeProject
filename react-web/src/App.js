import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom'
import decodeJWT from 'jwt-decode'
import CreateJobPage from './pages/CreateJobPage'
import JobsPage from './pages/JobsPage'
import JobConfirmationPage from './pages/JobConfirmationPage'
import JobCard from './pages/JobCard'
import CreateUserPage from './pages/CreateUserPage'
import UsersPage from './pages/UsersPage'
import CreateCustomerPage from './pages/CreateCustomerPage'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import './style.css'


// Importing everything from auth and calling it authapi
import * as authAPI from './api/auth'

class App extends Component {

  // Initial state
  state = {
    error: null,
    token: sessionStorage.getItem('token'),
    // token: savedToken,
    jobs: null, // Null means not loaded yet
    redirect: null,
    role: sessionStorage.getItem('role'),
  }

  handleSignIn = ({username, password}) => {
    authAPI.signIn({username, password}).then(json => {
      const tokenPayload = decodeJWT( json.token )
      sessionStorage.setItem('token', json.token)
      sessionStorage.setItem('role', tokenPayload.role)
      sessionStorage.setItem('username', tokenPayload.username)
      this.setState({
        token: json.token,
        role: tokenPayload.role,
        username: tokenPayload.username
      })
    }).catch(error => {
      this.setState({error})
    })
  }

  handleRegister = ({username, password, role, customerProfile}) => {
    authAPI.register({username, password, role, customerProfile}).then(json => {
      this.setState({
        token: json.token,
        redirect: true
      })
    })
    .catch(error => {
      this.setState({error})
    })
  }

  handleRedirect = () => {
    this.setState((prevState) => {
      return {
        redirect: !prevState.redirect
      }
    })
  }

  handleLogout = () => {
    sessionStorage.removeItem('token')
    this.setState({token: null})
  }

  render() {
    const {error, token, jobs, redirect} = this.state

    let username, role;
    if (!!token) {
      const payload = decodeJWT(token)
      username = payload.username
      role = payload.role
    }

    return (
      <Router>
        <main>
          {
            token ? (<Header handleLogout={this.handleLogout} role={ role } username={token}  />) : (<Redirect to='/'/>)
          }
          { token ? (
              <Route exact path='/' render={() => (<HomePage />)} />)
            : (<Route exact path='/' render={() => (<LoginPage loginMaybe={this.handleSignIn}/>)} />)
          }

          <Route exact path='/createjob' render={() => (<CreateJobPage />)}/>

          <Route exact path='/jobs' render={() => (<JobsPage username={ username } role={ role }/>)}/>

          <Route exact path='/jobconfirmation' render={() => (<JobConfirmationPage/>)}/>

          <Route exact path='/jobcard/:id' render={() => (<JobCard/>)}/>

          <Route exact path='/createuser' render={() => (<CreateUserPage handleRedirect={this.handleRedirect} redirect={redirect} onRegister={this.handleRegister}/>)}/>

          <Route exact path='/users' render={() => (<UsersPage/>)}/>

          <Route exact path='/createcustomer' render={() => (<CreateCustomerPage/>)}/>

        </main>

      </Router>
    )
  }
}

export default App;
