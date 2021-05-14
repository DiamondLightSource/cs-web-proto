#!/bin/env dls-python
import math

# constants
lam1 = 1.239842E-6
r_vls = 43
rprime_vls = 28
lamE0_base = 1239.84193

# Grating dependent values
# these globals are updated by calc_b2Shadow
N = 2000.0
b2Shadow = 15.24649988
cff = 5

# set which grating we are using
# this function contains the override b2shadow values
# so calc_b2Shadow result is ignored
def set_vpg(n=0):
    global b2Shadow
    if n == 0:  # VPG 1
        calc_b2Shadow(newN=600.0, Eref=600, newCff=2)  # VPG1
        b2Shadow = 6.63840E+00
    elif n == 1: # VPG 2
        calc_b2Shadow(newN=999.755, Eref=710, newCff=3)  # VPG2
        b2Shadow = 8.60389
    elif n == 2: # VPG 3
        calc_b2Shadow(newN=2000.0, Eref=930, newCff=5)  # VPG3
        b2Shadow = 15.264
    else:
        print 'Error, grating no.s are 1-3 only'

def calc_b2Shadow(newN, Eref, newCff, m):
    global N
    global b2Shadow
    global cff

    N = newN
    cff = newCff

    lambda_E0 = lamE0_base / Eref

    a = ((m * N * lambda_E0) / (1 - cff ** 2)) * 0.000001
    u = a + math.sqrt(1 + (a * cff) ** 2)
    alpha_norm = math.asin(u)
    beta_norm = math.acos(math.cos(alpha_norm) * cff)
    b2 = 1000 * ((math.cos(alpha_norm) ** 2) / r_vls + (math.cos(beta_norm) ** 2) / rprime_vls) / (
        2 * m * N * lambda_E0)

    b2Shadow = b2 * N * 100 * 2

    print "calculated b2Shadow: %f" % b2Shadow
    return b2Shadow


# calculate pitches given energy (inverse kinematic)
def calc_angles(E, b2):
    lam = lam1 / E

    a0 = -(1.0 / r_vls) - (1.0 / rprime_vls)
    b0 = 2 * lam * N * 1000 / rprime_vls
    c0 = (1.0 / r_vls) + (1.0 / rprime_vls) - (lam * b2 * 10000.0) - ((lam * N * 1000.0) ** 2) / rprime_vls
    e0 = (-b0 - math.sqrt(b0 ** 2 - 4 * a0 * c0)) / (2 * a0)
    f0 = (lam * N * 1000) - e0

    alpha = math.asin(e0)
    beta = -math.asin(f0)
    cff = math.cos(beta) / math.cos(alpha)
    theta = (alpha + beta) / 2

    theta_glance = 90 - math.degrees(theta)
    beta_glance = 90 - math.degrees(beta)

    print "Mirror Pitch Theta: %f,    Grating Pitch Beta %f" % (theta_glance, beta_glance)
    return (theta_glance, beta_glance)


# calcualte energy given pitches (forward kinematic)
def calc_energy(theta_glance, beta_glance):
    beta = math.radians(90 - beta_glance)
    theta = math.radians(90 - theta_glance)
    alpha = 2 * theta - beta

    e0 = math.sin(alpha)
    f0 = math.sin(-beta)
    lam = (f0 + e0) / (N * 1000)

    a0 = -(1.0 / r_vls) - (1.0 / rprime_vls)
    b0 = 2.0 * lam * N * 1000.0 / rprime_vls
    c0 = (b0 ** 2 - (-b0 - 2 * a0 * e0) ** 2) / (4 * a0)

    b2 = ((1.0 / r_vls) + (1.0 / rprime_vls) - ((lam * N * 1000.0) ** 2) / rprime_vls - c0) / (lam * 10000.0)

    E = lam1 / lam

    print "Energy : %f" % E
    print "b2Shadow : %f" % b2
    return (E, b2)

###############################################################################
#
# This section interfaces with the CSS scripting

from org.csstudio.opibuilder.scriptUtil import PVUtil, ConsoleUtil, FileUtil

# read in the N Eref m and CFF values from PVs
# calculate and set the pv representing b2Shadow
this_Cff = PVUtil.getDouble(pvs[0])
this_Eref = PVUtil.getDouble(pvs[1])
this_N = PVUtil.getDouble(pvs[2])
this_m = PVUtil.getLong(pvs[3])
calc_ok = 1
b2s = 0
try:
    b2s = calc_b2Shadow(this_N, this_Eref, this_Cff, this_m)
except Exception, e:
    print "error calculating b2Shadow :", e.message
    calc_ok = 0
pvs[4].setValue(b2s)
pvs[5].setValue(calc_ok)

