import {
  Autocomplete,
  Button,
  Card,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  List,
  MenuItem,
  Radio,
  RadioGroup,
  RefreshButton,
  Select,
  Show,
  TextField,
} from "@pankod/refine-mui";
import { Search, Error } from "@mui/icons-material";
import { useEffect, useState } from "react";
import isEmail from "validator/lib/isEmail";

import colleges from "../datasets/colleges.json";
import { getTeamsByName } from "utils/utils";
import { IUser } from "interfaces/all";
import { Table } from "@pankod/refine-antd";
import Popup from "reactjs-popup";
import { UserDetails } from "./user_details";

let paginationTs: any = null;

export const TeamSearch: React.FC = () => {
  // States
  const [searching, setSearching] = useState<boolean>(false);
  const [errors, setErrors] = useState<boolean>(false);
  const [teams, setTeams] = useState<Array<any>>([]);

  let isError = true;
  // Name
  const [name, setName] = useState<string>("");

  async function performSearch(reset: boolean = false) {
    setSearching(true);

    const { paginationTs: updatedPaginationTs, teams: newTeams } =
      await getTeamsByName({
        paginationTs: reset ? Date.now() : paginationTs,
      });
    paginationTs = updatedPaginationTs;

    if (teams === null) return setErrors(true);

    if (reset) setTeams([...newTeams]);
    else setTeams([...teams, ...newTeams]);
    setSearching(false);
  }

  if (errors) return <Error />;

  return (
    <div>
      <h1>Search Users</h1>
      <Show goBack={null} title="Apply filters" headerButtons={() => null}>
        <FormControl style={{ marginTop: "0.5cm" }} fullWidth>
          <TextField
            label="Enter Team name"
            variant="outlined"
            value={name}
            onChange={(event) => setName(event.target.value)}
            error={(isError = name.trim().length === 0)}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "0.5cm" }}
            onClick={() => {}}
          >
            Search
          </Button>
        </FormControl>
      </Show>
      <br />
      {searching && <CircularProgress />}
      <br />
      <RefreshButton
        fullWidth={true}
        // onClick={() => performSearch()}
        disabled={!paginationTs}
      >
        {paginationTs ? "Load next 20 results" : "No more results!"}
      </RefreshButton>
    </div>
  );
};
