/* guidedVectorize.c
 *  
 *  This program reads in a binary, 3 bytes per pixel RGB image and 
 *  does line following to turn it into a set of 
 *  vector features in image coordinates. Background pixels are 0, edge
 *  pixels are ff
 *
 *  This version tries to match a full reference feature, 
 *    try to vectorize segment by segment
 *    using preferential direction
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
 *   Created by Sally Goldin, 30 Jan 2019 as part of the online mapping system.
 *
 *  $Id: guidedVectorize.c,v 1.29 2020/07/21 08:40:45 goldin Exp $
 *  $Log: guidedVectorize.c,v $
 *  Revision 1.29  2020/07/21 08:40:45  goldin
 *  fix sscanf bug getting new fields
 *
 *  Revision 1.28  2020/07/21 07:54:23  goldin
 *  treat X and Y pixel size separately
 *
 *  Revision 1.27  2020/06/09 08:23:33  goldin
 *  fix stdev calculation
 *
 *  Revision 1.26  2020/01/06 07:13:51  goldin
 *  use the number of points in the parameter file as point count for ref feature; some points in DB could be trimmed by intersection
 *
 *  Revision 1.25  2020/01/02 11:15:57  goldin
 *  trying to fix mismatch in point counts with supposed 100% match
 *
 *  Revision 1.24  2020/01/01 09:26:05  goldin
 *  translate distance and stddev into meters
 *
 *  Revision 1.23  2020/01/01 09:22:01  goldin
 *  add code to calculate distance on per point basis and save in the db, also the percent of points matched
 *
 *  Revision 1.22  2019/12/31 10:23:26  goldin
 *  Abandon 'direction' idea but simplify increasing radius searching
 *
 *  Revision 1.21  2019/12/31 08:22:31  goldin
 *  implement neighborhood display
 *
 *  Revision 1.20  2019/12/27 11:32:53  goldin
 *  calculate direction based on relationship between last ref and last target point
 *
 *  Revision 1.19  2019/12/27 09:10:59  goldin
 *  Look at all surrounding pixels when searching for a matching point
 *
 *  Revision 1.18  2019/08/27 09:08:02  goldin
 *  add direction to guided vectorizing
 *
 *  Revision 1.17  2019/08/20 11:48:58  goldin
 *  modified tranformation functions to use center and to round
 *
 *  Revision 1.16  2019/06/28 10:00:55  goldin
 *  fix bug related to multilinestrings created by intersection
 *
 *  Revision 1.15  2019/06/13 08:00:52  goldin
 *  debugging
 *
 *  Revision 1.14  2019/06/12 11:48:09  goldin
 *  Working to evaluate quality of the results
 *
 *  Revision 1.13  2019/06/11 10:13:08  goldin
 *  Don't write one point features
 *
 *  Revision 1.12  2019/05/15 12:19:18  goldin
 *  No terminal output
 *
 *  Revision 1.11  2019/05/14 10:22:42  goldin
 *  add experiment Id to SQL
 *
 *  Revision 1.10  2019/05/14 09:56:42  goldin
 *  Remove terminal output
 *
 *  Revision 1.9  2019/05/10 09:09:13  goldin
 *  create sql output file as well as Dragon vec
 *
 *  Revision 1.8  2019/04/10 09:15:22  goldin
 *  Implemented full following and continuity checking
 *
 *  Revision 1.7  2019/04/10 07:40:08  goldin
 *  Still debugging - now look for each reference point
 *
 *  Revision 1.6  2019/04/08 10:11:26  goldin
 *  modified to rasterize one segment at a time - not yet tested
 *
 *  Revision 1.5  2019/04/08 09:13:03  goldin
 *  Try searching in preferential direction first - tends to get into a dead end
 *
 *  Revision 1.4  2019/04/08 04:54:27  goldin
 *  Add tolerance - works but gets sidetracked because it might explore a side branch rather than following the main direction of the reference feature
 *
 *  Revision 1.3  2019/03/22 09:54:14  goldin
 *  Fix calculation bugs in transformation
 *
 *  Revision 1.2  2019/01/31 11:02:27  goldin
 *  pushing on with guided vectorization - created logic, now debugging
 *
 *  Revision 1.1  2019/01/30 08:34:44  goldin
 *  new module to find corresponding lines
 *
 *
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h> /* for stat */
#include <errno.h>

