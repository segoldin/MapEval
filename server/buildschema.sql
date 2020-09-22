-- Copyright 2020 Sally E. Goldin
-- 
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
--    http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.
--
-- Script to initialize the  data base schema 
--    for MapEval system
--
--  The database is called mapevaldata. It is PostGIS enabled.
-- 
-- Created by Sally Goldin, 29 November 2018
--
--
--   $Id: buildschema.sql,v 1.32 2020/07/22 07:09:09 goldin Exp $
--
--   $Log: buildschema.sql,v $
--   Revision 1.32  2020/07/22 07:09:09  goldin
--   move category data load to buildschema.sql
--
--   Revision 1.31  2020/07/21 08:43:22  goldin
--   add X and Y pixel size to querydata table
--
--   Revision 1.30  2020/01/06 07:14:23  goldin
--   add new field to querylines to store ref feature count during vectorization
--
--   Revision 1.29  2020/01/01 09:22:41  goldin
--   add new fields to querylines to save percent matched, mean distance and standard deviation
--
--   Revision 1.28  2019/12/25 10:51:49  goldin
--   fix syntax error
--
--   Revision 1.27  2019/10/15 10:54:53  goldin
--   add new fields to querydata for lat/long center
--
--   Revision 1.26  2019/10/15 05:10:05  goldin
--   add code to create and return experiment names
--
--   Revision 1.25  2019/09/10 06:52:22  goldin
--   add table to hold api keys for each provider
--
--   Revision 1.24  2019/08/20 11:50:53  goldin
--   added center coordinates to querydata table
--
--   Revision 1.23  2019/06/12 11:48:37  goldin
--   added comments about SRS in querydata table
--
--   Revision 1.22  2019/06/11 10:12:11  goldin
--   change uploadlines table to web mercator
--
--   Revision 1.21  2019/05/31 08:39:36  goldin
--   complete roads calc metrics server side
--
--   Revision 1.20  2019/05/15 12:16:58  goldin
--   Add linematch table
--
--   Revision 1.19  2019/05/14 10:23:50  goldin
--   programming workflow for extracting and calculating linear features
--
--   Revision 1.18  2019/05/10 09:37:02  goldin
--   add information to the parameter file
--
--   Revision 1.17  2019/03/22 10:03:00  goldin
--   Added zoom column to query data
--
--   Revision 1.16  2019/02/15 10:12:37  goldin
--   modify to make name matching optional
--
--   Revision 1.15  2019/01/31 11:03:23  goldin
--   added new column to querydata for bounding box
--
--   Revision 1.14  2019/01/30 08:39:26  goldin
--   more work on metrics for roads
--
--   Revision 1.13  2019/01/23 10:12:59  goldin
--   working on image query upload
--
--   Revision 1.12  2019/01/16 09:11:51  goldin
--   add columns to store experiment results to experiment table
--
--   Revision 1.11  2019/01/11 12:48:04  goldin
--   add controls to test calculate metrics
--
--   Revision 1.10  2018/12/29 09:12:34  goldin
--   added negate flag to providers
--
--   Revision 1.9  2018/12/26 10:08:53  goldin
--   fix typo
--
--   Revision 1.8  2018/12/26 07:35:48  goldin
--   make featurename column longer
--
--   Revision 1.7  2018/12/24 09:03:54  goldin
--   add 'deleted' to query data, 'distance' to point match
--
--   Revision 1.6  2018/12/12 13:13:41  goldin
--   add some fields to the uploaddata table
--
--   Revision 1.5  2018/12/10 08:48:15  goldin
--   grant apache rights on spatial ref system table; round radius
--
--   Revision 1.4  2018/12/10 06:48:51  goldin
--   change corners of region bounding box
--
--   Revision 1.3  2018/12/05 10:38:58  goldin
--   implementing the server-side API
--
--   Revision 1.2  2018/12/03 08:03:46  goldin
--   modify schema to use more PostGIS columns
--
--   Revision 1.1  2018/11/29 10:59:20  goldin
--   first draft of db schema script
--
--
--

