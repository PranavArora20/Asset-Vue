import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { setAssets } from "./redux/PortfolioSlice";
import { subscribeToRealtimeAssets, getAssetsFromRealtimeDB } from "./services/firebaseService";
import Home from "./Pages/Home";
import Portfolio from "./Pages/Portfolio";
import Compare from "./Pages/Compare";

function App() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state)=>state.theme.darkMode);

  // Set up Firebase subscription to populate Redux store
  useEffect(() => {
    console.log("Setting up Firebase subscription...");
    
    // First, try to get initial assets
    const getInitialAssets = async () => {
      try {
        console.log("Fetching initial assets from Realtime Database...");
        const initialAssets = await getAssetsFromRealtimeDB();
        console.log("Initial assets fetched:", initialAssets);
        dispatch(setAssets(initialAssets));
      } catch (error) {
        console.error("Error fetching initial assets:", error);
      }
    };

    getInitialAssets();

    // Then set up real-time subscription
    const unsubscribe = subscribeToRealtimeAssets((assets) => {
      console.log("Assets updated from Firebase Realtime Database:", assets);
      console.log("Number of assets:", assets.length);
      if (assets && assets.length > 0) {
        console.log("First asset sample:", assets[0]);
      }
      dispatch(setAssets(assets));
    });

    console.log("Firebase subscription set up successfully");

    // Cleanup subscription on unmount
    return () => {
      console.log("Cleaning up Firebase subscription");
      unsubscribe();
    };
  }, [dispatch]);

  return (
    <div className={darkMode ? 'app dark-mode' : 'app light-mode'}>
      {/* <h1>Hello</h1> */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/portfolio" element={<Portfolio/>}/>
        <Route path="/compare" element={<Compare/>}/>
      </Routes>
    </div>
  );
}

export default App;
