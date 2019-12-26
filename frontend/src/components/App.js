import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Menu, Container } from 'semantic-ui-react'
import Routes from '../routes';
import '../styles/App.css';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      logined:false,
    };
  }

  componentDidMount(){
    var highScore = localStorage.getItem('token') || 0;
    if(highScore!==0){
      this.setState({logined:true});
    }
  }

  renderAuthenticatedUserMenu = () =>{
    return(
      <Menu secondary>
          <Menu.Item>
            <Link to='/home'>Home</Link>
          </Menu.Item>
          <Menu.Item
            name='logout'
            onClick={(e)=>{
              localStorage.removeItem("token");window.location = '/';
            }}
          />
      </Menu>
    )
  }

  renderNoneAuthenticatedUserMenu = () =>{
    return(
      <Menu secondary>
          <Menu.Item>
            <Link to='/'>Login</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to='/register'>Signup</Link>
          </Menu.Item>
      </Menu>
    )
  }
  render() {
    return (
      <div className="App">
        {
          this.state.logined ? this.renderAuthenticatedUserMenu() : this.renderNoneAuthenticatedUserMenu()
        }
        <Container>
          <Routes />
        </Container>
      </div>
    );
  }
}

export default App;
