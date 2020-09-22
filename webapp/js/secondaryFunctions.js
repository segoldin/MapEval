/*	$Id: secondaryFunctions.js,v 1.82 2020/07/23 08:25:46 goldin Exp $
 *
 * Copyright 2020 Sally E. Goldin
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *  This file hold secondary functions triggered by buttons from navFunctions which in turn call functions in server_api.js.
 *
 *  These functions are called from navFunctions.js 
 *
 *  Created by aleksandra  on 2018/12/03
 *
 *   $Log: secondaryFunctions.js,v $
 *   Revision 1.82  2020/07/23 08:25:46  goldin
 *   remove related tables after deletion
 *
 *   Revision 1.81  2020/07/21 09:30:32  goldin
 *   only allow shp format
 *
 *   Revision 1.80  2019/11/20 15:27:19  aleksandra
 *   fix bugs
 *
 *   Revision 1.79  2019/11/20 12:22:29  aleksandra
 *   cleaned redundant code
 *
 *   Revision 1.78  2019/11/20 12:13:04  aleksandra
 *   add alert if there's no related data in database
 *
 *   Revision 1.77  2019/11/20 12:00:04  aleksandra
 *   move Related Data button generation to addRelatedDataBtn(), add onmouseover tooltip to button
 *
 *   Revision 1.76  2019/11/20 09:26:12  aleksandra
 *   create table header dynamically only when related results are returned
 *
 *   Revision 1.75  2019/11/19 20:16:43  aleksandra
 *   modify resetMapAndTable() to be used instead of resetExperResult()
 *
 *   Revision 1.74  2019/11/19 17:43:33  aleksandra
 *   fix reset table for upload and query data cleanup
 *
 *   Revision 1.73  2019/11/19 08:49:37  goldin
 *   add header comment and CVS keywords, bannerDiv element
 *
 *   Revision 1.72  2019/11/19 08:43:59  goldin
 *   hide banner image for all options
 *
 *   Revision 1.71  2019/11/12 22:01:49  aleksandra
 *   removed redundant line
 *
 *   Revision 1.70  2019/11/12 10:53:40  goldin
 *   completely delete map div to avoid error; add highlight toggle to point table
 *
 *   Revision 1.69  2019/11/11 18:16:33  aleksandra
 *   moved adding cells to table to a separate function
 *
 *   Revision 1.68  2019/11/11 17:52:44  aleksandra
 *   moved adding options to dropdowns to a separate function
 *
 *   Revision 1.67  2019/11/11 17:29:23  aleksandra
 *   implemented filtering of upload or query related experiments
 *
 *   Revision 1.66  2019/11/11 17:17:57  aleksandra
 *   implemented filtering of upload or query related experiments
 *
 *   Revision 1.65  2019/11/11 15:45:20  aleksandra
 *   fixed default query and upload dataset dropdown option, made successGetXData functions more uniform
 *
 *   Revision 1.64  2019/11/06 11:21:26  aleksandra
 *   added resetRelatedTbl() and addCleanupResetBtn()
 *
 *   Revision 1.63  2019/11/05 07:41:00  goldin
 *   dynamically load API keys; fix minor appearance glitches
 *
 *   Revision 1.62  2019/11/05 04:27:50  goldin
 *   Change category to 'all' for related upload and query data
 *
 *   Revision 1.61  2019/11/01 21:52:29  aleksandra
 *   displaying region related data in cleanup
 *
 *   Revision 1.60  2019/11/01 19:30:28  aleksandra
 *   show related button enable/disable
 *
 *   Revision 1.59  2019/10/27 07:27:08  aleksandra
 *   implemented showRelated functions
 *
 *   Revision 1.58  2019/10/21 06:37:00  goldin
 *   do not display results div until we get a successful return from calculate metrics
 *   Revision 1.57  2019/10/15 22:02:56  aleksandra
 *   created dummy show related functions in CLEAN UP div
 *
 *   Revision 1.56  2019/10/15 10:54:23  goldin
 *   allow user to choose map center for roads query data
 *
 *   Revision 1.55  2019/10/15 08:52:08  goldin
 *   refactor to allow user to select image center from map in roads queries
 *
 *   Revision 1.54  2019/10/11 09:10:57  aleksandra
 *   modified successGetExperiments()
 *
 *   Revision 1.53  2019/09/20 16:56:13  aleksandra
 *   added deleteData() to all clean up sections, fixed issues with dropdowns, other minor modifications in clean up
 *
 *   Revision 1.52  2019/09/17 08:59:23  goldin
 *   add gMenuContext to select between different controls depending on context
 *
 *   Revision 1.51  2019/09/16 12:36:12  aleksandra
 *   fixed indexing mistake in confirmDeleteRegion function
 *
 *   Revision 1.50  2019/09/16 10:25:31  aleksandra
 *   minor changes in clean up section functions
 *
 *   Revision 1.49  2019/09/03 10:12:12  goldin
 *   add code to display results map, adjust to zoom
 *
 *   Revision 1.48  2019/06/11 10:11:47  goldin
 *   cleanup interactions
 *
 *   Revision 1.47  2019/06/07 10:01:05  goldin
 *   minor cosmetic issues
 *
 *   Revision 1.46  2019/05/31 11:47:29  goldin
 *   integrating linear metrics into web site
 *
 *   Revision 1.45  2019/03/22 10:04:09  goldin
 *   Separate success function for calculate metrics for roads versus points
 *
 *   Revision 1.44  2019/03/22 06:04:15  goldin
 *   add highlight capability
 *
 *   Revision 1.43  2019/03/06 10:06:42  goldin
 *   Added code to invoke and handle exporting experiment to CSV
 *
 *   Revision 1.42  2019/03/01 10:04:30  goldin
 *   debugging the recalculate operation
 *
 *   Revision 1.41  2019/02/27 09:38:56  goldin
 *   implement recalculate; add global list of points matched so we can delete from the map
 *
 *   Revision 1.40  2019/02/15 10:12:27  goldin
 *   modify to make name matching optional
 *
 *   Revision 1.39  2019/02/15 04:40:34  goldin
 *   reformat all JS for readability
 *
 *   Revision 1.38  2019/02/03 16:21:14  aleksandra
 *   fixed problem with upload data/ reset function so that it doesn't reset radio button values
 *
 *   Revision 1.37  2019/01/31 10:39:58  aleksandra
 *   minor changes
 *
 *   Revision 1.36  2019/01/30 05:07:48  aleksandra
 *   added remove button to the table that holds the results of calculateMetrics()
 *
 *   Revision 1.35  2019/01/29 10:06:36  aleksandra
 *   experiment display: added lines, colors for ref and target, match count; cut decimal places; keys as global variables; reset exp results; changes in successGetUploadData and successGetQueryData
 *
 *   Revision 1.34  2019/01/28 10:25:38  aleksandra
 *   added reset for experiment results, minor changes in the way results display
 *
 *   Revision 1.33  2019/01/28 05:21:35  aleksandra
 *   experiment: leaflet map displays matching points
 *
 *   Revision 1.32  2019/01/28 04:30:50  aleksandra
 *   Experiment displays map and results but no points yet
 *
 *   Revision 1.31  2019/01/28 04:15:59  aleksandra
 *   Experiment displays map and results but no points yet
 *
 *   Revision 1.30  2019/01/28 03:30:31  aleksandra
 *   changes to do with Experiment and displaying metrics calculations
 *
 *   Revision 1.29  2019/01/25 03:35:52  aleksandra
 *   implemented doCreateImageQueryData()
 *
 *   Revision 1.28  2019/01/24 09:19:04  aleksandra
 *   fixed switching between road features and points, removing previous maps
 *
 *   Revision 1.27  2019/01/24 08:37:37  aleksandra
 *   added removing leaflet map onclick New Query button in New Query Data results
 *
 *   Revision 1.26  2019/01/23 10:40:26  aleksandra
 *   minor changes
 *
 *   Revision 1.25  2019/01/21 09:36:30  aleksandra
 *   added doCalculateMetrics and related functions
 *
 *   Revision 1.24  2019/01/03 16:29:03  aleksandra
 *   eliminated bug from new upload databut now inputs don't reset
 *
 *   Revision 1.23  2019/01/03 10:42:12  aleksandra
 *   Bing and MapQuest debugging
 *
 *   Revision 1.22  2018/12/28 13:26:35  aleksandra
 *   changes to do with EPSG code
 *
 *   Revision 1.21  2018/12/28 04:49:41  aleksandra
 *   added Bing EU and minor changes
 *
 *   Revision 1.20  2018/12/26 13:02:11  aleksandra
 *   fixed google categories search, new mapCenter variable, fixed MapQuest, Bing map display
 *
 *   Revision 1.19  2018/12/26 03:23:30  aleksandra
 *   added regex to eliminate html tags in query data
 *
 *   Revision 1.18  2018/12/25 08:55:21  aleksandra
 *   save bug fixes
 *
 *   Revision 1.17  2018/12/24 12:14:12  aleksandra
 *   tweaked doCalculateMetrics() and doCreateQueryData
 *
 *   Revision 1.16  2018/12/24 10:21:17  aleksandra
 *   major changes to the display of query results display
 *
 *   Revision 1.15  2018/12/23 09:31:25  aleksandra
 *   updated categories and providers names to match the DB values
 *
 *   Revision 1.14  2018/12/23 08:47:59  aleksandra
 *   fixed resetting results table in newQueryData
 *
 *   Revision 1.13  2018/12/22 14:49:25  aleksandra
 *   added doCreateQueryData
 *
 *   Revision 1.12  2018/12/20 10:45:03  aleksandra
 *   providers query works now
 *
 *   Revision 1.11  2018/12/19 10:12:02  aleksandra
 *   fixed problems with upload data and create new region
 *
 *   Revision 1.10  2018/12/18 07:40:58  aleksandra
 *   finished doCreateUploadData
 *
 *   Revision 1.9  2018/12/17 08:37:05  aleksandra
 *   added functions populating dropdowns and ordering regions and categories alphabetically
 *
 *   Revision 1.8  2018/12/17 06:25:36  aleksandra
 *   changed for-loops method
 *
 *   Revision 1.7  2018/12/12 10:14:33  aleksandra
 *   added functions to get data from server
 *
 *   Revision 1.6  2018/12/11 04:47:21  aleksandra
 *   added object contructor to pack query results in a JSON to send to the database
 *
 *   Revision 1.5  2018/12/10 08:29:12  aleksandra
 *   added input validation
 *
 *   Revision 1.4  2018/12/10 03:48:55  aleksandra
 *   API calls return resultsnav_functions.js
 *
 *   Revision 1.3  2018/12/07 06:49:38  aleksandra
 *   added reset function
 *
 *   Revision 1.2  2018/12/03 10:48:13  aleksandra
 *   added more functions
 *
 *   Revision 1.1  2018/12/03 08:37:15  aleksandra
 *   created files with js functions
 *
 *
 *
 */