-- Be sure to create the database with -E utf8 encoding
--  createdb -E utf8 mapevaldata (command line)

-- Note we use geometry type, not geography, since we expect
-- regions to be small and errors due to spherical coordinates

--------------------------------------------------
-- Regions for which we are doing comparisons
--------------------------------------------------

create table regions (id serial primary key, 
		      regionname varchar(256),
		      x_sw  float,
		      y_sw  float,
                      x_ne  float,
                      y_ne  float,
                      radius  float,
   		      created timestamp default current_timestamp,
                      center geometry (point,4326),
                      boundingbox  geometry (polygon,4326));

--------------------------------------------------
-- Semantic categories for which we can search
--------------------------------------------------

create table categories (id serial primary key,
		     categoryname varchar(64),
		     featuretype  int);


-- For featuretype, 0 is point, 1 is polyline, 2 is polygon

--------------------------------------------------
-- Online map providers
--------------------------------------------------
create table providers (id serial primary key,
       	     	        providername varchar(64),
              	        created timestamp default current_timestamp,
			negate boolean default false,
		        coveragearea  geography (polygon,4326));

-- if coverage area is null, provider can be queried for entire world
-- otherwise, coverage area restricts regions for which provider can be used
-- Use geography because coverage area can be very large
-- If 'negate' is true, the provider can be used everywhere EXCEPT in
-- the coverage area


--------------------------------------------------
-- Online map provider API keys 
--------------------------------------------------
create table apikeys (id serial primary key,
       	     	        providerid integer not null references providers(id),
              	        pointkey varchar(256),
			imagekey varchar(256));

-- keep in the DB for better security
-- a provider is not required to have a key
-- point key is for dynamic point queries, image key is for static images
-- these two might be the same

--------------------------------------------------
-- Header for a set of geodata created by uploading a file
--------------------------------------------------
create table uploaddata (id serial primary key,
                         regionid integer not null references regions (id),
                         categoryid integer not null references categories (id),
                         dataname varchar(256),
                         comment varchar(512),
			 filename varchar(256),
			 originalformat varchar(16),
     		         created timestamp default current_timestamp);
                          
--------------------------------------------------
-- Header for a set of geodata created by provider query
-- origin_x, origin_y, center_x, center_y are in web mercator (3857)
-- bounding box is in lat long (4326)
-- both of these are relevant only for roads (raster) data
--------------------------------------------------

create table querydata (id serial primary key,
                         regionid integer not null references regions (id),
                         categoryid integer not null references categories (id),
                         providerid integer not null references providers (id),
                         dataname varchar(256),
			 zoom integer,
			 imgfilename varchar(512) default null,
			 origin_x float,
			 origin_y float,
			 center_x float,
			 center_y float,
			 center_lng float,
			 center_lat float,
			 pixelsize float,
			 pixelsizeX float,
			 pixelsizeY float,
			 boundingbox geometry (polygon,4326),
			 deleted boolean default false,
     		         created timestamp default current_timestamp);

--------------------------------------------------
-- Point features associated with an uploaded data set
--------------------------------------------------
create table uploadpoints (id serial primary key,
                           dataid integer not null references uploaddata (id),
                           featurename varchar(256),
                           metainfo varchar(256),
                           geom  geometry (point,4326));

--------------------------------------------------
-- Polyline features associated with an uploaded data set
--------------------------------------------------
create table uploadlines (id serial primary key,
                          dataid integer not null references uploaddata (id),
                          featurename varchar(256),
                          metainfo varchar(256),
                          geom  geometry (linestring,4326));

--------------------------------------------------
-- Point features associated with a queried data set
--------------------------------------------------
create table querypoints (id serial primary key,
                           dataid integer not null references querydata (id),
                           featurename varchar(256),
                           metainfo varchar(256),
                           geom geometry (point,4326));

