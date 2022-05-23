import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import axios from "axios";
import { Link } from "react-router-dom";

import PostGrid from "../../posts/PostGrid";

function Feed() {
  const [posts, setPosts] = useState();
  const [error, setError] = useState();
  const getPosts = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      const { data } = await axios.get("/api/post/postlist", config);
      setPosts(data.postsList);
      localStorage.setItem("user", JSON.stringify(data.data));
    } catch (error) {
      setError("Error while trying to retrieve posts list");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  useEffect(() => {
    getPosts();
  }, [!posts]);

  return (
    <>
      <Navbar />
      <main className="bg-main-black min-h-screen w-full">
        {posts?.length ? (
          <div className="flex justify-center items-center w-full py-4">
            <PostGrid data={posts} />
          </div>
        ) : (
          <div className="text-center py-4">
            <h1 className="text-white font-poppins text-2xl">
              Aucun post n'a encore été publié.
            </h1>
            <Link to="createpost" className="text-link font-poppins text-xl">
              Soyez le premier !
            </Link>
          </div>
        )}
      </main>
    </>
  );
}

export default Feed;
