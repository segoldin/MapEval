/* structures.h
 *  
 *  Structures used by vectorization utility 
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
 * limitations under the License
 *
 *   Created by Sally Goldin, 2 May 2018 as part of the online mapping system.
 *
 *  $Id: structures.h,v 1.8 2020/01/01 09:22:01 goldin Exp $
 *  $Log: structures.h,v $
 *  Revision 1.8  2020/01/01 09:22:01  goldin
 *  add code to calculate distance on per point basis and save in the db, also the percent of points matched
 *
 *  Revision 1.7  2019/06/12 11:48:09  goldin
 *  Working to evaluate quality of the results
 *
 *  Revision 1.6  2018/06/23 10:28:48  goldin
 *  continue working on pairing
 *
 *  Revision 1.5  2018/06/22 12:51:27  goldin
 *  Split into several C files, rework similarity
 *
 *  Revision 1.4  2018/06/11 11:23:56  goldin
 *  Still trying to identify parallel features
 *
 *  Revision 1.3  2018/06/07 11:16:17  goldin
 *  Working on similarity algorithm
 *
 *  Revision 1.2  2018/06/02 08:28:42  goldin
 *  Break at inflection points
 *
 *  Revision 1.1  2018/06/02 04:32:30  goldin
 *  move structures out of c file so they could be shared
 *
 */

typedef unsigned char BYTE;
typedef unsigned int BOOL;

#define TRUE 1
#define FALSE 0
#define BLACK 0
#define WHITE 0xff
#define SEEN 0x7f
#define ROAD 0xAA


#define pixval(x,y,width) image[y*width + x]

#define min(a,b)  ((a) > (b)) ? (a) : (b)


/* Number of slices across and down, for locating features */
#define REGIONS 4
/* Threshold similarity for pairing two features as parallel */
#define SIMTHRESH 0.4


/* component of doubly linked list of points */
typedef struct _point
{
  int x;
  int y;
  double triangleArea; /* area of triangle between this point, prior, and next*/
                       /* used for line simplification  */
		       /* via Visvalingam–Whyatt algorithm */
  double angle;        /* angle between previous segment and next segment */
                       /* used for splitting features */
  double matchdistance; /* distance to the reference point in fractional pixels */
  struct _point * next;
  struct _point * prev;
} POINT_T;

/* structure used to break a feature into segments with similar slope */
typedef struct _arc
{
   double slope;        /* slope of this arc, 999 is infinite (vertical) */ 
   POINT_T * p1;        /* first point - points to an existing POINT_T */
   POINT_T * p2;        /* second point */
   double midX;      /* X coord of normal vector at arc midpoint */
   double midY;      /* Y coord of normal vector at arc midpoint */
   double normalX;      /* X coord of normal vector at arc midpoint */
   double normalY;      /* Y coord of normal vector at arc midpoint */
   struct _arc * next;  /* next arc in the feature */
} ARC_T;


/* structure used when combining features */
typedef struct _feature
{
   int pointCount;     /* number of points in the feature */
   POINT_T * first;    /* head of doubly linked list of points */
   POINT_T * last;     /* tail of doubly linked list */
   ARC_T * firstArc;   /* head of arc list */
   ARC_T * lastArc;    /* tail of arc list */
   double avgSlope;    /* average slope of all segments */ 
   int minX;           /* bounding box coordinates */
   int minY;
   int maxX;
   int maxY;
   int bbArea;         /* bounding box area */
   int regionX;        /* identifies subarea where the feature starts, X direction */
   int regionY;        /* identifies subarea where the feature starts, Y direction */
} FEATURE_T;

/* structure to hold matched pair of approximately parallel features */
typedef struct _featurePair
{
   FEATURE_T* pF1;    /* first feature in the pair */
   FEATURE_T* pF2;    /* second feature in the pair */ 
   POINT_T* midFirst; /* first point of midline */ 
   POINT_T* midLast;  /* last point of midline */
   struct _featurePair * next; /* put into a linked list */
} FEATURE_PAIR_T;


/* structure to put into the max heap, representing similarity 
 * between two features 
 */
typedef struct _featureSim
{
   int fIndex1;       /* index of first feature (in the feature array) */
   int fIndex2;       /* index of second feature (in the feature array) */
   double similarity; /* similarity 0 to 1.0 */

} FEATURE_SIM_T;
 
