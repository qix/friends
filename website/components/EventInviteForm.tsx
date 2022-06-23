import { Person } from "../models/Person";
import { InvitationBlock } from "../components/InvitationBlock";
import { object, string, number, InferType } from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FunctionComponent, useState } from "react";
import { remotePerformAction } from "../frontend/performAction";
import { ErrorAlert, SuccessAlert } from "../components/alerts";
import { Event } from "@prisma/client";

const schema = object({
  name: string().required("Name is required"),
  slug: string().required("Slug is required"),
  privateNote: string(),
  guestCount: number().required("Guest count is required"),
});
type CreateEventInviteFields = InferType<typeof schema>;
const initalValues: CreateEventInviteFields = {
  name: "",
  slug: "",
  privateNote: "",
  guestCount: 1,
};

export function buildInviteUrl(eventSlug: string, guestSlug: string) {
  return (
    `https://friends.nyc/event/${encodeURIComponent(eventSlug)}?` +
    `invite=${encodeURIComponent(guestSlug)}`
  );
}
export const EventInviteForm: FunctionComponent<{ event: Partial<Event> }> = ({
  event,
}) => {
  const [message, setMessage] = useState<JSX.Element>();

  const formFields = (
    <fieldset>
      <div className="mb-3">
        <label htmlFor="name">Name</label>
        <Field id="name" name="name" className="form-control" />
        <ErrorMessage
          className="form-text text-danger"
          name="name"
          component="div"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="slug">Slug</label>
        <Field id="slug" type="slug" name="slug" className="form-control" />
        <ErrorMessage
          className="form-text text-danger"
          name="slug"
          component="div"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="guest-count">Guest count</label>
        <Field
          id="guest-count"
          type="guest-count"
          name="guestCount"
          className="form-control"
          inputMode="numeric"
          pattern="[0-9]*"
        />
        <ErrorMessage
          className="form-text text-danger"
          name="guestCount"
          component="div"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="private-note" className="form-label">
          Private note
        </label>
        <Field
          className="form-control"
          id="private-note"
          name="privateNote"
          as="textarea"
        />
        <ErrorMessage
          className="form-text text-danger"
          name="privateNote"
          component="div"
        />
      </div>
    </fieldset>
  );

  return (
    <>
      <div>{message}</div>
      <Formik
        initialValues={{
          ...initalValues,
        }}
        validationSchema={schema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setMessage(<></>);
          remotePerformAction({
            type: "createEventInvite",
            payload: {
              ...values,
              eventId: event.id!,
              privateNote: values.privateNote || null,
              guestCount: parseInt(`${values.guestCount}`, 10),
            },
          })
            .then(
              (rv) => {
                if (rv.error) {
                  setMessage(<ErrorAlert>{rv.error}</ErrorAlert>);
                } else {
                  const eventUrl = buildInviteUrl(event.slug!, values.slug);

                  setMessage(
                    <SuccessAlert>
                      <a href={eventUrl}>{eventUrl}</a>
                    </SuccessAlert>
                  );
                  resetForm();
                  document.getElementById("name")?.focus();
                }
              },
              (err) => {
                setMessage(<ErrorAlert>{err.toString()}</ErrorAlert>);
              }
            )
            .finally(() => {
              setSubmitting(false);
            });
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="card">
              <h5 className="card-header">Create a new invite</h5>
              <div className="card-body">
                {formFields}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  Clowncopterize
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};
