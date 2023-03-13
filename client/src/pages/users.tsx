import {
	Autocomplete,
	Button,
	Card,
	Chip,
	CircularProgress,
	FormControl,
	FormControlLabel,
	InputLabel,
	List,
	MenuItem,
	Radio,
	RadioGroup,
	RefreshButton,
	Select,
	Show,
	TextField,
} from "@pankod/refine-mui";
import { Search, Error } from "@mui/icons-material";
import { useEffect, useState } from "react";
import isEmail from 'validator/lib/isEmail';

import colleges from "../datasets/colleges.json";
import { getUsers } from "utils/utils";
import { IUser } from "interfaces/all";
import { Table } from "@pankod/refine-antd";
import Popup from "reactjs-popup";
import { UserDetails } from "./user_details";

const availableFilters = [
	"Name",
	"Email",
	"College",
	"USN",
	"Aura ID",
	"Phone number",
	"Email verified status"
];

let paginationTs: any = null;

export const ListUsers: React.FC = () => {
	// States
	const [searching, setSearching] = useState<boolean>(false);
	const [errors, setErrors] = useState<boolean>(false);

	const [users, setUsers] = useState<Array<IUser>>([]);

	// Select a Filter
	const [filter, setFilter] = useState<Number | null>(null);
	const [filters, setFilters] = useState<any>({
		name: null,
		email: null,
		college: null,
		usn: null,
		auraId: null,
		phone: null,
		emailVerified: null
	});

	useEffect(() => {
		paginationTs = null;
		setUsers([]);
	}, [filters]);

	let isError = true;

	// Name
	const [name, setName] = useState<string>("");

	function nameFilter() {
		return <TextField
			label="Enter name"
			variant="outlined"
			value={name}
			onChange={(event) => setName(event.target.value)}
			error={(isError = name.trim().length === 0)}
			fullWidth />;
	}

	// Email
	const [email, setEmail] = useState<string>("");

	function emailFilter() {
		return <TextField
			label="Enter email address"
			variant="outlined"
			inputMode="email"
			value={email}
			onChange={(event) => setEmail(event.target.value)}
			error={(isError = !isEmail(email))}
			fullWidth />;
	}

	// College
	const [college, setCollege] = useState<string>("");

	function collegeFilter() {
		isError = false;

		return <Autocomplete
			freeSolo
			options={colleges.map((option) => option.college)}
			inputValue={college}
			onInputChange={(event, newInputValue) => {
				setCollege(newInputValue);
			}}
			renderInput={(params) => <TextField {...params} label="Enter the college name" error={(isError = college.trim().length === 0)} />}
		/>;
	}

	// USN
	const [usn, setUsn] = useState<string>("");

	function usnFilter() {
		return <TextField
			label="Enter USN"
			variant="outlined"
			value={usn}
			onChange={(event) => setUsn(event.target.value)}
			error={(isError = usn.trim().length === 0)}
			fullWidth />;
	}

	// Aura ID
	const [auraId, setAuraId] = useState<string>("AURA23-");

	function auraIdFilter() {
		return <TextField
			label="Enter Aura ID (AURA23-ABC-12345)"
			variant="outlined"
			onChange={(event) => setAuraId(event.target.value)}
			value={auraId}
			error={(isError = !/AURA23-[a-z]{3}-[0-9]{5}/i.test(auraId))}
			fullWidth />;
	}

	// Phone number
	const [phone, setPhone] = useState<string>("");

	function phoneFilter() {
		return <TextField
			label="Enter Phone number"
			variant="outlined"
			onChange={(event) => setPhone(event.target.value)}
			value={phone}
			error={(isError = !/[0-9]+/.test(phone))}
			fullWidth />;
	}

	// Email verified
	const [emailVerified, setEmailVerified] = useState<boolean>(true);

	function emailVerifiedFilter() {
		isError = false;

		return <RadioGroup
			defaultValue={String(emailVerified)}
			name="email-verified-group"
			onChange={(event) => setEmailVerified(event.target.value === "true")}
		>
			<FormControlLabel value="true" control={<Radio />} label="Verified" />
			<FormControlLabel value="false" control={<Radio />} label="Unverified" />
		</RadioGroup >;
	}

	function addFilter() {
		switch (filter) {
			case 0: {
				filters.name = name;

				break;
			}
			case 1: {
				filters.email = email;

				break;
			}
			case 2: {
				filters.college = college;

				break;
			}
			case 3: {
				filters.usn = usn;

				break;
			}
			case 4: {
				filters.auraId = auraId;

				break;
			}
			case 5: {
				filters.phone = phone;

				break;
			}
			case 6: {
				filters.emailVerified = emailVerified;

				break;
			}
		}

		setFilter(null);
	}

	async function performSearch(reset: boolean = false) {
		setSearching(true);

		const { paginationTs: updatedPaginationTs, users: newUsers } = await getUsers({
			aura_id: filters.auraId,
			email: filters.email,
			college: filters.college,
			name: filters.name,
			usn: filters.usn,
			phone: filters.phone,
			email_verified: filters.emailVerified,
			paginationTs: reset ? Date.now() : paginationTs,
		});
		paginationTs = updatedPaginationTs;

		if (users === null)
			return setErrors(true);

		if (reset)
			setUsers([...newUsers]);
		else
			setUsers([...users, ...newUsers]);
		setSearching(false);
	}

	if (errors)
		return <Error />;

	return <div>
		<h1>Search Users</h1>
		<Show goBack={null} title="Apply filters" headerButtons={() => null}>
			<FormControl style={{ marginTop: "0.5cm" }} fullWidth>
				<InputLabel id="demo-simple-select-label" color="info">Select a Filter</InputLabel>
				<Select
					disabled={searching}
					labelId="demo-simple-select-label"
					id="demo-simple-select"
					value={filter ?? ""}
					label="Select a Filter"
					error={Object.keys(filters).filter(key => filters[key] !== null).length === 0}
					onChange={(selected_filter) => setFilter(selected_filter.target.value as Number)}
				>
					{availableFilters.map((field, i) => <MenuItem value={i}>{field}</MenuItem>)}
				</Select>
				{
					filter !== null && <div style={{ paddingTop: "0.5cm" }}>
						{
							Array.of(
								nameFilter,
								emailFilter,
								collegeFilter,
								usnFilter,
								auraIdFilter,
								phoneFilter,
								emailVerifiedFilter,
							).at(filter as number)!()
						}
						<Button disabled={isError} onClick={addFilter} style={{ marginTop: "0.5cm" }} variant="contained" color="info" fullWidth>Add Filter</Button>
					</div>
				}
			</FormControl>
			<div style={{ display: "flex" }}>
				{Object.keys(filters)
					.filter(key => filters[key] !== null)
					.map(key =>
						<Chip disabled={searching} clickable={!searching} onClick={() => {
							filters[key] = null;
							setFilters({ ...filters });
						}} style={{ margin: "0.5cm 0.25cm 0cm 0cm" }} label={`${key}: ${filters[key]}`} />
					)
				}
			</div>
			<Button
				disabled={searching || Object.keys(filters).filter(key => filters[key] !== null).length === 0}
				onClick={() => performSearch(true)}
				style={{ marginTop: "0.5cm" }}
				variant="contained"
				color="secondary"
				fullWidth>
				<Search />
				Full Search
			</Button>
		</Show>
		<br />
		{searching && <CircularProgress />}
		<List>
			<Table dataSource={users} pagination={false} rowKey="_id">
				<Table.Column
					dataIndex="_id"
					title="User #"
					render={(_, __, index) => <span>{index + 1}</span>}
				/>
				<Table.Column
					dataIndex="name"
					title="Name"
					render={(name, _, index) => <Popup position="right center" trigger={<Button variant="contained" color="secondary">{name}</Button>}>
						<Card elevation={5}>
							<div style={{ padding: "0.5cm 0.5cm 0.5cm 0.5cm" }}>
								<UserDetails user={users[index]} style={{}} />
							</div>
						</Card>
					</Popup>}
				/>
				<Table.Column
					dataIndex="aura_id"
					title="Aura ID"
					render={(aura_id) => <span>{aura_id}</span>}
				/>
				<Table.Column
					dataIndex="email"
					title="Email ID"
					render={(email) => <span>{email}</span>}
				/>
			</Table>
		</List>
		<br />
		<RefreshButton
			fullWidth={true}
			onClick={() => performSearch()}
			disabled={!paginationTs}>
			{paginationTs ? "Load next 20 results" : "No more results!"}
		</RefreshButton>
	</div>;
};
