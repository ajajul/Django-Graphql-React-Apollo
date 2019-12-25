import React, { Component } from 'react';
import {
  Container,
  Segment,
  Button,
  Grid,
  Form
} from 'semantic-ui-react';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { gql } from 'apollo-boost';


const httpLink = createHttpLink({
  uri: 'http://127.0.0.1:7000/graphql/'
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});


class Login extends Component {

	constructor(props){
	    super(props);
	    this.state = {
	      form_submitted:false,
	      form_error:true,
	      email: '',
	      password:'',
	      server_error:false,
	    };
	}

	handleChange = (e,{name,value,fieldtype}) => {
	    let state = this.state;
	    state[name] = value;
	    this.setState(state);
	}

	loginUser=(event)=>{

		client.query({
		  query: gql`
		    mutation{
		      tokenAuth(email:"${this.state.email}", password:"${this.state.password}"){
			    token
			  }
		    }
		  `
		}).then(response => console.log(response.data))
	    // event.preventDefault();
	    // this.setState({form_submitted:true});

	    // const {email,password } = this.state;
	    // this.props.loginUser({ email,password });
  	}

	renderForm(){
	    const {email,password}=this.state;

	    return(
	      <Form size='large' onSubmit={this.loginUser} >
	        <Segment raised>
	          <Form.Input
	            fluid
	            icon='mail'
	            iconPosition='left'
	            placeholder='Email'
	            name='email'
	            value={email}
	            fieldtype='email'
	            onChange={this.handleChange}
	          />
	          <Form.Input
	            fluid
	            icon='lock'
	            iconPosition='left'
	            placeholder='Password'
	            type='password'
	            name='password'
	            value={password}
	            fieldtype='password'
	            onChange={this.handleChange}
	          />

	          <Button color='green' fluid size='large' loading={this.props.waitingRequest} disabled={this.props.waitingRequest}>SignIn</Button>

	        </Segment>
	      </Form>
	    )
  	}

	render() {
		console.log(this.state)
    	return(
	      <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
	        <Grid.Column mobile={16} tablet={8} computer={8}>
	          <Container textAlign='center' className={'main-container signup-container'}>
	            <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
	              <Grid.Column>
	                { this.renderForm() }
	              </Grid.Column>
	            </Grid>
	          </Container>
	        </Grid.Column>
	      </Grid>
	    )
    }
}

export default Login;
