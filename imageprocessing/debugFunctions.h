/* Declarations for functions used for debugging and printing
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
 *   Sally Goldin, recreated 19 Nov 2018 
 *
 *   $Id: debugFunctions.h,v 1.3 2019/08/27 09:07:39 goldin Exp $
 *   $Log: debugFunctions.h,v $
 *   Revision 1.3  2019/08/27 09:07:39  goldin
 *   add printNeighborhood
 *
 *   Revision 1.2  2019/06/13 08:00:52  goldin
 *   debugging
 *
 *   Revision 1.1  2018/11/19 09:46:45  goldin
 *   recreate - was lost
 *
 *
 *
 */
/* Print the angles between all arcs for a feature 'pFeature'.
 * 'which' is the array index, which allows us to identify which feature */
void printFeatureArcs(FEATURE_T* pFeature, int which);

/* Debugging function prints the coordinates in order */
void printList(POINT_T* pHead,int featureId,int pointCount);

/* Write a feature to the output file.
 * Create additional features of the same color for
 * each arc's normal vector. 
 * This is a debugging function so we can see if the normals
 * are being calculated as we expect.
 * @param pFeature     Feature to write
 * @param featureId    Numeric Id of the feature
 * @param pOut         File pointer for open text file.
 */
void writeFeatureWithNormals(FEATURE_T* pFeature,int featureId,FILE* pOut);

/* delete the old log file if any
 * and set new log file name 
 * @param logfilename
 */
void initLogging(char * logfilename);

/* Write a message to a log file 
 * Opens and closes the log file each time
 * to avoid problems with crashes.
 * Log file name is global to this module.
 * @param   message    Message to write - adds a newline
 */
void logMessage(char* message);

/* Traverse a linked list of points to count how many
 * items it contains.
 * @param first    Pointer to first point
 * @return how many items in the list
 */
int countPoints(POINT_T * first);


/* Print the image data in a neighborhood centered 
 * on x,y. Prints a '1' for white and a '0 for black.
 * @param image  BYTE array of data values to search
 * @param width  Width of the image
 * @param height Height of the image
 * @param x      Center pixel x
 * @param y      Center pixel y
 * @param tolerance Radius of region to search for the starting point 
 */
void printNeighborhood(BYTE* image,int width, int height,
		       int x, int y, int tolerance);