#include "structures.h"
#include "fileFunctions.h"
#include "debugFunctions.h"
//#include "abstractHeap.h"


void logOutput(char* message);
int calculateDirection(int x1, int y1, int x2, int y2);
void meters2pixels(double xm, double ym, int* pCol, int* pRow);
double calculateSlope(int x1, int y1, int x2, int y2);
double calcDistance(POINT_T * p1, POINT_T * p2);

/* global variables used for georeferencing pixels */
int refcount;           /* count of reference features */
double cellsize;        /* size of one cell in meters */
double cellsizeX;       /* size of one cell in meters - X direction */
double cellsizeY;       /* size of one cell in meters - Y direction */
double origX;           /* X coordinate of origin (meters) */
double origY;           /* Y coordinate of origin */
double centerX;         /* X coordinate of center pixel (meters) */
double centerY;         /* Y coordinate of center pixel */

int width = 0;          /* image width in pixels */ 
int height = 0;         /* image height in pixels */

char * directionLabels[] = {"N","NE","E","SE","S","SW","W","NW"};

/* explain arguments */
void usage()
{
  printf("Usage:\n");
  printf("  guidedVectorize <w> <h> <infile> <paramfile> <outputfile> <expId>\n\n");
  printf("     w          - width of input image in pixels\n");
  printf("     h          - height of input image in pixels\n");
  printf("     infile     - binary input image expected to be rgb, 3 bytes per pixel\n");
  printf("     paramfile  - georeferencing information and reference coordinates\n");
  printf("     outputfile - output file name to create (no suffix)\n");
  printf("     expId      - DB Id of this experiment, used in the SQL\n");
  exit(0);
}

/* Read the next feature from the reference file, assumed to be open
 * 2019-12-27 ignore duplicate points 
 * (not dups in world coords, but map to same image coordinates)
 * @param  pFp      File pointer for open file
 * @param  input    Dynamically allocated input buffer for big lines
 * @param  bufsize  Size of dynamic buffer
 * @param  pRefId   Pointer to reference feature ID
 * @return Pointer to head of list of points in image coordinates
 *         or NULL if no more features 
 */
POINT_T * readNextReferenceFeature(FILE* pFp, char* input,
				   unsigned long bufsize, int* pRefId)
{
  POINT_T * pHead = NULL; /* head and tail of current feature */
  POINT_T * pTail = NULL;
  if (fgets(input,bufsize,pFp) != NULL)
     {
     int row, col = 0;
     char * token = NULL;
     double xCoord, yCoord;
     int cellx,celly;
     int pointCount;
     int first = 1;
     token = strtok(input,",\n");
     while (token != NULL)
       {
       POINT_T * pPoint = NULL;
       if (first)
	  {
	  sscanf(token,"%d %lf %lf",pRefId,&xCoord,&yCoord);
	  first = 0;
	  }
       else
	  {
	  sscanf(token,"%lf %lf",&xCoord,&yCoord);
	  }
       meters2pixels(xCoord,yCoord,&cellx,&celly);
       pPoint = calloc(1,sizeof(POINT_T));
       if (pPoint == NULL)
	 {
	 printf("Error allocating point\n");
	 exit(3);
	 }
       pPoint->x = cellx;
       pPoint->y = celly;
       if (pHead == NULL)
	    {
	    pHead = pTail = pPoint;
	    }
       else
	 {
	 pTail->next = pPoint;
	 pPoint->prev = pTail;
	 pTail = pPoint;
	 }
       // }
       token = strtok(NULL,",\n");
       }
     }
  return pHead;
}

/* convert a point in meters to the closest x,y (column/line) pixel position
 * @param     xm               X coord in meters
 * @param     ym               Y coord in meters
 * @param     pCol             pointer to column number (x)
 * @param     pRow             pointer to row number (y)
 * Returns results in passed pointers - truncates any fractional part
 * Uses global origin, cell size and image size data
 */
void meters2pixels(double xm, double ym, int* pCol, int* pRow)
{

  // revised to use center coordinates and to round to closest row/col
  *pCol = round((xm - centerX)/cellsizeX) + width/2;
  *pRow = round((ym - centerY)/cellsizeY * -1) + height/2;
  
}

/* convert a point in pixels to x,y in meters
 * @param     col               column number (x)
 * @param     row               row number (y)
 * @param     pXm               pointer to X coord in meters
 * @param     pYm               pointer to Y coord in meters
 * Returns results in passed pointers
 * Uses global origin and cell size data
 */
