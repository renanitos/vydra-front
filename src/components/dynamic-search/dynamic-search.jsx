import React, { useState } from 'react';
import { TextField, InputAdornment } from '@material-ui/core';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import './dynamic-search.scss';

function DynamicSearch(props) {
	const items = [...props.data];
	const property = props.lookup;
	const placeholder = props.placeholder;

	const [state, setState] = useState('');
	const [results, setResults] = useState([]);

	const handleChange = (e) => {
		const { value } = e.target;
		setState(value);
		if (!value || value.length < 2) {
			return;
		}
		const results = items.filter((item) => item[property].toLowerCase().includes(value.toLocaleLowerCase()));
		setResults(results);
	};

	return (
		<div className="search-bar">
			<TextField
				className="search-box"
				value={state}
				onChange={handleChange}
				variant="outlined"
				placeholder={placeholder}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<HiMagnifyingGlass />
						</InputAdornment>
					),
				}}
			/>
			<ul>
				{(state && !results.length ? "Your query did not return any results" : results.map(item => {
					return <li key={item.id}>{item.name}</li>
				}))}
			</ul>
		</div>
	);
}

export default DynamicSearch;
