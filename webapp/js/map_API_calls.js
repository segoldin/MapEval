/*  $Id: map_API_calls.js,v 1.63 2020/07/22 07:26:11 goldin Exp $
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
 *  This file contains code to call provider specific APIs and display the results.
 *
 *   Created by Aleksandra Magdziarek on 6 Dec 2018
 *
 *   $Log: map_API_calls.js,v $
 *   Revision 1.63  2020/07/22 07:26:11  goldin
 *   Use 'worship' externally. HERE actually calls its category 'temples'
 *
 *   Revision 1.62  2019/11/19 20:16:43  aleksandra
 *   modify resetMapAndTable() to be used instead of resetExperResult()
 *
 *   Revision 1.61  2019/11/05 07:41:00  goldin
 *   dynamically load API keys; fix minor appearance glitches
 *
 *   Revision 1.60  2019/11/05 04:27:30  goldin
 *   fix GeoJSON bounding box display
 *
 *   Revision 1.59  2019/10/23 10:54:02  aleksandra
 *   fix for GeoJSON problem in selectCenter()
 *
 *   Revision 1.58  2019/10/21 11:08:27  goldin
 *   working on display of reference data extent on map in selectCenter function
 *
 *   Revision 1.57  2019/10/15 10:54:23  goldin
 *   allow user to choose map center for roads query data
 *
 *   Revision 1.56  2019/10/15 08:52:08  goldin
 *   refactor to allow user to select image center from map in roads queries
 *
 *   Revision 1.55  2019/10/03 11:57:38  aleksandra
 *   minor changes
 *
 *   Revision 1.54  2019/09/10 09:25:31  aleksandra
 *   *** empty log message ***
 *
 *   Revision 1.53  2019/09/08 12:18:22  aleksandra
 *   fixed google static url
 *
 *   Revision 1.52  2019/09/03 10:13:48  goldin
 *   create function to calculate box size for all providers
 *
 *   Revision 1.51  2019/08/27 09:08:29  goldin
 *   make box size contingent on zoom
 *
 *   Revision 1.50  2019/08/26 09:42:26  goldin
 *   draw a box on the static map
 *
 *   Revision 1.49  2019/05/31 11:47:29  goldin
 *   integrating linear metrics into web site
 *
 *   Revision 1.48  2019/03/22 06:04:15  goldin
 *   add highlight capability
 *
 *   Revision 1.47  2019/02/15 04:40:34  goldin
 *   reformat all JS for readability
 *
 *   Revision 1.46  2019/01/31 10:39:42  aleksandra
 *   minor changes, changes to here_func
 *
 *   Revision 1.45  2019/01/30 08:03:51  aleksandra
 *   removed limit on results number in Here_func
 *
 *   Revision 1.44  2019/01/30 04:27:25  aleksandra
 *   solved Bing maps issue, points display on leaflet map
 *
 *   Revision 1.43  2019/01/29 10:06:36  aleksandra
 *   experiment display: added lines, colors for ref and target, match count; cut decimal places; keys as global variables; reset exp results; changes in successGetUploadData and successGetQueryData
 *
 *   Revision 1.42  2019/01/29 03:23:44  aleksandra
 *   Google POI search fixed, Bing partially fixed
 *
 *   Revision 1.41  2019/01/28 10:25:38  aleksandra
 *   added reset for experiment results, minor changes in the way results display
 *
 *   Revision 1.40  2019/01/28 03:30:31  aleksandra
 *   changes to do with Experiment and displaying metrics calculations
 *
 *   Revision 1.39  2019/01/25 03:35:52  aleksandra
 *   implemented doCreateImageQueryData()
 *
 *   Revision 1.38  2019/01/25 03:00:07  aleksandra
 *   changes to display zoom dropdown onchange of category in new query data
 *
 *   Revision 1.37  2019/01/24 09:19:04  aleksandra
 *   fixed switching between road features and points, removing previous maps
 *
 *   Revision 1.36  2019/01/24 08:40:41  aleksandra
 *   added removing leaflet map onclick New Query button in New Query Data results
 *
 *   Revision 1.35  2019/01/24 08:37:37  aleksandra
 *   added removing leaflet map onclick New Query button in New Query Data results
 *
 *   Revision 1.34  2019/01/23 10:39:37  aleksandra
 *   added leaflet map, markers and marker popups with names of places for OSM and MapQuest
 *
 *   Revision 1.33  2019/01/23 08:44:11  aleksandra
 *   added markers to here maps
 *
 *   Revision 1.32  2019/01/23 05:49:35  aleksandra
 *   fixed google problems: map is fit to bounding box and displays clickable markers
 *
 *   Revision 1.31  2019/01/22 10:59:58  aleksandra
 *   changes to do with static maps implementation
 *
 *   Revision 1.30  2019/01/22 07:20:06  aleksandra
 *   added zoom value doe road features and URLs for static map images
 *
 *   Revision 1.29  2019/01/15 12:38:49  aleksandra
 *   added google and bing roads query to newquerydata
 *
 *   Revision 1.28  2019/01/14 06:48:37  aleksandra
 *   added infowindow for onclick events for markers
 *
 *   Revision 1.27  2019/01/04 04:13:12  aleksandra
 *   fixed Bing Europe coordinate issue
 *
 *   Revision 1.26  2019/01/04 03:49:24  aleksandra
 *   fixed OSM temples and postoffices category keys
 *
 *   Revision 1.25  2019/01/03 10:42:12  aleksandra
 *   Bing and MapQuest debugging
 *
 *   Revision 1.24  2018/12/28 04:49:41  aleksandra
 *   added Bing EU and minor changes
 *
 *   Revision 1.23  2018/12/28 03:02:25  aleksandra
 *   added working BingEU function
 *
 *   Revision 1.20  2018/12/26 13:02:11  aleksandra
 *   fixed google categories search, new mapCenter variable, fixed MapQuest, Bing map display
 *
 *   Revision 1.19  2018/12/26 03:23:30  aleksandra
 *   added regex to eliminate html tags in query data
 *
 *   Revision 1.18  2018/12/25 11:29:54  aleksandra
 *   changes to do with creating new query data
 *
 *   Revision 1.16  2018/12/25 06:55:48  aleksandra
 *   fixed map displays for Google, MapQuest, Here; displaying place markers with Google API
 *
 *   Revision 1.15  2018/12/24 12:14:58  aleksandra
 *   added section displaying results
 *
 *   Revision 1.14  2018/12/24 10:21:17  aleksandra
 *   major changes to the display of query results display
 *
 *   Revision 1.13  2018/12/23 09:31:25  aleksandra
 *   updated categories and providers names to match the DB values
 *
 *   Revision 1.11  2018/12/20 09:13:37  aleksandra
 *   getting bounding box works, added icon buttons to editable table
 *
 *   Revision 1.10  2018/12/19 10:13:06  aleksandra
 *   made table editable
 *
 *   Revision 1.9  2018/12/19 03:37:32  aleksandra
 *   made table editable
 *
 *   Revision 1.8  2018/12/13 08:20:02  aleksandra
 *   fixed Google API call to return up to 60results (its max)
 *
 *   Revision 1.7  2018/12/12 10:14:33  aleksandra
 *   added functions to get data from server
 *
 *   Revision 1.6  2018/12/11 04:47:21  aleksandra
 *   added object contructor to pack query results in a JSON to send to the database
 *
 *   Revision 1.5  2018/12/10 10:18:07  aleksandra
 *   added pseudocode, added metadata to the table
 *
 *   Revision 1.4  2018/12/10 08:29:12  aleksandra
 *   added input validation
 *
 *   Revision 1.3  2018/12/10 05:27:38  aleksandra
 *   abstracted addRow function for all providers, all return results now
 *
 *   Revision 1.1  2018/12/06 10:29:06  aleksandra
 *   file that will hold all API calls
 *
 *
 *
 */