void pixels2meters(int col, int row, double* pXm, double* pYm)
{
  *pXm = (double) centerX + ((col - width/2) * cellsizeX);
  *pYm = (double) centerY - ((row - height/2) * cellsizeY) ;
}

/* Calculate the mean distance between exp points and the ref points
 * based on the data stored in the POINT_T structures, and the standard
 * deviation. 
 * @param pHead     First point in experimental feature linked list
 * @param pStdev    Pointer for returning the standard deviation
 * Returns the mean distance as the function value
 */
double calculateFit(POINT_T* pHead,double* pStdev)
{
  int count = 0;
  double sumDistance = 0.0;
  double sumSquares = 0.0;
  double mean = 0;
  POINT_T* pCurrent = pHead;
  while (pCurrent != NULL)
    {
    count++;
    sumDistance += pCurrent->matchdistance;
    sumSquares += (pCurrent->matchdistance * pCurrent->matchdistance);
    pCurrent = pCurrent->next;
    }
  mean = sumDistance/count;
  *pStdev = sqrt((sumSquares/count - mean*mean)/(count-1));
  return mean;
}

/* Write a feature to the SQL output file, as an insert command
 * @param pHead        Starting point of feature
 * @param experimentId Numeric Id of this experimental comparison
 * @param refFeatureId Numeric Id of corresponding reference feature
 * @param dataId       QueryDataId
 * @param refPoints    Number of points in reference feature
 * @param matchpercent What percent of ref features points were found?
 * @param pOut         File pointer for open text file.
 */
void writeSqlFeature(POINT_T* pHead,int experimentId, int refFeatureId,int dataId, int refPoints, double matchpercent, FILE* pOut)
{
    POINT_T * pCurrent = pHead;
    int first = 1;
    double meandistance;
    double stdevdistance;
    meandistance = calculateFit(pHead,&stdevdistance);
    meandistance *= cellsize;  /* change to meters */
    stdevdistance *= cellsize; 

    fprintf(pOut,"INSERT INTO QUERYLINES (experimentid,dataid,uploadfeatureid,refpointcount,matchpercent,meandistance,stdevdistance,geom) VALUES (%d, %d, %d, %d, %.2lf, %.2lf, %.2lf, ST_GeomFromText('LINESTRING(",
	    experimentId,dataId,refFeatureId,refPoints,matchpercent,meandistance,stdevdistance);
    fflush(pOut);
    while (pCurrent != NULL)
      {
      double geoX; 
      double geoY;
      pixels2meters(pCurrent->x,pCurrent->y,&geoX,&geoY);
      if (!first)
	 {
	 fprintf(pOut,", ");
	 }
      first = 0;
      fprintf(pOut,"%.6lf %.6lf",geoX,geoY); 
      fflush(pOut);
      pCurrent = pCurrent->next;
      }
    // Should be Web Mercator, not lat long
    fprintf(pOut,")',3857));\n");
}

/* calculate the Euclidean distance between two points (in pixels).
 * @param p1    First point
 * @param p2    Second point
 * @return distance
 */
double calculateDistance(POINT_T * p1, POINT_T * p2)
{
  double dist =  (p1->x - p2->x)*(p1->x - p2->x) + (p1->y - p2->y)*(p1->y - p2->y);
  return sqrt(dist);
}


/* Compare two values. Return 1 if val1 > val2,
 * -1 if val1 < val2, 0 if they are the same
 */
int signDiff(int val1, int val2)
{
  int result = 0;
  if (val1 > val2)
    result = 1;
  else if (val1 < val1)
    result = -1;
  return result;
}

/* clear terminal and reset to row 0, column 0
 */
void toTop()
{
  char clearScreen[] = {0x1B,'[','2','J',0};
  printf("%s",clearScreen);

}

/* Use character graphics to display the contents of a neighborhood
 * around a pixel location, and optionally the current to be examined
 * pixel.
 * @param image  BYTE array of data values to search
 * @param width  Width of the image
 * @param height Height of the image
 * @param centerx   Center pixel x
 * @param centery   Center pixel y
 * @param tolerance Radius of neighborhood
 * @param x  If >= 0, mark as current pixel
 * @param y  If >= 0, mark as current pixel
 */
