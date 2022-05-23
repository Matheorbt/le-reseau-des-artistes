import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";

import PostGrid from "../../posts/PostGrid";

function SavedPosts() {
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
        {user?.savedPosts?.length ? (
          <div className="flex justify-center items-center w-full py-4">
            <PostGrid data={user.savedPosts} />
          </div>
        ) : (
          <div className="text-center py-4">
            <h1 className="text-white font-poppins text-2xl">
              Aucun post sauvegardé.
            </h1>
          </div>
        )}
      </main>
    </>
  );
}

export default SavedPosts;