"use strict"


// populate the HTML table with map query responses -the same for all providers
function addRow(placeName, latitude, longitude, metadata, index)
{
    //append rows and cells to the empty html table
    var row = document.createElement("tr"),
        cellName = document.createElement("td"),
        cellLat = document.createElement("td"),
        cellLng = document.createElement("td"),
        cellMeta = document.createElement("td"),
        cellEdit = document.createElement("td");

    //make sure there are no HTML tags in the data passed to the server
    if (metadata != null)
    {
        let regex1 = /<\S*>/gi;
        metadata = metadata.replace(regex1, '');
        placeName = placeName.replace(regex1, '');
    }

    //create content to put inside cells
    var txtName = document.createTextNode(placeName),
        txtLat = document.createTextNode(latitude),
        txtLng = document.createTextNode(longitude),
        txtMeta = document.createTextNode(metadata),
        //create buttons
        btnEdit = document.createElement("button"),
        btnRemove = document.createElement("button"),
        //spans that hold icons to be put inside buttons
        spanBtnEdit = document.createElement("span"),
        spanBtnRemove = document.createElement("span");
    //style buttons
    btnEdit.className = "btn btn-default btn-sm";
    btnRemove.className = "btn btn-default btn-sm";

    //style for spans - get Bootstrap Glyphicon icons
    spanBtnEdit.className = "glyphicon glyphicon-pencil";
    spanBtnRemove.className = "glyphicon glyphicon-trash";

    //set row id to reference it when editing and removing
    row.setAttribute("id", 'row' + index);
    btnEdit.setAttribute("id", index);
    //function for button edit table row 
    btnEdit.onclick = function (e)
    {
        //make the name of corresponding place editable
        let theRow = document.getElementById('row' + btnEdit.id);
        theRow.childNodes[0].setAttribute("contenteditable", true);
        theRow.childNodes[0].style.color = '#f44336';
        theRow.childNodes[0].style.border = "w3-border w3-hover-border-red";
    }
    //button remove table row
    btnRemove.setAttribute("type", "button");
    btnRemove.setAttribute("id", index);
    btnRemove.onclick = function (e)
    {
        queryResultsTbl.removeChild(document.getElementById('row' + btnRemove.id));
    }

    //append content to cells of table
    cellName.appendChild(txtName);
    cellLat.appendChild(txtLat);
    cellLng.appendChild(txtLng);
    cellMeta.appendChild(txtMeta);
    cellEdit.appendChild(btnEdit);
    cellEdit.appendChild(btnRemove);

    //append icon spans to the buttons
    btnEdit.appendChild(spanBtnEdit);
    btnRemove.appendChild(spanBtnRemove);

    //append cells to the current row in table
    row.appendChild(cellName);
    row.appendChild(cellLat);
    row.appendChild(cellLng);
    row.appendChild(cellMeta);
    row.appendChild(cellEdit);
    queryResultsTbl.appendChild(row);
}