void showNeighborhood(BYTE* image,int width, int height,
		      int centerx, int centery, int tolerance, int x, int y)
{
  int r=0;  /* row counter */
  int c=0;  /* column counter */
  int curx;
  int cury; 
  int bShow = 0;
  char buffer[32];
  if ((x >= 0) && (y >= 0))
    {
    curx = x - centerx;
    cury = y - centery;
    bShow = 1;
    printf("x=%d, curx=%d, y=%d, cury=%d\n",x,curx,y,cury);
    }
  for (r = -tolerance; r <= tolerance; r++)
    {
    printf("\n");
    for (c = -tolerance; c <= tolerance; c++)
      {
      int xcoord = centerx + c;
      int ycoord = centery + r;
      if ((xcoord < 0) || (xcoord >= width) ||
	  (ycoord < 0) || (xcoord >= height))
	continue;
      if ((r == 0) && (c == 0))
	  {
	  if (pixval(xcoord,ycoord,width) == WHITE)
	      printf("X");
	  else
	      printf("O");
	  }
      else if (bShow && (r == cury) && (c == curx))
	  {
	  if (pixval(xcoord,ycoord,width) == WHITE)
	      printf("*");
	  else
	      printf("o");
	  }
      else
	  {
	  if (pixval(xcoord,ycoord,width) == WHITE)
	      printf("+");
	  else
	      printf(" ");
	  }
      }
    }
    printf("\nType Return to continue\n");
    fgets(buffer,sizeof(buffer),stdin);
    toTop();
}


/* Look for match to point refx,refy, starting at the same pixel
 * and looking in the neighborhood.
 * Must be within 'tolerance' pixels 
 * If found allocate a POINT_T for that point and return it.
 * @param image  BYTE array of data values to search
 * @param width  Width of the image
 * @param height Height of the image
 * @param refx   Reference feature start x
 * @param refy   Reference feature start y
 * @param tolerance Radius of region to search for the starting point
 * @param direction Preferred direction for searching: 0 = N, 1 = NE, 2 = E, etc.
 *               Based on direction between last ref point and last target point
 *               -1 if no information (or the last ref and last target were the same)
 * @return newly allocated POINT_T with coordinates set, or NULL if can't find
 */
POINT_T* findPoint(BYTE* image,int width, int height,
		   int refx, int refy, int tolerance, int direction)
{
    POINT_T * pNew = NULL;
    POINT_T refpoint;
    int bFound = 0;     /* flag telling us we've found a white pixel */
    int xFound = -1;  /* coordinates of points found */
    int yFound = -1;
    int i = 0;
    int j = 0;
    char message[256]; /* for logging */
    int stepsX[] = {0,1,1,1,0,-1,-1,-1};    /* N, NE, E, SE, S, SW, W, NW */
    int stepsY[] = {-1,-1,0,1,1,1,0,-1};    /* N, NE, E, SE, S, SW, W, NW */
    int nextX[] = {1,0,0,-1,-1,0,0,1};
    int nextY[] = {0,1,1,0,0,-1,-1,0};
    int order[] = {0,1,-1,2,-2,3,-3,4};     /* increment to add to get which direction
					     * to check next 
					     */
    int radius = 1;  /* start at 1, gradually increase */
    refpoint.x = refx;
    refpoint.y = refy;
    sprintf(message,"Looking for point at (%d,%d) direction %s\n",refx,refy,directionLabels[direction]);
    logOutput(message);
    //printf(message);
    //showNeighborhood(image,width,height,refx,refy,tolerance,-1,-1);
    if (direction < 0)
       direction = 0;
    /* First examine the exact same location in the image! */
    if (pixval(refx,refy,width) == WHITE)
      {
      xFound = refx;
      yFound = refy;
      bFound = 1;
      }
    //if (bFound)
    //  logOutput("Found exact match\n");

    /* If we didn't get a match at the exact pixel, look around it.
     * Start at preferred direction, then search one on either side, two on either side, etc.
     */
    while ((!bFound) & (radius <= tolerance))
      {  
      int dirX =0;
      int dirY =0;
      int dirXNext = 0;
      int dirYNext = 0;
      int baseIncX = 0;
      int baseIncY = 0;
      int incrementX = 0;
      int incrementY = 0;
      int signDiffX = 0;
      int signDiffY = 0;
      //sprintf(message,"--- RADIUS IS %d\n",radius);
      //logOutput(message);
      
      for (i = 0; (i < 8) && (!bFound); i++)
	{  
	dirX = stepsX[i];
	dirY = stepsY[i];
	baseIncX = dirX * radius; 
	baseIncY = dirY * radius; 
	for (j = 0; (j < radius) && (!bFound); j++)
	  {
	  incrementX = baseIncX + nextX[i]*j;
	  incrementY = baseIncY + nextY[i]*j;
          if ((refx + incrementX < 0) || 
	      (refx + incrementX >= width) ||
	      (refy + incrementY < 0) || 
	      (refy + incrementY >= height))
	    continue; 
	  sprintf(message,"--- Examining (%d,%d)\n",refx+incrementX,refy+incrementY);
	  //logOutput(message);
	  //printf(message);
	  //showNeighborhood(image,width,height,refx,refy,tolerance,refx+incrementX,refy+incrementY);
	  if (pixval((refx+incrementX),(refy+incrementY),width) == WHITE)
	      {
	      xFound = refx+incrementX;
	      yFound = refy+incrementY;
	      bFound = 1;
	      }
          } /* end j loop */
	}   /* end i loop */
      radius++;
      }
    if (bFound)
      {
      sprintf(message,"--- FOUND at (%d,%d)\n",xFound,yFound);
      logOutput(message);

      pNew = calloc(1,sizeof(POINT_T));
      if (pNew == NULL)
	{
	  printf("Error allocating point structure\n");
	  exit(100);
	}
      pNew->x = xFound;
      pNew->y = yFound;
      pNew->matchdistance = calculateDistance(&refpoint,pNew);
      }

    return pNew;
}

