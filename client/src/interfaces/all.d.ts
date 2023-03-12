export interface IEvent {
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

export interface ITeam {
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

export interface IUser {
	_id: string;
	aura_id: string;
	name: string;
	email: string;
	phone: string;
	usn: string;
	college: string;
	email_verified: boolean;
	paid_for: Array<{
		event_id: string,
		receipt_id: string,
	}>;
	_profile_information: {
		last_password_reset: Date,
		account_creation_timestamp: number,
	};
};