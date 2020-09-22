#!/usr/bin/perl
#
#  Copyright 2020 Sally E. Goldin
#
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.
#
#
#	$Id: mapevalServer.pl,v 1.83 2020/07/22 06:23:12 goldin Exp $
#
# Created by Sally Goldin, 3 December 2018
#    
# This script implements server side functionality for the MapEval 
# online map evaluation system.
#
# It provides various capabilities, selected by 'action'.
#
# See the end of the script for details.
#
#
#   $Log: mapevalServer.pl,v $
#   Revision 1.83  2020/07/22 06:23:12  goldin
#   debug change to provide output directory for prepareShpFiles explicitly
#
#   Revision 1.82  2020/07/22 05:59:12  goldin
#   fix directory name typo
#
#   Revision 1.81  2020/07/22 05:57:21  goldin
#   modify arguments to prepareShpFiles
#
#   Revision 1.80  2020/07/21 09:43:47  goldin
#   remove .shp from filename in upload
#
#   Revision 1.79  2020/07/21 09:09:17  goldin
#   revert to using average pixel size but still store x and y cellsizes in the DB for information
#
#   Revision 1.78  2020/07/21 08:43:52  goldin
#   calculate and save X,Y cellsizes separately for road query data
#
#   Revision 1.77  2020/07/08 10:01:49  goldin
#   change path for running prepareShpFiles
#
#   Revision 1.76  2020/07/08 07:23:30  goldin
#   delete associated query lines when experiment is deleted
#
#   Revision 1.75  2020/07/08 06:30:50  goldin
#   exit if wrong type of shape
#
#   Revision 1.74  2020/07/03 07:33:44  goldin
#   fix bug in pointmatch that allowed one target to match multiple reference points
#
#   Revision 1.73  2020/06/16 08:45:58  goldin
#   add standard deviation of distance to summary in CSV
#
#   Revision 1.72  2020/06/12 09:35:44  goldin
#   add comment about KML - needs rework
#
#   Revision 1.71  2020/06/12 07:59:49  goldin
#   Add pixel size to CSV file
#
#   Revision 1.70  2020/06/12 05:42:01  goldin
#   fix bug in matching points when only one target point found
#
#   Revision 1.69  2020/06/09 09:15:08  goldin
#   put quotes around names in CSV
#
#   Revision 1.68  2020/01/06 07:14:50  goldin
#   use ref feature count from vectorization for export
#
#   Revision 1.67  2020/01/02 04:31:15  goldin
#   Fix misspelling in name of stddist column
#
#   Revision 1.66  2019/12/27 06:06:23  goldin
#   avoid SQL error when no matching roads found
#
#   Revision 1.65  2019/12/26 09:50:11  goldin
#   give error and exit if a point data set has no points
#
#   Revision 1.64  2019/12/26 09:27:23  goldin
#   fix bug in shp upload; directory read is not always in the same order
#
#   Revision 1.63  2019/11/19 05:42:44  goldin
#   sanity check bounding box coordinates in new region; delete querydata before ref data
#
#   Revision 1.62  2019/11/05 07:40:34  goldin
#   store API keys in DB and retrieve when app loads
#
#   Revision 1.61  2019/11/05 04:19:55  goldin
#   added additional level of array to GeoJSON
#
#   Revision 1.60  2019/11/05 04:01:00  goldin
#   added the ability to get all update or query data sets for a particular region
#
#   Revision 1.59  2019/10/21 11:10:23  goldin
#   added code to include the reference data extent for each region when we call getRegions
#
#   Revision 1.58  2019/10/21 06:14:22  goldin
#   give error message if no overlap between reference data and query data bounds
#
#   Revision 1.57  2019/10/15 10:55:12  goldin
#   update to allow user to select center of a query image
#
#   Revision 1.56  2019/10/15 05:10:05  goldin
#   add code to create and return experiment names
#
#   Revision 1.55  2019/09/11 04:42:59  goldin
#   Add getExperiments
#
#   Revision 1.54  2019/09/10 12:01:21  goldin
#   implement server side code to delete datasets, regions and experiments
#
#   Revision 1.53  2019/09/03 10:16:09  goldin
#   implement getMatchLines, also handle error if image has no box
#
#   Revision 1.52  2019/08/27 09:08:38  goldin
#   make box size contingent on zoom
#
#   Revision 1.51  2019/08/27 06:10:19  goldin
#   complete server size pixel size calculations
#
#   Revision 1.50  2019/08/26 09:42:55  goldin
#   slight update to pix size formula:
#
#   Revision 1.49  2019/08/20 11:50:37  goldin
#   modified tranformation functions to use center and to round
#
#   Revision 1.48  2019/06/28 10:01:39  goldin
#   fix bug related to multilinestrings created during intersection
#
#   Revision 1.47  2019/06/13 12:31:35  goldin
#   add comments
#
#   Revision 1.46  2019/06/13 08:01:13  goldin
#   debugging
#
#   Revision 1.45  2019/06/11 10:12:28  goldin
#   Integrate data preprocessing of shape files
#
#   Revision 1.44  2019/06/07 10:00:52  goldin
#   try to fix problem with deleting table
#
#   Revision 1.43  2019/05/31 11:47:38  goldin
#   integrating linear metrics into web site
#
#   Revision 1.42  2019/05/31 08:39:36  goldin
#   complete roads calc metrics server side
#
#   Revision 1.41  2019/05/15 12:16:47  goldin
#   storing extracted lines, comparing with reference features
#
#   Revision 1.40  2019/05/14 10:23:50  goldin
#   programming workflow for extracting and calculating linear features
#
#   Revision 1.39  2019/05/10 09:37:02  goldin
#   add information to the parameter file
#
#   Revision 1.38  2019/05/10 07:57:40  goldin
#   modify to select all points from the uploaded linestring, also store experiment id and buffer in param file
#
#   Revision 1.37  2019/04/08 03:47:57  goldin
#   fix incorrect comment
#
#   Revision 1.36  2019/03/22 10:03:26  goldin
#   Experiment with extracting full reference features (disabled again for now)
#
#   Revision 1.35  2019/03/22 06:04:33  goldin
#   delete old CSV files
#
#   Revision 1.34  2019/03/06 10:06:21  goldin
#   added function for creating CSV file
#
#   Revision 1.33  2019/03/01 10:04:30  goldin
#   debugging the recalculate operation
#
#   Revision 1.32  2019/02/27 09:39:18  goldin
#   working on recalculate function
#
#   Revision 1.31  2019/02/27 05:42:14  goldin
#   test new algorithm for matching
#
#   Revision 1.30  2019/02/22 07:40:26  goldin
#   Add code to handle name match
#
#   Revision 1.29  2019/02/22 06:02:43  goldin
#   Try to eliminate duplicate matches - not yet complete
#
#   Revision 1.28  2019/02/15 10:12:37  goldin
#   modify to make name matching optional
#
#   Revision 1.27  2019/02/01 10:46:39  goldin
#   fix mistake in origin calculations
#
#   Revision 1.26  2019/01/31 11:03:49  goldin
#   need to clip features to image area - use PostGIS intersection for this
#
#   Revision 1.25  2019/01/30 08:39:26  goldin
#   more work on metrics for roads
#
#   Revision 1.24  2019/01/30 07:29:02  goldin
#   advance work on guided vectorization
#
#   Revision 1.23  2019/01/23 10:12:59  goldin
#   working on image query upload
#
#   Revision 1.22  2019/01/16 09:12:23  goldin
#   complete matching and calculation of point metrics
#
#   Revision 1.21  2019/01/11 12:47:20  goldin
#   continue working on point match - implement function to return matching point info for examination
#
#   Revision 1.20  2019/01/03 11:35:10  goldin
#   working on shape file upload
#
#   Revision 1.19  2019/01/02 09:09:32  aleksandra
#   working on the distance match discrepancy
#
#   Revision 1.18  2019/01/02 05:11:25  goldin
#   unpack WKT to get point coords
#
#   Revision 1.17  2019/01/02 04:10:58  goldin
#   implement getdatapoints
#
#   Revision 1.16  2018/12/29 11:42:02  goldin
#   initial attempts at creating experiment
#
#   Revision 1.15  2018/12/29 09:12:03  goldin
#   Added getQueryData, code to negate coverage area on provider
#
#   Revision 1.14  2018/12/27 10:34:14  goldin
#   remove log of coords
#
#   Revision 1.13  2018/12/27 08:52:10  goldin
#   debugging JSON problem
#
#   Revision 1.12  2018/12/27 05:51:33  goldin
#   working on getUploadData
#
#   Revision 1.11  2018/12/27 03:24:54  goldin
#   added getEPSG
#
#   Revision 1.10  2018/12/26 10:11:47  goldin
#   upload shapefile code
#
#   Revision 1.9  2018/12/26 07:34:21  goldin
#   working on uploaddata
#
#   Revision 1.8  2018/12/25 08:55:28  aleksandra
#   save bug fixes
#
#   Revision 1.7  2018/12/19 09:17:27  aleksandra
#   add capability to get all providers
#
#   Revision 1.6  2018/12/17 11:50:32  goldin
#   get newUploadData working for KML only
#
#   Revision 1.5  2018/12/12 13:14:08  goldin
#   get upload of file working for newUploadData
#
#   Revision 1.4  2018/12/10 08:47:36  goldin
#   implementing and testing createRegion, createQueryData
#
#   Revision 1.3  2018/12/06 06:49:44  goldin
#   debugging the createQueryData function
#
#   Revision 1.2  2018/12/05 10:38:58  goldin
#   implementing the server-side API
#
#   Revision 1.1  2018/12/03 09:33:30  goldin
#   start working on server side code
#
#
#####################################################################

use strict;
use utf8::all;
use open        qw< :std  :utf8     >;
use charnames   qw< :full >;
use Encode qw(decode encode encode_utf8 decode_utf8);
use CGI qw(-utf8);
use CGI::Carp qw(fatalsToBrowser);
use CGI qw(param);
use DBI;
use File::Basename;    
use Time::HiRes qw( gettimeofday);    
use JSON;
use JSON::Parse 'parse_json';
use Data::Dumper;
use Data::Peek;
use LWP::Simple;
use Math::Trig;
use List::Util qw[min max];
#for parsing KML
use XML::Simple;

# parameters related to uploading
use CGI::Simple qw(-upload);
$CGI::Simple::DISABLE_UPLOADS=0;
$CGI::Simple::POST_MAX= 1024 * 100000; # Limit post to 100MB
################################################################################
# globals
################################################################################
chomp(my $site = `hostname`);
chomp(my $localhost = `hostname -f`);
chomp(my $now = `date +"%Y-%m-%d %T"`);
chomp(my $today = `date +"%Y-%m-%d"`);
my $myemail = 'seg\@goldin-rudahl.com';
my $wwwuser = 'apache';
my $dbname = 'mapevaldata';
my $homedir = "../../html/MapEval";
my $tmpdir = "$homedir/tmpdata";
my $logfile = "/tmp/mapeval.log";
my $server_root = "http://$site/";
my $scriptName = "http:mapevalServer.pl";

# db access data items
my $gDbh;  # global database connection handle
my $gSqlError;    # sql error number
my $gSqlErrorStr;  # sql error string
my $gAppErrorStr;  # global application error string
my $cgi = CGI->new;
my $gAction =  $cgi->param('action');


########################################################################
#  Utility functions adapted from formgen
########################################################################
sub db_connect 
{
    my ($user,$dbname) = @_;
    my $dbh;
    $dbh = DBI->connect("dbi:Pg:dbname=$dbname;host=localhost",$user,'');
    return $dbh;
}
##
# execute an SQL command string with no results
# must first call connect
# usage: execSqlCommand cmdstring
sub execSqlCommand
{
    my ($sqlcmd) = @_; 
    $gDbh->do($sqlcmd);
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
}

##
# execute an SQL command string that includes placeholders
# (to protect against SQL insertn)
# The $sqlcmd passed must have ? for each value.
# The array of arguments must have one arg for each placeholder
# must first call connect
# usage: execPreparedSqlCommand cmdstring argument-array -- numrows
sub execPreparedSqlCommand
{
    my ($sqlcmd,@args) = @_; 
    my $stmt = $gDbh->prepare($sqlcmd);
    my $numrows = $stmt->execute(@args);

    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    return $numrows;
}


########################################################################
#  General Utility functions
########################################################################

# Send a string to the log
# Usage: logentry string
sub logentry
{
    my $string = shift;
    open LOG, ">>$logfile";
    print LOG "$now: $string";
    close LOG;
}

