/* prepareShpFiles.c
 *  
 *  This program transforms a ARC category shape file that might
 *  have multiple parts per feature into a file that has only
 *  one part per feature, in preparation for loading the data
 *  into the MapEval database. It does this by splitting multipart
 *  features, and duplicating their DBF records. 
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
 *   Created by Sally Goldin, 7 June 2019 as part of the online map eval system.
 *
 *  $Id: prepareShpFiles.c,v 1.8 2020/07/22 06:22:40 goldin Exp $
 *  $Log: prepareShpFiles.c,v $
 *  Revision 1.8  2020/07/22 06:22:40  goldin
 *  debug new arrangement of providing the output directory explicitly
 *
 *  Revision 1.7  2020/07/22 05:55:55  goldin
 *  add explicit output directory as an argument
 *
 *  Revision 1.6  2020/07/08 06:24:57  goldin
 *  add checking functionality to detect illegal types before trying the shp2pgsql
 *
 *  Revision 1.5  2020/07/01 09:19:44  goldin
 *  add code to rename 'name' fields for points
 *
 *  Revision 1.4  2019/06/11 08:52:56  goldin
 *  Fix problem with output path - always create just below where the program is running
 *
 *  Revision 1.3  2019/06/08 11:38:57  goldin
 *  add code to check shape type
 *
 *  Revision 1.2  2019/06/08 05:57:49  goldin
 *  Finish implementation and build - not yet tested
 *
 *  Revision 1.1  2019/06/07 10:00:24  goldin
 *  utility to break up multi-part linestrings in shape files
 *
 */

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <ctype.h>
#include <unistd.h>    // for access fn
#include <sys/stat.h>
#include <sys/types.h>  // above two for mkdir
#include "shapefil.h"  // Make file must specify the include directory

/* global flag to control message output */
int bVerbose = 0;


/* Print usage information
 * Called if the required arguments are not supplied
 */
void usage()
{
  printf("Usage: \n");
  printf("prepareShpFiles <shapefile> [-v | -check]\n");
  printf("  shapefile   - name of file to process, no suffix\n");
  printf("  outpath     - output path, assumed to exist\n");
  printf("  -v          - verbose mode; give progress messages\n");
  printf("  -check      - checks to make sure the filetype is valid\n");
  printf("Creates output files with the same name, in the 'outpath' subdirectory\n");
  exit(0);
}

/* change a string, in place, to all lower case
 *    instring  - string to be modified
 */
void lowerCase(char * instring)
{
  char * current = instring;
  while (*current != '\0')
    {
    *current = tolower(*current);
    current++;
    } 
}

/* Initializes the output DBF file to have the same fields
 * as the input DBF file 
 *    dbfIn       File handle for input DBF
 *    dbfOut      File handle for output DBF
 * Returns 1 if all is okay, 0 if error occurred
 */
int initializeDbfFields(DBFHandle dbfIn, DBFHandle dbfOut)
{
  int bOk = 1;
  int count = DBFGetFieldCount(dbfIn);
  int i = 0; 
  DBFFieldType type = 0;
  char fieldName[16];
  char revisedFieldName[16];
  int width = 0;
  int decimals = 0;
  for (i = 0; (i < count) && (bOk > 0); i++)
    {
    type =  DBFGetFieldInfo(dbfIn,i,fieldName,&width,&decimals);
    strcpy(revisedFieldName,fieldName);
    lowerCase(fieldName);
    if (strstr(fieldName,"name"))
       strcpy(revisedFieldName,"name");
    if (DBFAddField(dbfOut,revisedFieldName,type,width,decimals) != i) 
       {
       printf("Error adding DB field number %d\n", i);
       bOk = 0;
       }
    }
  return bOk;
}

/* Copy a set of attribute values from the input DBF file to the
 * output DBF file.
 *    dbfIn       File handle for input DBF
 *    dbfOut      File handle for output DBF
 *    inShp       Number of record to copy from input
 *    outShp      Number of record to copy to in the output
 * Returns 1 if all is okay, 0 if error occurred
 */
