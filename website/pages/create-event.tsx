import type { NextPage } from "next";
import Head from "next/head";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { object, string, InferType } from "yup";
import Image from "next/image";

import { AuthenticatedPage } from "../components/AuthRequired";
import { useState } from "react";
import { remotePerformAction } from "../frontend/performAction";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { ErrorAlert, SuccessAlert } from "../components/alerts";

const schema = object({
  name: string().required("Name is required"),
  slug: string().required("slug is required"),
});
type CreateEventFields = InferType<typeof schema>;
const initalValues: CreateEventFields = {
  name: "",
  slug: "",
};

const CreateEvent: NextPage = () => {
  const [message, setMessage] = useState<JSX.Element>();
  const router = useRouter();

  const formFields = (
    <fieldset>
      <div className="mb-3">
        <label htmlFor="name">Name</label>
        <Field id="name" name="name" className="form-control" />
        <div className="form-text">Name for the event</div>
        <ErrorMessage
          className="form-text text-danger"
          name="name"
          component="div"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="slug">Slug</label>
        <Field id="slug" type="slug" name="slug" className="form-control" />
        <div className="form-text">URI</div>
        <ErrorMessage
          className="form-text text-danger"
          name="slug"
          component="div"
        />
      </div>
    </fieldset>
  );
  return (
    <AuthenticatedPage title="Create Event">
      <div>{message}</div>
      <Formik
        initialValues={{
          ...initalValues,
        }}
        validationSchema={schema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setMessage(<></>);
          remotePerformAction({
            type: "createEvent",
            payload: values,
          })
            .then(
              (rv) => {
                if (rv.error) {
                  setMessage(<ErrorAlert>{rv.error}</ErrorAlert>);
                } else {
                  const eventUrl = "https://friends.nyc/event/" + rv.slug;

                  setMessage(
                    <SuccessAlert>
                      <a href={eventUrl}>{eventUrl}</a>
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
              <h5 className="card-header">Create a new event</h5>
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
    </AuthenticatedPage>
  );
};

export default CreateEvent;
