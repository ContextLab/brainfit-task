var stimSpatialArray = []; //create an array for spatial icons

var spatialTask = function() {

    var spatialTimeline = [];
    var spatialImages = []; //initialize
    var imageDir = '/static/images/' //directory of image

    for (var i = 0; i< maxSpatialNumber+1; i++){ //number of images to display
        spatialImages.push(imageDir+stimSpatialArray[0][i])
    };

    var instructions_spatial = {
      type: 'instructions',
      pages: ['<h1> Part IV. Where was that thing again? </h1> <br/><p>Picture you leaving your house in the morning - you need to find your keys, your lunch, your bag, and your shoes before you can head out the door. But where did you put these items within the room? Here we first present a "map" of symbols arranged on the screen. Your job is to focus on these locations and remember where each of these symbols (i.e. things to remember) was presented. Then, you will show off your memory by recreating the positions of the symbols on the following screen. This task will become more difficult as you progress by increasing the number of symbols, like having to remember more items to take with you in the morning.</p>'],
      show_clickable_nav: true
    };
    spatialTimeline.push(instructions_spatial);

    for (var i = minSpatialNumber-1; i< maxSpatialNumber; i++){ //select in config file
      for (var r = 0; r < spatialReps; r++){

        var instructions_spatial_trial = {
            type: 'instructions',
            pages: ['<p>You will now see <b>' + (i+1) + '</b> symbols within a black box.  This image will be displayed for ' + spatialPresTime + " seconds. Try your best to remember the locations of each of these icons!</p><p>When you're ready, press the button to continue.</p>"],
            show_clickable_nav: true,
        };
        spatialTimeline.push(instructions_spatial_trial);

        var block_spatial = {
            type: 'free-sort-static',
            stimuli: spatialImages.slice(0,i+1),
            sort_area_height: 800,
            sort_area_width: 800,
            stim_height: 80,
            stim_width: 80,
            stim_duration: spatialPresTime*1000, //convert seconds to ms
        };
        spatialTimeline.push(block_spatial);

        var quiz_spatial = {
            type: 'free-sort-custom',
            stimuli: spatialImages.slice(0,i+1),
            sort_area_height: 800,
            sort_area_width: 800,
            stim_height: 80,
            stim_width: 80,
            prompt: 'Click on each icon and drag it to the location where it was displayed.',
        };
        spatialTimeline.push(quiz_spatial);
    }
}
    return spatialTimeline;
}
