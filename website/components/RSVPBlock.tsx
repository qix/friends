import { Formik, Form, Field, ErrorMessage } from "formik";
import { object, string, InferType } from "yup";
import { remotePerformAction } from "../frontend/performAction";
import { useState } from "react";
import { useRouter } from "next/router";

const schema = object({
  name: string().required("Name is required"),
  comments: string(),
});
type SignupFields = InferType<typeof schema>;
const initalValues: SignupFields = {
  name: "",
  comments: "",
};

export const RSVPBlock = (props: { invitedName: string }) => {
  const { invitedName } = props;
  const [status, setStatus] = useState<JSX.Element>();
  const router = useRouter();

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
          <em>Optional.</em> If you&apos;re bringing along people, or might
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
    <Formik
      initialValues={{
        ...initalValues,
        name: invitedName,
      }}
      validationSchema={schema}
      onSubmit={(values, { setSubmitting }) => {
        setStatus(
          <div className="alert alert-secondary" role="alert">
            Sending RSVP...
          </div>
        );
        remotePerformAction({
          type: "rsvp",
          payload: {
            ...values,
            comments: values.comments || "",
          },
        })
          .then(
            (data) => {
              if (data.error) {
                setStatus(
                  <div className="alert alert-danger" role="alert">
                    Error: {data.error}
                  </div>
                );
              } else {
                router.push("/");
              }
            },
            (err) => {
              setStatus(
                <div className="alert alert-danger" role="alert">
                  Failed to send RSVP: {err.toString()}
                </div>
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
          <div className="card">
            <h5 className="card-header">RSVP</h5>
            <div className="card-body">
              {fields}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                Submit
              </button>
            </div>
            {status ? <div className="card-body">{status}</div> : null}
          </div>
        </Form>
      )}
    </Formik>
  );
};
