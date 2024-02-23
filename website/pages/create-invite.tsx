import type { NextPage } from "next";

import { AuthenticatedPage } from "../components/AuthRequired";
import { CreateInvite } from "../components/CreateInvite";

const CreateInvitePage: NextPage = () => {
  return (
    <AuthenticatedPage title="Create Invite">
      <CreateInvite />
    </AuthenticatedPage>
  );
};

export default CreateInvitePage;
