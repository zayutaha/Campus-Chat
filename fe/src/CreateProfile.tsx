import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import React, { useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { Form, Formik } from "formik";
import { UserSession } from "./types";
import { useListChannels } from "./useListChannels";
import * as yup from "yup";
import { createUser } from "./module";
import SelectChannel from "./selectChannel";

const schema = yup.object().shape({
  userName: yup.string().required(),
  currentChannel: yup.string().required(),
});

export default function CreateProfile() {
  const [session, setSession] = useLocalStorage("session");
  const channels = useListChannels();

  const handleSubmit = (values: UserSession) => {
    createUser(values.userName).then((user_id) =>
      setSession({ ...values, userId: user_id })
    );
  };

  const requiresLogin = useMemo(
    () =>
      session.userName === "Guest" ||
      session.currentChannel === undefined ||
      channels.every((c) => c.id !== session.currentChannel),
    [session, channels]
  );

  return (
    <Modal open={requiresLogin}>
      <Box sx={BoxStyle}>
        <Formik<UserSession>
          enableReinitialize
          initialValues={session}
          validationSchema={schema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values, isValid }) => (
            <Form>
              <div className="grid grid-2">
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Create Profile
                </Typography>

                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  value={values.userName}
                  onChange={(e) => setFieldValue("userName", e.target.value)}
                  sx={UserNameStyle}
                />
                <SelectChannel
                  channels={channels}
                  onChange={(channel) =>
                    setFieldValue("currentChannel", channel)
                  }
                  value={values.currentChannel}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={!isValid}
                  sx={ButtonStyle}
                >
                  Create Profile
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
}

const UserNameStyle = {
  mb: 3,
  input: { color: "#fff" },
  label: { color: "#aaa" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#333" },
    "&:hover fieldset": { borderColor: "#555" },
    "&.Mui-focused fieldset": { borderColor: "#888" },
  },
};

const ButtonStyle = {
  bgcolor: "#00bcd4",
  color: "white",
  fontWeight: 500,
  fontSize: "16px",
  mt: 3,
  textTransform: "none",
  borderRadius: 2,
  py: 1,
  "&:hover": { bgcolor: "#00acc1" },
  "&:disabled": { bgcolor: "#333", color: "#777" },
};

const BoxStyle = {
  position: "absolute",
  outline: "none",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 360,
  bgcolor: "#121212",
  borderRadius: 3,
  boxShadow: "0 0 30px rgba(0,0,0,0.6)",
  p: 4,
  color: "#fff",
  textAlign: "center",
};
