#!/bin/bash

# Generated run script for cs-studio.

prefix=${CONVERTER_ROOT:-}

if [ -z "$1" ]; then
    echo "No OPI specified to launch!"
    exit 1
fi

CSSTUDIO=/dls_sw/work/common/CSS/CSS_dls-4.2.x_nightly/cs-studio

PROJECT=rgamv2_0-2
MODULE=rgamv2
# Escape all periods except the one in the filename.
escaped=$(echo $1 | perl -ne "s|\.(?!opi)|[\\\46]|g; print;")
LAUNCH_OPI=/$PROJECT/$MODULE/$escaped

function tokens() {
    echo $#
}

# Only if macros are passed in (separated by a space from the filename)
# do we need a comma to separate the Position=NEW_SHELL macro from the
# others.  Otherwise, it's separated by a space.
toks=$(tokens $LAUNCH_OPI)
if [ $toks == 1 ]; then
    delimiter=" "
else
    delimiter=","
fi

LINKS="${prefix}/dls_sw/prod/R3[\46]14[\46]12[\46]3/support/rgamv2/0-2/rgamv2App/opi/opi=/rgamv2_0-2/rgamv2"

$CSSTUDIO --launcher.openFile "${LAUNCH_OPI}${delimiter}Position=NEW_SHELL -share_link $LINKS"
