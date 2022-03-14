import type { NextPage } from "next";
import Head from "next/head";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { object, string, InferType } from "yup";

import { AuthRequired } from "../components/AuthRequired";
import { useState } from "react";
import { performAction } from "../frontend/performAction";
import { useRouter } from "next/router";
import { resolve } from "uri-js";
import Link from "next/link";
import styles from "../styles/Home.module.css";

const schema = object({
  name: string().required("Name is required"),
  email: string().email(),
  vouchMessage: string().required("Message is required"),
});
type CreateInviteFields = InferType<typeof schema>;
const initalValues: CreateInviteFields = {
  name: "",
  email: "",
  vouchMessage: "",
};

const CreateInvite: NextPage = () => {
  const [message, setMessage] = useState<JSX.Element>();
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
        <title>Friends</title>
        <meta name="description" content="Friends.nyc" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.container}>
          <div>{message}</div>
          <Formik
            initialValues={{
              ...initalValues,
            }}
            validationSchema={schema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              setMessage(<></>);
              performAction({
                type: "createInvite",
                payload: values,
              })
                .then(
                  (rv) => {
                    if (rv.error) {
                      setMessage(
                        <div className="alert alert-danger m-5" role="alert">
                          <strong>Error: </strong>
                          {rv.error}
                        </div>
                      );
                    } else {
                      const inviteUrl =
                        "https://friends.nyc/invitation/" + rv.inviteCode;

                      setMessage(
                        <div className="alert alert-success m-5" role="alert">
                          <strong>Success!</strong>{" "}
                          <Link
                            href={{
                              href: inviteUrl,
                            }}
                          >
                            {inviteUrl}
                          </Link>
                        </div>
                      );
                      resetForm();
                    }
                  },
                  (err) => {
                    setMessage(
                      <div className="alert alert-danger m-5" role="alert">
                        <strong>Error: </strong>
                        {err.toString()}
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
        </div>
      </main>
    </AuthRequired>
  );
};

export default CreateInvite;
