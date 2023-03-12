import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { PostTeams } from './teams';
import Crd from '../crd.json'

import {Table, TableBody, TableContainer, TableHead, TableRow } from '@pankod/refine-mui';
import {Paper, TableCell} from "@material-ui/core";

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

type EventDetails = {
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

export const PostEvents: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [buttonClicked, setButtonClicked] = useState(false);
    const [clickedEventId, setClickedEventId] = useState<string | null>(null);
    const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);

    useEffect(() => {
        fetch('http://localhost:4000/events/literary-club')
            .then((response) => response.json())
            .then((data: ApiData) => setEvents(data.data.events));
    }, []);

    const handleButtonClick = (eventId: string) => {
        console.log(`Clicked event with ID ${eventId}`);
        fetch(`http://localhost:4000/teams/event/${eventId}`)
            .then((response) => response.json())
            .then((data: ApiData) => {
                if (data.data.events && data.data.events.length > 0) {
                    setEventDetails(data.data.events[0]);
                    setButtonClicked(true); // set buttonClicked state to true
                    setClickedEventId(eventId); // set clicked event ID
                } else {
                    setEventDetails(null);
                    setButtonClicked(false); // set buttonClicked state to false
                    setClickedEventId(null); // reset clicked event ID
                }
            });
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            {events.map((event) => (
                <Box key={event._id} m={1}>
                    <Button variant="contained" color="primary" onClick={() => handleButtonClick(event._id)}>
                        {event.title}
                    </Button>
                </Box>
            ))}
            {buttonClicked && clickedEventId && <PostTeams eventId={clickedEventId} />}
        </Box>
    );

};