/* Try to match reference feature points to white pixels in the
 * image. We check the start and end of each line segment in
 * the reference feature against the image, subject to the tolerance
 * radius. If we find a match, we check that there is a connected
 * line between the two points.
 * @param pRefHead   First point in the reference feature
 * @param pPtrRefTail Used to set the tail of ref feature - for free fn
 * @param pHead      First point in the experimental feature
 * @param pPtrTail   Pointer to pointer to the tail, which this function will change.
 * @param image  BYTE array of image data
 * @param width  Width of the image
 * @param height Height of the image
 * @param tolerance Radius of point search in pixels
 * @return number of points in the experimental feature
 */
int followReferenceFeature(POINT_T* pRefHead,POINT_T** pPtrRefTail, 
			   POINT_T * pHead,POINT_T** pPtrTail,
			   BYTE* image,int width,int height,
			   int tolerance)
{
  int count = 1;  /* return value; we have one point, namely the head*/
  char message[256];
  POINT_T * pNew = NULL;
  POINT_T * pRefCurrent = pRefHead->next;
  POINT_T * pRefPrior = pRefHead;
  int xFound = 0;  /* coordinates of points found */
  int yFound = 0;
  int direction = 0;
  while (pRefCurrent != NULL) 
    {
    //direction = calculateDirection(pRefPrior->x,pRefPrior->y,pRefCurrent->x,pRefCurrent->y);
    if (pNew == NULL)
       direction = calculateDirection(pRefPrior->x,pRefPrior->y,pHead->x,pHead->y);
    else
       direction = calculateDirection(pRefPrior->x,pRefPrior->y,pNew->x,pNew->y);
 
    pNew = findPoint(image,width,height,pRefCurrent->x, 
		     pRefCurrent->y,tolerance,direction);
    if (pNew == NULL) /* no next point */
       break; 
    /* check connectivity between this point and the last one */
    /* SKIP for now */
    /**
    if (!isConnected(image,width,height,*pPtrTail,pNew,tolerance))
      {
      free(pNew);
      break;
      }
    **/
    (*pPtrTail)->next = pNew;
    pNew->prev = *pPtrTail;
    *pPtrTail = pNew;
    count++;
    *pPtrRefTail = pRefCurrent;
    pRefPrior = pRefCurrent;
    pRefCurrent = pRefCurrent->next;
    }   
  if (pRefCurrent != NULL)  /* find the true tail */
    {
    while (pRefCurrent != NULL)
	{
	*pPtrRefTail = pRefCurrent;
	pRefCurrent = pRefCurrent->next;
	}
    }
  return count;
}

/* Free the linked list for the latest feature 
 * @param pPHead   Pointer to pointer to the head
 * @param pPTail   Pointer to pointer to the tail
 */
