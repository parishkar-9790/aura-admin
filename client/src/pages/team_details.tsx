// Icons
import { Paid } from '@mui/icons-material';

import Moment from 'moment';

import { IUser, ITeam, IEvent, IReceipt } from "../interfaces/all";
import { getEvent, getReceiptByTeam, getTeam, getUser } from "../utils/utils";
import { UserDetails } from './user_details';

import { useEffect, useState } from "react";
import { Show, Typography, MarkdownField, Breadcrumb } from "@pankod/refine-antd";
import { Card, Tooltip } from '@material-ui/core';
import Popup from 'reactjs-popup';
const { Title, Text } = Typography;

interface Props {
	team_id: string;
}

export const TeamDetails: React.FC<Props> = ({ team_id }) => {
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [receipt, setReceipt] = useState<IReceipt | null>(null);
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

				// Check if team has been finalized
				setReceipt(await getReceiptByTeam(team!._id));
			});
	}, [team_id]);

	return (<Show headerButtons={() => null} title="" isLoading={isLoading}>
		<Title level={2}>
			{team ? `"${team.team_name}"` : "Loading..."}
			{receipt &&
				<Popup trigger={
					<Tooltip title="This team has completed the payment">
						<Paid style={{ marginLeft: "10px", height: "25px", cursor: "pointer" }} />
					</Tooltip>
				}>
					<Card elevation={5}>
						<div style={{ padding: "0.5cm 0.5cm 0.5cm 0.5cm" }}>
							<strong>Transaction ID:</strong>
							{` ${receipt!.transaction_id}`}
							<br />
							<Text> {Moment(receipt.createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a")} </Text>
						</div>
					</Card>
				</Popup>
			}
		</Title>

		<Title level={3}>
			Leader details
		</Title>
		{!isLoading && <UserDetails user={users[0]} style={{}} />}

		<Title level={3}>
			{`${team?.team_members.length} Team Member(s)`}
		</Title>
		{!isLoading && users.slice(1).map(user => <div>
			<UserDetails user={user} style={{}} />
			<br />
		</div>)}
	</Show>);
};
