import { Card, CircularProgress } from "@pankod/refine-mui";
import { MonetizationOnRounded, MoneyOff, People } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { getNumberOfPaidTeams, getNumberOfUnpaidTeams, getTotalParticipantsCount } from "utils/utils";

export const StatsPage: React.FC = () => {
	const [totalParticipation, setTotalParticipation] = useState<number | null>(null);
	const [paidTeams, setPaidTeams] = useState<number | null>(null);
	const [unpaidTeams, setUnpaidTeams] = useState<number | null>(null);

	useEffect(() => {
		getTotalParticipantsCount()
			.then(count => {
				if (count === null)
					return console.error("Failed to get count!");

				setTotalParticipation(count);
			});

		getNumberOfPaidTeams()
			.then(count => {
				if (count === null)
					return console.error("Failed to get count!");

				setPaidTeams(count);
			});

		getNumberOfUnpaidTeams()
			.then(count => {
				if (count === null)
					return console.error("Failed to get count!");

				setUnpaidTeams(count);
			});
	}, []);

	return <div>
		<h1>Stats</h1>
		<br />
		<Card style={{ padding: "1cm", display: "flex", flexDirection: "column" }}>
			{totalParticipation !== null ? (
				<div>
					<span style={{ fontSize: "40px", color: "#9999ff" }}>
						<strong>{totalParticipation.toLocaleString("en-IN")}</strong>
					</span>
					<h3>
						<People fontSize="inherit" /> Total Participants
					</h3>
				</div>
			) : <CircularProgress />}
		</Card>
		<br />
		<Card style={{ padding: "1cm", display: "flex", flexDirection: "column" }}>
			{paidTeams !== null ?
				<div>
					<span style={{ fontSize: "40px", color: "green" }}>
						<strong>{paidTeams.toLocaleString("en-IN")}</strong>
					</span>
					<h3>
						Teams have registered and <MonetizationOnRounded fontSize="inherit" /> have paid
					</h3>
				</div> : <CircularProgress />}
			<br />
			<br />
			{unpaidTeams !== null ?
				<div>
					<span style={{ fontSize: "40px", color: "red" }}>
						<strong>{unpaidTeams.toLocaleString("en-IN")}</strong>
					</span>
					<h3>
						Teams have registered but <MoneyOff fontSize="inherit" /> not paid
					</h3>
				</div> : <CircularProgress />}
		</Card>
		<br />
	</div>;
};
