#!/bin/env dls-python

# set which grating we are using
def set_vpg(n=0):
    if n == 0:  # VPG 1
        return (2, 600, 600, 1, 86.0806992,  83.6096187)
    elif n == 1: # VPG 2
        return (3, 710, 999.755, 1, 86.0921660, 83.6122590)
    elif n == 2: # VPG 3
        return (5, 930, 2000, 1, 86.0883011, 83.6150497)
    else:
        print 'Error, grating no.s are 1-3 only'
        return (5, 930, 2000, 1, 86.0883011, 83.6150497)


###############################################################################
#
# This section interfaces with the CSS scripting

from org.csstudio.opibuilder.scriptUtil import PVUtil, ConsoleUtil, FileUtil

# read in the grating poitioner enum
# set pvs representing the parameters for the vpg
vpg_no = PVUtil.getLong(pvs[0])

Cff, Eref, N, m, grt_off, mirr_off = set_vpg(vpg_no)
print (Cff, Eref, N, m, grt_off, mirr_off)
pvs[1].setValue(Cff)
pvs[2].setValue(Eref)
pvs[3].setValue(N)
pvs[4].setValue(m)
pvs[5].setValue(grt_off)
pvs[6].setValue(mirr_off)
