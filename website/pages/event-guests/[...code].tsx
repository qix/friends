import type { NextPage } from "next";
import Head from "next/head";
import { Person } from "../../models/Person";
import { InvitationBlock } from "../../components/InvitationBlock";
import { getPrismaClient } from "../../server/db";
import { invariant } from "../../server/invariant";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Event, EventInvite } from "@prisma/client";
import { AuthenticatedPage } from "../../components/AuthRequired";
import { object, string, number, InferType } from "yup";
import { useState } from "react";
import { remotePerformAction } from "../../frontend/performAction";
import { ErrorAlert, SuccessAlert } from "../../components/alerts";

const schema = object({
  name: string().required("Name is required"),
  slug: string().required("Slug is required"),
  privateNote: string(),
  guestCount: number().required("Guest count is required"),
});
type CreateEventFields = InferType<typeof schema>;
const initalValues: CreateEventFields = {
  name: "",
  slug: "",
  privateNote: "",
  guestCount: 1,
};

function buildInviteUrl(eventSlug: string, guestSlug: string) {
  return (
    `https://friends.nyc/event/${encodeURIComponent(eventSlug)}?` +
    `invite=${encodeURIComponent(guestSlug)}`
  );
}
const Guest = (props: {
  event: Partial<Event>;
  guest: Partial<EventInvite>;
}) => {
  const { event, guest } = props;
  const inviteUrl = buildInviteUrl(event.slug!, guest.slug!);

  let guestName = guest.guestName || null;
  if (!guestName) {
    guestName = guest.invitedName || "(Unknown)";
  } else if (guest.invitedName && guest.invitedName !== guestName) {
    guestName += ` (${guest.invitedName})`;
  }

  let badge: JSX.Element;
  if (guest.response === "GOING") {
    badge = <span className="badge bg-success">Yes</span>;
  } else if (guest.response === "NOT_GOING") {
    badge = <span className="badge bg-danger">No</span>;
  } else if (guest.response === "NONE") {
    badge = <span className="badge bg-secondary">???</span>;
  } else {
    badge = <em>(Unknown response: {guest.response})</em>;
  }

  return (
    <tr>
      <td className="text-center">{badge}</td>
      <td>
        <p>
          <h5>
            {guestName} [{guest.guestCount}]
          </h5>
          {guest.privateNote ? (
            <div className="card">
              <div className="card-body">
                <span className="badge bg-secondary">(private)</span>{" "}
                {guest.privateNote}
              </div>
            </div>
          ) : null}
          {guest.inviteMessage ? (
            <div className="card">
              <div className="card-body">
                <span className="badge bg-secondary">(invitation)</span>{" "}
                {guest.inviteMessage}
              </div>
            </div>
          ) : null}
          {guest.message ? (
            <div className="card">
              <div className="card-body">{guest.message}</div>
            </div>
          ) : null}
          {inviteUrl ? (
            <div>
              <a href={inviteUrl}>{inviteUrl}</a>
            </div>
          ) : null}
        </p>
      </td>
    </tr>
  );
};

const EventPage: NextPage<{
  error: string;
  event: Partial<Event>;
  guests: Partial<EventInvite>[];
}> = (props) => {
  const { event, guests, error } = props;

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
    <AuthenticatedPage title="Event Guests">
      {error ? (
        <div>
          <div className="alert alert-danger m-5" role="alert">
            {error}
          </div>
        </div>
      ) : (
        <table className="table table-striped">
          <tbody>
            {guests.map((guest) => (
              <Guest key={guest.id} event={event} guest={guest} />
            ))}
          </tbody>
        </table>
      )}

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
    </AuthenticatedPage>
  );
};

export async function getServerSideProps(context: {
  query: {
    code: string[];
  };
}) {
  const prisma = getPrismaClient();

  invariant(context.query.code?.length === 1, "Expected a single event code");
  const [code] = context.query.code;

  const event = await prisma.event.findFirst({
    where: {
      slug: code,
    },
  });
  if (!event) {
    return {
      props: {
        error: "Could not find an event at the given address.",
      },
    };
  }

  const guests = await prisma.eventInvite.findMany({
    where: {
      eventId: event.id,
    },
  });

  return {
    props: {
      event: {
        id: event.id,
        slug: event.slug,
      },
      guests: guests.map((guest) => ({
        id: guest.id,
        slug: guest.slug || null,
        inviteMessage: guest.inviteMessage || null,
        invitedName: guest.invitedName || null,
        invitedEmail: guest.invitedEmail || null,
        privateNote: guest.privateNote || null,
        response: guest.response,
        message: guest.message,
        guestCount: guest.guestCount,
        guestName: guest.guestName || null,
        guestMax: guest.guestMax || null,
      })),
    },
  };
}

export default EventPage;
