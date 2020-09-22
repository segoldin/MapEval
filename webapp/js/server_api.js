/*	$Id: server_api.js,v 1.36 2020/07/21 09:30:32 goldin Exp $
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
 *  This file defines functions that interface with server side code
 *  to retrieve data from or modify the data base. The functions
 *  use Ajax to invoke Perl scripts. The goal is to hide this
 *  complexity from the other parts of the client-side code.
 *
 *  Created by Sally Goldin  on 3 December 2018 
 *
 *   $Log: server_api.js,v $
 *   Revision 1.36  2020/07/21 09:30:32  goldin
 *   only allow shp format
 *
 *   Revision 1.35  2020/07/21 09:21:21  goldin
 *   only support .shp format for upload
 *
 *   Revision 1.34  2019/11/05 07:41:00  goldin
 *   dynamically load API keys; fix minor appearance glitches
 *
 *   Revision 1.33  2019/10/16 07:30:11  goldin
 *   fix problem with report of error on deletion
 *
 *   Revision 1.32  2019/10/15 10:54:23  goldin
 *   allow user to choose map center for roads query data
 *
 *   Revision 1.31  2019/10/15 08:52:08  goldin
 *   refactor to allow user to select image center from map in roads queries
 *
 *   Revision 1.30  2019/09/17 09:19:40  goldin
 *   fix comment on deleteData
 *
 *   Revision 1.29  2019/09/17 08:58:54  goldin
 *   add function to actually do the delete
 *
 *   Revision 1.28  2019/09/11 04:43:19  goldin
 *   add getExperiments API call
 *
 *   Revision 1.27  2019/09/03 10:12:55  goldin
 *   implement getMatchLines
 *
 *   Revision 1.26  2019/06/11 10:11:47  goldin
 *   cleanup interactions
 *
 *   Revision 1.25  2019/05/31 11:47:29  goldin
 *   integrating linear metrics into web site
 *
 *   Revision 1.24  2019/03/06 10:06:42  goldin
 *   Added code to invoke and handle exporting experiment to CSV
 *
 *   Revision 1.23  2019/03/01 10:04:30  goldin
 *   debugging the recalculate operation
 *
 *   Revision 1.22  2019/02/27 09:38:56  goldin
 *   implement recalculate; add global list of points matched so we can delete from the map
 *
 *   Revision 1.21  2019/02/15 10:12:27  goldin
 *   modify to make name matching optional
 *
 *   Revision 1.20  2019/02/15 04:40:34  goldin
 *   reformat all JS for readability
 *
 *   Revision 1.19  2019/01/30 07:28:35  goldin
 *   fix state handling for createUploadData
 *
 *   Revision 1.18  2019/01/28 09:01:43  goldin
 *   add getDataPoints function
 *
 *   Revision 1.17  2019/01/23 10:13:43  goldin
 *   API call for image query upload
 *
 *   Revision 1.16  2019/01/11 12:48:37  goldin
 *   add JS wrappers for calculateMetrics, return matching points, also changed error handling
 *
 *   Revision 1.15  2018/12/29 11:42:19  goldin
 *   add calculateMetrics function
 *
 *   Revision 1.14  2018/12/29 09:13:22  goldin
 *   added getQueryData implementation
 *
 *   Revision 1.13  2018/12/27 10:32:22  goldin
 *   remove getLatestError, change the way coords being sent
 *
 *   Revision 1.12  2018/12/27 08:52:24  goldin
 *   debugging JSON problem
 *
 *   Revision 1.11  2018/12/27 06:55:03  goldin
 *   implemented getUploadData functionality
 *
 *   Revision 1.10  2018/12/27 05:51:59  goldin
 *   working on getUploadData
 *
 *   Revision 1.9  2018/12/27 03:25:18  goldin
 *   implemented getEPSG
 *
 *   Revision 1.8  2018/12/26 10:12:15  goldin
 *   remove encodeURIComponent for upload data creation
 *
 *   Revision 1.7  2018/12/25 08:55:21  aleksandra
 *   save bug fixes
 *
 *   Revision 1.6  2018/12/19 09:21:48  aleksandra
 *   add category to getUploadData
 *
 *   Revision 1.5  2018/12/12 13:15:12  goldin
 *   working on createUploadData functionality
 *
 *   Revision 1.4  2018/12/10 08:49:23  goldin
 *   implementing and testing createRegion, createQueryData
 *
 *   Revision 1.3  2018/12/05 10:39:19  goldin
 *   implementing the client-side interface to server API
 *
 *   Revision 1.2  2018/12/04 08:59:10  aleksandra
 *   added getProvider() and getEPSG() dummy functions
 *
 *   Revision 1.1  2018/12/03 09:01:37  goldin
 *   Interface functions to invoke server side and database capabilities
 *
 *
 *
 */

