import { Formik, Form, Field, ErrorMessage } from "formik";
import { object, string, number, date, InferType } from "yup";
import { Person, pronounOptions } from "../models/Person";
import Image from "next/image";

import { useSession, signIn, signOut } from "next-auth/react";

const schema = object({
  email: string()
    .email()
    .required("We require your email address for login and updates"),
  password: string().required("Password is required"),
  name: string().required("Name is required"),
  pronouns: string()
    .oneOf(pronounOptions)
    .required("Your choice of pronoun is required"),
  whatDo: string()
    .required("What you do is a required field")
    .min(50, "Please include a longer description about what you do"),
});
type SignupFields = InferType<typeof schema>;
const initalValues: SignupFields = {
  email: "",
  password: "",
  name: "",
  pronouns: "",
  whatDo: "",
};

export const SignupForm = (props: {
  vouchFrom: Person;
  vouchMessage: string;
}) => {
  const { data: session } = useSession();
  if (!session) {
    return (
      <div className="card">
        <h5 className="card-header">Ready to sign up?</h5>
        <div className="card-body">
          <button className="btn btn-primary" onClick={() => signIn()}>
            Sign-in with Google
          </button>
        </div>
      </div>
    );
  }
  const sessionEmail = session.user?.email;
  if (!sessionEmail) {
    throw new Error("Expected session user to have email address");
  }

  const { vouchFrom, vouchMessage } = props;
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
      <div className="mb-3">
        <label htmlFor="password">Password</label>
        <Field
          type="password"
          id="password"
          name="password"
          className="form-control"
        />
        <div className="form-text">Password to login to membership website</div>
        <ErrorMessage
          className="form-text text-danger"
          name="password"
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
          confusion we do require this to be unique across all Friands.
        </div>
        <ErrorMessage
          className="form-text text-danger"
          name="name"
          component="div"
        />
      </div>
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
      }}
      validationSchema={schema}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="card">
            <h5 className="card-header">Ready to sign up?</h5>

            <div className="card-body">
              Signed in as {sessionEmail} <br />
              <button onClick={() => signOut()}>Sign out</button>
            </div>
            <div className="card-body">{registrationFields}</div>
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
                Everything below will be visible to all other Friands Club
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
          </div>
        </Form>
      )}
    </Formik>
  );
};
