import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string, number, date, InferType } from 'yup';
import { Person, pronounOptions } from '../models/Person';

const schema = object({
    name: string().required(),
    legalName: string().required(),
    email: string().email().required(),
    password: string().required('Password is required'),
    pronouns: string().oneOf(pronounOptions).required(),
})
type SignupFields = InferType<typeof schema>;
const initalValues: SignupFields = {
    name: '',
    legalName: '',
    email: '',
    pronouns: '',
    password: '',
};

export const SignupForm = (props: {
    vouchFrom: Person,
    vouchMessage: string,
}) => {
    const { vouchFrom, vouchMessage } = props;
    const registrationFields = (
        <fieldset>
            <legend>Service registration details</legend>
            <div className="mb-3">
                <label htmlFor="email">Email</label>
                <Field type="email" id="email" name="email" className="form-control" />
                <div className="form-text">We won&apos;t send marketing emails</div>
                <ErrorMessage className="form-text text-danger" name="email" component="div" />
            </div>
        </fieldset>
    );
    const publicFields = (

        <fieldset>
            <legend>Member visible fields</legend>
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <Field className="form-control" id="name" name="name" />
                <div className="form-text">What people usually call you</div>
                <ErrorMessage className="form-text text-danger" name="name" component="div" />
            </div>
            <div className="mb-3">
                <label htmlFor="legalName" className="form-label">Legal Name</label>
                <Field name="legalName" className="form-control" />
                <div className="form-text">Occassionally we need your actual name</div>
                <ErrorMessage className="form-text text-danger" name="legalName" component="div" />
            </div>
            <div className="mb-3">
                <label className="form-label">
                    Pronouns
                </label>
                <Field name="pronouns" as="select" className="form-control">
                    <option value="">---</option>
                    {pronounOptions.map(val => (
                        <option key={val} value={val}>{val}</option>
                    ))}
                </Field>
                <div className="form-text">What are your preferred pronouns?</div>
                <ErrorMessage className="form-text text-danger" name="pronouns" component="div" />
            </div>
            <div className="mb-3">
                <label htmlFor="initialVouch">Message from {vouchFrom.name}</label>
                <textarea id="initialVouch" name="initialVouch" className="form-control" disabled={true}>
                    {vouchMessage}
                </textarea>
                <div className="form-text">This will be visible to all members. If you want it updated, please ask {vouchFrom.name}</div>
            </div>
            <div className="mb-3">
                <label htmlFor="whatDo">What do you do?</label>
                <Field id="whatDo" name="whatDo" className="form-control" as="textarea" />
                <div className="form-text">Only used for service related</div>
                <ErrorMessage className="form-text text-danger" name="whatDo" component="div" />
            </div>
        </fieldset>
    )
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
                    {registrationFields}
                    {publicFields}
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        Submit
                    </button>
                </Form>
            )}
        </Formik>

    );
};