/**** GLOBAL VRIABLES */
/* Holds results of latest API call */
var gReturnInfo = null;

var gUrl = "http://isan.cpe.kmutt.ac.th/cgi-bin/MapEval/mapevalServer.pl";

/* Constants for different types of deletion */
/* to be used in deleteData() function below */

const QUERY_DETAIL = 1;
const QUERY_DATA = 2;
const DOWNLOAD_DATA = 3;
const EXPERIMENT = 4;
const REGION = 5;

/******************************************************************/
/* Return all stored information about API keys
 *    successfunction - function to call if this function succeeds
 *    errorfunction   - function to call if there is a server side error
 * Returns: gReturnInfo set to array of key objects, null if error.
 */
function getProviderKeys(successfunction, errorfunction)
{
    gReturnInfo = null;
    var requestString = gUrl + "?action=getproviderkeys";
    var request = new XMLHttpRequest();
    request.open("Get", requestString);
    request.send(null);
    // Register a handler to take care of the data on return
    request.onreadystatechange = function ()
    {
        if (request.readyState == 4)
        {
            if (request.status == 200)
            {
                // If we get here, we got a complete valid HTTP response
                var response = request.responseText;
                gReturnInfo = JSON.parse(response);
                if (gReturnInfo.severity)
                {
                    if (errorfunction)
                        errorfunction();
                    return;
                }
                if (successfunction)
                    successfunction();
            }
            else
            {
                alert("Error processing server request 'getProviderKeys'");
            }
        }
    } /* end callback function */
}
 


/* Return information on all categories of data currently supported,
 * including the geographic feature type.
 *    successfunction - function to call if this function succeeds
 *    errorfunction   - function to call if there is a server side error
 * Returns: gReturnInfo set to array of category objects, null if error.
 */
function getCategories(successfunction, errorfunction)
{
    gReturnInfo = null;
    var requestString = gUrl + "?action=categories";
    var request = new XMLHttpRequest();
    request.open("Get", requestString);
    request.send(null);
    // Register a handler to take care of the data on return
    request.onreadystatechange = function ()
    {
        if (request.readyState == 4)
        {
            if (request.status == 200)
            {
                // If we get here, we got a complete valid HTTP response
                var response = request.responseText;
                gReturnInfo = JSON.parse(response);
                if (gReturnInfo.severity)
                {
                    if (errorfunction)
                        errorfunction();
                    return;
                }
                if (successfunction)
                    successfunction();
            }
            else
            {
                alert("Error processing server request 'getRegions'");
            }
        }
    } /* end callback function */
}


/* Return information on all regions current stored in the database
 * Arguments: 
 *    successfunction - function to call if this function succeeds
 *    errorfunction   - function to call if there is a server side error
 * Returns: gReturnInfo set to array of region objects, null if error.
 */
function getRegions(successfunction, errorfunction)
{
    gReturnInfo = null;
    var requestString = gUrl + "?action=regions";
    var request = new XMLHttpRequest();
    request.open("Get", requestString);
    request.send(null);
    // Register a handler to take care of the data on return
    request.onreadystatechange = function ()
    {
        if (request.readyState == 4)
        {
            if (request.status == 200)
            {
                // If we get here, we got a complete valid HTTP response
                var response = request.responseText;
                gReturnInfo = JSON.parse(response);
                if (gReturnInfo.severity)
                {
                    if (errorfunction)
                        errorfunction();
                    return;
                }
                if (successfunction)
                    successfunction();
            }
            else
            {
                alert("Error processing server request 'getRegions'");
            }
        }
    } /* end callback function */
}


