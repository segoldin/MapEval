/*
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
 *
 *  This file holds declarations of constant vars
 *  for different elements in the user interface.
 *
 *  Created by aleksandra, November 2019
 *
 *   $Log: domElementDeclarations.js,v $
 *   Revision 1.5  2019/11/20 12:00:04  aleksandra
 *   move Related Data button generation to addRelatedDataBtn(), add onmouseover tooltip to button
 *
 *   Revision 1.4  2019/11/19 20:16:43  aleksandra
 *   modify resetMapAndTable() to be used instead of resetExperResult()
 *
 *   Revision 1.3  2019/11/19 08:49:37  goldin
 *   add header comment and CVS keywords, bannerDiv element
 *
 */

// declare HTML elements
//main divs - displayed depending on the option selected from nav bar
const navOptionTitle = document.getElementById('navOptionTitle'),
    bannerDiv = document.getElementById("bannerdiv"),
    mainContent = document.getElementById('mainContent'),
    newRegDiv = document.getElementById('newRegDiv'),
    uploadDataDiv = document.getElementById('uploadDataDiv'),
    newQueryDataDiv = document.getElementById('newQueryDataDiv'),
    experimentDiv = document.getElementById('experimentDiv'),
    configureDiv = document.getElementById('configureDiv'),
    infoAreaDiv = document.getElementById('infoAreaDiv'),
//elements for upload data and new query data
    buttons = document.getElementById('buttonsDiv'),
    regionDropDiv = document.getElementById('regionDropDiv'),
    categoryDropDiv = document.getElementById('categoryDropDiv'),
    regList = document.getElementById('regionList'),
    catList = document.getElementById('categoryList'),
    epsgCodeInput = document.getElementById('epsgCodeInput'),
    providerList = document.getElementById('providerList'),
    zoomDiv = document.getElementById('zoomDiv'),
    zoomLevel = document.getElementById('zoomLevelList'),
    queryName = document.getElementById('queryName'),
//elements for results of query
    resultsDiv = document.getElementById('displayResults'),
    queryResultsTbl = document.getElementById('queryResultsTbl'),
    resultsLeftCol = document.getElementById('resultsLeftCol'),
    resultsRightCol = document.getElementById('resultsRightCol'),
    resetResultsBtn = document.getElementById('resetResultsBtn'),
    map = document.getElementById('map'),
    staticMap = document.getElementById('staticMap'),
    queriedRegion = document.getElementById('queriedRegion'),
    queriedCategory = document.getElementById('queriedCategory'),
    queriedProvider = document.getElementById('queriedProvider'),
    saveQueryBtn = document.getElementById('saveQueryBtn'),
//elements for experiment
    targetDataList = document.getElementById('targetDataList'),
    providerListLbl =document.getElementById('providerListLbl'), 
    referenceDataList = document.getElementById('referenceDataList'),
    metricsDiv = document.getElementById('metricsDiv'),
    refDataLbl = document.getElementById('refDataLbl'),
    tarDataLbl = document.getElementById('tarDataLbl'),
    bufferLbl = document.getElementById('bufferLbl'),
    avgDistLbl = document.getElementById('avgDistLbl'),
    completenessLbl = document.getElementById('completenessLbl'),
    densityLbl = document.getElementById('densityLbl'),
    matchCountLbl = document.getElementById('matchCountLbl'),
    matchMap = document.getElementById('matchMap'),
    matchTbl = document.getElementById('matchTbl'),
    resetExperBtn = document.getElementById('resetExperBtn'),
    saveMetricsBtn = document.getElementById('saveMetricsBtn'),
    chooseCenterDiv = document.getElementById('chooseCenterDiv'),
//elements for clean up
    targetDataListDel = document.getElementById('targetDataListDel'),
    delQueryDataDiv = document.getElementById('delQueryDataDiv'),
    targetRelatedDiv = document.getElementById('targetRelatedDiv'),
    targetRelatedTbl = document.getElementById('targetRelatedTbl'),
    delUploadDataDiv = document.getElementById('delUploadDataDiv'),
    referenceDataListDel = document.getElementById('referenceDataListDel'),
    referenceRelatedTbl = document.getElementById('referenceRelatedTbl'),
    referenceRelatedDiv = document.getElementById('referenceRelatedDiv'),
    delExperimentDiv = document.getElementById('delExperimentDiv'),
    experListDel = document.getElementById('experListDel'),
    delRegionDiv = document.getElementById('delRegionDiv'),
    regionRelatedDiv = document.getElementById('regionRelatedDiv'),
    regionRelatedReferencesTbl = document.getElementById('regionRelatedReferencesTbl'),
    regionRelatedTargetsTbl = document.getElementById('regionRelatedTargetsTbl'),
    providerListLblDel =document.getElementById('providerListLblDel'),
    explanationOfRelatedP = document.getElementById('explanationOfRelatedP');

////////// API KEYS /////////////
// GLOBAL VARIABLES set by doGetProviderKeys success //

var keyGoogle = '';
var keyGoogleStat = '';
var keyBing = '';
var keyMQ = '';
var keyHere = { app_id: '', app_code: ''};
