import styles from "../styles/Invitation.module.css";
import { RSVPBlock } from "./RSVPBlock";
import Image from "next/image";

export const EventBlock = (props: {
  eventNameWithDate: string;
  description: string;
  imageHeader: string;
  invitedName: string;
}) => {
  const { eventNameWithDate, description, imageHeader, invitedName } = props;
  return (
    <div className={styles.main}>
      <div className={styles.invite}>
        <h1>{eventNameWithDate}</h1>
        <Image src={imageHeader} alt="" width={630} height={211} />

        <p>{description}</p>
      </div>
      <div className={styles.signupForm}>
        <RSVPBlock invitedName={invitedName} />
      </div>
    </div>
  );
};
