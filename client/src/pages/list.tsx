import {useTable} from "@pankod/refine-core";
import {IPost} from "../interfaces";
import {List, Table,TextField,DateField,TagField} from "@pankod/refine-antd";
import React from "react";

export const PostList:React.FC=()=>{
    const{tableProps}=useTable<IPost>()
    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="title" title="title"/>
                   <Table.Column
                    dataIndex="status"
                    title="status"
                    render={(value)=><TagField value={value}/>}
                    />
                <Table.Column
                    dataIndex="createAt"
                    title="createdAt"
                    render={(value)=><DateField format="LLL" value={value}/>}
                />
            </Table>
        </List>
    )
}