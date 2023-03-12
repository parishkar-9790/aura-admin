// Icons
import { Person, People } from '@mui/icons-material';

import { CircularProgress, Link } from "@pankod/refine-mui";
import { useEffect, useState } from "react";
import { IUser, ITeam, IEvent } from "../interfaces/all";

import { getEvent, getTeam, getUser } from "../utils/utils";

import { Show, Typography, MarkdownField } from "@pankod/refine-antd";
import { UserDetails } from './user_details';
const { Title, Text } = Typography;

interface Props {
	team_id: string;
}

export const TeamDetails: React.FC<Props> = ({ team_id }) => {
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [team, setTeam] = useState<ITeam | null>(null);
	const [event, setEvent] = useState<IEvent | null>(null);
	const [users, setUsers] = useState<Array<IUser>>([]);

	useEffect(() => {
		getTeam(team_id)
			.then(async team => {
				// Set team
				setTeam(team);

				// Fetch and set event
				getEvent(team!.event_participated!.event_id)
					.then(event => {
						setEvent(event);
					});

				// Fetch all users
				const users: Array<IUser | null> = await Promise.all([
					getUser(team!.team_leader.id),
					...team!.team_members.map(team_member => getUser(team_member.id)),
				]);
				if (users.length !== users.filter(user => !!user).length)
					throw Error("Failed to retrieve some users!");

				setUsers(users as Array<IUser>);
				setIsLoading(false);
			});
	}, [team_id]);

	return (<Show headerButtons={() => null} title="" isLoading={isLoading}>
		<Title level={2}>
			{team ? `"${team.team_name}"` : "Loading..."}
		</Title>

		<Title level={3}>
			Leader details
		</Title>
		{!isLoading && <UserDetails user={users[0]} />}

		<Title level={3}>
			{`${team?.team_members.length} Team Member(s)`}
		</Title>
		{!isLoading && users.slice(1).map(user => <div>
			<UserDetails user={user} />
			<br />
		</div>)}
	</Show>);
};