/* Return information on all API providers stored in the database
 * that have coverage that includes a specific region
 * Arguments: 
 *    regionid        - integer key to region 
 *    successfunction - function to call if this function succeeds
 *    errorfunction   - function to call if there is a server side error
 * Returns: gReturnInfo set to array of provider objects, null if error.
 */
function getProviders(regionid, successfunction, errorfunction)
{
    gReturnInfo = null;
    var requestString = gUrl + "?action=providers&regionid=" + regionid;
    var request = new XMLHttpRequest();
    request.open("Get", requestString);
    request.send(null);
    // Register a handler to take care of the data on return
    request.onreadystatechange = function ()
    {
        if (request.readyState == 4)
        {
            if (request.status == 200)
            {
                // If we get here, we got a complete valid HTTP response
                var response = request.responseText;
                gReturnInfo = JSON.parse(response);
                if (gReturnInfo.severity)
                {
                    if (errorfunction)
                        errorfunction();
                    return;
                }
                if (successfunction)
                    successfunction();
            }
            else
            {
                alert("Error processing server request 'getProviders'");
            }
        }
    } /* end callback function */
}

/* Return information on all experiments stored in the database
 * that use data from a specific region
 * Arguments: 
 *    regionid        - integer key to region 
 *    successfunction - function to call if this function succeeds
 *    errorfunction   - function to call if there is a server side error
 * Returns: gReturnInfo set to array of experiment objects, null if error.
 */
function getExperiments(regionid, successfunction, errorfunction)
{
    gReturnInfo = null;
    var requestString = gUrl + "?action=experiments&regionid=" + regionid;
    var request = new XMLHttpRequest();
    request.open("Get", requestString);
    request.send(null);
    // Register a handler to take care of the data on return
    request.onreadystatechange = function ()
    {
        if (request.readyState == 4)
        {
            if (request.status == 200)
            {
                // If we get here, we got a complete valid HTTP response
                var response = request.responseText;
                gReturnInfo = JSON.parse(response);
                if (gReturnInfo.severity)
                {
                    if (errorfunction)
                        errorfunction();
                    return;
                }
                if (successfunction)
                    successfunction();
            }
            else
            {
                alert("Error processing server request 'getExperiments'");
            }
        }
    } /* end callback function */
}

/* Return information on all EPSG codes stored in the database
 * Arguments: 
 *    successfunction - function to call if this function succeeds
 *    errorfunction   - function to call if there is a server side error
 * Returns: array of EPSG objects, in the form [{"srid": nnnn},{"srid": nnnn}]
 *    assigned to gReturnInfo
 */
function getEPSG(successfunction, errorfunction)
{
    gReturnInfo = null;
    var requestString = gUrl + "?action=epsg";
    var request = new XMLHttpRequest();
    request.open("Get", requestString);
    request.send(null);
    // Register a handler to take care of the data on return
    request.onreadystatechange = function ()
    {
        if (request.readyState == 4)
        {
            if (request.status == 200)
            {
                // If we get here, we got a complete valid HTTP response
                var response = request.responseText;
                gReturnInfo = JSON.parse(response);
                if (gReturnInfo.severity)
                {
                    if (errorfunction)
                        errorfunction();
                    return;
                }
                if (successfunction)
                    successfunction();
            }
            else
            {
                alert("Error processing server request 'getRegions'");
            }
        }
    } /* end callback function */
}


/* Get header information on all uploaded data sets
 * in the database associated with a specific region and category.
 * Arguments:
 *    regionid      Primary key for the region
 *    category      Name of feature category e.g. "schools"
 *    successfunction - function to call if this function succeeds
 *    errorfunction   - function to call if there is a server side error
 *
 * Returns: array of uploaddata objects, assigned to gReturnInfo
 */
function getUploadData(regionid, category, successfunction, errorfunction)
{
    gReturnInfo = null;
    var requestString = gUrl + "?action=getuploaddata";
    requestString += "&regionid=" + regionid;
    requestString += "&category=" + category;
    var request = new XMLHttpRequest();
    request.open("Get", requestString);
    request.send(null);
    // Register a handler to take care of the data on return
    request.onreadystatechange = function ()
    {
        if (request.readyState == 4)
        {
            if (request.status == 200)
            {
                // If we get here, we got a complete valid HTTP response
                var response = request.responseText;
                gReturnInfo = JSON.parse(response);
                if (gReturnInfo.severity)
                {
                    if (errorfunction)
                        errorfunction();
                    return;
                }
                if (successfunction)
                    successfunction();
            }
            else
            {
                alert("Error processing server request 'getUploadData'");
            }
        }
    } /* end callback function */
}

