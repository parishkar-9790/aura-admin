import React, { useEffect, useState } from 'react';

import assert from 'assert';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { PostTeams } from './teams';
import { TeamDetails } from './team_details';
import { sluggify } from "../utils/utils";
import crds from "../crd.json";

import { CircularProgress, Show } from '@pankod/refine-mui';
import { Typography } from '@pankod/refine-antd';
const { Title, Text } = Typography;


type Event = {
    _slugs: {
        title: string;
        club: string;
    };
    _id: string;
    title: string;
    club: string;
    description: string;
    team_size: number;
    rounds: number;
    registration_limit: string;
    rules: string[];
    event_coordinators: {
        _id: string;
        name: string;
        contact_number: string;
        image: string;
    }[];
    kind: string;
    link: boolean;
    registered_teams: any[];
    min_team_size: number;
};

type Data = {
    events: Event[];
};

type ApiData = {
    success: boolean;
    error: boolean;
    data: Data;
};

interface IUser {
    name: string;
    email: string;
    avatar: string;
}

interface User {
    timestamp: string;
    email: string;
    name: string;
    email2: string;
    usn: string;
    club: string;
}

function getClub(coordinators: any, usn: string) {
    if (!Object.keys(coordinators).includes(usn)) {
        console.error("Not allowed!");
        return;
    }

    const user: User = coordinators[usn]!;
    if (user.club === "*")
        return "*"

    return sluggify(user.club);
}

function groupBy(list: Array<any>, field: string) {
    const grouped: any = {};

    for (const item of list) {
        if (!(item[field] in grouped))
            grouped[item[field]] = [];
        grouped[item[field]].push(item);
    }

    return grouped;
}


export const PostEvents2: React.FC = () => {
    const coordinators: any = crds;

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [eventSelected, setEventSelected] = useState<{
        eventId: string | null,
        eventName: string | null,
    }>({ eventId: null, eventName: null });
    const [teamSelected, setTeamSelected] = useState<string | null>(null);
    const [events, setEvents] = useState<any>({});
    const [user, setUser] = useState<IUser | null>(null);

    useEffect(() => {
        const userJson = localStorage.getItem('user');
        if (userJson) {
            const userObj: IUser = JSON.parse(userJson);
            const usn = (userObj.email?.split("@")[0]?.toLowerCase().trim() ?? "");
            const clubSlug = getClub(coordinators, usn);

            if (clubSlug === "*") {
                // Load all events
                fetch(`http://localhost:4000/events/list`)
                    .then((response) => response.json())
                    .then((data: ApiData) => {
                        setUser(userObj);
                        setEvents(groupBy(data.data.events.sort((l, r) => l.club.localeCompare(r.club)), "club"));
                        setIsLoading(false);
                    });
            } else {
                // Load events
                fetch(`http://localhost:4000/events/${clubSlug}`)
                    .then((response) => response.json())
                    .then((data: ApiData) => {
                        setUser(userObj);
                        setEvents(groupBy(data.data.events.sort((l, r) => l.club.localeCompare(r.club)), "club"));
                        setIsLoading(false);
                    });
            }
        } else {
            console.error("There is no user in localStorage!");
        }
    }, []);

    if (isLoading)
        return <CircularProgress />

    if (teamSelected)
        return <div>
            <h1>Displaying Team</h1>
            <Button color='primary' onClick={() => setTeamSelected(null)}>Go back</Button>
            <br />
            <TeamDetails key="teamDetails" team_id={teamSelected} />
        </div>;

    if (eventSelected.eventId)
        return <div>
            <h1>Displaying Teams under "{eventSelected.eventName}"</h1>
            <Button color='primary' onClick={() => setEventSelected({ eventId: null, eventName: null })}>Go back</Button>
            <br />
            <PostTeams key="postTeams" eventId={eventSelected.eventId!} onClick={(_id: string) => setTeamSelected(_id)} />
        </div>;

    return (
        <div>
            <h1>Select an Event</h1>
            <Box display="flex" flexDirection="column" alignItems="center">
                {Object.keys(events).map((club: string) => {
                    return <div>
                        <Show title="" goBack={null} headerButtons={() => null}>
                            <Title level={3}>{club}</Title>

                            {events[club].sort((l: Event, r: Event) => l.title.localeCompare(r.title)).map((event: any) =>
                                <div>
                                    <Button style={{ marginBottom: "10px" }} variant="contained" color="primary" onClick={() => setEventSelected({ eventId: event._id, eventName: event.title })}>
                                        {event.title}
                                    </Button>
                                    <br />
                                </div>
                            )}
                        </Show>
                        <br />
                    </div>;
                })}
                {/* {Object.keys(events).map((club: string) => {
                    return <div>
                        <Box key={club} m={2}>
                            <h2 style={{ color: "#5555bb" }}>{club}</h2>
                        </Box>
                        {events[club].sort((l: Event, r: Event) => l.title.localeCompare(r.title)).map((event: any) =>
                            <div>
                                <Button style={{ marginBottom: "10px" }} variant="outlined" color="primary" onClick={() => setEventSelected({ eventId: event._id, eventName: event.title })}>
                                    {event.title}
                                </Button>
                                <br />
                            </div>
                        )}
                    </div>;
                })} */}
            </Box>
        </div>
    );
};

