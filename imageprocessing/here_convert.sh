#!/bin/bash
# Convert Here static image to BW
# Expects one argument, the path for both files
if [ -z "$1" ]
then
   echo "Please supply a path"
   exit
fi
convert ${1}/here.jpg -colorspace Gray ${1}/heregray.rgb
convert -size 512x512 -depth 8 ${1}/heregray.rgb -negate -threshold 30% ${1}/herebinary.rgb
