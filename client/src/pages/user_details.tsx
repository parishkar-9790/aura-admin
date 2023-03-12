import { Person, Phone, Email, Abc } from "@mui/icons-material";

import { Typography, Show, Breadcrumb } from "@pankod/refine-antd";
import { Card, Link } from "@pankod/refine-mui";
import { IUser } from "../interfaces/all";

const { Title, Text } = Typography;

interface Props {
	user: IUser;
};

export const UserDetails: React.FC<Props> = ({ user }) => {
	return <div style={{ width: "100%", border: "1px solid grey", borderRadius: "20px", padding: "0.5cm 0.5cm 0.5cm 0.5cm" }}>
		<Person style={{ width: "75px", height: "75px" }} />
		<br />
		<Text style={{ fontSize: "25px" }}>
			{user.name}
		</Text>
		<br />
		<Text strong={true} style={{ fontSize: "15px" }}>
			<Abc style={{ height: "15px" }} />
			{user.aura_id}
		</Text>
		<br />
		<Text strong={true} style={{ fontSize: "15px" }}>
			<Phone style={{ height: "15px" }} />
			{`${user.phone}`}
		</Text>
		<br />
		<div>
			<Email style={{ height: "15px" }} />
			<Link href={`mailto:${user.email}`} style={{ fontSize: "15px" }}>
				{user.email}
			</Link>
		</div>
	</div>;
};