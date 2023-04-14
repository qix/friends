import { CreateForm } from "./UpdateForm";
import { Event } from "@prisma/client";
import { ErrorMessage, Field } from "formik";
import { EventUpdateSchema } from "../models/Action";

function capitilizeWords(str: string) {
  return str.split(" ").map((word) => {
    return word.substring(0, 1).toUpperCase() + word.substring(1);
  });
}

function formField(
  name: string,
  instructions: string,
  { as }: { as?: string } = {}
) {
  return (
    <div className="mb-3">
      <label htmlFor="name" className="form-label">
        {capitilizeWords(name)}
      </label>
      <Field
        className="form-control"
        id={name}
        name={name}
        as={as || "input"}
      />
      <div className="form-text">{instructions}</div>
      <ErrorMessage
        className="form-text text-danger"
        name={name}
        component="div"
      />
    </div>
  );
}

export const UpdateEventBlock = ({ event }: { event: Partial<Event> }) => {
  return (
    <CreateForm
      schema={EventUpdateSchema}
      initialValues={{
        name: event.name,
        datedName: event.datedName || "",
        calendarTitle: event.calendarTitle || "",
        calendarDescription: event.calendarDescription || "",
        metaDescription: event.metaDescription || "",
        address: event.address || "",
        startAtIso: event.startAtIso
          ? event.startAtIso
          : new Date().toISOString(),
        endAtIso: event.endAtIso ? event.endAtIso : new Date().toISOString(),
        description: event.description || "",
        opengraphImage: event.opengraphImage || "",
        headerImage: event.headerImage || "",
      }}
      action="updateEvent"
      buildActionPayload={(payload) => ({
        id: event.id!,
        event: payload,
      })}
    >
      <fieldset>
        {formField("name", "Event name")}
        {formField("datedName", "Name with date included")}
        {formField("calendarTitle", "Name of calendar event")}
        {formField("calendarDescription", "Description for calendar event", {
          as: "textarea",
        })}
        {formField("metaDescription", "Description included in shared links", {
          as: "textarea",
        })}
        {formField("address", "Address of event")}
        {formField("startAtIso", "Start time (ISO8601)")}
        {formField("endAtIso", "End time (ISO8601)")}
        {formField("description", "Event description", {
          as: "textarea",
        })}
        {formField("opengraphImage", "Image included in shared links")}
        {formField("headerImage", "Image used for event header")}
      </fieldset>
    </CreateForm>
  );
};
