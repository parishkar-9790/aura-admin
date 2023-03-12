import React, { useEffect, useState } from 'react';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { PostTeams } from './teams';
import { TeamDetails } from './team_details';
const test: User[] = require('../crd.json');
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
export const PostEvents2: React.FC = () => {
    const [eventSelected, setEventSelected] = useState<{
        eventId: string | null,
        eventName: string | null,
    }>({ eventId: null, eventName: null });
    const [teamSelected, setTeamSelected] = useState<string | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [user, setUser] = useState<IUser | null>(null);

    const email = user?.email;
    const usn = (email?.split("@")[0]?.toUpperCase() ?? "");
    // console.log(usn)
    function sluggify(str: string | undefined) {
        return str?.trim().toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/, " ").split(" ").join("-");
    }
    useEffect(() => {
        const userJson = localStorage.getItem('user');
        if (userJson) {
            const userObj: IUser = JSON.parse(userJson);
            setUser(userObj);
        }
    }, []);
    function getClub(usn: string) {
        const user = test.find((user) => user.usn === usn);
        console.log(sluggify(user?.club))
        return user ? sluggify(user.club) : '';
    }
    useEffect(() => {
        fetch(`http://localhost:4000/events/${(getClub(usn))}}`)
            .then((response) => response.json())
            .then((data: ApiData) => setEvents(data.data.events));
    }, []);

    if (teamSelected)
        return <div>
            <h1>Displaying Team</h1>
            <Button color='primary' onClick={() => setTeamSelected(null)}>Go back</Button>
            <br />
            <TeamDetails team_id={teamSelected} />
        </div>;

    if (!eventSelected.eventId) {
        return (
            <div>
                <h1>Select an Event</h1>
                <Box display="flex" flexDirection="column" alignItems="center">
                    {events.map((event) => (
                        <div>
                            <Box key={event._id} m={2}>
                                <Button variant="contained" color="primary" onClick={() => setEventSelected({ eventId: event._id, eventName: event.title })}>
                                    {event.title}
                                </Button>
                            </Box>
                            <br />
                        </div>
                    ))}
                </Box>
            </div>
        );
    }

    return <div>
        <h1>Displaying Teams under "{eventSelected.eventName}"</h1>
        <Button color='primary' onClick={() => setEventSelected({ eventId: null, eventName: null })}>Go back</Button>
        <br />
        <PostTeams eventId={eventSelected.eventId!} onClick={(_id: string) => setTeamSelected(_id)} />
    </div>;
};

