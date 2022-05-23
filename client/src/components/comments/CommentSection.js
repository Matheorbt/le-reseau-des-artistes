import React from "react";

import Comment from "./Comment";

const CommentSection = (data) => {
  const sortedByDate = data.data.sort(function (a, b) {
    return b.date - a.date;
  });
  console.log(data.user);
  return (
    <div className="w-[98%] my-10 flex flex-col justify-around gap-20">
      {sortedByDate.map((comment) => (
        <Comment
          key={comment._id}
          data={comment._id}
          post={data.post}
          user={data.user}
        />
      ))}
    </div>
  );
};

export default CommentSection;
