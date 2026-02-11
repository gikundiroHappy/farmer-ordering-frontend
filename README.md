# Farmer Ordering System

In this project users are be able to:

- Register as a farmer using phone number and OTP
- Login to the system as farmer or admin
- Submit fertilizer orders with automatic quantity calculation
- Track order status (approved or declined)
- View all order history and details
- Set fertilizer calculation rates (admin only)
- Approve or decline farmer requests (admin only)
- View dashboard metrics and charts (admin only)

## Table of Contents
- [Demo](https://farmer-ordering-frontend-three.vercel.app/)
- [Screenshots](#screenshots)
- [Usage](#usage)

## Demo
You can see a live demo of the app [here](https://farmer-ordering-frontend-three.vercel.app/).


## Screenshots
- Farmer registration and login:

 <img width="1906" height="856" alt="Screenshot 2026-02-11 085907" src="https://github.com/user-attachments/assets/e518ca4a-6468-4581-93e3-70dff45116ba" />

<img width="1907" height="855" alt="Screenshot 2026-02-11 085929" src="https://github.com/user-attachments/assets/53e1a263-114d-4fcc-9259-803daca3c761" />

- Farmer dashboard:

<img width="1898" height="863" alt="Screenshot 2026-02-11 090259" src="https://github.com/user-attachments/assets/dc4dfe44-3d19-4124-824e-86391e39fe28" />

- Fertilizer order submission:

<img width="1907" height="861" alt="Screenshot 2026-02-11 090320" src="https://github.com/user-attachments/assets/d74d0e9e-1f23-48cc-af3a-eeb8261f33d6" />

- Order status tracking:

<img width="1895" height="856" alt="Screenshot 2026-02-11 090703" src="https://github.com/user-attachments/assets/dbc59f3c-2569-4e2a-84ca-7bec05512997" />

- Admin dashboard with metrics:

<img width="1895" height="859" alt="Screenshot 2026-02-11 091419" src="https://github.com/user-attachments/assets/7f63c694-6d6a-40d5-ae18-4656e2f63678" />

- Request management for admins:

<img width="1883" height="850" alt="Screenshot 2026-02-11 091447" src="https://github.com/user-attachments/assets/324442b6-f446-4bca-8a9b-f363d11360fe" />

- Rate configuration system:

<img width="1894" height="849" alt="Screenshot 2026-02-11 091509" src="https://github.com/user-attachments/assets/a1c65b2d-333b-4107-8159-8643d0f0c4b3" />


### Steps
1. Clone the repository
   ```sh
   git clone https://github.com/gikundiroHappy/farmer-ordering-frontend.git
2. Navigate to the project directory
   ```sh
   cd farmer-ordering-frontend
3. Install dependencies
   ```sh
   npm install
4. Start the development server
   ```sh
   npm run dev

### Usage

As a Farmer:
- Register with your phone number
- Login with: Your phone number OTP (1234)
- Navigate to Dashboard
- Click "Create Order" to submit fertilizer request
- View your orders in "My Orders" page

As an Admin
- Login with:
   Phone: 25078815000
   OTP: 0001
- View dashboard metrics
- Go to "Requests" to approve or decline orders
- Navigate to "Settings" to update fertilizer rate