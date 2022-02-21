import styles from '../styles/Welcome.module.css'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string, number, date, InferType } from 'yup';


interface Person {
    name: string,
    pronoun1: string,
    pronoun2: string,
}
export const Welcome = (props: {
    vouchFrom: Person,
    vouchMessage: string,
    inviteName: string,
}) => {
    const {vouchFrom, vouchMessage, inviteName} = props;
    const pronounOptions = [
        'he/him',
        'she/her',
        'they/them',
    ];
    const schema = object({
        name: string().required(),
        legalName: string().required(),
        email: string().email().required(),
        pronouns: string().oneOf(pronounOptions).required(),
    })
    return (
        <div className={styles.main}>
            <div className={styles.invite}>
            <h1>Your invitation to Friands Club</h1>

            <p>Hi {inviteName},</p>
            <p>
                Firstly well done, and thank you! In order to receive one of these invites,
                you are one of the nicer inhabitants of our lovely planet. You've also
                shown yourself to be trustworthy, creative and tasteful. Atleast {vouchFrom.name} thinks so,
                and strongly enough that {vouchFrom.pronoun1} vouched for you. Here's what {vouchFrom.pronoun1} had to say:
            </p>
            <blockquote>
                {vouchMessage.split('\n\n')}
            </blockquote>
            <p>
                Okay! So what is Friands Club? We hope it'll be one of the most
                valuable communities that you'll be a part of. We're trying to creative
                a new tight-knit online community of nice, creative and tasteful humans.
                A space where you can safely trust everyone else by default, and where
                its members are proactive in helping eachother and hosting events.
            </p>
            <p>
                This is still a <em>very new</em> project, and you should expect it to take
                a while to get the ball rolling.
            </p>
            <Formik
                initialValues={{ 
                    name: '',
                    legalName: '',
                    email: '',
                    pronouns: '',
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
                    <div>
                        <label>Name <Field name="name" /></label>
                        <small>What people usually call you</small>
                        <ErrorMessage name="name" component="div" />
                    </div>
                    <div>
                        <label>Legal Name <Field name="legalName" /></label>
                        <small>Occassionally we need your actual name</small>
                        <ErrorMessage name="legalName" component="div" />
                    </div>
                    <div>
                        <label>
                            Pronouns
                            <Field name="pronouns" as="select">
                                <option value="">---</option>
                                {pronounOptions.map(val => (
                                    <option key={val} value={val}>{val}</option>
                                ))}
                            </Field>
                        </label>
                        <ErrorMessage name="pronouns" component="div" />
                    </div>
                    <div>
                        <label>Email <Field type="email" name="email" /></label>
                        <small>Only used for service related</small>
                        <ErrorMessage name="email" component="div" />
                    </div>
                    <button type="submit" disabled={isSubmitting}>
                        Submit
                    </button>
                    </Form>
                )}
            </Formik>
            </div>
        </div>


    );
}
