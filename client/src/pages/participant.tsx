import React from "react";
import { useList } from '@pankod/refine-core';
import { Box, Typography } from "@pankod/refine-mui";
import axios from 'axios';

export const Participant = () => {
    const [participants, setParticipants] = React.useState([]);

    React.useEffect(() => {
        const fetchParticipants = async () => {
            const response = await axios.get("https://aura.git.edu/teams/event");
            setParticipants(response.data.data);
        };

        fetchParticipants();
    }, []);

    const { data, isLoading, isError } = useList({
        resource: "participants",
    });

    const allTeams = data?.data;

    return (
        <div>
            participants
            {allTeams && allTeams.map((team: any) => (
                <Box key={team.id} my={2}>
                    <Typography variant="h6">{team.team_name}</Typography>
                    <Typography variant="body1">Leader: {team.team_leader.name}</Typography>
                    <Typography variant="body1">Members: {team.team_members.join(", ")}</Typography>
                </Box>
            ))}
        </div>
    );
};

export default Participant;
