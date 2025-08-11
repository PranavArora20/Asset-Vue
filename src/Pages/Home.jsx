// src/Pages/Home.jsx
import { Link } from "react-router-dom";
import Typewriter from "typewriter-effect";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="typewriter">
          <Typewriter
            options={{
              strings: [
                "Welcome to AssetVue",
                "Track Your Investments in Real-Time",
                "Compare Stocks & Crypto Effortlessly",
              ],
              autoStart: true,
              loop: true,
              delay: 50,
            }}
          />
        </h1>
        <p className="subtitle">
          A sleek dashboard to manage all your assets in one place.
        </p>
        <Link to="/portfolio">
          <button className="cta-button">View Portfolio</button>
        </Link>
      </div>
    </div>
  );
}
