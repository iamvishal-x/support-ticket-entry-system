import React, { useEffect, useState } from "react";
import "./SearchBar.css";
import {
  Select,
  Space,
  Spin,
  Radio,
  Input,
  Divider,
  Typography,
  Dropdown,
  Button,
  Tooltip,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import {
  TicketsAvailableDropDownFilters,
  SidebarNavigationOptions,
  TicketsAvailableSortByOptions,
  AgentsAvailableSortByOptions,
  TicketsViewOptions,
  TicketsAvailableSearchBy,
  AgentsAvailableSearchBy,
  SupportAgentsEndpoint,
  SupportTicketsEndpoint,
  AxiosMethods,
} from "../../Constants.js";

export const SearchBar = ({
  homepageContent,
  ticketsViewType,
  setTicketsViewType,
  modal,
  setModal,
  fetchDocuments,
  agents,
}) => {
  const isTicketsPage = homepageContent === SidebarNavigationOptions.tickets; // To check if current homepage is Ticket

  const sortByFilters = isTicketsPage // Accordingly update sort by filters
    ? TicketsAvailableSortByOptions
    : AgentsAvailableSortByOptions;

  const searchByFilters = isTicketsPage // Accordingly update search by filters
    ? TicketsAvailableSearchBy
    : AgentsAvailableSearchBy;

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

  const [fetching, setIsFetching] = useState(false);
  const [filterObject, setFilterObject] = useState(defaultFilterObject);

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
  const getDefaultValue = (name) => {
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
      ? SupportTicketsEndpoint
      : SupportAgentsEndpoint;

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
    }

    fetchDocuments(AxiosMethods.GET, queryEndpoint, homepageContent);
  };

  /**
   * Function to search and filter agents with the given user input
   * @param value agent name
   */
  const getAgentsArray = async (value) => {
    const queryString = `${SupportAgentsEndpoint}?searchBy="name"&search=${value}`;

    await fetchDocuments(
      AxiosMethods.GET,
      queryString,
      SidebarNavigationOptions.agents
    );
  };

  return (
    <div className="search">
      <div className="search-top">
        <div className="search-top-left">
          <div className="search-top-left-searchbar">
            <Space.Compact>
              <Select
                defaultValue={getDefaultValue("searchBy")}
                options={searchByFilters}
                onSelect={(e) => updateFilterObject("searchBy", e)}
              />
              <Input
                placeholder={`Search ${getDefaultValue("searchBy") || "all"}`}
                allowClear={true}
                value={getDefaultValue("search")}
                onChange={(e) => updateFilterObject("search", e.target.value)}
              />
            </Space.Compact>
          </div>

          {isTicketsPage && (
            <div className="search-top-left-filters">
              {TicketsAvailableDropDownFilters.map((filter) => (
                <span key={filter.value}>
                  <Divider className="divider-vertical" type="vertical" />
                  <Dropdown
                    menu={{
                      items: filter.options,
                      multiple: true,
                      selectable: true,
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
                </span>
              ))}
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
                  value={getDefaultValue("assignedTo")}
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
                    return option.label
                      .toLowerCase()
                      .includes(input.toLowerCase());
                  }}
                  placeholder="Filter by multiple agent"
                />
              </Tooltip>
            </div>
          )}
        </div>
        <div className="search-top-right">
          <Space.Compact>
            <Input
              placeholder="Sort By"
              className="search-top-right-sort"
              disabled
            />
            <Select
              style={{
                width: "100%",
                borderStartStartRadius: "6px",
                borderEndStartRadius: "6px",
              }}
              defaultValue={getDefaultValue("sortBy")}
              options={sortByFilters}
              onChange={(e) => updateFilterObject("sortBy", e)}
            />
          </Space.Compact>
          {isTicketsPage && (
            <>
              <Divider className="divider-vertical" type="vertical" />
              <Radio.Group
                defaultValue={ticketsViewType}
                onChange={(e) => {
                  setTicketsViewType(e.target.value);
                }}
                buttonStyle="solid"
              >
                <Radio.Button value={TicketsViewOptions.kanban}>
                  Kanban View
                </Radio.Button>
                <Radio.Button value={TicketsViewOptions.list}>
                  List View
                </Radio.Button>
              </Radio.Group>
            </>
          )}
        </div>
      </div>
      <Divider className="divider-horizontal divider-horizontal-custom" />
      <div className="search-bottom">
        <div className="search-bottom-left"></div>
        <div className="search-bottom-right">
          <Button type="primary" onClick={() => setModal(!modal)}>
            Create {isTicketsPage ? "Ticket" : "Agent"}
          </Button>
        </div>
      </div>
    </div>
  );
};
