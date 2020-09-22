#!/bin/bash
# Convert Google static image to BW
# Expects one argument, the path for both files
convert ${1}/google.jpg -colorspace Gray ${1}/googlegray.rgb
convert -size 512x512 -depth 8 ${1}/googlegray.rgb -negate -threshold 30% ${1}/googlebinary.rgb

