import { useState } from "react";

import { Header } from "./components/Header";
import { FilterNote } from "./components/FilterNote";

function App() {
  const [userId, setUserId] = useState<number>(0);

  return (
    <>
      <Header setUserId={setUserId} />
      <FilterNote userId={userId} />
    </>
  );
}

export default App;
