import { Formik, Form, Field, ErrorMessage } from "formik";
import { object, string, InferType } from "yup";
import { remotePerformAction } from "../frontend/performAction";
import { useState } from "react";
import { useRouter } from "next/router";
import { EventInvite } from "@prisma/client";

const schema = object({
  name: string().required("Name is required"),
  comments: string(),
});
type SignupFields = InferType<typeof schema>;
const initalValues: SignupFields = {
  name: "",
  comments: "",
};

export const RSVPBlock = (props: {
  eventId: string;
  eventInvite: Partial<EventInvite>;
}) => {
  const { eventInvite, eventId } = props;

  const [status, setStatus] = useState<JSX.Element>();

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
  console.log(eventInvite);
  return (
    <Formik
      initialValues={{
        ...initalValues,
        name: eventInvite?.guestName || eventInvite?.invitedName || "",
        comments: eventInvite?.message || "",
      }}
      validationSchema={schema}
      onSubmit={(values, { setSubmitting }) => {
        setStatus(<>Sending rsvp...</>);
        remotePerformAction({
          type: "rsvp",
          payload: {
            ...values,
            eventId: eventId,
            comments: values.comments || "",
            slug: eventInvite?.slug || null,
            response: "GOING",
          },
        })
          .then(
            (data) => {
              if (data.error) {
                setStatus(
                  <span className="text-danger">
                    <strong>Failed to send RSVP:</strong> {data.error}
                  </span>
                );
              } else {
                setStatus(
                  <span className="text-success">
                    <strong>Okay!</strong> RSVP Sent
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
          )
          .finally(() => {
            setSubmitting(false);
          });
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          {fields}
          <button
            type="submit"
            className="btn btn-success"
            disabled={isSubmitting}
          >
            I&apos;ll be there!
          </button>
          {status ? <span className="px-3">{status}</span> : null}
        </Form>
      )}
    </Formik>
  );
};
