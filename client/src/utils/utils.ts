import { ITeam, IUser, IEvent, IReceipt, ITeamExt } from "../interfaces/all";
import coordinators from "../crd.json";
import errors from "./error.codes.json";
import { successToast, errorToast } from "./Toasts/Toasts";

const HOST = "https://aura.git.edu";

export function sluggify(str: string | undefined) {
  return str
    ?.trim()
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/, " ")
    .split(" ")
    .join("-");
}

// Create Team Error handler:
const errorHandler = (err: any) => {
  console.log(err);
  let err_status = parseInt(err.slice(0, 3));
  let err_code = err;
  console.log(err_status, err_code);
  if (err_status === 400) {
    if (err_code === errors[400].eventDetailsRequired) {
      return "Event Details Required!";
    }
    if (err_code === errors[400].teamNameRequired) {
      return "Team Name Required!";
    }
    if (err_code === errors[400].minTeamCount) {
      return "Minimum Team Size Required!";
    }
  } else if (err_status === 401) {
    if (
      err_code === errors[401].authRequired ||
      err_code === errors[401].invalidOrExpiredToken
    ) {
      return "You are not authorized to perform this operation. Please login and try again.";
    }
  } else if (err_status === 403) {
    if (err_code === errors[403].teamMemberEmailUnverified) {
      return "One or more team members have not verified their email address. Please ask them to verify their email address and try again.";
    }
    if (err_code === errors[403].invalidOperation) {
      return "You cannot add yourself as a team member!";
    }
    if (err_code === errors[403].teamMemberAlreadyRegistered) {
      return "One or more team members have already registered for another team!";
    }
    if (err_code === errors[403].eventAlreadyRegistered) {
      return "You have already registered for this event!";
    }
  } else if (err_status === 404) {
    if (err_code === errors[404].userNotFound) {
      return "One or more team members are not registered!";
    }
  } else {
    return "Team Registration Failed!";
  }
};

// Teams
export async function getTeams(paginationTs: any) {
  try {
    const response = await fetch(
      `${HOST}/teams${paginationTs ? `?paginationTs=${paginationTs}` : ""}`
    );
    const json = await response.json();

    return {
      paginationTs: json.data.paginationTs,
      teams: json.data.results,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      paginationTs: null,
      teams: [],
    };
  }
}

export async function getTeamsExtQuery({
  eventId = null,
  teamName = null,
  teamMemberAuraId = null,
  paymentStatus = null,
  paginationTs = Date.now(),
}) {
  const queries = [
    eventId !== null && `&eventId=${eventId}`,
    teamName !== null && `&teamName=${teamName}`,
    teamMemberAuraId !== null && `&teamMemberAuraId=${teamMemberAuraId}`,
    paymentStatus !== null && `&paymentStatus=${!!paymentStatus}`,
  ].filter((value) => value !== false && value !== null);

  try {
    const response = await fetch(
      `${HOST}/teams?paginationTs=${paginationTs}${queries.join("")}`,
    );
    if (response.status !== 200)
      return {
        paginationTs: null,
        teams: [],
      };

    const json = await response.json();

    return {
      paginationTs: json.data.paginationTs,
      teams: json.data.results,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      paginationTs: null,
      teams: [],
    };
  }
}

export async function getTeamsByEvent(event_id: string, paginationTs: any) {
  try {
    const response = await fetch(
      `${HOST}/teams/event/${event_id}${paginationTs ? `?paginationTs=${paginationTs}` : ""
      }`
    );
    const json = await response.json();

    return {
      paginationTs: json.data.paginationTs,
      teams: json.data.results,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      paginationTs: null,
      teams: [],
    };
  }
}

export async function getCompleteTeamsByEvent(
  event_id: string,
  paginationTs: any
) {
  try {
    const response = await fetch(
      `${HOST}/teams/event/${event_id}/complete${paginationTs ? `?paginationTs=${paginationTs}` : ""
      }`
    );
    const json = await response.json();

    return {
      paginationTs: json.data.paginationTs,
      teams: json.data.results as Array<ITeamExt>,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      paginationTs: null,
      teams: [] as Array<ITeamExt>,
    };
  }
}

export async function getTeam(team_id: string) {
  try {
    const response = await fetch(`${HOST}/teams/${team_id}`);
    if (response.status !== 200) return null;

    const json = await response.json();
    if (!json.success) {
      console.error("Error code:", json.error);
      return null;
    }

    const data = json.data;
    const team = data.team as ITeam;

    return team;
  } catch (error) {
    console.error(error);
    return null;
  }
}
//

