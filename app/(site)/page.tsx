import getSongs from "@/actions/getSongs";
import Header from "@/components/header";
import ListItem from "@/components/listItem";
import PageContent from "./components/pageContent";

export const revalidate = 0;

export default async function Home() {

  const songs = await getSongs();

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h1 className="text-white text-3xl text-semibold">Welcome Back</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4">
            <ListItem 
              image="/images/liked.png"
              href="liked"
              name="Liked Songs"
            />
          </div>
        </div>
      </Header>
      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">
            Newest Songs
          </h1>
        </div>
        <PageContent songs={songs}/>
      </div>
    </div>
  );
}
