var stimSpatialArray = []; //create an array for spatial icons

var spatialTask = function() {

    var spatialTimeline = [];
    var spatialImages = []; //initialize
    var imageDir = '/static/images/' //directory of image

    for (var i = 0; i< maxSpatialNumber+1; i++){ //number of images to display
        spatialImages.push(imageDir+stimSpatialArray[0][i])
    };
        console.log(spatialImages)


    var instructions_spatial = {
      type: 'instructions',
      pages: ['<h1> Part IV. Spatial Task </h1> <br/> <p> In this task, you will view symbols arranged on the screen.</p> <p>Try to remember the locations of these symbols, and recreate their positions on the following screen when prompted. </p>'],
      show_clickable_nav: true
    };
    spatialTimeline.push(instructions_spatial);

    for (var i = minSpatialNumber-1; i< maxSpatialNumber; i++){ //select in config file
      for (var r = 0; r < spatialReps; r++){

        var instructions_spatial_trial = {
            type: 'instructions',
            pages: ['<p>You will now see <b>' + (i+1) + '</b> symbols within a black box, displayed for ' + spatialPresTime + ' seconds.</p> <p>Press the button to continue.</p>'],
            show_clickable_nav: true,
        };
        spatialTimeline.push(instructions_spatial_trial);

        var block_spatial = {
            type: 'free-sort-static',
            stimuli: spatialImages.slice(0,i+1),
            sort_area_height: 800, //window.innerHeight-200,
            sort_area_width: 800, //window.innerHeight-100,
            stim_height: 80,
            stim_width: 80,
            stim_duration: spatialPresTime*1000, //convert seconds to ms
        };
        spatialTimeline.push(block_spatial);

        var quiz_spatial = {
            type: 'free-sort-custom',
            stimuli: spatialImages.slice(0,i+1),
            sort_area_height: 800, //window.innerHeight-200,
            sort_area_width: 800, //window.innerHeight-100,
            stim_height: 80,
            stim_width: 80,
            prompt: 'Click on each icon and drag it to the location where it was displayed',
        };
        spatialTimeline.push(quiz_spatial);
    }
}
    return spatialTimeline;
}