void freePointList(POINT_T** pPHead, POINT_T** pPTail)
{
    POINT_T* pCurrent = *pPHead;
    POINT_T* pRemove = NULL;
    while (pCurrent != NULL)
      {
      pRemove = pCurrent;
      pCurrent = pCurrent->next;
      free(pRemove);
      }
   *pPHead = *pPTail = NULL;
}

 


/* Given start and end coordinates of a line segment, determine
 * the predominant direction as follows:
 *  N = 0, NE = 1, E = 2, SE = 3, S = 4, SW = 5, W = 6, NW = 7
 * Note the origin is at the upper left
 * @param  x1     X coord of line segment start
 * @param  x1     X coord of line segment start
 * @param  x1     X coord of line segment start
 * @param  x1     X coord of line segment start
 * @return direction constant according to the scheme above. 
 */ 
int calculateDirection(int x1, int y1, int x2, int y2)
{
  int direction = 0;
  if (x1 == x2)
     {
     if (y2 > y1)
       direction = 4;  /* s */
     else 
       direction = 0;  /* n */
     }
  else if (y1 == y2) /* horizontal */
     {
     if (x2 > x1)
       direction = 2; /* e */
     else 
       direction = 6; /* w */
     }
  else if (x2 > x1)
     {
     if (y2 > y1)
       direction = 3; /* se */
     else 
       direction = 1; /* ne */
     }
  else
     {
     if (y2 > y1)
       direction = 5; /* sw */
     else 
       direction = 7; /* nw */
     }
  return direction; 
}

void logOutput(char* string)
{
   static FILE* pLogOut = NULL;
   if (pLogOut == NULL)
     {
     pLogOut = fopen("/tmp/guidedVectorizeLogfile.txt","w");
     if (pLogOut == NULL)
       {
       printf("Error opening log file - errno is %d\n",errno);
       exit(21);
       }
     }
   fprintf(pLogOut,"%s\n",string);
}

