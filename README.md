# Owna Finance - Secondary Market Backend

Backend service for managing order book and transactions in the Owna Finance secondary market platform. This system uses EIP-712 signed typed data to ensure authenticity and security of orders created by users.

## 📋 Project Description

Owna Finance Secondary Market Backend is a NestJS application that provides REST API for order management in the secondary market platform. The platform allows users to:

- Create orders to swap ERC20 tokens on Base Sepolia blockchain
- Sign orders using Ethereum wallet (EIP-712)
- Verify order signatures
- Execute signed orders
- View active orders list with pagination

## 👨‍💻 Frontend Developer Guide

### Complete Flow: Creating and Verifying an Order

This guide shows frontend developers how to implement the complete order creation flow, from creating an order to making it available for takers to purchase.

#### Step 1: Create Order

**API Call:**

```typescript
const createOrder = async () => {
  const response = await fetch('http://localhost:3000/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      maker: userWalletAddress, // User's wallet address
      makerToken: tokenToSellAddress, // Token the user wants to sell
      makerAmount: '1000000000000000000', // Amount in wei (1 token with 18 decimals)
      takerToken: tokenToBuyAddress, // Token the user wants to receive
      takerAmount: '2000000000000000000', // Amount in wei (2 tokens with 18 decimals)
    }),
  });

  const unsignedTypedData = await response.json();
  return unsignedTypedData;
};
```

**Response Example:**

```json
{
  "account": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "domain": {
    "name": "Owna",
    "version": "1",
    "chainId": 84532,
    "verifyingContract": "0x..."
  },
  "types": {
    "Order": [
      { "name": "maker", "type": "address" },
      { "name": "makerToken", "type": "address" },
      { "name": "makerAmount", "type": "uint256" },
      { "name": "takerToken", "type": "address" },
      { "name": "takerAmount", "type": "uint256" },
      { "name": "salt", "type": "string" }
    ]
  },
  "primaryType": "Order",
  "message": {
    "maker": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "makerToken": "0xAbC...",
    "makerAmount": "1000000000000000000",
    "takerToken": "0xDeF...",
    "takerAmount": "2000000000000000000",
    "salt": "1234567890"
  }
}
```

#### Step 2: Sign the Order with User's Wallet

**Using wagmi/viem:**

```typescript
import { useSignTypedData } from 'wagmi';

const { signTypedDataAsync } = useSignTypedData();

const signOrder = async (unsignedTypedData) => {
  const signature = await signTypedDataAsync({
    domain: unsignedTypedData.domain,
    types: unsignedTypedData.types,
    primaryType: unsignedTypedData.primaryType,
    message: unsignedTypedData.message,
  });

  return signature; // Returns: "0x123abc..."
};
```

**Using ethers.js:**

```typescript
const signOrder = async (unsignedTypedData, signer) => {
  const signature = await signer._signTypedData(
    unsignedTypedData.domain,
    { Order: unsignedTypedData.types.Order },
    unsignedTypedData.message,
  );

  return signature;
};
```

#### Step 3: Verify the Signed Order

**API Call:**

```typescript
const verifyOrder = async (unsignedTypedData, signature) => {
  const response = await fetch('http://localhost:3000/orders/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      order: unsignedTypedData,
      signature: signature,
    }),
  });

  const result = await response.json();
  return result; // Returns: true if valid
};
```

#### Step 4: Complete Implementation Example

```typescript
const createAndVerifyOrder = async () => {
  try {
    // Step 1: Create order
    console.log('Creating order...');
    const unsignedTypedData = await createOrder();

    // Step 2: Request user signature
    console.log('Requesting signature from user...');
    const signature = await signOrder(unsignedTypedData);

    // Step 3: Verify the signature on backend
    console.log('Verifying signature...');
    const isValid = await verifyOrder(unsignedTypedData, signature);

    if (isValid) {
      console.log('✅ Order created and verified successfully!');
      console.log('Order is now ACTIVE and available for takers to purchase.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

#### Important Notes for Frontend Developers:

1. **Order Status Flow:**
   - After Step 1 (Create): Order status = `PENDING_SIGNATURE`
   - After Step 3 (Verify): Order status = `ACTIVE` ✅
   - Only `ACTIVE` orders can be purchased by takers

2. **User Experience Tips:**
   - Show loading state during signature request
   - Handle user rejection of signature gracefully
   - Display confirmation after successful verification
   - Store the order ID for future reference

3. **Error Handling:**

   ```typescript
   try {
     const signature = await signOrder(unsignedTypedData);
   } catch (error) {
     if (error.code === 4001) {
       // User rejected signature
       console.log('User cancelled signing');
     } else {
       // Other errors
       console.error('Signing failed:', error);
     }
   }
   ```

4. **Token Amounts:**
   - Always use wei format (string) for amounts
   - For 18 decimal tokens: 1 token = "1000000000000000000"
   - Use libraries like ethers.js `parseUnits()` or viem `parseEther()` for conversion

## 🔄 Technical Flow - Order Management

### 1. **Create Order Flow**

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant Service
    participant Blockchain
    participant Database

    Client->>Controller: POST /orders<br/>{maker, makerToken, makerAmount, takerToken, takerAmount}
    Controller->>Service: create(createOrderDto)
    Service->>Blockchain: getDecimalsERC20(makerToken)
    Blockchain-->>Service: makerTokenDecimals
    Service->>Blockchain: getDecimalsERC20(takerToken)
    Blockchain-->>Service: takerTokenDecimals
    Service->>Service: Generate unique salt
    Service->>Database: Save order<br/>Status: PENDING_SIGNATURE
    Database-->>Service: Order saved
    Service-->>Controller: Unsigned Typed Data (EIP-712)
    Controller-->>Client: Return unsigned typed data
```

