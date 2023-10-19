// Define the URL for the JSON data
const dataURL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data
function fetchJSONData(url) {
  return d3.json(url);
}

// Function to initialize the dashboard
function initializeDashboard(data) {
  buildDropdown(data);

  const initialSample = data.names[0];

  buildMetadata(data, initialSample);
  buildBarChart(data, initialSample);
  buildBubbleChart(data, initialSample);
}

// Function that populates the dropdown menu
function buildDropdown(data) {
  const dropdownMenu = d3.select("#selDataset");
  const names = data.names;

  names.forEach((id) => {
    dropdownMenu.append("option")
      .text(id)
      .property("value", id);
  });

  // Add an event listener to the dropdown menu
  dropdownMenu.on("change", function() {
    const selectedSample = d3.select("#selDataset").property("value");
    optionChanged(selectedSample, data);
  });
}

// Function that updates the dashboard when the sample is changed
function optionChanged(selectedSample, data) {
  buildMetadata(data, selectedSample);
  buildBarChart(data, selectedSample);
  buildBubbleChart(data, selectedSample);
}

// Function that populates metadata info
function buildMetadata(data, sample) {
  const metadata = data.metadata;
  const value = metadata.find(result => result.id == sample);
  const valueData = value;

  d3.select("#sample-metadata").html("");

  Object.entries(valueData).forEach(([key, value]) => {
    d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
  });
}

// Function that builds the bar chart
function buildBarChart(data, sample) {
  const sampleInfo = data.samples;
  const value = sampleInfo.find(result => result.id == sample);
  const valueData = value;

  const otu_ids = valueData.otu_ids;
  const otu_labels = valueData.otu_labels;
  const sample_values = valueData.sample_values;

  const yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
  const xticks = sample_values.slice(0, 10).reverse();
  const labels = otu_labels.slice(0, 10).reverse();

  const trace = {
    x: xticks,
    y: yticks,
    text: labels,
    type: "bar",
    orientation: "h"
  };

  const layout = {
    title: "Top 10 OTUs Present"
  };

  Plotly.newPlot("bar", [trace], layout);
}

// Function that builds the bubble chart
function buildBubbleChart(data, sample) {
  const sampleInfo = data.samples;
  const value = sampleInfo.find(result => result.id == sample);
  const valueData = value;

  const otu_ids = valueData.otu_ids;
  const otu_labels = valueData.otu_labels;
  const sample_values = valueData.sample_values;

  const trace1 = {
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: "markers",
    marker: {
      size: sample_values,
      color: otu_ids,
      colorscale: "Earth"
    }
  };

  const layout = {
    hovermode: "closest",
    xaxis: { title: "OTU ID" },
  };

  Plotly.newPlot("bubble", [trace1], layout);
}

// Fetch the JSON data and initialize the dashboard
fetchJSONData(dataURL)
  .then((data) => {
    console.log(data);
    initializeDashboard(data);
  });
