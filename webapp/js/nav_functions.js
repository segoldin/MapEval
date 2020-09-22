/*	$Id: nav_functions.js,v 1.41 2019/11/20 12:00:04 aleksandra Exp $
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
 *
 *  This file contains functions that manipulate the DOM content of MapEval depending on the option selected from navigation bar. 
 *  Input from user is received 
 *
 *  Usage notes - calls functions from secondaryFunctions.js, requests and gets data for populating dropdowns from server_api.js
 *
 *  Created by aleksandra  on 2018/12/06 
 *
 *   $Log: nav_functions.js,v $
 *   Revision 1.41  2019/11/20 12:00:04  aleksandra
 *   move Related Data button generation to addRelatedDataBtn(), add onmouseover tooltip to button
 *
 *   Revision 1.40  2019/11/19 20:16:43  aleksandra
 *   modify resetMapAndTable() to be used instead of resetExperResult()
 *
 *   Revision 1.39  2019/11/19 08:43:59  goldin
 *   hide banner image for all options
 *
 *   Revision 1.38  2019/11/12 21:57:37  aleksandra
 *   update div name
 *
 *   Revision 1.37  2019/11/11 17:15:28  aleksandra
 *   removed redundant code
 *
 *   Revision 1.36  2019/11/11 15:45:20  aleksandra
 *   fixed default query and upload dataset dropdown option, made successGetXData functions more uniform
 *
 *   Revision 1.35  2019/11/06 12:09:41  aleksandra
 *   added reset button to delete region
 *
 *   Revision 1.34  2019/11/06 11:20:39  aleksandra
 *   added resetRelatedTbl() and reset button
 *
 *   Revision 1.33  2019/11/05 07:41:00  goldin
 *   dynamically load API keys; fix minor appearance glitches
 *
 *   Revision 1.32  2019/11/01 21:52:29  aleksandra
 *   displaying region related data in cleanup
 *
 *   Revision 1.31  2019/11/01 20:52:30  aleksandra
 *   table cleared after query to show related
 *
 *   Revision 1.30  2019/11/01 19:30:28  aleksandra
 *   show related button enable/disable
 *
 *   Revision 1.29  2019/10/27 07:27:35  aleksandra
 *   related to showRelated functionality
 *
 *   Revision 1.28  2019/10/15 22:06:52  aleksandra
 *   changed function names in show related buttons CLEAN UP div
 *
 *   Revision 1.27  2019/10/15 08:52:08  goldin
 *   refactor to allow user to select image center from map in roads queries
 *
 *   Revision 1.26  2019/10/11 09:12:09  aleksandra
 *   modified input resetting, added addResetButton()
 *
 *   Revision 1.25  2019/09/20 16:54:15  aleksandra
 *   minor changes in functions for clean up section
 *
 *   Revision 1.24  2019/09/17 08:59:23  goldin
 *   add gMenuContext to select between different controls depending on context
 *
 *   Revision 1.23  2019/09/16 10:24:47  aleksandra
 *   minor changes in clean up section
 *
 *   Revision 1.22  2019/09/13 11:45:14  aleksandra
 *   cleanup: added functions populating dropdowns and buttons
 *
 *   Revision 1.21  2019/09/13 10:16:52  aleksandra
 *   added clean-up related functions
 *
 *   Revision 1.20  2019/02/27 09:38:56  goldin
 *   implement recalculate; add global list of points matched so we can delete from the map
 *
 *   Revision 1.19  2019/02/15 04:40:34  goldin
 *   reformat all JS for readability
 *
 *   Revision 1.18  2019/02/03 16:21:14  aleksandra
 *   fixed problem with upload data/ reset function so that it doesn't reset radio button values
 *
 *   Revision 1.17  2019/01/29 10:06:36  aleksandra
 *   experiment display: added lines, colors for ref and target, match count; cut decimal places; keys as global variables; reset exp results; changes in successGetUploadData and successGetQueryData
 *
 *   Revision 1.16  2019/01/28 04:15:59  aleksandra
 *   Experiment displays map and results but no points yet
 *
 *   Revision 1.15  2019/01/28 03:30:31  aleksandra
 *   changes to do with Experiment and displaying metrics calculations
 *
 *   Revision 1.14  2019/01/25 03:00:07  aleksandra
 *   changes to display zoom dropdown onchange of category in new query data
 *
 *   Revision 1.13  2019/01/24 08:37:37  aleksandra
 *   added removing leaflet map onclick New Query button in New Query Data results
 *
 *   Revision 1.12  2019/01/22 10:59:58  aleksandra
 *   changes to do with static maps implementation
 *
 *   Revision 1.11  2019/01/03 10:42:12  aleksandra
 *   Bing and MapQuest debugging
 *
 *   Revision 1.10  2018/12/28 13:26:35  aleksandra
 *   changes to do with EPSG code
 *
 *   Revision 1.9  2018/12/26 13:02:11  aleksandra
 *   fixed google categories search, new mapCenter variable, fixed MapQuest, Bing map display
 *
 *   Revision 1.8  2018/12/24 10:21:17  aleksandra
 *   major changes to the display of query results display
 *
 *   Revision 1.7  2018/12/23 08:47:59  aleksandra
 *   fixed resetting results table in newQueryData
 *
 *   Revision 1.6  2018/12/17 06:26:43  aleksandra
 *   changed getEPSG method
 *
 *   Revision 1.5  2018/12/12 10:14:33  aleksandra
 *   added functions to get data from server
 *
 *   Revision 1.4  2018/12/10 08:29:12  aleksandra
 *   added input validation
 *
 *   Revision 1.3  2018/12/10 03:48:55  aleksandra
 *   API calls return resultsnav_functions.js
 *
 *   Revision 1.2  2018/12/07 06:49:12  aleksandra
 *   added header, made visible divs depending on nav option
 *
 *
 *
 */

