import React, { Component } from 'react';


class Home extends Component {

	componentDidMount(){
	    var highScore = localStorage.getItem('token') || 0;
	    if(highScore===0){
	      this.props.history.push('/');
	    }
	  }

	render() {

    	return (
    		<div>Home</div>
    	)
    }
}

export default Home;
