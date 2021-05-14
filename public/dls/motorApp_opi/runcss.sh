#!/bin/bash

# Generated run script for cs-studio.
PREFIX=${CONVERTER_ROOT}
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
TOP=${SCRIPT_DIR}/../../..

if [[ -z $1 ]]; then
    echo "No OPI specified to launch!"
    exit 1
fi

# pop the opifile off the head of the argument list
opifile="$1"
shift

# css.sh
CSS_RUN_SCRIPT=$(configure-ioc s -p CSS-gui)

if [ -e ${TOP}/configure/VERSION ] ; then
    version="$(cat ${TOP}/configure/VERSION)"
else
    version="dev"
fi
project=motor_${version}
module=motor
launch_opi=/${project}/${module}/$opifile

links="${SCRIPT_DIR}=${project}/${module}"

$CSS_RUN_SCRIPT -o ${launch_opi} -s -l "$links" "$@"
