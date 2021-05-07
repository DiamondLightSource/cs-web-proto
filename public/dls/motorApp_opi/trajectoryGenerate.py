from pkg_resources import require
require("cothread==2.9")
from cothread.catools import caput
import math
import sys

prefix = sys.argv[1]

def make(*trajectories):
    """The function will do the following:
     * Calculate the maximum length of the arrays
     * Zero pad all trajectories to this length
     * Write them as trajectories for M1..M8
     * Set # Traj Elements to be this length"""
    maxlen = max([len(x) for x in trajectories])
    trajectories = [ x+[0]*(maxlen-len(x)) for x in trajectories[:8] ]    
    setupPVs = [prefix+"Nelements"]
    setupVals = [maxlen]
    caput(setupPVs,setupVals)
    trajPVs = ["%sM%sTraj"%(prefix,i+1) for i in range(len(trajectories))]
    caput(trajPVs,trajectories)
    print "Wrote trajectories for first %s motors"%len(trajectories)

def ramp(start,end,n):
    """Return a linear ramp from start to end with n elements"""
    return [ (end-start)*x/(float(n)-1)+start for x in range(n) ]

def scurve(start,end,n,s):
	"""Return an S-Curve with a constant velocity section from start to end with
	n points. The start and end S-curves each have s points"""
	ys,ye = start,end
	s1 = [ (ye-ys)*(x*x-s*s)/(2*s*float(n-1))+ys for x in range(0,s) ]
	cv = [ (ye-ys)*(x-s)/float(n-1)+ys for x in range(s,s+n) ]
	s2 = [ (ye-ys)*((s+n)*(s+n)+(4*s+2*n)*(x-s-n)-x*x)/(2*s*float(n-1))+ye for x in range(s+n+1,s+n+s+1) ]
	return s1+cv+s2

print """This python script creates trajectories out of arrays of length <= 2000.
Create up to 8 arrays, and load them with make(traj1,traj2,...).
type dir() for a list of loaded functions, and help(function) for usage.
e.g. help(make) prints:"""
print make.__doc__
print """Please go on to check the trajectories with the Plots under Axis Setup,
and set the Move Axis select for the axes you want in this scan."""
