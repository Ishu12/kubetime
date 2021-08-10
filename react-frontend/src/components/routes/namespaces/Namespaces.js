
import React, { useState, useEffect, useMemo, useRef } from 'react';
import DataService from '../../../restapi/data-service/DataService.js';
import PodResources from './PodResources.js';
import '../../../styles/componentstyles/table.css';


import { useTable, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce, usePagination } from "react-table";



const Namespaces = (props) => {

	const [resources, setResources] = useState([]);

	useEffect(async () => { retrieveResources(); }, []);


	const retrieveResources = () => {

		DataService.getResourcePerNamespaces({
			clusterId: "1111",
			userId: "1111"
		})
			.then((response) => {
				setResources(response.data);
			})
			.catch((e) => {
				console.log(e);
			});
	};


const openModal=(rowIndex)=> {
		alert('clicked'+rowIndex);
	};

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
				Header: "cpu-quota",
				accessor: "requestCpu",
				disableFilters: true,
			},
			{
				Header: "cpu-used",
				accessor: "usedCpu",
				disableFilters: true,
			},
			{
				Header: "memory-quota",
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
		        disableSort: true ,
		        Cell: (props) => {
		          const rowIdx = props.row.id;
		          return (
		            <a onClick={() => openModal(rowIdx)}>
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
				<table className="table  table-striped table-sm table-bordered border-primary align-middle" {...getTableProps()}><caption>Accessbile Namespaces and resources in use</caption>
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
				<PodResources/>

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
			</div>

		</div>
	);
};

export default Namespaces;