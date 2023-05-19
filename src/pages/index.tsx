import { Metadata, type NextPage } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app using the components.",
}

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>{hello.data ? hello.data.greeting : "Loading tRPC query..."}</>
  );
};

export default Home;
