import React, { useState } from "react";
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
} from "../../Constants.js";

export const SearchBar = ({
  homepageContent,
  ticketsViewType,
  setTicketsViewType,
}) => {
  const isTicketsPage = homepageContent === SidebarNavigationOptions.tickets;
  const dropdownFilters = TicketsAvailableDropDownFilters;

  const sortByFilters = isTicketsPage
    ? TicketsAvailableSortByOptions
    : AgentsAvailableSortByOptions;

  const searchByFilters = isTicketsPage
    ? TicketsAvailableSearchBy
    : AgentsAvailableSearchBy;

  const [fetching, setIsFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const [sortBy, setSortBy] = useState("createdAtDesc");
  const [searchBy, setSearchBy] = useState(searchByFilters[0].value);
  const initFilter = () => {};

  return (
    <>
      <div className="search">
        <div className="search-left">
          <div className="search-left-searchbar">
            <Space.Compact>
              <Select
                defaultValue={searchByFilters[0].value}
                options={searchByFilters}
                onChange={(e) => console.log(e.target)}
                onSelect={(e) => console.log("select", e.target)}
              />
              <Input placeholder={`Search ${searchBy || "all"}`} />
            </Space.Compact>
          </div>

          <div className="search-left-filters">
            {dropdownFilters.map((filter) => (
              <>
                <Divider className="divider-vertical" type="vertical" />
                <Dropdown
                  menu={{
                    items: filter.options,
                    multiple: true,
                    selectable: true,
                  }}
                >
                  <Tooltip
                    title={`Filter by ${filter.label}`}
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
              </>
            ))}
            <Divider className="divider-vertical" type="vertical" />
            <Tooltip title="Filter by agent name" key="assignedTo">
              <Select
                mode={"multiple"}
                style={{ width: "200px" }}
                // value
                // options
                // onChange= (newValue) => {
                //   setValue(newValue);
                // }
                placeholder="Filter by agent name"
                maxTagCount="responsive"
              />
            </Tooltip>
          </div>
        </div>
        <div className="search-right">
          <Space.Compact>
            <Input
              placeholder="Sort By"
              className="search-right-sort"
              disabled
            />
            <Select
              style={{
                width: "100%",
                borderStartStartRadius: "6px",
                borderEndStartRadius: "6px",
              }}
              defaultValue={sortBy}
              options={sortByFilters}
              onChange={(e) => console.log(e.target)}
              onSelect={(e) => console.log("select", e.target)}
            />
          </Space.Compact>
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
        </div>
      </div>
      <Divider className="divider-horizontal divider-horizontal-custom" />
    </>
  );
};
