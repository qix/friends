import { Formik, Form, Field, ErrorMessage } from "formik";
import { object, string, InferType } from "yup";
import { remotePerformAction } from "../frontend/performAction";
import React, { useState } from "react";
import { Event } from "@prisma/client";

const schema = object({
  description: string(),
});
type FormFields = InferType<typeof schema> & {
  description: string;
};
const initialValues: FormFields = {
  description: "",
};

export const UpdateEventBlock = ({ event }: { event: Partial<Event> }) => {
  const [status, setStatus] = useState<JSX.Element>();

  const sendUpdate = (payload: FormFields) => {
    setStatus(
      <>
        <div
          className="spinner-border text-primary spinner-border-sm"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>{" "}
        <span className="text-secondary">Updating event...</span>
      </>
    );
    return remotePerformAction({
      type: "updateEvent",
      payload: {
        id: event.id!,
        event: payload,
      },
    }).then(
      (data) => {
        if (data.error) {
          setStatus(
            <span className="text-danger">
              <strong>Failed to update event:</strong> {data.error}
            </span>
          );
        } else {
          setStatus(
            <span className="text-success">
              <strong>Okay!</strong>
            </span>
          );
        }
      },
      (err) => {
        setStatus(
          <span className="text-danger">
            <strong>Failed to update:</strong> {err.toString()}
          </span>
        );
      }
    );
  };

  const fields = (
    <fieldset>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Description
        </label>
        <Field
          className="form-control"
          id="description"
          name="description"
          as="textarea"
        />
        <div className="form-text">Event description.</div>
        <ErrorMessage
          className="form-text text-danger"
          name="description"
          component="div"
        />
      </div>
    </fieldset>
  );

  return (
    <>
      <Formik
        initialValues={{
          ...initialValues,
          description: event.description || "",
        }}
        validationSchema={schema}
        onSubmit={(values, { setSubmitting }) => {
          sendUpdate(values).finally(() => {
            setSubmitting(false);
          });
        }}
      >
        {({ isSubmitting, setFieldValue, submitForm }) => (
          <Form>
            {fields}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              Submit
            </button>
            {status ? <div className="py-3">{status}</div> : null}
          </Form>
        )}
      </Formik>
    </>
  );
};
