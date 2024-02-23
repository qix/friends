import { Formik, Form, Field, ErrorMessage } from "formik";
import { object, string, InferType } from "yup";
import { remotePerformAction } from "../frontend/performAction";
import React, { useState } from "react";
import { ErrorAlert, SuccessAlert } from "../components/alerts";
import { phoneRegExp } from "../jslib/phone";

const schema = object({
  name: string().required("Name is required"),
  email: string().email(),
  phone: string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Phone number is required"),
  vouchMessage: string().required("Message is required"),
});
type CreateInviteFields = InferType<typeof schema>;
const initialValues: CreateInviteFields = {
  name: "",
  email: "",
  phone: "",
  vouchMessage: "",
};

export const CreateInvite = (props: { skipHeading?: boolean }) => {
  const [message, setMessage] = useState<JSX.Element>();

  const formFields = (
    <fieldset>
      <div className="mb-3">
        <label htmlFor="name">Name</label>
        <Field id="name" name="name" className="form-control" />
        <div className="form-text">Name for the new member</div>
        <ErrorMessage
          className="form-text text-danger"
          name="name"
          component="div"
        />
      </div>
      <div className="mb-3" style={{ display: "none" }}>
        <label htmlFor="email">Email</label>
        <Field id="email" type="email" name="email" className="form-control" />
        <div className="form-text">Email address for the new member</div>
        <ErrorMessage
          className="form-text text-danger"
          name="email"
          component="div"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="phone">Phone number (for WhatsApp)</label>
        <Field id="phone" type="phone" name="phone" className="form-control" />
        <div className="form-text">
          WhatsApp phone number, use format: +14154815341
        </div>
        <ErrorMessage
          className="form-text text-danger"
          name="phone"
          component="div"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="vouchMessage">Vouch message</label>
        <Field
          id="vouchMessage"
          name="vouchMessage"
          className="form-control"
          as="textarea"
        />
        <div className="form-text">
          You&apos;re vouching for this new member. Let the other members know
          why you think they&apos;re great!
        </div>
        <ErrorMessage
          className="form-text text-danger"
          name="vouchMessage"
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
          ...initialValues,
        }}
        validationSchema={schema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setMessage(<></>);
          remotePerformAction({
            type: "createInvite",
            payload: values,
          })
            .then(
              (rv) => {
                if (rv.error) {
                  setMessage(<ErrorAlert>{rv.error}</ErrorAlert>);
                } else {
                  const inviteUrl =
                    "https://friends.nyc/invitation/" + rv.inviteCode;

                  setMessage(
                    <SuccessAlert>
                      <a href={inviteUrl}>{inviteUrl}</a>
                    </SuccessAlert>
                  );
                  resetForm();
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
              {props.skipHeading ? null : (
                <h5 className="card-header">Create a new invite</h5>
              )}
              <div className="card-body">
                {formFields}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  Submit
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};
