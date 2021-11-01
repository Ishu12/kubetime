import { Component } from 'react';
import { Link } from "react-router-dom";
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardTitle, MDBListGroupItem, MDBListGroup, MDBCollapse } from "mdbreact";
import _user_icon from "../../../images/icon/_user_icon.png";

import BannerMdbRow from './bannerMdbRow.js';
import DataService from '../../../restapi/data-service/DataService.js';
import UserProfileCard from '../../ui/userProfileCard.js';

import SpinnerPage from '../../ui/spinner.js';
import ErrorAlert from '../../ui/error/errorAlert.js';
class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			clusters: [],
			collapseID: "",
			cluster: "",
			showSpinner: true,
			isAdmin: JSON.parse(localStorage.getItem('system_role'))
		}
	}
	toggleCollapse = (collapseID, clusterid) => {
		this.setState(prevState => ({
			collapseID: prevState.collapseID !== collapseID ? collapseID : ""
		}));
		this.state.cluster = {
			"clusterId": clusterid,
			"errorMessage": ""
		};

		this.loadData();
	}


	loadData() {

		DataService.getClusterMetadata(this.state.cluster).then(

			(response) => {
				this.setState({
					cluster: response.data,
					showSpinner: false
				});

			}).catch(error => {
				this.state.cluster.errorMessage = "error occurred in api call";
				console.error('There was an error!', error);
			});

	}

	componentDidMount() {
		DataService.getAllClusters().then(

			(response) => {
				this.setState({
					clusters: response.data
				});

			}).catch(error => {
				console.log(error);
			});

	}

	render() {
		return (
			<div>
				<MDBContainer className="w-75 p-3 z-depth-5">
					<MDBRow class=".mt-8">
						<MDBCol sm="4">
							<UserProfileCard />
						</MDBCol>

						<MDBCol sm="8" className="border border-primary hoverable">
							<MDBCardTitle className="h4-responsive">List of cluster registered against your email</MDBCardTitle>
							<MDBListGroup className="my-3 mx-3">
								{this.state.clusters.map(cluster => (
									<MDBListGroupItem color="primary"> <a class="nav-link " id="v-pills-home-tab" role="tab" aria-selected="true" onClick={() => this.toggleCollapse(cluster.uuid, cluster.uuid)}
									>{cluster.name} of env: {cluster.environment} registered on {cluster.registeredon.substring(0, 10)}</a>

										<MDBCollapse id={cluster.uuid} isOpen={this.state.collapseID}> {this.state.showSpinner ?
											<SpinnerPage /> : null} {this.state.cluster.errorMessage ?
												<ErrorAlert /> : null}
											<MDBCard className="border border-info">
												<MDBCardBody className="clearfix">
													<div class="table-responsive">
														<table class="table table-dark ">
															<thead>
																<tr>
																	<th scope="col">clusterName</th>
																	<th scope="col">Environment</th>
																	{this.state.cluster.clusterVersion ? <th scope="col">clusterVersion</th> : null}
																	<th scope="col">platform</th>
																	{this.state.cluster.channel ? <th scope="col">channel</th> : null}

																	<th scope="col">k8s-gitVersion</th>
																</tr>
															</thead>
															<tbody>
																<tr>
																	<th scope="col">{this.state.cluster.clusterName}</th>
																	<th scope="col">{this.state.cluster.env}</th>
																	{this.state.cluster.clusterVersion ? <th>{this.state.cluster.clusterVersion}</th> : null}
																	<th scope="col">{this.state.cluster.platform}</th>
																	{this.state.cluster.channel ? <th>{this.state.cluster.channel}</th> : null}

																	<th scope="col">{this.state.cluster.gitVersion}</th>
																</tr>
															</tbody>
														</table>
													</div>
													<Link to={{ pathname: "/resources", state: { cluster: cluster } }} >	{this.state.cluster.errorMessage ?
														<button type="button" style={{ textTransform: 'none' }} class="btn btn-dark p-2 float-end disabled"  >Select</button> : <button type="button" class="btn btn-dark p-2 pull-right " >Select</button>}

													</Link>

												</MDBCardBody>

											</MDBCard>
										</MDBCollapse></MDBListGroupItem>))}
							</MDBListGroup>
							{this.state.isAdmin === 'AU' ?
								<Link to="/add-cluster">
									<button type="button" style={{ textTransform: 'none' }} class="btn btn-dark text-light pull-right" >Add Cluster</button>
								</Link>
								: null}
						</MDBCol>
					</MDBRow>
					<BannerMdbRow /> </MDBContainer>
			</div>
		);
	}
}
export default Home;