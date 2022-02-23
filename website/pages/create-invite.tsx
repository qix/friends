import type { NextPage } from "next";
import Head from "next/head";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { object, string, number, date, InferType } from "yup";

import { AuthRequired } from "../components/AuthRequired";
import { useState } from "react";
import { Action } from "../models/Action";
import { performAction } from "../frontend/performAction";
import { useRouter } from "next/router";
import { resolve } from "uri-js";

const schema = object({
  name: string().required("Name is required"),
  email: string().email().required("Email is required"),
  vouchMessage: string().required("Message is required"),
});
type CreateInviteFields = InferType<typeof schema>;
const initalValues: CreateInviteFields = {
  name: "",
  email: "",
  vouchMessage: "",
};

const CreateInvite: NextPage = () => {
  const [message, setMessage] = useState<string>();
  const router = useRouter();

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
      <div className="mb-3">
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
    <AuthRequired>
      <Head>
        <title>Friands</title>
        <meta name="description" content="Friands Club" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Formik
        initialValues={{
          ...initalValues,
        }}
        validationSchema={schema}
        onSubmit={(values, { setSubmitting }) => {
          setMessage("Submitting...");
          performAction({
            type: "createInvite",
            payload: values,
          })
            .then(
              (rv) => {
                if (rv.error) {
                  setMessage("Error: " + rv.error);
                } else {
                  const inviteUrl = resolve(
                    router.basePath,
                    "invitation/" + rv.inviteCode
                  );
                  setMessage("Okay: " + inviteUrl);
                }
              },
              (err) => {
                setMessage("Error: " + err.toString());
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
                  Submit
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      <div>{message}</div>
    </AuthRequired>
  );
};

export default CreateInvite;