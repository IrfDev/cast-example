import { useEffect, useState } from "react";
import Menus from "./Menus";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  async function getPosts() {
    try {
      let response = await fetch(
        "https://dev-mobile.staytus.com/api/v1/web/property/stsdt/edn"
      );

      let jsonResp = await response.json();

      setPosts(jsonResp.data.outlets);
      console.log("posts", jsonResp.data.outlets);
    } catch (error) {
      console.log("error", error);
    }
  }

  useEffect(() => {
    getPosts();
    return () => {
      // second;
    };
  }, []);

  return (
    <div className="App">
      <header className=" h-screen bg-black">
        <Menus outlets={posts} />
      </header>
    </div>
  );
}

export default App;