/* Get header information on all queried data sets
 * in the database associated with a specific region and category.
 * Only returns ones where deleted field is false.
 * Arguments:
 *    regionid      Primary key for the region
 *    category      Name of feature category e.g. "schools"
 *    successfunction - function to call if this function succeeds
 *    errorfunction   - function to call if there is a server side error
 *
 * Returns: array of uploaddata objects, assigned to gReturnInfo
 */
function getQueryData(regionid, category, successfunction, errorfunction)
{
    gReturnInfo = null;
    var requestString = gUrl + "?action=getquerydata";
    requestString += "&regionid=" + regionid;
    requestString += "&category=" + category;
    var request = new XMLHttpRequest();
    request.open("Get", requestString);
    request.send(null);
    // Register a handler to take care of the data on return
    request.onreadystatechange = function ()
    {
        if (request.readyState == 4)
        {
            if (request.status == 200)
            {
                // If we get here, we got a complete valid HTTP response
                var response = request.responseText;
                gReturnInfo = JSON.parse(response);
                if (gReturnInfo.severity)
                {
                    if (errorfunction)
                        errorfunction();
                    return;
                }
                if (successfunction)
                    successfunction();
            }
            else
            {
                alert("Error processing server request 'getQueryData'");
            }
        }
    } /* end callback function */
}

/* Create a new region in the database
 * Arguments:
 *    name      Name of the region (max 256 chars)
 *    x_sw      Longitude of southwest corner of bounding box
 *    y_sw      Latitude of southwest corner of BB
 *    x_ne      Longitude of northeast corner of BB
 *    y_ne      Latitude of northeast corner of BB
 *    successfunction - function to call if this function succeeds
 *    errorfunction   - function to call if there is a server side error
 * Returns: gReturnInfo set a JavaScript object in the same form as a single 
 * region, null if an error occurred.
 */
function createRegion(name, x_sw, y_sw, x_ne, y_ne,
    successfunction, errorfunction)
{
    gReturnInfo = null;
    var requestString = gUrl;
    var formdata = "action=newregion";
    formdata += "&regionname=" + encodeURIComponent(name);
    formdata += "&x_sw=" + x_sw;
    formdata += "&y_sw=" + y_sw;
    formdata += "&x_ne=" + x_ne;
    formdata += "&y_ne=" + y_ne;
    //console.log("formdata is\n" + formdata);
    var request = new XMLHttpRequest();
    request.open("POST", requestString);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
    //request.setRequestHeader("Content-length", formdata.length);
    //request.setRequestHeader("Connection", "close");
    // Register a handler to take care of the data on return
    request.onreadystatechange = function ()
    {
        if (request.readyState == 4)
        {
            var response = request.responseText;
            if ((request.status == 200) || (request.status == 201))
            {
                // If we get here, we got a complete valid HTTP response
                var response = request.responseText;
                gReturnInfo = JSON.parse(response);
                if (gReturnInfo.severity)
                {
                    if (errorfunction)
                        errorfunction();
                    return;
                }
                if (successfunction)
                    successfunction();
            } // end if 200/201 *
            else
            {
                alert("Error processing server request 'createRegion'");
                console.log(response);
            }
        } // end if 4 
    }
    request.send(formdata);
    return true;
}

/* Creates a new upload data source, including adding
 * the geographic information, based on a previously uploaded
 * file of type shp, gml or kml.
 * Arguments:
 *     regionId      DB identifier of the region
 *     name          Name for the data set (256 chars max)
 *     category      Category name, e.g. 'roads', 'schools'.
 *                   Must match a category in the DB
 *     comment       Free text describing the source (512 chars max)
 *                      (may be blank)
 *     filename      Name of file to upload, with path
 *     fileobject    File object returned from the file selection control
 *                       Retrieve as: var fileobject = document.getElementById('filecontrol').files[0];
 *     fileformat    'gml','shp' or 'kml'
 *     spatialref    Numeric SRID of data in the file 
 *                   see https://postgis.net/docs/using_postgis_dbmanagement.html#spatial_ref_sys
 *    successfunction - function to call if this function succeeds
 *    errorfunction   - function to call if there is a server side error
 * Returns: gReturnInfo set a JavaScript object in the same form as a single 
 * region, null if an error occurred.
 */
