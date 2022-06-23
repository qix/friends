import { object, string } from "yup";
import { CreateForm } from "./UpdateForm";
import { Event } from "@prisma/client";
import { ErrorMessage, Field } from "formik";

export const UpdateEventBlock = ({ event }: { event: Partial<Event> }) => {
  return (
    <CreateForm
      schema={object({
        description: string(),
      })}
      initialValues={{
        description: event.description || "",
      }}
      action="updateEvent"
      buildActionPayload={(payload) => ({
        id: event.id!,
        event: {
          description: payload.description || "",
        },
      })}
    >
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
    </CreateForm>
  );
};