"use strict"

/* IDs of DOM elements used in this file */

const nameID = 'regTitleInput', //ID of region name input by the user in createNewRegion
    y_swID = 'S',
    x_swID = 'W',
    y_neID = 'N',
    x_neID = 'E',
    dataSourceTitleID = 'dataSourceTitle',
    commentFieldInputID = 'comment',
    fileFormatInputID = 'fileFormat',
    fileNameInputID = 'fileName',
    fileObjectID = 'fileObject',
    matchOptionID = 'matchOption',
    bufferInputID = 'bufferInput',
    nameCheckID = 'nameCheck';

/* end of DOM elements IDs */

/****  user defined types */
function Experiment() 
{
  this.refDataId = 0;
  this.targetDataId = 0;
  this.buffer = 0;
  this.nameflag = 'false';
  this.expRegion = 0;
  this.experimentid = 0;
  this.zoom = 0;
  this.center = null;
}

/****  user defined types */
function PointPair() 
{
  this.refid = 0;
  this.targetid = 0;
}


/****  global variables *****/
var gMatchPoints = null;   /* points retrieved from the calculate metrics function */

var gCurrentMap = null;    /* currently displayed map if any */

var gLatestExperiment = new Experiment();  /* keep experiment parameters for recalculation */

var gRegions = null;

var gMatchLines = null;   /* lines retrieved from the calculate metrics function */


/*utility functions */

/* hide the banner image */
function hideBanner()
{
    bannerDiv.style.display = "none";
}

/* show the banner */
function showBanner()
{
    bannerDiv.style.display = "";
}

function resetDropdowns()
{
    //reset all drop-downs to index 0 which is the default value
    var allDropdowns = document.getElementsByTagName('select');
    for (let elem of allDropdowns)
    {
        elem.selectedIndex = 0;
    }
}

//called by RESET button - clears all input fields
function reset()
{
    var allInputs = document.getElementsByTagName('input');
    for (let elem of allInputs)
    {
        if (elem.name !== 'fileFormat')
        {
            elem.value = '';
        }
    }
}
//end of reset function

// Clear related data table records and header in Clean Up section
function resetRelatedTbl(relatedTable)
{
    if (typeof relatedTable !== "undefined"){
        for (let i = relatedTable.childElementCount - 1; relatedTable.childElementCount > 0; i--)
        {
            relatedTable.removeChild(relatedTable.childNodes[i]);
        }
    }
}

// Add a generic reset button 
function addResetBtn(){
    var resetBtn = document.createElement('button');
    buttons.appendChild(resetBtn);
    resetBtn.innerHTML = 'Reset';
    resetBtn.onclick = function (e)
    {
        reset();
        resetDropdowns();
    }
}

