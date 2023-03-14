import React from "react";
import { Create, useAutocomplete } from "@refinedev/mui";
import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import allevents from "../datasets/events.json";
import { createTeam } from "utils/utils";

export const AddTeams: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState<any>(
    "The poetic pulse (Slam Poetry)"
  );
  const [teamName, setTeamName] = React.useState<string>("");
  const [teamLeader, setTeamLeader] = React.useState<string>("");
  const [teamMembers, setTeamMembers] = React.useState<string[]>([]);
  const [event, setEvent] = React.useState<any>(null);
  const [msg, setMsg] = React.useState<string>("");

  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    formState: { errors },
  } = useForm();

  const { autocompleteProps: categoryAutocompleteProps } = useAutocomplete<
    any,
    any
  >({
    resource: "categories",
  });

  const validateTeam = () => {
    if (teamName === "") {
      setMsg("Please enter team name");
      return false;
    }
    if (!event) {
      setMsg("Please select an event");
      return false;
    }
    if (teamMembers.length < event.min_team_size - 1) {
      setMsg(`Team size should be atleast ${event.min_team_size}`);
      return false;
    }
    let p = /^AURA23-[A-Z]{3}-[0-9]{5}$/;
    if (!p.test(teamLeader)) {
      setMsg("Team Leader AURA ID is invalid: Format is AURA23-XXX-12345");
      return false;
    }
    for (let i = 0; i < teamMembers.length; i++) {
      if (!p.test(teamMembers[i])) {
        setMsg("One of the AURA IDs is invalid: Format is AURA23-XXX-12345");
        return false;
      }
    }
    return true;
  };

  const handleInputChange = (event: any, i: any) => {
    setTeamMembers((prev) => {
      if (event.target.value == "") {
        prev.splice(i, 1);
        return prev;
      } else {
        prev[i] = event.target.value;
      }
      return prev;
    });
    console.log(teamMembers);
  };

  const handleCategoryChange = (category: any) => {
    if (!category || !category.id) {
      setEvent(null);
      return;
    }
    setSelectedCategory(category);
    setTeamLeader("");
    setTeamName("");
    setTeamMembers([]);
    allevents.map((e: any) => {
      console.log(e._id == category.id);
      if (e._id == category.id) {
        setEvent(e);
      }
    });
  };
  const renderTeamForm = (n: Number) => {
    let x = [];
    for (let i = 0; i < n; i++) {
      x.push(
        <TextField
          {...register(`team_members.${i}`)}
          label={`Team Member ${i + 1}'s AURA ID`}
          variant="outlined"
          fullWidth
          margin="normal"
          value={teamMembers[i]}
          onChange={(e) => handleInputChange(e, i)}
        />
      );
    }
    return x;
  };

  const handleSubmit = () => {
    if (!validateTeam()) {
      return;
    }
    setMsg("");
    let data = {
      event_participated: selectedCategory,
      team_name: teamName,
      team_members: [teamLeader, ...teamMembers],
    };
    console.log(data);
    createTeam(data).then((res: any) => {
      if (res?.status) {
        setMsg("Team created successfully");
      } else {
        setMsg(res);
      }
    });
  };

  saveButtonProps.onClick = handleSubmit;

  const categoryOptions = [
    { id: "6406b733cb5e5780efd997ea", title: "The poetic pulse (Slam Poetry)" },
    {
      id: "6406b733cb5e5780efd997eb",
      title: "Canvas chronicles (Canvas painting)",
    },
    { id: "6406b733cb5e5780efd997ec", title: "Solo Serenade- Classical" },
    {
      id: "6406b733cb5e5780efd997ed",
      title: "The Startup-Showdown (PITCH TANK)",
    },
    { id: "6406b733cb5e5780efd997ee", title: "Waltz and Wander" },
    { id: "6406b733cb5e5780efd997ef", title: "Cyber Clash (VALORANT)" },
    {
      id: "6406b733cb5e5780efd997f0",
      title: "Musica classica (Solo Classical Singing)",
    },
    { id: "6406b733cb5e5780efd997f1", title: "Minutes of Magic" },
    { id: "6406b733cb5e5780efd997f2", title: "SAMVED (Nukkad Natak)" },
    { id: "6406b733cb5e5780efd997f4", title: "ESCAPE ROOM" },
    { id: "6406b733cb5e5780efd997f5", title: "Pencraft (Story Writing)" },
    { id: "6406b733cb5e5780efd997f6", title: "Meddle the muddle (Potpourri)" },
    { id: "6406b733cb5e5780efd997f7", title: "Kala mandala (Rangoli art)" },
    { id: "6406b733cb5e5780efd997f8", title: "La Fotografia" },
    { id: "6406b733cb5e5780efd997f9", title: "Solo Serenade-Western" },
    { id: "6406b733cb5e5780efd997fa", title: "Viva la vida (Battle of Bands)" },
    {
      id: "6406b733cb5e5780efd997fb",
      title: "A Quest to El Dorado! (Treasure Hunt)",
    },
    {
      id: "6406b733cb5e5780efd997fc",
      title:
        "RENDEZVOUS OF FLAIR (AURA’S GOT TALENT)  -- The spotlight is yours to seize!",
    },
    { id: "6406b733cb5e5780efd997fd", title: "Rampe des Cultures" },
    { id: "6406b733cb5e5780efd997fe", title: "Sensory sensations (Blind art)" },
    { id: "6406b733cb5e5780efd997ff", title: "MEMEKARAN (Meme making)" },
    {
      id: "6406b733cb5e5780efd99800",
      title: "Fiesta de la culturas (Artathon)",
    },
    { id: "6406b733cb5e5780efd99801", title: "RIL MOSAIC" },
    { id: "6406b733cb5e5780efd99802", title: "La Promenade" },
    { id: "6406b733cb5e5780efd99803", title: "Astitva" },
    { id: "6406b733cb5e5780efd99804", title: "Cyber Clash (FIFA)" },
    { id: "6406b733cb5e5780efd99806", title: "Demagoguery (Shipwreck)" },
    {
      id: "6406b733cb5e5780efd99807",
      title: "Bollydome (Eastern) & Sonata soireé (Western) (Solo Singing)",
    },
    {
      id: "6406b733cb5e5780efd99808",
      title: "Beethoven's pub(Solo Instrumental)",
    },
    {
      id: "6406b733cb5e5780efd99809",
      title: "Spontanetics (Just-a-minute (JAM))",
    },
    { id: "6406b733cb5e5780efd9980a", title: "Rythmic Renaissance" },
    { id: "6406b733cb5e5780efd9980b", title: "Symphonic studio (Unplugged)" },
    { id: "6406b733cb5e5780efd9980c", title: "ANDHADHUN (Mad-Ads)" },
    {
      id: "6406b733cb5e5780efd9980d",
      title: "Picture perfect faces (Face painting)",
    },
    { id: "6406b733cb5e5780efd9980e", title: "Shauryavyuha 2.0" },
    { id: "6406b733cb5e5780efd9980f", title: "Wordsmith wars (Debate)" },
    {
      id: "6406b733cb5e5780efd99810",
      title: "Belligerence: The Ultimate Showdown (Mr. and Ms. Aura)",
    },
    { id: "6406b733cb5e5780efd99811", title: "MUKHOTA (Mimicry)" },
    { id: "6406b733cb5e5780efd99812", title: "two-to-tangoduet-singing" },
    { id: "6406b733cb5e5780efd99813", title: "Battle de beaute" },
    { id: "6406b733cb5e5780efd99814", title: "Uptown funk(RAP)" },
    { id: "6406b733cb5e5780efd99815", title: "MegaWhats?" },
    { id: "6406b733cb5e5780efd99816", title: "The Cultural Odyssey Quiz" },
    { id: "6406b733cb5e5780efd99817", title: "The Game & Glam Quiz" },
  ];

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      {msg !== "" && (
        <Typography
          variant="h6"
          color="error"
          sx={{ textAlign: "center", mb: 2 }}
        >
          {msg}
        </Typography>
      )}
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <Controller
          control={control}
          name="category"
          rules={{ required: "This field is required" }}
          defaultValue={null}
          render={({ field }) => (
            <Autocomplete
              {...categoryAutocompleteProps}
              {...field}
              onChange={(_, value) => {
                field.onChange(value);
                handleCategoryChange(value);
              }}
              getOptionLabel={(item) => {
                return (
                  categoryOptions.find(
                    (p) => p.id.toString() === item?.id?.toString()
                  )?.title ?? ""
                );
              }}
              isOptionEqualToValue={(option, value) =>
                value === undefined ||
                option.id.toString() === value?.id?.toString()
              }
              options={categoryOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Event"
                  margin="normal"
                  variant="outlined"
                  error={!!(errors as any)?.category?.id}
                  helperText={(errors as any)?.category?.id?.message}
                  required
                  disabled
                />
              )}
            />
          )}
        />
        <TextField
          {...register("Team Name", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.title}
          helperText={(errors as any)?.title?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Team Name"
          name="Team Name"
          value={teamName}
          onChange={(e) => {
            setTeamName(e.target.value);
          }}
        />
        <TextField
          {...register("Team Leader", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.content}
          helperText={(errors as any)?.content?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          multiline
          label="Team Leader (Aura ID)"
          name="Team Leader"
          value={teamLeader}
          onChange={(e) => {
            setTeamLeader(e.target.value);
          }}
        />

        {event !== null && <>{renderTeamForm(event.team_size - 1)}</>}
      </Box>
    </Create>
  );
};
