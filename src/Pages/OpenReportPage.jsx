import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CircularProgress,
  Select,
  MenuItem,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import Navbar from "../components/Navbar";
import { options, npsOptions } from "../utils/chartOptions";
import { useLocation } from "react-router-dom";

const OpenReportPage = () => {
  const [responseData, setResponseData] = useState([]);
  const [channels, setChannels] = useState([]);
  const [instances, setInstances] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState("");
  const [selectedInstance, setSelectedInstance] = useState("");
  const [selectedDays, setSelectedDays] = useState(7);
  const [totalCount, setTotalCount] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [scores, setScores] = useState({
    Promoter: { percentage: 0 },
    Detractor: { percentage: 0 },
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [displayDataForAllSelection, setDisplayDataForAllSelection] = useState(
    []
  );
  const [npsDataForChart, setNpsDataForChart] = useState([]);
  const [dataForChart, setDataForChart] = useState([]);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const workspace_id = searchParams.get("workspace_id");
  const username = searchParams.get("username");
  const scaleId = searchParams.get("scale_id");

  //   const scaleId = localStorage.getItem('scale_id');
  const allParamsPresent = workspace_id && username && scaleId;

  if (!allParamsPresent) {
    return (
      <div className="h-full w-screen flex flex-col justify-center items-center p-4">
        <p className="text-lg font-bold text-red-500">
          You are not authorized to use this page.
        </p>
      </div>
    );
  }

  // Fetch channels and instances initially
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await axios.get(
          `https://100035.pythonanywhere.com/addons/get-response/?scale_id=${scaleId}`
        );
        const data = response?.data?.data;
        console.log("Fetched initial data:", data);

        let uniqueInstances = new Set();
        let uniqueChannels = new Set();

        data.forEach((item) => {
          const instanceName = item.instance_name || item.instance;
          uniqueInstances.add(instanceName.trim());

          const channelName = item.channel_name || item.channel;
          uniqueChannels.add(channelName.trim());
        });

        setChannels(["All Channels", ...Array.from(uniqueChannels)]);
        setInstances(Array.from(uniqueInstances));
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setErr(error);
      }
    };

    fetchInitialData();
  }, [scaleId]);

  // Fetch detailed data based on selection
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedChannel && !selectedInstance) return;

      setLoading(true);
      try {
        const response = await axios.get(
          `https://100035.pythonanywhere.com/addons/get-response/?scale_id=${scaleId}`
        );
        const data = response?.data?.data;
        console.log("Fetched data:", data);

        const newScores = {
          Promoter: { percentage: data.promoter_percentage || 0 },
          Detractor: { percentage: data.detractor_percentage || 0 },
        };

        // Set scores and other data
        setScores(newScores);
        setResponseData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErr(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedChannel, selectedInstance, selectedDays, scaleId]);

  const handleChannelSelect = (event) => {
    setSelectedChannel(event.target.value);
    setSelectedInstance(""); // Reset instance selection when channel changes
  };

  const handleInstanceSelect = (event) => {
    setSelectedInstance(event.target.value);
  };

  const handleDaysSelect = (event) => {
    setSelectedDays(parseInt(event.target.value));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (err) {
    return (
      <div className="w-screen h-screen flex justify-center items-center p-2 text-red-600">
        Something went wrong, contact admin!
      </div>
    );
  }

  return (
    <div className="max-h-screen max-w-full">
      {/* <Navbar className="z-10" /> */}
      <Box p={1}>
        <Typography variant="h6" align="center" gutterBottom>
          Net Promoter Score
        </Typography>
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={4}>
            <Select
              value={selectedChannel}
              onChange={handleChannelSelect}
              displayEmpty
              fullWidth
            >
              <MenuItem value="" disabled>
                Select Channel
              </MenuItem>
              {channels.map((channel) => (
                <MenuItem key={channel} value={channel}>
                  {channel}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} md={4}>
            <Select
              value={selectedInstance}
              onChange={handleInstanceSelect}
              displayEmpty
              fullWidth
              disabled={selectedChannel === "All Channels"}
            >
              <MenuItem value="" disabled>
                Select Instance
              </MenuItem>
              {instances.map((instance) => (
                <MenuItem key={instance} value={instance}>
                  {instance}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} md={3}>
            <Select value={selectedDays} onChange={handleDaysSelect} fullWidth>
              <MenuItem key={1} value={7}>
                7 days
              </MenuItem>
              <MenuItem key={2} value={30}>
                30 days
              </MenuItem>
              <MenuItem key={3} value={90}>
                90 days
              </MenuItem>
            </Select>
          </Grid>
        </Grid>

        {/* Display Data */}
        {selectedChannel === "All Channels" ? (
          displayDataForAllSelection.map((item, index) => (
            <div key={index}>
              <Typography
                variant="h6"
                align="left"
                style={{ marginTop: "26px" }}
              >
                {index + 1}. {item.instanceName}
              </Typography>
              <div className="flex justify-center items-center gap-6 sm:gap-12 mt-10 flex-wrap">
                <p className="text-[20px] font-bold text-blue-600 mb-2">
                  Total Responses: {item.totalResponses}
                </p>
                <p className="text-[20px] font-bold text-blue-600 mb-2">
                  NPS:{" "}
                  {(
                    scores?.Promoter?.percentage - scores?.Detractor?.percentage
                  ).toFixed(2)}
                </p>
              </div>
              {/* Additional display logic for each item */}
            </div>
          ))
        ) : (
          <div>
            <div className="flex justify-center items-center gap-6 sm:gap-12 mt-10 flex-wrap">
              <p className="text-[20px] font-bold text-blue-600 mb-2">
                Total Responses: {totalCount}
              </p>
              <p className="text-[20px] font-bold text-blue-600 mb-2">
                NPS:{" "}
                {(
                  scores?.Promoter?.percentage - scores?.Detractor?.percentage
                ).toFixed(2)}
              </p>
            </div>
            {/* Additional display logic for total data */}
          </div>
        )}

        {/* Charts */}
        <Grid item xs={12} md={0} className="block md:hidden">
          {selectedChannel && selectedInstance ? (
            <>
              <Box
                sx={{
                  mt: 4,
                  width: "100%",
                  height: { xs: "300px", sm: "400px" },
                  maxWidth: "900px",
                  mx: "auto",
                }}
              >
                <Line options={npsOptions} data={npsDataForChart} />
              </Box>
              <Box
                sx={{
                  my: 4,
                  width: "100%",
                  height: { xs: "300px", sm: "400px" },
                  maxWidth: "900px",
                  mx: "auto",
                }}
              >
                <Line options={options} data={dataForChart} />
              </Box>
            </>
          ) : null}
        </Grid>

        <div className="hidden md:flex justify-center items-center mt-10 gap-12 flex-wrap">
          {selectedChannel && selectedInstance ? (
            <>
              <Grid item xs={12} md={5}>
                <Box
                  sx={{ width: "600px", height: { xs: "300px", sm: "380px" } }}
                >
                  <Line options={options} data={dataForChart} />
                </Box>
              </Grid>
              <Grid item xs={12} md={5}>
                <Box
                  sx={{ width: "600px", height: { xs: "300px", sm: "380px" } }}
                >
                  <Line options={npsOptions} data={npsDataForChart} />
                </Box>
              </Grid>
            </>
          ) : null}
        </div>
      </Box>
    </div>
  );
};

export default OpenReportPage;
