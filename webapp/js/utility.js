/*	$Id: utility.js,v 1.3 2019/10/17 03:48:12 goldin Exp $
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
 *  This file holds miscellaneous useful functions not specifically related to
 *  the map evaluation problem. It should be included before any other of
 *  our JavaScript files.
 *
 *  Created by Sally Goldin on 2019-09-03
 *
 *   $Log: utility.js,v $
 *   Revision 1.3  2019/10/17 03:48:12  goldin
 *   add blank line to force update
 *
 *   Revision 1.2  2019/09/03 10:13:28  goldin
 *   new utility scripts
 *
 *   Revision 1.1  2019/09/03 07:12:17  goldin
 *   New file for utility functions
 *
 */


function setWait()
{
    document.body.style.cursor  = 'wait'; 
}

function removeWait()
{
     document.body.style.cursor  = 'default'; 
}


