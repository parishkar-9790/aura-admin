import { ITeam, IUser, IEvent, IReceipt } from "../interfaces/all";

const HOST = "https://aura.git.edu";

export function sluggify(str: string | undefined) {
	return str?.trim().toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/, " ").split(" ").join("-");
};

export async function getTeams(paginationTs: any) {
	try {
		const response = await fetch(`${HOST}/teams${paginationTs ? `?paginationTs=${paginationTs}` : ""}`);
		const json = await response.json();

		return {
			paginationTs: json.data.paginationTs,
			teams: json.data.results,
		};
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			paginationTs: null,
			teams: [],
		};
	}
};

export async function getTeamsByEvent(event_id: string, paginationTs: any) {
	try {
		const response = await fetch(`${HOST}/teams/event/${event_id}${paginationTs ? `?paginationTs=${paginationTs}` : ""}`);
		const json = await response.json();

		return {
			paginationTs: json.data.paginationTs,
			teams: json.data.results,
		};
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			paginationTs: null,
			teams: [],
		};
	}
};

export async function getTeam(team_id: string) {
	try {
		const response = await fetch(`${HOST}/teams/${team_id}`);
		if (response.status !== 200)
			return null;

		const json = await response.json();
		if (!json.success) {
			console.error("Error code:", json.error);
			return null;
		}

		const data = json.data;
		const team = data.team as ITeam;

		return team;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export async function getEvent(event_id: string) {
	try {
		const response = await fetch(`${HOST}/events/resolve/${event_id}`);
		if (response.status !== 200)
			return null;

		const json = await response.json();
		if (!json.success) {
			console.error("Error code:", json.error);
			return null;
		}

		const data = json.data;
		const event = data.event as IEvent;

		return event;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export async function getAllEvents() {
	try {
		const response = await fetch(`${HOST}/events/list`);
		if (response.status !== 200)
			return null;

		const json = await response.json();
		if (!json.success) {
			console.error("Error code:", json.error);
			return null;
		}

		const events: Array<IEvent> = json.data.events;
		return events;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getEventsByClub(clubSlug: string) {
	try {
		const response = await fetch(`${HOST}/events/${clubSlug}`);
		if (response.status !== 200)
			return null;

		const json = await response.json();
		if (!json.success) {
			console.error("Error code:", json.error);
			return null;
		}

		const events: Array<IEvent> = json.data.events;
		return events;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getUser(user_id: string) {
	try {
		const response = await fetch(`${HOST}/users/${user_id}`);
		if (response.status !== 200)
			return null;

		const json = await response.json();
		if (!json.success) {
			console.error("Error code:", json.error);
			return null;
		}

		const data = json.data;
		const user = data.user as IUser;

		return user;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export async function getReceiptByTeam(team_id: string) {
	try {
		const response = await fetch(`${HOST}/receipts/team/${team_id}`);
		if (response.status !== 200)
			return null;

		const json = await response.json();
		if (!json.success) {
			console.error("Error code:", json.error);
			return null;
		}

		const data = json.data;
		const receipt = data.receipt as IReceipt;

		return receipt;
	} catch (error) {
		console.error(error);
		return null;
	}
}
