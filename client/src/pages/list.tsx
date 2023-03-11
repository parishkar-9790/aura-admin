import React, { useEffect, useState } from 'react';

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

export const PostList = () => {
    const [data, setData] = useState<IData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:4000/Teams');
                const json = await response.json();
                setData(json);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Data:</h1>
            <table>
                <thead>
                <tr>
                    <th>Team No</th>
                    <th>Team Name</th>
                    <th>Team Leader Name</th>
                    <th>Team Leader USN</th>
                    <th>Team Members</th>
                </tr>
                </thead>
                <tbody>
                {data.data.results.map((result, index) => (
                    <tr key={result._id}>
                        <td>{index + 1}</td>
                        <td>{result.team_name}</td>
                        <td>{result.team_leader.name}</td>
                        <td>{result.team_leader.usn}</td>
                        <td>
                            <ul>
                                {result.team_members.map((member) => (
                                    <li key={member.usn}>
                                        {member.name} ({member.usn})
                                    </li>
                                ))}
                            </ul>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
