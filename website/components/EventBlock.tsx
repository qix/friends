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
    <>
      <div className="card">
        <h5 className="card-header">{eventNameWithDate}</h5>
        <div className="card-body">hoho</div>
        <Image
          className="rounded card-image-top"
          src={imageHeader}
          alt=""
          width={630}
          height={211}
        />
      </div>

      <p>{description}</p>
      <div>
        <RSVPBlock invitedName={invitedName} />
      </div>
    </>
  );
};
