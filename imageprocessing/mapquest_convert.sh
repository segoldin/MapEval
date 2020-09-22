#!/bin/bash
# Convert Mapquest static image to BW
# Expects one argument, the path for both files
if [ -z "$1" ]
then
   echo "Please supply a path"
   exit
fi
convert ${1}/mapquest.jpg -colorspace Gray ${1}/mapquestgray.rgb
convert -size 512x512 -depth 8 ${1}/mapquestgray.rgb -negate -threshold 88% -negate ${1}/mapquestbinary.rgb


