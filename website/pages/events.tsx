import type { NextPage } from "next";
import Head from "next/head";
import { Person } from "../models/Person";
import { InvitationBlock } from "../components/InvitationBlock";
import { getPrismaClient } from "../server/db";
import { invariant } from "../server/invariant";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Event, EventInvite } from "@prisma/client";
import { AuthenticatedPage } from "../components/AuthRequired";
import { object, string, number, InferType } from "yup";
import { FunctionComponent, useState } from "react";
import { remotePerformAction } from "../frontend/performAction";
import { ErrorAlert, SuccessAlert } from "../components/alerts";
import { assertNever } from "../jslib/assertNever";
import { EventContainer } from "../components/EventContainer";
import Link from "next/link";

const schema = object({
  name: string().required("Name is required"),
  slug: string().required("Slug is required"),
  privateNote: string(),
  guestCount: number().required("Guest count is required"),
});
type CreateEventFields = InferType<typeof schema>;
const initialValues: CreateEventFields = {
  name: "",
  slug: "",
  privateNote: "",
  guestCount: 1,
};

const EventsPage: NextPage<{
  error: string;
  events: Array<Partial<Event>>;
}> = ({ events }) => {
  return (
    <AuthenticatedPage title="Events">
      <li className="nav-item">
        <Link href={`/events`} className="active nav-link">
          All events
        </Link>
      </li>
      {events.map((event) => (
        <Link key={event.id} href={`/event/${event.slug}`}>
          {event.name}
        </Link>
      ))}
    </AuthenticatedPage>
  );
};

export async function getServerSideProps(context: {}) {
  const prisma = getPrismaClient();

  const events = await prisma.event.findMany({});

  return {
    props: {
      events: events.map((event) => ({
        id: event.id,
        slug: event.slug,
        name: event.name,
      })),
    },
  };
}

export default EventsPage;