function addRelatedDataBtn(doShowRelated){
    var showRelatedBtn = document.createElement('button');
    buttons.appendChild(showRelatedBtn);
    showRelatedBtn.innerHTML = 'Show related';
    showRelatedBtn.addEventListener('click', doShowRelated);
    showRelatedBtn.onmouseover = function (e){
        explanationOfRelatedP.style.display = "inline-block";
    }
    showRelatedBtn.onmouseout = function (e){
        explanationOfRelatedP.style.display = "none";
    }
}

// Add a reset button specific to Clean Up 
function addCleanupResetBtn(relatedTable){
    var resetBtn = document.createElement('button');
    buttons.appendChild(resetBtn);
    resetBtn.innerHTML = 'Reset';
    resetBtn.onclick = function (e)
    {
        reset();
        resetDropdowns();
        resetRelatedTbl(relatedTable);
        referenceRelatedDiv.style.display = "none";
        targetRelatedDiv.style.display = "none";
    }
}

// Remove Leaflet map and results table 
// called in Reset and New Query button in NewQueryData and in Experiment
function resetMapAndTable(map, table)
{
    //remove the map from last query
    if (map !== undefined)
    {
        map.remove();
    }
    staticMap.setAttribute('src', "");
    //remove all tabel rows but not header
    for (let i = table.rows.length - 1; i > 0; i--)
    {
        table.deleteRow(i);
    }
}
//end of resetMapAndTable

//called by reset button in Experiment, removes results of experiment
// function resetExperResults(map)
// {
    //remove leaflet map if it's initialized
 //    if ((map !== undefined) && (map != null))
 //    {
	// map.off();
	// map.remove();
 //    }
 //    // Try deleting and recreating the div 'matchMap'
 //    /************************************************************************/
 //    /* WARNING this really breaks encapsulation - it's a last ditch effort! */
 //    /***********************************************************************/
 //    var parentdiv = document.getElementById('metricsRightCol');  
 //    var mapdiv = document.getElementById('matchMap');
 //    parentdiv.removeChild(mapdiv);

 //    // Now recreate with the same ID and attributes
 //    var newmapdiv = document.createElement("div");
 //    newmapdiv.id = 'matchMap';
 //    newmapdiv.className = "w3-panel w3-topbar w3-bottombar w3-border-red";
 //    newmapdiv.style.width = "532px";
 //    newmapdiv.style.height = "542px";
 //    newmapdiv.style.padding = "10px";
 //    newmapdiv.style.backgroundColor = "white";
 //    newmapdiv.style.marginBottom = "20px";
 //    var table = document.getElementById('matchTbl');
 //    parentdiv.insertBefore(newmapdiv,table);

//     if (map !== undefined)
//     {
//         map.remove();
//     }
//     staticMap.setAttribute('src', "");
//     //remove all table rows but not header
//     for (let i = matchTbl.rows.length - 1; i > 0; i--)
//     {
//         matchTbl.deleteRow(i);
//     }
//     reset();
// }
//end of resetExperResults

/* clear the csv download link if it exists 
 */
function clearCsvLink()
{
    var metricsLeftColDiv = document.getElementById("metricsLeftCol");
    if (metricsLeftColDiv)
    {
        var childnodes = metricsLeftColDiv.childNodes,
	        linkitem = null;
	for (var i = 0; i < childnodes.length && linkitem == null; i++)
	{
	    if (childnodes[i].tagName == 'A')
		linkitem = childnodes[i];
	}
	if (linkitem)
	    metricsLeftColDiv.removeChild(linkitem);
    }
}

//this function prepares clear canvas for changes in the HTML DOM, it's called in each navigation bar option 
function clearPrevious()
{
    reset();
    resetDropdowns();
    gMenuContext = MAINPAGE;  // defined in nav_functions.js
    //clear all content
    var allDivs = mainContent.children;
    for (let elem of allDivs)
    {
        elem.style.display = "none";
    }
    infoAreaDiv.style.display = 'none';

    //remove buttons
    for (let i = buttons.childElementCount - 1; buttons.childElementCount > 0; i--)
    {
        buttons.removeChild(buttons.childNodes[i]);
    }
}
//end of clearPrevious()


//this function makes sure the user doesn't input letters into coordinates or buffer fields
function isNumberKey(e)
{
    let charCode = (e.which) ? e.which : event.keyCode;
    if (charCode > 31 && (charCode < 45 || charCode > 57) || charCode == 47 && charCode !== 17 && charCode !== 86)
    {
        return false;
    }
    return true;
}
//end of isNumberKey function

// Add elements to tables containing data related to data chosen for deletion in Clean Up section
function addToRelatedTbl(table, relatedData, key, headerTxt){
    var headerRow = document.createElement('tr'),
        header = document.createElement('th');
    header.innerHTML = headerTxt;
    headerRow.appendChild(header);
    table.appendChild(headerRow);
    for (let element of relatedData) 
    {
        var tblRow = document.createElement('tr'),
        tblCell = document.createElement('td');
        tblCell.innerHTML = element[key];
        tblRow.appendChild(tblCell);
        table.appendChild(tblRow);
    }
}
// end of addToRelatedTbl()

/* end of utility functions */



/* functions for dropdowns  */
function addDefaultOptionToDropdown(text, list)
{
    var defaultOption = document.createElement("option");
    defaultOption.value = '0';
    defaultOption.innerHTML = text;
    list.appendChild(defaultOption);
}

function addOptionToDropdown(id, name, gObject, list){        
    for (let elem of gObject)
    {
    var option = document.createElement("option");
    option.value = elem[id];
    option.name = elem[name];
    option.innerHTML = option.name;
    list.appendChild(option);
    }
}


//generic success function
function successfunction()
{
    alert('Success!');
    //clear user input after saving the data to the server
    resetDropdowns();
    reset();
}

//generic error function
function errorfunction()
{
    var errormessage = gReturnInfo.message;
    alert("ERROR: " + errormessage);
}

/* Region dropdown functions */
// success function
function successRegionsQuery()
{
    gRegions = gReturnInfo.sort(function (a, b)
    {
        return a.name > b.name;
    });
    
    //delete previous list of regions
    regList.innerHTML = '';
    //create a default option for the dropdown
    let text = "- Select region -";
    addDefaultOptionToDropdown(text, regList);
    // create options tags and add content from server's response
    addOptionToDropdown('id', 'name', gRegions, regList);
}

// invoke the getRegions function
function doRegionsQuery()
{
    getRegions(successRegionsQuery, errorfunction);
}
/* end of Region dropdown functions */


/* Category dropdown functions */
// success function
function successGetCategories()
{
    var gCategories = gReturnInfo.sort(function (a, b)
    {
        return a.name > b.name;
    });
    //create option tags and add content from server's response
    if (catList.length == 1)
    {
        addOptionToDropdown('name', 'name', gCategories, catList);
    }
}