//add marker representing POI to Leaflet map, common for all providers
function addMarker(placeName, latitude, longitude, leafletMap)
{
    //style for the marker
    var style = {
        radius: 5,
        fillColor: "red",
        color: "#fc9272",
        weight: 1,
        opacity: 1,
        fillOpacity: 1,
    };
    //append marker to map, add popup with place name
    L.circleMarker([latitude, longitude], style).addTo(leafletMap)
        .bindPopup(placeName);
}


/* Refactor to split processing of query data, so we can interject selection of map center
 * if the user does not want to use the default.
 * Arguments
 *      mapCenter - object with lat,lng properties, region center
 *      boundingBox - array of two lat,lng pairs, sw corner and ne corner of region.
 *      category   - category as string
 *      provide   -  provider as string
 *      regionName - region name as string
 *      regionId   - region Id
 *      name       - name to use for the query dataset
 *      radius     - radius of the display area
 *      zoom       - zoom level (only for roads)
 */
function continueDisplayResultsTbl(mapCenter,boundingBox,category,provider,regionName,regionId,name,radius,zoom)
{
    //get display ready - clear irrelevant divs
    clearPrevious();

    //uncover the divs where results are shown
    resultsDiv.style.display = '';
    queryResultsTbl.style.display = '';
    
    //display user's selection
    queriedRegion.innerHTML = "Queried region: " + regionName;
    queriedCategory.innerHTML = "Queried category: " + category;
    queriedProvider.innerHTML = "Queried provider: " + provider;
    queryName.innerHTML = "Name of saved data: " + name;
	
    saveQueryBtn.style.display = '';
    //attach an event to saveQuery button 
    saveQueryBtn.onclick = function (e)
    {
	//send query results to server
	if (category !== "roads")
        {
	    doCreateQueryData(regionId, name, category, provider);
        }
	else if (category == "roads")
        {
	    var urlStatic = staticMap.getAttribute("src");
	    doCreateImageQueryData(regionId, name, category, provider, urlStatic, zoom, mapCenter);
        }
    }
    //event for new query button - remove table with results from previous query and reset all input
    resetResultsBtn.style.display = '';
    resetResultsBtn.onclick = function (e)
    {
	resetMapAndTable(leafletMap, queryResultsTbl);
	newQueryData();
	resetDropdowns();
    }
      
    //depending on which provider and category selected, call relevant function
    if (category !== "roads")
    {
        //initialize Leaflet map
        var leafletMap = L.map('map').setView([mapCenter.lat, mapCenter.lng], 13);
	var mapLink =
	    '<a href="http://openstreetmap.org">OpenStreetMap</a>';
	L.tileLayer(
		    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	       {
		   attribution: '© ' + mapLink + ' Contributors',
		   maxZoom: 18,
	       }).addTo(leafletMap);
	L.control.scale().addTo(leafletMap);
	//set bounds of the map display to bounding box of the region
	leafletMap.fitBounds([
			      [boundingBox[0].lat, boundingBox[0].lng],
			      [boundingBox[1].lat, boundingBox[1].lng]
			      ]);
	setWait();
	if (provider === "Google")
        {
	    //call function Google_func
	    Google_func(category, mapCenter, boundingBox, leafletMap);
	}
	else if (provider === "Here")
        {
	    //call function Here_func
	    Here_func(category, mapCenter, boundingBox, leafletMap);
	}
	else if (provider === "MapQuest outside North America")
        {
	    //call function MapQuest_func
	    MapQuest_func(category, mapCenter, boundingBox, leafletMap);
	}
	else if (provider === "MapQuest North America")
	{
	    //call function MapQuestNAm_func
	    MapQuestNAm_func(category, mapCenter, boundingBox, leafletMap);
	}
	else if (provider === "Bing North America")
        {
	    //call function Bing_func
	    BingNAm_func(category, mapCenter, boundingBox, radius, leafletMap);
	}
	else if (provider === "Bing Europe")
        {
	    BingEU_func(category, mapCenter, boundingBox, radius, leafletMap)
	}
	else if (provider === "OSM")
        {
	    //call function OSM_func
	    OSM_func(category, mapCenter, boundingBox, leafletMap);
	}
    }
    else if (category == "roads")
    {
	setWait();
	if (provider == "Google")
        {
	    Google_roads(mapCenter, zoom);
	    queryResultsTbl.style.display = 'none';
        }
	else if (provider == "Here")
        {
	    Here_roads(mapCenter, zoom);
	    queryResultsTbl.style.display = 'none';
        }
	else if (provider == "Bing North America" || provider == "Bing Europe")
        {
	    Bing_roads(mapCenter, zoom);
	    queryResultsTbl.style.display = 'none';
        }
	else if (provider == "MapQuest outside North America" || provider == "MapQuest North America")
        {
	    MapQuest_roads(mapCenter, zoom);
	    queryResultsTbl.style.display = 'none';
        }
    }
}


/* display a map of the region and allow the user
 * to choose a center for road image. Called
 * when the user clicks the query data button
 * if 'roads' has been selected and the
 * user wants to select a center.
 * Arguments
 *      mapCenter - object with lat,lng properties, region center
 *      boundingBox - array of two lat,lng pairs, sw corner and ne corner of region.
 *      category   - category as string
 *      provide   -  provider as string
 *      regionName - region name as string
 *      regionId   - data base Id for region
 *      name       - name to use for the query dataset
 *      radius     - radius of the display area
 *      zoom       - zoom level (only for roads)
 * Most of these arguments are simply passed on to continueDisplayResultsTbl
 */
