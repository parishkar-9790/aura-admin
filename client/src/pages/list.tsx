import { RefreshButton } from '@pankod/refine-mui';
import React, { useEffect, useState } from 'react';
import clubs from "../crd.json"

import {
    List,
    Table,
} from "@pankod/refine-antd";

interface IData {
    success: boolean;
    error: boolean;
    data: {
        pageSize: number;
        resultsSize: number;
        paginationTs: any;
        results: Array<{
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
        }>;
    };
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

interface IUser {
    name: string;
    email: string;
    avatar: string;
}

let paginationTs: any = Date.now();
let hasMoreResults = true;

export const PostList = () => {
    const [data, setData] = useState<Array<IResults>>([]);
    const [user, setUser] = useState<IUser | null>(null);

    async function loadTeams() {
        if (!hasMoreResults)
            return;

        try {
            const response = await fetch(`http://localhost:4000/teams${paginationTs ? `?paginationTs=${paginationTs}` : ""}`);
            const json = await response.json();

            // Update paginationTs
            paginationTs = json.data.paginationTs;
            hasMoreResults = paginationTs !== null;

            setData([...data, ...json.data.results]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        loadTeams();
    }, []);

    useEffect(() => {
        const userJson = localStorage.getItem('user');
        if (userJson) {
            const userObj: IUser = JSON.parse(userJson);
            setUser(userObj);
        }
    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {user && (
                <div>
                    <h2>User Profile</h2>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <img src={user.avatar} alt="User Avatar" style={{ borderRadius: '50%', width: '100px', height: '100px' }} />

                </div>
            )}

            <List>
                <Table dataSource={data} pagination={false}>
                    <Table.Column
                        dataIndex="_id"
                        title="Team #"
                        render={(id, _, index) => <span>{index + 1}</span>}
                    />
                    <Table.Column
                        dataIndex="team_name"
                        title="Team Name"
                        render={(name) => <span>{name}</span>}
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
