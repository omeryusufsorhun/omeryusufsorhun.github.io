import React from "react";

const About = () => {
  return (
    <div name="about" className="w-full h-screen bg-[#0a192f] text-gray-300">
      <div className="flex flex-col justify-center items-center w-full h-full">
        <div className="max-w-[1000px] w-full grid grid-cols-2 gap-8">
          <div className="sm:text-right pb-8 pl-4">
            <p className="text-4xl font-bold inline border-b-4 border-pink-600">
              About
            </p>
          </div>
          <div></div>
        </div>
        <div className="max-w-[1000px] w-full grid sm:grid-cols-2 gap-8 px-4">
          <div className="sm:text-right text-4xl font-bold m-5">
            <p>Hi. I'm Ömer Yusuf! Please take a look around.</p>
          </div>
          <div>
            <p>
              I have been interested in software for a long time, I had the
              opportunity to improve myself in many areas. I found that I am
              more interested in web programming (like javascript html css
              reactjs vuejs bootstrap tailwindcss nodejs). I am a junior and I
              am very excited to gain experience when I graduate. In order not
              to forget my code habit, I write code and make projects every day.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
