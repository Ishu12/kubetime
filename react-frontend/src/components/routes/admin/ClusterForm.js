
import React, { Component } from 'react';

import ClusterInfoDetails from './ClusterInfoDetails';
import ClusterCostDetails from './ClusterCostDetails';
import Confirm from './Confirm';
import Success from './Success';

export class ClusterForm extends Component {
	state = {
		step: 1,
		name: '',
		clusterType: '',
		endpoint: '',
		token: '',
		environment: '',
		cpucost: '',
		memorycost: '',
		storagecost: '',
		
	};

	isEmpty(str) {
		return (!str || str.length === 0);
	}
	// Proceed to next step
	nextStep = () => {
		const { step } = this.state;
		this.setState({
			step: step + 1
		});
	};

	// Go back to prev step
	prevStep = () => {
		const { step } = this.state;
		this.setState({
			step: step - 1
		});
	};

	handleChange = input => e => {
		this.setState({ [input]: e.target.value });
	};


	render() {
		const { step } = this.state;
		const { name,clusterType, endpoint, token, environment, cpucost, memorycost, storagecost } = this.state;
		const values = { name,clusterType, endpoint, token, environment, cpucost, memorycost, storagecost };

		switch (step) {
			case 1:
				return (
					<ClusterInfoDetails
						nextStep={this.nextStep}
						handleChange={this.handleChange}
						values={values}
						isEmpty={this.isEmpty}
					/>
				);
			case 2:
				return (
					<ClusterCostDetails
						nextStep={this.nextStep}
						prevStep={this.prevStep}
						handleChange={this.handleChange}
						values={values}
						isEmpty={this.isEmpty}
					/>
				);
			case 3:
				return (
					<Confirm
						nextStep={this.nextStep}
						prevStep={this.prevStep}
						values={values}
						isEmpty={this.isEmpty}
					/>
				);
			case 4:
				return (
					<Success
					/>
				);
			default:
				(console.log('This is a multi-step form built with React.'))
		}
	}

}

export default ClusterForm;