import { ITeam, IUser, IEvent, IReceipt } from "../interfaces/all";

export function sluggify(str: string | undefined) {
	return str?.trim().toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/, " ").split(" ").join("-");
};

export async function getTeam(team_id: string) {
	try {
		const response = await fetch(`http://localhost:4000/teams/${team_id}`);
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
		const response = await fetch(`http://localhost:4000/events/resolve/${event_id}`);
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

export async function getUser(user_id: string) {
	try {
		const response = await fetch(`http://localhost:4000/users/${user_id}`);
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
		const response = await fetch(`http://localhost:4000/receipts/team/${team_id}`);
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
