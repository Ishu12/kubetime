
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from "react-router-dom";
import DataService from '../../../restapi/data-service/DataService.js';
import '../../../styles/componentstyles/table.css';
import Modal from 'react-modal';

import { useTable, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce, usePagination } from "react-table";

const modalStyles = {
	overlay: {
		backgroundColor: 'rgba(0,0,0,0.5)',
	},
	content: {
		top: '20%',
		left: '25%',
		width: '50%',
		right: 'auto',
		bottom: 'auto',
	}
};
const Namespaces = (props) => {
	const cluster = props.cluster;
	const costData = props.costData;
	const [resources, setResources] = useState([]);
	const [workerCompute, setWorkerCompute] = useState([]);
	const [pods, setPods] = useState([]);
	const resourcesRef = useRef();
	resourcesRef.current = resources;
	useEffect(async () => { getWorkerCompute(); }, []);


	const getWorkerCompute = () => {
		DataService.getWorkerCompute(cluster.uuid).then(
			(response) => {
				setWorkerCompute(response.data);

				var workerNodeCompute = response.data;
				var _u_email = JSON.parse(localStorage.getItem('_u_email'));
				DataService.getResourcePerNamespaces({
					clusterId: cluster.uuid,
					userEmail: _u_email
				})
					.then((response) => {
						var dataFromService = response.data;
						dataFromService.map((r, index) => {
							if (!r.requestCpu) {
								r.requestCpu = workerNodeCompute.cpuAllocatable/1000 ;
							}
							if (!r.requestMemory && workerNodeCompute.memoryAllocatable ) {
								r.requestMemory = (workerNodeCompute.memoryAllocatable/1024).toFixed(2) +'Gi';
							}
						});
						setResources(dataFromService);
					})
					.catch((e) => {
						console.log(e);
					});


			}).catch(error => {
				console.log(error);
			}
			);
	}


	const getPodResources = (rowIndex) => {
		const namespace = resourcesRef.current[rowIndex].namespaceName;
		DataService.getPodResourcePerNamespaces(
			{
				"clusterId": cluster.uuid,
				"namespace": namespace
			}
		).then((response) => {
			setPods(response.data);
			openModal();
		}).catch((e) => {
			console.log(e);
		});
	};

	var subtitle;
	const [modalIsOpen, setIsOpen] = React.useState(false);
	function openModal() {
		setIsOpen(true);
	}

	function afterOpenModal() {
		// references are now sync'd and can be accessed.
		subtitle.style.color = '#f00';
	}

	function closeModal() {
		setIsOpen(false);
	}

	// Define a default UI for filtering
	function GlobalFilter({
		preGlobalFilteredRows,
		globalFilter,
		setGlobalFilter,
	}) {
		const count = preGlobalFilteredRows.length
		const [value, setValue] = React.useState(globalFilter)
		const onChange = useAsyncDebounce(value => {
			setGlobalFilter(value || undefined)
		}, 200)

		return (
			<span>
				Search:{' '}
				<input
					value={value || ""}
					onChange={e => {
						setValue(e.target.value);
						onChange(e.target.value);
					}}
					placeholder={`${count} records...`}
					style={{
						fontSize: '1.1rem',
						border: '0',
					}}
				/>
			</span>
		)
	}




	const defaultColumn = React.useMemo(
		() => ({
			Filter: DefaultColumnFilter
		}),
		[]
	);

	function DefaultColumnFilter({
		column: { filterValue, preFilteredRows, setFilter },
	}) {
		const count = preFilteredRows.length;

		return (
			<input
				value={filterValue || ""}
				onChange={(e) => {
					setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
				}}
				placeholder={`Search ${count} records...`}
			/>
		);
	};

	const columns = useMemo(
		() => [
			{
				Header: "Namespace",
				accessor: "namespaceName",
			},
			{
				Header: "LabelSelector",
				accessor: "labelSelector",
			},
			{
				Header: "Storage",
				accessor: "storageVolume",
				disableFilters: true,

			},
			{
				Header: "cpu-quota (in vCPU)",
				accessor: "requestCpu",
				disableFilters: true,
			},
			{
				Header: "cpu-used",
				accessor: "usedCpu",
				disableFilters: true,
			},
			{
				Header: "memory-quota (in Gi)",
				accessor: "requestMemory",
				disableFilters: true,
			},
			{
				Header: "memory-used",
				accessor: "usedMemory",
				disableFilters: true,
			},
			{
				Header: "Details",
				disableFilters: true,
				disableSort: true,
				Cell: (props) => {
					const rowIdx = props.row.id;
					return (
						<a onClick={() => getPodResources(rowIdx)}>
							<span >
								<i className="far fa-edit action mr-2"></i>
							</span>

						</a>
					);
				},
			}

		],
		[]
	);
	const filterTypes = React.useMemo(
		() => ({
			text: (rows, id, filterValue) => {
				return rows.filter((row) => {
					const rowValue = row.values[id];
					return rowValue !== undefined
						? String(rowValue)
							.toLowerCase()
							.startsWith(String(filterValue).toLowerCase())
						: true;
				});
			}
		}),
		[]
	);
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow, state, visibleColumns,
		preGlobalFilteredRows,
		setGlobalFilter, page,

		canPreviousPage,
		canNextPage,
		pageOptions,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		setPageSize,
		state: { pageIndex, pageSize },
	} = useTable({
		columns,
		data: resources, initialState: { pageSize: 8, pageIndex: 0 }, defaultColumn, filterTypes
	}, useFilters, useGlobalFilter, useSortBy, usePagination);

	return (
		<div className="list row">

			<div className="col-md-12 list table-responsive">
				<table className="table  table-striped table-sm table-bordered border-primary align-middle" {...getTableProps()}>

					{page.length > 0 ? <caption>Accessbile Namespaces and resources in use</caption> : <caption>No data found !!!</caption>}
					<thead className="">
						<th
							colSpan={visibleColumns.length}
							style={{
								textAlign: 'left',
							}}
						>
							<GlobalFilter
								preGlobalFilteredRows={preGlobalFilteredRows}
								globalFilter={state.globalFilter}
								setGlobalFilter={setGlobalFilter}
							/>
							<Link to={{ pathname: "/resources-export", state: { data: resources, costData: costData, cluster: cluster } }} >
								<button type="button" class="btn btn-light float-right" style={{ textTransform: 'none' }}>Export to File</button>
							</Link>
						</th>
						{headerGroups.map((headerGroup) => (
							<tr {...headerGroup.getHeaderGroupProps()}> {headerGroup.headers.map((column) => (
								<th {...column.getHeaderProps(column.getSortByToggleProps())}> {column.render("Header")} <span>{
									column.isSorted
										? column.isSortedDesc
											? ' 🔽'
											: ' 🔼'
										: ''
								}</span>
								</th>))} </tr>))}

					</thead>
					<tbody {...getTableBodyProps()}> {page.map((row, i) => {
						prepareRow(row); return (
							<tr {...row.getRowProps()}> {row.cells.map((cell) => {
								return (
									<><td {...cell.getCellProps()}>{cell.render("Cell")}</td>

									</>
								);
							})}


							</tr>);
					})} </tbody>
				</table>



				<Modal
					isOpen={modalIsOpen}
					style={modalStyles}
					onRequestClose={closeModal}
				>
					<div class="modal-header">
						<h6 class="modal-title">Resources useage in detail</h6>
						<button type="button" class="btn btn-secondary" style={{ textTransform: 'none' }} onClick={closeModal}>Close</button>
					</div>
					<div class="modal-body">
						<table class="table">
							<thead>
								<tr>
									<th scope="col">Pod Name</th>
									<th scope="col">Container name</th>
									<th scope="col">cpu</th>
									<th scope="col">memory</th>
								</tr>
							</thead>
							<tbody>


								{pods.length > 0 ?

									<>{pods.map((pod, index) => (<>
										{pod.containers.map((container, idx) => (
											<tr>
												<td scope="row">{idx == 0 ? pod.podName : null}</td>
												{pod.containers.length > 1 ? <td class="table-secondary">{container.containerName}</td> : <td>{container.containerName}</td>}
												{pod.containers.length > 1 ? <td class="table-secondary"> {container.cpuCores}</td> : <td>{container.cpuCores}</td>}
												{pod.containers.length > 1 ? <td class="table-secondary">{container.memoryBytes}</td> : <td>{container.memoryBytes}</td>}

											</tr>))}
									</>))}</>

									: <p> No Pods available </p>}

							</tbody>
						</table>

					</div>
				</Modal>

				{pageOptions.length > 0 ?
					<div className="pagination">
						<button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
							{'<<'}
						</button>{' '}
						<button onClick={() => previousPage()} disabled={!canPreviousPage}>
							{'<'}
						</button>{' '}
						<button onClick={() => nextPage()} disabled={!canNextPage}>
							{'>'}
						</button>{' '}
						<button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
							{'>>'}
						</button>{' '}

						<span>
							Page{' '}
							<strong>
								{pageIndex + 1} of {pageOptions.length}
							</strong>{' '}
						</span>
						{' '}
						<select
							value={pageSize}
							onChange={e => {
								setPageSize(Number(e.target.value))
							}}
						>
							{[8, 12, 16, 20].map(pageSize => (
								<option key={pageSize} value={pageSize}>
									Show {pageSize}
								</option>
							))}
						</select>
					</div>
					: null}

			</div>

		</div >
	);
};

export default Namespaces;