// invoke the getCategories function
function doCategoriesQuery()
{
    getCategories(successGetCategories, errorfunction);
}
/*end of category dropdown functions */


/* Provider dropdown functions */
// success function
function successProvidersQuery()
{
    var gProviders = gReturnInfo;
    //delete previous list of providers
    providerList.innerHTML = '';
    //create a default option for the dropdown
    let text = '- Select provider -';
    addDefaultOptionToDropdown(text, providerList);
    //create option tags and add content from server's response
    addOptionToDropdown('name', 'name', gProviders, providerList);
    providerList.selectedIndex = 0;
}

// invoke the getProviders function
function doProvidersQuery(region)
{
    //add new providers dependent on region chosen
    getProviders(region, successProvidersQuery, errorfunction);
}
/* end of provider dropdown functions */


/* query data dropdown functions */
//successfunction for populating query data dropdown 
function successGetQueryData()
{
    var gQueryData = gReturnInfo;
    // Declare which dropdown element should be populated
    // on default it is the one in Experiment section
    var list = targetDataList;
    
    if (gMenuContext == CLEANUP_MENU)
    {
        // Change dropdown element to the one in Clean Up menu
    	list = targetDataListDel;
	}
    // Create and fill up a table with region-related records 
    if (cleanupContext == DELETE_REGION)
    {
        var table = regionRelatedTargetsTbl,
         key = 'dataname';
        addToRelatedTbl(table, gQueryData, key, 'Query Data');
    }
    else
    {
        //remove all options from dropdown
        list.innerHTML = '';
        //add a default option
        let text = '- Select data set -';
        addDefaultOptionToDropdown(text, list);
        // Add content to dropdown in Experiment or Delete Upload
        addOptionToDropdown('id', 'dataname', gQueryData, list);
    }
}

//invoke the getQueryData function
function doGetQueryData()
{
    let regionId = regList.value;
    if (cleanupContext == DELETE_REGION)
    {
        var category = 'all';
    }
    else
    {
        var category = catList.value;
    }
    getQueryData(regionId, category, successGetQueryData, errorfunction);
}
/* end of query data dropdown functions */

/* upload data dropdown functions */

//success function for populating upload data dropdown
function successGetUploadData()
{
    var gUploadData = gReturnInfo;
    // Declare which dropdown element should be populated
    // on default the one in Experiment section
    var list = referenceDataList;

    if (gMenuContext == CLEANUP_MENU)
    {
        // Change dropdown element to the one in Clean Up section
        list = referenceDataListDel;
    }
    if (cleanupContext == DELETE_REGION)
    {
        var table = regionRelatedReferencesTbl,
         key = 'dataname';
        addToRelatedTbl(table, gUploadData, key, 'Upload Data');
    }
    else 
    {
        //remove all options from dropdown
        list.innerHTML = '';
        //add a default option
        let text = '- Select reference set -';
        addDefaultOptionToDropdown(text, list);
        // Add content to dropdown in Experiment or Delete Upload
        addOptionToDropdown('id', 'dataname', gUploadData, list);
    }
    var checkbox = document.getElementById(nameCheckID);
    if (catList.options[catList.selectedIndex].text == 'roads')
	{
    	checkbox.disabled = true;
    	checkbox.checked = false;
	}
    else
	{
    	checkbox.disabled = false;
	}
}

//invoke the getUploadData function
function doGetUploadData()
{
    let regionId = regList.value;
    if (cleanupContext == DELETE_REGION)
    {
        var category = 'all';
    }
    else
    {
        var category = catList.value;
    }

    //this will be based on what target data is chosen?
    getUploadData(regionId, category, successGetUploadData, errorfunction);
}
/* end of upload data dropdown functions */

/* Success function for populating experiment dropdown 
and related tables in Clean up */


function successGetExperiments()
{
    var gExperiments = gReturnInfo;
    // Table to hold names of data related to query or upload data in Clean Up section
    var table;
    var dataId;
    //clear all options from dropdown
    experListDel.innerHTML = '';
    //add a default option
    let text = '- Select experiment -';
    addDefaultOptionToDropdown(text, experListDel);

    if (cleanupContext == DELETE_QUERY)
    {
        table = targetRelatedTbl;
        var relatedExperiments = gExperiments.filter(experiment => 
            experiment.targetdataid == targetDataListDel.value);
        if (relatedExperiments.length === 0) {
            alert('No related data in the database');
        }
        else if (relatedExperiments.length > 0){
            let key = 'experimentname';
            addToRelatedTbl(table, relatedExperiments, key, 'Experiments');
        }
    }
    else if (cleanupContext == DELETE_UPLOAD)
    {
        table = referenceRelatedTbl;
        var relatedExperiments = gExperiments.filter(experiment => 
            experiment.refdataid == referenceDataListDel.value);
        if (relatedExperiments.length === 0) {
            alert('No related data in the database');
        }
        else if (relatedExperiments.length > 0){
            let key = 'experimentname';
            addToRelatedTbl(table, relatedExperiments, key, 'Experiments');
        }
    }
    else if (cleanupContext == DELETE_EXPERIMENT)
    {
        var filteredExperiments = gExperiments.filter(elem => elem['experimentname'].includes(catList.value));
        addOptionToDropdown('id', 'experimentname', filteredExperiments, experListDel);
    }
}


function doGetExperiments()
{   
    var regionId = regList.value;
    getExperiments(regionId, successGetExperiments, errorfunction);
}


/*end of dropdown functions*/


/* functions for createNewRegion */
// success function for createRegion()
function successCreateRegion()
{
    alert('Region created successfully!');
    reset();
}

// invoke the createRegion() function 
function doCreateRegion()
{
    // get values entered by the user:
    const name = document.getElementById(nameID).value,
        y_sw = document.getElementById(y_swID).value,
        x_sw = document.getElementById(x_swID).value,
        y_ne = document.getElementById(y_neID).value,
        x_ne = document.getElementById(x_neID).value;
    //if input is missing alert user
    if (y_sw === '' || x_sw === '' || y_ne === '' || x_ne === '' || name === '')
    {
        alert('All input fields must be completed');
    }
    else
    {
        createRegion(name, x_sw, y_sw, x_ne, y_ne, successCreateRegion, errorfunction);
    }
}
//end of createRegion function


