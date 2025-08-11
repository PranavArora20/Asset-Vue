// services/firebaseService.js
import { collection, addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { ref, onValue, set, remove, push, get } from "firebase/database";
import { db, realtimeDb } from "../utils/firebase";

// 🔹 Test Realtime Database connection
export const testRealtimeDBConnection = async () => {
  try {
    console.log("Testing Realtime Database connection...");
    const testRef = ref(realtimeDb, 'test');
    await set(testRef, { timestamp: Date.now(), message: 'Connection test' });
    console.log("✅ Realtime Database connection successful!");
    
    // Clean up test data
    await remove(testRef);
    return true;
  } catch (error) {
    console.error("❌ Realtime Database connection failed:", error);
    return false;
  }
};

// 🔹 Check what data exists in Realtime Database
export const checkRealtimeDBData = async () => {
  try {
    console.log("Checking Realtime Database for existing data...");
    const rootRef = ref(realtimeDb);
    const snapshot = await get(rootRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log("📊 Realtime Database root data:", data);
      
      if (data.assets) {
        console.log("📈 Assets found:", data.assets);
        const assetCount = Object.keys(data.assets).length;
        console.log(`📊 Total assets: ${assetCount}`);
      } else {
        console.log("❌ No assets node found in Realtime Database");
      }
    } else {
      console.log("❌ Realtime Database is empty");
    }
    
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error("❌ Error checking Realtime Database:", error);
    return null;
  }
};

// 🔹 Add new asset to Firestore
export const addAsset = async (asset) => {
  try {
    await addDoc(collection(db, "assets"), asset);
    console.log("Asset added successfully");
  } catch (error) {
    console.error("Error adding asset: ", error);
  }
};

// 🔹 Add new asset to Realtime Database
export const addAssetToRealtimeDB = async (asset) => {
  try {
    console.log("Adding asset to Realtime Database:", asset);
    const assetsRef = ref(realtimeDb, 'assets');
    const newAssetRef = push(assetsRef);
    await set(newAssetRef, asset);
    console.log("✅ Asset added to Realtime DB successfully with ID:", newAssetRef.key);
    return newAssetRef.key;
  } catch (error) {
    console.error("❌ Error adding asset to Realtime DB: ", error);
    throw error;
  }
};

// 🔹 Subscribe to assets from Firestore (real-time updates)
export const subscribeToAssets = (callback) => {
  const assetsRef = collection(db, "assets");
  return onSnapshot(assetsRef, (snapshot) => {
    const assets = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(assets);
  });
};

// 🔹 Subscribe to assets from Realtime Database (real-time updates)
export const subscribeToRealtimeAssets = (callback) => {
  const assetsRef = ref(realtimeDb, 'assets');
  return onValue(assetsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const assets = Object.keys(data).map(key => ({
        id: key,
        ...data[key],
      }));
      callback(assets);
    } else {
      callback([]);
    }
  });
};

// 🔹 Delete asset from Firestore
export const deleteAsset = async (id) => {
  try {
    await deleteDoc(doc(db, "assets", id));
    console.log("Asset deleted successfully");
  } catch (error) {
    console.error("Error deleting asset: ", error);
  }
};

// 🔹 Delete asset from Realtime Database
export const deleteAssetFromRealtimeDB = async (id) => {
  try {
    const assetRef = ref(realtimeDb, `assets/${id}`);
    await remove(assetRef);
    console.log("Asset deleted from Realtime DB successfully");
  } catch (error) {
    console.error("Error deleting asset from Realtime DB: ", error);
    throw error;
  }
};

// 🔹 Get all assets from Realtime Database (one-time fetch)
export const getAssetsFromRealtimeDB = async () => {
  try {
    const assetsRef = ref(realtimeDb, 'assets');
    return new Promise((resolve, reject) => {
      onValue(assetsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const assets = Object.keys(data).map(key => ({
            id: key,
            ...data[key],
          }));
          resolve(assets);
        } else {
          resolve([]);
        }
      }, (error) => {
        reject(error);
      }, { onlyOnce: true });
    });
  } catch (error) {
    console.error("Error fetching assets from Realtime DB: ", error);
    throw error;
  }
};
