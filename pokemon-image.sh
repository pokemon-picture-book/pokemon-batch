#!/usr/bin/bash

for i in `seq 10`
do
    node src/pokemon-image.js $i
done