function selectCenter(mapCenter,boundingBox,category,provider,regionName,regionId,name,radius,zoom)
{
    clearPrevious();
    var newMapCenter = mapCenter;
    document.getElementById("selectCenterDiv").style.display = "";

    var regionObject =  gRegions.filter(region => region.id == regionId)[0];
    var bbPoly = regionObject.databb;
    //console.log("Region BB: " + bbPoly.geometry.type + " " + bbPoly.geometry.coordinates[0] + "|" + bbPoly.geometry.coordinates[1]);
   
    var leafletMap = L.map('selectMap').setView([mapCenter.lat, mapCenter.lng], 13);
    var mapLink =
	'<a href="http://openstreetmap.org">OpenStreetMap</a>';
    L.tileLayer(
                'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                {
                    attribution: '© ' + mapLink + ' Contributors',
			maxZoom: 18,
			}).addTo(leafletMap);
    L.control.scale().addTo(leafletMap);
    //set bounds of the map display to bounding box of the region
    leafletMap.fitBounds([
			  [boundingBox[0].lat, boundingBox[0].lng],
			  [boundingBox[1].lat, boundingBox[1].lng]
			  ]);
    var centerMarker = L.marker([mapCenter.lat, mapCenter.lng]);
    centerMarker.bindTooltip(centerMarker.getLatLng().lat + ", " + centerMarker.getLatLng().lng);
    centerMarker.addTo(leafletMap);

    if (bbPoly)
    {
       var layer = L.geoJSON(bbPoly);
       layer.addTo(leafletMap);
    }


    leafletMap.on('click',function(e)
		  {
		  newMapCenter.lat = e.latlng.lat;
		  newMapCenter.lng = e.latlng.lng;
		  centerMarker.setLatLng([e.latlng.lat,e.latlng.lng]);
		  centerMarker.bindTooltip(centerMarker.getLatLng().lat + ", " + centerMarker.getLatLng().lng);
                  });

    document.getElementById("selectCenterBtn").onclick = function(e)
    {
	leafletMap.remove();
	document.getElementById("selectCenterDiv").style.display = "none";
	continueDisplayResultsTbl(newMapCenter,boundingBox,category,provider,regionName,regionId,name,radius,zoom);
    };

    document.getElementById("cancelCenterBtn").onclick = function(e)
    {
	leafletMap.remove();
	document.getElementById("selectCenterDiv").style.display = "none";
	continueDisplayResultsTbl(mapCenter,boundingBox,category,provider,regionName,regionId,name,radius,zoom);
    };
}


//main function that calls all other functions: initialize map, perform search and return a table.  
function displayResultsTbl()
{

    //get values needed for the query 
    var category = catList.value,
        provider = providerList.value,
        regionId = regList.value,
        zoom = zoomLevel.value;

    //if any of the values are missing alert the user
    if (category == '0' || provider == '0' || regionId == '0')
    {
        alert('Please enter all required values.');
        //otherwise proceed to the query
    }
    else if (category == 'roads' && zoom == '0')
    {
        alert('Please select zoom value. The higher the zoom value, the larger the map scale.');
    }
    else
    {

        //obtain other values needed for the query
        var queriedRegObj = gRegions.filter(region => region.id == regionId)[0],
            mapCenterObj = queriedRegObj.center,
            boundingBox = [
            {
                lat: parseFloat(queriedRegObj.y_sw),
                lng: parseFloat(queriedRegObj.x_sw)
            },
            {
                lat: parseFloat(queriedRegObj.y_ne),
                lng: parseFloat(queriedRegObj.x_ne)
            }],
            mapCenter = {
                lat: parseFloat(mapCenterObj.lat),
                lng: parseFloat(mapCenterObj.lng)
            },
            regionName = queriedRegObj.name,
            radius = parseFloat(queriedRegObj.radius);

        //generate the name for the query data 
	var name = regionName + ' ' + category;
	if (category == 'roads')
	    name = name + ' (Zoom: ' + zoom + ') ' + provider;
	else
	    name = name + ' ' +  provider;

	var radio = document.getElementById("choosecenter");
	var center = null;
	if ((category == 'roads') && (radio.checked))
	{
	    selectCenter(mapCenter,boundingBox,category,provider,regionName,regionId,name,radius,zoom);
	}
	else
	{
	    continueDisplayResultsTbl(mapCenter,boundingBox,category,provider,regionName,regionId,name,radius,zoom);
	}
    }
}



//////////////////////////
//  POINTS OF INTEREST ///
//////////////////////////

