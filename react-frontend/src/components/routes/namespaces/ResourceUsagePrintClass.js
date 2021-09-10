
import React from 'react';

class ResourceUsagePrintClass extends React.Component {


	constructor(props) {
		super(props);

		var today = new Date(),
			date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
		var rand = 0 + (Math.random() * (100000 - 0));
		var _u_email = JSON.parse(localStorage.getItem('_u_email'));
		console.log("hi" + this.props);
		this.state = {

			currentDate: date,
			rand: rand,
			user: _u_email

		}
	}

	calcAmount = (data, costData) => {
		var c = 0.0;
		data.forEach( d => {

			if (d.storageVolume && (d.storageVolume.endsWith("Gi") || d.storageVolume.endsWith("mi") || d.storageVolume.endsWith("Mi"))) {
				d.storageVolume = d.storageVolume.substring(0, d.storageVolume.length - 2);
				c = c + d.storageVolume * costData.storagecost;
			} else {
				if (d.storageVolume ) { c = c + d.storageVolume * costData.storagecost; }
				else { d.storageVolume = "0Gi"; }
			}
			
			if (d.requestMemory && (d.requestMemory.endsWith("Gi") || d.requestMemory.endsWith("mi") || d.requestMemory.endsWith("Mi"))) {
				d.requestMemory = d.requestMemory.substring(0, d.requestMemory.length - 2);
				c = c + d.requestMemory * costData.momorycost;
			} else {
				if (d.requestMemory ) { c = c + d.requestMemory * costData.momorycost; }
				else { d.requestMemory = "0Gi"; }
			}
			
			if(d.requestCpu){
				c=c+d.requestCpu*costData.cpucost;
			}

		});

		return c;
	}

	render() {
		const data = this.props.data;
		const costData = this.props.costData;
		const cluster = this.props.cluster;
		const totalCost = this.calcAmount(data, costData);
		return (

			<div class="page-content container">
				<div class="page-header text-blue-d2">
					<h4 class="page-title text-secondary-d1">
						Invoice
						<small class="page-info">
							<i class="fa fa-angle-double-right text-80"></i>
                ID: #{this.state.rand}
						</small>
					</h4>

				</div>

				<div class="container px-0">
					<div class="row mt-4">
						<div class="col-12 col-lg-10 offset-lg-1">
							<div class="row">
								<div class="col-12">
									<div class="text-center text-150">
										<i class="fa fa-book fa-2x  float-left">
											<span class="text-default-d3">hcl.com</span></i>
										<span className="float float-right"> Date(mm/dd/yyyy) : {this.state.currentDate}</span>
									</div>
								</div>
							</div>

							<hr class="row brc-default-l1 mx-n1 mb-4" />

							<div class="row">
								<div class="col-sm-4">
									<div className="float-left">

										<ul class="list-group list-group-flush">
											<li class="list-group-item">
												<div class="list-group-item-fixed">
													<strong className="list-group-left">Report Generated By: </strong>
													<span className="list-group-right">{this.state.user}</span>
												</div>
											</li>
											<li class="list-group-item">
												<div class="list-group-item-fixed">
													<strong className="list-group-left">For Any Query : </strong>
													<span className="list-group-right"><i class="fa fa-phone fa-flip-horizontal text-secondary"></i> <b class="text-600">111-111-111</b></span>
												</div>
											</li>
										</ul>

									</div>
								</div>

								<div class="col-sm-4">
									<div className="float-center">
										<ul class="list-group list-group-flush">
											<li class="list-group-item">
												<div class="list-group-item-fixed">
													<strong className="list-group-left">Cluster Name : </strong>
													<span className="list-group-right">{cluster.name}</span>
												</div>
											</li>
											<li class="list-group-item">
												<div class="list-group-item-fixed">
													<strong className="list-group-left">Cluster Environment : </strong>
													<span className="list-group-right">{cluster.environment}</span>
												</div>
											</li>
										</ul>
									</div>
								</div>
								<div class="col-sm-4">
									<div className="float-right">
										<ul class="list-group list-group-flush">
											<li class="list-group-item">
												Cost details
											</li>
											<li class="list-group-item">
												<div class="list-group-item-fixed">
													<strong className="list-group-left">vCpu cost : </strong>
													<span className="list-group-right">{costData.currency} {costData.cpucost}/ {costData.cpuunit} per {costData.timelengthunit}</span>
												</div>
												<div class="list-group-item-fixed">
													<strong className="list-group-left">Memory Cost : </strong>
													<span className="list-group-right">{costData.currency} {costData.momorycost}/ {costData.memoryunit} per {costData.timelengthunit}</span>
												</div>
												<div class="list-group-item-fixed">
													<strong className="list-group-left">Storage Cost : </strong>
													<span className="list-group-right">{costData.currency} {costData.storagecost}/ {costData.storageunit} per {costData.timelengthunit}</span>
												</div>
											</li>
										</ul>
									</div>
								</div>
							</div>

							<div class="mt-4">




								<div class="row border-b-2 brc-default-l2"></div>

								<table className="table-striped">
									<thead>
										<th scope="col">S-No#</th>
										<th scope="col">Namespace</th>
										<th scope="col">AccessedLabel</th>
										<th scope="col">Storage</th>
										<th scope="col">vCpu</th>
										<th scope="col">Memory</th>
									</thead>

									<tbody class="text-95 text-secondary-d3">

										{data.length > 0 ? <>

											{data.map((tuple, index) => (
												<tr>
													<td scope="row" >{index + 1}</td>
													<td scope="row">{tuple.namespaceName}</td>
													<td scope="row">{tuple.labelSelector}</td>
													<td scope="row">{tuple.storageVolume}</td>
													<td scope="row">{tuple.requestCpu}</td>
													<td scope="row">{tuple.requestMemory}</td>
												</tr>
											))}
										</> : null}

									</tbody>
								</table>

								<div class="row mt-3">
									<div class="col-12 col-sm-7 text-grey-d2 text-95 mt-2 mt-lg-0">
										Extra note such as company or payment information...
                        </div>

									<div class="col-12 col-sm-5 text-grey text-90 order-first order-sm-last">
										<div class="row my-2">
											<div class="col-7 text-right">
												SubTotal
                                </div>
											<div class="col-5">
												<span class="text-120 text-secondary-d1">${totalCost}</span>
											</div>
										</div>

										<div class="row my-2">
											<div class="col-7 text-right">
												Tax (10%)
                                </div>
											<div class="col-5">
												<span class="text-110 text-secondary-d1">${totalCost/10}</span>
											</div>
										</div>

										<div class="row my-2 align-items-center bgc-primary-l3 p-2">
											<div class="col-7 text-right">
												Total Amount
                                </div>
											<div class="col-5">
												<span class="text-150 text-success-d3 opacity-2">${totalCost + (totalCost/10)}</span>
											</div>
										</div>
									</div>
								</div>

								<hr />

								<div>
									<span class="text-secondary-d1 text-105">Thank you for your business</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

		);
	}
}

export default ResourceUsagePrintClass;