/* functions for createUploadData */
// invoke the createUploadData() function 
function doCreateUploadData()
{
    //get parameters that need to be sent to the database
    var regionId = regList.value,
        name = document.getElementById(dataSourceTitleID).value,
        category = catList.value,
        comment = document.getElementById(commentFieldInputID).value,
        spatialref = epsgCodeInput.value,
        filename = document.getElementById(fileObjectID).value,
        fileobject = document.getElementById(fileObjectID).files[0],
        //create a collection of radio buttons
        //fileFormatRadios = document.getElementsByName(fileFormatInputID),
        fileformat = 'shp'; // no support for other formats right now

    //check which radio button is selected and assign the value to fileformat
    //for (let elem of fileFormatRadios)
    //{
    //    if (elem.checked)
    //    {
    //        fileformat = elem.value;
    //    }
    //}

    console.log(regionId, name, category, comment, filename, fileobject, fileformat, spatialref)
    //check if all values are entered  
    if (regionId == '0' || name == '' || category == '0' || filename == '' || fileobject == '' || spatialref == '' || fileformat == '')
    {
        alert('Please enter all required values.');
    }
    else
    {
        //invoke createUploadData which saves the file on the server
        createUploadData(regionId, name, category, comment, filename, fileobject, fileformat, spatialref, successfunction, errorfunction);
    }

}
//end of createUploadData()


/* functions for createQueryData */
// success function for createQueryData()
function successCreateQueryData()
{
    alert('Query data saved!');
    ///this function saves data on the server so remove SAVE button
    saveQueryBtn.style.display = "none";
}

// invoke the createQueryData() function 
function doCreateQueryData(regionId, name, category, provider)
{
    //get table header to use as value keys in JSON
    var headers = ["name", "lat", "lng", "metadata"],
    //empty array to hold query results 
     queryResponse = [];
    //get values from row cells
    for (let i = 1; i < queryResultsTbl.rows.length; i++)
    {
        var tableRow = queryResultsTbl.rows[i],
            rowData = {};
        //use each header from headers array as a key in the object
        for (let index in headers)
        {
            rowData[headers[index]] = tableRow.cells[index].innerHTML;
        }
        queryResponse.push(rowData);
    }
    var coords = queryResponse;
    //invoke createQueryData function
    createQueryData(regionId, name, category, provider, coords, successCreateQueryData, errorfunction);
}

function doCreateImageQueryData(regionId, name, category, provider, imgurl, zoom, mapcenter)
{
    createImageQueryData(regionId, name, category, provider, imgurl, zoom, mapcenter, successCreateQueryData, errorfunction);
}
//end of createQueryData function


//this function triggers calculation of metrics for uploaded and target data

var gMetrics = null;

//create a table showing point matches 
function dispMatchTable(index, refName, refLat, refLng, tarName, tarLat, tarLng, matchDist)
{

    var row = document.createElement('tr'),
        cellRefName = document.createElement('td'),
        cellRefCoords = document.createElement('td'),
        cellTarName = document.createElement('td'),
        cellTarCoords = document.createElement('td'),
        cellMatchDist = document.createElement('td'),
        cellRemove = document.createElement("td"),
        cellHighlight = document.createElement("td"),
        btnRemove = document.createElement("button"),
        spanBtnRemove = document.createElement("span"),
    	btnHighlight = document.createElement("button"),
        spanBtnHighlight = document.createElement("span");

    var txtRefName = document.createTextNode(refName),
        txtRefCoords = document.createTextNode(Number(refLat).toFixed(5) + ', ' + Number(refLng).toFixed(5)),
        txtTarName = document.createTextNode(tarName),
        txtTarCoords = document.createTextNode(Number(tarLat).toFixed(5) + ', ' + Number(tarLng).toFixed(5)),
        txtMatchDist = document.createTextNode(Number(matchDist).toFixed(2));

    btnRemove.className = "btn btn-default btn-sm";
    spanBtnRemove.className = "glyphicon glyphicon-trash";
    btnHighlight.className = "btn btn-default btn-sm";
    spanBtnHighlight.className = "glyphicon glyphicon-star-empty";
    //set row id to reference it when removing
    row.setAttribute("id", "row" + index);
    //button remove table row
    btnRemove.setAttribute("type", "button");
    btnRemove.setAttribute("id", index);
    btnRemove.onclick = function (e)
    {
	var index = btnRemove.id;
	matchTbl.removeChild(document.getElementById('row' + btnRemove.id));
	gCurrentMap.removeLayer(gMatchPoints[index].refMarker);
	gCurrentMap.removeLayer(gMatchPoints[index].targetMarker);
	delete gMatchPoints[index];  /* remove from global match point array */
    }

    //button highlight a point or set of points
    btnHighlight.setAttribute("type", "button");
    btnHighlight.setAttribute("id", index);
    btnHighlight.setAttribute("name", "normal"); /* use name attribute to indicate highlight state */

    // on click, we highlight the row, delete the old markers and create new ones
    // with heavier boarders and larger diameters
    // 12 Nov 2019 added toggle capability
    btnHighlight.onclick = function(e)
	{
	    var index = btnHighlight.id,
	     row = document.getElementById('row' + btnHighlight.id);
	    if (row == null)
		{
		    return;
		}
	    var styleRef;
	    var styleTar;
	    let refLat = gMatchPoints[index].refcoords.lat,
	    refLng = gMatchPoints[index].refcoords.lng,
	    tarLat = gMatchPoints[index].targetcoords.lat,
	    tarLng = gMatchPoints[index].targetcoords.lng,
	    refName = gMatchPoints[index].refname,
	    tarName = gMatchPoints[index].targetname;
	    //if no place names, display string 'no name'
	    if (refName == null || refName == '')
		{
		    refName = 'No name';
		}
	    if (tarName == null || tarName == '')
		{
		    tarName = 'No name';
		}
	    var childnodes = row.childNodes;
	    if (btnHighlight.name == "normal")  /* we use the name as state variable */
		{
		    for (var i = 0; i < childnodes.length; i++)
			{
			    if (childnodes[i].tagName == 'TD')
				{
				    childnodes[i].style.backgroundColor = '#aaaaff';
				}
		    }
		    styleRef = 
			{
			    radius: 7,
			    fillColor: "red",
			    color: "black",
			    weight: 3,
			    opacity: 1,
			    fillOpacity: 1,
			};
		    styleTar = 
			{
			    radius: 7,
			    fillColor: "blue",
			    color: "black",
			    weight: 3,
			    opacity: 1,
			    fillOpacity: 1,
			};
		    btnHighlight.name = "selected";
		}
	    else /* reset to normal size and color*/
		{
		    for (var i = 0; i < childnodes.length; i++)
			{
			    if (childnodes[i].tagName == 'TD')
				{
				    childnodes[i].style.backgroundColor = 'inherit';
				}
			}
		    styleRef =
		    {
			radius: 5,
			fillColor: "red",
			color: "#fc9272",
			weight: 1,
			opacity: 1,
			fillOpacity: 1,
		    };
		    styleTar = 
		    {
			radius: 5,
			fillColor: "blue",
			color: "#fc9272",
			weight: 1,
			opacity: 1,
			fillOpacity: 1,
		    };
		    btnHighlight.name = "normal";
		}
	    gCurrentMap.removeLayer(gMatchPoints[index].refMarker);
	    gCurrentMap.removeLayer(gMatchPoints[index].targetMarker);
	    gMatchPoints[index].refMarker = 
	    L.circleMarker([refLat, refLng], styleRef).addTo(gCurrentMap)
	    .bindPopup(refName);
	    gMatchPoints[index].targetMarker = 
	    L.circleMarker([tarLat, tarLng], styleTar).addTo(gCurrentMap)
	    .bindPopup(tarName);
	};  // End of inline function

    cellRefName.appendChild(txtRefName);
    cellRefCoords.appendChild(txtRefCoords);
    cellTarName.appendChild(txtTarName);
    cellTarCoords.appendChild(txtTarCoords);
    cellMatchDist.appendChild(txtMatchDist);
    cellRemove.appendChild(btnRemove);
    btnRemove.appendChild(spanBtnRemove);
    cellHighlight.appendChild(btnHighlight);
    btnHighlight.appendChild(spanBtnHighlight);

    row.appendChild(cellRefName);
    row.appendChild(cellRefCoords);
    row.appendChild(cellTarName);
    row.appendChild(cellTarCoords);
    row.appendChild(cellMatchDist);
    row.appendChild(cellRemove);
    row.appendChild(cellHighlight);
    matchTbl.appendChild(row);
}

