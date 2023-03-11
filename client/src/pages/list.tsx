import { useMany } from "@pankod/refine-core";
import { List, Table, TextField } from "@pankod/refine-antd";

interface Event {
    _id: string;
    team_name: string;
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
    team_members: {
        id: string;
        aura_id: string;
        email: string;
        usn: string;
        name: string;
        _id: string;
    }[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export const PostList: React.FC = () => {
    const { data, isLoading } = useMany<Event>({
        ids: ["6406b733cb5e5780efd997fd"],
        resource: "events"
    });


    return (
        <List>
            <Table<Event> dataSource={data as unknown as readonly Event[]} rowKey="_id">

                <Table.Column dataIndex="_id" title="ID" />
                <Table.Column dataIndex="team_name" title="Team Name" />
                <Table.Column
                    dataIndex={["event_participated", "event_id"]}
                    title="Event ID"
                />
                <Table.Column
                    dataIndex={["event_participated", "event_title"]}
                    title="Event Title"
                />
                <Table.Column dataIndex={["team_leader", "name"]} title="Team Leader" />
                <Table.Column
                    dataIndex="team_members"
                    title="Team Members"
                    render={(value, record: Event) => {
                        const memberCount = record.team_members.length;
                        return (
                            <>
                                <TextField
                                    value={`${memberCount} ${
                                        memberCount === 1 ? "member" : "members"
                                    }`}
                                />
                                <TextField
                                    value={
                                        (record as any)?.isTeamMemberDetailsVisible
                                            ? value.map((member: { name: string }) => member.name).join(", ")
                                            : ""
                                    }

                                />
                            </>
                        );
                    }}

                />
                <Table.Column dataIndex="createdAt" title="Created At" />
                <Table.Column dataIndex="updatedAt" title="Updated At" />
                <Table.Column dataIndex="__v" title="__v" />
            </Table>
        </List>
    );
};
