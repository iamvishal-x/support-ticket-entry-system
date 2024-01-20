import React, { useEffect, useState } from "react";
import "./SearchBar.css";
import { Select, Space, Radio, Input, Divider, Dropdown, Button, Tooltip, Spin } from "antd";
import { DownOutlined } from "@ant-design/icons";
import CONSTANTS from "../../Constants.js";
import ApiRequest from "../../utils/ApiRequest.js";

export const SearchBar = ({
  homepageContent,
  ticketsViewType,
  setTicketsViewType,
  modal,
  setModal,
  fetchDocuments,
  agents,
  openNotification,
  loading,
}) => {
  const isTicketsPage = homepageContent === CONSTANTS.SidebarNavigationOptions.tickets; // To check if current homepage is Ticket

  const sortByFilters = isTicketsPage // Accordingly update sort by filters
    ? CONSTANTS.TicketsAvailableSortByOptions
    : CONSTANTS.AgentsAvailableSortByOptions;

  const searchByFilters = isTicketsPage // Accordingly update search by filters
    ? CONSTANTS.TicketsAvailableSearchBy
    : CONSTANTS.AgentsAvailableSearchBy;

  // Create a default filters value object which'll help in state reset as well
  const defaultFilterObject = {
    tickets: {
      searchBy: searchByFilters[0].value,
      search: "",
      status: [],
      severity: [],
      type: [],
      assignedTo: [],
      sortBy: "createdAtDesc",
    },
    agents: {
      sortBy: "createdAtDesc",
      searchBy: "",
      search: "",
    },
  };

  const [filterObject, setFilterObject] = useState(defaultFilterObject);
  const [activeFilters, setActiveFilters] = useState({});

  /**
   * Function to update filterObject state with new values
   * @param name name of the field
   * @param value value of the gield
   */
  const updateFilterObject = (name, value) => {
    setFilterObject((prevFilterObject) => {
      return {
        ...prevFilterObject,
        [homepageContent]: {
          ...prevFilterObject[homepageContent],
          [name]: value,
        },
      };
    });
  };

  /**
   * Function to get default value from the filterObject state
   * @param name name of the field
   * @returns value of the given name field
   */
  const getCurrentValue = (name) => {
    return filterObject[homepageContent][name];
  };

  /**
   * Reset the filters state to default filter state whenever homepage changes
   */
  useEffect(() => {
    setFilterObject(defaultFilterObject);
  }, [homepageContent]);

  /**
   * Build filter/search query whenever user adds/updates any filter
   */
  useEffect(() => {
    buildQueryAndFetch();
  }, [filterObject]);

  /**
   * fn to build query string and fetch data with new query string
   */
  const buildQueryAndFetch = () => {
    const data = filterObject[homepageContent];

    let queryEndpoint = isTicketsPage
      ? CONSTANTS.SupportTicketsEndpoint
      : CONSTANTS.SupportAgentsEndpoint;

    let queryString = "";

    Object.entries(data).forEach(([key, value]) => {
      if (!value || !value.length) return;
      if (key === "sortBy" && value === "createdAtDesc") return;

      if (Array.isArray(value)) {
        queryString += `&${key}=${value.join(",")}`;
        return;
      }

      if (key === "searchBy" && !data.search) return;

      queryString += `&${key}=${value}`;
    });

    if (queryString.length) {
      queryEndpoint += `?${queryString}`;
      const activeFilterList = Object.fromEntries(
        queryString
          .split("&")
          .filter((x) => x)
          .map((x) => x.split("="))
      );
      setActiveFilters(activeFilterList);
    } else {
      setActiveFilters({});
    }

    fetchDocuments(CONSTANTS.AxiosMethods.GET, queryEndpoint, homepageContent);
  };

  /**
   * Function to search and filter agents with the given user input
   * @param value agent name
   */
  const getAgentsArray = async (value) => {
    const queryString = `${CONSTANTS.SupportAgentsEndpoint}?searchBy="name"&search=${value}`;

    await fetchDocuments(
      CONSTANTS.AxiosMethods.GET,
      queryString,
      CONSTANTS.SidebarNavigationOptions.agents
    );
  };

  /**
   * Removes clicked filter from active filters and updates the active filters
   * @param {*} key
   */
  const handleRemoveFilter = (key) => {
    const defaultValue = defaultFilterObject[homepageContent][key];
    updateFilterObject(key, defaultValue);
  };
  /**
   * Start a force sync of tickets assignment to agents, if, for any reason the automatic ticket assignment fails
   */
  const handleForceSync = async () => {
    try {
      const response = await ApiRequest(
        CONSTANTS.AxiosMethods.GET,
        CONSTANTS.SupportTicketsEndpoint + "/assignTickets"
      );

      if (response && response.success) {
        openNotification(response.message, "success");
      }
    } catch (error) {
      openNotification(error.message, "error");
    }
  };

  return (
    <div className="search">
      <div className="search-top">
        <div className="search-top-left">
          <div className="search-top-left-searchbar">
            <Space.Compact>
              <Select
                defaultValue={getCurrentValue("searchBy")}
                value={getCurrentValue("searchBy")}
                options={searchByFilters}
                onSelect={(e) => updateFilterObject("searchBy", e)}
              />
              <Input
                placeholder={`Search ${getCurrentValue("searchBy") || "all"}`}
                allowClear={true}
                value={getCurrentValue("search")}
                onChange={(e) => updateFilterObject("search", e.target.value)}
              />
            </Space.Compact>
          </div>

          {isTicketsPage && (
            <div className="search-top-left-filters">
              {CONSTANTS.TicketsAvailableDropDownFilters.map((filter) => (
                <div className="search-top-left-filters-dropdowns" key={filter.value}>
                  <Divider className="divider-vertical" type="vertical" />
                  <Dropdown
                    menu={{
                      items: filter.options,
                      multiple: true,
                      selectable: true,
                      selectedKeys: getCurrentValue(filter.value),
                      onSelect: (e) => {
                        updateFilterObject(filter.value, e.selectedKeys);
                      },
                      onDeselect: (e) => {
                        updateFilterObject(filter.value, e.selectedKeys);
                      },
                    }}
                  >
                    <Tooltip
                      placement="top"
                      arrow={false}
                      title={`Filter by multiple ${filter.label}`}
                      key={filter.value}
                    >
                      <Button>
                        <Space>
                          {filter.label}
                          <DownOutlined />
                        </Space>
                      </Button>
                    </Tooltip>
                  </Dropdown>
                </div>
              ))}
              <div className="search-top-left-filters-dropdowns">
                <Divider className="divider-vertical" type="vertical" />
                <Tooltip
                  placement="top"
                  arrow={false}
                  title="Filter by multiple agent"
                  key="assignedTo"
                >
                  <Select
                    mode="multiple"
                    maxTagCount="responsive"
                    maxCount={3}
                    style={{ width: "200px" }}
                    value={getCurrentValue("assignedTo")}
                    options={agents.map((agent) => {
                      return {
                        label: agent.name,
                        value: agent._id,
                      };
                    })}
                    onSearch={async (e) => await getAgentsArray(e)}
                    onChange={(newValue) => {
                      updateFilterObject("assignedTo", newValue);
                    }}
                    filterOption={(input, option) => {
                      return option.label.toLowerCase().includes(input.toLowerCase());
                    }}
                    placeholder="Filter by multiple agent"
                  />
                </Tooltip>
              </div>
            </div>
          )}
        </div>
        <div className="search-top-right">
          <Space.Compact>
            <Input placeholder="Sort By" className="search-top-right-sort" disabled />
            <Select
              style={{
                width: "100%",
                borderStartStartRadius: "6px",
                borderEndStartRadius: "6px",
              }}
              value={getCurrentValue("sortBy")}
              options={sortByFilters}
              onChange={(e) => updateFilterObject("sortBy", e)}
            />
          </Space.Compact>
        </div>
      </div>
      <Divider className="divider-horizontal divider-horizontal-custom" />
      <div className="search-bottom">
        <div className="search-bottom-left">
          {Object.entries(activeFilters)?.map(([key, value]) => (
            <span
              className="search-bottom-left-col-1"
              key={key}
              onClick={() => handleRemoveFilter(key)}
            >
              <Tooltip title={"Click to remove filter"} key={`active-filter-${key}`}>
                {key}:{key === "assignedTo" ? value.split(",").length + " Agents" : value}
              </Tooltip>
            </span>
          ))}
        </div>
        <div className="search-bottom-right">
          {isTicketsPage && (
            <>
              <Tooltip
                title="Force sync on automatic tickets assign failure"
                key="force-sync-tickets"
              >
                <Button danger onClick={handleForceSync}>
                  Sync Tickets
                </Button>
              </Tooltip>
              <Radio.Group
                value={ticketsViewType}
                onChange={(e) => {
                  setTicketsViewType(e.target.value);
                }}
                buttonStyle="solid"
              >
                <Radio.Button value={CONSTANTS.TicketsViewOptions.kanban}>Kanban View</Radio.Button>
                <Radio.Button value={CONSTANTS.TicketsViewOptions.list}>List View</Radio.Button>
              </Radio.Group>
            </>
          )}
          <Button type="primary" onClick={() => setModal(!modal)}>
            Create {isTicketsPage ? "Ticket" : "Agent"}
          </Button>
        </div>
      </div>
    </div>
  );
};