//call Google Maps API
function Google_func(category, mapCenter, boundingBox, leafletMap)
{
    //an empty div needed for PlacesService
    var poiMap = document.getElementById('googlePoiMap');

    //google needs singular nouns for categories, otherwise it returns all sorts of places ignoring the category
    if (category == 'schools')
    {
        category = 'school';
    }
    else if (category == 'hospitals')
    {
        category = 'hospital';
    }
    else if (category == 'worship')
    {
        category = 'church';
    }
    else if (category == 'postoffices')
    {
        category = 'post_office';
    }

    var boundingBoxGoogle = new google.maps.LatLngBounds(boundingBox[0], boundingBox[1]);
    var getNextPage = null;
    // Create the places service.
    var service = new google.maps.places.PlacesService(poiMap);
    //initialize search method
    service.nearbySearch(
        {
            type: category,
            bounds: boundingBoxGoogle
        },


        //get search response, create markers and populate the table with results
        function (response, status, pagination)
        {
            //if response is successfully returned
            if (status === google.maps.places.PlacesServiceStatus.OK)
            {
                //google returns 20 results at once, 60 max after 2 additional calls.
                //check if there is another page of results, if so, get it
                getNextPage = pagination.hasNextPage && function ()
                {
                    pagination.nextPage();
                }
                if (getNextPage)
                {
                    getNextPage();
                }
                //create an empty array to hold query results
                for (var index in response)
                {
                    var place = response[index];
                    //get name, coordinates and metadata from response
                    var placeName = place.name,
                        latitude = place.geometry.location.lat(),
                        longitude = place.geometry.location.lng(),
                        metadata = place.vicinity;
                    // populate the table with search response: name of place, latitude, longitude, date of search
                    addRow(placeName, latitude, longitude, metadata, index);
                    addMarker(placeName, latitude, longitude, leafletMap);
                }
            }
	    removeWait();
        }
    );

}
//end of Google API call

//call Here Map API
function Here_func(category, mapCenter, boundingBox, leafletMap)
{

    //create a platform object to enter credentials for authentication
    var platform = new H.service.Platform(keyHere);
    if (category = 'worship')
	category = 'temples';
    // HERE actually calls its category temples!

    //The rectangle spanning the area is specified in the WGS 84 coordinate system as four comma-separated values in the following order: west lng, south lat, east lng, north lat. 
    var boundingBox_Here = [boundingBox[0].lng, boundingBox[0].lat, boundingBox[1].lng, boundingBox[1].lat].toString();

    //declare the link for http request
    //app_id is stored in platform object under key "l" and code under key "i" - hence the variables in the url
    var url = "https://places.cit.api.here.com/places/v1/discover/search?size=500&in=" + boundingBox_Here + "&q=" + 
        category + "&app_id=" + platform.l + "&app_code=" + platform.i;

    //make http request to query places
    const Http = new XMLHttpRequest();
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = function ()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            //parse response to a place variable and parse it to JSON
            var places = JSON.parse(Http.responseText);
            var place = places.results.items;
            //create an empty array to hold query results
            //for each place found get name and position
            for (let index in place)
            {
                var placeName = place[index].title,
                    latitude = place[index].position[0],
                    longitude = place[index].position[1],
                    metadata = ['address: ' + place[index].vicinity].toString();
                //populate the table with results
                addRow(placeName, latitude, longitude, metadata, index);
                addMarker(placeName, latitude, longitude, leafletMap);
            }
        }
	removeWait();
    }
}
//end of Here API call


//call OpenStreetMap API
function OSM_func(category, mapCenter, boundingBox, leafletMap)
{

    if (category == 'hospitals')
    {
        category = 'hospital';
    }
    else if (category == 'postoffices')
    {
        category = 'amenity=post_office';
    }
    else if (category == 'schools')
    {
        category = 'school';
    }
    else if (category == 'worship')
    {
        category = 'amenity=place_of_worship';
    }

    //the url doesn't allow commas so change the format of the bounding box: 
    var commaRegex = /,/gi;
    var boundingBox_OSM = [boundingBox[0].lng, boundingBox[0].lat, boundingBox[1].lng, boundingBox[1].lat].toString().replace(commaRegex, '%2C');
    //construct url for http request
    const url = 'http://nominatim.openstreetmap.org/search.php?format=json&q=[' + category + ']&bounded=1&limit=500&viewbox=' + boundingBox_OSM + '&limit=10000';

    //make http request to query places
    const Http = new XMLHttpRequest();
    Http.open("GET", url);
    Http.send();

    //if search is successful then process response
    Http.onreadystatechange = function ()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            var place = JSON.parse(Http.responseText);
            //for each place found get the name and location
            for (let index in place)
            {
                var placeName = place[index].display_name,
                    latitude = place[index].lat,
                    longitude = place[index].lon,
                    metadata = null;
                //populate the table with results
                addRow(placeName, latitude, longitude, metadata, index);
                addMarker(placeName, latitude, longitude, leafletMap);
            }
        }
	removeWait();
    }
}
//end of OSM API call


//MapQuest API call
function MapQuest_func(category, mapCenter, boundingBox, leafletMap)
{

    //this variable stores a dictionary of values corresponding with MQ categories of places
    var cat_code = {
        'schools': '821103',
        'hospitals': '806202',
        'worship': '866107',
        'postoffices': '431101'
    };

    //prepare variables for URL
    var boundingBox_MQ = [boundingBox[0].lat, boundingBox[0].lng, boundingBox[1].lat, boundingBox[1].lng].toString();
    var key = keyMQ;

    //create URL for http request
    const url = 'https://www.mapquestapi.com/search/v2/rectangle?boundingBox=' + boundingBox_MQ + '&maxMatches=500&ambiguities=ignore&hostedData=mqap.internationalpois|navsics=?|' + cat_code[category] + '&outFormat=json&key=' + key;
    //make http request to query places
    const Http = new XMLHttpRequest();
    Http.open("GET", url);
    Http.send();

    //if request is successful use the data to populate the html table in index.html
    Http.onreadystatechange = function ()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            //parse response to a place variable and parse it to JSON
            var places = JSON.parse(Http.responseText);
            var place = places.searchResults;
            //create an empty array to hold query results
            var coords = [];
            //for each place found get the name, location and metadata
            for (let index in place)
            {
                var placeName = place[index].fields.name,
                    latitude = place[index].shapePoints[0],
                    longitude = place[index].shapePoints[1],
                    metadata = ['address: ' + place[index].fields.address + 'phone: ' + place[index].fields.phone + 'postal_code: ' + place[index].fields.postal_code].toString();
                //populate the table with results
                addRow(placeName, latitude, longitude, metadata, index);
                addMarker(placeName, latitude, longitude, leafletMap);
            }
        }
	removeWait();
    }
}
//end of MapQuest API call