function createUploadData(regionId, name, category, comment, filename,
    fileobject, fileformat,
    spatialref, successfunction, errorfunction)
{
    gReturnInfo = null;
    var requestString = gUrl;
    var formDataObject = new FormData();
    formDataObject.append('action', 'newuploaddata');
    formDataObject.append('regionid', regionId);
    formDataObject.append('name', name);
    formDataObject.append('category', category);
    formDataObject.append('comment', comment);
    formDataObject.append('fileformat', fileformat);
    formDataObject.append('spatialref', spatialref);
    formDataObject.append('filename', filename);
    formDataObject.append('inputFile', fileobject);
    var request = new XMLHttpRequest();
    request.open("POST", requestString, true);
    request.setRequestHeader("Content-type", "multipart/form-data");
    // Register a handler to take care of the data on return
    request.onreadystatechange = function ()
    {
        if (request.readyState == 4)
        {
            if ((request.status == 200) || (request.status == 201))
            {
                // If we get here, we got a complete valid HTTP response
                var response = request.responseText;
                gReturnInfo = JSON.parse(response);
                if (gReturnInfo.severity)
                {
                    if (errorfunction)
                        errorfunction();
                    return;
                }
                if (successfunction)
                    successfunction();
            } // end if 200/201 *
            else
            {
                alert("Error processing server request 'createUploadData'");
            }
        }
    }
    request.send(formDataObject);
    return true;
}

/* Save (temporarily) the data from a query to a map provider.
 * Arguments:
 *     regionId              Region associated with the query
 *     name                  Text identifying the data set
 *     category              String, one of the values returned by getCategories
 *     provider              Provider name
 *     coords                Array of geographic feature objects. 
 *                           Each one in the form:
 *                              { featureName: 'ABC school',
 *                                 meta: 'any string',
 *                                 lng: 99.23,
 *                                 lat: 9.25}
 *                           featureName and meta can be blank.
 *     successfunction - function to call if this function succeeds
 *     errorfunction   - function to call if there is a server side error
 * Returns: gReturnInfo set a JavaScript object in the same form as a single 
 * query data source returned by getQueryData(), 
 * which can be added to a local query data array, or null if an error occurred.
 */
function createQueryData(regionId, name, category, provider, coords,
    successfunction, errorfunction)
{
    gReturnInfo = null;
    var requestString = gUrl;
    var formDataObject = new FormData();
    formDataObject.append('action', 'newquerydata');
    formDataObject.append('regionid', regionId);
    formDataObject.append('name', name);
    formDataObject.append('category', category);
    formDataObject.append('provider', provider);
    formDataObject.append('coords', JSON.stringify(coords));
    var request = new XMLHttpRequest();
    request.open("POST", requestString, true);
    request.setRequestHeader("Content-type", "multipart/form-data");
    // Register a handler to take care of the data on return
    request.onreadystatechange = function ()
    {
        if (request.readyState == 4)
        {
            var response = request.responseText;
            if ((request.status == 200) || (request.status == 201))
            {
                // If we get here, we got a complete valid HTTP response
                var response = request.responseText;
                gReturnInfo = JSON.parse(response);
                if (gReturnInfo.severity)
                {
                    if (errorfunction)
                        errorfunction();
                    return;
                }
                if (successfunction)
                    successfunction();
            } // end if 200/201 *
            else
            {
                alert("Error processing server request 'createQueryData'");
                console.log(response);
            }
        } // end if 4 
    }
    request.send(formDataObject);
    return true;
}

/* Save the results of a static image URL as an image on the server side.
 * Passed zoom factor and region must match the image url
 * Arguments:
 *     regionId              Region associated with the query
 *     name                  Text identifying the data set
 *     category              String, one of the values returned by getCategories
 *     provider              Provider name
 *     imgurl                Complete url appropriate for provider, region,
 *                              and zoom level
 *     zoom                  Zoom factor
 *     mapcenter             object with lat and lng properties, center of the image
 *     successfunction - function to call if this function succeeds
 *     errorfunction   - function to call if there is a server side error
 * Returns: gReturnInfo set a JavaScript object in the same form as a single 
 * query data source returned by getQueryData(), 
 * which can be added to a local query data array, or null if an error occurred.
 */
