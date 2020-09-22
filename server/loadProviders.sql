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
-- Script to load providers and user-specific API keys into the database 
--    for MapEval system
--
-- IMPORTANT: If you are configuring a new MapEval server, you 
-- must obtain your own API keys and substitute them in the
-- code below. 
--
--  The database is called mapevaldata. It is PostGIS enabled.
-- 
--  Created by Sally Goldin, 5 November 2019
--
--  Should be modified by every new user/installation to establish providers
--  and associated keys
--
--   Copyright 2018 Department of Computer Engineering, KMUTT
--
--   $Id: loadProviders.sql,v 1.2 2019/11/12 10:55:00 goldin Exp $
--
--   $Log: loadProviders.sql,v $
--   Revision 1.2  2019/11/12 10:55:00  goldin
--   use my api key for both Google APIs
--
--   Revision 1.1  2019/11/05 07:42:22  goldin
--   customizable script to initialize providers and keys in the DB
--
-- 

insert into providers (providername,coveragearea) values
          ('Bing Europe',ST_GeomFromText('POLYGON((-30.0 70.0,
                                   45.0 70.0,
                                   45.0 30.0,
                                  -30.0 30.0,
                                  -30.0 70.0))',4326));
insert into providers (providername,coveragearea) values
          ('Bing North America',ST_GeomFromText('POLYGON((-145.0 75.0,
                                  -45.0 75.0,
                                  -45.0 15.0,
                                  -145.0 15.0,
                                  -145.0 75.0))',4326));
insert into providers (providername,coveragearea) values
          ('Google',null);
insert into providers (providername,coveragearea) values
          ('Here',null);
insert into providers (providername,coveragearea) values
          ('MapQuest North America',ST_GeomFromText('POLYGON((-145.0 75.0,
                                  -45.0 75.0,
                                  -45.0 15.0,
                                  -145.0 15.0,
                                  -145.0 75.0))',4326));
insert into providers (providername,coveragearea,negate) values
          ('MapQuest outside North America',
	  	     ST_GeomFromText('POLYGON((-145.0 75.0,
                                  -45.0 75.0,
                                  -45.0 15.0,
                                  -145.0 15.0,
                                  -145.0 75.0))',4326), true);

--  API KEYS --
-- updated with Sally's key 2019-09-17 

insert into apikeys (providerid,pointkey,imagekey) values 
  ((select id from providers where providername='Google'),
   'GOOGLEPOINTKEY',
   'GOOGLEIMAGEKEY');	

insert into apikeys (providerid,pointkey,imagekey) values 
  ((select id from providers where providername='Bing Europe'),
   'BINGPOINTKEY',
   'BINGIMAGEKEY');	

insert into apikeys (providerid,pointkey,imagekey) values 
  ((select id from providers where providername='Bing North America'),
   'BINGPOINTKEY',
   'BINGIMAGEKEY');	

insert into apikeys (providerid,pointkey,imagekey) values 
  ((select id from providers where providername='MapQuest North America'),
   'AgUpgrwY5LDtA-YEHRwMu2PuTl4Krk1fkFaDATSiqEngyriQgsxCjbSdyUdgnMX8',
   'MAPQUESTPOINTKEY',
   'MAPQUESTIMAGEKEY');	

insert into apikeys (providerid,pointkey,imagekey) values 
  ((select id from providers where providername='MapQuest outside North America'),
   'MAPQUESTPOINTKEY',
   'MAPQUESTIMAGEKEY');	

-- for Here, first item is 'app_id', second is 'app_code' --
insert into apikeys (providerid,pointkey,imagekey) values 
  ((select id from providers where providername='Here'),
   'HEREAPIID',
   'HEREAPPCODE');	