/* checks to see if any items have been deleted from
 * the global match points list. If some have been
 * deleted, returns true, else false
 */
function checkDeleted()
{
    var actualPoints = 0,
     result = true;
    for (var i = 0; i < gMatchPoints.length; i++)
    {
	if (gMatchPoints[i])   // not deleted
	{
	    actualPoints++;
	}
    }
    if (actualPoints == gMatchPoints.length)
    {
	result = false;
	alert("You have not removed any points\nRecalculation will give identical results");
    }
    return result;
}

function successExport()
{
    var filelink = gReturnInfo.csvfile,
     metricsLeftColDiv = document.getElementById("metricsLeftCol"),
     linkitem = document.createElement("A");
    linkitem.text="Download CSV";
    linkitem.href=filelink;
    linkitem.id ="csvdownload";
    linkitem.style.margin = "15px";
    linkitem.style.fontWeight = "bold";
    linkitem.style.fontSize = "large";
    metricsLeftColDiv.appendChild(linkitem)
}



function successGetMatchPoints()
{

    gMatchPoints = gReturnInfo;


    //get parameters to display a map 
    var expRegObj = gRegions.filter(region => region.id == gLatestExperiment.expRegion)[0],
        mapCenterObj = expRegObj.center,
        boundingBox = [
        {
            lat: parseFloat(expRegObj.y_sw),
            lng: parseFloat(expRegObj.x_sw)
        },
        {
            lat: parseFloat(expRegObj.y_ne),
            lng: parseFloat(expRegObj.x_ne)
        }],
        mapCenter = {
            lat: parseFloat(mapCenterObj.lat),
            lng: parseFloat(mapCenterObj.lng)
        },
        regionName = expRegObj.name;

    /*console.log("gCurrentMap in successGetMatchPoints is " + gCurrentMap);
    if (gCurrentMap != null)
    {
	gCurrentMap.off();
	gCurrentMap.remove();
	}*/

    var pointMap = L.map('matchMap').setView([mapCenter.lat, mapCenter.lng], 12);
    gCurrentMap = pointMap;
    var mapLink =
        '<a href="http://openstreetmap.org">OpenStreetMap</a>';
    L.tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            attribution: '© ' + mapLink + ' Contributors',
            maxZoom: 18,
        }).addTo(pointMap);
    L.control.scale().addTo(pointMap);
    //set bounds of the map display to bounding box of the region
    pointMap.fitBounds([
        [boundingBox[0].lat, boundingBox[0].lng],
        [boundingBox[1].lat, boundingBox[1].lng]
    ]);


    // show the table 
    matchTbl.style.display = 'block';

    //add markers representing matching points from gMatchPoints
    for (let index in gMatchPoints)
    {
        let refLat = gMatchPoints[index].refcoords.lat,
            refLng = gMatchPoints[index].refcoords.lng,
            tarLat = gMatchPoints[index].targetcoords.lat,
            tarLng = gMatchPoints[index].targetcoords.lng,
            refName = gMatchPoints[index].refname,
            tarName = gMatchPoints[index].targetname,
            matchDist = gMatchPoints[index].distance;

        //if no place names, display string 'no name'
        if (refName == null || refName == '')
        {
            refName = 'No name';
        }
        if (tarName == null || tarName == '')
        {
            tarName = 'No name';
        }

	var styleRef = 
	    {
		radius: 5,
		fillColor: "red",
		color: "#fc9272",
		weight: 1,
		opacity: 1,
		fillOpacity: 1,
	    };
	
	var styleTar = 
	    {
		radius: 5,
		fillColor: "blue",
		color: "#fc9272",
		weight: 1,
		opacity: 1,
		fillOpacity: 1,
	    };
        //create reference marker
	gMatchPoints[index].refMarker = 
	    L.circleMarker([refLat, refLng], styleRef).addTo(pointMap)
            .bindPopup(refName);
        //create target marker
	gMatchPoints[index].targetMarker = 
	    L.circleMarker([tarLat, tarLng], styleTar).addTo(pointMap)
            .bindPopup(tarName);
        //create table with matching points
        dispMatchTable(index, refName, refLat, refLng, tarName, tarLat, tarLng, matchDist);

        //draw a line between the matching points
        var lineEnds = [
            [refLat, refLng],
            [tarLat, tarLng],
        ];
	/*
        var polyline = L.polyline(lineEnds,
        {
            opacity: 0.5,
            weight: 5
        }).addTo(pointMap);
	*/
    }
    //clears experiment results and goes back to Experiment screen enabling another experiment
    resetExperBtn.onclick = function (e)
    {
        resetMapAndTable(pointMap, matchTbl);
        experiment();
    }
    recalcBtn.style.display = 'block';
    recalcBtn.onclick = function (e)
    {
	if (checkDeleted())
	    {
        resetMapAndTable(pointMap, matchTbl);
        doRecalculateMetrics();
	    }
    }

    saveMetricsBtn.onclick = function (e)
    {
        clearCsvLink();
    	exportMetrics(gLatestExperiment.experimentid, successExport, errorfunction);
    }

}