function createImageQueryData(regionId, name, category, provider, imgurl, zoom, mapcenter,
    successfunction, errorfunction)
{
    gReturnInfo = null;

    var requestString = gUrl;
    var formDataObject = new FormData();
    formDataObject.append('action', 'newquerydata');
    formDataObject.append('regionid', regionId);
    formDataObject.append('name', name);
    formDataObject.append('category', category);
    formDataObject.append('provider', provider);
    formDataObject.append('imgurl', imgurl);
    formDataObject.append('zoom', zoom);
    formDataObject.append('center_x', mapcenter.lng);
    formDataObject.append('center_y', mapcenter.lat);
    var request = new XMLHttpRequest();
    request.open("POST", requestString, true);
    request.setRequestHeader("Content-type", "multipart/form-data");
    // Register a handler to take care of the data on return
    request.onreadystatechange = function ()
    {
        if (request.readyState == 4)
        {
            var response = request.responseText;
            if ((request.status == 200) || (request.status == 201))
            {
                // If we get here, we got a complete valid HTTP response
                var response = request.responseText;
                gReturnInfo = JSON.parse(response);
                if (gReturnInfo.severity)
                {
                    if (errorfunction)
                        errorfunction();
                    return;
                }
                if (successfunction)
                    successfunction();
            } // end if 200/201 *
            else
            {
                alert("Error processing server request 'createQueryData'");
                console.log(response);
            }
        } // end if 4 
    }
    request.send(formDataObject);
    return true;
}


/* Compare two datasets and calculate the metrics
 * Assumes that both datasets have been stored in the DB
 * Returns results as JSON (actual info TBD)
 * Arguments:
 *    refDataId         Id of reference or standard data set.
 *    refIsQuery        Boolean, true if ref data are from a query,
 *                        false if uploaded.
 *    targetDataId      Id of expermental data set.
 *    targetIsQuery     Boolean, true if target data are from a query,
 *                        false if uploaded.
 *    threshold         Max distance in meters to call two points matched 
 *    nameflag          If true, uses names for point matching as well as distance
 *    recalcflag        If true, this is a recalculation used an edited set of points
 *    matchedpoints     Array of refId-targetId pairs
 *    successfunction - function to call if this function succeeds
 *    errorfunction   - function to call if there is a server side error
 *
 * Returns: results as JSON
 */
function calculateMetrics(refDataId, refIsQuery, targetDataId, targetIsQuery,
			  threshold, nameflag, successfunction, errorfunction)
{
    gReturnInfo = null;
    var requestString = gUrl + "?action=calculatemetrics";
    requestString += "&refdataid=" + refDataId;
    requestString += "&refisquery=" + refIsQuery;
    requestString += "&targetdataid=" + targetDataId;
    requestString += "&targetisquery=" + targetIsQuery;
    requestString += "&threshold=" + threshold;
    requestString += "&nameflag=" + nameflag;
    var request = new XMLHttpRequest();
    request.open("Get", requestString);
    request.send(null);
    // Register a handler to take care of the data on return
    request.onreadystatechange = function ()
    {
        if (request.readyState == 4)
        {
            if (request.status == 200)
            {
                // If we get here, we got a complete valid HTTP response
                var response = request.responseText;
                gReturnInfo = JSON.parse(response);
                if (gReturnInfo.severity)
                {
                    if (errorfunction)
                        errorfunction();
                    return;
                }
                if (successfunction)
                    successfunction();
            }
            else
            {
                alert("Error processing server request 'calculateMetrics'");
            }
        }
    } /* end callback function */
}

/* Recalculate the metrics using points edited/matched by the user
 * Assumes that both datasets have been stored in the DB
 * Returns results as JSON (actual info TBD)
 * Arguments:
 *    refDataId         Id of reference or standard data set.
 *    refIsQuery        Boolean, true if ref data are from a query,
 *                        false if uploaded.
 *    targetDataId      Id of expermental data set.
 *    targetIsQuery     Boolean, true if target data are from a query,
 *                        false if uploaded.
 *    threshold         Max distance in meters to call two points matched 
 *    matchedpoints     Array of refId-targetId pairs
 *    successfunction - function to call if this function succeeds
 *    errorfunction   - function to call if there is a server side error
 *
 * Returns: results as JSON
 */
