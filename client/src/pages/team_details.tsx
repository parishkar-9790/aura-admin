// Icons
import { Person, People } from '@mui/icons-material';

import { CircularProgress, Link } from "@pankod/refine-mui";
import { useEffect, useState } from "react";
import { IUser, ITeam, IEvent } from "../interfaces/all";

import { Show, Typography, MarkdownField } from "@pankod/refine-antd";
const { Title, Text } = Typography;

interface Props {
	team_id: string;
}

async function getTeam(team_id: string) {
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
}

async function getEvent(event_id: string) {
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
}

export const TeamDetails: React.FC<Props> = ({ team_id }) => {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isLoading2, setIsLoading2] = useState<boolean>(false);

	const [team, setTeam] = useState<ITeam | null>(null);
	const [event, setEvent] = useState<IEvent | null>(null);

	useEffect(() => {
		getTeam(team_id)
			.then(team => {
				setTeam(team);
				setIsLoading(false);
				setIsLoading2(true);

				getEvent(team!.event_participated!.event_id)
					.then(event => {
						setEvent(event);
						setIsLoading2(false);
					});
			});
	}, [team_id]);

	return (<Show title="" isLoading={isLoading}>
		<Title level={3}>
			Team name
		</Title>
		<Text>
			{team?.team_name}
		</Text>

		<Title level={3}>
			<Person style={{ width: "auto", paddingRight: "5px" }} />
			Leader details
		</Title>
		<Text>
			{team?.team_leader.name}
		</Text>
		<br />
		<Text strong={true}>
			{team?.team_leader.aura_id}
		</Text>
		<br />
		<Link href={`mailto:${team?.team_leader.email}`}>
			{team?.team_leader.email}
		</Link>

		<Title level={3}>
			<People style={{ width: "auto", paddingRight: "5px" }} />
			{`${team?.team_members.length} Team Member(s)`}
		</Title>
	</Show>);
};
