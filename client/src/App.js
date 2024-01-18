import { useEffect, useState } from "react";
import "./App.css";
import { TicketHomepage } from "./components/Homepage/TicketHomepage/TicketHomepage";
import ApiRequest from "./utils/ApiRequest";
import {
  AxiosMethods,
  SupportTicketsEndpoint,
  SupportAgentsEndpoint,
  SidebarNavigationOptions,
  TicketsViewOptions,
} from "./Constants.js";
import { Sidebar } from "./components/Sidebar/Sidebar.js";
import { AgentHomepage } from "./components/Homepage/AgentHomepage/AgentHomepage.js";
import { SearchBar } from "./components/Search/SearchBar.js";
import { Modal } from "antd";
import { CreateAgent } from "./components/Agent/CreateAgent/CreateAgent.js";
import { CreateTicket } from "./components/Ticket/CreateTicket/CreateTicket.js";

function App() {
  const [ticketsViewType, setTicketsViewType] = useState(
    TicketsViewOptions.kanban
  );
  const [homepageContent, setHomepageContent] = useState(
    SidebarNavigationOptions.tickets
  );

  const [tickets, setTickets] = useState([]);
  const [ticketsResponse, setTicketsResponse] = useState({});
  const [agents, setAgents] = useState([]);
  const [agentsResponse, setAgentsResponse] = useState({});

  const [modal, setModal] = useState(true);

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
        <SearchBar
          homepageContent={homepageContent}
          ticketsViewType={ticketsViewType}
          setTicketsViewType={setTicketsViewType}
          modal={modal}
          setModal={setModal}
        />
        {homepageContent === SidebarNavigationOptions.tickets && (
          <TicketHomepage ticketsViewType={ticketsViewType} tickets={tickets} />
        )}
        {homepageContent === SidebarNavigationOptions.agents && (
          <AgentHomepage agents={agents} />
        )}
        <Modal
          // title="Create Agent"
          centered
          open={modal}
          footer={null}
          onOk={() => setModal(false)}
          onCancel={() => setModal(false)}
        >
          <CreateTicket />
        </Modal>
      </div>
    </div>
  );
}

export default App;
