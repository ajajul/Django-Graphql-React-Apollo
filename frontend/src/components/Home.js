import React, { Component } from 'react';
import {
  Container,
  Segment,
  Grid,
  Responsive
} from 'semantic-ui-react';
import gql from 'graphql-tag';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';


const httpLink = createHttpLink({
  uri: 'http://localhost:7000/graphql/',
  headers:{
    authorization: "JWT "+localStorage.getItem('token'),
  },
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});



class Home extends Component {

	constructor(props){
	    super(props);
	    this.state = {
	      records: [],
	      start:0,
	      end:20,
	    };
	}

	componentDidMount(){
	    var highScore = localStorage.getItem('token') || 0;
	    if(highScore===0){
	      this.props.history.push('/');
	    }

	    this.getRecords();
	 }

	 getRecords = () =>{
	 	const { start, end } = this.state;
	 	client.query({
		  query:  gql`
			  query {
				  actors(start:${start}, end:${end}) {
				    id
				    name
				  }
				}
			`
		}).then(response => this.setState({records:response.data.actors}));
	}

	HandleScroll = (e) => {
		if(e.target.scrollTop+100>(document.getElementById('innerHeight').clientHeight-window.innerHeight)){
			this.setState({end:this.state.end+10}, this.getRecords());
		}
	}

	render() {

		const { records } = this.state;

    	return (

    	  <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
	        <Grid.Column mobile={16} tablet={8} computer={8} onScroll={(e)=>this.HandleScroll(e)} style={{height:window.innerHeight,overflowY: 'scroll'}}>
	          <Container textAlign='center' className={'main-container signup-container'} id="innerHeight">
	            <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
	              <Grid.Column>
	                {records.map(item=> <Segment.Group key={item.id}>
					    <Responsive as={Segment}>{item.name}</Responsive>
					  </Segment.Group>)}
	              </Grid.Column>
	            </Grid>
	          </Container>
	        </Grid.Column>
	      </Grid>
    	)
    }
}

export default Home;
