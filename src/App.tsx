import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
	const [users, setUsers] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [nameFilter, setNameFilter] = useState('');
	const [cityFilter, setCityFilter] = useState('');
	const [highlightOldest, setHighlightOldest] = useState(false);

	useEffect(() => {
		fetch('https://dummyjson.com/users')
			.then((response) => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then((data) => {
				const usersData = data.users.map((user) => ({
					id: user.id,
					firstName: user.firstName,
					lastName: user.lastName,
					city: user.address.city,
					birthDate: user.birthDate,
				}));
				setUsers(usersData);
				setFilteredUsers(usersData);
			})
			.catch((error) => {
				console.error(
					'There has been a problem with your fetch operation:',
					error
				);
			});
	}, []);

	useEffect(() => {
		let filtered = users;

		if (nameFilter) {
			filtered = filtered.filter(
				(user) =>
					user.firstName
						.toLowerCase()
						.includes(nameFilter.toLowerCase()) ||
					user.lastName
						.toLowerCase()
						.includes(nameFilter.toLowerCase())
			);
		}

		if (cityFilter) {
			filtered = filtered.filter((user) => user.city === cityFilter);
		}

		if (highlightOldest) {
			const oldestUsers = filtered.reduce((acc, user) => {
				if (
					!acc[user.city] ||
					new Date(user.birthDate) <
						new Date(acc[user.city].birthDate)
				) {
					acc[user.city] = user;
				}
				return acc;
			}, {});

			filtered = Object.values(oldestUsers);
		}

		setFilteredUsers(filtered);
	}, [nameFilter, cityFilter, highlightOldest, users]);

	return (
		<div className="App">
			<h1 style={{ color: '#3498db' }}>DPS Frontend Coding Challenge</h1>
			<div className="search-bar">
				<input
					type="text"
					placeholder="Search by name"
					value={nameFilter}
					onChange={(e) => setNameFilter(e.target.value)}
				/>
				<select
					value={cityFilter}
					onChange={(e) => setCityFilter(e.target.value)}
				>
					<option value="">All Cities</option>
					{Array.from(new Set(users.map((user) => user.city))).map(
						(city) => (
							<option key={city} value={city}>
								{city}
							</option>
						)
					)}
				</select>
				<label className="highlight-text">
					Highlight oldest per city
				</label>
				<input
					type="checkbox"
					className="highlight-checkbox"
					checked={highlightOldest}
					onChange={(e) => setHighlightOldest(e.target.checked)}
				/>
			</div>
			{filteredUsers.length > 0 ? (
				<div className="user-table">
					<div className="table-header">
						<div className="table-cell">Name</div>
						<div className="table-cell">City</div>
						<div className="table-cell">Birthday</div>
					</div>
					{filteredUsers.map((user) => (
						<div
							key={user.id}
							className={`table-row ${
								highlightOldest ? 'highlighted' : ''
							}`}
						>
							<div className="table-cell">
								{user.firstName} {user.lastName}
							</div>
							<div className="table-cell">{user.city}</div>
							<div className="table-cell">{user.birthDate}</div>
						</div>
					))}
				</div>
			) : (
				<p>No users found.</p>
			)}
		</div>
	);
}

export default App;
