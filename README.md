SlotSwapper 🚀
SlotSwapper is a full-stack application that allows users to manage their events and swap event slots with others. Users can create events, mark them as swappable, send swap requests, respond to swap requests, and track their activity in real-time.
This project is built using React, Node.js, Express, and MongoDB.

Features

User Authentication: Sign up, log in, and secure routes using JWT.
Event Management:
Create, delete, and update events.
Mark events as BUSY or SWAPPABLE.
Swap Requests:
Send swap requests to other users.
Accept or reject incoming swap requests.
Swap ownership of event slots automatically on acceptance.
Activity Tracking: View all incoming and outgoing swap requests.
Real-time Status Updates: All UI updates after creating, deleting, or swapping events.

Tech Stack

Frontend: React, React Router, Context API, Axios
Backend: Node.js, Express.js, Mongoose (MongoDB)
Authentication: JWT (JSON Web Tokens)
Database: MongoDB


Styling: Simple inline CSS (can be replaced with Tailwind or Material UI)



Project Structure
SlotSwapper/



Installation


Clone the repo


git clone https://github.com/JarmanKingra/SlotSwapperr.git
cd SlotSwapper



Install backend dependencies


cd backend
npm install



Install frontend dependencies


cd ../frontend
npm install


Environment Variables
Create a .env file in the backend folder with the following:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3001


Usage
Backend
cd backend
npm run dev

This will start the server at http://localhost:3001.
Frontend
cd frontend
npm start

This will start the React app at http://localhost:3000.

API Endpoints
Events
MethodEndpointDescriptionGET/getEventsGet all events for the logged-in userPOST/createEventCreate a new eventPUT/:idUpdate event status (BUSY / SWAPPABLE)DELETE/:idDelete an event
Swap Requests
MethodEndpointDescriptionPOST/createSwapReqCreate a swap requestPOST/respondToReq/:idAccept or reject a swap requestGET/incomingGet incoming swap requestsGET/outgoingGet outgoing swap requests

Screenshots
(Add screenshots of Dashboard, Swap Requests, and any other pages here)

Future Improvements


Add real-time updates using WebSockets
Implement notifications for swap requests
Enhance UI/UX with Material UI or Tailwind
Add email notifications for accepted/rejected swaps