function recalculateMetrics(refDataId, refIsQuery, targetDataId, targetIsQuery,
			    threshold, matchedpoints, successfunction, errorfunction)
{
    gReturnInfo = null;
    var requestString = gUrl;
    var formDataObject = new FormData();
    formDataObject.append('action', 'calculatemetrics');
    formDataObject.append('refdataid', refDataId);
    formDataObject.append('refisquery', refIsQuery);
    formDataObject.append('targetdataid', targetDataId);
    formDataObject.append('targetisquery', targetIsQuery);
    formDataObject.append('threshold', threshold);
    formDataObject.append('recalcflag','true');
    formDataObject.append('matchedpoints', JSON.stringify(matchedpoints));
    var request = new XMLHttpRequest();
    request.open("POST", requestString, true);
    request.setRequestHeader("Content-type", "multipart/form-data");
    // Register a handler to take care of the data on return
    request.onreadystatechange = function ()
    {
        if (request.readyState == 4)
        {
            var response = request.responseText;
            if ((request.status == 200) || (request.status == 201))
            {
                // If we get here, we got a complete valid HTTP response
                var response = request.responseText;
                gReturnInfo = JSON.parse(response);
                if (gReturnInfo.severity)
                {
                    if (errorfunction)
                        errorfunction();
                    return;
                }
                if (successfunction)
                    successfunction();
            } // end if 200/201 *
            else
            {
                alert("Error processing server request 'recalculateMetrics'");
                console.log(response);
            }
        } // end if 4 
    }
    request.send(formDataObject);
    return true;
}



/* Get results from point matching in an experiment
 * Returns results as JSON 
 * Arguments:
 *    experimentid      The ID of the experiment created from calling calculated metrics
 *    successfunction - function to call if this function succeeds
 *    errorfunction   - function to call if there is a server side error
 *
 * Returns: data comparing reference points and matched target points
 */
function getMatchPoints(experimentid, successfunction, errorfunction)
{
    gReturnInfo = null;
    var requestString = gUrl + "?action=getmatchpoints";
    requestString += "&experimentid=" + experimentid;
    var request = new XMLHttpRequest();
    request.open("Get", requestString);
    request.send(null);
    // Register a handler to take care of the data on return
    request.onreadystatechange = function ()
    {
        if (request.readyState == 4)
        {
            if (request.status == 200)
            {
                // If we get here, we got a complete valid HTTP response
                var response = request.responseText;
                gReturnInfo = JSON.parse(response);
                if (gReturnInfo.severity)
                {
                    if (errorfunction)
                        errorfunction();
                    return;
                }
                if (successfunction)
                    successfunction();
            }
            else
            {
                alert("Error processing server request 'getMatchPoints'");
            }
        }
    } /* end callback function */
}

/* Get reference and experimental linestrings for display
 * Returns results as GeoJSON line strings, in long/lat coordinates  
 * Arguments:
 *    experimentid      The ID of the experiment created from calling calculated metrics
 *    successfunction - function to call if this function succeeds
 *    errorfunction   - function to call if there is a server side error
 *
 * Returns: GeoJSON structure with reference and extracted target features.
 */
function getMatchLines(experimentid, successfunction, errorfunction)
{
    gReturnInfo = null;
    var requestString = gUrl + "?action=getmatchlines";
    requestString += "&experimentid=" + experimentid;
    var request = new XMLHttpRequest();
    request.open("Get", requestString);
    request.send(null);
    // Register a handler to take care of the data on return
    request.onreadystatechange = function ()
    {
        if (request.readyState == 4)
        {
            if (request.status == 200)
            {
                // If we get here, we got a complete valid HTTP response
                var response = request.responseText;
                gReturnInfo = JSON.parse(response);
                if (gReturnInfo.severity)
                {
                    if (errorfunction)
                        errorfunction();
                    return;
                }
                if (successfunction)
                    successfunction();
            }
            else
            {
                alert("Error processing server request 'getMatchPoints'");
            }
        }
    } // end callback function 
}


