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
import { ConfigProvider, Modal, notification, theme } from "antd";
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
  const [modal, setModal] = useState(false);
  const [refreshData, setRefreshData] = useState(true);

  const [api, contextHolder] = notification.useNotification();

  const fetchDocuments = async (method, endpoint, context) => {
    try {
      console.log("inside fetch", endpoint);
      const response = await ApiRequest(method, endpoint);

      if (context === "tickets") {
        setTicketsResponse({ response }); // Set tickets response directly
        setTickets(response.data); // Set tickets state directly
      } else {
        setAgentsResponse({ response }); // Set agents response directly
        setAgents(response.data); // Set agents state directly
      }
    } catch (error) {
      console.log("appp------", error);
      openNotification(error.message, "error");
    }
  };

  const setContextData = (context, response) => {
    if (context === "tickets") {
      setTicketsResponse((prev) => {
        return { ...prev, response };
      });
      setTickets(response.data);
    } else {
      setAgentsResponse((prev) => {
        return { ...prev, response };
      });
      setAgents((prev) => {
        return [...prev, ...response.data];
      });
    }
  };

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

  const updateHomepageContent = (type) => {
    return setHomepageContent(type);
  };

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
      <ConfigProvider
        theme={{
          token: {
            colorTextQuaternary: "#000000e0",
            // colorBgContainerDisabled: "#fff",
          },
        }}
      >
        {contextHolder}
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
