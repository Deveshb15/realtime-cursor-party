import Image from "next/image";
import CursorProvider from "./context/cursor-context";
import Space from "./components/space";

export default function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // console.log("SEARCH PARAMS ", searchParams);
  const room =
    typeof searchParams?.partyroom === "string"
      ? searchParams.partyroom
      : "devesh-room";

  const host =
    typeof searchParams?.partyhost === "string"
      ? searchParams.partyhost
      : "voronoi-party.genmon.partykit.dev";

  return (
    <CursorProvider host={host} room={room}>
      <Space />
    </CursorProvider>
  );
}
