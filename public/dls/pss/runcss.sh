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
project=pss_${version}
module=pss
launch_opi=/${project}/${module}/$opifile

links="${SCRIPT_DIR}=${project}/${module},\
/dls_sw/prod/R3.14.12.7/ioc/BL05I/PS/Rx-y/.=/${project}/BL05I/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BL23B/PS/Rx-y/.=/${project}/BL23B/PS,\
/dls_sw/prod/R3.14.12.7/ioc/SR18C/PS/Rx-y/.=/${project}/SR18C/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BL15I/PS/Rx-y/.=/${project}/BL15I/PS,\
/dls_sw/prod/R3.14.12.7/ioc/SR02C/PS/Rx-y/.=/${project}/SR02C/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BR04C/PS/Rx-y/.=/${project}/BR04C/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BL06I/PS/Rx-y/.=/${project}/BL06I/PS,\
/dls_sw/prod/R3.14.12.7/ioc/SR20C/PS/Rx-y/.=/${project}/SR20C/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BL03I/PS/Rx-y/.=/${project}/BL03I/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BL07I/PS/Rx-y/.=/${project}/BL07I/PS,\
/dls_sw/prod/R3.14.12.7/support/devIocStats/Rx-y/devIocStatsApp/opi/opi=/${project}/devIocStats,\
/dls_sw/prod/R3.14.12.7/ioc/SR22C/PS/Rx-y/.=/${project}/SR22C/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BL13J/PS/Rx-y/.=/${project}/BL13J/PS,\
/dls_sw/prod/R3.14.12.7/ioc/SR08C/PS/Rx-y/.=/${project}/SR08C/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BL21I/PS/Rx-y/.=/${project}/BL21I/PS,\
/dls_sw/prod/R3.14.12.7/ioc/SR06C/PS/Rx-y/.=/${project}/SR06C/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BL11K/PS/Rx-y/.=/${project}/BL11K/PS,\
/dls_sw/prod/R3.14.12.7/ioc/SR12C/PS/Rx-y/.=/${project}/SR12C/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BL22B/PS/Rx-y/.=/${project}/BL22B/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BL24I/PS/Rx-y/.=/${project}/BL24I/PS,\
/dls_sw/prod/R3.14.12.7/support/cmsIon/Rx-y/cmsIonApp/opi/opi=/${project}/cmsIon,\
/dls_sw/prod/R3.14.12.7/ioc/BL21B/PS/Rx-y/.=/${project}/BL21B/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BL18I/PS/Rx-y/.=/${project}/BL18I/PS,\
/dls_sw/prod/R3.14.12.7/ioc/SR14C/PS/Rx-y/.=/${project}/SR14C/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BL02J/PS/Rx-y/.=/${project}/BL02J/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BL19I/PS/Rx-y/.=/${project}/BL19I/PS,\
/dls_sw/prod/R3.14.12.7/ioc/SR04C/PS/Rx-y/.=/${project}/SR04C/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BL12I/PS/Rx-y/.=/${project}/BL12I/PS,\
/dls_sw/prod/R3.14.12.7/support/lobbyAccess/Rx-y/lobbyAccessApp/opi/opi=/${project}/lobbyAccess,\
/dls_sw/prod/R3.14.12.7/ioc/BL14J/PS/Rx-y/.=/${project}/BL14J/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BL08I/PS/Rx-y/.=/${project}/BL08I/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BL24B/PS/Rx-y/.=/${project}/BL24B/PS,\
/dls_sw/prod/R3.14.12.7/support/radiationSafety/Rx-y/radiationSafetyApp/opi/opi=/${project}/radiationSafety,\
/dls_sw/prod/R3.14.12.7/ioc/BL13I/PS/Rx-y/.=/${project}/BL13I/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BL04I/PS/Rx-y/.=/${project}/BL04I/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BL11I/PS/Rx-y/.=/${project}/BL11I/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BL16B/PS/Rx-y/.=/${project}/BL16B/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BL22I/PS/Rx-y/.=/${project}/BL22I/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BL10I/PS/Rx-y/.=/${project}/BL10I/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BR01C/PS/Rx-y/.=/${project}/BR01C/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BL07B/PS/Rx-y/.=/${project}/BL07B/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BL04J/PS/Rx-y/.=/${project}/BL04J/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BL14I/PS/Rx-y/.=/${project}/BL14I/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BL20J/PS/Rx-y/.=/${project}/BL20J/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BR02C/PS/Rx-y/.=/${project}/BR02C/PS,\
/dls_sw/prod/R3.14.12.7/ioc/SR10C/PS/Rx-y/.=/${project}/SR10C/PS,\
/dls_sw/prod/R3.14.12.7/ioc/LI/PS/Rx-y/.=/${project}/LI/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BL23I/PS/Rx-y/.=/${project}/BL23I/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BL18B/PS/Rx-y/.=/${project}/BL18B/PS,\
/dls_sw/prod/R3.14.12.7/ioc/RT/PS/Rx-y/.=/${project}/RT/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BL16I/PS/Rx-y/.=/${project}/BL16I/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BL02I/PS/Rx-y/.=/${project}/BL02I/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BL20I/PS/Rx-y/.=/${project}/BL20I/PS,\
/dls_sw/prod/R3.14.12.7/ioc/BL09I/PS/Rx-y/.=/${project}/BL09I/PS"

$CSS_RUN_SCRIPT -o "${launch_opi}" -s -l "$links" "$@"