--------------------------------------------------
-- Polyline features associated with an queried data set
-- Note these are in SRS 3857 - web mercator since they
-- are extracted from an image
--------------------------------------------------
create table querylines (id serial primary key,
                          experimentid integer not null, 
                          dataid integer not null references querydata (id),
			  uploadfeatureid integer references uploadlines(id),
                          featurename varchar(256),
                          metainfo varchar(256),
			  refpointcount integer,
			  matchpercent float,
			  meandistance float,
			  stdevdistance float,
                          geom geometry (linestring,3857));

--------------------------------------------------
-- Information on a metrics calculation
-- comparing two data sets
--------------------------------------------------
create table experiment (id serial primary key,
       	     		 refdataid integer,
                         ref_isquery boolean,
			 targetdataid integer,
			 target_isquery boolean,
			 buffer integer,
			 nameflag boolean,
			 edited boolean,
			 ref_featurecount integer,
			 target_featurecount integer,
			 matchcount integer,
			 averagedistance integer,
			 averagedelta integer,
			 experimentname varchar(256) default 'Not specified',
			 created timestamp default current_timestamp);


--------------------------------------------------
-- Points matched between two data sets in one experiment
--------------------------------------------------
create table pointmatch (experimentid integer references experiment(id),
                         refid integer,
			 targetid integer,
			 distance float,
			 metascore float);

--------------------------------------------------
-- Linear features matched between two data sets in one experiment
--      experimentid identifies the experiment
--      refid is feature ID of a line in uploadlines
--      targetid is feature ID of querylines element, or 0 if not found
-- 	distance is Hausdorf distance between the two lines or -1 if no match
--      deltalength is length of reference feature minus length of target feature
--------------------------------------------------
create table linematch (experimentid integer references experiment(id),
                         refid integer,
			 targetid integer default 0,
			 distance float default -1,
			 deltalength float);




--- populate categories

insert into categories (categoryname,featuretype) values ('schools',0);
insert into categories (categoryname,featuretype) values ('worship',0);
insert into categories (categoryname,featuretype) values ('hospitals',0);
insert into categories (categoryname,featuretype) values ('postoffices',0);
insert into categories (categoryname,featuretype) values ('roads',1);

-- For featuretype, 0 is point, 1 is polyline, 2 is polygon


alter role apache with login;
grant all on database mapevaldata to apache;
grant select,insert,update,delete on table regions to apache;
grant usage, select,update on table regions_id_seq to apache;
grant select,insert,update,delete on table categories to apache;
grant usage, select,update on table categories_id_seq to apache;
grant select,insert,update,delete on table providers  to apache;
grant usage, select,update on table providers_id_seq to apache;
grant select,insert,update,delete on table uploaddata  to apache;
grant usage, select,update on table uploaddata_id_seq to apache;
grant select,insert,update,delete on table querydata  to apache;
grant usage, select,update on table querydata_id_seq to apache;
grant select,insert,update,delete on table uploadpoints  to apache;
grant usage, select,update on table uploadpoints_id_seq to apache;
grant select,insert,update,delete on table uploadlines  to apache;
grant usage, select,update on table uploadlines_id_seq to apache;
grant select,insert,update,delete on table querypoints  to apache;
grant usage, select,update on table querypoints_id_seq to apache;
grant select,insert,update,delete on table querylines  to apache;
grant usage, select,update on table querylines_id_seq to apache;
grant select,insert,update,delete on table experiment  to apache;
grant usage, select,update on table experiment_id_seq to apache;
grant select,insert,update,delete on table pointmatch  to apache;
grant select,insert,update,delete on table linematch  to apache;
grant select,insert,update,delete on table apikeys  to apache;
grant usage, select,update on table apikeys_id_seq to apache;
grant select,update on table spatial_ref_sys to apache;


