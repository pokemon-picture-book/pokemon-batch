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

declare -a rotoms=(
    "n"
    "h"
    "w"
    "f"
    "s"
    "c"
)

declare -a arceus=(
    "normal"
    "fire"
    "water"
    "electric"
    "grass"
    "ice"
    "fighting"
    "poison"
    "ground"
    "flying"
    "psychic"
    "bug"
    "rock"
    "ghost"
    "dragon"
    "dark"
    "steel"
    "fairy"
)

for i in `seq 721`
do
    if [ $i = "201" ]; then
        for unown in ${unowns[@]}
        do
            node src/pokemon-image $i $unown
        done
    elif [ $i = "479" ]; then
        for rotom in ${rotoms[@]}
        do
            node src/pokemon-image $i $rotom
        done
    elif [ $i = "493" ]; then
        for a in ${arceus[@]}
        do
            node src/pokemon-image $i $a
        done
    elif [ $i = "666" ]; then
        for j in `seq 20`
        do
            node src/pokemon-image $i -$j
        done
    else
        node src/pokemon-image $i
    fi
done