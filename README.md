# Support Ticket Entry System - MERN

This MERN application is designed to enhance the process of raising and managing support tickets. It provides an easy to use, user-friendly Frontend which allows functionality to add, update, query, and filter tickets and as well as agents. The core feature of this system is its automated ticket assignment, which distributes tickets to available agents in a round-robin fashion. I've named this application <u> **Tickets Balancer** </u> as in _Load Balancer_, because it somewhat works like _Load Balancer_. :p

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Environment Variables](#env)
- [API Documentation](#api-documentation)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [FAQ](#faq)
- [Screenshots](#screenshots)
- [Planning](#planning)
- [Contact](#contact)

## Features

- **Easy to Use**: The app is designed to be user-friendly. You can create, update, filter and delete support tickets effortlessly.

- **Automatic Ticket Assignment**: The app assigns tickets to support agents fairly, so no one gets overloaded with work.

- **Manage Tickets**: Keep track of your support tickets, so you always know what's happening with your requests.

- **Agent Management**: You can also add new agents, update their details, delete them, and filter them..

## Requirements

- NodeJs
- MongoDB Community (locally installed) / MongoDB Atlas URL
- Postman Application / Web

## Installation

#### Frontend

To run the fronted application locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/iamvishal-x/support-ticket-entry-system.git
   ```

2. Navigate to the project directory:

   ```bash
   cd support-ticket-entry-system
   ```

3. Navigate to client folder
   ```bash
   cd client
   ```
4. Install the required npm packages:
   ```bash
   npm install
   ```
5. Start the frontend/client application
   ```bash
   npm start
   ```
6. The server should now be running locally. You can access it by navigating to `http://localhost:4000` in your web browser.

#### Backend

To run the backend application locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/iamvishal-x/support-ticket-entry-system.git
   ```

2. Navigate to the project directory:

   ```bash
   cd support-ticket-entry-system
   ```

3. Navigate to server folder
   ```bash
   cd server
   ```
4. Install the required npm packages:
   ```bash
   npm install --also=dev
   ```
5. Configure your environment variables by updating the .env with the necessary values.

   ```bash
   MONGO_URL= your local mongodb/mongodb atlas url
   PORT=the port you want to run the application on
   ```

6. Start the backend/server application
   ```bash
   npm run start
   ```
7. The server should now be running locally. You can access it by navigating to `http://localhost:3000` or the port your provided in your `.env`.

8. I've tried to commented the code thoroughly so most of the things may make sense just by reading the comments.

## Environment Variables

The app needs to be configured before running. \
 **<span style="color:red">Please go through the variables carefully as it affects the behaviour and functionality of the app</span>**. I've also included a .env.example file in both the applications.

#### Frontend

- `REACT_APP_API_BASE_URL` : Backend API base URL. For eg: `http://localhost:3000`

#### Backend

- `MONGO_URL` : Your MongoDB URI. For eg: `mongodb://localhost:27017/support-ticket-system`
- `PORT` : The port you want to run the application on. For eg: `3000`
- `ALLOW_TICKET_RAISE_IF_NO_AGENT` : This allows user to raise ticket even if no agent is active. Default value on hoster server `false`
- `ALLOW_TICKET_RESOLVE_IF_UNASSIGNED` : This gives flexibility to user to resolve the ticket even if no agent is assigned to that ticket. Default value on hoster server `false`
- `ALLOW_TICKET_DELETE_IF_ASSIGNED` : This allows user to delete a ticket even if an agent is assigned to the ticket. Default value on hoster server `false`
- `ALLOW_AGENT_DEACTIVATE_OR_DELETE_IF_HAS_TICKETS` : This allows agent to be deleted or deactivated even if he has tickets. Default value on hoster server `false`

## API Documentation

The API documentation contains list of available API endpoints and their respective purposes. It has all the required details to execute the API's. The API documentation is published online [here](https://documenter.getpostman.com/view/28011531/2s9YsT57ma). You may switch the POSTMAN environment to `No environment` if you want to test it locally else by default it'll hit the live server hosted on Vercel.\
Postman collection link: [https://documenter.getpostman.com/view/28011531/2s9YsT57ma](https://documenter.getpostman.com/view/28011531/2s9YsT57ma)

## API Endpoints

Some example endpoints

#### Get all agents (with filter)

```http
  GET /api/support-agents?search='Agent Name'&sortBy='createdAtDesc'
```

| Query    | Type     | Description                  | Example Value   |
| :------- | :------- | :--------------------------- | :-------------- |
| `search` | `string` | Search for specific keywords | `Agent Name`    |
| `sortBy` | `string` | Sorting order of the result  | `createdAtDesc` |

#### Get all tickets (with filter)

```http
  GET /api/support-tickets?search='Ticket Topic'&sortBy='createdAtDesc'&status='new,assigned'
```

| Query    | Type     | Description                  | Example Value   |
| :------- | :------- | :--------------------------- | :-------------- |
| `search` | `string` | Search for specific keywords | `Ticket Topic`  |
| `sortBy` | `string` | Sorting order of the result  | `createdAtDesc` |
| `status` | `string` | Filter with status type      | `assigned,new`  |

## Deployment

The application is hosted on Vercel, both frontend and backend. \
The backend application is hosted live at [https://support-ticket-entry-system-server.vercel.app/api/health-check](https://support-ticket-entry-system-server.vercel.app/api/health-check) and the frontend application is hosted live at [https://support-ticket-entry-system-pink.vercel.app/](https://support-ticket-entry-system-pink.vercel.app/).

## FAQ

1. **Which external libraries I've used?** \
   To speed up development and make the application more user-friendly, I used two external packages, one for each part of the application. \
   `On Frontend`: I've used **Ant Design** library for _input fields, modal, buttons and notifcations_. I used it because it offers few functionalities that were needed for the frontend UI and also to speed up the development. I've tried to make the UI consistent even after using external library. \
   `On Backend`: I've used **JOI** to _validate the data_ coming from frontend. \
2. **Have you missed any development point?**\
   No, I instead went ahead and added a few additional features like allowing updation and deletion of tickets and agents, different UI options, different app behaviour configurations etc on my behalf.

## Screenshots

Attaching few screenshots of the live application, just for an overview.

- Tickets Homepage \
  ![homepage](https://github.com/iamvishal-x/support-ticket-entry-system/main/assets/tickets-kanban-empty.png)

- Raise a ticket \
  ![homepage](https://github.com/iamvishal-x/support-ticket-entry-system/main/assets/tickets-create.png)

- All Tickets - Kanban View \
  ![homepage](https://github.com/iamvishal-x/support-ticket-entry-system/main/assets/tickets-kanban-view.png)

- All Tickets - List View \
  ![homepage](https://github.com/iamvishal-x/support-ticket-entry-system/main/assets/tickets-list-view.png)

- Filtered Tickets - Kanban View \
  ![homepage](https://github.com/iamvishal-x/support-ticket-entry-system/main/assets/tickets-kanban-filtered.png)

---

- Agents Homepage \
  ![homepage](https://github.com/iamvishal-x/support-ticket-entry-system/main/assets/agents-empty.png)

- Create an Agent \
  ![homepage](https://github.com/iamvishal-x/support-ticket-entry-system/main/assets/agents-create.png)

- Update an Agent \
  ![homepage](https://github.com/iamvishal-x/support-ticket-entry-system/main/assets/agents-update.png)

- All Agents \
  ![homepage](https://github.com/iamvishal-x/support-ticket-entry-system/main/assets/agents-all.png)

- Agents Filtered \
  ![homepage](https://github.com/iamvishal-x/support-ticket-entry-system/main/assets/agents-filtered.png)

## Planning

This is a miscelleneaous section which provides a little overview of how I planned the application and share some early design prototypes that illustrate the intended look and feel of the app.

- Tickets Homepage - Kanban View \
  ![homepage](https://github.com/iamvishal-x/support-ticket-entry-system/main/assets/tickets-kanban-proto.png)

- Tickets Homepage - List View \
  ![homepage](https://github.com/iamvishal-x/support-ticket-entry-system/main/assets/tickets-list-proto.png)

- Tickets Card \
  ![homepage](https://github.com/iamvishal-x/support-ticket-entry-system/main/assets/tickets-card-proto.png)

---

- Agents Homepage \
  ![homepage](https://github.com/iamvishal-x/support-ticket-entry-system/main/assets/agents-list-proto.png)

- Agents Card \
  ![homepage](https://github.com/iamvishal-x/support-ticket-entry-system/main/assets/agents-card-proto.png)

## Contact

- [LinkedIn](https://www.linkedin.com/in/vishal-sinha-1044871b8/)
- [Gmail](mailto:vishalsinha37@gmail.com)
- [Resume](https://docs.google.com/document/d/19mk_yKYDjj5B6-CSA89tW4Po0vGCHBHCs29-8HR1aRk/edit#heading=h.5x0d5h95i329)
