import React, { Component } from 'react';
import {
  Container,
  Segment,
  Button,
  Grid,
  Form,
  Radio,
  Dropdown,
  Checkbox,
  Loader, 
} from 'semantic-ui-react';
import {
  DateInput,
} from 'semantic-ui-calendar-react';
import PhoneInput from 'react-phone-input-2';
import axios from 'axios';
import { gql } from 'apollo-boost';
import { Mutation } from 'react-apollo';
import 'react-phone-input-2/lib/style.css';

// $photo: Upload!, 

const REGISTER_MUTATION = gql`
  mutation createUser(
  	$email: String!, 
  	$password: String!, 
  	$photo: Upload!, 
  	$gender: String!, 
  	$country: String!,
  	$state: String!,
  	$city: String!,
  	$phone: String!,
  	$developer: Boolean!,
  	$qa: Boolean!,
  	$bde: Boolean!,
  	$ba: Boolean!,
  	$hr: Boolean!,
  	$dob: Date!
  ) {
    createUser(
    	email: $email, 
    	password: $password, 
    	photo:$photo, 
    	gender: $gender,
    	country: $country,
    	state: $state,
    	city: $city,
    	phone: $phone,
    	developer: $developer,
    	qa: $qa,
    	bde: $bde,
    	ba: $ba,
    	hr: $hr,
    	dob: $dob
    ) {
      user{
      	id
      	email
      }
    }
  }
`;


class Register extends Component {


	constructor(props){
	    super(props);
	    this.state = {
	      loading:false,

	      countryList:[],
	      stateList:[],
	      cityList:[],

	      email: '',
	      password:'',
	      picture: null,
	      gender:'male',
	      country:'',
	      state:'',
	      city:'',
	      phone:'',
	      developer:false,
	      qa:false,
	      ba:false,
	      bde:false,
	      hr:false,
	      dob:'',

	      coustryCode:'',
	    };

	    this.pictureFileRef = React.createRef();
	}


	componentDidMount(){
		var highScore = localStorage.getItem('token') || 0;
		if(highScore!==0){
			this.props.history.push('/home');
		}
		this.getCountry();
	}

	getCountry = () =>{
		let countryList = []
		axios.get(`https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries.json`)
	      .then(res => {
	      	countryList = res.data.map((item)=>{
	      		return {
	      			id: item.id,
	      			iso3:item.iso3,
	      			iso2:item.iso2, 
	      			value: item.id,
	      			text: item.name
	      		}
	      	});
	      	this.setState({countryList:countryList});
	      });
	}

	handleChange = (e,{name,value,fieldtype}) => {
	    let state = this.state;
	    state[name] = value;
	    this.setState(state);
	}

	selectCountry = (e,{value}) =>{
		this.setState({loading:true});
		let country = this.state.countryList.find(item=>item.id===value)

		let stateList = []
		axios.get(`https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/states.json`)
	      .then(res => {
	      	stateList = res.data.filter(item=>item.country_id===value).map((item)=>{
	      		return {
	      			id: item.id,
	      			state_code:item.state_code, 
	      			value: item.id,
	      			text: item.name
	      		}
	      	});
	      	this.setState({stateList:stateList, loading:false, coustryCode:country.iso2.toLowerCase(), country:country.text, state:'', city:'', cityList:[]});
	      });
		
	}

	selectState = (e,{value})=>{
		this.setState({loading:true})
		let state = this.state.stateList.find(item=>item.id===value)

		let cityList = []
		axios.get(`https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/cities.json`)
	      .then(res => {
	      	cityList = res.data.filter(item=>item.state_id===value).map((item)=>{
	      		return {
	      			id: item.id,
	      			country_id:item.country_id, 
	      			value: item.id,
	      			text: item.name
	      		}
	      	});
	      	this.setState({cityList:cityList, loading:false, state:state.text});
	      });
	}