int copyAttributes(DBFHandle dbfIn, DBFHandle dbfOut, int inShp, int outShp)
{
  int bOk = 1;
  int count = DBFGetFieldCount(dbfIn);
  int i = 0; 
  DBFFieldType type = 0;
  char fieldName[16];
  int width = 0;
  int decimals = 0;
  const char * fieldVal = NULL;
  char stringField[256];
  int intVal = 0;
  double doubleVal = 0.0;
  for (i = 0; (i < count) && (bOk > 0); i++)
    {
    type =  DBFGetFieldInfo(dbfIn,i,fieldName,&width,&decimals);
    switch (type)
      {
      case FTString:
        fieldVal = DBFReadStringAttribute(dbfIn,inShp,i);
	bOk =  DBFWriteStringAttribute(dbfOut,outShp,i,fieldVal);
	break;
      case FTInteger:
        intVal = DBFReadIntegerAttribute(dbfIn,inShp,i);
	bOk = DBFWriteIntegerAttribute(dbfOut,outShp,i,intVal);
	break;
      case FTDouble:
        doubleVal =  DBFReadDoubleAttribute(dbfIn,inShp,i);
	bOk = DBFWriteDoubleAttribute(dbfOut,outShp,i,doubleVal);
	break;
      default:
	printf("Unexpected attribute type found - %d\n",type);
	bOk = 0;
      }
    }
    return bOk;
}


/* Read all the shapes and check to make sure none has more
 * than one part. If multi is found, print message and exit.
 * This means user must manually convert.
 *    shpIn       File handle for input coordinate file
 * Returns 1 for all simple, 0 for error or if a multi-feature is found.
 */
int allFeaturesSimple(SHPHandle shpIn)
{
  int bOk = 1;         /* for return */
  int inputCount = 0;  /* number of features in the input file */
  int shapeType = 0;   /* what kind of geographic feature? */
  int in = 0;      /* count features read */
  int out = 0;     /* count features written */
  int part = 0;    /* count parts within a feature */
  SHPObject * readShp = NULL;
  SHPObject * newShp = NULL;
  SHPGetInfo(shpIn, &inputCount,&shapeType,NULL,NULL);
  for (in = 0; (in < inputCount) && (bOk > 0); in++)
     {
     readShp = SHPReadObject(shpIn,in);
     if (readShp == NULL)
       {
       bOk = 0;
       break;
       }
     if (readShp->nParts > 1) /* can't handle - exit */
       {
       bOk = 0;
       break;
       }
     }
  return bOk;
}


/* Copy and transform data from the input coordinate and attribute 
 * files to the output. If a feature has a single part, just do a copy.
 * If a feature has multiple parts, break it into multiple single
 * part features.
 *    shpIn       File handle for input coordinate file
 *    shpOut      File handle for output coordinate file
 *    dbfIn       File handle for input DBF
 *    dbfOut      File handle for output DBF
 * Returns 1 for success, 0 for error.
 */
int restructureFeatures(SHPHandle shpIn,SHPHandle shpOut,
			DBFHandle dbfIn,DBFHandle dbfOut)
{
  int bOk = 1;         /* for return */
  int inputCount = 0;  /* number of features in the input file */
  int shapeType = 0;   /* what kind of geographic feature? */
  int in = 0;      /* count features read */
  int out = 0;     /* count features written */
  int part = 0;    /* count parts within a feature */
  SHPObject * readShp = NULL;
  SHPObject * newShp = NULL;
  SHPGetInfo(shpIn, &inputCount,&shapeType,NULL,NULL);
  for (in = 0; (in < inputCount) && (bOk > 0); in++)
     {
     readShp = SHPReadObject(shpIn,in);
     if (bVerbose)
        printf("Read shape %d\n",in);
     if (readShp == NULL)
       {
       bOk = 0;
       break;
       }
     if (bVerbose)
       printf("Shape %d has %d part(s), %d vertices\n",in,readShp->nParts,
	      readShp->nVertices);
     if (readShp->nParts == 1) /* just copy */
       {
       newShp = SHPCreateSimpleObject(SHPT_ARC,readShp->nVertices,
				      readShp->padfX,readShp->padfY,NULL);
       if (newShp == NULL)
	 {
	 bOk = 0;
	 break;
	 }
       out = SHPWriteObject(shpOut,-1,newShp);
       bOk = copyAttributes(dbfIn,dbfOut,in,out);
       SHPDestroyObject(newShp);
       }
     else
       {
       for (part = 0; part < readShp->nParts; part++)
	   {
	   int p = 0;   /* loop counter for points */
	   double * pX = NULL;
	   double * pY = NULL;
	   int vCount = 0;  /* count of vertices in this part */
	   int start = readShp->panPartStart[part];
	   int end;
	   if (part == readShp->nParts - 1) /* last part */
	     end = readShp->nVertices - 1;
	   else
	     end = readShp->panPartStart[part+1] - 1;
	   vCount = end - start + 1; 
	   if (bVerbose)
	     printf("\tShape %d: part %d has %d vertices (%d to %d)\n",
		      in,part,vCount,start,end);
	   /* create coordinate arrays for this part */
	   pX = calloc(vCount,sizeof(double));
	   pY = calloc(vCount,sizeof(double));
	   if ((pX == NULL) || (pY == NULL))
	     {
	     bOk = 0;
	     break;
	     }
	   /* copy coordinates */
	   for (p = 0; p < vCount; p++)
	     {
	     pX[p] = readShp->padfX[start+p];
	     pY[p] = readShp->padfY[start+p];
	     }  
	   newShp = SHPCreateSimpleObject(SHPT_ARC,vCount,pX,pY,NULL);
	   if (newShp == NULL)
	     {
	     bOk = 0;
	     break;
	     }
	   out = SHPWriteObject(shpOut,-1,newShp);
	   bOk = copyAttributes(dbfIn,dbfOut,in,out);
	   SHPDestroyObject(newShp);
	   free(pX);
	   free(pY);
	   }
       }
     }  
  if (bVerbose)
    {
    printf("Input file had %d features - output file has %d features\n",
	   in,out);
    }
  return bOk;
}