"use strict"


/*main functions called from the navigation bar */
/*these functions change the DOM depending on the option chosen from navigation bar */

/* constants for context */

    const MAINPAGE = 0;
    const DATA_MENU = 1;
    const EXPERIMENT_MENU = 2;
    const CONFIG_MENU = 3;
    const CLEANUP_MENU= 4;

    const DELETE_QUERY = 0;
    const DELETE_UPLOAD = 1;
    const DELETE_EXPERIMENT = 2;
    const DELETE_REGION = 3;



/* global context variable */

var gMenuContext = MAINPAGE;

/****  context for cleanup menus ****/
var cleanupContext = DELETE_EXPERIMENT;

///////////////* ADD REGION *///////////////////

//this is where the user defines and adds a new region to the database
function addRegion()
{
    //clear irrelevant divs
    hideBanner();
    clearPrevious();
    gMenuContext = DATA_MENU;
    //display relevant divs
    navOptionTitle.innerHTML = 'New Region';
    newRegDiv.style.display = '';

    /*buttons div*/
    //create button elements in buttonsDiv
    buttons.style.display = '';
    var createRegBtn = document.createElement('button');
    var resetBtn = document.createElement('button');
    createRegBtn.innerHTML = 'Create Region';
    resetBtn.innerHTML = 'Reset';

    // createRegBtn.addEventListener('click', createRegion(regName, se_x, se_y, nw_x, nw_y));
    buttons.appendChild(createRegBtn);
    buttons.appendChild(resetBtn);
    //add event listener to buttons - send user input to database or reset all input fields

    createRegBtn.addEventListener('click', doCreateRegion);
    resetBtn.addEventListener('click', reset);
}
//end of addRegion()

