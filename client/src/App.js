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
import { ConfigProvider, Modal, notification } from "antd";
import { CreateAgent } from "./components/Agent/CreateAgent/CreateAgent.js";
import { CreateTicket } from "./components/Ticket/CreateTicket/CreateTicket.js";

function App() {
  // Current Tickets View Type: Kanban | List
  const [ticketsViewType, setTicketsViewType] = useState(
    TicketsViewOptions.kanban
  );

  // Current Homepage: Tickets | Agents
  const [homepageContent, setHomepageContent] = useState(
    SidebarNavigationOptions.tickets
  );

  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [modal, setModal] = useState(false);
  const [refreshData, setRefreshData] = useState(true); // To update agents and tickets list

  const [api, contextHolder] = notification.useNotification(); // Ant Desging notification api

  const fetchDocuments = async (method, endpoint, context) => {
    try {
      const response = await ApiRequest(method, endpoint);

      if (context === "tickets") {
        setTickets(response.data); // Set tickets state directly
      } else {
        setAgents(response.data); // Set agents state directly
      }
    } catch (error) {
      openNotification(error.message, "error");
    }
  };

  // Fetch documents on page load and whenever requested
  useEffect(() => {
    if (!refreshData) return;
    fetchDocuments(
      AxiosMethods.GET,
      SupportTicketsEndpoint,
      SidebarNavigationOptions.tickets
    );
    fetchDocuments(
      AxiosMethods.GET,
      SupportAgentsEndpoint,
      SidebarNavigationOptions.agents
    );
    setRefreshData(false);
  }, [refreshData]);

  // Updates homepage content to selected route Agents | Tickets
  const updateHomepageContent = (type) => {
    return setHomepageContent(type);
  };

  // Ant Design notification popup function
  const openNotification = (description, type) => {
    api[type]({
      message: type.toUpperCase(),
      description: description,
      placement: "topRight",
      duration: 2,
      className: "app-notification",
    });
  };

  return (
    <>
      {/* Using Ant Desing Config Provider to update disabled text color */}
      <ConfigProvider
        theme={{
          token: {
            colorTextQuaternary: "#000000e0",
          },
        }}
      >
        {/* Ant Desing notification UI */}
        {contextHolder}
        <div className="app">
          <div className="app-sidebar">
            <Sidebar
              homepageContent={homepageContent}
              updateHomepageContent={updateHomepageContent}
            />
          </div>

          <div className="app-container">
            <h1 className="app-container-heading">
              Tickets <span>Balancer</span>
            </h1>
            <SearchBar
              homepageContent={homepageContent}
              ticketsViewType={ticketsViewType}
              setTicketsViewType={setTicketsViewType}
              modal={modal}
              setModal={setModal}
              fetchDocuments={fetchDocuments}
              agents={agents}
              openNotification={openNotification}
            />

            {homepageContent === SidebarNavigationOptions.tickets ? (
              <TicketHomepage
                ticketsViewType={ticketsViewType}
                tickets={tickets}
                openNotification={openNotification}
                setRefreshData={setRefreshData}
              />
            ) : (
              <AgentHomepage
                agents={agents}
                openNotification={openNotification}
                setRefreshData={setRefreshData}
              />
            )}

            <Modal
              centered
              open={modal}
              footer={null}
              onCancel={() => setModal(false)}
            >
              {homepageContent === SidebarNavigationOptions.tickets ? (
                <CreateTicket
                  setModal={setModal}
                  setRefreshData={setRefreshData}
                  openNotification={openNotification}
                />
              ) : (
                <CreateAgent
                  setModal={setModal}
                  setRefreshData={setRefreshData}
                  openNotification={openNotification}
                />
              )}
            </Modal>
          </div>
        </div>
      </ConfigProvider>
    </>
  );
}

export default App;
