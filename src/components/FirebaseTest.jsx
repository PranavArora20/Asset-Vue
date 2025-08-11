import React, { useState } from 'react';
import { addAsset, subscribeToAssets } from '../services/firebaseService';

const FirebaseTest = () => {
  const [testMessage, setTestMessage] = useState('');
  const [assets, setAssets] = useState([]);

  const testAddAsset = async () => {
    try {
      setTestMessage('Testing Firebase add...');
      
      const testAsset = {
        name: 'TEST',
        type: 'stock',
        purchasePrice: 100,
        quantity: 1,
        amountInvested: 100
      };

      const docId = await addAsset(testAsset);
      setTestMessage(`✅ Asset added successfully! Document ID: ${docId}`);
      
      setTimeout(() => setTestMessage(''), 5000);
    } catch (error) {
      setTestMessage(`❌ Error: ${error.message}`);
      console.error('Test error:', error);
    }
  };

  const testSubscription = () => {
    try {
      setTestMessage('Testing Firebase subscription...');
      
      const unsubscribe = subscribeToAssets((data) => {
        setAssets(data);
        setTestMessage(`✅ Subscription working! Found ${data.length} assets`);
        setTimeout(() => setTestMessage(''), 3000);
      });

      // Cleanup after 10 seconds
      setTimeout(() => {
        unsubscribe();
        setTestMessage('Subscription test completed');
      }, 10000);
      
    } catch (error) {
      setTestMessage(`❌ Subscription error: ${error.message}`);
    }
  };

  return (
    <div style={{ 
      background: '#f0f0f0', 
      padding: '20px', 
      margin: '20px', 
      borderRadius: '8px',
      border: '1px solid #ccc'
    }}>
      <h3>Firebase Connection Test</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={testAddAsset}
          style={{ 
            marginRight: '10px',
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Add Asset
        </button>
        
        <button 
          onClick={testSubscription}
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Subscription
        </button>
      </div>

      {testMessage && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: testMessage.includes('❌') ? '#f8d7da' : '#d4edda',
          color: testMessage.includes('❌') ? '#721c24' : '#155724',
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          {testMessage}
        </div>
      )}

      {assets.length > 0 && (
        <div>
          <h4>Current Assets in Firebase:</h4>
          <ul style={{ fontSize: '14px' }}>
            {assets.map(asset => (
              <li key={asset.id}>
                {asset.name} - {asset.type} - ${asset.purchasePrice} x {asset.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FirebaseTest; 