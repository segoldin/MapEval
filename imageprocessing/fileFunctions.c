/* Component of the vectorize application.
 * Holds functions used for file I/O - just to simplify the main program
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
 *   Created by Sally Goldin, 22 June 2018 
 *
 *   $Id: fileFunctions.c,v 1.5 2019/08/26 09:42:07 goldin Exp $
 *   $Log: fileFunctions.c,v $
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

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "structures.h"
#include "fileFunctions.h"


/* Return the number of points in the list.
 * @param pHead    head of the list
 * @return number of items in the list
 */
int listSize(POINT_T* pHead)
{
  int count = 0;
  POINT_T* pCurrent = pHead;
  while (pCurrent != NULL)
    {
    count++;
    pCurrent = pCurrent->next;
    }
  return count;
}


/* Read a raw RGB file, one byte per color per pixel, into
 * a dynamically allocated byte array. Assumed to be 
 * binary so we keep only the first BYTE of each triad 
 * @param infile   name of file to read
 * @param width    number of pixels in each row
 * @param height   number of rows in the image
 * @return allocated, initialized image or NULL if error 
 */
BYTE* readImageFile(char* infile, int width, int height)
{
  int x = 0;
  int y = 0;
  FILE * pIn = NULL;
  BYTE * buffer = NULL;
  BYTE * image = NULL;

  image = (BYTE*) calloc(width*height,sizeof(BYTE));
  /* buffer can hold one line, 3 bytes per pixel */
  buffer = (BYTE*) calloc(width*3,sizeof(BYTE));
  if ((image == NULL) || (buffer == NULL))
     {
     printf("Error allocating image array or buffer\n");  
     return NULL;
     }
  pIn = fopen(infile,"rb");
  if (pIn == NULL)
     {
     printf("Error opening input image %s\n", infile);
     free(buffer);
     free(image);
     return NULL;
     }
  for (y = 0; y < height; y++)
     {
     int retval;
     retval = fread(buffer,sizeof(BYTE),width*3,pIn);
     if (retval  == width*3)
        {
	for (x = 0; x < width; x++)
	    {
	    pixval(x,y,width) = buffer[x*3]; // only need first byte of triplet            
            }
        } 
     else 
        {
	printf("ERROR - fread returned wrong value %d for line %d\n", retval,y);
	free(buffer);
	free(image);
	return NULL;
        } 
     }
  free(buffer);
  fclose(pIn);
  return image;
}


/* Read a raw RGB file, one byte per color per pixel, into
 * a dynamically allocated byte array.
 * Keeps all three bytes for each pixel
 * @param infile   name of file to read
 * @param width    number of pixels in each row
 * @param height   number of rows in the image
 * @return allocated, initialized image or NULL if error 
 */
BYTE* readColorImageFile(char* infile, int width, int height)
{
  int x = 0;
  int y = 0;
  FILE * pIn = NULL;
  BYTE * buffer = NULL;
  BYTE * image = NULL;

  image = (BYTE*) calloc(width*height*3,sizeof(BYTE));
  /* buffer can hold one line, 3 bytes per pixel */
  buffer = (BYTE*) calloc(width*3,sizeof(BYTE));
  if ((image == NULL) || (buffer == NULL))
     {
     printf("Error allocating image array or buffer\n");  
     return NULL;
     }
  pIn = fopen(infile,"rb");
  if (pIn == NULL)
     {
     printf("Error opening input image %s\n", infile);
     free(buffer);
     free(image);
     return NULL;
     }
  for (y = 0; y < height; y++)
     {
     int retval;
     retval = fread(buffer,sizeof(BYTE),width*3,pIn);
     if (retval == width*3)
        {
	memcpy(&image[y*width*3],buffer,width*3);
        } 
     else 
        {
	printf("ERROR - fread returned wrong value %d for line %d\n", retval,y);
	free(buffer);
	free(image);
	return NULL;
        } 
     }
  free(buffer);
  fclose(pIn);
  return image;
}



/* Write a feature to the output file.
 * Currently this is in Dragon Vector format
 * @param pHead        Starting point of feature
 * @param featureId    Numeric Id of the feature
 * @param pOut         File pointer for open text file.
 * @param color        If zero, calculate, otherwise use this color
 */
void writeFeature(POINT_T* pHead,int featureId,FILE* pOut,int color)
{
    POINT_T * pCurrent = pHead;
    int useColor = color;
    if (useColor == 0)
       useColor = (featureId*20)%255;
    /* final item is color - want each feature to contrast with previous */
    fprintf(pOut,"-FIGURE %d L %d %d\n",featureId,
	    listSize(pHead),useColor);
    fflush(pOut);
    while (pCurrent != NULL)
      {
      fprintf(pOut,"-COORDS %.2lf %.2lf 0\n", 
	      (double) pCurrent->x,(double) pCurrent->y);
      fflush(pOut);
      pCurrent = pCurrent->next;
      }
}




/* Read features from a Dragon vector file into memory, 
 * into a dynamically allocated array that can be sorted.
 * @param featureArray   Dynamically allocated array of FEATURE_T* 
 *                       big enough to hold all features in file
 * @param pIn            Pointer to open input file
 * @param arraySize      Capacity of the featureArray - used for error checks
 * @return number of features successfully read or -1 if an error occurs.
 */
