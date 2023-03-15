import { Modal, Table, useModal } from "@pankod/refine-antd";
import {
	Button,
	Chip,
	CreateButton,
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
	TextField
} from "@pankod/refine-mui";
import { IEvent, ITeam } from "interfaces/all";
import { useEffect, useState } from "react";
import { getAllEvents, getClubSlug, getEventsByClub, getTeamsExtQuery } from "utils/utils";
import { AddTeams } from "./add_teams";
import { TeamDetails } from "./team_details";

const availableFilters = [
	"Event",
	"Team name",
	"Team member Aura ID",
	"Payment status"
];

let paginationTs: any = null;

export const SearchTeams: React.FC = () => {
	const { modalProps, show, close } = useModal();

	// States
	const [access, setAccess] = useState<boolean>(true);
	const [searching, setSearching] = useState<boolean>(false);
	const [selectedTeam, setSelectedTeam] = useState<ITeam | null>(null);

	const [isMaster, setIsMaster] = useState<boolean>(false);
	const [filter, setFilter] = useState<number | null>(null);
	const [filters, setFilters] = useState<{
		event: string | null,
		teamName: string | null,
		teamMemberAuraId: string | null,
		paymentStatus: boolean | null,
	}>({
		event: null,
		teamName: null,
		teamMemberAuraId: null,
		paymentStatus: null
	});
	const [events, setEvents] = useState<Array<IEvent>>([]);
	const [teams, setTeams] = useState<Array<ITeam>>([]);

	let isError = true;

	// Event
	const [event, setEvent] = useState<string>("");

	function eventFilter() {
		return <FormControl fullWidth>
			<InputLabel>Select an Event</InputLabel>
			<Select
				error={(isError = event.length === 0)}
				value={event.length === 0 ? null : event}
				label="Select an Event"
				onChange={(event) => setEvent(event.target.value as string)}
			>
				{isMaster && <MenuItem value={"all"}><strong>All</strong></MenuItem>}
				{events.map((event) => <MenuItem value={event._id}><strong>{event.club}</strong>- {event.title}</MenuItem>)}
			</Select>
		</FormControl>;
	}

	// Team name
	const [teamName, setTeamName] = useState<string>("");

	function teamNameFilter() {
		return <TextField
			label="Enter team name (keywords)"
			variant="outlined"
			value={teamName}
			onChange={(event) => setTeamName(event.target.value)}
			error={(isError = teamName.trim().length === 0)}
			fullWidth />;
	}

	// Team member Aura ID
	const [teamMemberAuraId, setTeamMemberAuraId] = useState<string>("AURA23-");

	function teamMemberAuraIdFilter() {
		return <TextField
			label="Enter Aura ID (AURA23-ABC-12345)"
			variant="outlined"
			onChange={(event) => setTeamMemberAuraId(event.target.value)}
			value={teamMemberAuraId}
			error={(isError = !/AURA23-[a-z]{3}-[0-9]{5}/i.test(teamMemberAuraId))}
			fullWidth />;
	}

	// Payment status
	const [paymentStatus, setPaymentStatus] = useState<boolean>(true);

	function setPaymentStatusFilter() {
		isError = false;

		return <RadioGroup
			defaultValue={String(paymentStatus)}
			onChange={(event) => setPaymentStatus(event.target.value === "true")}
		>
			<FormControlLabel value="true" control={<Radio />} label="Paid" />
			<FormControlLabel value="false" control={<Radio />} label="Unpaid" />
		</RadioGroup >;
	}

	useEffect(() => {
		const clubSlug = getClubSlug();
		if (clubSlug === null)
			return setAccess(false);

		if (clubSlug === "*") {
			getAllEvents()
				.then(results => {
					if (results === null)
						return console.error("Failed to fetch events");

					setEvents(results.sort((l, r) => l.club.localeCompare(r.club)));
					setIsMaster(true);
				});
		} else {
			getEventsByClub(clubSlug)
				.then(results => {
					if (results === null)
						return console.error("Failed to fetch events");

					setEvents(results.sort((l, r) => l.club.localeCompare(r.club)));
					setIsMaster(false);
				});
		}
	}, []);

	if (!access)
		return <h1>No access!</h1>;

	function addFilter() {
		switch (filter) {
			case 0: {
				filters.event = event;

				break;
			}
			case 1: {
				filters.teamName = teamName;

				break;
			}
			case 2: {
				filters.teamMemberAuraId = teamMemberAuraId;

				break;
			}
			case 3: {
				filters.paymentStatus = paymentStatus;

				break;
			}
		}

		setFilter(null);
	}

	async function performSearch(reset: boolean = false) {
		setSearching(true);

		const {
			paginationTs: updatedPaginationTs,
			teams: newTeams,
		} = await getTeamsExtQuery({
			eventId: filters.event === "all" ? null : (filters.event as any),
			teamName: filters.teamName as any,
			teamMemberAuraId: filters.teamMemberAuraId as any,
			paymentStatus: filters.paymentStatus as any,
			paginationTs: reset ? Date.now() : paginationTs,
		});
		paginationTs = updatedPaginationTs;

		if (teams === null)
			return;

		if (reset)
			setTeams([...newTeams]);
		else
			setTeams([...teams, ...newTeams]);

		setSearching(false);
	}

	if (selectedTeam !== null)
		return <div>
			<h1>Displaying team "{selectedTeam.team_name}"</h1>
			<Button variant="outlined" color="info" onClick={() => setSelectedTeam(null)}>Go back</Button>
			<TeamDetails team_id={selectedTeam._id} />
		</div>;

	return <div>
		<h1>Search Teams</h1>
		<Show goBack={null} title="Apply filters" headerButtons={() => null}>
			<FormControl style={{ marginTop: "0.5cm" }} fullWidth>
				<InputLabel color="info">Select a Filter</InputLabel>
				<Select
					error={filters.event === null}
					value={filter ?? ""}
					label="Select a Filter"
					onChange={(selected_filter) => setFilter(selected_filter.target.value as number)}
				>
					{availableFilters.map((field, i) => <MenuItem value={i}>{field}</MenuItem>)}
				</Select>
				{
					filter !== null && <div style={{ paddingTop: "0.5cm" }}>
						{
							Array.of(
								eventFilter,
								teamNameFilter,
								teamMemberAuraIdFilter,
								setPaymentStatusFilter,
							).at(filter as number)!()
						}
						<Button disabled={isError} onClick={addFilter} style={{ marginTop: "0.5cm" }} variant="contained" color="info" fullWidth>Add Filter</Button>
					</div>
				}
			</FormControl>
			<div style={{ display: "flex" }}>
				{Object.keys(filters)
					.filter(key => (filters as any)[key] !== null)
					.map(key =>
						<Chip disabled={searching} clickable={!searching} onClick={() => {
							(filters as any)[key] = null;
							setFilters({ ...filters });
						}} style={{ margin: "0.5cm 0.25cm 0cm 0cm" }} label={`${key}: ${(filters as any)[key]}`} />
					)
				}
			</div>
			{filters.event === null &&
				<div>
					<br />
					<strong>Please add an Event filter to perform the search</strong>
				</div>
			}
			<Button
				onClick={() => performSearch(true)}
				disabled={searching || filters.event === null}
				style={{ marginTop: "0.5cm" }}
				variant="contained"
				color="secondary"
				fullWidth>
				Full Search
			</Button>
		</Show>
		<br />
		<List headerButtons={() => <CreateButton onClick={show} variant="contained" color="secondary" />}>
			<Table scroll={{ x: true }} dataSource={teams} pagination={false}>
				<Table.Column
					dataIndex="_id"
					title="Team #"
					render={(id, _, index) => <span>{index + 1}</span>}
				/>
				<Table.Column
					dataIndex="team_name"
					title="Team Name"
					render={(name, _, index) =>
						<Button variant="contained" color="secondary" onClick={() => {
							setSelectedTeam(teams[index]);
						}}>
							<span>{name}</span>
						</Button>
					}
				/>
				<Table.Column
					dataIndex="team_leader"
					title="Team Leader Name"
					render={(team_leader) => <span>{team_leader.name}</span>}
				/>
				<Table.Column
					dataIndex="team_leader"
					title="Team Leader Aura ID"
					render={(team_leader) => <span>{team_leader.aura_id}</span>}
				/>
				<Table.Column
					dataIndex="team_members"
					title="Team Members"
					render={(members: Array<any>) =>
						members.length === 0 ? <span>None</span> :
							<ul>
								{members.map(member => <li>{member.name}</li>)}
							</ul>
					}
				/>
			</Table>
		</List>

		<br />
		<RefreshButton
			fullWidth={true}
			onClick={() => performSearch()}
			disabled={!paginationTs || searching}>
			{paginationTs ? "Load next 20 results" : "No more results!"}
		</RefreshButton>

		<Modal
			{...modalProps}
			footer={null}
			onCancel={close}
		>
			<AddTeams />
		</Modal>
	</div>;
};