#!/bin/bash

# Generated run script for cs-studio.

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
TOP=${SCRIPT_DIR}/../../..

# The location of css.sh
CSS_RUN_SCRIPT=$(configure-ioc s -p CSS-gui)


# pop the opifile off the head of the argument list
opifile="$1"
shift

function usage() {
    printf "\\nUsage: $0 opi-file -m macro1=value1,macro2=value2\\n\\n"
    printf "       opi-file path should be relative to $(basename "$0")\\n\\n"
    printf "       Additional arguments are passed to css.sh.\\n"
    printf "       See $CSS_RUN_SCRIPT -h for more.\\n\\n"
}

# Check for valid arguments.
if [[ -z $opifile || $opifile == "-h" || $opifile == "--help" ]]; then
    usage
    exit 1
fi
# Check that requested opi file exists.
if [[ ! -f $SCRIPT_DIR/$opifile ]]; then
    echo "OPI file $SCRIPT_DIR/$opifile does not exist"
    usage
    exit 1
fi

if [ -e "${TOP}/configure/VERSION" ] ; then
    version="$(cat "${TOP}"/configure/VERSION)"
else
    version="dev"
fi
project=machineStatusClient_${version}
module=machineStatusClient
launch_opi=/${project}/${module}/$opifile

links="${SCRIPT_DIR}=${project}/${module}"

$CSS_RUN_SCRIPT -o "${launch_opi}" -s -l "$links" "$@"
