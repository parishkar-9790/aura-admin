import React, { useState, useEffect } from "react";

import {
    List,
    Table,
} from "@pankod/refine-antd";
import { Button, RefreshButton } from '@pankod/refine-mui';
import { getTeamsByEvent } from "utils/utils";

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

    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

    useEffect(() => {
        paginationTs = Date.now();
        hasMoreResults = true;

        getTeamsByEvent(eventId, paginationTs)
            .then(data => {
                paginationTs = data.paginationTs;
                hasMoreResults = paginationTs !== null;
                setTeams(data.teams);
            });
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
                        render={(name, _, index) => <Button variant="contained" onClick={() => onClick(teams[index]._id)}><span>{name}</span></Button>}
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
                setIsLoadingMore(true);

                getTeamsByEvent(eventId, paginationTs)
                    .then(data => {
                        paginationTs = data.paginationTs;
                        hasMoreResults = paginationTs !== null;
                        setTeams([...teams, ...data.teams]);

                        setIsLoadingMore(false);
                    });
            }} disabled={isLoadingMore || !hasMoreResults}>
                {hasMoreResults ? "Load next 20 results" : "No more results!"}
            </RefreshButton>
        </div>
    );
};
