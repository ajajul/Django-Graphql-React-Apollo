import React, { Component } from 'react';
import {
  Container,
  Segment,
  Button,
  Grid,
  Form
} from 'semantic-ui-react';
import { gql } from 'apollo-boost';
import { Mutation } from 'react-apollo';


const LOGIN_MUTATION = gql`
  mutation tokenAuth($email: String!, $password: String!) {
    tokenAuth(email: $email, password: $password) {
      token
    }
  }
`;

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

	componentDidMount(){
		var highScore = localStorage.getItem('token') || 0;
		if(highScore!==0){
			this.props.history.push('/home');
		}
	}

	handleChange = (e,{name,value,fieldtype}) => {
	    let state = this.state;
	    state[name] = value;
	    this.setState(state);
	}

	renderForm(){
	    const {email,password}=this.state;
	    return(
		    <Mutation mutation={LOGIN_MUTATION}>
		    {(tokenAuth, { data, loading, error }) => (
		      <Form size='large' onSubmit={() => {
                    tokenAuth({
                      variables: {
                        email: this.state.email,
                        password: this.state.password
                      }
                    })
                      .then(res => {localStorage.setItem('token', res.data.tokenAuth.token);window.location = '/home';})
                      .catch(err => <span>{err}</span>);
                    this.setState({ email: '', password: '' });
                  }}
                >
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
		    )}
		    </Mutation>
	    )
  	}

	render() {
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
