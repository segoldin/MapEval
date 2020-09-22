/* Header file with definitions of functions related
 * to file I/O 
 * Include AFTER structures.h
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
 *   Sally Goldin, 22 June 2018 
 *
 *   $Id: fileFunctions.h,v 1.5 2019/08/26 09:42:07 goldin Exp $
 *   $Log: fileFunctions.h,v $
 *   Revision 1.5  2019/08/26 09:42:07  goldin
 *   new module to empirically discover pixel size
 *
 *   Revision 1.4  2019/06/12 11:48:09  goldin
 *   Working to evaluate quality of the results
 *
 *   Revision 1.3  2018/06/25 09:27:11  goldin
 *   new program to calculate the skeleton
 *
 *   Revision 1.2  2018/06/23 10:28:48  goldin
 *   continue working on pairing
 *
 *   Revision 1.1  2018/06/22 12:51:27  goldin
 *   Split into several C files, rework similarity
 *
 *
 */

/* Return the number of points in the list.
 * @param pHead    head of the list
 * @return number of items in the list
 */
int listSize(POINT_T* pHead);


/* Read a raw RGB file, one byte per color per pixel, into
 * a dynamically allocated byte array. Assumed to be 
 * binary so we keep only the first BYTE of each triad 
 * @param infile   name of file to read
 * @param width    number of pixels in each row
 * @param height   number of rows in the image
 * @return allocated, initialized image or NULL if error 
 */
BYTE* readImageFile(char* infile, int width, int height);

/* Read a raw RGB file, one byte per color per pixel, into
 * a dynamically allocated byte array.
 * Keeps all three bytes for each pixel
 * @param infile   name of file to read
 * @param width    number of pixels in each row
 * @param height   number of rows in the image
 * @return allocated, initialized image or NULL if error 
 */
BYTE* readColorImageFile(char* infile, int width, int height);


/* Write a feature to the output file.
 * Currently this is in Dragon Vector format
 * @param pHead        Starting point of feature
 * @param featureId    Numeric Id of the feature
 * @param pOut         File pointer for open text file.
 * @param color        If 0, calculate, otherwise use this color
 */
void writeFeature(POINT_T* pHead,int featureId,FILE* pOut,int color);



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


/* Read features from a Dragon vector file into memory, 
 * into a dynamically allocated array that can be sorted.
 * @param featureArray   Dynamically allocated array of FEATURE_T* 
 *                       big enough to hold all features in file
 * @param pIn            Pointer to open input file
 * @param arraySize      Capacity of the featureArray - used for error checks
 * @return number of features successfully read or -1 if an error occurs.
 */
int readFeatures(FEATURE_T* featureArray[], FILE* pIn, int arraySize);

/* Allocate an array of 'count' pointers to features. Then
 * open the passed filename (assumed to be a Dragon vector file)
 * and read the data into that array.
 * @param  count     Number of features believed to be in the file
 * @param  readFile  Name of file to read
 * @return newly allocated array of features or NULL if error occurred.
 */
FEATURE_T ** allocateAndRead(int count, char* readFile);


/* Write the byte data to an RGB file with three bytes per pixel 
 * (all three bytes identical). This is more convenient to work with
 * in ImageMagick.
 * @param   image      Byte array of data
 * @param   width      Number of pixels per line
 * @param   height     Number of lines
 * @param   outfile    Name of file to write
 * @return TRUE for success, FALSE for error.
 */
BOOL writeImageFile(BYTE* image,int width,int height,char* outfile);

/* Write data from a buffer into a raw RGB file, 
 * Image is one byte per pixel
 * Output is three bytes per pixel
 * Use the remap[][] to transform to output colors.
 * @param outfile  name of file to write
 * @param width    number of pixels in each row
 * @param height   number of rows in the image
 * @param remap    two dimensional transformation array (256 x 3) 
 *                 to control output colors.
 * @param image    buffer of all data (row major)
 * @return 1 for success, 0 for error
 */
int writeTransformedImageFile(char* outfile, int width, int height,BYTE remap[256][3],BYTE* image);


