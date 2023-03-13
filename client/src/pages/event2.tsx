import React, { useEffect, useState } from 'react';

import Box from '@material-ui/core/Box';
import { PostTeams } from './teams';
import { TeamDetails } from './team_details';
import { sluggify, getAllEvents, getEventsByClub } from "../utils/utils";
import { toast } from 'react-toastify';
import crds from "../crd.json";

import { Button, CircularProgress, Show } from '@pankod/refine-mui';
import { Typography } from '@pankod/refine-antd';
import { useAuthenticated, useLogout } from '@pankod/refine-core';
import { useNavigate } from '@pankod/refine-react-router-v6';
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
        return null;
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

    const { mutate: logout } = useLogout();
    const { isSuccess } = useAuthenticated();
    const [access, setAccess] = useState<boolean>(true);
    const navigate = useNavigate();

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
                getAllEvents()
                    .then(events => {
                        setUser(userObj);
                        setEvents(groupBy(events!.sort((l, r) => l.club.localeCompare(r.club)), "club"));
                        setIsLoading(false);
                    });
            } else if (clubSlug !== null) {
                // Load events
                getEventsByClub(clubSlug!)
                    .then(events => {
                        setUser(userObj);
                        setEvents(groupBy(events!.sort((l, r) => l.club.localeCompare(r.club)), "club"));
                        setIsLoading(false);
                    });
            } else
                setAccess(false);
        } else {
            setAccess(false);
        }
    }, []);

    if (!access && isSuccess) {
        toast.error("Sorry! You are not authorized to use the Aura Admin Dashboard.", {
            position: toast.POSITION.TOP_RIGHT
        });

        logout();
        navigate("/login");

        return <div></div>;
    }

    if (teamSelected)
        return <div>
            <h1>Displaying Team</h1>
            <Button variant="outlined" color='info' onClick={() => setTeamSelected(null)}>Go back</Button>
            <br />
            <TeamDetails key="teamDetails" team_id={teamSelected} />
        </div>;

    if (eventSelected.eventId)
        return <div>
            <h1>Displaying Teams under "{eventSelected.eventName}"</h1>
            <Button variant="outlined" color='info' onClick={() => setEventSelected({ eventId: null, eventName: null })}>Go back</Button>
            <br />
            <PostTeams key="postTeams" eventId={eventSelected.eventId!} onClick={(_id: string) => setTeamSelected(_id)} />
        </div>;

    return (
        <div>
            <h1>Select an Event</h1>
            {isLoading ?
                <CircularProgress /> :
                <Box display="flex" flexDirection="column">
                    {Object.keys(events).map((club: string) => {
                        return <div>
                            <Show title="" goBack={null} headerButtons={() => null}>
                                <Title level={3}>{club}</Title>

                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    {events[club].sort((l: Event, r: Event) => l.title.localeCompare(r.title)).map((event: any) =>
                                        <Button variant="contained" color="info" style={{ marginBottom: "10px" }} onClick={() => setEventSelected({ eventId: event._id, eventName: event.title })}>
                                            {event.title}
                                        </Button>
                                    )}
                                </div>
                            </Show>
                            <br />
                        </div>;
                    })}
                </Box>}
        </div>
    );
};