int readFeatures(FEATURE_T* featureArray[], FILE* pIn, int arraySize)
{
#define FIGURE "-FIGURE"
#define COORDS "-COORDS"
#define END "-END"

  int count = 0;
  POINT_T * pNewPoint = NULL;
  FEATURE_T* pNewLine = NULL;
  double x = 0;
  double y = 0;
  char buffer[128];
  while (fgets(buffer,sizeof(buffer),pIn) != NULL)
    {
    if (strncmp(buffer,FIGURE,strlen(FIGURE)) == 0)  /* start of a new feature */
       {
       if (count >= arraySize)
	  continue;  /* still read but don't store */
       pNewLine = calloc(1,sizeof(FEATURE_T));
       if (pNewLine == NULL)
	  {
	  printf("Error allocating feature %d\n",count);
	  return -1;
	  }
       featureArray[count] = pNewLine;
       count++;
       }  
    else if (strncmp(buffer,COORDS,strlen(COORDS)) == 0)
       {
       if (count > arraySize) /* note pure inequality here */
			      /* want to be sure we read the points for the last feature */
	  continue;  
       sscanf(buffer,"-COORDS %lf %lf",&x,&y);
       pNewPoint = calloc(1,sizeof(POINT_T));
       if (pNewPoint == NULL)
	  {
	  printf("Error allocating point structure (%lf,%lf)\n",x,y);
	  return -1;
	  }
       pNewPoint->x = (int) x;
       pNewPoint->y = (int) y;
       pNewLine->pointCount++;
       /* add to list on the feature */
       if (pNewLine->first == NULL)
	  {
	  pNewLine->first = pNewPoint;
          }
       else
	  {
	  pNewLine->last->next = pNewPoint;
	  pNewPoint->prev = pNewLine->last;
	  }
       pNewLine->last = pNewPoint;
       }
    else if (strncmp(buffer,END,strlen(END)) == 0)
       {
       break;
       }  
    }
    return count;
}

/* Allocate an array of 'count' pointers to features. Then
 * open the passed filename (assumed to be a Dragon vector file)
 * and read the data into that array.
 * @param  count     Number of features believed to be in the file
 * @param  readFile  Name of file to read
 * @return newly allocated array of features or NULL if error occurred.
 */
FEATURE_T ** allocateAndRead(int count, char* readFile)
{
  FEATURE_T ** features = NULL;
  FILE* pIn = NULL;
  int newCount = 0;
  features = calloc(count,sizeof(FEATURE_T*));
  if (features == NULL)
     {
     printf("Error allocating feature array 'features'\n");
     features = NULL;
     return features;
     }
  // else
  //   printf("Successfully allocated 'features' beginning at %p\n", features);
  pIn = fopen(readFile,"r"); /* open previous output file for reading */
  if (pIn == NULL)
     {
     printf("Error opening file %s for rereading\n",readFile);
     free(features);
     features = NULL;
     return features;
     }
  newCount = readFeatures(features,pIn,count);
  fclose(pIn);
  printf("Read %d features of %d allocated\n", newCount,count);
  return features;
}

/* Write the byte data to an RGB file with three bytes per pixel 
 * (all three bytes identical). This is more convenient to work with
 * in ImageMagick.
 * @param   image      Byte array of data
 * @param   width      Number of pixels per line
 * @param   height     Number of lines
 * @param   outfile    Name of file to write
 * @return TRUE for success, FALSE for error.
 */
BOOL writeImageFile(BYTE* image,int width,int height,char* outfile)
{
  FILE * pOut = NULL;
  BYTE* buffer = NULL;
  BOOL bOk = TRUE;
  int row, col, i; 
  buffer = (BYTE*) calloc(width*3,sizeof(BYTE));
  pOut = fopen(outfile,"wb");
  if ((pOut != NULL) && (buffer != NULL))
     {
     for (row = 0; row < height; row++) 
        {
        for (col=0; col< width; col++)
	   {
	   buffer[col*3] = 
             buffer[col*3+1] = 
               buffer[col*3+2] = pixval(col,row,width);
           }
	if (fwrite(buffer,sizeof(BYTE),width*3,pOut) != width*3)
           {
           printf("Error writing output file\n");
           bOk = FALSE;
	   break;
	   }
        }
     }
  else if (pOut == NULL)
     {
     printf("Error opening output file\n");
     bOk = FALSE;
     } 
  else if (buffer == NULL)
     {
     printf("Error allocating data buffer\n");
     bOk = FALSE;
     } 
  if (buffer != NULL)
     free(buffer);
  if (pOut != NULL)
     fclose(pOut);
  return bOk;
}


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
int writeTransformedImageFile(char* outfile, int width, int height,BYTE remap[256][3],BYTE* image)
{
  int x = 0;
  int y = 0;
  int bOk = 1;
  int buffersize = width * 3;
  FILE * pOut = NULL;
  BYTE* buffer = NULL;

  pOut = fopen(outfile,"wb");
  if (pOut == NULL)
     {
     printf("Error opening output image %s\n", outfile);
     bOk = 0;
     }
  if (bOk)
     {
     buffer = (BYTE*) calloc(buffersize,sizeof(BYTE));
     if (buffer == NULL)
         bOk = 0;
     }
  if (bOk)   /* transform and write, one line at a time */
     {         
     for (y = 0; (y < height) && (bOk); y++)
       {
       for (x = 0; x < width; x++)
	    {
	    BYTE imgval = pixval(x,y,width);
            buffer[x*3] = remap[imgval][0];            
            buffer[x*3+1] = remap[imgval][1];            
            buffer[x*3+2] = remap[imgval][2];            
            }
       if (fwrite(buffer,sizeof(BYTE),buffersize,pOut) != buffersize)
	    bOk = 0;
       } 
     }
  if (buffer != NULL)
    free(buffer);
  if (pOut != NULL)
    fclose(pOut);
  return bOk;
}

