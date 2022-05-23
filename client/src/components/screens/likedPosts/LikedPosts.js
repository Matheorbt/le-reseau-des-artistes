import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";

import PostGrid from "../../posts/PostGrid";

function LikedPosts() {
  const [user, setUser] = useState();

  useEffect(() => {
    try {
      setUser(JSON?.parse(localStorage.getItem("user")));
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <>
      <Navbar />
      <main className="bg-main-black min-h-screen w-full">
        {user?.likedPosts?.length ? (
          <div className="flex justify-center items-center w-full py-4">
            <PostGrid data={user.likedPosts} />
          </div>
        ) : (
          <div className="text-center py-4">
            <h1 className="text-white font-poppins text-2xl">
              Aucun post aimé.
            </h1>
          </div>
        )}
      </main>
    </>
  );
}

export default LikedPosts;