/* Export the results of an experiment as a CSV vile
 * Returns results as JSON - 'csvfile' has link to the file which can be downloaded
 * Arguments:
 *    experimentid      The ID of the experiment whose data we watn
 *    successfunction - function to call if this function succeeds
 *    errorfunction   - function to call if there is a server side error
 *    isline          - optional - if we are exporting the results of linear features
 *
 * Returns: link to CSV file on server
 */
function exportMetrics(experimentid, successfunction, errorfunction,isline)
{
    gReturnInfo = null;
    var requestString = gUrl + "?action=exportmetrics";
    requestString += "&experimentid=" + experimentid;
    if (isline)
	{
	requestString += "&lineflag=" + isline;
	}
    var request = new XMLHttpRequest();
    request.open("Get", requestString);
    request.send(null);
    // Register a handler to take care of the data on return
    request.onreadystatechange = function ()
    {
        if (request.readyState == 4)
        {
            if (request.status == 200)
            {
                // If we get here, we got a complete valid HTTP response
                var response = request.responseText;
                gReturnInfo = JSON.parse(response);
                if (gReturnInfo.severity)
                {
                    if (errorfunction)
                        errorfunction();
                    return;
                }
                if (successfunction)
                    successfunction();
            }
            else
            {
                alert("Error processing server request 'getQueryData'");
            }
        }
    } /* end callback function */
}


/* Get raw point values from the database for an upload or query data set
 * Returns results as JSON 
 * Arguments:
 *    dataid            The database ID of the point dataset to be retrieved
 *    dataisquery       "true" if this is a set from a provider query, "false"
 *                      if it comes from an upload
 *    successfunction - function to call if this function succeeds
 *    errorfunction   - function to call if there is a server side error
 *
 * Returns: data set (JSON) with point coordinates and names
 */
function getDataPoints(dataid, dataisquery, successfunction, errorfunction)
{
    gReturnInfo = null;
    var requestString = gUrl + "?action=getdatapoints";
    requestString += "&dataid=" + dataid;
    requestString += "&dataisquery=" + dataisquery;
    var request = new XMLHttpRequest();
    request.open("Get", requestString);
    request.send(null);
    // Register a handler to take care of the data on return
    request.onreadystatechange = function ()
    {
        if (request.readyState == 4)
        {
            if (request.status == 200)
            {
                // If we get here, we got a complete valid HTTP response
                var response = request.responseText;
                gReturnInfo = JSON.parse(response);
                if (gReturnInfo.severity)
                {
                    if (errorfunction)
                        errorfunction();
                    return;
                }
                if (successfunction)
                    successfunction();
            }
            else
            {
                alert("Error processing server request 'getQueryData'");
            }
        }
    } /* end callback function */
}

/* Deletes some subset of data from the database.
 * Arguments:
 *   mode        Specifies what category of data should be deleted
 *   dataid       Unique DB ID of the data to be deleted
 *
 *              Interpreted based on mode:
 *              1 - query data details (points or lines)
 *              2 - entire query data set
 *              3 - entire download data set
 *              4 - a single experiment
 *              5 - a region 
 *              (use const vars defined at top of this module)
 *    successfunction - function to call if this function succeeds
 *    errorfunction   - function to call if there is a server side error
 *
 * Returns: JSON object with success or failure message
 */
function deleteData(mode, dataid, successfunction, errorfunction)
{
    gReturnInfo = null;
    var requestString = gUrl + "?action=deletedata";
    requestString += "&mode=" + mode;
    requestString += "&dataid=" + dataid;
    var request = new XMLHttpRequest();
    request.open("Get", requestString);
    request.send(null);
    // Register a handler to take care of the data on return
    request.onreadystatechange = function ()
    {
        if (request.readyState == 4)
        {
            if (request.status == 200)
            {
                // If we get here, we got a complete valid HTTP response
                var response = request.responseText;
                gReturnInfo = JSON.parse(response);
                if (gReturnInfo.severity != 'SUCCESS')
                {
                    if (errorfunction)
                        errorfunction();
                    return;
                }
                if (successfunction)
                    successfunction();
            }
            else
            {
                alert("Error processing server request 'DeleteData'");
            }
        }
    } /* end callback function */
}