// Events
export async function getEvent(event_id: string) {
  try {
    const response = await fetch(`${HOST}/events/resolve/${event_id}`);
    if (response.status !== 200) return null;

    const json = await response.json();
    if (!json.success) {
      console.error("Error code:", json.error);
      return null;
    }

    const data = json.data;
    const event = data.event as IEvent;

    return event;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getAllEvents() {
  try {
    const response = await fetch(`${HOST}/events/list`);
    if (response.status !== 200) return null;

    const json = await response.json();
    if (!json.success) {
      console.error("Error code:", json.error);
      return null;
    }

    const events: Array<IEvent> = json.data.events;
    return events;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getEventsByClub(clubSlug: string) {
  try {
    const response = await fetch(`${HOST}/events/${clubSlug}`);
    if (response.status !== 200) return null;

    const json = await response.json();
    if (!json.success) {
      console.error("Error code:", json.error);
      return null;
    }

    const events: Array<IEvent> = json.data.events;
    return events;
  } catch (error) {
    console.error(error);
    return null;
  }
}
//

// User
export async function getUser(user_id: string) {
  try {
    const response = await fetch(`${HOST}/users/${user_id}`);
    if (response.status !== 200) return null;

    const json = await response.json();
    if (!json.success) {
      console.error("Error code:", json.error);
      return null;
    }

    const data = json.data;
    const user = data.user as IUser;

    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Team

export async function createTeam(data: any) {
  try {
    const response = await fetch(`${HOST}/teams/createteam/noauth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!json.success) {
      console.error("Error code:", json.error);
      return errorHandler(json.error);
    }
    console.log(json.data);
    // const receipt = {
    //   team_id: json.data.team._id,
    //   transaction_id: data.transaction_id,
    // };
    // generateReceipt(receipt);
    return { status: true, message: json.message };
  } catch (error) {
    errorHandler(error);
  }
}

export async function getUsers({
  aura_id = null,
  email = null,
  college = null,
  name = null,
  usn = null,
  phone = null,
  email_verified = null,
  paginationTs = Date.now(),
}) {
  const queries = [
    aura_id !== null && `&aura_id=${aura_id}`,
    email !== null && `&email=${email}`,
    college !== null && `&college=${college}`,
    name !== null && `&name=${name}`,
    usn !== null && `&usn=${usn}`,
    phone !== null && `&phone=${phone}`,
    email_verified !== null && `&email_verified=${email_verified}`,
  ].filter((value) => value !== false && value !== null);

  try {
    const response = await fetch(
      `${HOST}/users/search?paginationTs=${paginationTs}${queries.join("")}`
    );
    const json = await response.json();

    return {
      paginationTs: json.data.paginationTs,
      users: json.data.results,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      paginationTs: null,
      users: [],
    };
  }
}
//

// Receipt
export async function getReceiptByTeam(team_id: string) {
  try {
    const response = await fetch(`${HOST}/receipts/team/${team_id}`);
    if (response.status !== 200) return null;

    const json = await response.json();
    if (!json.success) {
      console.error("Error code:", json.error);
      return null;
    }

    const data = json.data;
    const receipt = data.receipt as IReceipt;

    return receipt;
  } catch (error) {
    console.error(error);
    return null;
  }
}
//

// Stats
export async function getTotalParticipantsCount() {
  try {
    const response = await fetch(`${HOST}/receipts/stats/participation`);
    if (response.status !== 200) return null;

    const json = await response.json();
    const count = json.data.result[0]?.total_participation;

    return count as number;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getTotalGitParticipantsCount() {
  try {
    const response = await fetch(`${HOST}/receipts/stats/participation/git`);
    if (response.status !== 200) return null;

    const json = await response.json();
    const count = json.data.result[0]?.total_gitian_participation;

    return count as number;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getNumberOfUnpaidTeams() {
  try {
    const response = await fetch(`${HOST}/teams/stats/unpaid`);
    if (response.status !== 200) return null;

    const json = await response.json();
    const count = json.data.result[0]?.unpaid_teams_count;

    return count as number;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getNumberOfPaidTeams() {
  try {
    const response = await fetch(`${HOST}/teams/stats/paid`);
    if (response.status !== 200) return null;

    const json = await response.json();
    const count = json.data.result[0]?.paid_teams_count;

    return count as number;
  } catch (error) {
    console.error(error);
    return null;
  }
}
//

export function checkAccess(email: string) {
  const usn = email.split("@")[0].toLowerCase().trim();

  // Check if usn key exists in coordinators list
  return usn in coordinators;
}

export function getClubSlug() {
  const userJson = localStorage.getItem("user");
  if (userJson) {
    const userObj: IUser = JSON.parse(userJson);
    const usn = userObj.email?.split("@")[0]?.toLowerCase()?.trim() ?? "";
    const club = (coordinators as any)[usn]?.club;

    if (club === "*") return club;

    const clubSlug = sluggify(club);
    return clubSlug;
  }

  return null;
}

export async function sleep(duration: number) {
  return new Promise((resolve, _) => setTimeout(resolve, duration));
}
