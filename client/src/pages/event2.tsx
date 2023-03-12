import React, { useEffect, useState } from 'react';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { PostTeams } from './teams';

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

export const PostEvents2: React.FC = () => {
    const [eventSelected, setEventSelected] = useState<{
        eventId: string | null,
        eventName: string | null,
    }>({ eventId: null, eventName: null });
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        fetch('http://localhost:4000/events/literary-club')
            .then((response) => response.json())
            .then((data: ApiData) => setEvents(data.data.events));
    }, []);

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
        <PostTeams eventId={eventSelected.eventId!} />
    </div>;
};

