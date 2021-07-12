#!/bin/env bash

DIR=$(dirname $0)
cd $DIR
EDMCOLORFILE=colours.list edm -x Pday.edl Pweek.edl Pmessage.edl FE1.edl FE2.edl
