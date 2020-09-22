#!/bin/bash
# Convert Bing static image to BW
# Expects one argument, the path for both files
if [ -z "$1" ]
then
   echo "Please supply a path"
   exit
fi
convert ${1}/bing.jpg -colorspace Gray ${1}/binggray.rgb
convert -size 512x512 -depth 8 ${1}/binggray.rgb -negate -threshold 30% ${1}/bingbinary.rgb
