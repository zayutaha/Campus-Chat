import { Box, Fab, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { Form, Formik } from "formik";
import React from "react";
import * as yup from "yup";

type MessageForm = {
  message: string;
};

const validationSchema = yup.object().shape({
  message: yup.string().required(),
});

export function ChatBox({
  onMessage,
}: {
  onMessage: (message: string) => void;
}) {
  return (
    <Formik<MessageForm>
      initialValues={{ message: "" }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        onMessage(values.message);
        resetForm();
      }}
    >
      {({ values, setFieldValue, isValid }) => {
        return (
          <Form>
            <Box className="w-full flex justify-center" sx={{ mt: 2 }}>
              <Box
                className="mt-5 w-[90%] flex flex-row justify-between"
                sx={{ gap: 2 }}
              >
                <TextField
                  placeholder="Send a message!"
                  className="w-full"
                  value={values.message}
                  onChange={(e) => setFieldValue("message", e.target.value)}
                />
                <Fab type="submit" disabled={!isValid}>
                  <SendIcon />
                </Fab>
              </Box>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
}
