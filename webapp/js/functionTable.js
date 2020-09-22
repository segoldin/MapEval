/*  functionTable.js
 *
 *  Prototype for code to be generated when new online data source
 *  is added to the system. Not currently used.
 *
 * * Copyright 2020 Sally E. Goldin
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
 *  Created by Sally Goldin, 19 November 2018
 *
 *  $Id: functionTable.js,v 1.2 2019/02/15 04:40:34 goldin Exp $
 *  $Log: functionTable.js,v $
 *  Revision 1.2  2019/02/15 04:40:34  goldin
 *  reformat all JS for readability
 *
 *  Revision 1.1  2018/11/19 11:37:44  goldin
 *  testing concept for generated function tables
 *
 */


var gSources = ["Google", "Bing", "HereMaps", "MapQuest", "OSM", "Dummy"];


/* Dummy function just to test the process 
 * normally the source-specific functions will be in source_func.js
 */
function Dummy_func(source, category, center, date)
{
    var infoString = "";
    infoString += "source is " + source + "\n";
    infoString += "category is " + category + "\n";
    infoString += "center is " + center.lat + ", " + center.lng + "\n";
    alert(infoString);
    return true;
}

function Google_func(source, category, center, date)
{
    return 0;
}

function Bing_func(source, category, center, date)
{
    return 1;
}

function Here_func(source, category, center, date)
{
    return 2;
}

function MapQuest_func(source, category, center, date)
{
    return 3;
}

function OSM_func(source, category, center, date)
{
    return 4;
}

var placeFunctions = {
    Google: Google_func,
    Bing: Bing_func,
    HereMaps: Here_func,
    MapQuest: MapQuest_func,
    OSM: OSM_func,
    Dummy: Dummy_func
};


/* General function for getting place information from some source.
 * Arguments:
 *         source   -   must match exactly one of the strings in gSources
 *         category -   one of our API-common category names
 *         center   -   map center lat/long in format {lat: XXX, lng: XXX} 
 *         date     -   ?? why???
 * Ultimately should return a JSON structure of place information
 * or null for an error 
 */
function getPlaces(source, category, center, date)
{
    var theFunction = placeFunctions[source];
    if (theFunction != null)
        return theFunction(category, center, date);
    else
        return null;
}

/* probably will be at least one other general function for
 * roads or linear features */

