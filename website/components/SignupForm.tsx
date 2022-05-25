import { Formik, Form, Field, ErrorMessage } from "formik";
import { object, string, InferType } from "yup";
import { Person } from "../models/Person";
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
  /*
  @ Pronouns commented out until I can make a better selection box.
  pronouns: string()
    .oneOf([...pronounOptions])
    .required("Your choice of pronoun is required"),*/
  whatDo: string()
    .required("What you do is a required field")
    .min(50, "Please include a longer description about what you do"),
});
type SignupFields = InferType<typeof schema>;
const initalValues: SignupFields = {
  email: "",
  name: "",
  // pronouns: "",
  whatDo: "",
};

const SignupForm = (props: {
  vouchFrom: Person;
  vouchMessage: string;
  invitedName: string;
  invitedEmail: string;
  inviteCode: string;
}) => {
  const { vouchFrom, vouchMessage, invitedEmail, invitedName, inviteCode } =
    props;
  const [status, setStatus] = useState<JSX.Element>();
  const router = useRouter();

  const { data: session } = useSession() as {
    data: FriendsSession;
    status: string;
  };

  if (!session) {
    return (
      <div className="card">
        <h5 className="card-header">Ready to sign up?</h5>
        <div className="card-body">
          <button className="btn btn-primary" onClick={() => signIn("google")}>
            Sign in with Google
          </button>
        </div>
        <div className="card-body">
          <p>
            Your Google account is used for shared calendars, and some future
            services.
          </p>
        </div>
      </div>
    );
  }

  if (session.user.memberActive) {
    return (
      <div className="card">
        <h5 className="card-header">Member already active</h5>
        <div className="card-body">
          <div className="alert alert-danger" role="alert">
            You are already logged in as an active member.{" "}
            <Link href="/">
              <a>Go to membership page</a>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  const sessionEmail = session.user?.email;
  if (!sessionEmail) {
    throw new Error("Expected session user to have email address");
  }

  const registrationFields = (
    <fieldset>
      <div className="mb-3">
        <label htmlFor="email">Email</label>
        <Field type="email" id="email" name="email" className="form-control" />
        <div className="form-text">We won&apos;t send marketing emails</div>
        <ErrorMessage
          className="form-text text-danger"
          name="email"
          component="div"
        />
      </div>
    </fieldset>
  );
  const publicFields = (
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

      {/*
      <div className="mb-3">
        <label className="form-label">Pronouns</label>
        <Field name="pronouns" as="select" className="form-control">
          <option value="">---</option>
          {pronounOptions.map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </Field>
        <div className="form-text">What are your preferred pronouns?</div>
        <ErrorMessage
          className="form-text text-danger"
          name="pronouns"
          component="div"
        />
      </div>
      */}

      <div className="mb-3">
        <label htmlFor="initialVouch">Message from {vouchFrom.name}</label>
        <textarea
          id="initialVouch"
          name="initialVouch"
          className="form-control"
          disabled={true}
          defaultValue={vouchMessage}
        />
        <div className="form-text">
          This will be visible to all members. If you want it updated, please
          ask {vouchFrom.name}
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="whatDo">What do you do?</label>
        <Field
          id="whatDo"
          name="whatDo"
          className="form-control"
          as="textarea"
        />
        <div className="form-text">
          Let the other members know who you are, what you&apos;re working on,
          and generally what you do with your life
        </div>
        <ErrorMessage
          className="form-text text-danger"
          name="whatDo"
          component="div"
        />
      </div>
    </fieldset>
  );
  return (
    <Formik
      initialValues={{
        ...initalValues,
        email: invitedEmail,
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
          type: "acceptInvite",
          payload: {
            ...values,
            pronouns: "they/them", // values.pronouns as typeof pronounOptions[number],
            inviteCode,
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
            <h5 className="card-header">Ready to sign up?</h5>

            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="google">Google account</label>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    id="google"
                    name="google"
                    disabled={true}
                    value={sessionEmail}
                    className="form-control"
                  />
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => signOut()}
                    style={{
                      textAlign: "center",
                      fontSize: "0.8em",
                    }}
                  >
                    Sign out
                  </button>
                </div>
                <div className="form-text">Required for some services</div>
              </div>
              {registrationFields}
            </div>
            <h5 className="card-header">Member visible fields</h5>
            <div className="card-body">
              <div
                className="alert alert-primary d-flex align-items-center"
                role="alert"
              >
                <Image
                  src="/bootstrap-icons/info.svg"
                  alt="Info Icon"
                  width="16"
                  height="16"
                  className="icon"
                />
                Everything below will be visible to all other Friends.nyc
                members
              </div>
              {publicFields}
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

export default SignupForm;
