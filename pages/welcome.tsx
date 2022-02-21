import styles from '../styles/Welcome.module.css'
import { SignupForm } from './SignupForm';


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
    const { vouchFrom, vouchMessage, inviteName } = props;
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
                    {vouchMessage.split('\n\n').map(p => (
                        <p>{p}</p>
                    ))}
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
            </div>
            <div className={styles.signupForm}>
                <div className="card">
                    <h5 className="card-header">Ready to sign up?</h5>
                    <div className="card-body">
                        <SignupForm vouchFrom={vouchFrom} vouchMessage={vouchMessage} />
                    </div>
                </div>
            </div>
        </div>


    );
}
