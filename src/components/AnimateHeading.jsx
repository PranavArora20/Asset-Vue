// src/components/AnimatedHeading.jsx
import React from "react";
import { Typewriter, Cursor } from "react-simple-typewriter";

export default function AnimatedHeading() {
  return (
    <h1 style={{ fontSize: "2.5rem", color: "#001529", margin: "2rem 0" }}>
      <Typewriter
        words={["Welcome to AssetVue"]}
        typeSpeed={100}
        cursor
        cursorStyle="|"
        loop={false}
      />
      <Cursor cursorColor="#00E6A8" />
    </h1>
  );
}
 