/* Main function */
int main(int argc, char* argv[])
{
  SHPHandle shpIn = NULL;
  SHPHandle shpOut = NULL;
  DBFHandle dbfIn = NULL;
  DBFHandle dbfOut = NULL;
  char shapefile[512];
  char outputfile[512];
  char command[256];
  char outputDirectory[256];
  int bOk = 1;
  int bCheckOnly = 0;
  int shapeType = 0;
  int shapeCount = 0;
  if (argc < 3)
    usage();
  strcpy(shapefile,argv[1]);
  strcpy(outputDirectory,argv[2]);
  if ((argc > 3) && (strcasecmp(argv[3],"-v") == 0))
    bVerbose = 1;
  else if ((argc > 3) && (strcasecmp(argv[3],"-check") == 0))
    bCheckOnly = 1;
  /* note check and verbose are mutually exclusive */
  char * lastSlash = strrchr(shapefile,'/');
  if (lastSlash == NULL)
     lastSlash = shapefile;
  else 
     lastSlash++;
  sprintf(outputfile,"%s/%s",outputDirectory,lastSlash);
  shpIn = SHPOpen(shapefile,"rb");
  if (shpIn == NULL)
    {
    printf("ERROR - Failed to open input shapefile %s.shp\n",shapefile);
    exit(1);
    }
  SHPGetInfo(shpIn,&shapeCount,&shapeType,NULL,NULL);
  /* Add capability to modify field name */
  //printf("shapeType is %d\n", shapeType);
  if (!((shapeType == SHPT_POINT) || (shapeType == SHPT_POINTZ) ||
	(shapeType == SHPT_ARC) || (shapeType == SHPT_ARCZ)))
     {
     printf("MapEval can only import points and polylines\n"); 
     SHPClose(shpIn);
     exit(9);
     }
  dbfIn =  DBFOpen(shapefile,"rb");
  if (dbfIn == NULL)
     {
     printf("ERROR - Failed to open input attribute %s.dbf\n",shapefile);
     exit(2);
     }
  if (bCheckOnly)
    {
    if (!allFeaturesSimple(shpIn))
	{
	printf("Some features have multiple parts - use prepareShpFiles utility to convert\n");
	exit(7);
	}
    }
  dbfOut = DBFCreate(outputfile);  
  if (dbfOut == NULL)
    {
    printf("ERROR - Failed to create output attribute file %s.dbf\n",outputfile);
    exit(4);
    }
  if (!initializeDbfFields(dbfIn,dbfOut))
    {
    printf("ERROR - Failed to initialize fields in new attribute file\n");
    exit(5);
    }
  /* create the output shape file */
  if ((shapeType == SHPT_ARC) || (shapeType == SHPT_ARCZ))
    {
    shpOut = SHPCreate(outputfile,SHPT_ARC);  /* only doing this for line files*/
    if (shpOut == NULL)
       {
       printf("ERROR - Failed to create output shapefile %s.shp\n",outputfile);
       exit(3);
       }
    if (!restructureFeatures(shpIn,shpOut,dbfIn,dbfOut))
      {
      printf("ERROR - Failed to copy data from input to output files.\n");
      exit(6);
      }
    }
  else /* for points, we just need to read and write the attributes. Copy the geo data */
    {
    int row;
    int inputCount;
    SHPGetInfo(shpIn, &inputCount,&shapeType,NULL,NULL);
    for (row = 0; (row < inputCount) && (bOk > 0); row++)
      {
      bOk = copyAttributes(dbfIn,dbfOut,row,row);
      }
    /* just copy the .shp part */
    sprintf(command,"cp -p %s.shp %s",shapefile,outputDirectory);
    system(command);
    }
  SHPClose(shpIn);
  if (shpOut != NULL) 
    SHPClose(shpOut);
  DBFClose(dbfIn);
  DBFClose(dbfOut);
  exit(0);
}