**Process Details:**

- Client sends order details (maker, makerToken, makerAmount, takerToken, takerAmount)
- Backend fetches decimals from both token contracts
- System generates unique salt for the order
- Order is saved to database with status `PENDING_SIGNATURE`
- Backend returns unsigned typed data in EIP-712 format for wallet signing

### 2. **Signature Verification Flow**

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant Service
    participant Blockchain
    participant Database

    Client->>Controller: POST /orders/verify<br/>{order, signature}
    Controller->>Service: verifySignedOrder(order, signature)
    Service->>Service: Validate signature format<br/>(0x + 130 hex chars)
    Service->>Database: Find order by salt
    Database-->>Service: Order data
    Service->>Service: Check status = PENDING_SIGNATURE
    Service->>Blockchain: verifyTypedData()<br/>Verify EIP-712 signature
    Blockchain-->>Service: Signature valid ✓
    Service->>Database: Update order<br/>Status: ACTIVE<br/>Save signature
    Database-->>Service: Order updated
    Service-->>Controller: true (valid)
    Controller-->>Client: Verification successful
```

**Process Details:**

- Client sends order data and signature from wallet signing
- Backend validates signature format (must be 0x + 130 hex chars)
- Check if order exists and status is `PENDING_SIGNATURE`
- Verify signature using viem's `verifyTypedData`
- If valid, update order status to `ACTIVE` and save signature

### 3. **Get Orders List Flow**

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant Service
    participant Database

    Client->>Controller: GET /orders?page=1&limit=10
    Controller->>Service: getOrders(paginationQuery)
    Service->>Database: Query orders<br/>WHERE status = ACTIVE<br/>ORDER BY createdAt DESC<br/>LIMIT 10 OFFSET 0
    Database-->>Service: Order list + total count
    Service->>Service: Calculate pagination meta<br/>(total, page, totalPages)
    Service-->>Controller: {data: [...], meta: {...}}
    Controller-->>Client: Paginated orders response
```

**Process Details:**

- Client requests order list with pagination
- Backend queries orders with status `ACTIVE`
- Apply pagination and sorting
- Return data with metadata (total, page, totalPages)

### 4. **Execute Order Flow**

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant Service
    participant Database

    Client->>Controller: GET /orders/:orderId/execute
    Controller->>Service: executeOrder(orderId)
    Service->>Database: Find order by ID
    Database-->>Service: Order data
    Service->>Service: Validate status = ACTIVE
    Service->>Service: Validate signature exists
    Service->>Service: Build signed typed data<br/>{signature, typedData}
    Service-->>Controller: SignedTypedDataResponse
    Controller-->>Client: Return signed order<br/>Ready for on-chain execution
```

**Process Details:**

- Client requests order execution by ID
- Backend fetches order from database
- Validate order status is `ACTIVE` and signature exists
- Return complete signed typed data ready for blockchain transaction

## 🚀 Setup and Installation

### Prerequisites

- Node.js >= 18
- pnpm
- PostgreSQL
- Base Sepolia RPC URL

### Installation

1. **Install dependencies**

```bash
pnpm install
```

2. **Setup environment variables**
   Create `.env` file with the following configuration:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/owna_secondary_market"
SECONDARY_MARKET_CONTRACT_ADDRESS="0x..."
BASE_SEPOLIA_RPC_URL="https://sepolia.base.org"
PORT=3000
```

3. **Setup database**

```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev
```

4. **Run the application**

```bash
# Development mode with watch
pnpm run start:dev

# Production mode
pnpm run start:prod
```

## 🧪 Testing

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

## 📚 API Documentation

After the application is running, access Swagger documentation at:

```
http://localhost:3000/api-docs
```
