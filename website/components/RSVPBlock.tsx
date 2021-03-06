import { Formik, Form, Field, ErrorMessage } from "formik";
import { object, string, InferType } from "yup";
import { remotePerformAction } from "../frontend/performAction";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { EventInvite, EventInviteResponse } from "@prisma/client";
import { RSVPAction } from "../models/Action";

const schema = object({
  name: string().required("Name is required"),
  comments: string(),
  response: string().oneOf(["GOING", "NOT_GOING", "MAYBE"]),
});
type SignupFields = InferType<typeof schema> & {
  response: EventInviteResponse;
};
const initialValues: SignupFields = {
  name: "",
  comments: "",
  response: "GOING",
};

export const RSVPBlock = (props: {
  eventId: string;
  eventInvite: Partial<EventInvite>;
  setResponse: (response: EventInviteResponse) => void;
}) => {
  const { eventInvite, eventId, setResponse } = props;

  const [status, setStatus] = useState<JSX.Element>();

  const sendRSVP = (
    payload: Omit<RSVPAction["payload"], "eventId" | "slug">
  ) => {
    setStatus(
      <>
        <div
          className="spinner-border text-primary spinner-border-sm"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>{" "}
        <span className="text-secondary">Sending RSVP...</span>
      </>
    );
    return remotePerformAction({
      type: "rsvp",
      payload: {
        eventId,
        slug: eventInvite?.slug || null,
        ...payload,
      },
    }).then(
      (data) => {
        if (data.error) {
          setStatus(
            <span className="text-danger">
              <strong>Failed to send RSVP:</strong> {data.error}
            </span>
          );
        } else {
          setResponse(payload.response);
          setStatus(
            <span className="text-success">
              <strong>
                Okay{payload.response === "NOT_GOING" ? " :(." : "!"}
              </strong>{" "}
              {
                {
                  NONE: "",
                  MAYBE: "Please let us know when you know.",
                  GOING: "Looking forward to seeing you!",
                  NOT_GOING: "Maybe next time.",
                }[payload.response]
              }
            </span>
          );
        }
      },
      (err) => {
        setStatus(
          <span className="text-danger">
            <strong>Failed to send RSVP:</strong> {err.toString()}
          </span>
        );
      }
    );
  };

  const fields = (
    <fieldset>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <Field className="form-control" id="name" name="name" />
        <div className="form-text">Just so I know who this is from.</div>
        <ErrorMessage
          className="form-text text-danger"
          name="name"
          component="div"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="comments" className="form-label">
          Bringing someone along?
        </label>
        <Field
          className="form-control"
          id="comments"
          name="comments"
          as="textarea"
        />
        <div className="form-text">
          <em>Optional.</em> If you&apos;re bringing along more people, or might
          bring someone along, just let me know here.
        </div>
        <ErrorMessage
          className="form-text text-danger"
          name="comments"
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
          name: eventInvite?.guestName || eventInvite?.invitedName || "",
          comments: eventInvite?.message || "",
        }}
        validationSchema={schema}
        onSubmit={(values, { setSubmitting }) => {
          sendRSVP({
            ...values,
            comments: values.comments || "",
            response: values.response || "GOING",
          }).finally(() => {
            setSubmitting(false);
          });
        }}
      >
        {({ isSubmitting, setFieldValue, submitForm }) => (
          <Form>
            {fields}
            <div
              className="btn-group"
              role="group"
              aria-label="Basic mixed styles example"
            >
              <button
                className="btn btn-success"
                disabled={isSubmitting}
                onClick={(evt: React.MouseEvent) => {
                  evt.preventDefault();
                  setFieldValue("response", "GOING", false);
                  submitForm();
                }}
              >
                I&apos;ll be there!
              </button>{" "}
              <button
                className="btn btn-warning"
                disabled={isSubmitting}
                onClick={(evt: React.MouseEvent) => {
                  evt.preventDefault();
                  setFieldValue("response", "MAYBE", false);
                  submitForm();
                }}
              >
                Maybe?!
              </button>{" "}
              <button
                className="btn btn-danger"
                disabled={isSubmitting}
                onClick={(evt: React.MouseEvent) => {
                  evt.preventDefault();
                  setFieldValue("response", "NOT_GOING", false);
                  submitForm();
                }}
              >
                I can&apos;t make it
              </button>
            </div>
            {status ? <div className="py-3">{status}</div> : null}
          </Form>
        )}
      </Formik>
    </>
  );
};
