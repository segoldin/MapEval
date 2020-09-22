/* Holds functions used for debugging and printing
 *
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
 *   $Id: debugFunctions.c,v 1.5 2019/08/27 09:07:38 goldin Exp $
 *   $Log: debugFunctions.c,v $
 *   Revision 1.5  2019/08/27 09:07:38  goldin
 *   add printNeighborhood
 *
 *   Revision 1.4  2019/06/13 08:00:52  goldin
 *   debugging
 *
 *   Revision 1.3  2019/04/08 10:11:26  goldin
 *   modified to rasterize one segment at a time - not yet tested
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
#include <math.h>
#include "structures.h"
#include "debugFunctions.h"

char * globalLogFile = NULL;

/* debug offsets related to directions */
void debug(int xoff[8][8],int yoff[8][8])
{
  static int first = 1;
  if (!first)
     return;
  first = 0;
  int startx = 20;
  int starty = 20;
  int i = 0;
  int j = 0;
  printf("North: \n");
  for (j = 0; j < 8; j++)
     {
     printf("(%d,%d) ",startx+xoff[i][j],starty+yoff[i][j]);
     }
  i++;
  printf("\n\nNorthEast: \n");
  for (j = 0; j < 8; j++)
     {
     printf("(%d,%d) ",startx+xoff[i][j],starty+yoff[i][j]);
     }
  i++;
  printf("\n\nEast: \n");
  for (j = 0; j < 8; j++)
     {
     printf("(%d,%d) ",startx+xoff[i][j],starty+yoff[i][j]);
     }
  i++;
  printf("\n\nSouthEast: \n");
  for (j = 0; j < 8; j++)
     {
     printf("(%d,%d) ",startx+xoff[i][j],starty+yoff[i][j]);
     }
  i++;
  printf("\n\nSouth: \n");
  for (j = 0; j < 8; j++)
     {
     printf("(%d,%d) ",startx+xoff[i][j],starty+yoff[i][j]);
     }
  i++;
  printf("\n\nSouthWest: \n");
  for (j = 0; j < 8; j++)
     {
     printf("(%d,%d) ",startx+xoff[i][j],starty+yoff[i][j]);
     }
  i++;
  printf("\n\nWest: \n");
  for (j = 0; j < 8; j++)
     {
     printf("(%d,%d) ",startx+xoff[i][j],starty+yoff[i][j]);
     }
  i++;
  printf("\n\nNorthWest: \n");
  for (j = 0; j < 8; j++)
     {
     printf("(%d,%d) ",startx+xoff[i][j],starty+yoff[i][j]);
     }
}


/* Print the angles between all arcs for a feature 'pFeature'.
 * 'which' is the array index, which allows us to identify which feature */
void printFeatureArcs(FEATURE_T* pFeature, int which)
{
  printf("Feature %d which has %d points and average slope %lf\n", which,pFeature->pointCount,pFeature->avgSlope);
  printf("   Region X,Y: %d %d  (%d,%d) to (%d,%d)\n", pFeature->regionX,pFeature->regionY,
    pFeature->minX,pFeature->minY,pFeature->maxX,pFeature->maxY);
  
//  ARC_T * pArc = pFeature->firstArc;
//  ARC_T * pNextArc = NULL;
//  int arcnum = 1;
//  while (pArc != NULL)
//    {
//    pNextArc = pArc->next;
//    //printf("    Arc from (%d,%d) to (%d,%d) -- slope is %lf\n",
//    //	   pArc->p1->x,pArc->p1->y,pArc->p2->x,pArc->p2->y,pArc->slope);
//    if (pNextArc != NULL)
//       {
//       printf("     Angle between arc #%d and arc #%d is %lf\n", arcnum,arcnum+1,computeArcAngle(pArc,pNextArc));
//       }
//    pArc = pArc->next;
//    arcnum++;
//    } 

}

