#!/usr/bin/bash

for i in `seq 721`
do
    node src/pokemon-image.js $i
done