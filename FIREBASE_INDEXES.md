# Firebase Indexes Configuration

## Overview
This document outlines the Firebase Firestore indexes required for optimal performance of the AssetVue application.

## Required Indexes

### 1. **Basic Collection Index**
**Collection**: `assets`
**Fields**:
- `createdAt` (Ascending)
- `typeLower` (Ascending)
- `nameLower` (Ascending)

**Purpose**: Enables efficient sorting and filtering by creation date, type, and name.

### 2. **Search Index**
**Collection**: `assets`
**Fields**:
- `searchableText` (Ascending)
- `createdAt` (Descending)

**Purpose**: Enables efficient text search with date sorting.

### 3. **Type Filter Index**
**Collection**: `assets`
**Fields**:
- `typeLower` (Ascending)
- `createdAt` (Descending)

**Purpose**: Enables filtering by asset type with date sorting.

### 4. **Value Range Index**
**Collection**: `assets`
**Fields**:
- `totalValue` (Ascending)
- `createdAt` (Descending)

**Purpose**: Enables filtering by investment amount ranges.

### 5. **Compound Search Index**
**Collection**: `assets`
**Fields**:
- `typeLower` (Ascending)
- `totalValue` (Ascending)
- `createdAt` (Descending)

**Purpose**: Enables complex queries combining type and value filters.

## How to Create Indexes

### Method 1: Firebase Console (Recommended)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Firestore Database**
4. Click on **Indexes** tab
5. Click **Create Index**
6. Add the indexes listed above

### Method 2: Firebase CLI
Create a `firestore.indexes.json` file:

```json
{
  "indexes": [
    {
      "collectionGroup": "assets",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "createdAt",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "typeLower",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "nameLower",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "assets",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "searchableText",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "assets",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "typeLower",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "assets",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "totalValue",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "assets",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "typeLower",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "totalValue",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
```

Then deploy with:
```bash
firebase deploy --only firestore:indexes
```

## Indexed Fields in Code

The application automatically creates these indexed fields when adding assets:

### **nameLower**
- **Type**: String
- **Value**: Lowercase version of asset name
- **Purpose**: Case-insensitive name searches

### **typeLower**
- **Type**: String
- **Value**: Lowercase version of asset type
- **Purpose**: Case-insensitive type filtering

### **searchableText**
- **Type**: String
- **Value**: Combined lowercase name and type
- **Purpose**: Full-text search across name and type

### **totalValue**
- **Type**: Number
- **Value**: purchasePrice × quantity
- **Purpose**: Value-based filtering and sorting

### **createdAt**
- **Type**: Timestamp
- **Value**: Server timestamp when asset was created
- **Purpose**: Chronological sorting and filtering

### **lastUpdated**
- **Type**: Timestamp
- **Value**: Server timestamp when asset was last modified
- **Purpose**: Tracking modifications

## Performance Benefits

### **Query Optimization**
- **Search**: O(log n) instead of O(n) for text searches
- **Filtering**: Efficient type and value-based filtering
- **Sorting**: Fast chronological and value-based sorting

### **Real-time Updates**
- **Subscription Performance**: Optimized real-time listeners
- **Filtered Subscriptions**: Only receive relevant updates

### **Scalability**
- **Large Datasets**: Maintains performance with thousands of assets
- **Complex Queries**: Efficient multi-field filtering

## Monitoring Index Usage

### **Firebase Console**
1. Go to **Firestore Database** > **Usage**
2. Check **Indexes** section
3. Monitor index usage and performance

### **Common Issues**
- **Missing Indexes**: Queries will fail with specific error messages
- **Index Building**: New indexes take time to build (usually 1-5 minutes)
- **Index Limits**: Firestore has limits on composite indexes per collection

## Best Practices

### **Index Design**
- Create indexes only for queries you actually use
- Use compound indexes for multi-field queries
- Consider query patterns when designing indexes

### **Data Structure**
- Keep indexed fields as simple as possible
- Use consistent data types across documents
- Avoid deeply nested fields in indexes

### **Performance**
- Monitor index usage regularly
- Remove unused indexes to save costs
- Use pagination for large result sets

## Troubleshooting

### **Index Errors**
If you see errors like "The query requires an index", follow the link in the error message to create the required index automatically.

### **Slow Queries**
1. Check if appropriate indexes exist
2. Verify query structure matches index design
3. Consider query optimization techniques

### **Index Building**
- Indexes build in the background
- Large collections may take longer
- Monitor progress in Firebase Console