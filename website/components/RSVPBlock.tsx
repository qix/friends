import { Formik, Form, Field, ErrorMessage } from "formik";
import { object, string, number, date, InferType } from "yup";
import { Person, pronounOptions } from "../models/Person";
import Image from "next/image";

import { useSession, signIn, signOut } from "next-auth/react";
import { remotePerformAction } from "../frontend/performAction";
import { useState } from "react";
import { FriendsSession } from "../pages/api/auth/[...nextauth]";
import Link from "next/link";
import { useRouter } from "next/router";

const schema = object({
  email: string()
    .email()
    .required("We require your email address for login and updates"),
  name: string().required("Name is required"),
  pronouns: string()
    .oneOf([...pronounOptions])
    .required("Your choice of pronoun is required"),
  whatDo: string()
    .required("What you do is a required field")
    .min(50, "Please include a longer description about what you do"),
});
type SignupFields = InferType<typeof schema>;
const initalValues: SignupFields = {
  email: "",
  name: "",
  pronouns: "",
  whatDo: "",
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
        <div className="form-text">
          What&apos;s your name? Ideally just your full legal name. To reduce
          confusion we do require this to be unique across all Friends.
        </div>
        <ErrorMessage
          className="form-text text-danger"
          name="name"
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
            Creating new account...
          </div>
        );
        remotePerformAction({
          type: "rsvp",
          payload: {
            ...values,
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
                  Failed to create account: {err.toString()}
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