///////////////* NEW UPLOAD DATA *///////////////////
//this is where user can upload a gml, shp or kml file to the database 
//to use as reference for comparison with online maps
function uploadData()
{
    //render title and clear previous sections
    hideBanner();
    clearPrevious();
    gMenuContext = DATA_MENU;
    navOptionTitle.innerHTML = 'New Upload Data Set';
    //make relevant divs visible
    regionDropDiv.style.display = '';
    categoryDropDiv.style.display = '';
    uploadDataDiv.style.display = '';
    buttons.style.display = '';

    //get regions from the server to populate dropdown
    doRegionsQuery();

    //get category list from the server to populate dropdown
    doCategoriesQuery();

    /* buttons div definition */
    //create button elements in the DOM
    var uploadDataBtn = document.createElement('button');
    //render Upload and Reset buttons - append them to button div
    buttons.appendChild(uploadDataBtn);
    //set text and event listener for uploadDataBtn 
    uploadDataBtn.innerHTML = 'Upload Data';
    uploadDataBtn.onclick = function (e)
    {
        doCreateUploadData();
    };
    addResetBtn();
}
//end of uploadData()


///////////////* NEW QUERY DATA *///////////////////
//this is where API calls to map providers are executed
function newQueryData()
{
    //render title and clear previous sections
    hideBanner();

    clearPrevious();
    gMenuContext = DATA_MENU;
    navOptionTitle.innerHTML = 'New Query Data';
    regionDropDiv.style.display = '';
    categoryDropDiv.style.display = '';
    newQueryDataDiv.style.display = '';
    buttons.style.display = '';
    settingsForRoadsDiv.style.display = "none";

    //get regions, categories from the server to populate dropdown
    doRegionsQuery();
    doCategoriesQuery();
    let region = '0';
    doProvidersQuery(region);
    //if region is selected, update provider's list accordingly
    regList.onchange = function (e)
    {
        providerListLbl.innerHTML = 'Providers specific to this region';
        let region = regList.value;
        doProvidersQuery(region);
    }

    //if category is road, then display zoom dropdown and all providers
    catList.onchange = function (e)
    {
        let cat = catList.value;
        if (cat === "roads")
        {
            settingsForRoadsDiv.style.display = "";
            let region = '0';
	    var radio = document.getElementById("defaultcenter");
	    if (radio) 
		radio.checked = true;
            doProvidersQuery(region);
        }
        //otherwise display only region specific providers
        else if (cat !== "roads")
        {
            settingsForRoadsDiv.style.display = "none";
            let region = regList.value;
            doProvidersQuery(region);
        }
    }

    /*buttons div*/
    //create button element in the DOM
    var queryBtn = document.createElement('button');
    buttons.appendChild(queryBtn);
    //set text and event listener for queryBtn 
    queryBtn.innerHTML = 'Query';
    queryBtn.onclick = function (e)
    {
        displayResultsTbl();
    }
    addResetBtn()
}
//end of newQueryData()




///////////////* EXPERIMENT *///////////////////
//this is where metrics are calculated

function experiment()
{
    //render title and clear previous sections
    hideBanner();

    clearPrevious();
    gMenuContext = EXPERIMENT_MENU;
    navOptionTitle.innerHTML = 'Experiment Parameters';
    regionDropDiv.style.display = '';
    categoryDropDiv.style.display = '';
    experimentDiv.style.display = '';
    buttons.style.display = '';
    //get regions, categories from the server to populate dropdown
    doRegionsQuery();
    doCategoriesQuery();

    //when region and category selected get relevant reference and target data
    regList.onchange = function (e)
    {
        if (regList.value !== '0' & catList.value !== '0')
        {
            doGetUploadData();
            doGetQueryData();
        }
    }
    catList.onchange = function (e)
    {
        if (regList.value !== '0' & catList.value !== '0')
        {
            doGetUploadData();
            doGetQueryData();
	    if (catList.value == 'roads')
		namesDiv.style.display='none';
	    else
		namesDiv.style.display='';
        }
    }

    /*buttons div*/
    //create button elements in the DOM
    var calculateBtn = document.createElement('button');
    //render button
    buttons.appendChild(calculateBtn);
    //set text and event listener for calculateBtn
    calculateBtn.innerHTML = 'Calculate Metrics';
    calculateBtn.addEventListener('click', doCalculateMetrics);
    addResetBtn();

}
//end of experiment()

