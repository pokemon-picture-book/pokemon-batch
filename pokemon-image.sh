#!/usr/bin/bash

declare -a unowns=(
    "a"
    "b"
    "c"
    "d"
    "e"
    "f"
    "g"
    "h"
    "i"
    "j"
    "k"
    "l"
    "m"
    "n"
    "o"
    "p"
    "q"
    "r"
    "s"
    "t"
    "u"
    "v"
    "w"
    "x"
    "y"
    "z"
    "exclamation"
    "question"
)

for i in `seq 721`
do
    if [ $i = "201" ]; then
        for unown in ${unowns[@]}
        do
            node src/pokemon-image $i $unown
        done
    else
        node src/pokemon-image $i
    fi
done