/* Main function gets arguments, allocates byte array, reads in the data */
int main(int argc, char* argv[])
{
  FILE * pOut = NULL;   /* vector output file */
  FILE * pSql = NULL;   /* sql output file */
  FILE * pRef = NULL;
  char infile[256];
  char paramfile[256];
  char vecoutfile[256];
  char sqloutfile[256];
  char imgoutfile[256];
  char input[256];
  int x = 0;
  int y = 0;
  int featureCount = 0;
  double angleThreshold = 32.0;
  int i = 0;
  int color = 50; /* for Dragon vector file*/
  int dataId = 0;
  int expId = 0;
  int tolerance = 3;  /* size of region to search for pixels */
  /* will be updated from the buffer size in the param file */ 
  POINT_T * pRefHead = NULL;
  /* array of bytes for image data*/
  BYTE * image = NULL;
  BYTE * imgCopy = NULL;
  struct stat fileInfo;  /* for getting file size */
  char * bigBuffer = NULL;  
     /* dynamically allocated input buffer for ref features*/
  unsigned long bufSize;
     /* size of dynamic buffer (= file size) */
  char message[256]; /* for logging */
  BYTE remap[256][3];  /* for changing 1 byte to 3 bytes on output */
  if (argc < 7)
     usage();
  width = atoi(argv[1]);
  height = atoi(argv[2]);
  strcpy(infile,argv[3]);
  strcpy(paramfile,argv[4]);
  strcpy(vecoutfile,argv[5]);
  strcat(vecoutfile,".vec");
  strcpy(sqloutfile,argv[5]);
  strcat(sqloutfile,".sql");
  sprintf(imgoutfile,"copy_%s",infile);
  expId = atoi(argv[6]);

  if ((image = readImageFile(infile,width,height)) == NULL)
    {
    printf("Error reading image - exiting \n");
    exit(1);
    }
  /* make a copy for output purposes */
  /**
  imgCopy = calloc(width * height,sizeof(BYTE));
  if (imgCopy == NULL)
       {
       printf("Error allocating duplicate image\n");
       exit(1);
       }
  memcpy(imgCopy,image,width*height);
  initRemapTable(remap);
  **/

  if (stat(paramfile,&fileInfo) == 0)
    {
    bufSize = fileInfo.st_size;
    bigBuffer = calloc(bufSize,sizeof(char));
    if (bigBuffer == NULL)
       {
       printf("Error allocating %ld character input buffer for file read\n",
		bufSize);
       exit(1);
       }
    } 
  else
    {
    printf("Error getting file size for file %d\n",paramfile);
    exit(1);
    }

  pRef = fopen(paramfile,"r");
  if (pRef == NULL)
    {
    printf("Error opening input parameter file %s - errno is %d\n",infile,errno);
    exit(1);
    }
  /* get transformation parameters in the first line */
  char * read = fgets(input,sizeof(input),pRef);
  if (read != NULL)
       { 
       sscanf(input,"%d %lf %lf %lf %lf %lf %d %d",&refcount,&centerX,&centerY,&cellsize,&cellsizeX,&cellsizeY,&dataId,&tolerance);
       }
  sprintf(message,"cellsize=%lf  cellsizeX=%lf  cellsizeY=%lf\n",cellsize,cellsizeX,cellsizeY);
  logOutput(message);
  tolerance = round(tolerance/cellsize);  /* convert from meters to pixels */
  /* open output file in preparation */
  pOut = fopen(vecoutfile,"w");
  if (pOut == NULL)
     {
     printf("Error opening vector output file %s - errno is %d\n", vecoutfile, errno);
     exit(4); 
     }
  fprintf(pOut,"# tolerance in pixels is %d\n", tolerance);
  pSql = fopen(sqloutfile,"w");
  if (pSql == NULL)
     {
     printf("Error opening SQL output file %s - errno is %d\n", sqloutfile,errno);
     exit(4); 
     }
  //fprintf(pSql,"BEGIN;\n");
  int refFeatureId = 0;
  /* do line following and write to output file */
  while ((pRefHead = readNextReferenceFeature(pRef,bigBuffer,bufSize,
                                              &refFeatureId)) != NULL)
     {
     int startCol, startRow, endCol, endRow;
     int pointCount;
     POINT_T * pRefTail = NULL;
     POINT_T * pHead = NULL; /* head and tail of current feature */
     POINT_T * pTail = NULL;
     int direction = calculateDirection(pRefHead->x,pRefHead->y,pRefHead->next->x,pRefHead->next->y);
     startCol = pRefHead->x;
     startRow = pRefHead->y;
     int refPoints = countPoints(pRefHead);
     sprintf(message,"\nNEW FEATURE %d READ - START AT (%d,%d) with %d points",refFeatureId,startCol,startRow,refPoints);
     logOutput(message);
     pHead = pTail = findPoint(image,width,height,startCol,startRow,tolerance,direction);
     if (pHead != NULL)
	 {
	 pointCount = followReferenceFeature(pRefHead,&pRefTail,
					     pHead,&pTail,
					     image,width,height,tolerance);

	 //resetImage(image,pHead); /* set back to WHITE */
	 if (pointCount > 1)
	   {
	   sprintf(message,"  Wrote matching feature with %d out of %d points",pointCount,refPoints);
	   logOutput(message);

	   writeFeature(pHead,featureCount,pOut,color);
	   writeSqlFeature(pHead,expId,refFeatureId,dataId,refPoints,(pointCount * 100.0)/refPoints,pSql);
           //markRoadPixels(imgCopy,width,height,pHead);
	   featureCount++;
	   }
	 else
	   {
	   sprintf(message,"  Only one point found for reference line %d - ref points follow:", refFeatureId);
	   logOutput(message);
	   POINT_T * pPt = pRefHead;
	   while (pPt != NULL)
	     {
	     sprintf(message,"     (%d, %d)", pPt->x, pPt->y);
	     logOutput(message);
	     pPt = pPt->next;
	     }
	   }
	 }
     else
         {
	 /* write message as comment to dragon vector file */
	 sprintf(message,"  No start point found for reference line %d\n", refFeatureId);
	 logOutput(message);
         fprintf(pOut,"#No start point found for reference line %d\n", refFeatureId);
         }
     freePointList(&pHead,&pTail);
     freePointList(&pRefHead,&pRefTail);
     }
  fprintf(pOut,"-END\n");  // for the Dragon vector file format
  //fprintf(pSql,"COMMIT;\n");
  //printf("Found and wrote %d of %d features\n", featureCount,refcount);
  /**
  if (!writeTransformedImageFile(imgoutfile, width, height,remap,imgCopy))
      printf("Error writing transformed image to file %s\n",imgoutfile);
  **/
  free(image);
  /** free(imgCopy); **/
  free(bigBuffer);
  fclose(pOut);
  fclose(pRef);

}


