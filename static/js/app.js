function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  
  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`
  var element1 = d3.select(".selDataset");

  // Use `.html("") to clear any existing metadata
  var element2 = d3.select("#sample-metadata");
  element2.selectAll("*").remove()
  
  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.
  var s = "";
  d3.json(`/metadata/${sample}`).then(function(data) {
      Object.entries(data).forEach(([key, value]) => {
        element2.append("p").text(key + " : " + value + "\n");
      });
  });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
} 
//var testdata

function buildCharts(sample) {

  // @TODO: Us e `d3.json` to fetch the sample data for the plots

  d3.json(`/samples/${sample}`).then(function(data) {

      console.log(data);
      // testdata = data;
      // @TODO: Build a Pie Chart

    //  data.sort(function(a, b)
     //   { return b.sample_values - a.sample_values;});
 
      var trace1 = [{
          values: data.sample_values.slice(0, 10),
          labels: data.otu_ids.slice(0, 10),
          hovertext: data.otu_labels.slice(0, 10),
          type: "pie"
      }];
      
      var layout = {
          title: 'Pie chart',
          height: 600,
          width: 800
      };
  
      Plotly.plot("pie", trace1, layout);

      // @TODO: Build a Bubble Chart using the sample data
      // HINT: You will need to use slice() to grab the top 10 sample_values,
      // otu_ids, and labels (10 each).

      var trace2 = {
          x: data.otu_ids,
          y: data.sample_values,
          text: data.otu_labels,
          mode: 'markers',
          marker: {
              size: data.sample_values,
              color: data.otu_ids
          },
          type: "scatter"
      }
    
      var data2 = [trace2];

      var layout = {
        height: 500,
        width: 1000,
        title: 'Bubble chart'
      };
    
      console.log("got here Y");
      Plotly.newPlot('bubble', data2, layout);

    });

}

function init() {

  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
