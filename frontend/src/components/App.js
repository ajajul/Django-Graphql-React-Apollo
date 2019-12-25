import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Menu, Container } from 'semantic-ui-react'
import Routes from '../routes';
import logo from '../logo.svg';
import '../styles/App.css';

function App() {
  return (
    <div className="App">
      <Menu secondary>
          <Menu.Item>
            <Link to='/home'>Home</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to='/'>Login</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to='/register'>Signup</Link>
          </Menu.Item>
      </Menu>
      <Container>
        <Routes />
      </Container>
    </div>
  );
}

export default App;