//MapQuest API for North America API call
function MapQuestNAm_func(category, mapCenter, boundingBox, leafletMap)
{

    //this variable stores a dictionary of values corresponding with MQ categories of places
    var cat_code = {
        'schools': '821103',
        'hospitals': '806202',
        'worship': '866107',
        'postoffices': '431101'
    };

    //prepare variables for URL
    // var boundingBox_MQ = [boundingBox[0].lat, boundingBox[0].lng,boundingBox[1].lat, boundingBox[1].lng].toString();
    var boundingBox_MQ = [boundingBox[0].lat, boundingBox[0].lng, boundingBox[1].lat, boundingBox[1].lng].toString();
    var key = keyMQ;

    //create URL for http request
    const url = 'https://www.mapquestapi.com/search/v2/rectangle?boundingBox=' + boundingBox_MQ + '&maxMatches=500&ambiguities=ignore&hostedData=mqap.ntpois|group_sic_code=?|' + cat_code[category] + '&outFormat=json&key=' + key;

    //make http request to query places
    const Http = new XMLHttpRequest();
    Http.open("GET", url);
    Http.send();

    //if request is successful use the data to populate the html table in index.html
    Http.onreadystatechange = function ()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            var places = JSON.parse(Http.responseText);
            var place = places.searchResults;
            //create an empty array to hold query results
            var coords = [];
            //for each place found get the name, location and metadata
            for (let index in place)
            {
                var placeName = place[index].fields.name,
                    latitude = place[index].shapePoints[0],
                    longitude = place[index].shapePoints[1],
                    metadata = ['address: ' + place[index].fields.address + 'phone: ' + place[index].fields.phone + 'postal_code: ' + place[index].fields.postal_code].toString();
                //populate the table with results
                addRow(placeName, latitude, longitude, metadata, index);
                addMarker(placeName, latitude, longitude, leafletMap)
            }
        }
	removeWait();
    }
}
//end of MapQuest NA API call

//Bing Maps NA call

function BingNAm_func(category, mapCenter, boundingBox, radius, leafletMap)
{
    //authorize the API
    var key = keyBing;

    //declare variables needed for the search
    //get the categoty code corresponding to NAVTEQNA
    var cat_code = {
        'schools': '8200 Or 8211',
        'hospitals': '8060',
        'worship': '9992',
        'postoffices': '9530'
    };

    //enter the category in the format required by spatialFilter
    var filter_cat = 'EntityTypeID eq '.concat(cat_code[category]);
    //provide search URL
    var sdsDataSourceUrl = 'http://spatial.virtualearth.net/REST/v1/data/f22876ec257b474b82fe2ffcb8393150/NavteqNA/NavteqPOIs';

    //Load the Bing Spatial Data Services module.
    Microsoft.Maps.loadModule('Microsoft.Maps.SpatialDataService', function ()
    {
        findNearby();
    });

    function findNearby()
    {
        //Create a query to get nearby data.
        var queryOptions = {
            queryUrl: sdsDataSourceUrl,
            spatialFilter:
            {
                spatialFilterType: 'nearby',
                location: new Microsoft.Maps.Location(parseFloat(mapCenter.lat), parseFloat(mapCenter.lng)),
                radius: radius,
            },
            filter: new Microsoft.Maps.SpatialDataService.Filter('EntityTypeID', 'eq', cat_code[category])
        };

        //Process the query.
        Microsoft.Maps.SpatialDataService.QueryAPIManager.search(queryOptions, key, function (data)
        {

            //this pushes results into the table
            var place = data;
            //for each place found get the name, location and metadata
            for (let index in place)
            {
                var placeName = place[index].metadata.Name,
                    latitude = place[index].metadata.Latitude,
                    longitude = place[index].metadata.Longitude,
                    metadata = ['address: '].toString();
                //populate the table with results
                addRow(placeName, latitude, longitude, metadata, index);
                //for each place add a marker to leaflet map 
                addMarker(placeName, latitude, longitude, leafletMap);
            }
	    removeWait();
        });
    }
}

//end of Bing Maps NA call

//Bing Maps EU 