///////////////* ADD NEW PROVIDER *///////////////////
//this is where user can add her own script for an online map provider query
function addNewProvider()
{
    //render title and clear previous sections
    hideBanner();

    clearPrevious();
    gMenuContext = CONFIG_MENU;
    navOptionTitle.innerHTML = 'Add your own script';
    configureDiv.innerHTML = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ';
    buttons.style.display = '';
}
//end of addNewProvider


//////////////* CLEAN UP *////////////////////
function delQueryData()
{
    //clear irrelevant 
    hideBanner();
    clearPrevious();
    reset();
    gMenuContext = CLEANUP_MENU;
    cleanupContext = DELETE_QUERY;
    //remove all tabel rows but not header
    resetRelatedTbl(targetRelatedTbl);
    targetRelatedDiv.style.display = "none";

    //display relevant divs
    navOptionTitle.innerHTML = 'CLEAN UP: Delete query datasets';
    delQueryDataDiv.style.display = '';
    regionDropDiv.style.display = '';
    categoryDropDiv.style.display = '';
    buttons.style.display = '';
    
    // generate buttons
    addRelatedDataBtn(doShowQueryRelated);
    addCleanupResetBtn(targetRelatedTbl);
    
    var delQueryDataBtn = document.createElement('button');
    buttons.appendChild(delQueryDataBtn);
    delQueryDataBtn.innerHTML = 'Delete';
    delQueryDataBtn.addEventListener('click', confirmDeleteQueryData);

    // populate dropdowns
    doRegionsQuery();
    doCategoriesQuery();

    //when region and category selected get relevant reference and target data
    regList.onchange = function (e)
    {
        if (regList.value !== '0' & catList.value !== '0')
        {
            doGetQueryData();
            // showRelatedBtn.disabled = false;
            resetRelatedTbl(targetRelatedTbl);
            targetRelatedDiv.style.display = "none";
        }
    }
    catList.onchange = function (e)
    {
        if (regList.value !== '0' & catList.value !== '0')
        {
            doGetQueryData();
            // showRelatedBtn.disabled = false;
            resetRelatedTbl(targetRelatedTbl);
            targetRelatedDiv.style.display = "none";
        }
    }
}
function delUploadData()
{
    //clear irrelevant
    hideBanner();
    clearPrevious();
    reset();
    gMenuContext = CLEANUP_MENU;
    cleanupContext = DELETE_UPLOAD;
    resetRelatedTbl(referenceRelatedTbl);
    referenceRelatedDiv.style.display = "none";
    //display relevant divs
    navOptionTitle.innerHTML = 'CLEAN UP: Delete upload datasets';
    delUploadDataDiv.style.display = '';
    regionDropDiv.style.display = '';
    categoryDropDiv.style.display = '';
    buttons.style.display = '';

    // add buttons
    addRelatedDataBtn(doShowUploadRelated);
    addCleanupResetBtn(referenceRelatedTbl);

    var delUploadDataBtn = document.createElement('button');
    buttons.appendChild(delUploadDataBtn);
    delUploadDataBtn.innerHTML = 'Delete';
    delUploadDataBtn.addEventListener('click', confirmDeleteUploadData);

    //populate dropdowns
    doRegionsQuery();
    doCategoriesQuery();
    regList.onchange = function (e)
    {
        if (regList.value !== '0' & catList.value !== '0')
        {
            doGetUploadData();
            resetRelatedTbl(referenceRelatedTbl);
            // showRelatedBtn.disabled = false;
            referenceRelatedDiv.style.display = "none";
        }
    }
    catList.onchange = function (e)
    {
        if (regList.value !== '0' & catList.value !== '0')
        {
            doGetUploadData();
            resetRelatedTbl(referenceRelatedTbl);
            // showRelatedBtn.disabled = false;
            referenceRelatedDiv.style.display = "none";
        }
    }
}
function delExperiment()
{
    //clear irrelevant
    hideBanner();
 
    clearPrevious();
    reset();
    gMenuContext = CLEANUP_MENU;
    cleanupContext = DELETE_EXPERIMENT;
    //display relevant divs
    navOptionTitle.innerHTML = 'CLEAN UP: Delete experiments';
    delExperimentDiv.style.display = '';
    regionDropDiv.style.display = '';
    categoryDropDiv.style.display = '';
    buttons.style.display = '';

    // add buttons
    var delExperimentBtn = document.createElement('button');
    buttons.appendChild(delExperimentBtn);
    delExperimentBtn.innerHTML = 'Delete';
    delExperimentBtn.addEventListener('click', confirmDeleteExperiment);
    
    addResetBtn();

    // populate dropdowns
    doRegionsQuery();
    doCategoriesQuery();
    regList.onchange = function (e)
    {
        if (regList.value !== '0' & catList.value !== '0')
        {
            doGetExperiments();
        }
    }
    catList.onchange = function (e)
    {
        if (regList.value !== '0' & catList.value !== '0')
        {
            doGetExperiments();
        }
    }

}
function delRegion()
{
    //clear irrelevant
    hideBanner();
 
    clearPrevious();
    gMenuContext = CLEANUP_MENU;
    cleanupContext = DELETE_REGION;
    regionRelatedDiv.style.display = "none";
    //display relevant divs
    navOptionTitle.innerHTML = 'CLEAN UP: Delete region';
    delRegionDiv.style.display = '';
    regionDropDiv.style.display = '';
    buttons.style.display = '';
    doRegionsQuery();

    addRelatedDataBtn(doShowRegionRelated);
    var delRegionResetBtn = document.createElement('button');
    buttons.appendChild(delRegionResetBtn);
    delRegionResetBtn.innerHTML = "Reset";
    delRegionResetBtn.onclick = function (e)
    {
        reset();
        resetDropdowns();
        resetRelatedTbl(regionRelatedTargetsTbl);
        resetRelatedTbl(regionRelatedReferencesTbl);
        regionRelatedDiv.style.display = "none";
    }

    var delRegionBtn = document.createElement('button');
    buttons.appendChild(delRegionBtn);
    delRegionBtn.innerHTML = 'Delete';
    delRegionBtn.addEventListener('click', confirmDeleteRegion);
    
    regList.onchange = function (e)
    {
        if (regList.value !== '0')
        {
            // showRelatedBtn.disabled = false;
            resetRelatedTbl(regionRelatedTargetsTbl);
            resetRelatedTbl(regionRelatedReferencesTbl);
            regionRelatedDiv.style.display = "none";
        }
    }
}


/* help functions, right of the navigation bar */

///////////////* ABOUT SECTION *///////////////////
//this displays info about MapEval
function displayAbout()
{
    //render title and clear previous sections
    hideBanner();
    clearPrevious();
    infoAreaDiv.style.display = '';
    navOptionTitle.innerHTML = '<h2 style="font-weight: bold;">About MapEval</h2>';
    infoAreaDiv.innerHTML = "<h3>MapEval &copy; King Mongkut's University of Technology Thonburi</h3><h3 style=\"font-weight: bold;\">Developers:</h3><h3>&nbsp;&nbsp;Aleksandra Magdziarek<br>&nbsp;&nbsp;Sally E. Goldin&nbsp<br>&nbsp;&nbsp;Phagasinee Boothoe</h3>";
}

///////////////* HELP SECTION *///////////////////
//this is help for all MapEval related things
function displayHelp()
{
    //render title and clear previous sections
    hideBanner();

    clearPrevious();
    infoAreaDiv.style.display = '';
    navOptionTitle.innerHTML = 'Help';
    infoAreaDiv.innerHTML = '<h2>Help coming soon</h2> ';
}