function successCalcMetricsPoints()
{
    gMetrics = gReturnInfo;
    clearPrevious();
    clearCsvLink();
    metricsDiv.style.display = "";
    matchMap.style.display = "";
    //display title and parameters set for the experiment 
    navOptionTitle.innerHTML = 'Experiment Results';
    refDataLbl.innerHTML = "<i class='fas fa-circle' style='font-size:15px;color:red'></i>" + ' <b>Reference data: </b> ' + gLatestExperiment.refName;
    tarDataLbl.innerHTML = "<i class='fas fa-circle' style='font-size:15px;color:blue'></i>" + '<b>Target data:</b> ' + gLatestExperiment.tarName;
    bufferLbl.innerHTML = '<b>Buffer:</b> ' + gLatestExperiment.buffer + ' m';


    //display metrics
    refCountLbl.innerHTML = '<b>Reference points: </b>' + gMetrics.refcount + ' points';
    matchCountLbl.innerHTML = '<b>Matched points:</b> ' + gMetrics.matchcount;
    avgDistLbl.innerHTML = '<b>Average distance: </b>' + Math.round(gMetrics.averagedistance) + ' m';
    densityLbl.innerHTML = '<b>Density: </b>' + gMetrics.density + ' points';
    completenessLbl.innerHTML = '<b>Completeness: </b>' + Math.round(gMetrics.completeness * 100) + ' %';
    var expId = gMetrics.experimentid;
    gLatestExperiment.experimentid = expId;
    getMatchPoints(expId, successGetMatchPoints, errorfunction);
}


/* Display a Leaflet map showing the original and extracted lines
 */
function successGetMatchLines()
{
    gMatchLines = gReturnInfo;
    //get parameters to display a map 
    var expRegObj = gRegions.filter(region => region.id == gLatestExperiment.expRegion)[0];
    var mapCenterObj = gLatestExperiment.center;
    var boundingBox = [
        {
            lat: parseFloat(expRegObj.y_sw),
            lng: parseFloat(expRegObj.x_sw)
        },
        {
            lat: parseFloat(expRegObj.y_ne),
            lng: parseFloat(expRegObj.x_ne)
        }],
        mapCenter = {
            lat: parseFloat(mapCenterObj.lat),
            lng: parseFloat(mapCenterObj.lng)
        },
	regionName = expRegObj.name;

    var zoom = gLatestExperiment.zoom;
    /*
    if (gCurrentMap != null)
    {
	gCurrentMap.off();
	gCurrentMap.remove();
	}*/

    var lineMap = L.map('matchMap').setView([mapCenter.lat, mapCenter.lng], zoom);
    gCurrentMap = lineMap;
    var mapLink =
        '<a href="http://openstreetmap.org">OpenStreetMap</a>';
    L.tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            attribution: '© ' + mapLink + ' Contributors',
            maxZoom: zoom + 1,
	    minZoom: zoom - 1
        }).addTo(lineMap);
    L.control.scale().addTo(lineMap);

    L.geoJSON(gMatchLines, {
	    style: function(feature) 
		{
		switch (feature.properties.type) 
		    {
		    case 'reference': return {color: "#ff0000", weight: 8};
		    case 'target':   return {color: "#0000ff", weight: 4};
		    }
		}
	}).addTo(lineMap);

    //clears experiment results and goes back to Experiment screen enabling another experiment
    resetExperBtn.onclick = function (e)
    {
        resetMapAndTable(lineMap, matchTbl);
        experiment();
    }

    saveMetricsBtn.onclick = function (e)
    {
        clearCsvLink();
	exportMetrics(gLatestExperiment.experimentid, successExport, errorfunction,"true");
    }

}

function successCalcMetricsLines()
{
    gMetrics = gReturnInfo;


    clearPrevious();
    clearCsvLink();
    metricsDiv.style.display = "";
    matchMap.style.display = "";
    //display title and parameters set for the experiment 
    navOptionTitle.innerHTML = 'Experiment Results';
    refDataLbl.innerHTML = "<i class='fas fa-circle' style='font-size:15px;color:red'></i>" + ' <b>Reference data: </b> ' + gLatestExperiment.refName;
    tarDataLbl.innerHTML = "<i class='fas fa-circle' style='font-size:15px;color:blue'></i>" + '<b>Target data:</b> ' + gLatestExperiment.tarName;
    bufferLbl.innerHTML = '<b>Buffer:</b> ' + gLatestExperiment.buffer + ' m';


    // hide the table 
    matchTbl.style.display = 'none';
    // hide recalculate 
    recalcBtn.style.display = 'none';

    refCountLbl.innerHTML = '<b>Reference roads in image area: </b>' + gMetrics.refcount;
    matchCountLbl.innerHTML = '<b>Matched roads:</b> ' + gMetrics.matchcount;
    avgDistLbl.innerHTML = '<b>Average distance: </b>' + Math.round(gMetrics.averagedistance) + ' m';
    densityLbl.innerHTML = '<b>Average difference in length: </b>' + Math.round(gMetrics.averagedelta) + ' m';
    completenessLbl.innerHTML = '<b>Completeness: </b>' + Math.round(gMetrics.completeness * 100) + ' %';
    var expId = gMetrics.experimentid;
    gLatestExperiment.experimentid = expId;
    gLatestExperiment.zoom = gMetrics.zoomfactor;
    gLatestExperiment.center = gMetrics.center;
    getMatchLines(expId, successGetMatchLines, errorfunction);
}


function doCalculateMetrics()
{
    //get user's selections
    gMatchPoints = null; 
    gLatestExperiment.refDataId = referenceDataList.value;
    gLatestExperiment.targetDataId = targetDataList.value;
    gLatestExperiment. buffer = document.getElementById(bufferInputID).value;
    gLatestExperiment.nameflag = (document.getElementById(nameCheckID).checked)? 'true': 'false';
    gLatestExperiment.expRegion = regList.value;
    let cat = catList.value;

    var refIsQuery = false,
        targetIsQuery = true;

    if (gLatestExperiment.refDataId == '0' || gLatestExperiment.targetDataId == '0' || 
	gLatestExperiment.buffer == '' || gLatestExperiment.buffer == 0)
    {
        alert('Please enter or select all required values.');
    }
    else
    {
        gLatestExperiment.refName = referenceDataList.childNodes[referenceDataList.selectedIndex].name;
        gLatestExperiment.tarName = targetDataList.childNodes[targetDataList.selectedIndex].name;

        //clear previous sections and render metricsDiv
	/*** WAIT until we get success 
        clearPrevious();
	clearCsvLink();
        metricsDiv.style.display = "";
	matchMap.style.display = "";
        //display title and parameters set for the experiment 
        navOptionTitle.innerHTML = 'Experiment Results';
	refDataLbl.innerHTML = "<i class='fas fa-circle' style='font-size:15px;color:red'></i>" + ' <b>Reference data: </b> ' + gLatestExperiment.refName;
	tarDataLbl.innerHTML = "<i class='fas fa-circle' style='font-size:15px;color:blue'></i>" + '<b>Target data:</b> ' + gLatestExperiment.tarName;
	bufferLbl.innerHTML = '<b>Buffer:</b> ' + gLatestExperiment.buffer + ' m';
	**/
	if (cat != 'roads')
	    {
	    calculateMetrics(gLatestExperiment.refDataId, refIsQuery, 
			 gLatestExperiment.targetDataId, targetIsQuery, 
			 gLatestExperiment.buffer, gLatestExperiment.nameflag, 
			 successCalcMetricsPoints, errorfunction);
	    }
	else
	    {
	    calculateMetrics(gLatestExperiment.refDataId, refIsQuery, 
			 gLatestExperiment.targetDataId, targetIsQuery, 
			 gLatestExperiment.buffer, gLatestExperiment.nameflag, 
			 successCalcMetricsLines, errorfunction);
	    }
    }
}