function BingEU_func(category, mapCenter, boundingBox, radius, leafletMap)
{
    //authorize the API
    var key = keyBing;

    //declare variables needed for the search
    //get the categoty code corresponding to NAVTEQNA
    var cat_code = {
        'schools': '8200 Or 8211',
        'hospitals': '8060',
        'worship': '9992',
        'postoffices': '9530'
    };

    //enter the category in the format required by spatialFilter
    var filter_cat = 'EntityTypeID eq '.concat(cat_code[category]);
    //provide search URL
    var sdsDataSourceUrl = 'http://spatial.virtualearth.net/REST/v1/data/c2ae584bbccc4916a0acf75d1e6947b4/NavteqEU/NavteqPOIs';

    //Load the Bing Spatial Data Services module.
    Microsoft.Maps.loadModule('Microsoft.Maps.SpatialDataService', function ()
    {
        findNearby();
    });

    function findNearby()
    {
        //Remove any existing data from the map.
        // map.entities.clear();

        //Create a query to get nearby data.
        var queryOptions = {
            queryUrl: sdsDataSourceUrl,
            spatialFilter:
            {
                spatialFilterType: 'nearby',
                location: new Microsoft.Maps.Location(parseFloat(mapCenter.lat), parseFloat(mapCenter.lng)),
                radius: radius,
            },
            filter: new Microsoft.Maps.SpatialDataService.Filter('EntityTypeID', 'eq', cat_code[category])
        };

        //Process the query.
        Microsoft.Maps.SpatialDataService.QueryAPIManager.search(queryOptions, key, function (data)
        {
            // map.entities.push(data);
            var place = data;
            //for each place found get the name, location and metadata
            for (let index in place)
            {
                var placeName = place[index].metadata.Name,
                    latitude = place[index].metadata.Latitude,
                    longitude = place[index].metadata.Longitude,
                    metadata = ['address: '].toString();
                //populate the table with results
                addRow(placeName, latitude, longitude, metadata, index);
                //for each place add a marker 
                addMarker(placeName, latitude, longitude, leafletMap);
            }
	    removeWait();
        });
    }

}

// end of Bing Maps EU 


////////////
//  ROADS //
////////////

// calculate the box size based on the zoom factor
// IMPORTANT - this must be consistent with the
// algorithm in mapevalServer.pl: _calcPixelSize()
// returns half the size of the box to be overlaid
// on the static image (that is, increment to add or
// subtract from the center coordinates) - in degrees
function calcBoxSize(zoom)
{
    var boxsize = 0.001;
    if (zoom > 14)  
    {
	boxsize = boxsize/(2**(zoom-14));  
    }
    return boxsize;
}

//Google static map URL start
function Google_roads(mapCenter, zoom)
{
    var boxsize = calcBoxSize(zoom);
    var nw = (mapCenter.lat + boxsize) + "," + (mapCenter.lng - boxsize);
    var ne = (mapCenter.lat + boxsize) + "," + (mapCenter.lng + boxsize);
    var se = (mapCenter.lat - boxsize) + "," + (mapCenter.lng + boxsize);
    var sw = (mapCenter.lat - boxsize) + "," + (mapCenter.lng - boxsize);
    var boxSpec = "path=color:0xff0000ff|fillcolor:0xff0000ff|" + nw + "|" + ne + "|" + se + "|" + sw + "|" + nw;
    //console.log("boxSpec: " + boxSpec);


    //static with red box:
    //https://developers.google.com/maps/documentation/maps-static/dev-guide#Markers
    var urlStatic = "https://maps.googleapis.com/maps/api/staticmap?size=512x512&center=" + mapCenter.lat + "," +
        mapCenter.lng + "&zoom=" + zoom + 
        "&format=jpeg&style=feature:road%7Celement:geometry%7Ccolor:0x000000%7Cvisibility:simplified&style=element:labels%7Cvisibility:off&style=feature:landscape%7Celement:geometry.fill%7Ccolor:100xffffff&style=element:labels%7Cvisibility:off&style=feature:water%7Celement:geometry%7Ccolor:100xffffff%7Celement:labels%7Cvisibility:off&" + 
        boxSpec + "&key=" + keyGoogleStat;
    //console.log("Google url: ", urlStatic);
    var pixelToMeters = 156543.03392 * Math.cos(mapCenter.lat * Math.PI / 180) / Math.pow(2, zoom);
    //console.log("Pixel is " + pixelToMeters);
    staticMap.setAttribute('src', urlStatic);
    map.appendChild(staticMap);
    removeWait();
}
//Google URL end

//Here static map URL start
function Here_roads(mapCenter, zoom)
{
    //B&W map:
    //var url = "https://image.maps.api.here.com/mia/1.6/mapview?c=" + mapCenter.lat + "," + mapCenter.lng + "&z=15&h=512&w=512&t=7&app_id=EQ2FkZpsZXXNKlWxC9GW&app_code=PdaA5007rq73wg6WSj65rQ"  +mapCenter.lat+","+mapCenter.lng
    //colourful roads, dreamworks map

    // map without red box
    // var urlStatic = "https://image.maps.api.here.com/mia/1.6/mapview?c=" + mapCenter.lat + "," + mapCenter.lng + "&z=" + zoom + "&h=512&w=512&style=dreamworks&app_id=" + keyHere.app_id + "&app_code=" + keyHere.app_code;
    
    //map with red box:
    var boxsize = calcBoxSize(zoom);
    var nw = (mapCenter.lat + boxsize) + "," + (mapCenter.lng - boxsize);
    var ne = (mapCenter.lat + boxsize) + "," + (mapCenter.lng + boxsize);
    var se = (mapCenter.lat - boxsize) + "," + (mapCenter.lng + boxsize);
    var sw = (mapCenter.lat - boxsize) + "," + (mapCenter.lng - boxsize);
    var boxSpec = "&a0=" + nw + "," + ne + "," + se + "," + sw + "," + nw +"&fc0=FFFF0000";
    //console.log("boxSpec: " + boxSpec);
    //https://developer.here.com/documentation/map-image/topics/examples-region-usa.html
    var urlStatic = "https://image.maps.api.here.com/mia/1.6/region?c=" + mapCenter.lat + "," + mapCenter.lng + 
        boxSpec + "&z=" + zoom + "&h=512&w=512&style=dreamworks&app_id=" + keyHere.app_id + "&app_code=" + keyHere.app_code;

    //console.log("Here URL: ", urlStatic);
    var pixelToMeters = 156543.03392 * Math.cos(mapCenter.lat * Math.PI / 180) / Math.pow(2, zoom);
    //console.log("Pixel is " + pixelToMeters);
    staticMap.setAttribute('src', urlStatic);
    map.appendChild(staticMap);
    removeWait();
}
//Here URL end