# ----------------------------------------------------------
# Remove suspect characters from a string and then return it
# 2015-03-30 Also set the UTF-8 flag
# Usage: sanitize string -- newstring
sub sanitize
{
   my $string = shift; 
   $string =~ s/[\#\-\%\&\$\*\+\(\)\'\"\;\?]+//g; 
   utf8::decode($string); 
  
   return $string;
}


#------------------------------------------------------------
# print simple HTML header so we can return info to
# the caller. 
# Can send an optional 'style' argument
### REMEMBER - you need a blank line after the Content-type line!
sub printHtmlHeader
{
    my $style = shift;
print <<EOM;
Content-type: text/html; charset="UTF-8"

<html><head>
   $style
</head>
<body>
EOM
}

#------------------------------------------------------------
# print simple header for JSON output
sub printJsonHeader
{
print <<EOM;
Content-type: application/json; charset="UTF-8"


EOM
}


#------------------------------------------------------------
# display page with error message
# usage: showError errorString 
sub showError
{
    my $errormsg = shift;
    logentry("ERROR: $errormsg\n");
    print $cgi->header('text/html','400 Bad Request');
    print "<h3>ERROR: $errormsg\n</h3>";
    print("</body></html>");
    exit 1;
}

#------------------------------------------------------------
# display page with HTTP success code 
# usage: showSuccess string
sub showSuccess
{
    my $string = shift;
    print $cgi->header('text/html','200 OK');
    print "<h3>SUCCESS! $string\n</h3>";
    print("</body></html>");
    logentry("SUCCESS: $string\n");
}

#------------------------------------------------------------
# send back JSON object with error message
# usage: showJsonError errorString 
sub sendJsonError
{
    my $errormsg = shift;
    logentry("ERROR: $errormsg\n");
    printJsonHeader;
    my %returnhash = ( severity => "ERROR", message => $errormsg);
    my $json = encode_json (\%returnhash);
    print $json;
    exit 1;
}



# issue a rollback before dying due to DB error
sub rollbackAndError
{
    my ($passedError) = @_;
    my $saveError = $gDbh->errstr;
    if ($passedError)
    {
	if ($saveError)
	{
	    $saveError.= "\n" . $passedError;
	}
	else
	{
	    $saveError = $passedError;
	}
    }
    execSqlCommand("ROLLBACK;");
    sendJsonError($saveError); # dies after sending the error
}

# send back JSON object with success message
# usage: sendJsonSuccess message
sub sendJsonSuccess
{
    my $msg = shift;
    printJsonHeader;
    my %returnhash = ( severity => "SUCCESS", message => $msg);
    my $json = encode_json (\%returnhash);
    print $json;
    exit 1;
}



##############################################
# Application functions start here
##############################################

#### Factorizations ###############

# Check if a region Id exists in the DB
# Arguments: regionId -- integer
# Returns 1 if exists, 0 if not.
sub _checkRegionId
{   
    my $regionid = shift;
    my $result = 1;
    my $sqlcommand = "select id, regionname from regions where id = $regionid;";
    logentry("About to execute: |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	sendJsonError($gSqlErrorStr); # dies after sending the error
    }
    if ($numrows == 0)
    {
	$result = 0;
    }
    return $result;
}

# Check if a category exists in the DB
# Arguments: category name -- string
#                             can be "all"
# Returns primary key (id) if category exists, else 0
# If category name is "all", returns -1
sub _checkCategory
{
    my $category = shift;
    my $result = 0;
    if ($category eq "all")
    {
	$result = -1;
    }
    else
    {
	my $sqlcommand = "select id from categories where categoryname = \'$category\';";
	logentry("About to execute: |$sqlcommand|\n");
	my $stmt = $gDbh->prepare($sqlcommand);
	my $numrows = $stmt->execute;
	$gSqlError= $gDbh->err;
	$gSqlErrorStr = $gDbh->errstr;
	if ($gSqlError != 0)
	{
	    sendJsonError($gSqlErrorStr); # dies after sending the error
	}
	if ($numrows > 0)
	{
	    my @row  = $stmt->fetchrow_array;
	    $result = $row[0];
	}
    }
    return $result;
}


# Check if a provider exists in the DB
# Arguments: provider name -- string
# Returns primary key (id) if provider exists, else 0
sub _checkProvider
{
    my $provider = shift;
    my $result = 0;
    my $sqlcommand = "select id from providers where providername = \'$provider\';";
    logentry("About to execute: |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	sendJsonError($gSqlErrorStr); # dies after sending the error
    }
    if ($numrows > 0)
    {
	my @row  = $stmt->fetchrow_array;
	$result = $row[0];
    }
    return $result;
}


#### Core API functions ############


# Return the bounding box that will enclose all linear feature
# reference data for a particular region.
# This is called by getRegions
# Arguments (via command line)
#    regionid       What region do we want?
# Returns bounding box polygon as WKT format
# If no upload data yet, returns null
sub _getReferenceBoundingBox
{
    my $regionid = shift;
    my $sqlcommand = "select ST_AsText(ST_SetSRID(ST_Extent(l.geom),4326)) as bb from uploadlines l,uploaddata d where d.regionid=$regionid and l.dataid=d.id and d.categoryid=5;";
    logentry("About to execute: |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    if ($gSqlError != 0)
    {
	sendJsonError;
    }
    my $bbresult = "NONE";
    if ($numrows == 1)
    {
	my @row = $stmt->fetchrow_array;
	$bbresult = $row[0];
    }
    return $bbresult;
}

# This function is a workaround for the fact that neither Perl nor JavaScript
# seems to like the GeoJSON generated by PostGIS. We take a string in WKT 
# format and return a hash representing the structure of the polygon specification. 
# Arguments (passed)
#    geostring      WKT String created by PostGIS
# Returns hash with the appropriate structure for GeoJSON
sub _parseWKT
{
        my $feature = "{ \"type\" : \"Feature\", \"properties\" : { \"type\" : \"reference\" },\n";
	$feature .= "\"geometry\" : { \"type\" : \"LineString\", \"coordinates\" :\n    [\n";

    my $geostring = shift;
    my %bbHash;
    $bbHash{'type'} = 'Feature';
    my %geomHash;
    $geomHash{'type'} = 'Polygon'; 	
    my @coords;
    my @features;	
    $geostring =~ /POLYGON\(\((.+?)\)/;
    my $pointstring = $1;
    my @points = split (/,/,$pointstring);
    my $pt;
    foreach $pt (@points)
    {
	my @xy = split(/ /,$pt);
	my @numbers;
	push @numbers,($xy[0]+0.0);
	push @numbers,($xy[1]+0.0);
	push @features,\@numbers;
    }
    push @coords,\@features;	
    $geomHash{'coordinates'} = \@coords;
    $bbHash{'geometry'} = \%geomHash;	
    return %bbHash;
}

# Return info on all regions currently in the DB
# No arguments
sub getRegions
{
    my $sqlcommand = "select id, regionname as name, x_sw, y_sw, x_ne, y_ne, radius, created, ST_AsText(center) as center from regions;";
    logentry("About to execute: |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
        {
	sendJsonError($gSqlErrorStr); # dies after sending the error
        }
    printJsonHeader;
    my @retarray;
    for (my $i = 0; ($i < $numrows); $i=$i+1)
        {
	my $hashref = $stmt->fetchrow_hashref("NAME_lc");
	my $id = $hashref->{'id'};
        my $tempcenter = $hashref->{'center'};
	# add optional dash for negative coordinates
        $tempcenter =~ /POINT\((\-?\d+.\d+) (\-?\d+.\d+)/; 
        # reformat WKT representation into JSON
        my ($lng, $lat) = ($1, $2);
        my %newval = ( lng => $lng, lat => $lat);
        $hashref->{'center'} = \%newval; 
	my $refbb = _getReferenceBoundingBox($id);
	if ($refbb =~ /POLYGON/)
	{
	    my %bbhash = _parseWKT($refbb);
	    $hashref->{'databb'} = \%bbhash;
	}
        push @retarray,$hashref;
	}
    my $json = to_json (\@retarray);
    print $json;
}

# Return info on all feature content categories currently in the DB
# No arguments
sub getCategories
{
    my $sqlcommand = "select categoryname as name, featuretype from categories;";
    logentry("About to execute: |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
        {
	sendJsonError($gSqlErrorStr); # dies after sending the error
        }
    printJsonHeader;
    my @retarray;
    for (my $i = 0; ($i < $numrows); $i=$i+1)
        {
	my $hashref = $stmt->fetchrow_hashref("NAME_lc");
        my $tempcenter = $hashref->{'center'};
        push @retarray,$hashref;
	}
    my $json = to_json (\@retarray);
    print $json;
}

# Return info on providers that can query for a particular region
# Arguments (via CGI)
#    regionid   - ID of region for which we want providers
#
sub getProviders
{
    my $regionid =  $cgi->param('regionid');
    my $sqlcommand;
    if (!defined $regionid)
    {
	sendJsonError("Missing region id"); # dies after sending the error
    }
    if ($regionid == 0)
    {
        $sqlcommand = "select providername as name from providers;";
    }   
    else 
    {  
        #be sure the region is valid 
        if (!_checkRegionId($regionid))
	{
	    sendJsonError("No region found with id $regionid"); # dies after sending the error
	}
        # seems like the id is okay, so do a constrained selection
       # $sqlcommand = "select distinct providername as name from providers,regions where (providers.coveragearea is null) or (negate is false and ST_Within(regions.boundingbox,providers.coveragearea::geometry)) or (negate is true and not ST_Within(regions.boundingbox,providers.coveragearea::geometry)) and regions.id=$regionid;";
       $sqlcommand = "select providername as name from providers,regions where providers.coveragearea is null and regions.id=$regionid UNION select providername as name from providers,regions where providers.coveragearea is not null and negate is false and ST_Within(regions.boundingbox,providers.coveragearea::geometry) and regions.id=$regionid UNION select providername as name from providers,regions where providers.coveragearea is not null and negate is true and not ST_Within(regions.boundingbox,providers.coveragearea::geometry) and regions.id=$regionid;";
    }
    logentry("About to execute: |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	sendJsonError($gSqlErrorStr); # dies after sending the error
    }
    printJsonHeader;
    my @retarray;
    for (my $i = 0; ($i < $numrows); $i=$i+1)
    {
	my $hashref = $stmt->fetchrow_hashref("NAME_lc");
        my $tempcenter = $hashref->{'center'};
        push @retarray,$hashref;
    }
    my $json = to_json (\@retarray);
    print $json;
}

# Return info on all experiments currently in the DB
# for a particular region
# Arguments (via CGI)
#   regionid       ID of the region
sub getExperiments
{
    my $regionid =  $cgi->param('regionid');
    if (!defined $regionid)
    {
	sendJsonError("Missing region id"); # dies after sending the error
    }
    # ~~ TODO
    # NOTE this query assumes that refdataid is always upload data. This is true now but might not
    # be in the future 
    my $sqlcommand = "select e.id, e.experimentname, e.refdataid,e.ref_isquery,e.targetdataid,e.target_isquery,e.buffer,e.ref_featurecount,e.target_featurecount,e.matchcount,e.averagedistance,e.averagedelta,e.created,u.dataname as uploaddataname, q.dataname as querydataname from experiment e, uploaddata u, querydata q where u.id = e.refdataid and u.regionid = $regionid and q.id = e.targetdataid and q.regionid = $regionid order by e.created desc;";
    logentry("About to execute: |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
        {
	sendJsonError($gSqlErrorStr); # dies after sending the error
        }
    printJsonHeader;
    my @retarray;
    for (my $i = 0; ($i < $numrows); $i=$i+1)
        {
	my $hashref = $stmt->fetchrow_hashref("NAME_lc");
        push @retarray,$hashref;
	}
    my $json = to_json (\@retarray);
    print $json;
}


# Create a new region in the data base
# Arguments  (via CGI)
#     regionname            Text identifying the region
#     x_sw                  Longitude of SW corner of bounding box
#     y_sw                  Latitude of SW corner
#     x_ne                  Longitude of NE corner
#     y_ne                  Latitude of NE corner
# Returns data for new region as JSON
sub newRegion
{
    my $name =  $cgi->param('regionname');
    my $name = sanitize($name);
    my $xsw = $cgi->param('x_sw');
    my $ysw =  $cgi->param('y_sw');
    my $xne = $cgi->param('x_ne');
    my $yne =  $cgi->param('y_ne');
    if ((!$name) or (!$xsw) or (!$ysw) or (!$xne) or (!$yne)) 
    {
	sendJsonError("Missing required arguments"); 
    }
    my $fX_sw = $xsw + 0.0; # convert to numeric
    my $fX_ne = $xne + 0.0; 
    my $fY_sw = $ysw + 0.0; 
    my $fY_ne = $yne + 0.0; 
    if (($fX_sw > $fX_ne) || ($fY_sw > $fY_ne))
    {
	sendJsonError("Invalid region bounds; please check your coordinates");
    }
    my $bboxstring = 
	"ST_GeomFromText(\'POLYGON(($xsw $yne,$xne $yne,$xne $ysw,$xsw $ysw,$xsw $yne))\',4326)";
    # insert new record
    my $sqlcommand = "insert into regions (regionname,x_sw,y_sw,x_ne,y_ne, boundingbox) values (\'$name\',$xsw,$ysw,$xne,$yne,$bboxstring);";
    logentry("About to execute: |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	sendJsonError($gSqlErrorStr); # dies after sending the error
    }
    # get the id of the record just added
    my $regionId;
    $sqlcommand = "select max(id) from regions;";
    logentry("About to execute: |$sqlcommand|\n");
    $stmt = $gDbh->prepare($sqlcommand);
    $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	sendJsonError($gSqlErrorStr); # dies after sending the error
    }
    if ($numrows > 0)
    {
	my @row  = $stmt->fetchrow_array;
	$regionId = $row[0];
    }
    # calculate and update columns for center and radius
    $sqlcommand = "update regions set center = ST_Centroid(boundingbox) where id = $regionId; update regions set radius = ROUND(ST_Distance(center::geography,ST_Point(x_sw,y_sw))) where id = $regionId;";
    execSqlCommand($sqlcommand);
    if ($gSqlError != 0)
    {
	sendJsonError($gSqlErrorStr); # dies after sending the error
    }
    #finally, extract the new data and return as the function value
    my $sqlcommand = "select id, regionname as name, x_sw, y_sw, x_ne, y_ne, radius, created, ST_AsText(center) as center from regions where id=$regionId;";
    logentry("About to execute: |$sqlcommand|\n");
    $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	sendJsonError($gSqlErrorStr); # dies after sending the error
    }
    # should be only one row
    my $hashref = $stmt->fetchrow_hashref("NAME_lc");
    my $tempcenter = $hashref->{'center'};
    $tempcenter =~ /POINT\((\-?\d+.\d+) (\-?\d+.\d+)/; 
    # reformat WKT representation into JSON
    my ($lng, $lat) = ($1, $2);
    my %newval = ( lng => $lng, lat => $lat);
    $hashref->{'center'} = \%newval; 
    printJsonHeader;
    my $json = to_json ($hashref);
    print $json;
}

# Use a C program to calculate the pixel size assuming that the image
# contains a centered red box of a known size
# high.
# Arguments  (passed)
#     imgfilename              Name of the raw image (as JPG) with the red box
#     lng                      Longitude of image center
#     lat                      Latitude of image center
#     zoom                     Zoom level of image - higher zoom, smaller box                 
# Returns the pixel size array, floating point - average, xpixsize, ypixsize
sub _calcPixSize
{
    my ($imgfilename,$lng,$lat,$zoom) = @_;
    #convert the image to rgb
    my @pixsize;
    my $path = "../../html/MapEval/queryimages/";
    my $outputfile = $path . "temp.rgb";
    `rm $outputfile` if (-e $outputfile);  
    `convert -size 512x512 -depth 8 $imgfilename $outputfile`;
    if (!(-e $outputfile))
    {
	logentry("Error - conversion of $imgfilename to RGB failed");
	rollbackAndError("Image conversion to RGB failed");
    }
    # convert the box bounds to 3857
    my ($nw_x,$nw_y,$se_x,$se_y);
    my $boxsize = 0.001;
    if ($zoom > 14)  # MUST keep logic in sync with map_API_calls.js: calcBoxSize()
    {
	$boxsize = $boxsize/(2**($zoom-14));  
    }
    my $nwlng = $lng - $boxsize;
    my $selng = $lng + $boxsize;
    my $nwlat = $lat + $boxsize;
    my $selat = $lat - $boxsize;
    my ($nw_x,$nw_y,$se_x,$se_y);
    my $sqlcommand = "select ST_AsText(ST_Transform(ST_SetSRID(ST_Point($nwlng, $nwlat),4326),3857)), ST_AsText(ST_Transform(ST_SetSRID(ST_Point($selng, $selat),4326),3857));";
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    my $gSqlError= $gDbh->err;
    if ($gSqlError != 0)
    {
	rollbackAndError;
    }
    if ($numrows > 0)
    {
	my @row  = $stmt->fetchrow_array;
	my $nwpoint = $row[0]; 
	my $sepoint = $row[1]; 
	$nwpoint =~ /POINT\((\-?\d+.\d+) (\-?\d+.\d+)/; 
	($nw_x, $nw_y) = ($1, $2);
	$sepoint =~ /POINT\((\-?\d+.\d+) (\-?\d+.\d+)/; 
	($se_x, $se_y) = ($1, $2);
	logentry("About to execute:\n$homedir/calcPixelSize 512 512 $outputfile $nw_x $nw_y $se_x $se_y\n"); 
	my $returnline = `$homedir/calcPixelSize 512 512 $outputfile $nw_x $nw_y $se_x $se_y`;
	logentry("Pixel size calculation returned is $returnline");
	if ($returnline eq '')
	{
	    rollbackAndError("Cannot calculate pixel size - probably no box overlay");
	}
	@pixsize = split(/[\s]+/,$returnline);
    }
    return @pixsize;
}
# Store data returned from an online provider query
# For point data, stores the coordinates
# For line data, captures and stores a static image
# Arguments  (via CGI)
#     regionid              ID of region where the dataset is located
#     name                  Text identifying the data set
#     category              String, one of the values returned by getCategories
#     provider              Provider name
#              Point features only
#     coords                Array of geographic feature objects. 
#                           Each one in the form:
#                              { name: 'ABC school',
#                                 metadata: 'any string',
#                                 lng: 99.23,
#                                 lat: 9.25}
#                           featureName and meta can be blank.
#              Line features only (currently just roads)
#     imgurl                Url of raw static image showing roads
#     zoom                  Zoom the static image
#     center_x              Longitude of image center (roads only)
#     center_y              Latitude of image center (roads only)
# Returns a new object corresponding to the header of the dataset, as JSON
sub newQueryData
{
    my $imgfilename;   #in case this is a roads query 
    my $path = "../../html/MapEval/queryimages/";
    my $regionid =  $cgi->param('regionid');
    my $name =  $cgi->param('name');
    $name = sanitize($name);
    my $category =  $cgi->param('category'); 
    my $provider = $cgi->param('provider');
    my $coords =  $cgi->param('coords');
    my $imgurl = $cgi->param('imgurl');
    my $zoom = $cgi->param('zoom');
    my $center_x = $cgi->param('center_x');
    my $center_y = $cgi->param('center_y');
    my $dataId; #id of to-be-created header record
    if ((!$regionid) or (!$name) or (!$category) or (!$provider)) 
    {
	sendJsonError("Missing required arguments"); 
    }
    $name = $name . " " .  $now; #add timestamp to name 
    if (!_checkRegionId($regionid))
    {
	sendJsonError("No region found with id $regionid");
    }
    my $categoryId = _checkCategory($category);
    if ($categoryId == 0)
    {
	sendJsonError("No category found called $category"); 
    }
    my $providerId = _checkProvider($provider);
    if ($providerId == 0)
    {
	sendJsonError("No provider found called $provider"); 
    }
    my $featureType = _lookupFeatureType($categoryId);
    if ($featureType == 0)  # point feature
    {
	if (!$coords) 
	{
	    sendJsonError("Missing required arguments - coords"); 
	}
    }
    else
    {
	if (!$imgurl) 
	{
	    sendJsonError("Missing required arguments - imgurl"); 
	}
	if (!$zoom) 
	{
	    sendJsonError("Missing required arguments - zoom"); 
	}
	if (!$center_x) 
	{
	    sendJsonError("Missing required arguments - center_x"); 
	}
	if (!$center_y) 
	{
	    sendJsonError("Missing required arguments - center_y"); 
	}
	my $newname = $name;
	$newname =~ s/[\s]+|[:]/_/g;
	$imgfilename = "$path$newname.$providerId.$regionid.$zoom.jpg";
	#logentry("URL: |$imgurl|\n");
    }
    #okay, first insert the header record
    execSqlCommand("BEGIN;");  # put into a transaction for consistency
    my $sqlcommand = "insert into querydata (regionid,categoryid,providerid,dataname,imgfilename) values ($regionid, $categoryId, $providerId, \'$name\',\'$imgfilename\')";
    logentry("About to execute: |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	rollbackAndError;
    }
    # get the id of the record just added
    $sqlcommand = "select max(id) from querydata;";
    $stmt = $gDbh->prepare($sqlcommand);
    $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	rollbackAndError;
    }
    if ($numrows > 0)
    {
	my @row  = $stmt->fetchrow_array;
	$dataId = $row[0];
    }
    if ($featureType == 0)
    {
	#now go through the coordinates array, adding a row for each object
	my @coordsArray = @{from_json($coords)};
	# coordsArray holds an array of hash references
	my $i = 0;
	my $count = @coordsArray;  # scalar content
	for ($i=0; $i < $count; $i++)
	{
	    my %pointInfo = %{$coordsArray[$i]};
	    # for now assume the category is a point feature
	    my $lng = $pointInfo{lng};
	    my $lat = $pointInfo{lat};
	    my $tempname = sanitize($pointInfo{name});
	    my $tempmeta = sanitize($pointInfo{meta});
	    $sqlcommand = "insert into querypoints (dataid,featurename,metainfo,geom) values ($dataId,\'$tempname\',\'$tempmeta\',ST_GeomFromText('POINT($lng $lat)',4326));"; 
	    $stmt = $gDbh->prepare($sqlcommand);
	    $numrows = $stmt->execute;
	    $gSqlError= $gDbh->err;
	    $gSqlErrorStr = $gDbh->errstr;
	    if ($gSqlError != 0)
	    {
		rollbackAndError;
	    }
	}  
    }
    else  # save the url as a file
    {
	my $status = getstore($imgurl, $imgfilename);
	if (!is_success($status))
	{
	    execSqlCommand("ROLLBACK;");
	    sendJsonError("Error status saving image file - $status"); 
	}
	#calculate georeferencing information
	# get the center as both lng/lat and web mercator
	#$sqlcommand = "select ST_AsText(center),ST_AsText(ST_Transform(center,3857)) from regions where id = $regionid;";
	## 15 Oct 2019 New
	## Use passed center but use PostGIS to transform to web mercator
	$sqlcommand = "select ST_AsText(ST_Transform(ST_SetSRID(ST_Point($center_x, $center_y),4326),3857))";
	$stmt = $gDbh->prepare($sqlcommand);
	$numrows = $stmt->execute;
	$gSqlError= $gDbh->err;
	$gSqlErrorStr = $gDbh->errstr;
	if ($gSqlError != 0)
	{
	    rollbackAndError;
	}
	if ($numrows > 0)
	{
	    my @row  = $stmt->fetchrow_array;
	    my $mcenter = $row[0];   # center in web mercator/meters
	    #$llcenter =~ /POINT\((\-?\d+.\d+) (\-?\d+.\d+)/; 
	    my ($lng, $lat) = ($center_x,$center_y);
	    #my $pixsize = (156543.03392 * cos(deg2rad($lat))) / (2**($zoom));  # Does this assume a 256 pixel tile?
	    my @pixelsizes = _calcPixSize($imgfilename,$lng,$lat,$zoom);
	    my $pixsize = $pixelsizes[0];
	    my $pixsizeX = $pixelsizes[1];
	    my $pixsizeY = $pixelsizes[2];
	    $mcenter =~ /POINT\((\-?\d+.\d+) (\-?\d+.\d+)/; 
	    my ($x, $y) = ($1, $2);
            # assume all images are 512x512 so the origin will be the
            # center minus 256 * pixelsize (for x; + for y)
	    # 21 July 2020 - investigating different X & Y pixel sizes
	    # Seemed to make accuracy worse so revert to using the average for calculations
	    # However, we still save the different values in the DB
	    my $originx = $x - (256 * $pixsize);
	    my $originy = $y + (256 * $pixsize);
	    my $se_x = $originx + 512 * $pixsize;
	    my $se_y = $originy - 512 * $pixsize;
	    my $bbPolyText = "ST_Transform(ST_GeomFromText(\'POLYGON(($originx $originy,
                                  $se_x $originy,
                                  $se_x $se_y,
                                  $originx $se_y,
                                  $originx $originy))\',3857),4326)";

	    $sqlcommand = "update querydata set zoom=$zoom, origin_x = $originx, origin_y = $originy, center_x = $x, center_y = $y, center_lng = $center_x, center_lat = $center_y, pixelsize=$pixsize, pixelsizex=$pixsizeX, pixelsizey=$pixsizeY, boundingbox=$bbPolyText where id = $dataId;";
	    $stmt = $gDbh->prepare($sqlcommand);
	    $numrows = $stmt->execute;
	    $gSqlError= $gDbh->err;
	    $gSqlErrorStr = $gDbh->errstr;
	    if ($gSqlError != 0)
	    {
		rollbackAndError;
	    }
	}

    }
    execSqlCommand("COMMIT;");
    # Points were stored without error so construct the return value as a hash
    my %returnHash;
    $returnHash{id} = $dataId;
    $returnHash{regionId} = $regionid;    
    $returnHash{name} = $name;
    $returnHash{category} = $category;
    $returnHash{provider} = $provider;
    printJsonHeader;
    my $json =  to_json (\%returnHash);
    print $json;

}

# Check that the entered EPSG matches one of those available
# in PostGIS.
# Argument 
#    EPSG            SRID code
# Returns 1 if okay, 0 if not valid
sub _validEPSG
{
    my $EPSG = shift;
    my $sqlcommand = "select SRID,auth_name from spatial_ref_sys where SRID=$EPSG;";
    logentry("About to execute: |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
        {
	sendJsonError($gSqlErrorStr); # dies after sending the error
        }
    return $numrows;
}

# Get rid of any spurious path added to the filename
# by the browser
# Arguments
#   $filename            Original filename
# Returns bare filename without any path
sub _stripPath
{
    my $filename = shift;
    my $basename;
    my $lastSlash = -1;
    if ($filename =~ /\//)
    {
	$lastSlash = rindex($filename,"/");
    }
    elsif ($filename =~ /\\/)
    {
	$lastSlash = rindex($filename,"\\");
    }
    $basename= substr($filename, $lastSlash+1,length($filename)-$lastSlash-1);
    return $basename;
}


# Actually upload a file
# This function is called from newUploadData() function
# It expects the input file name as a regular function argument
# Returns the full path to the uploaded file
sub _uploadDataFile
    {
    my $filename = shift;
    my $inputfile = $cgi->upload('inputFile');
    my $buffer;
    my $bytesread;
    my $totalbytes;
    #outpath is relative to /var/www/cgi-bin/MapEval
    my $outpath = "../../html/MapEval/uploaded";
    my $tmppath = "../../html/MapEval/uploaded/tmp";
    my $num_bytes = 10240;
    my $outfile = _stripPath($filename);
    logentry("Stripped filename is $outfile\n");
    my $outlog = "$outpath/uploads.log";
    $outpath .= "/$outfile";
    open OUTFILE, ">$outpath" or sendJsonError("$! opening $outpath");
    binmode OUTFILE;
    while ($bytesread = read($inputfile, $buffer, $num_bytes)) 
    {
        $totalbytes += $bytesread;
        print OUTFILE $buffer;
    }
    sendJsonError("Read failure on file $filename") unless defined($bytesread);
    close OUTFILE or sendJsonError("Couldn't close $outpath: $!");
    if (!defined($totalbytes)) 
    {
        sendJsonError("Could not read file $filename}, or the file was zero length.");
    } 
    `chmod 0666 $outpath`;
    my $msg = "File $filename was uploaded to $outpath at $now";
    `echo \"$msg\" >> $outlog`;
    return $outpath;
 }  

# Given a category Id, return the feature type (0 for point, 1 for polyline,
# 2 for polygon) associated with that type.
#   Argument:    categoryId (integer)
#   Returns featureType (integer)
sub _lookupFeatureType
{
    my $categoryId = shift;
    my $result;
    my $sqlcommand = "select featuretype from categories where id = $categoryId;";
    logentry("About to execute |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	sendJsonError($gSqlErrorStr); # dies after sending the error
    }
    if ($numrows > 0)
    {
	my @row  = $stmt->fetchrow_array;
	$result = $row[0];
    }
    return $result;
}

# Parse the uploaded KML file and store the points or lines in the
# database, associated with a specific upload data set.
# Arguments (passed)
#     $fullpath       Path and filename for kml file
#     $dataId         DB Id of the upload data set
#     $categoryId     DB Id of category, used to get feature type
#NOTE this module comes from Namtan's code and should be reworked to
#be more robust. It makes unwarranted assumptions about the data format.
#Also XML::Simple is deprecated and should be replaced.
sub _parseStoreKml
{
    my ($fullpath,$dataId,$categoryId) =  @_;
    my $featureType = _lookupFeatureType($categoryId);
    my $myFile = XMLin($fullpath);
    my $coor;
    my $sqlcommand;
    while (my ($key, $folder) = each %{$myFile->{Document}{Folder}{Placemark}})  
    {
	if ($featureType == 1)  #linestring
	{
	    $coor=$folder->{MultiGeometry}->{LineString}->{coordinates};
	    logentry("Coords are $coor\n");
	    if ($coor ne "")
	    {
		my @lnglat;
		@lnglat = split (/ /,$coor);
		my $lnglat_array;
		my $num_coor=scalar @lnglat;
		$num_coor=$num_coor-1;
		my $i_coor=0;
		foreach my $lnglat (@lnglat) 
		{
		    if ($i_coor eq 0)
		    {
			my $point =$lnglat[0];
			$point =~ s/\,/ /g; #point =longitude latitude
			$lnglat_array=$point;
			$i_coor=$i_coor +1;
		    }
		    else 
		    {
			my $point =$lnglat[$i_coor];
			$point =~ s/\,/ /g; #point =longitude latitude
			$lnglat_array=$lnglat_array.",".$point;
			$i_coor=$i_coor +1;
		    }
		}
		$sqlcommand = "INSERT INTO uploadlines (dataid,featurename,geom) VALUES ( $dataId,\'$key\',ST_GeomFromText('LINESTRING($lnglat_array)',4326));";
		logentry("About to execute |$sqlcommand|\n");
		execSqlCommand($sqlcommand);
		if ($gSqlError != 0)
		{
		    rollbackAndError;
		}
	    } #if coords not empty
	} #if feature type is 1
	elsif ($featureType == 0)  #point  
	{
	    $coor=$folder->{Point}->{coordinates};
	    my @lnglat;
	    @lnglat = split (/ /,$coor);
	    $sqlcommand = "INSERT INTO uploadpoints (dataid,featurename,geom) VALUES ( $dataId,\'$key\', ST_SetSRID(ST_MakePoint($lnglat[0] $lnglat[1]), 4326))";
	    logentry("About to execute |$sqlcommand|\n");
	    execSqlCommand($sqlcommand);
	    if ($gSqlError != 0)
	    {
		rollbackAndError;
	    }
	}
    }
       logentry("leaving _parseStoreKML\n");
}

# Read each line from an SQL file and execute it
# This is a work-around for not being able to use psql with Apache for
# some reason
# Arguments (passed)      $sqlfile     Path and filename to execute
sub _execSqlFile
{
    my $sqlfile = shift;
    my $fh;
    if (!open($fh, '<:encoding(UTF-8)', $sqlfile))
    {
	sendJsonError("Cannot open the SQL file $sqlfile\n");
    }
    my $sqlcommand = "";
    while (my $command = <$fh>) 
    {
	chomp $command;
	next if ($command =~ /^Shape/i  or $command =~ /^Post/i or $command =~ /^Field/i );
	$sqlcommand .= $command;
	if ($sqlcommand =~ /\;$/)  # end of command 
	{
	    logentry("In _execSqlFile - About to execute: |$command|\n");
	    execSqlCommand($sqlcommand);
	    if ($gSqlError != 0)
	    {
		rollbackAndError;
	    }
	    $sqlcommand = "";
	}
    }
    close $fh;
}

# Import the shapefile and store the points or lines in the
# database, associated with a specific upload data set.
# Arguments (passed)
#     $fullpath       Path and filename for kml file
#     $dataId         DB Id of the upload data set
#     $categoryId     DB Id of category, used to get feature type
#     $spatialref     Spatial reference system of the shape file
sub _importShapeFile
{
    my ($fullpath,$dataId,$categoryId,$spatialref) =  @_;
    my $featureType = _lookupFeatureType($categoryId);
    my $sqlcommand;
    my $outPath = "../../html/MapEval/uploaded";
    my $tmpPath = "../../html/MapEval/uploaded/tmp";
    # shape files are expected to be in a zip file
    # with no more than one subdirectory level when unpacked
    # they must have at least two columns, 'name' and 'geom'.
    # they may have a column called 'metainfo'
    if (!($fullpath =~ /\.zip$/i))
    {
	execSqlCommand("ROLLBACK;");
	sendJsonError("Shape files must be uploaded in ZIP format\n");
    }
    `rm -rf $tmpPath` if (-e $tmpPath);  
    `mkdir $tmpPath`;
    `unzip $fullpath -d $tmpPath`;
    # find the name of the actual shape file
    opendir(DIR, $tmpPath);
    my @tmpfiles = readdir(DIR);
    closedir(DIR);
    my $filecount = @tmpfiles;
    my @files = sort @tmpfiles;
    my $tmpShape ='';
    # allow one level of subdirectory
    # first item will be . and second will be ..
    if (($filecount == 3) && (-d "$tmpPath/$files[2]"))
    {
	$tmpPath .= "/$files[2]";
	opendir(DIR, $tmpPath);
	my @files = grep(/\.shp$/,readdir(DIR));
	closedir(DIR);
	$filecount = @files;
	$tmpShape = $files[0] if ($filecount > 0);
    }
    else
    {
	$filecount = 0;
	foreach my $f ( @files)
	{
	    if ($f =~ /\.shp$/)
	    {
		$tmpShape = $f;
		$filecount++;
	    }
	}
    }
    if ($filecount != 1)  #must be exactly one .shp 
    {
	execSqlCommand("ROLLBACK;");
	sendJsonError("Shape file ZIP archive has $filecount items of type .shp\n");
    }
    my $convertPath = "$tmpPath/output";
   `mkdir $convertPath`;
    my $shapefile = "$tmpPath/$tmpShape";
    
    # remove suffix
    $shapefile =~ s/.shp$//;
    # check for a legal type of data
    logentry("About to preprocess shape file - command is: ../../html/MapEval/prepareShpFiles $shapefile $convertPath\n");
    my @result = `../../html/MapEval/prepareShpFiles $shapefile $convertPath`;
    my $resultString = join "\n",@result;
    logentry("Result from prepareShpFiles is |$resultString|\n");
    if (@result)
    {
	execSqlCommand("ROLLBACK;");
	sendJsonError($resultString);
    }
    `cp -p $convertPath/* $tmpPath`;
    logentry("About to import shape file - command is: shp2pgsql -c -t 2D -S -s $spatialref:4326 $shapefile mapeval_tempdata > $outPath/tempdata.sql 2>&1");
    
    @result = `shp2pgsql -c -t 2D -S -s $spatialref:4326 $shapefile mapeval_tempdata > $outPath/tempdata.sql 2>&1`;
    if (@result)
    {
	execSqlCommand("ROLLBACK;");
	sendJsonError("Error ($result[0]) trying to import shape file (shp2pgsql)\n");
    }
    # See if 'mapeval_tempdata' table exists
    $sqlcommand = "select relname from pg_catalog.pg_class where relname = 'mapeval_tempdata';";
    logentry("About to execute: |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    rollbackAndError if $gSqlError != 0;
    if ($numrows > 0)  #table exists, so drop it    
       { 
       $sqlcommand = "drop table mapeval_tempdata;";
       execSqlCommand($sqlcommand); 
       }
    _execSqlFile("$outPath/tempdata.sql");
    my $tablename = "uploadpoints";
    $tablename = "uploadlines" if ($featureType == 1);
    # get all rows in '' 
    $sqlcommand = "select name,geom from mapeval_tempdata;";
    logentry("About to execute: |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    rollbackAndError if $gSqlError != 0;
    for (my $i = 0; ($i < $numrows); $i=$i+1)
    {
	my @row  = $stmt->fetchrow_array;
	my $namestring = sanitize($row[0]);
	$sqlcommand = "insert into $tablename (dataid,featurename,geom) values ($dataId,\'$namestring',\'$row[1]\');";
	logentry("About to execute: |$sqlcommand|\n");
	execSqlCommand($sqlcommand);
        $gSqlError= $gDbh->err;
        rollbackAndError if $gSqlError != 0;
    }
    $sqlcommand = "drop table mapeval_tempdata;";
    execSqlCommand($sqlcommand);
    $gSqlError= $gDbh->err;
    rollbackAndError if $gSqlError != 0;
}

# Top level function for uploading a shape, gml or kml file and
# Arguments (via CGI)
#     regionId      DB identifier of the region
#     name          Name for the data set (256 chars max)
#     category      Category name, e.g. 'roads', 'schools'.
#                   Must match a category in the DB
#     comment       Free text describing the source (512 chars max),
#                   could be blank
#     filename      Name of file to upload 
#     fileformat    'gml','shp' or 'kml'
#     spatialref    Numeric SRID of data in the file 
# Return JSON object for new upload data set
sub newUploadData
{
    my $regionId = $cgi->param('regionid');
    my $name = $cgi->param('name');
    $name = sanitize($name);
    $name = $name . " " .  $now; #add timestamp to name 
    my $category = $cgi->param('category');
    my $comment = $cgi->param('comment');
    $comment = sanitize($comment);
    my $filename = $cgi->param('filename');
    my $fileformat = $cgi->param('fileformat');
    my $spatialref = $cgi->param('spatialref');
    logentry("$regionId | $name | $category | $comment | $filename | $fileformat | $spatialref \n");
    if ((!$regionId) || (!$category) || (!$name) || (!$filename) || (!$fileformat) || (!$spatialref))
    {
       sendJsonError("Missing required arguments"); 
    }
    if (!_checkRegionId($regionId))
    {
	sendJsonError("No region found with id $regionId");
    }
    $comment = '' if (!$comment);
    my $categoryId = _checkCategory($category);
    if ($categoryId == 0)
    {
	sendJsonError("No category found called $category"); 
    }
    if (_validEPSG($spatialref) == 0)
    {
	sendJsonError("Invalid spatial reference ID (EPSG)"); 
    }
    my $fullpath =  _uploadDataFile($filename);
    # begin transaction
    execSqlCommand("BEGIN;");
    # insert upload data header record and get the ID
    my $sqlcommand = "insert into uploaddata (regionid,categoryid,dataname,comment,filename,originalformat) values ($regionId, $categoryId,\'$name\',\'$comment\',\'$filename\',\'$fileformat\')";
    logentry("About to execute: |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    rollbackAndError if $gSqlError != 0;

    # get the id of the record just added
    $sqlcommand = "select max(id) from uploaddata;";
    $stmt = $gDbh->prepare($sqlcommand);
    $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    my $dataId;
    rollbackAndError if $gSqlError != 0;
    if ($numrows > 0)
    {
	my @row  = $stmt->fetchrow_array;
	$dataId = $row[0];
    }
    if ($fileformat =~ /^kml$/i )
    {
        # parse and store the KML file
	# note KML only supports lat/long    
        _parseStoreKml($fullpath,$dataId,$categoryId);
	execSqlCommand("COMMIT;");
    } 
    elsif ($fileformat =~ /^shp$/i )
    {
        _importShapeFile($fullpath,$dataId,$categoryId,$spatialref);
	execSqlCommand("COMMIT;");
    }
    else
    {
	execSqlCommand("ROLLBACK;");
	sendJsonError("File format $fileformat not currently supported\n");
    }
    my %returnHash;
    $returnHash{id} = $dataId;
    $returnHash{regionId} = $regionId;    
    $returnHash{name} = $name;
    $returnHash{category} = $category;
    printJsonHeader;
    my $json =  to_json (\%returnHash);
    print $json;
}

# Return info on all spatial reference systems supported by PostGIS
# The table queried is provided by PostGIS, not part of our schema
# No arguments
sub getEPSG
{
    my $sqlcommand = "select SRID from spatial_ref_sys;";
    logentry("About to execute: |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
        {
	sendJsonError($gSqlErrorStr); # dies after sending the error
        }
    printJsonHeader;
    my @retarray;
    for (my $i = 0; ($i < $numrows); $i=$i+1)
        {
	my $hashref = $stmt->fetchrow_hashref("NAME_lc");
        push @retarray,$hashref;
	}
    my $json = to_json (\@retarray);
    print $json;
}

# Return info on all uploaddata objects for a particular region and category
# Arguments (via cgi)
#     regionid      -   ID of the region
#     category      -   Name of the category - can be "all"
sub getUploadData
{
    my $regionId = $cgi->param('regionid');
    my $category = $cgi->param('category');
    if ((!$regionId) || (!$category))
    {
       sendJsonError("Missing required arguments"); 
    }
    my $sqlcommand;
    if (!_checkRegionId($regionId))
    {
	sendJsonError("No region found with id $regionId");
    }
    my $categoryId = _checkCategory($category);
    if ($categoryId == 0)
    {
	sendJsonError("No category found called $category"); 
    }
    if ($categoryId > 0)
    {
        $sqlcommand = "select id,regionid,categoryid,dataname,comment,created from uploaddata where regionid=$regionId and categoryid=$categoryId order by created desc;";
    }
    else #All categories
    {
        $sqlcommand = "select id,regionid,categoryid,dataname,comment,created from uploaddata where regionid=$regionId order by created desc;";
    }

    logentry("About to execute: |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
        {
	sendJsonError($gSqlErrorStr); # dies after sending the error
        }
    printJsonHeader;
    my @retarray;
    for (my $i = 0; ($i < $numrows); $i=$i+1)
        {
	my $hashref = $stmt->fetchrow_hashref("NAME_lc");
        push @retarray,$hashref;
	}
    my $json = to_json (\@retarray);
    print $json;
}

# Return info on all querydata objects for a particular region and category
# that have not been deleted
# Arguments (via cgi)
#     regionid      -   ID of the region
#     category      -   Name of the category
sub getQueryData
{
    my $regionId = $cgi->param('regionid');
    my $category = $cgi->param('category');
    if ((!$regionId) || (!$category))
    {
       sendJsonError("Missing required arguments"); 
    }
    my $sqlcommand;
    if (!_checkRegionId($regionId))
    {
	sendJsonError("No region found with id $regionId");
    }
    my $categoryId = _checkCategory($category);
    if ($categoryId == 0)
    {
	sendJsonError("No category found called $category"); 
    }
    if ($categoryId > 0)
    {
	$sqlcommand = "select id,regionid,categoryid,providerid,dataname,created from querydata where regionid=$regionId and categoryid=$categoryId and deleted is false order by created desc;";
    }
    else # -1 means ALL categories - used only for cleanup
    {
	$sqlcommand = "select id,regionid,categoryid,providerid,dataname,created from querydata where regionid=$regionId order by created desc;";
    }

    logentry("About to execute: |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
        {
	sendJsonError($gSqlErrorStr); # dies after sending the error
        }
    printJsonHeader;
    my @retarray;
    for (my $i = 0; ($i < $numrows); $i=$i+1)
        {
	my $hashref = $stmt->fetchrow_hashref("NAME_lc");
        push @retarray,$hashref;
	}
    my $json = to_json (\@retarray);
    print $json;
}

##############################################
# Functions for calculating metrics begin here
##############################################


# check if ID exists in the appropriate data table and if so
# get its category.
# Arguments
#     dataId                  Id to check
#     isQuery                 If true, check the query data table 
#                                     else upload data table
# Returns an array of the category id and regionid if dataId exists, else -1 in
# first array element
sub _getDataCategory
{
    my ($dataId,$isQuery) =  @_;
    my @result;
    $result[0] = -1;
    my $sqlcommand = "select dataname,categoryid,regionid from ";
    if ($isQuery eq 'true')
    {
	$sqlcommand .= " querydata where id=$dataId and not deleted;";
    }
    else
    {
	$sqlcommand .= " uploaddata where id=$dataId;";
    }
    logentry("About to execute: |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	sendJsonError($gSqlErrorStr); # dies after sending the error
    }
    if ($numrows > 0)
    {
	my @row  = $stmt->fetchrow_array;
	$result[0] = $row[1];
	$result[1] = $row[2];
    }
    return @result;   
	
}

# try to match two strings (one from reference, one from target)
# Return a 'match goodness' value (floating point) which is
# percent of words in strings matched. Will return 0 if either
# name is empty, 1.0 for a perfect (case insensitive) match
# Arguments
#     refstring            String that provides reference data
#     chkstring            String we are trying to match
# Return match score
sub _matchStrings
{
    my ($refstring,$chkstring) = @_;
    my $score = 0.0;
    my $score1 = 0.0;
    my $score2 = 0.0;
    return $score if (($refstring eq '') or ($chkstring eq ''));
    my @refwords = split(/ /,$refstring);
    my $rwcount = @refwords;
    my @chkwords = split(/ /,$chkstring);
    my $cwcount = @chkwords;
    my $matchcount = 0;
    foreach my $w (@refwords)
    {
	$w =~ s/\(|\)//g;  # get rid of parens
	$matchcount++ if ($chkstring =~ /$w/i);
    }
    $score1 = $matchcount / $rwcount;
    $matchcount = 0;
    foreach my $w (@chkwords)
    {
	$w =~ s/\(|\)//g;  # get rid of parens
	$matchcount++ if ($refstring =~ /$w/i);
    }
    $score2 = $matchcount / $cwcount;
    $score = max($score1,$score2);
    return $score;
}

# Get the point information from the requested data sets and
# try to find matches for each reference point, based on distance and
# name. Populates the "pointmatch" table in the DB
#  Arguments
#          experimentid                    ID of row for this experiment
#          refdataid                       ID of the reference data set
#          refisquery                      true if the reference data are from a query, else false
#          targetdataid                    ID of the target data set
#          targetisquery                   true if the target data are from a query, else false
#          threshold                       max distance to call two points "matched"
#          regionid                        Id of region, used to filter the points
#          nameflag                        If 'true' use names as part of match process
#  
sub _getAndMatchPoints
{
    my ($experimentId,$refId,$refQuery,$targetId,$targetQuery,$threshold,$regionId,$nameflag) =  @_;
    my $refTable = "uploadpoints";
    $refTable = "querypoints" if $refQuery eq "true";
    my $targetTable = "uploadpoints";
    $targetTable = "querypoints" if $targetQuery eq "true";
    #start by getting all the reference points
    my @refPoints;
    my @refNames;
    my %ref2targetDistance; # hash that maps joint reference ID/target ID key to interpoint distance
    my %ref2targetName;     # hash that maps joint refernence ID/target ID key to interpoint name match score
    my $sqlcommand = "select $refTable.id,$refTable.featurename from $refTable,regions where dataid = $refId and regions.id=$regionId and ST_Within($refTable.geom,regions.boundingbox);";
    logentry("About to execute: |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	sendJsonError($gSqlErrorStr); # dies after sending the error
    }
    for (my $i = 0; $i < $numrows; $i++)
    {
	my @row  = $stmt->fetchrow_array;
	push @refPoints,$row[0];
	push @refNames,$row[1];
    }
    if ($numrows == 0)
    {
	rollbackAndError("There are no points in the reference data set");
    }
    #do the same thing for the target points
    my @targetPoints;
    my @targetNames;
    my $sqlcommand = "select $targetTable.id,$targetTable.featurename from $targetTable,regions where dataid = $targetId and regions.id=$regionId and ST_Within($targetTable.geom,regions.boundingbox);";
    logentry("About to execute: |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	rollbackAndError;  # dies after sending the error
    }
    for (my $i = 0; $i < $numrows; $i++)
    {
	my @row  = $stmt->fetchrow_array;
	push @targetPoints,$row[0];
	push @targetNames,$row[1];
    }
    if ($numrows == 0)
    {
	rollbackAndError("There are no points in the target data set");
    }
    #now go through the reference point array and calculate the distance to each target point
    #looking for the min distance - must be less than the threshold
    my $refcount = @refPoints;
    my $targetcount = @targetPoints;
    logentry("There are $refcount reference points and $targetcount target points\n");
    # add counts to the DB record
    $sqlcommand = "update experiment set ref_featurecount=$refcount, target_featurecount = $targetcount where id=$experimentId;";
    logentry("About to execute: |$sqlcommand|\n");
    execSqlCommand($sqlcommand);
    if ($gSqlError != 0)
    {
	rollbackAndError;
    }
    my $rCount = 0;
    foreach my $RID (@refPoints)
    {
	my $maxDistance = 50000;
	my $minID = -1;
	my $metascore = 0;
	my $tCount = 0;
	foreach my $TID (@targetPoints)
	{
	    my $distance;
	    $sqlcommand = "select ST_DistanceSpheroid(ref.geom,target.geom,'SPHEROID[\"WGS 84\",6378137,298.257223563]') from $refTable as ref,$targetTable as target where ref.id=$RID and target.id=$TID;";
	    logentry("About to execute: |$sqlcommand|\n");
	    $stmt = $gDbh->prepare($sqlcommand);
	    $numrows = $stmt->execute;
	    $gSqlError= $gDbh->err;
	    $gSqlErrorStr = $gDbh->errstr;
	    if ($gSqlError != 0)
	    {
		sendJsonError($gSqlErrorStr); # dies after sending the error
	    }
	    if ($numrows > 0)
	    {
		my @row  = $stmt->fetchrow_array;
		$distance = $row[0];
		$metascore = _matchStrings($refNames[$rCount],$targetNames[$tCount]);
		my $keystring = "$RID-$TID";
		$ref2targetDistance{$keystring} = $distance; 
		$ref2targetName{$keystring} = $metascore;
		$tCount++;  
	    } #endif got some rows
	    else
	    {
		sendJsonError("_getAndMatchPoints distance calculation returns 0 rows"); # dies after sending the error
	    }
	} #end loop through target IDs
	$rCount++;
    } #end loop through reference IDs
    #now sort the keys based on distance & name match - distances ascending, names descending
    my @closest = sort { $ref2targetDistance{$a} <=> $ref2targetDistance{$b} } keys %ref2targetDistance;
    my $keycount = @closest;
    my @scores = sort { $ref2targetName{$b} <=> $ref2targetName{$a} } keys %ref2targetName;
    #Run through the reference IDs again. Pick the closest target point. If less than threshold
    #then remove all other combinations that use that target point so we cannot get any duplicates
    my $arraylen = @closest;
    foreach my $RID (@refPoints)
    {
	logentry("Matching refId $RID\n");
	my $TID = "";
	my $altTID = "";
	my $maxDistance = 50000;
	my $metascore = 0;
	my $altMetascore = 0;
        my $compoundKey;
	my $altCompoundKey;
	my $distance;
	foreach (@closest)
	{
	    if ($_ =~ /^$RID/)
	    {
		$compoundKey = $_;
		last;
	    }
	}
	$compoundKey =~ /[-](\d+)/; 
	last if ((!$compoundKey) || ($compoundKey eq '')); # we have used up all the target points
        $TID = $1;
	$distance = $ref2targetDistance{$compoundKey};
	$metascore = $ref2targetName{$compoundKey};
	if (($nameflag eq 'true') && ($metascore != 1.0))
	{
	    foreach (@scores)
	    {

		if ($_ =~ /^$RID/)
		{
		$altCompoundKey = $_;
		last;
		}
	    }
	    $altMetascore = $ref2targetName{$altCompoundKey};
	    if ($altMetascore == 1.0)
	    {
		$altCompoundKey =~ /[-](\d+)/; 
		$altTID = $1;
		if ($altTID ne $TID)
		{
		    $TID = $altTID;
		    $distance = $ref2targetDistance{$altCompoundKey};
		    $metascore = $altMetascore;
		}
	    }
	}    
	if ($distance > $threshold)  #Q: should we consider the threshold if name match?
	{
	    $distance = $maxDistance;
	    $TID = -1;
	}
	#store results in the pointmatch table
	$sqlcommand = "insert into pointmatch (experimentid,refid,targetid,distance,metascore) values ($experimentId,$RID,$TID,$distance,$metascore);";
	logentry("About to execute: |$sqlcommand|\n");
	execSqlCommand($sqlcommand);
	if ($gSqlError != 0)
	{
	    rollbackAndError;
	}
	# now clean up all references to $TID in the array - we can just set them to a dummy key so they won't match
	for (my $i = 0; $i < $arraylen; $i++)
	{
	    $closest[$i] = 'DUMMY' if ($closest[$i] =~ /[-]$TID/);  #matches target ID
	    $scores[$i] = 'DUMMY' if ($scores[$i] =~ /[-]$TID/);  #matches target ID
	}
    } #end reference ID loop
}

# Receive pairs of matched points as JSON.
# Store in matchpoints table and calculate the distances
#          experimentid                    ID of row for this experiment
#          refdataid                       ID of the reference data set
#          refisquery                      true if the reference data are from a query, else false
#          targetdataid                    ID of the target data set
#          targetisquery                   true if the target data are from a query, else false
#          matchedpoints                   JSON of points pairs (ref,target)
sub _storePointsAndDistances
{
    my ($experimentId,$refId,$refQuery,$targetId,$targetQuery,$matchedpoints) =  @_;
    logentry("_storePointsAndDistances\n");
    my $refTable = "uploadpoints";
    $refTable = "querypoints" if $refQuery eq "true";
    my $targetTable = "uploadpoints";
    $targetTable = "querypoints" if $targetQuery eq "true";
    # add counts to the DB record
    my $refcount;
    my $targetcount;
    my $sqlcommand = "select count(*) from $refTable where dataid=$refId;";
    logentry("About to execute |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	rollbackAndError;
    }
    if ($numrows > 0)
    {
	my @row  = $stmt->fetchrow_array;
	$refcount = $row[0];
    }	
    $sqlcommand = "select count(*) from $targetTable where dataid=$targetId;";
    logentry("About to execute |$sqlcommand|\n");
    $stmt = $gDbh->prepare($sqlcommand);
    $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	rollbackAndError;
    }
    if ($numrows > 0)
    {
	my @row  = $stmt->fetchrow_array;
	$targetcount = $row[0];
    }	
    $sqlcommand = "update experiment set ref_featurecount=$refcount, target_featurecount = $targetcount where id=$experimentId;";
    execSqlCommand($sqlcommand);
    if ($gSqlError != 0)
    {
	rollbackAndError;
    }
    my @pointsArray = @{from_json($matchedpoints)};
    my $i = 0;
    my $count = @pointsArray; 
    logentry("point array has $count items\n");
    for ($i=0; $i < $count; $i++)
    {
	my %pointPair = %{$pointsArray[$i]};
	# for now assume the category is a point feature
	my $RID = $pointPair{refid};
	my $TID = $pointPair{targetid};
	logentry("RID: $RID   TID: $TID\n");
	# get the distance
	my $distance;
	$sqlcommand = "select ST_DistanceSpheroid(ref.geom,target.geom,'SPHEROID[\"WGS 84\",6378137,298.257223563]') from $refTable as ref,$targetTable as target where ref.id=$RID and target.id=$TID;";
	logentry("About to execute |$sqlcommand|\n");
	$stmt = $gDbh->prepare($sqlcommand);
	$numrows = $stmt->execute;
	$gSqlError= $gDbh->err;
	$gSqlErrorStr = $gDbh->errstr;
	if ($gSqlError != 0)
	{
	    rollbackAndError; # dies after sending the error
	}
	if ($numrows > 0)
	{
	    my @row  = $stmt->fetchrow_array;
	    $distance = $row[0];
	}	
	$sqlcommand = "insert into pointmatch (experimentid,refid,targetid,distance) values ($experimentId,$RID,$TID,$distance);"
;	logentry("About to execute |$sqlcommand|\n");
	$stmt = $gDbh->prepare($sqlcommand);
	$numrows = $stmt->execute;
	$gSqlError= $gDbh->err;
	$gSqlErrorStr = $gDbh->errstr;
	if ($gSqlError != 0)
	{
	    rollbackAndError;
	}
    }  
}

# Create a file with the parameters necessary to do guided vectorization
# Includes georeferencing parameters plus id and  coordinates
# of each road in the uploadlines table.
# Arguments (passed)
#    experimentid         Id of the experiment
#    threshold            Buffer size in meters
#    refid                Id of dataset in uploaddata table
#    targetid             Id of dataset in querydata table
# Returns name of the file created
sub _writeParamFile
{
   my ($experimentId,$threshold,$refId,$targetId) =  @_;
   my ($xcenter,$ycenter,$size,$sizex,$sizey,$count,$bb,$bb_binary);
   my $filename = "$tmpdir/Param$refId.$targetId.txt";
   logentry("Creating filename |$filename|\n");
   my $sqlcommand = "select center_x,center_y,pixelsize,pixelsizex, pixelsizey, boundingbox,ST_AsText(boundingbox) as bb from querydata where id=$targetId;";
   logentry("About to execute: |$sqlcommand|\n");
   my $stmt = $gDbh->prepare($sqlcommand);
   my $numrows = $stmt->execute;
   $gSqlError= $gDbh->err;
   $gSqlErrorStr = $gDbh->errstr;
   if ($gSqlError != 0)
   {
       rollbackAndError;
   }
   if ($numrows > 0)
   {
       my @row  = $stmt->fetchrow_array;
       ($xcenter,$ycenter,$size,$sizex,$sizey,$bb_binary,$bb) = @row;
       # For now, use one pixel size in both directions. Seems to
       # give the best results - however, we leave different values in the DB
       # in case someone wants to look at this in the future.
       $sizex = $size;
       $sizey = $size;
   }

   # QUERY TO GET ONLY START AND END POINTS
   #$sqlcommand = "select id, ST_AsText(ST_Transform(ST_StartPoint(ST_Intersection(geom,\'$bb_binary\')),3857)) as start, ST_AsText(ST_Transform(ST_EndPoint(ST_Intersection(geom,\'$bb_binary\')),3857)) as end from uploadlines where dataid=$refId and ST_Intersects(geom,\'$bb_binary\');";
   # QUERY TO GET FULL INTERSECTION, ALL POINTS
   $sqlcommand =  "with vars as (select boundingbox from querydata where id=$targetId) select id, ST_AsText(ST_Transform(ST_Intersection(geom,vars.boundingbox),3857)) from uploadlines, vars where dataid=$refId and ST_Intersects(geom,vars.boundingbox);";
   #$sqlcommand = "select id, ST_AsText(ST_Transform(ST_Intersection(geom,\'$bb_binary\'),3857)) from uploadlines where dataid=$refId and ST_Intersects(geom,\'$bb_binary\');";
   logentry("About to execute: |$sqlcommand|\n");
   my $stmt = $gDbh->prepare($sqlcommand);
   my $numrows = $stmt->execute;
   $gSqlError= $gDbh->err;
   $gSqlErrorStr = $gDbh->errstr;
   if ($gSqlError != 0)
   {
       rollbackAndError;
   }
   open FILE, ">$filename" or sendJsonError("Can't open file $filename");
   if ($numrows == 0)
   {
       rollbackAndError("No reference features fall within the bounds of the query data");
   }
   print FILE "$numrows $xcenter $ycenter $size $sizex $sizey $targetId $threshold\n";
   for (my $i=0; $i < $numrows; $i++)
   {
       my @row  = $stmt->fetchrow_array;
       # Code to transform and write only start and end points
       #       my ($id,$start,$end) = @row;
       #  $start =~ /POINT\((\-?\d+.\d+) (\-?\d+.\d+)/; 
       #  my ($x1,$y1) = ($1,$2);
       #  $end =~ /POINT\((\-?\d+.\d+) (\-?\d+.\d+)/; 
       #  my ($x2,$y2) = ($1,$2);
       #  print FILE "$id $x1 $y1 $x2 $y2\n";
       # Code to match Id plus linestring 'LINESTRING(xxxx.xxxx yyyy.yyyy, xxxx.xxxx yyyy.yyyy, xxxx.xxxx yyyy.yyyy)'
       my ($id,$linestring) = @row;
       if ($linestring =~ /MULTILINESTRING\((.+?)\)$/)  # intersect can create multi-line strings!
       {
	   my $multicoords = $1;
	   my @substrings = split(/\),\(/,$multicoords);
	   foreach my $coords (@substrings)
	   {
	       $coords =~ s/\(|\)//g;
	       print FILE "$id $coords\n";
	   }
       }
       else
       {
	   $linestring =~ /LINESTRING\((.+?)\)/;
	   my $coords = $1;
	   print FILE "$id $coords\n";
       }
    }
   close FILE;
   return $filename;
}

# run the appropriate script on the target image file name to turn it 
# into a binary image file. The original name of the file is stored in
# the querydata record. We copy that to a standard file name based
# on the first word of the provider name, then run the appropriate ImageMagick
# conversion script, again selected by provider name. We return the name of
# the converted binary image as the function value.
#   Arguments 
#       targetId      Id of querydata record
#
sub _convertImage
{
  my ($targetId) =  @_;
  my ($queryimg,$standardimg,$binaryimg,$providername,$convertscript);
  my $sqlcommand = "select p.providername,q.imgfilename from providers p, querydata q where q.id = $targetId and q.providerid = p.id;";
  logentry("About to execute: |$sqlcommand|\n");
  my $stmt = $gDbh->prepare($sqlcommand);
  my $numrows = $stmt->execute;
  $gSqlError= $gDbh->err;
  $gSqlErrorStr = $gDbh->errstr;
  if ($gSqlError != 0)
    {
	rollbackAndError; # dies after sending the error
    }
  if ($numrows > 0)
    {
	my @row  = $stmt->fetchrow_array;
	$providername = $row[0];
	$queryimg = $row[1];
    }
  $providername =~ /^(\w+)/;
  my $provider = lc($1);
  my $stat = system("cp -p $queryimg $tmpdir/$provider.jpg");
  if ($stat != 0)
    {
	rollbackAndError("Cannot copy from $queryimg to $tmpdir/$providername.jpg"); # dies after sending the error
    }
  $binaryimg = $tmpdir . "/" . $provider . "binary.rgb";
  $convertscript = $homedir . "/" . $provider . "_convert.sh";
  $stat = system("./$convertscript $tmpdir");
  if ($stat != 0)
    {
	rollbackAndError("Cannot execute conversion script $convertscript"); # dies after sending the error
    }
  return $binaryimg;
}

# populate the linematch table by comparing the reference data with the 
# extracted features from the image. We need to intersect the reference data with
# the boundaries of the IMAGE, not the region, since the image probably doesn't cover
# the full region (depending on the zoom). We know the center of the image is the
# center of the region and also the size of a pixel, so we can calculate the bounds
# This is saved as part of the querydata record
# Arguments (passed)
#     experimentid          - ID of the experiment
#     refdataid             - ID of the uploaddata record
#     targetdataid          - ID of the querydata record
# Returns an array with element 0 the number of reference lines in the linematch table, element 1 the number of matches
sub _compareLines
{
    my ($experimentId, $refdataId, $targetdataId) = @_;
    # QUERY TO GET FULL INTERSECTION WITH IMAGE AREA BB, ALL POINTS 
    my $sqlcommand =  "with vars as (select boundingbox from querydata where id=$targetdataId) select id as refid,ST_Transform(ST_Intersection(geom,vars.boundingbox),3857) as refline from uploadlines, vars where dataid=$refdataId and ST_Intersects(geom,vars.boundingbox);";
    logentry("About to execute: |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	rollbackAndError;
    }
    my @refIdList;
    my @refGeomList;
    my $matchCount = 0;
    my $refCount = $numrows;
    for (my $i=0; $i < $refCount; $i++)
    {
	my @row  = $stmt->fetchrow_array;
	my ($refid,$refline) = @row;
	# save because we need to exec more SQL for each feature
	push @refIdList,$refid;
	push @refGeomList,$refline;
    }
    for (my $i=0; $i < $refCount; $i++)
    {
	# do we have a matching query line?
	$sqlcommand = "select id as qid,geom as qline from querylines where experimentid=$experimentId and uploadfeatureid=$refIdList[$i];";
	logentry("About to execute: |$sqlcommand|\n");
	$stmt = $gDbh->prepare($sqlcommand);
	$numrows = $stmt->execute;
	$gSqlError= $gDbh->err;
	$gSqlErrorStr = $gDbh->errstr;
	if ($gSqlError != 0)
	{
	    rollbackAndError;
	}
	if ($numrows == 0)   # no matching line
	{
	    $sqlcommand = "insert into linematch (experimentid,refid) values ($experimentId,$refIdList[$i]);";
	}
	elsif ($numrows == 1)  #exactly one matching line
	{
            $matchCount++;
	    my @row  = $stmt->fetchrow_array;
	    my ($qid,$qline) = @row;
	    $sqlcommand = "insert into linematch (experimentid,refid,targetid,distance,deltalength) values ($experimentId,$refIdList[$i],$qid,ST_HausdorffDistance(\'$refGeomList[$i]\',\'$qline\'),(ST_Length(\'$refGeomList[$i]\') - ST_Length(\'$qline\')));";
	} # deal with multiple matches later
	logentry("About to execute: |$sqlcommand|\n");
	execSqlCommand($sqlcommand);
	if ($gSqlError != 0)
	{
	    rollbackAndError;
	}
    }
    my @results;
    logentry("In _compareLines, refCount is $refCount and matchCount is $matchCount\n");
    push @results, $refCount;
    push @results, $matchCount;
    return @results;

}

# Factorization of calculateMetrics for roads
# Looks up and returns the zoom factor for a particular query data set
# Argument (passed)
#   queryDataId
# Returns zoom factor
sub _getZoomFactor
{
    my $queryDataId = shift;
    my $zoom;
    my $sqlcommand = "select zoom from querydata where id = $queryDataId;";
    logentry("About to execute: |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    my $gSqlError= $gDbh->err;
    if ($gSqlError != 0)
    {
	rollbackAndError;
    }
    if ($numrows > 0)
    {
	my @row = $stmt->fetchrow_array;
	$zoom = $row[0]; 
    }
    return $zoom;
}

# Construct a human readable name for an experiment.
# We will pre-pend the experiment time stamp before we store this
# in the experiment record.
# Arguments (passed)
#   categoryId    -   Place category
#   regionId      -   Region
#   refId         -   Reference data set ID
#   targetID      -   Target data set ID
#   refIsQuery    -   If true, reference is query data set (usually false)
#   targetIsQuery -   If true, target is query data set (usually true)
# Returns constructed experiment name
sub _makeExperimentName
{
    my ($categoryId,$regionId,$refId,$targetId,$refIsQuery,$targetIsQuery) = @_; 
    my ($catname,$regionname,$providername);
    my $experimentname = '';
    my $sqlcommand = "select categoryname from categories where id = $categoryId";
    logentry("About to execute: |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	sendJsonError($gSqlErrorStr);
    }
    if ($numrows == 1)   
    {
	my @row  = $stmt->fetchrow_array;
	$catname = @row[0];  
    } # don't handle (very unlikely) error - just leave category name blank	
    $sqlcommand = "select regionname from regions where id = $regionId";
    logentry("About to execute: |$sqlcommand|\n");
    $stmt = $gDbh->prepare($sqlcommand);
    $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	sendJsonError($gSqlErrorStr);
    }
    if ($numrows == 1)   
    {
	my @row  = $stmt->fetchrow_array;
	my $temp = @row[0];
        my @tempwords = split(/\s/,$temp);
        $regionname = $tempwords[0]; # take just first word  
    } # don't handle (very unlikely) error - just leave regionname name blank	
    my $tablename = "querydata";
    $tablename = "uploaddata" if (!$targetIsQuery);
    $sqlcommand = "select p.providername from providers p,$tablename o where o.id=$targetId and o.providerid = p.id";
    logentry("About to execute: |$sqlcommand|\n");
    $stmt = $gDbh->prepare($sqlcommand);
    $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	sendJsonError($gSqlErrorStr);
    }
    if ($numrows == 1)   
    {
	my @row  = $stmt->fetchrow_array;
	my $temp = @row[0];
        my @tempwords = split(/\s/,$temp);
        $providername = $tempwords[0]; # take just first word  
    } # don't handle (very unlikely) error - just leave regionname name blank	
    $experimentname = $regionname . "|" . $catname . "|" . $providername;
    return $experimentname;
}

# factorization of calculateMetrics
# get the created timestamp for the experiment, add to the experiment string,
# store in the experiment table. Called within a transaction
# Arguments (passed)
#   experimentname       -   name string
#   experimentId         -   id of the experiment record to update 
sub _updateExperimentName
{
    my ($experimentname,$experimentId) = @_;
    my $timestamp;
    my $sqlcommand = "select created from experiment where id = $experimentId";
    logentry("About to execute: |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	rollbackAndError;
    }
    if ($numrows == 1)   
    {
	my @row  = $stmt->fetchrow_array;
	$timestamp = @row[0];  
    } # presumably this cannot fail to return a single row
    # chop off the fractional seconds
    my $period = index($timestamp,'.');
    my $timestamp = substr($timestamp,0,$period);
    $experimentname = $timestamp . ' ' . $experimentname;
    $sqlcommand = "update experiment set experimentname = \'$experimentname\' where id = $experimentId;";
    logentry("About to execute: |$sqlcommand|\n");
    execSqlCommand($sqlcommand);
    if ($gSqlError != 0)
    {
	rollbackAndError;
    }
}



# top level function for calculating metrics
# Arguments (via cgi)
#   refdataid               Id of reference data set
#   refisquery              Boolean - if true, this dataset was queried 
#                                     if false, uploaded    
#   targetdataid            Id of target data set
#   targetisquery           Boolean - if true, this dataset was queried 
#                                     if false, uploaded
#   threshold               Buffer distance
#   nameflag                If true, consider name match in matching
#   recalcflag              If 'true', then we expect a JSON structure with matched
#                           points, which the user has edited
#   matchedpoints           JSON of the form: [ {refid: NN, targetid: NN}, ...]
#  Creates a new record in the experiment table.
#  Ultimately returns metrics as JSON
sub calculateMetrics
{
    my $refId = $cgi->param('refdataid');
    my $refIsQuery = $cgi->param('refisquery');
    my $targetId = $cgi->param('targetdataid');
    my $targetIsQuery = $cgi->param('targetisquery');
    my $threshold = $cgi->param('threshold');
    my $nameflag = $cgi->param('nameflag'); 
    my $recalcflag = $cgi->param('recalcflag');
    my $matchedpoints = $cgi->param('matchedpoints');
    $nameflag = 'false' if (!$nameflag);
    $recalcflag = 'false' if (!$recalcflag);
    $threshold = 200 if (!$threshold);
    if ((!$refId) || (!$refIsQuery) || (!$targetId) || (!$targetIsQuery))
    {
       sendJsonError("Missing required arguments"); 
    }
    if (($recalcflag eq 'true') && (!$matchedpoints))
    {
       sendJsonError("Missing required argument 'matchedpoints' for recalculation"); 
    }
    my @refInfo = _getDataCategory($refId,$refIsQuery);
    my @targetInfo = _getDataCategory($targetId,$targetIsQuery);
    if ($refInfo[0] < 0)
    {
       sendJsonError("Invalid reference data ID"); 
    }
    if ($targetInfo[0] < 0)
    {
       sendJsonError("Invalid target data ID"); 
    }
    if ($refInfo[0] != $targetInfo[0])
    {
       sendJsonError("Reference and target must represent same category!"); 
    }
    if ($refInfo[1] != $targetInfo[1])
    {
       sendJsonError("Reference and target must represent same region!"); 
    }
    my $experimentname = _makeExperimentName($refInfo[0],$refInfo[1],$refId,$targetId,$refIsQuery,$targetIsQuery);
    execSqlCommand("BEGIN;");
    my $sqlcommand = "insert into experiment (refdataid,ref_isquery,targetdataid,target_isquery,nameflag,buffer,edited) values ($refId,$refIsQuery, $targetId,$targetIsQuery,$nameflag,$threshold,$recalcflag);";
    logentry("About to execute: |$sqlcommand|\n");
    execSqlCommand($sqlcommand);
    if ($gSqlError != 0)
    {
	rollbackAndError;
    }
    # get the id of the record just added
    $sqlcommand = "select max(id) from experiment;";
    logentry("About to execute: |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	rollbackAndError;
    }
    my $experimentId;
    if ($numrows > 0)
    {
	my @row  = $stmt->fetchrow_array;
	$experimentId = $row[0];
    }
    my $featureType = _lookupFeatureType($refInfo[0]);
    my ($refcount, $targetcount, $matchcount, $avgdistance,$avgdelta);
    if ($featureType == 0)  #points
    {
	if ($recalcflag eq 'false')
	{
	    _getAndMatchPoints($experimentId,$refId,$refIsQuery,$targetId,$targetIsQuery,$threshold,$refInfo[1],$nameflag);
	}
	else
	{
	    _storePointsAndDistances($experimentId,$refId,$refIsQuery,$targetId,$targetIsQuery,$matchedpoints);
	}
	# okay - calculate metrics: average distance, completeness (number of matches), density (number of target points)
	$sqlcommand = "select ref_featurecount,target_featurecount from experiment where id=$experimentId;";
	logentry("About to execute: |$sqlcommand|\n");
	$stmt = $gDbh->prepare($sqlcommand);
	$numrows = $stmt->execute;
	$gSqlError= $gDbh->err;
	$gSqlErrorStr = $gDbh->errstr;
	if ($gSqlError != 0)
	{
	    rollbackAndError;
	}
	if ($numrows > 0)
	{
	    ($refcount,$targetcount) = $stmt->fetchrow_array;
	}
	$sqlcommand = "select count(*) from pointmatch where targetid > 0 and experimentid=$experimentId;";
	logentry("About to execute: |$sqlcommand|\n");
	$stmt = $gDbh->prepare($sqlcommand);
	$numrows = $stmt->execute;
	$gSqlError= $gDbh->err;
	$gSqlErrorStr = $gDbh->errstr;
	if ($gSqlError != 0)
	{
	    rollbackAndError;
	}
	if ($numrows > 0)
	{
	    my @row = $stmt->fetchrow_array;
	    $matchcount = $row[0];
	}
	if ($matchcount == 0)
	{
	    $avgdistance = -1;  # signal no matches
	}
	else
	{
	    $sqlcommand = "select avg(distance) from pointmatch where targetid > 0 and experimentid=$experimentId;";
	    logentry("About to execute: |$sqlcommand|\n");
	    $stmt = $gDbh->prepare($sqlcommand);
	    $numrows = $stmt->execute;
	    $gSqlError= $gDbh->err;
	    $gSqlErrorStr = $gDbh->errstr;
	    if ($gSqlError != 0)
	    {
		rollbackAndError;
	    }
	    if ($numrows > 0)
	    {
		my @row = $stmt->fetchrow_array;
		$avgdistance = $row[0];
	    }
	}
	$sqlcommand = "update experiment set averagedistance = $avgdistance, matchcount=$matchcount where id=$experimentId;";
	logentry("About to execute: |$sqlcommand|\n");
	execSqlCommand($sqlcommand);
	if ($gSqlError != 0)
	{
	    rollbackAndError;
	}
	_updateExperimentName($experimentname,$experimentId);
	execSqlCommand("COMMIT;");
	my $completeness = $matchcount/$refcount;
	printJsonHeader;
	my $json = "{ \"experimentid\" : $experimentId, \"averagedistance\" : $avgdistance, \"completeness\" : $completeness, \"density\" : $targetcount , \"matchcount\": $matchcount, \"refcount\" : $refcount}";
	print $json;
    }
    else # roads
    {
	my $zoom = _getZoomFactor($targetId);
	# write scaling and reference data to parameter file
	my $paramFilename = _writeParamFile($experimentId,$threshold,$refId,$targetId);
	# convert the image to binary - depending on the source
        my $binaryImageName = _convertImage($targetId);
	# run guidedVectorize
        my $results = `$homedir/guidedVectorize 512 512 $binaryImageName $paramFilename $tmpdir/loadresults $experimentId`;
        if ($results ne "")
        {
	    sendJsonError("Cannot execute guidedVectorize -- Error is |$results|");
	} 
	# load the data into the DB
	_execSqlFile("$tmpdir/loadresults.sql");
	# compare and calculate
	my @results = _compareLines($experimentId, $refId, $targetId);
	$refcount = $results[0];
	$matchcount = $results[1];
	if ($matchcount == 0)
	{
	    $avgdistance = -1;  # signal no matches
	    $avgdelta = -1;
	}
	else
	{
	    $sqlcommand = "select avg(distance),avg(deltalength) from linematch where targetid > 0 and experimentid=$experimentId;";
	    logentry("About to execute: |$sqlcommand|\n");
	    $stmt = $gDbh->prepare($sqlcommand);
	    $numrows = $stmt->execute;
	    $gSqlError= $gDbh->err;
	    $gSqlErrorStr = $gDbh->errstr;
	    if ($gSqlError != 0)
	    {
		rollbackAndError;
	    }
	    if ($numrows > 0)
	    {
		my @row = $stmt->fetchrow_array;
		($avgdistance,$avgdelta) = @row;
	    }
	    my $completeness = 0;
	    if ($refcount > 0)
	    {
		$matchcount/$refcount;
	    }
	}
	$sqlcommand = "update experiment set averagedistance = $avgdistance, averagedelta = $avgdelta, ref_featurecount=$refcount,target_featurecount=$matchcount, matchcount=$matchcount where id=$experimentId;";
	logentry("About to execute: |$sqlcommand|\n");
	execSqlCommand($sqlcommand);
	if ($gSqlError != 0)
	{
	    rollbackAndError;
	}
	_updateExperimentName($experimentname,$experimentId);
	execSqlCommand("COMMIT;");
	# now return the results of the comparison
	my $center_lng;
	my $center_lat;
	$sqlcommand = "select center_lng, center_lat from querydata where id = $targetId;";
	logentry("About to execute: |$sqlcommand|\n");
	$stmt = $gDbh->prepare($sqlcommand);
	$numrows = $stmt->execute;
	$gSqlError= $gDbh->err;
	$gSqlErrorStr = $gDbh->errstr;
	if ($gSqlError != 0)
	{
	    rollbackAndError;
	}
	if ($numrows > 0)
	{
	    my @row = $stmt->fetchrow_array;
	    ($center_lng,$center_lat) = @row;
	}
	my $completeness = $matchcount/$refcount;
	printJsonHeader;
	my $json = "{ \"experimentid\" : $experimentId, \"averagedistance\" : $avgdistance, \"averagedelta\" : $avgdelta, \"completeness\" : $completeness, \"matchcount\": $matchcount, \"refcount\" : $refcount, \"zoomfactor\" : $zoom, \"center\": { \"lng\": $center_lng, \"lat\": $center_lat} }";
	print $json;
    }
    
}

# Return all the points associated with a data set, which
# can be either an upload or query set.
# Arguments (via cgi)
#     dataId               Id of the dataset in uploaddata or querydata table
#     dataIsQuery          "true" if the data come from a query,"false" if not 
# Returns results as JSON        
sub getDataPoints
{
    my $dataId = $cgi->param('dataid');
    my $dataIsQuery = $cgi->param('dataisquery');
    if ((!$dataId) || (!$dataIsQuery))
    {
       sendJsonError("Missing required arguments"); 
    }
    my @dataInfo = _getDataCategory($dataId,$dataIsQuery);
    if ($dataInfo[0] < 0)
    {
       sendJsonError("Invalid data ID"); 
    }
    my $featureType = _lookupFeatureType($dataInfo[0]);
    if ($featureType != 0)
    {
       sendJsonError("Must be a point data set\n"); 
    }
    my $table = "uploadpoints";
    $table = "querypoints" if ($dataIsQuery eq "true");
    my $sqlcommand = "select id,featurename,ST_AsText(geom) as coords from $table where dataid=$dataId;";
    logentry("About to execute: |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	sendJsonError($gSqlErrorStr);
    }
    printJsonHeader;
    my @retarray;
    for (my $i = 0; ($i < $numrows); $i=$i+1)
        {
	my $hashref = $stmt->fetchrow_hashref("NAME_lc");
        my $tempcenter = $hashref->{'coords'};
        #my $featurename = $hashref->{'featurename'};
	#logentry("Point $i feature name is: $featurename\n");
	$tempcenter =~ /POINT\((\-?\d+.\d+) (\-?\d+.\d+)/; 
        # reformat WKT representation into JSON
        my ($lng, $lat) = ($1, $2);
        my %newval = ( lng => $lng, lat => $lat);
        $hashref->{'coords'} = \%newval; 
        push @retarray,$hashref;
	}
    my $json = to_json (\@retarray);
    logentry("JSON\n $json");
    print $json;

}

# return the matches for a particular experiment, in a JSON
# form that is somewhat human readable
# Arguments (via CGI)
#   experimentid                  Id of the "experiment"
# Returns JSON
sub getMatchPoints
{
    my $expId = $cgi->param('experimentid');
    if (!$expId)
    {
       sendJsonError("Missing experiment Id"); 
    }
    my $sqlcommand = "select refdataid, ref_isquery, targetdataid, target_isquery from experiment where id = $expId;"; 
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	sendJsonError($gSqlErrorStr);
    }
    if ($numrows == 0)
    {
	sendJsonError("Invalid experiment Id");
    }
    my @row  = $stmt->fetchrow_array;
    my ($refdataid,$ref_isquery,$targetdataid,$target_isquery) = @row;
    my $reftable = "uploadpoints";
    $reftable = "querypoints" if $ref_isquery;
    my $targettable = "uploadpoints";
    $targettable = "querypoints" if $target_isquery;
    $sqlcommand ="select p.refid,refsource.featurename as refname,ST_AsText(refsource.geom) as refcoords,p.targetid,targsource.featurename as targetname,ST_AsText(targsource.geom) as targetcoords,distance from pointmatch as p, $reftable as refsource, $targettable as targsource where p.experimentid = $expId and p.refid=refsource.id and p.targetid=targsource.id;";
    logentry("About to execute: |$sqlcommand|\n");
    $stmt = $gDbh->prepare($sqlcommand);
    $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	sendJsonError($gSqlErrorStr);
    }
    printJsonHeader;
    my @retarray;
    for (my $i = 0; ($i < $numrows); $i=$i+1)
        {
	my $hashref = $stmt->fetchrow_hashref("NAME_lc");
        my $point = $hashref->{'refcoords'};
	$point =~ /POINT\((\-?\d+.\d+) (\-?\d+.\d+)/; 
        # reformat WKT representation into JSON
        my ($lng, $lat) = ($1, $2);
        my %newval1 = ( lng => $lng, lat => $lat);
        $hashref->{'refcoords'} = \%newval1; 
        $point = $hashref->{'targetcoords'};
	$point =~ /POINT\((\-?\d+.\d+) (\-?\d+.\d+)/; 
        # reformat WKT representation into JSON
        ($lng, $lat) = ($1, $2);
        my %newval2 = ( lng => $lng, lat => $lat);
        $hashref->{'targetcoords'} = \%newval2; 
        push @retarray,$hashref;
	}
    my $json = to_json (\@retarray);
    print $json;

}

# return the matches for a particular experiment, in a JSON
# form that is somewhat human readable
# Arguments (via CGI)
#   experimentid                  Id of the "experiment"
# Returns JSON of all stored and extracted lines, tagged as 'reference' and 'target'
sub getMatchLines
{
    my $expId = $cgi->param('experimentid');
    if (!$expId)
    {
       sendJsonError("Missing experiment Id"); 
    }
    my $i = 0;
    my $sqlcommand = "select refdataid, targetdataid from experiment where id = $expId;"; 
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	sendJsonError($gSqlErrorStr);
    }
    if ($numrows == 0)
    {
	sendJsonError("Invalid experiment Id");
    }
    my @row  = $stmt->fetchrow_array;
    my ($refdataid,$targetdataid) = @row;
    my $reftable = "uploadlines";
    my $targettable = "querylines";
    # First do the the reference features
    # Do we need to clip them? Let's assume not
    $sqlcommand = "select ST_AsText(geom) from uploadlines where dataid = $refdataid;";
    logentry("About to execute: |$sqlcommand|\n");
    $stmt = $gDbh->prepare($sqlcommand);
    $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	sendJsonError($gSqlErrorStr);
    }
    my $geoJsonString = "[";
    for ($i = 0; $i < $numrows; $i++)
    {
	my ($linestring) = $stmt->fetchrow_array;
        my $feature = "{ \"type\" : \"Feature\", \"properties\" : { \"type\" : \"reference\" },\n";
	$feature .= "\"geometry\" : { \"type\" : \"LineString\", \"coordinates\" :\n    [\n";
       	$linestring =~ /LINESTRING\((.+?)\)/;
	my $coordstring = $1;
	my @points = split(",",$coordstring);
        my $bFirst = 1;
	foreach my $lnglat (@points)
	{
	    my @coords = split(" ",$lnglat);
	    if ($bFirst == 1)
	    {
		$feature .= "      [$coords[0],$coords[1]]";
		$bFirst = 0;
	    }
	    else 
	    {
		$feature .= ",\n      [$coords[0],$coords[1]]";
	    }
	}
	$feature .= "\n    ]\n}}";
	$geoJsonString .= ",\n" if ($i > 0);
	$geoJsonString .= $feature;
    }
    # now get the target data 
    $sqlcommand = "select ST_AsText(ST_Transform(geom,4326)) from querylines where experimentid = $expId;";
    logentry("About to execute: |$sqlcommand|\n");
    $stmt = $gDbh->prepare($sqlcommand);
    $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	sendJsonError($gSqlErrorStr);
    }
    $geoJsonString .= ",\n";
    for ($i = 0; $i < $numrows; $i++)
    {
	my ($linestring) = $stmt->fetchrow_array;
        my $feature = "{ \"type\" : \"Feature\", \"properties\" : { \"type\" : \"target\" },\n";
	$feature .= "\"geometry\" : { \"type\" : \"LineString\", \"coordinates\" :\n    [\n";
       	$linestring =~ /LINESTRING\((.+?)\)/;
	my $coordstring = $1;
	my @points = split(",",$coordstring);
        my $bFirst = 1;
	foreach my $lnglat (@points)
	{
	    my @coords = split(" ",$lnglat);
	    if ($bFirst == 1)
	    {
		$feature .= "      [$coords[0],$coords[1]]";
		$bFirst = 0;
	    }
	    else 
	    {
		$feature .= ",\n      [$coords[0],$coords[1]]";
	    }
	}
	$feature .= "\n    ]\n}}";
	$geoJsonString .= ",\n" if ($i > 0);
	$geoJsonString .= $feature;
    }
    $geoJsonString .= "]";
    printJsonHeader;
    print $geoJsonString;
}

# Create a CSV file on the server that includes the match point information
# plus the metrics information for a particular experiment
# Arguments (via CGI)
#   experimentid                  Id of the "experiment"
#   line_flag                     True if this is a line type feature, else false
# Returns JSON object with attribute "csvfile:" that has the full download
# link as its value
sub exportMetrics
{
    my $expId = $cgi->param('experimentid');
    my $lineFlag = $cgi->param('lineflag');
    my $standardDev = 0.0;
    if (!$expId)
    {
       sendJsonError("Missing experiment Id"); 
    }
    $lineFlag = "false" if !($lineFlag);
    # delete any old CSV files
    `rm $homedir/exported/*.csv`;
    my $csvfile = "$homedir/exported/Experiment$expId.csv";
    my $fh;
    if (!open($fh, '>:encoding(UTF-8)', $csvfile))
    {
	sendJsonError("Cannot open CSV file $csvfile\n");
    }
    # first we get and write the match data points or lines
    my $sqlcommand = "select refdataid, ref_isquery, targetdataid, target_isquery from experiment where id = $expId;"; 
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	sendJsonError($gSqlErrorStr);
    }
    if ($numrows == 0)
    {
	sendJsonError("Invalid experiment Id");
    }
    my @row  = $stmt->fetchrow_array;
    my ($refdataid,$ref_isquery,$targetdataid,$target_isquery) = @row;
    my ($reftable,$targettable);
    if ($lineFlag eq 'false')
    {
	$reftable = "uploadpoints";
	$reftable = "querypoints" if $ref_isquery;
	$targettable = "uploadpoints";
	$targettable = "querypoints" if $target_isquery;
	$sqlcommand ="select p.refid,refsource.featurename as refname,ST_AsText(refsource.geom) as refcoords,p.targetid,targsource.featurename as targetname,ST_AsText(targsource.geom) as targetcoords,distance from pointmatch as p, $reftable as refsource, $targettable as targsource where p.experimentid = $expId and p.refid=refsource.id and p.targetid=targsource.id;";
	logentry("About to execute: |$sqlcommand|\n");
	$stmt = $gDbh->prepare($sqlcommand);
	$numrows = $stmt->execute;
	$gSqlError= $gDbh->err;
	$gSqlErrorStr = $gDbh->errstr;
	if ($gSqlError != 0)
	{
	    sendJsonError($gSqlErrorStr);
	}
	print $fh "Ref Point Name\tRef Point Coords\tTarget Point Name\tTarget Point Coords\tDistance\n"; 
	for (my $i = 0; ($i < $numrows); $i=$i+1)
        {
	    my $hashref = $stmt->fetchrow_hashref("NAME_lc");
	    my $point = $hashref->{'refcoords'};
	    $point =~ /POINT\((\-?\d+.\d+) (\-?\d+.\d+)/; 
	    # reformat WKT representation into JSON
	    my ($reflng, $reflat) = ($1, $2);
	    $point = $hashref->{'targetcoords'};
	    $point =~ /POINT\((\-?\d+.\d+) (\-?\d+.\d+)/; 
	    # reformat WKT representation into JSON
	    my ($targlng, $targlat) = ($1, $2);
	    print $fh "\"$hashref->{'refname'}\"\t$reflng $reflat\t\"$hashref->{'targetname'}\"\t$targlng $targlat\t$hashref->{'distance'}\n"; 
	}
	$sqlcommand ="select stddev(distance) as stdev from pointmatch where experimentid = $expId and targetid != -1;";
	# -1 indicates no match 
	logentry("About to execute: |$sqlcommand|\n");
	$stmt = $gDbh->prepare($sqlcommand);
	$numrows = $stmt->execute;
	$gSqlError= $gDbh->err;
	$gSqlErrorStr = $gDbh->errstr;
	if ($gSqlError != 0)
	{
	    sendJsonError($gSqlErrorStr);
	}
	if ($numrows == 1)
        {
	    @row  = $stmt->fetchrow_array;
	    $standardDev = $row[0];
	}
    }
    else
    {
	$sqlcommand ="select p.refid,refsource.featurename as refname,targsource.refpointcount,p.targetid,ST_NumPoints(targsource.geom) as targpointcount,distance,deltalength,targsource.matchpercent as matchpercent,targsource.meandistance as meandist,targsource.stdevdistance as stdevdist from linematch as p, uploadlines as refsource, querylines as targsource where p.experimentid = $expId and p.refid=refsource.id and p.targetid=targsource.id;";
	logentry("About to execute: |$sqlcommand|\n");
	$stmt = $gDbh->prepare($sqlcommand);
	$numrows = $stmt->execute;
	$gSqlError= $gDbh->err;
	$gSqlErrorStr = $gDbh->errstr;
	if ($gSqlError != 0)
	{
	    sendJsonError($gSqlErrorStr);
	}
	print $fh "Ref Line Name\tRef Line Point Count\tTarget Line Point Count\t Distance\t Length Difference\t Point Match Percent\t Point Mean Distance\t Point Stdev Distance\n"; 
	for (my $i = 0; ($i < $numrows); $i=$i+1)
        {
	    my $hashref = $stmt->fetchrow_hashref("NAME_lc");
	    print $fh "\"$hashref->{'refname'}\"\t$hashref->{'refpointcount'}\t$hashref->{'targpointcount'}\t$hashref->{'distance'}\t$hashref->{'deltalength'}\t$hashref->{'matchpercent'}\t$hashref->{'meandist'}\t$hashref->{'stdevdist'}\n"; 
	}
	$sqlcommand ="select stddev(distance) as stdev from linematch where experimentid = $expId;";
	logentry("About to execute: |$sqlcommand|\n");
	$stmt = $gDbh->prepare($sqlcommand);
	$numrows = $stmt->execute;
	$gSqlError= $gDbh->err;
	$gSqlErrorStr = $gDbh->errstr;
	if ($gSqlError != 0)
	{
	    sendJsonError($gSqlErrorStr);
	}
	if ($numrows == 1)
        {
	    @row  = $stmt->fetchrow_array;
	    $standardDev = $row[0];
	}
    }
    # Now get and export overall metrics 
    my $r_mastertable = "uploaddata";
    $r_mastertable = "querydata" if $ref_isquery eq 'true';
    my $t_mastertable = "querydata";
    $t_mastertable = "uploaddata" if $target_isquery eq 'false';
    $sqlcommand = "select dataname as refdataname from $r_mastertable where id = $refdataid;";
    $stmt = $gDbh->prepare($sqlcommand);
    $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	sendJsonError($gSqlErrorStr);
    }
    my @row  = $stmt->fetchrow_array;
    my $refdataname = $row[0];
    $sqlcommand = "select dataname as targetdataname, pixelsize from $t_mastertable where id = $targetdataid;";
    $stmt = $gDbh->prepare($sqlcommand);
    $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	sendJsonError($gSqlErrorStr);
    }
    my @row  = $stmt->fetchrow_array;
    my $targetdataname = $row[0];
    my $pixelsize = $row[1];
    $pixelsize = 'NA' if ($lineFlag eq 'false');
    $sqlcommand = "select ref_featurecount,target_featurecount,matchcount,averagedistance,averagedelta,buffer,nameflag,edited from experiment where id=$expId;";
    $stmt = $gDbh->prepare($sqlcommand);
    $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	sendJsonError($gSqlErrorStr);
    }
    my $hashref = $stmt->fetchrow_hashref("NAME_lc");
    my $completeness = ($hashref->{'matchcount'}/$hashref->{'ref_featurecount'}) * 100;
    print $fh "\nSUMMARY\n";
    print $fh "\nRef Dataset\tTarget Dataset\tReference Feature Count\t Target Feature Count\t Match Count\t Completeness (%)\t Avg. Distance (m)\t Std. Dev. Distance\t Avg. Length Difference\t Distance Buffer (m)\t Used Names\t Edited\n";
    my $nameflag = ($hashref->{'nameflag'} ? "true" : "false");
    my $edited = ($hashref->{'edited'} ? "true" : "false");
    print $fh "$refdataname\t$targetdataname\t$hashref->{'ref_featurecount'}\t$hashref->{'target_featurecount'}\t$hashref->{'matchcount'}\t$completeness\t$hashref->{'averagedistance'}\t$standardDev\t$hashref->{'averagedelta'}\t$hashref->{'buffer'}\t$nameflag\t $edited\n";
    print $fh "Calculated pixel size = $pixelsize meters\n";
    close $fh;
    printJsonHeader;
    my $link = "$server_root/MapEval/exported/Experiment$expId.csv";
    my $json = "{ \"csvfile\" : \"$link\"}";
    print $json;

}

##############################################
# Functions for deleting/cleaning up data
##############################################
# All the subfunctions that start with _ assume
# their caller is managing the transaction.

# Delete all the points returned from a query or all
# lines extracted from a static image
# Arguments (passed)
#   dataid   Id of the querydata record
# Return 1 if successful, 0 if error
# Note this does not affect the contents of
# the pointmatch or linematch tables, which will still hold feature IDs.
# It will no longer be possible to get the coordinates of
# those points or extracted linear features.
sub _deleteQueryDataDetails
{
    my $dataid = shift;
    my $status = 1;
    my $featuretype;
    my $deletetable = "querypoints";
    my $sqlcommand = "select c.featuretype from querydata q, categories c where q.id = $dataid and c.id=q.categoryid;";
    logentry("About to execute: |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    if ($gSqlError != 0)
    {
	$status = 0;
    }
    if (($status) && ($numrows > 0))
    {
	($featuretype) = $stmt->fetchrow_array;
	$deletetable = "querylines" if ($featuretype == 1);
	my $sqlcommand = "delete from $deletetable where dataid = $dataid;";
	logentry("About to execute: |$sqlcommand|\n");
	execSqlCommand($sqlcommand);
	if ($gSqlError != 0)
	{
	    $status = 0;
	}
    }
    elsif (($status) && ($numrows == 0))
    {
	$gAppErrorStr = "Invalid data id";
	$status = 0;
    }
    # modify the parent table to indicate the details are gone
    if ($status)
    {
	$sqlcommand = "update querydata set deleted = 't' where id = $dataid;";
	logentry("About to execute: |$sqlcommand|\n");
	execSqlCommand($sqlcommand);
	if ($gSqlError != 0)
	{
	    $status = 0;
	}
    }
    return $status;
}

# Delete all information associated with an experiment
# Arguments (passed)
#   expid          Id of the experiment
# Return 1 if successful, 0 if error
sub _deleteExperiment
{
    my ($expid) = @_;
    my $status = 1;
    my $featuretype;
    my $sqlcommand = "select c.featuretype from categories c, uploaddata u, experiment e where e.id=$expid and e.refdataid = u.id and c.id = u.categoryid;";
    logentry("About to execute: |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    if ($gSqlError != 0)
    {
	$status = 0;
    }
    if (($status) && ($numrows == 0))
    {
	$gAppErrorStr = "Invalid data id";
	$status = 0;
    }
    if ($status)
    {
	($featuretype) = $stmt->fetchrow_array;
   
	my $matchtable = "pointmatch";
	$matchtable = "linematch" if ($featuretype == 1);
	$sqlcommand = "delete from $matchtable where experimentid=$expid;";
	logentry("About to execute: |$sqlcommand|\n");
	execSqlCommand($sqlcommand);
	if ($gSqlError != 0)
	{
	    $status = 0;
	}
    }
    if (($status) && ($featuretype == 1))
    {
	# need to delete all query lines associated with the experiment 
	$sqlcommand = "delete from querylines where experimentid=$expid";
	logentry("About to execute: |$sqlcommand|\n");
	execSqlCommand($sqlcommand);
	if ($gSqlError != 0)
	{
	    $status = 0;
	}

    }
    if ($status)
    {
	$sqlcommand = "delete from experiment where id=$expid";
	logentry("About to execute: |$sqlcommand|\n");
	execSqlCommand($sqlcommand);
	if ($gSqlError != 0)
	{
	    $status = 0;
	}
    }
    return $status;
}

# Delete all information about a query dataset, either
# lines or static images. This includes deleting
# any experiments that used that data set, and the
# corresponding point or line matches.
# Arguments (passed)
#   querydataid   Id of the query data set
# Returns 1 if successful, 0 if error.
# Note this will also delete the static image file
sub _deleteQueryDataSet
{
    my $dataid = shift;
    my $status = 1;
    my $sqlcommand = "select q.imgfilename,c.featuretype from querydata q,categories c where q.id=$dataid and c.id=q.categoryid;";
    logentry("About to execute: |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	$status = 0;
    }
    if (($status) && ($numrows == 0))
    {
	$gAppErrorStr = "Invalid data id";
	$status = 0;
    }
    my $filename;
    my $featuretype;
    if ($status)
    {
	($filename,$featuretype) = $stmt->fetchrow_array;
	$status = _deleteQueryDataDetails($dataid);
	`rm $filename` if (($status) && ($featuretype == 1));    # delete image file
    }
    # now delete all the experiments that use this dataid
    if ($status)
    {
	$sqlcommand = "select id from experiment where (targetdataid=$dataid and target_isquery='t') or (refdataid=$dataid and ref_isquery='t');";
	logentry("About to execute: |$sqlcommand|\n");
	$stmt = $gDbh->prepare($sqlcommand);
	$numrows = $stmt->execute;
	$gSqlError= $gDbh->err;
	if ($gSqlError != 0)
	{
	    $status = 0;
	}
    }
    if ($status)
    {
	my @experiments;
	for (my $i=0; $i<$numrows; $i++)
	{
	    my ($expid) = $stmt->fetchrow_array;
	    push @experiments,$expid;
	}
	my $len = @experiments;
	for (my $i=0; ($i<$len) && ($status); $i++) # delete the match info, then the experiment
	{
	    $status = _deleteExperiment($experiments[$i]);
	}
    }
    # finally delete the querydata row
    if ($status)
    {
	$sqlcommand = "delete from querydata where id=$dataid;";
	logentry("About to execute: |$sqlcommand|\n");
	execSqlCommand($sqlcommand);
	if ($gSqlError != 0)
	{
	    $status = 0;
	}
    }
    return $status;
}

# Delete all information about an uploaded dataset, either
# points or polylines. This includes deleting
# any experiments that used that data set, and the
# corresponding point or line matches.
# Arguments (passed)
#   uploaddataid   Id of the upload data set
# Returns 1 if successful, 0 if error
sub _deleteUploadDataSet
{
    my $dataid = shift;
    my $status = 1;
    my $sqlcommand = "select c.featuretype from uploaddata u,categories c where u.id=$dataid and c.id=u.categoryid;";
    logentry("About to execute: |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	$status = 0;
    }
    if (($status) && ($numrows == 0))
    {
	$gAppErrorStr = "Invalid data id";
	$status = 0;
    }
    my ($featuretype) = $stmt->fetchrow_array;
    my $coordtable = "uploadpoints";
    $coordtable = "uploadlines" if ($featuretype == 1);  # linear features
    if ($status)
    {
	$sqlcommand = "delete from $coordtable where dataid = $dataid;";
	logentry("About to execute: |$sqlcommand|\n");
	execSqlCommand($sqlcommand);
	if ($gSqlError != 0)
	{
	    $status = 0;
	}
    }
    if ($status)
    {
	# now delete all the experiments that use this dataid
	$sqlcommand = "select id from experiment where (targetdataid=$dataid and target_isquery='t') or (refdataid=$dataid and ref_isquery='t');";
	logentry("About to execute: |$sqlcommand|\n");
	$stmt = $gDbh->prepare($sqlcommand);
	$numrows = $stmt->execute;
	$gSqlError= $gDbh->err;
	$gSqlErrorStr = $gDbh->errstr;
	if ($gSqlError != 0)
	{
	    $status = 0;
	}
    }
    if ($status)
    {
	my @experiments;
	for (my $i=0; $i<$numrows; $i++)
	{
	    my ($expid) = $stmt->fetchrow_array;
	    push @experiments,$expid;
	}
	my $len = @experiments;
	for (my $i=0; ($i<$len) && ($status); $i++) # delete the match info, then the experiment
	{
	    $status = _deleteExperiment($experiments[$i]);
	}
    }
    # finally delete the uploaddata row
    if ($status)
    {
	$sqlcommand = "delete from uploaddata where id=$dataid;";
	logentry("About to execute: |$sqlcommand|\n");
	execSqlCommand($sqlcommand);
	if ($gSqlError != 0)
	{
	    $status = 0;
	}
    }
    return $status;
}

# Delete a region. This has a cascade effect
# deleting all query or upload data associated with the region
# Arguments (passed)
#   regionid   Id of the region to delete
# Returns 1 if successful, 0 if error 
sub _deleteRegion
{
    my $regionid = shift;
    my $status = 1;
    my @datasets;
    # Need to delete querydata first because querylines references uploadlines if we
    # have done any experiments
    my $sqlcommand = "select id from querydata where regionid=$regionid;";
    logentry("About to execute: |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    $gSqlError= $gDbh->err;
    $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
    {
	$status = 0;
    }
    if ($status)
    {
	for (my $i=0; $i<$numrows; $i++)
	{
	    my ($dataid) = $stmt->fetchrow_array;
	    push @datasets,$dataid;
	}
	my $len = @datasets;
	for (my $i=0; ($i<$len) && ($status); $i++) 
	{
	    $status = _deleteQueryDataSet($datasets[$i]);
	}
    }
    if ($status)
    {
	$sqlcommand = "select id from uploaddata where regionid=$regionid;";
	logentry("About to execute: |$sqlcommand|\n");
	$stmt = $gDbh->prepare($sqlcommand);
	$numrows = $stmt->execute;
	$gSqlError= $gDbh->err;
	if ($gSqlError != 0)
	{
	    $status = 0;
	}
    }
    @datasets = ();   #empty so we can reuse
    if ($status)
    {
	for (my $i=0; $i<$numrows; $i++)
	{
	    my ($dataid) = $stmt->fetchrow_array;
	    push @datasets,$dataid;
	}
	my $len = @datasets;
	for (my $i=0; ($i<$len) && ($status); $i++)
	{
	    $status = _deleteUploadDataSet($datasets[$i]);
	}
    }
    if ($status)
    {
	#finally delete the region itself
	$sqlcommand = "delete from regions where id=$regionid;";
	logentry("About to execute: |$sqlcommand|\n");
	execSqlCommand($sqlcommand);
	if ($gSqlError != 0)
	{
	    $status = 0;
	}
    }
    return $status;
}

# Top level function for deleting data
# Arguments (via CGI)
#   mode        Specifies what category of data should be deleted
#   dataid      Unique DB ID of the data to be deleted
#               Interpreted based on mode:
#               1 - query data details (points or lines)
#               2 - entire query data set
#               3 - entire download data set
#               4 - a single experiment
#               5 - a region
#  For the first 3 modes, the ID is the data set ID
#  For mode 4 it is the experiment ID
#  For mode 5 it is the region ID
#  If an error occurs, rolls back the transaction and exits
#  Otherwise returns Success as JSON object              
sub deleteData
{
    my $mode = $cgi->param('mode');
    my $dataid = $cgi->param('dataid');
    if (!$mode)
    {
	sendJsonError("Missing 'mode' parameter");
    }
    if (!$dataid)
    {
	sendJsonError("Missing 'dataid' parameter");
    }
    my $status = 1;
    # start a transaction
    my $sqlcommand = "begin;";
    logentry("About to execute: |$sqlcommand|\n");
    execSqlCommand($sqlcommand);
    if ($gSqlError != 0)
    {
	sendJsonError;
    }
    if ($mode == 1)
    {
	$status = _deleteQueryDataDetails($dataid);
    }
    elsif ($mode == 2)
    {
	$status = _deleteQueryDataSet($dataid);
    }
    elsif ($mode == 3)
    {
	$status = _deleteUploadDataSet($dataid);
    }
    elsif ($mode == 4)
    {
	$status = _deleteExperiment($dataid);
    }
    elsif ($mode == 5)
    {
	$status = _deleteRegion($dataid);
    }
    else
    {
	rollbackAndError("Invalid mode specified for deleteData function");
    }

    if (!$status)
    {
	rollbackAndError($gAppErrorStr);
    }
    $sqlcommand = "commit;";
    logentry("About to execute: |$sqlcommand|\n");
    execSqlCommand($sqlcommand);
    if ($gSqlError != 0)
    {
	rollbackAndError;
    }
    else
    {
	sendJsonSuccess("Data deleted");
    }
    
}


# Return the API key information for all providers in the system
# No arguments
# Returns as a JSON array
sub getProviderKeys
{
    my $sqlcommand = "select k.providerid, p.providername, k.pointkey, k.imagekey from apikeys k, providers p where p.id = k.providerid order by k.providerid;";
    logentry("About to execute: |$sqlcommand|\n");
    my $stmt = $gDbh->prepare($sqlcommand);
    my $numrows = $stmt->execute;
    my $gSqlError= $gDbh->err;
    my $gSqlErrorStr = $gDbh->errstr;
    if ($gSqlError != 0)
	{
	sendJsonError($gSqlErrorStr);
	}
    printJsonHeader;
    my @retarray;
    for (my $i = 0; ($i < $numrows); $i=$i+1)
        {
	my $hashref = $stmt->fetchrow_hashref("NAME_lc");
        push @retarray,$hashref;
	}
    my $json = to_json (\@retarray);
    print $json;
}



##############################################
# Main part of script begins here
##############################################

binmode(STDOUT, ":utf8");

$gDbh = db_connect($wwwuser,$dbname);
($gDbh) or sendJsonError(DBI->errstr);

logentry("Action is $gAction\n");

if (!defined $gAction)
{
    sendJsonError("No Action specified");
}
elsif (($gAction eq "Regions") || ($gAction eq "regions"))
{
    getRegions;
}
elsif (($gAction eq "Categories") || ($gAction eq "categories"))
{
    getCategories;
}
elsif (($gAction eq "Providers") || ($gAction eq "providers"))
{
    getProviders;
}
elsif (($gAction eq "Experiments") || ($gAction eq "experiments"))
{
    getExperiments;
}
elsif (($gAction eq "NewQueryData") || ($gAction eq "newquerydata"))
{
    newQueryData;
}
elsif (($gAction eq "NewUploadData") || ($gAction eq "newuploaddata"))
{
    newUploadData;
}
elsif (($gAction eq "NewRegion") || ($gAction eq "newregion"))
{
    newRegion;
}
elsif (($gAction eq "epsg") || ($gAction eq "EPSG"))
{
    getEPSG;
}
elsif (($gAction eq "getuploaddata") || ($gAction eq "GetUploadData"))
{
    getUploadData;
}
elsif (($gAction eq "getquerydata") || ($gAction eq "GetQueryData"))
{
    getQueryData;
}
elsif (($gAction eq "calculatemetrics") || ($gAction eq "CalculateMetrics"))
{
    calculateMetrics;
}
elsif (($gAction eq "getdatapoints") || ($gAction eq "GetDataPoints"))
{
    getDataPoints;
}
elsif (($gAction eq "getmatchpoints") || ($gAction eq "GetMatchPoints"))
{
    getMatchPoints;
}
elsif (($gAction eq "getmatchlines") || ($gAction eq "GetMatchLines"))
{
    getMatchLines;
}
elsif (($gAction eq "exportmetrics") || ($gAction eq "ExportMetrics"))
{
    exportMetrics;
}
elsif (($gAction eq "deletedata") || ($gAction eq "DeleteData"))
{
    deleteData;
}
elsif (($gAction eq "getproviderkeys") || ($gAction eq "GetProviderKeys"))
{
    getProviderKeys;
}
else
{
    sendJsonError("Invalid action specified");
}
logentry("Leaving Perl Script for action $gAction\n");



