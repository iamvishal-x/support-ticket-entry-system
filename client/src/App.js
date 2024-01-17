import { useEffect, useState } from "react";
import "./App.css";
import { TicketHomepage } from "./components/Homepage/TicketHomepage/TicketHomepage";
import ApiRequest from "./utils/ApiRequest";
import {
  AxiosMethods,
  SupportTicketsEndpoint,
  SupportAgentsEndpoint,
  sidebarNavigationOptions,
  ticketsViewOptions,
} from "./Constants.js";
import { Sidebar } from "./components/Sidebar/Sidebar.js";
import { AgentHomepage } from "./components/Homepage/AgentHomepage/AgentHomepage.js";

function App() {
  const [ticketsViewType, setTicketsViewType] = useState(
    ticketsViewOptions.kanban
  );
  const [homepageContent, setHomepageContent] = useState(
    sidebarNavigationOptions.tickets
  );

  const [tickets, setTickets] = useState([]);
  const [ticketsResponse, setTicketsResponse] = useState({});
  const [agents, setAgents] = useState([]);
  const [agentsResponse, setAgentsResponse] = useState({});

  const fetchAllTickets = async () => {
    try {
      console.log(SupportTicketsEndpoint);
      const response = await ApiRequest(
        AxiosMethods.GET,
        SupportTicketsEndpoint
      );
      setTicketsResponse((prev) => {
        return { ...prev, response };
      });
      setTickets((prev) => {
        return [...prev, ...response.data];
      });
    } catch (error) {
      console.log("appp------", error.toJSON());
    }
  };

  const fetchAllAgents = async () => {
    try {
      console.log(SupportAgentsEndpoint);
      const response = await ApiRequest(
        AxiosMethods.GET,
        SupportAgentsEndpoint
      );
      setAgentsResponse((prev) => {
        return { ...prev, response };
      });
      setAgents((prev) => {
        return [...prev, ...response.data];
      });
    } catch (error) {
      console.log("appp------", error.toJSON());
    }
  };

  useEffect(() => {
    fetchAllTickets();
    fetchAllAgents();
  }, []);

  const updateHomepageContent = (type) => {
    return setHomepageContent(type);
  };

  return (
    <div className="app">
      <div className="app-sidebar">
        <Sidebar
          homepageContent={homepageContent}
          updateHomepageContent={updateHomepageContent}
        />
      </div>
      <div className="app-container">
        {homepageContent === sidebarNavigationOptions.tickets && (
          <TicketHomepage ticketsViewType={ticketsViewType} tickets={tickets} />
        )}
        {homepageContent === sidebarNavigationOptions.agents && (
          <AgentHomepage agents={agents} />
        )}
      </div>
    </div>
  );
}

export default App;
