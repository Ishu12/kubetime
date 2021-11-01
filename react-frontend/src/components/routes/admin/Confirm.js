import React, { Component } from 'react';
import DataService from '../../../restapi/data-service/DataService.js';
import ErrorAlert from '../../ui/error/errorAlert.js';
export class Confirm extends Component {
	continue = e => {
		e.preventDefault();
		// PROCESS FORM //
		this.props.nextStep();
	};

	back = e => {
		e.preventDefault();
		this.props.prevStep();
	};

	state = {
		errmsg: ""
	}
	handleSubmit = (e) => {
		e.preventDefault()

		DataService.addCluster(this.props.values).then(
			(response) => {
				console.log(response.data);
				console.log(response.data.message);
				if (response.data.status ==="ACCEPTED") {
					this.props.nextStep();
				} else {

					//console.log(response.data.obj.errorMessage);
					this.setState({ errmsg: "Data couldnt updated in system. => " + response.data.obj.errorMessage + ". Please check endpoint & token and resubmit." });
				}
			}).catch((error) => {
				//console.log(error);
				this.setState({ errmsg: "Data couldnt updated in system.Backend Api error ." });
			});

	};
	render() {


		const {
			values: { name,clusterType, endpoint, token, environment, cpucost, memorycost, storagecost }
		} = this.props;

		return (<>

			<div className="outer">
				<div className="inner">

					<h4>Verify form details </h4>

					{(this.state.errmsg) ? <ErrorAlert msg={this.state.errmsg} /> : null}

					<div class="card text-center">
						<ul class="list-group list-group-flush">
							<li class="list-group-item">
								<div class="list-group-item-fixed">
									<strong className="list-group-left">Cluster Name : </strong>
									<span className="list-group-right">{name}</span>
								</div>
							</li>
							<li class="list-group-item">
								<div class="list-group-item-fixed">
									<strong className="list-group-left">Cluster Type : </strong>
									<span className="list-group-right">{clusterType}</span>
								</div>
							</li>
							<li class="list-group-item">
								<div class="list-group-item-fixed">
									<strong class="list-group-left">Cluster End Point : </strong>
									<span class="list-group-right">{endpoint}</span>
								</div>
							</li>
							<li class="list-group-item">
								<div class="list-group-item-fixed">
									<strong class="list-group-left">Token To Access : </strong>
									<span class="list-group-right">#encrypted#</span>
								</div>
							</li>
							<li class="list-group-item">
								<div class="list-group-item-fixed">
									<strong class="list-group-left">Environment : </strong>
									<span class="list-group-right">{environment}</span>
								</div>
							</li>
							<li class="list-group-item">
								<div class="list-group-item-fixed">
									<strong class="list-group-left">Cpu Cost :</strong>
									<span class="list-group-right">{cpucost}</span>
								</div>
							</li>
							<li class="list-group-item">
								<div class="list-group-item-fixed">
									<strong class="list-group-left">Memory Unit Cost:</strong>
									<span class="list-group-right">{memorycost}</span>
								</div>
							</li>
							<li class="list-group-item">
								<div class="list-group-item-fixed">
									<strong class="list-group-left">Storage Unit Cost:</strong>
									<span class="list-group-right">{storagecost}</span>
								</div>
							</li>
						</ul>
					</div>

					<br />
					<div class="button-group mb-3">
						<button type="button"style={{textTransform: 'none'}}  onClick={this.back} className="btn btn-light btn-lg btn-block">Back</button>
						<button type="button"  style={{textTransform: 'none'}} onClick={this.handleSubmit} className="btn btn-dark btn-lg btn-block">Confirm & Submit</button>
					</div>
				</div></div>
		</>);
	}

}

export default Confirm;