//Bing static map URL start
function Bing_roads(mapCenter, zoom)
{
    //https://docs.microsoft.com/en-us/bingmaps/articles/custom-map-styles-in-bing-maps
    // var url = "http://dev.virtualearth.net/REST/V1/Imagery/Map/Road/" + mapCenter.lat + "," + mapCenter.lng + "/" + zoom + "?mapSize=512,512&key=AgUpgrwY5LDtA-YEHRwMu2PuTl4Krk1fkFaDATSiqEngyriQgsxCjbSdyUdgnMX8&st=rd|fc:000000;lv:false_st|fc:000000;lv:false_pr|fc:FFFFFF;lv:0_global|lv:0_cm|lv:0_wt|lc:FFFFFF;lv:0_ed|lv:0_bld|lv:0_ad|lv:0";
    //me element refers to all elements
    var boxsize = calcBoxSize(zoom);
    var nw = (mapCenter.lat + boxsize) + "," + (mapCenter.lng - boxsize);
    var ne = (mapCenter.lat + boxsize) + "," + (mapCenter.lng + boxsize);
    var se = (mapCenter.lat - boxsize) + "," + (mapCenter.lng + boxsize);
    var sw = (mapCenter.lat - boxsize) + "," + (mapCenter.lng - boxsize);
    var boxSpec = "&drawCurve=p,FFFF0000,FFFF0000,1;" + nw + "_" + ne + "_" + se + "_" + sw;
    //console.log("boxSpec: " + boxSpec);

    var pins = "&pushpin=" + nw + "&pushpin=" + se;
    var urlStatic = "http://dev.virtualearth.net/REST/V1/Imagery/Map/Road/" + mapCenter.lat + "," + mapCenter.lng + "/" + zoom + "?mapSize=512,512" + boxSpec + "&key=" + keyBing + "&st=rd|fc:000000;lv:0_st|fc:000000;lv:0_me|lv:0";
    //console.log("Bing url: ", urlStatic);
    var pixelToMeters = 156543.03392 * Math.cos(mapCenter.lat * Math.PI / 180) / Math.pow(2, zoom);
    //console.log("Pixel is " + pixelToMeters);
    staticMap.setAttribute('src', urlStatic);
    map.appendChild(staticMap);
    removeWait();
}

//Bing URL end

//MapQuest static map URL start
function MapQuest_roads(mapCenter, zoom)
{
    //map with no red box
    // var urlStatic = "https://www.mapquestapi.com/staticmap/v5/map?center=" + mapCenter.lat + "," + mapCenter.lng + "&zoom=" + zoom + "&size=512,512&key=" + keyMQ + "&type=dark";
    //map with red box
    //bottom of this page: https://developer.mapquest.com/documentation/static-map-api/v5/getting-started/
    var boxsize = calcBoxSize(zoom);
    var nw = (mapCenter.lat + boxsize) + "," + (mapCenter.lng - boxsize);
    var ne = (mapCenter.lat + boxsize) + "," + (mapCenter.lng + boxsize);
    var se = (mapCenter.lat - boxsize) + "," + (mapCenter.lng + boxsize);
    var sw = (mapCenter.lat - boxsize) + "," + (mapCenter.lng - boxsize);
    var boxSpec = "&shape=fill:FF0000|border:FF0000|" + nw + "|" + ne + "|" + se + "|" + sw + "|" + nw;
    //console.log("boxSpec: " + boxSpec);

    var urlStatic = "https://www.mapquestapi.com/staticmap/v5/map?center=" + mapCenter.lat + "," + mapCenter.lng + 
        "&zoom=" + zoom + "&size=512,512&key=" + keyMQ + "&type=dark" + boxSpec;

    //console.log("MapQuest url: ", urlStatic);
    var pixelToMeters = 156543.03392 * Math.cos(mapCenter.lat * Math.PI / 180) / Math.pow(2, zoom);
    //console.log("Pixel is " + pixelToMeters);
    staticMap.setAttribute('src', urlStatic);
    map.appendChild(staticMap);
    removeWait();
}
// <<<<<<< map_API_calls.js
//end of MapQuest URL 

//
function OSM_roads(mapCenter, zoom){
  //var urlStatic = "https://api.mapbox.com/v4/mapbox.dark/-76.9,38.9,5/1000x1000.png?access_token={your_access_token}"
}
// =======
//end of MapQuest URL

// >>>>>>> 1.52