/* Debugging function prints the coordinates in order */
void printList(POINT_T* pHead,int featureId,int pointCount)
{
   char buffer[16];
   POINT_T * pCurrent = pHead;
   printf("Feature %d has %d points\n", featureId,pointCount);
   while (pCurrent != NULL)
     {
     printf("(%3d, %3d) - area %lf\n",pCurrent->x,pCurrent->y,pCurrent->triangleArea);
     pCurrent = pCurrent->next;
     }
   printf("Hit return to continue: ");
   fgets(buffer,sizeof(buffer),stdin);
}


/* Write a feature to the output file.
 * Create additional features of the same color for
 * each arc's normal vector. 
 * This is a debugging function so we can see if the normals
 * are being calculated as we expect.
 * @param pFeature     Feature to write
 * @param featureId    Numeric Id of the feature
 * @param pOut         File pointer for open text file.
 */
void writeFeatureWithNormals(FEATURE_T* pFeature,int featureId,FILE* pOut)
{
    POINT_T * pHead = pFeature->first;
    POINT_T * pCurrent = pHead;
    ARC_T* pArc = pFeature->firstArc;
    int color = (featureId*20)%255;
    /* final item is color - want each feature to contrast with previous */
    fprintf(pOut,"-FIGURE %d L %d %d\n",featureId,
	    listSize(pHead),color);
    fflush(pOut);
    while (pCurrent != NULL)
      {
      fprintf(pOut,"-COORDS %.2lf %.2lf 0\n", 
	      (double) pCurrent->x,(double) pCurrent->y);
      fflush(pOut);
      pCurrent = pCurrent->next;
      }
    /* now write a single feature for each normal vector on each arc */
    while (pArc != NULL)
      {
      fprintf(pOut,"-FIGURE %d L 2 %d\n",featureId,color);
      fprintf(pOut,"-COORDS %.2lf %.2lf 0\n", 
	      pArc->midX,pArc->midY);
      fprintf(pOut,"-COORDS %.2lf %.2lf 0\n", 
	      pArc->normalX,pArc->normalY);
      pArc = pArc->next;
      }
}

  /***
  pOut = fopen("normals.vec","w");
  if (pOut == NULL)
    {
    printf("Error opening normals.vec\n");
    exit(12);  
    }
  for (i = 0; i < newCount; i++)
    writeFeatureWithNormals(features[i],i,pOut);
  exit(0);
  ***/

/* delete the old log file if any
 * and set new log file name 
 * @param logfilename
 */
void initLogging(char * logfilename)
{
   unlink(logfilename);
   globalLogFile = logfilename;
}

/* Write a message to a log file 
 * Opens and closes the log file each time
 * to avoid problems with crashes.
 * Log file name is global to this module.
 * @param   message    Message to write - adds a newline
 */
void logMessage(char* message)
{
  FILE* pOut = NULL;
  pOut = fopen(globalLogFile,"a");
  if (pOut == NULL)
     {
     printf("Error trying to open log file %s\n", globalLogFile);
     return;  /* not much we can do */
     }
  fprintf(pOut,"%s\n",message);
  fclose(pOut);
}

/* Traverse a linked list of points to count how many
 * items it contains.
 * @param first    Pointer to first point
 * @return how many items in the list
 */
int countPoints(POINT_T * first)
{
  int count = 0;
  POINT_T * current = first;
  while (current != NULL)
    {
    count++;
    current = current->next;
    }
  return count;
}

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
			int x, int y, int tolerance)
{
    int r = 0;  /* row counter */
    int c = 0;  /* column counter */
    int cardinalX[] = {1,0,-1,0};  /* E,S,W,N */
    int cardinalY[] = {0,1,0,-1};
    int diagX[] = {1,-1,-1,1};  /* SE,SW,NW,NE */
    int diagY[] = {1,1,-1,-1};
    int radius = 1;  /* start at 1, gradually increase */
    char message[256];
    printf("Center %d,%d\n", x,y);
    for (r = y - tolerance; r <= y + tolerance ; r++)
      {
      for (c = x - tolerance; c <= x + tolerance; c++)
	{
	printf("%d ",(pixval(c,r,width) == WHITE)? 1 : 0);
        }
      printf("\n");
      }
    printf("\n");
}
