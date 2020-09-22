# Makefile for guided vectorization components of MapEval
# Copyright 2020 Sally E. Goldin
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

ifeq ($(OSTYPE),WINDOWS)
	EXECEXT =.exe
	COMP	=__MINGCC__
	PLATFORM	=mingw
else
	EXECEXT =
	COMP	=__GCC__
	PLATFORM	=linux
endif
# actually has not bee tested on Windows/MinGW

EXECUTABLES= calcPixelSize$(EXECEXT) guidedVectorize$(EXECEXT) 

all : $(EXECUTABLES)

guidedVectorize.o : guidedVectorize.c structures.h fileFunctions.h debugFunctions.h
	gcc -c guidedVectorize.c


debugFunctions.o : debugFunctions.c debugFunctions.h structures.h
	gcc -c debugFunctions.c

fileFunctions.o : fileFunctions.c structures.h  fileFunctions.h 
	gcc -c fileFunctions.c

calcPixelSize.o : calcPixelSize.c structures.h fileFunctions.h
	gcc -c calcPixelSize.c


guidedVectorize$(EXECEXT) : guidedVectorize.o fileFunctions.o debugFunctions.o
	gcc -o guidedVectorize$(EXECEXT) guidedVectorize.o fileFunctions.o debugFunctions.o -lm 

calcPixelSize$(EXECEXT) : calcPixelSize.o fileFunctions.o
	gcc -o calcPixelSize$(EXECEXT) calcPixelSize.o fileFunctions.o 

clean : 
	-rm *.o
	-rm $(EXECUTABLES) 
