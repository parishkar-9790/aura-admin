import ExcelJS from "exceljs";

import {
	Button,
	Card,
	CircularProgress,
	FormControl,
	InputLabel,
	MenuItem,
	Select
} from "@pankod/refine-mui";

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { IEvent, ITeamExt } from "interfaces/all";
import { useEffect, useState } from "react";
import { getAllEvents, getClubSlug, getCompleteTeamsByEvent, getEventsByClub, sleep, sluggify } from "utils/utils";

const downloadBufferAsExcelFile = (buffer: Buffer, fileName: string) => {
	const blob = new Blob([buffer], { type: 'application/vnd.ms-excel' });
	const blobUrl = URL.createObjectURL(blob);

	const downloadLink = document.createElement('a');
	downloadLink.href = blobUrl;
	downloadLink.download = fileName;

	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);

	URL.revokeObjectURL(blobUrl);
};

export const DownloaderPage: React.FC = () => {
	// States
	const [access, setAccess] = useState<boolean>(true);
	const [eventsLoading, setEventsLoading] = useState<boolean>(true);
	const [downloading, setDownloading] = useState<boolean>(false);
	const [preparing, setPreparing] = useState<boolean>(false);

	const [downloadProgress, setDownloadProgress] = useState<number>(0);

	const [events, setEvents] = useState<Array<IEvent>>([]);
	const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

	async function downloadTeams() {
		if (!access || eventsLoading || downloading || preparing || selectedEvent === null)
			return;

		setDownloadProgress(0);
		setDownloading(true);

		let paginationTs = Date.now();
		let teams: Array<ITeamExt> = [];
		while (paginationTs !== null) {
			const {
				paginationTs: newPaginationTs,
				teams: newTeams,
			} = await getCompleteTeamsByEvent(events[selectedEvent!]._id, paginationTs);

			paginationTs = newPaginationTs;
			teams.push(...newTeams);

			setDownloadProgress(teams.length);

			// Wait for some time (to avoid rate limiting)
			await sleep(1000);
		}

		setPreparing(true);
		setDownloading(false);

		// Create new workbook
		const workbook = new ExcelJS.Workbook();
		const sheet = workbook.addWorksheet('My Sheet');

		// Assign columns
		const teamSize = events[selectedEvent!].team_size - 1;
		const columns = [
			{ key: "_id", header: "Id" },
			{ key: "createdAt", header: "Creation time" },
			{ key: "team_name", header: "Team name" },
			{ key: "paid_status", header: "Paid status" },
			{ key: "receipt_date", header: "Receipt date" },
			{ key: "receipt_transaction_id", header: "Transaction ID" },
			{ key: "team_leader_name", header: "Team leader name" },
			{ key: "team_leader_auraId", header: "Team leader aura ID" },
			{ key: "team_leader_email", header: "Team leader email" },
			{ key: "team_leader_phone", header: "Team leader phone number" },
			{ key: "team_leader_clg", header: "Team leader College" },
			{ key: "team_leader_usn", header: "Team leader USN" },
			...(() => {
				const list: Array<{
					key: string,
					header: string,
				}> = [];
				Array.from({ length: teamSize })
					.forEach((_, index) => {
						list.push({
							key: `team_member_${index}_name`, header: `Team member ${index + 1} name`
						});
						list.push({
							key: `team_member_${index}_auraId`, header: `Team member ${index + 1} aura ID`
						});
						list.push({
							key: `team_member_${index}_email`, header: `Team member ${index + 1} email`
						});
						list.push({
							key: `team_member_${index}_phone`, header: `Team member ${index + 1} phone number`
						});
						list.push({
							key: `team_member_${index}_clg`, header: `Team member ${index + 1} College`
						});
						list.push({
							key: `team_member_${index}_usn`, header: `Team member ${index + 1} USN`
						});
					});

				return list;
			})(),

		];
		sheet.columns = columns;

		// Prepare data set
		for (let i = 0; i < teams.length; i++) {
			const team = teams[i];
			const row: String[] = [];

			// Id
			row.push(String(i + 1));

			// Creation time
			row.push(team.createdAt);

			// Team name
			row.push(team.team_name);

			// Paid status
			row.push(("receipt" in (team as any)) ? "Paid" : "Not Paid");

			// Receipt date
			row.push(team.receipt?.createdAt ?? "");

			// Receipt transaction id
			row.push(team.receipt?.transaction_id ?? "");

			// Team leader name
			row.push(team.team_leader_doc.name);

			// Team leader aura id
			row.push(team.team_leader_doc.aura_id);

			// Team leader email address
			row.push(team.team_leader_doc.email);

			// Team leader phone number
			row.push(team.team_leader_doc.phone);

			// Team leader college
			row.push(team.team_leader_doc.college);

			// Team leader USN
			row.push(team.team_leader_doc.usn);

			// Team members
			for (let j = 0; j < teamSize; j++) {
				const team_member = j < team.team_members_docs.length ? team.team_members_docs[j] : null;

				// Team member name
				row.push(team_member?.name ?? "");

				// Team member aura id
				row.push(team_member?.aura_id ?? "");

				// Team member email address
				row.push(team_member?.email ?? "");

				// Team member phone number
				row.push(team_member?.phone ?? "");

				// Team member college
				row.push(team_member?.college ?? "");

				// Team member USN
				row.push(team_member?.usn ?? "");
			}

			// Append row to dataSet
			sheet.addRow(row);

			// Sleep
			await sleep(50);
		}

		try {
			const buffer = await workbook.xlsx.writeBuffer();
			downloadBufferAsExcelFile(buffer as any, `${sluggify(events[selectedEvent!].title)}.xls`);
		} catch (error) {
			console.error(error);

			toast.error("An unknown error occurred while trying to download the Excel file!", {
				position: toast.POSITION.TOP_RIGHT
			});
			setPreparing(false);
			return;
		}

		setPreparing(false);
		toast.success("Excel file successfully downloaded!", {
			position: toast.POSITION.TOP_RIGHT
		});
	}

	useEffect(() => {
		const clubSlug = getClubSlug();
		if (clubSlug === null)
			return setAccess(false);

		if (clubSlug === "*")
			getAllEvents()
				.then(result => {
					if (result === null)
						return;

					setEvents(result.sort((l, r) => l.club.localeCompare(r.club)));
					setEventsLoading(false);
				});
		else
			getEventsByClub(clubSlug)
				.then(result => {
					if (result === null)
						return;

					setEvents(result.sort((l, r) => l.club.localeCompare(r.club)));
					setEventsLoading(false);
				});
	}, []);

	if (!access)
		return <h1>You don't have access!</h1>;

	return <div>
		<h1>Downloads</h1>
		<ToastContainer />

		<Card style={{ padding: "0.5cm 0.5cm 0.5cm 0.5cm" }}>
			<h2>Teams Downloader</h2>
			<FormControl fullWidth>
				<InputLabel>Select an Event</InputLabel>
				<Select
					error={selectedEvent === null}
					disabled={eventsLoading || downloading || preparing}
					value={selectedEvent}
					label="Select an Event"
					onChange={(event) => setSelectedEvent(event.target.value as number)}
				>
					{events.map((event, index) => <MenuItem value={index}><strong>{event.club}</strong>- {event.title}</MenuItem>)}
				</Select>
			</FormControl>
			{selectedEvent !== null &&
				<div>
					<br />
					<Button
						disabled={eventsLoading || downloading || preparing}
						variant="contained"
						onClick={() => downloadTeams()}
					>
						Download as Excel
					</Button>
				</div>
			}
		</Card>
		<br />
		{
			downloading &&
			<div>
				<CircularProgress color="secondary" />
				<h3>Downloaded {downloadProgress} teams...</h3>
			</div>
		}
		{
			preparing &&
			<div>
				<CircularProgress color="secondary" />
				<h3>Preparing an Excel sheet...</h3>
			</div>
		}
	</div>;
};
