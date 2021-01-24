import React from "react";
import Link from "next/link";

const Home = () => {
  return (
    <div>
      <h1>Welcome</h1>
      <Link href="/room">
        <a>Go to room</a>
      </Link>
      <Link href="/room/create">
        <a>Create room</a>
      </Link>
    </div>
  );
};

export default Home;
