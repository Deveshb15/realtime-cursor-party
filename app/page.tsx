import Image from "next/image";
import CursorProvider from "./context/cursor-context";
import Space from "./components/space";

export default function Home() {
  return (
    <CursorProvider host="voronoi-party.genmon.partykit.dev" room="devesh-room">
      <Space />
    </CursorProvider>
  );
}