	renderForm(){
	    const {email,password, gender, countryList, stateList, cityList, coustryCode}=this.state;

	    return(
		    <Mutation mutation={REGISTER_MUTATION}>
		    {(createUser, { data, loading, error }) => (
		      <Form size='large' onSubmit={() => {
                    createUser({
                      variables: {
                        email: this.state.email, 
				    	password: this.state.password,
				    	photo: this.state.picture,
				    	gender: this.state.gender,
				    	country: this.state.country,
				    	state: this.state.state,
				    	city: this.state.city,
				    	phone: this.state.phone,
				    	developer: this.state.developer,
				    	qa: this.state.qa,
				    	bde: this.state.bde,
				    	ba: this.state.ba,
				    	hr: this.state.hr,
				    	dob: this.state.dob
                      }
                    })
                      .then(res => {this.props.history.push('/')})
                      .catch(err => <span>{err}</span>);
                    this.setState({ email: '', password: '' });
                  }}
                >
		        <Segment raised>

		        	<Form.Group widths='equal'>
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
			        </Form.Group>
			        <Form.Group>
						<input
				            name='picture'
				            type='file'
				            ref={this.pictureFileRef}
				            fieldtype='file'
				            onChange={(e) => {
				            	let {target: { files }} = e;
                                const file = files[0];
                                file && this.handleChange(e,{name:'picture', value:file, fieldtype:''})
                            }}
			        	/>
			        </Form.Group>
			        <Form.Group inline>
			          <label>Gender</label>
			          <Form.Field
			            control={Radio}
			            name='gender'
			            label='male'
			            value='male'
			            checked={gender === 'male'}
			            onChange={this.handleChange}
			          />
			          <Form.Field
			            control={Radio}
			            name='gender'
			            label='female'
			            value='female'
			            checked={gender === 'female'}
			            onChange={this.handleChange}
			          />
			          <Form.Field
			            control={Radio}
			            name='gender'
			            label='other'
			            value='other'
			            checked={gender === 'other'}
			            onChange={this.handleChange}
			          />
			        </Form.Group>
			        <Form.Group>
			        	<Form.Field
			        		control={Dropdown}
			        		placeholder='Select Country'
						    fluid
						    search
						    selection
						    options={countryList}
						    onChange={this.selectCountry}
			        	/>
			        	<Form.Field
			        		control={Dropdown}
			        		placeholder='Select State'
						    fluid
						    search
						    selection
						    options={stateList}
						    onChange={this.selectState}
			        	/>
			        	<Form.Field
			        		control={Dropdown}
			        		placeholder='Select city'
						    fluid
						    search
						    selection
						    options={cityList}
						    onChange={(e,{value})=>{this.setState({city:cityList.find(item=>item.id===value).text})}}
			        	/>
			        </Form.Group>
			        <Form.Group>
			        	<PhoneInput
						  country={coustryCode}
						  value={this.state.phone}
						  onChange={phone => this.setState({ phone })}
						/>
			        </Form.Group>
			        <Form.Group inline>
			          <label>Skills</label>
			          <Form.Field
			            control={Checkbox}
			            name='developer'
			            label='Developer'
			            onClick={(e, data)=>{this.handleChange(e, {name:data.name, value:data.checked, fieldtype:'checkbox'})}}
			          />
			          <Form.Field
			            control={Checkbox}
			            name='qa'
			            label='QA'
			            onClick={(e, data)=>{this.handleChange(e, {name:data.name, value:data.checked, fieldtype:'checkbox'})}}
			          />
			          <Form.Field
			            control={Checkbox}
			            name='bde'
			            label='BDE'
			            onClick={(e, data)=>{this.handleChange(e, {name:data.name, value:data.checked, fieldtype:'checkbox'})}}
			          />
			          <Form.Field
			            control={Checkbox}
			            name='ba'
			            label='BA'
			            onClick={(e, data)=>{this.handleChange(e, {name:data.name, value:data.checked, fieldtype:'checkbox'})}}
			          />
			          <Form.Field
			            control={Checkbox}
			            name='hr'
			            label='HR'
			            onClick={(e, data)=>{this.handleChange(e, {name:data.name, value:data.checked, fieldtype:'checkbox'})}}
			          />
			        </Form.Group>
			        <Form.Group>
			        	<DateInput
				          name="dob"
				          dateFormat="YYYY-MM-DD"
				          placeholder="Date"
				          value={this.state.dob}
				          iconPosition="left"
				          startMode="year"
				          onChange={this.handleChange}
				        />
				    </Form.Group>
		          
		          

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
	              	{this.state.loading && <Loader active inline='centered' />}
	                { this.renderForm() }
	              </Grid.Column>
	            </Grid>
	          </Container>
	        </Grid.Column>
	      </Grid>
	    )
    }
}

export default Register;
