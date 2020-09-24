# MapEval

Basic README for MapEval System                                   
===============================                                   

WHAT IS MAPEVAL?

MapEval is a software system for evaluating the quality of information produced by online mapping providers like Google Maps, Here Maps and so on. The target users are geographers, cartographers and other people interested in geospatial topics. MapEval provides a simple web-based interface which allows users to set up "experiments" that quantitatively compare point and polyline information from the online providers with reference information acquired from a trusted source such as a national or local mapping agency. The system computes a variety of metrics including accuracy and completeness.                                                                          

The system is open-source under the Apache 2.0 license. 

http://www.apache.org/licenses/

MapEval was originally developed and tested on a CentOS 6.3 Linux server. It requires a variety of open source packages, detailed below. Various components of the software are written in HTML, JavaScript, standard C and Perl.                           

ORGANIZATION OF THIS DISTRIBUTION

This distribution currently does not provide any detailed support for installing and configuring MapEval, just basic instructions.                                      

We will document the full process of creating a MapEval server in the near future.

The code tree is structured as follows:

Top level - documentation, license, etc.

--- imageprocessing - programs and scripts used to process static image maps
    to extract polyline information                                         

--- dataPreprocessing - program to test and modify shape files used for
    reference data to put them in the format required by the system    

--- server - database configuration scripts; Perl script which provides most
     of the processing logic for the system                                 

--- webapp - HTML and css code for the user interface

------ js - JavaScript files used to control the UI and 
       to communicate between the UI and the server.    

SOFTWARE PREREQUISITES

In addition to the code in this distribution, MapEval requires the
following packages to be installed on the server                  

-- Apache (or other web server)
-- PostgreSQL relational database system (9.6 or later)
-- PostGIS geographic extension 3.0 (and dependencies) 
-- ImageMagick (6.9.3 or later)                        
-- Perl 5.10                                           
-- Perl modules                                        
    Encode                                             
    CGI                                                
    DBI                                                
    File                                               
    Time::HiRes                                        
    JSON                                               
    JSON::Parse                                        
    Data::Dumper                                       
    Data::Peek                                         
    LWP::Simple                                        
    Math::Trig                                         
    List::Util                                         
    XML::Simple                                        
-- shapelib (https://github.com/OSGeo/shapelib)        

DATABASE

MapEval uses a PostGIS-enabled PostgreSQL database called mapevaldata.

This database must be created manually using PostgreSQL commands.

An SQL script called buildschema.sql, which will create all the needed tables, can be found in the server subdirectory.                                                 

BASIC CONFIGURATION

The mapevalServer.pl file is expected to reside in a subdirectory of the standard cgi-bin area set up with Apache, for instance:                                        

/var/www/cgi-bin/MapEval

The C files, html file and css file should be placed in a subdirectory under the document root, for instance:                                                           

/var/www/html/MapEval

Permissions on this directory must allow reading, writing and directory creation by the process that runs the web server (e.g. "apache" user).                          

Once the C source files have been moved to this directory, the executables must be built. To do this, type:                                                             

make -f Makefile
make -f Makefile2

Note that the shapelib include files are expected to be in a subdirectory and the shapelib shareable libraries already installed on the system, in order to build the prepareShpFiles executable. See Makefile2 for details.                                

The JavaScript files are expected to be in a further subdirectory called 'js'

/var/www/html/MapEval/js

API KEYS AND MAP PROVIDERS

The current version of MapEval supports four online map providers: Bing Maps, Google Maps, Here Maps and MapQuest. The system is designed to allow new providers to be added. There are two aspects to this:                                                

-- Code must be added to map_APIs.js to issue the necessary queries for the new provider.                                                                               
-- The provider must be added to the database.

The loadProviders.sql script, in the server subdirectory, creates records in the database for each provider. It also sets the "API keys" for each provider.

An API key is a special string that provides access to the provider's capabilities. All the providers we have worked with use this method to identify and authorize users of their APIs. Each installation must register for its own keys, for each provider. In some cases, this may require providing financial information.

The loadProviders.sql script includes dummy keys which must be replaced by valid keys, before the script is run, in order for the queries to work. The loadProviders.sql script must be run after the database tables have been created.

The index.html file which instantiates the web interface also references one API key, for Google Maps. Search for "DUMMYAPIKEY" and replace that string with your personal credentials.





