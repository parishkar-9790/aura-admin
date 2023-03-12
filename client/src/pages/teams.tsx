import React, { useState, useEffect } from "react";

import {
    List,
    Table,
} from "@pankod/refine-antd";
import { Button, RefreshButton } from '@pankod/refine-mui';

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
    onClick: Function;
}

interface IResults {
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
    team_members: Array<{
        usn: string;
        name: string;
    }>;
    createdAt: string;
    updatedAt: string;
    __v: number;
};

let paginationTs: any = Date.now();
let hasMoreResults = true;

export const PostTeams: React.FC<Props> = ({ eventId, onClick }) => {
    const [teams, setTeams] = useState<Array<IResults>>([]);

    async function loadTeams(clear: boolean = false) {
        if (!hasMoreResults)
            return;

        try {
            const response = await fetch(`http://localhost:4000/teams/event/${eventId}${paginationTs ? `?paginationTs=${paginationTs}` : ""}`);
            const json = await response.json();

            // Update paginationTs
            paginationTs = json.data.paginationTs;
            hasMoreResults = paginationTs !== null;

            if (!clear)
                setTeams([...teams, ...json.data.results]);
            else
                setTeams(json.data.results);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        console.log("Loading teams");

        paginationTs = Date.now();
        hasMoreResults = true;

        loadTeams(true);
    }, [eventId]);

    return (
        <div>
            <List>
                <Table dataSource={teams} pagination={false}>
                    <Table.Column
                        dataIndex="_id"
                        title="Team #"
                        render={(id, _, index) => <span>{index + 1}</span>}
                    />
                    <Table.Column
                        dataIndex="team_name"
                        title="Team Name"
                        render={(name, _, index) => <Button onClick={() => onClick(teams[index]._id)}><span>{name}</span></Button>}
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
            <RefreshButton fullWidth={true} onClick={() => {
                loadTeams();
            }} disabled={!hasMoreResults}>
                {hasMoreResults ? "Load next 20 results" : "No more results!"}
            </RefreshButton>
        </div>
    );
};
