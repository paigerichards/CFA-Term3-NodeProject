import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'
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
import LogoutPage from './pages/LogoutPage'
import Footer from './components/Footer'
import SignInForm from './components/SignInForm'
// Importing everything from auth and calling it authapi
import * as authAPI from './api/auth'

class App extends Component {

  // Initial state
  state = {
    error: null,
    token: sessionStorage.getItem('token'),
    // token: savedToken,
    jobs: null, // Null means not loaded yet
  }

  handleSignIn = ({username, password}) => {
    authAPI.signIn({username, password}).then(json => {
      sessionStorage.setItem('token', json.token)
      this.setState({token: json.token})
    }).catch(error => {
      this.setState({error})
    })
  }

  handleRegister = ({username, password}) => {
    authAPI.register({username, password}).then(json => {
      this.setState({token: json.token})
    }).catch(error => {
      this.setState({error})
    })
  }

  render() {
    const {error, token, jobs} = this.state

    return (

      <Router>
        <main>
          {
            token ? (<Header />) : (<Redirect to='/'/>)
          }
          { token ? (
              <Route exact path='/' render={() => (<HomePage />)} />)
            : (<Route exact path='/' render={() => (<LoginPage loginMaybe={this.handleSignIn}/>)} />)
          }

          <Route exact path='/createjob' render={() => (<CreateJobPage/>)}/>

          <Route exact path='/jobs' render={() => (<JobsPage/>)}/>

          <Route exact path='/jobconfirmation' render={() => (<JobConfirmationPage/>)}/>

          <Route exact path='/jobcard/:id' render={() => (<JobCard/>)}/>

          <Route exact path='/createuser' render={() => (<CreateUserPage onRegister={this.handleRegister}/>)}/>

          <Route exact path='/users' render={() => (<UsersPage/>)}/>

          <Route exact path='/createcustomer' render={() => (<CreateCustomerPage/>)}/>

          <Route exact path='/logout' render={() => (<LogoutPage logout={this.logout}/>)}/>

          <Footer/>
        </main>

      </Router>
    )
  }
}

export default App;
