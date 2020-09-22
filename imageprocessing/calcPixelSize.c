/* calcPixelSize.c
 *  
 *  This does an empirical calculation for the pixel size of a
 *  static image generated by one of the online map providers in
 *  the MapEval system. It is assumed that this image was captured
 *  with a small red box in the center, .002 x .002 degrees in
 *  size. The program determines how many pixels are in this box
 *  and uses that, along with box coordinates in web mercator,
 *  to estimate the pixel size. It writes the calculated pixel
 *  size to standard output.
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
 *   Created by Sally Goldin, 26 August 2019 
 *      as part of the online map evaluation system.
 *
 *  $Id: calcPixelSize.c,v 1.4 2020/07/21 07:54:23 goldin Exp $
 *  $Log: calcPixelSize.c,v $
 *  Revision 1.4  2020/07/21 07:54:23  goldin
 *  treat X and Y pixel size separately
 *
 *  Revision 1.3  2019/09/03 10:08:04  goldin
 *  return 0 for pixelsize if no box found
 *
 *  Revision 1.2  2019/08/27 06:09:56  goldin
 *  complete pixel size calculations
 *
 *  Revision 1.1  2019/08/26 09:42:07  goldin
 *  new module to empirically discover pixel size
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

/* global pointer to image data */
BYTE * image = NULL;
/* global width and height of the input image */
int width = 0; 
int height = 0;

void usage()
{
  printf("Usage:\n");
  printf("  calcPixelSize <w> <h> <infile> <nw_x> <nw_y> <se_x> <se_y>\n\n");
  printf("     w          - width of input image in pixels\n");
  printf("     h          - height of input image in pixels\n");
  printf("     infile     - input image expected to be rgb, 3 bytes per pixel\n");
  printf("     nw_x       - NW X coord of red box in meters (EPSG 3857)\n");
  printf("     nw_y       - NW Y coord of red box in meters (EPSG 3857)\n");
  printf("     se_x       - SE X coord of red box in meters (EPSG 3857)\n");
  printf("     se_y       - SE Y coord of red box in meters (EPSG 3857)\n");
  printf(" Prints calculated pixel size (floating point, meters) to stdout\n\n");
  exit(0);
}

/* Get the R, G and B values for a pixel at a particular
 * location in the image.
 * @param    x      Column for desired pixel
 * @param    y      Row for desired pixel
 * @param    pR     Pointer to return red value
 * @param    pG     Pointer to return green value
 * @param    pB     Pointer to return blue value
 */
void getPixelBytes(int x, int y, BYTE* pR, BYTE* pG, BYTE* pB)
{
   BYTE* pixStart = &image[y*width*3 + x*3];
   *pR = *pixStart;
   *pG = *(pixStart+1);
   *pB = *(pixStart+2);
}

/* Main function gets arguments, allocates byte array, reads in the data */
int main(int argc, char* argv[])
{
  FILE * pRef = NULL;
  char infile[256];
  char input[256];
  double nw_x = 0;
  double nw_y = 0;
  double se_x = 0;
  double se_y = 0;
  int xCenter = 0;
  int yCenter = 0;
  int ix = 0;
  int iy = 0;
  int boxHeight = 0;  /* box height in pixels */
  int boxWidth = 0;    /* box width in pixels */
  double pixSizeX = 0;
  double pixSizeY = 0;
  int radius = 50;    /* box should never be more than 100 pix wide */
  if (argc < 8)
     usage();
  width = atoi(argv[1]);
  height = atoi(argv[2]);
  strcpy(infile,argv[3]);
  nw_x = atof(argv[4]);
  nw_y = atof(argv[5]);
  se_x = atof(argv[6]);
  se_y = atof(argv[7]);
  //printf("NW coordinates: %lf %lf\n", nw_x,nw_y);
  //printf("SE coordinates: %lf %lf\n", se_x,se_y);

  if ((image = readColorImageFile(infile,width,height)) == NULL)
    {
    printf("Error reading image - exiting \n");
    exit(1);
    }
  xCenter = width/2;
  yCenter = height/2;
  /* search for red pixels near the center, horizontally */
  for (ix = xCenter - radius; ix < xCenter + radius; ix++)
    { 
    BYTE R, G, B;
    getPixelBytes(ix,yCenter,&R,&G,&B);
    /* values get distorted by ImageMagick during conversion 
       so we look for values "close to" pure red
     */
    if ((R >= 0xF0) && (G < 0x10) && (B < 0x10))
       boxWidth++;
    }
  /* search for red pixels near the center, vertically */
  for (iy = yCenter - radius; iy < yCenter + radius; iy++)
    { 
    BYTE R, G, B;
    getPixelBytes(xCenter,iy,&R,&G,&B);
    if ((R >= 0xF0) && (G < 0x10) && (B < 0x10))
       boxHeight++;
    }
  //printf("Box Width is %d and Box Height is %d\n", boxWidth, boxHeight);
  if ((boxWidth > 0) && (boxHeight > 0))
    {
    pixSizeX = (se_x - nw_x)/boxWidth;
    pixSizeY = (nw_y - se_y)/boxHeight;
    printf("%lf %lf %lf\n",(pixSizeX + pixSizeY)/2,pixSizeX,pixSizeY);
    }
  else
    {
    printf("0\n");  /* will be flagged as an error */
    }
 
  free(image);
  exit(0);
}