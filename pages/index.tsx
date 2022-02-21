import type { NextPage } from "next";
import Head from "next/head";
import WelcomePage from "../components/WelcomePage";

const Home: NextPage = () => {
  const message =
    "Jess is smart, creative, and friendly. She always brings the best out of " +
    "people and manages to bring some of the best people together.\n" +
    "\n" +
    "A digital artist herself, she manages to find and promote a wide variety " +
    "of other artists.";
  const josh = { name: "Josh", pronoun1: "he", pronoun2: "him" };

  return (
    <div className="container">
      <Head>
        <title>Friands</title>
        <meta name="description" content="Friands Club" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <WelcomePage vouchFrom={josh} vouchMessage={message} inviteName="Jess" />
    </div>
  );
};

export default Home;