function doRecalculateMetrics()
{
    var refIsQuery = false,
        targetIsQuery = true;
    clearPrevious();
    clearCsvLink();
    metricsDiv.style.display = "";
    matchMap.style.display = "";
    //display title and parameters set for the experiment 
    navOptionTitle.innerHTML = 'Experiment Results';
    refDataLbl.innerHTML = "<i class='fas fa-circle' style='font-size:15px;color:red'></i>" + ' <b>Reference data: </b> ' + gLatestExperiment.refName;
    tarDataLbl.innerHTML = "<i class='fas fa-circle' style='font-size:15px;color:blue'></i>" + '<b>Target data:</b> ' + gLatestExperiment.tarName;
    bufferLbl.innerHTML = '<b>Buffer:</b> ' + gLatestExperiment.buffer + ' m';
    var matchedpoints = [];
    for (var i = 0; i < gMatchPoints.length; i++)
    {
	if (gMatchPoints[i])   // not deleted
	{
	    var pointpair = new PointPair();
	    pointpair.refid = gMatchPoints[i].refid;
	    pointpair.targetid = gMatchPoints[i].targetid;
	    matchedpoints.push(pointpair);
	}
    }
    gMatchPoints = null;
    recalculateMetrics(gLatestExperiment.refDataId, refIsQuery, 
		       gLatestExperiment.targetDataId, targetIsQuery, 
		       gLatestExperiment.buffer, matchedpoints, 
		       successCalcMetricsPoints, errorfunction);
    
}

/* Clean up section */
function doShowQueryRelated()
{
    // validate input
    if (targetDataListDel.value == 0)
    {
        alert('Please select upload data name.');
    }
    else
    {
        targetRelatedDiv.style.display = '';
        doGetExperiments();
        // this.disabled = true;
    }
}

function successCleanup()
{
    alert('Successful cleanup!');
    resetDropdowns();
    reset();
    resetRelatedTbl(targetRelatedTbl);
    resetRelatedTbl(referenceRelatedTbl);
    referenceRelatedDiv.style.display = "none";
    targetRelatedDiv.style.display = "none";
}

function confirmDeleteQueryData()
{
    if (targetDataListDel.value == 0)
    {
        alert('Please select a dataset to be deleted.');
    }
    else
    {
    	var datasetName = targetDataListDel[targetDataListDel.selectedIndex].text,
         id = targetDataListDel.value,
         selectedOption = targetDataListDel[targetDataListDel.selectedIndex];
    	if (confirm("Are you sure you want to delete data set " + datasetName + "?\n You will NOT be able to undo this.")) 
    	{
    		doDeleteQueryData(); 
    	}
    } 
}

function doDeleteQueryData()
{
    var dataId = targetDataListDel.value;
    deleteData(QUERY_DATA, dataId, successCleanup, errorfunction)
}
///////////
function doShowUploadRelated()
{
    // validate input
    if (referenceDataListDel.value == 0)
    {
        alert('Please select upload data name.');
    }
    else
    {
        referenceRelatedDiv.style.display = '';
        doGetExperiments();
        // this.disabled = true;
    }
 
}
function confirmDeleteUploadData()
{
    if (referenceDataListDel.value == 0)
    {
        alert('Please select a dataset to be deleted.');
    }
    else
    {
    	var datasetName = referenceDataListDel[referenceDataListDel.selectedIndex].text;
    	if (confirm("Are you sure you want to delete data set " + datasetName + "?\n You will NOT be able to undo this.")) 
    	{
    		doDeleteUploadData(); 
    	} 
    }
}

function doDeleteUploadData()
{
    var dataId = referenceDataListDel.value;
    deleteData(DOWNLOAD_DATA, dataId, successCleanup, errorfunction);
}
///////////

function confirmDeleteExperiment()
{
    if (experListDel.value == 0)
    {
        alert('Please select an experiment to be deleted.');
    }
    else
    {
    	var experimentName = experListDel[experListDel.selectedIndex].text;
    	if (confirm("Are you sure you want to delete " + experimentName + "? You will NOT be able to undo this.")) 
    	{
    		doDeleteExperiment(); 
    	} 
    }
}

function doDeleteExperiment()
{
    var dataId = experListDel.value;
    deleteData(EXPERIMENT, dataId, successCleanup, errorfunction);
}
/////
function doShowRegionRelated()
{
    // validate input
    if (regionList.value == 0)
    {
        alert('Please select region name.');
    }
    else
    {
        regionRelatedDiv.style.display = '';
        doGetUploadData();
        doGetQueryData();
        // this.disabled = true;
    }
}
function confirmDeleteRegion()
{
    if (regList.value == 0)
    {
        alert('Please select a region to be deleted.');
    }
    else
    {
    	let regionName = regList[regList.selectedIndex].text;
    	if (confirm("Are you sure you want to delete " + regionName + "? You will NOT be able to undo this.")) 
    	{
	    doDeleteRegion(); 
    	} 
    }
}

function doDeleteRegion()
{
    var dataId = regList.value;
    deleteData(REGION, dataId, successCleanup, errorfunction);
}

/* Retrieve information about provider API keys, then call success
 * function to populate the global variables. This should be called
 * only once, when the application is loaded.
 * NOTE this currently has the undesirable feature that it "knows"
 * the provider names and the names of the global variables.
 * ~TODO Parameterize to make this independent of the provider set
 */
function doGetProviderKeys()
{
    //console.log("doGetProviderKeys called");
    getProviderKeys(function()
		    {
		    var i;
		    for (i = 0; i < gReturnInfo.length; i++)
			{
			if (gReturnInfo[i].providername == 'Bing Europe')
			    {
			    keyBing = gReturnInfo[i].pointkey;
			    }
			if (gReturnInfo[i].providername == 'Google')
			    {
			    keyGoogle = gReturnInfo[i].pointkey;	
			    keyGoogleStat = gReturnInfo[i].imagekey;	
			    }
			if (gReturnInfo[i].providername == 'Here')
			    {
			    keyHere.app_id = gReturnInfo[i].pointkey;
			    keyHere.app_code = gReturnInfo[i].imagekey;
			    }
			if (gReturnInfo[i].providername == 'MapQuest North America')
			    {
			    keyMQ = gReturnInfo[i].pointkey;
			    }
			}
	            }, errorfunction);		
}