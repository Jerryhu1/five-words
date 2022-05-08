import React from "react";
import Link from "next/link";

const Home = () => {
  return (
    <div className="flex justify-center p-10">
      <div className="flex flex-col justify-center w-1/2 xs:w-full text-center">
        <h1 className="text-6xl font-bold mb-10">Five words</h1>
        <div className="flex justify-between">
          <Link href="/room">
            <button className="w-32 btn-primary">
              <a>Join room</a>
            </button>
          </Link>
          <Link href="/room/create">
            <button className="w-36 btn-primary">
              <a>Create room</a>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
