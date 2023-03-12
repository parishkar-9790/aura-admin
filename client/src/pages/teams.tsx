import React, { useState, useEffect } from "react";

interface TeamMember {
    id: string;
    aura_id: string;
    email: string;
    usn: string;
    name: string;
    _id: string;
}

interface Team {
    event_participated: {
        event_id: string;
        event_title: string;
    };
    team_leader: {
        id: string;
        aura_id: string;
        usn: string;
        name: string;
        email: string;
    };
    _id: string;
    team_name: string;
    team_members: TeamMember[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface ApiResponse {
    success: boolean;
    error: boolean;
    data: {
        pageSize: number;
        resultsSize: number;
        paginationTs: null | string;
        results: Team[];
    };
}

interface Props {
    eventId: string;
}

export const PostTeams: React.FC<Props> = ({ eventId }) => {
    const [teams, setTeams] = useState<Team[]>([]);

    useEffect(() => {
        fetch(`http://localhost:4000/teams/event/${eventId}`)
            .then((response) => response.json())
            .then((data: ApiResponse) => {
                setTeams(data.data.results);
            });
    }, [eventId]);

    return (
        <table>
            <thead>
            <tr>
                <th>Team Name</th>
                <th>Team Leader</th>
                <th>Leader's USN</th>
                <th>Team Members</th>
                <th>Member's USN</th>
            </tr>
            </thead>
            <tbody>
            {teams.map((team) => (
                <tr key={team._id}>
                    <td>{team.team_name}</td>
                    <td>{team.team_leader.name}</td>
                    <td>{team.team_leader.usn}</td>
                    <td>
                        {team.team_members.map((member) => (
                            <div key={member._id}>{member.name}</div>
                        ))}
                    </td>
                    <td>
                        {team.team_members.map((member) => (
                            <div key={member._id}>{member.usn}</div>
                        ))}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};
