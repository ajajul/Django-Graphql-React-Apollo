import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Switch,
	Route,
} from "react-router-dom";
import './styles/index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import 'semantic-ui-css/semantic.min.css';


const httpLink = createHttpLink({
  uri: 'http://localhost:7000'
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});



ReactDOM.render(
  <ApolloProvider client={client}>
    <Router onUpdate={() => window.scrollTo(0, 0)}>
		<Switch>
			<Route path='/' component={App}/>
		</Switch>
	</Router>
  </ApolloProvider>,
  document.getElementById('root')
)
serviceWorker.unregister();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
