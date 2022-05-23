import React from "react";

import Post from "./Post";

const PostGrid = (data) => {
  const sortedByDate = data.data.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <>
      <div className="w-[95%] grid grid-cols-5 gap-y-[250px] py-7">
        {sortedByDate.map((post) => (
          <Post key={post._id} postID={post._id} />
        ))}
      </div>
    </>
  );
};

export default PostGrid;
