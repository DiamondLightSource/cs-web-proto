#!/bin/env dls-python
import sys, os
import subprocess # For calling Xvfb
import atexit

# add the following for debugging
# --log_level=DEBUG

# run from gui_builder/dls_epicsparser source
# ===========================================
# sys.path.append("/home/lkz95212/R3.14.12.3/python/dls_guibuilder")
# sys.path.append("/dls_sw/work/common/python/dls_epicsparser")

# If we are running on a headless machine DISPLAY will be unset. So start Xvfb
# (a virtual X window server) and point DISPLAY to it. This is required for
# tkinter (which is used by dls_guibuilder for font rendering) to initialise
# successfully.
xvfbProcess = subprocess.Popen(["Xvfb", ":10"])

try:
    os.environ["DISPLAY"]
except KeyError:
    os.environ["DISPLAY"] = "localhost:10"

@atexit.register
def killXvfb():
    xvfbProcess.kill()

# run from COMPILED gui_builder/dls_epicsparser
# =============================================
# sys.path.append("/dls_sw/work/common/python/dls_guibuilder/prefix/lib/python2.7/site-packages")
# sys.path.append("/dls_sw/work/common/python/dls_epicsparser/prefix/lib/python2.7/site-packages")

# run from RELEASED gui_builder/dls_epicsparser
# =============================================
from pkg_resources import require
require("dls_guibuilder==1.1.2")

from dls_guibuilder import GuiBuilder, Pv, BoyScreen


gb = GuiBuilder()
gb.parse_release('configure/RELEASE')
gb.add_defs_from_xml('data/BL21I-gui.xml')

def add_frontend_rga(name, device):
    s2 = BoyScreen("boyembed", "rgamv2App_opi/rga_embed.opi", macros="device="+device)
    s1 = BoyScreen("boycomponent", "rgamv2App_opi/rga.opi", macros="device="+device)
    sevr = Pv("sevr", device+ ':STA')
    gb.add_def(name, s1, s2, sevr)
    
def add_fast_valve_gauge_interlock(name, device):
    mlist = "device={},name={}".format(device, name)
    s1 = BoyScreen("boyembed", "mks937bApp_opi/fvg_embed.opi", macros=mlist)
    s2 = BoyScreen("boydetail", "mks937bApp_opi/fvg_detail.opi", macros=mlist)
    sevr = Pv("sevr", device)
    gb.add_def(name, s1, s2, sevr)

# Add front end defs (we have to  manually describe the Gui elements since we have no IOC to refer to)
def add_external_valve(name, device, macros):
    macros = "device=%s,%s" % (device, macros)
    s1 = BoyScreen("boyembed", "dlsPLCApp_opi/vacValve_embed_box.opi", macros=macros)
    s2 = BoyScreen("boyembed", "dlsPLCApp_opi/vacValve_embed.opi", macros=macros)
    s3 = BoyScreen("boydetail", "dlsPLCApp_opi/vacValve_detail.opi", macros=macros)
    sevr = Pv("sevr", device + ':STA')
    gb.add_def(name, s1, s2, s3, sevr)

# Add definitions matching extra_def_format to the screen. This allows us to take widgets from separate component screen.
def create_component_with_defs(name, P, extra_def_format, description, regex=False):
    extra_defs = gb.find(name=extra_def_format, regex=regex)
    component_defs = gb.create_dotted(name, P)
    gb.create_component(name, P, defs=component_defs+extra_defs, description=description)

s = BoyScreen("boyembed", "BLGuiApp_opi/feBeamPermit_embed_box.opi", macros="device=FE21I-CS-BEAM-01,DESC=FE Beam Permit")
sevr = Pv("sevr", 'FE21I-CS-BEAM-01:STA')
gb.add_def('FE.Permit', s, sevr)

# fast valve gauge relay status from FE
add_fast_valve_gauge_interlock(name='FVG1', device="FE21I-VA-FVALV-01:IMGILK.B8")
add_fast_valve_gauge_interlock(name='FVG2', device="FE21I-VA-FVALV-01:IMGILK.B9")

# fast valve relay status from beamline FVALV-09
add_fast_valve_gauge_interlock(name='FVG3', device="BL21I-VA-FVALV-09:IMGILK.B8")
add_fast_valve_gauge_interlock(name='FVG4', device="BL21I-VA-FVALV-09:IMGILK.B9")

# fast valve relay status from beamline FVALV-12
add_fast_valve_gauge_interlock(name='FVG5', device="BL21I-VA-FVALV-12:IMGILK.B8")
add_fast_valve_gauge_interlock(name='FVG6', device="BL21I-VA-FVALV-12:IMGILK.B9")

# RGAs
add_frontend_rga("RGA1", "BL21I-VA-RGA-01")


add_external_valve('FE.V2', 'FE21I-VA-VALVE-02', 'DESC=FE Valve 2,valvetype=valve,name=FV2')
add_external_valve('FE.Absorber', 'FE21I-RS-ABSB-01', 'DESC=FE Absorber,valvetype=absorber,name=FABS')
add_external_valve('FE.Shutter', 'FE21I-PS-SHTR-02', 'DESC=FE Shutter,valvetype=shutter,name=FSHTR')
add_external_valve('FE.PortShutter', 'FE21I-PS-SHTR-01', 'DESC=Port Shutter,valvetype=shutter,name=FPORT')

# Create component screens
gb.create_component('FE', 'BL21I-CS-FEND-01', description='Front End Control')
gb.create_component('GBC1', 'BL21I-RS-GBC-01', description='Collimator 1')
gb.create_component('S1', 'BL21I-AL-SLITS-01', description='White Beam Slits 1')
gb.create_component('DGN', 'BL21I-DI-DIAGO-01', description='Diagon')
gb.create_component('M1', 'BL21I-OP-MIRR-01', description='Mirror 1')
gb.create_component('S2', 'BL21I-AL-SLITS-02', description='White Beam Slits 2')
gb.create_component('S3', 'BL21I-AL-SLITS-03', description='White Beam Slits 3')
gb.create_component('D1', 'BL21I-DI-PHDGN-01', description='Diagnostic 1')
gb.create_component('ABS1', 'BL21I-RS-ABS-01', description='Absorber 1')
gb.create_component('PS1', 'BL21I-RS-STAND-01', description='Pump Stand 1')
gb.create_component('D2', 'BL21I-DI-PHDGN-02', description='Diagnostic 2')
gb.create_component('M2', 'BL21I-OP-MIRR-02', description='Mirror 2')
gb.create_component('D3A', 'BL21I-DI-PHDGA-03', description='Diagnostic 3A')
gb.create_component('D3B', 'BL21I-DI-PHDGB-03', description='Diagnostic 3B')
gb.create_component('PGM', 'BL21I-OP-PGM-01', description='VLS PGM')
gb.create_component('S4', 'BL21I-AL-SLITS-04', description='Pink Beam Slits')
gb.create_component('D4', 'BL21I-DI-PHDGN-04', description='Diagnostic 4')
gb.create_component('ELAN', 'BL21I-EA-ELAN-01', description='Electron Analyser')
gb.create_component('S5', 'BL21I-AL-SLITS-05', description='Exit Slits 5')
gb.create_component('D7', 'BL21I-DI-GAS-01', description='Gas Cell')
gb.create_component('FS1', 'BL21I-OP-SHTR-01', description='Fast shutter 1')
gb.create_component('M4', 'BL21I-OP-MIRR-04', description='Mirror 4')
gb.create_component('D8', 'BL21I-DI-PHDGN-08', description='Diagnostic 8')
gb.create_component('SMPL', 'BL21I-EA-SMPL-01', description='Sample Chamber')
create_component_with_defs('M5', 'BL21I-OP-MIRR-05', "M4.ILK1", description='Mirror 5')
gb.create_component('S6', 'BL21I-AL-SLITS-06', description='Slits 6')
gb.create_component('SGM', 'BL21I-OP-SGM-01', description='SGM')
gb.create_component('ARM', 'BL21I-MO-ARM-01', description='Spectrometer Arm')
gb.create_component('HLS', 'BL21I-AL-HLS-01', description='Hydrostatic Levelling System')
gb.create_component('XCAM', 'BL21I-EA-DET-03', description='XCAM RIXS Detector')
#gb.create_component('VESS', 'BL21I-EA-VESS-01', description='Off-line Sample Vessel')
create_component_with_defs('ANDOR', 'BL21I-EA-DET-01', 'FS1.*', description='Andor CCD Detector')
create_component_with_defs('TTH', 'BL21I-MO-TTH-01', "M4.ILK1", description='Spectrometer 2Theta')

# Need to create ANDOR2 and POL from scratch, but FS1 already exists:
defs = gb.create_dotted("ANDOR2", "BL21I-EA-DET-02")
defs += gb.create_dotted("POL", "BL21I-EA-DET-02")
defs += gb.find(name="FS1.*")
gb.create_component("POL", "BL21I-EA-DET-02", defs=defs, description='Polarimeter')

# Add additional definitions to Spectrometer Safety Overview
defs = gb.find(name="TTH.Safety.*")
defs += gb.find(name="TTH.Valves")
defs += gb.find(name="TTH.AirStatus")
gb.create_screen(defs, 'SpectrometerSafety.opi')

tservDefs = gb.find(name="TSERV.NT1*")
tservSummary = gb.create_screen(tservDefs, 'BL21I-NT-TSERV-01.opi', style='row', prefer_typ="boycomponent", height=1200)

# Make the synoptic
if True:
    definitions = gb.find_from_screen('synoptic.opi')
    synoptic = gb.create_screen(definitions, 'synoptic.opi')
    gb.add_def("Synoptic", synoptic)

    # create Vacuum Screens
    tees = [
        ("SP1", "GAUGE1", "IMG1", "PIRG1", "IONP1", "RGA1"),
        ("SP1", "FVG1"),
        ("SP1", "GAUGE2", "IMG2", "PIRG2"),
        ("SP1", "IONP2"),
        ("SP1", "IONP3"),
        ("SP2", "GAUGE3", "IMG3", "PIRG3", "IONP4"),
        ("SP2", "FVG2"),
        ("SP3", "IONP5"),
        ("SP3", "GAUGE4", "IMG4", "PIRG4", "IONP6"),
        ("SP4", "IONP7"),
        ("SP4", "GAUGE5", "IMG5", "PIRG5", "IONP8"),
        ("SP5", "IONP9"),
        ("SP5", "GAUGE6", "IMG6", "PIRG6", "IONP10"),
        ("SP6", "GAUGE7", "IMG7", "PIRG7", "IONP11"),
        ("SP7", "GAUGE8", "IMG8", "PIRG8", "IONP12"),
        ("SP7", "IONP13"),
        ("SP8", "GAUGE9", "IMG9", "PIRG9", "IONP14", "RGA2"),
        ("SP8", "GUARD", "GAUGE40", "PGM.PIRG40"),
        ("SP9", "GAUGE10", "IMG10", "PIRG10", "IONP15"),
        ("SP10", "IONP16"),
        ("SP10", "GAUGE11", "IMG11", "PIRG11", "IONP17"),
        ("SP10", "FVG3"),
        ("SP11", "GAUGE12", "IMG12", "PIRG12", "IONP18"),
        ("SP11", "FVG4"),
        # There is additional vacuum planned for the electron analyser:
        #("SP12", "GAUGE13", "IMG13", "PIRG13", "IONP19", "RGA3"),
        #("SP12", "GAUGE14", "IMG14", "PIRG14", "IONP20"),
        #("SP12", "GAUGE15", "IMG15", "PIRG15"),
        ("SP12", "GAUGE13", "IMG13", "PIRG13", "IONP19"),
        ("SP13", "GAUGE16", "IMG16", "PIRG16", "IONP21"),
        ("SP14", "GAUGE17", "IMG17", "PIRG17", "IONP22"),
        ("SP15", "GAUGE18", "IMG18", "PIRG18", "IONP23"),
        ("SP15", "GAUGE19", "IMG19", "PIRG19", "IONP24"),
        ("SP16", "GAUGE20", "IMG20", "PIRG20", "IONP25"),
        ("SP16", "IONP26"),
        ("SP17", "GAUGE30", "IMG30", "PIRG30", "IONP27"), #RGA
        ("SP17", "FVG5"),
        ("SP17", "GAUGE21", "IMG21", "PIRG21"), #RGA
        ("SP17", "FVG6"),
        ("SP18", "IONP33"),
        ("SP18", "GAUGE24", "IMG24", "PIRG24", "IONP34"), #RGA
        ("SP19", "GAUGE25", "IMG25", "PIRG25", "IONP35"), #RGA
        ("SP19", "IONP38"),
        ("SP19", "IONP36"),
        ("SP20", "GAUGE26", "IMG26", "PIRG26", "IONP37", "RGA6"), #RGA
        #("SP20", "IONP39"),
    ]

    vacDefs = gb.find(
        screen_file=["*vacValve_embed.opi", '*ionp_embed.opi', "*space_embed_b.opi", "*gauge_embed.opi",
                     "*img_embed.opi", "*pirg_embed.opi", "*rga_embed.opi", "*fvg_embed.opi"])
    vacuumSummary = gb.create_screen(vacDefs, 'BL21I-vacuum.opi', style='vacuum', synoptic=synoptic, pump_tees=tees)

# Make the Load Lock vacuum screen
loadlockDefs= gb.find_from_screen('LoadLock.opi')
gb.create_screen(loadlockDefs, 'LoadLock.opi')

# Make the PGM Guard vacuum screen
pgmGuardDefs= gb.find_from_screen('PGMGuard.opi')
gb.create_screen(pgmGuardDefs, 'PGMGuard.opi')

# Make the New Vessel vacuum screen
newVesselDefs= gb.find_from_screen('SampleVacuum.opi')
gb.create_screen(newVesselDefs, 'SampleVacuum.opi')

# Make the Electron Analyser vacuum screen
eaVacDefs= gb.find_from_screen('ElectronAnalyserVacuum.opi')
gb.create_screen(eaVacDefs, 'ElectronAnalyserVacuum.opi')

# Make the interlock screen
interlockTree = (('VLVCC1.ILK1',
                    ('VLVCC1.ILK2',), ('VLVCC1.ILK3',), ('VLVCC1.ILK4',), ('VLVCC1.ILK5',) , ('VLVCC1.ILK7',), ('VLVCC1.ILK8',), ('VLVCC1.ILK9',),
                    ('VLVCC2.ILK1', ('VLVCC2.ILK2',),('VLVCC2.ILK3',),('VLVCC2.ILK4',),('VLVCC2.ILK5',),('VLVCC2.ILK6',), ('VLVCC3.ILK1', 
                        ('VLVCC3.ILK2',), ('VLVCC3.ILK3',)))
                    ),
                 ('VLVCC1.ILK6',)
                )
interlockDefs = gb.find(name=r"VLVCC[0123456789]*\.ILK[0123456789]*", regex=True)
print "INTERLOCK_DEFS count", len(interlockDefs)
interlockSummary = gb.create_screen(interlockDefs, 'BL21I-interlock-tree.opi', style='tree', prefer_file='*interlock_small_embed_box.opi',
                                    tree_spec=interlockTree)

# Make the Spectrometer interlock screen
spectrInterlockTree = (('TTH.ILK2',
                            ('TTH.ILK3',)),
                       ('TTH.ILK1',
                            ('M4.ILK1',)),
                       ('SGM.ILK2',
                            ('SGM.ILK3',)),
                       ('ARM.ILK1',),
                       ('POL.ILK1',),
                       ('SGM.ILK1',),
                )
spectrInterlockDefs = gb.find(name=r"(M4|SGM|TTH|ARM|POL)\.ILK[0123456789]*", regex=True)
print "Spectrometer INTERLOCK_DEFS count", len(spectrInterlockDefs)
spectrInterlockSummary = gb.create_screen(spectrInterlockDefs, 'SpectrometerInterlocks.opi', style='tree', prefer_file='*interlock_small_embed_box.opi',
                                    tree_spec=spectrInterlockTree)

# Make summaries
gb.find_dotted('PGM')
excluded_motors = [
    "Yaw", "Roll", "Height", "Pitch", "M1.X", "M2.X",
    ]
definitions = gb.find(not_name=excluded_motors, screen_file='*motor_homed_embed.opi')
motorSummary = gb.create_screen(definitions, 'BL21I-motor-homed.opi', style='summary',
                        prefer_file='*motor_homed_embed.opi')

definitions = gb.find(screen_file='*aravis_embed_box.opi')
cameraSummary = gb.create_screen(definitions, 'BL21I-cameras.opi', style='summary',
                        prefer_file='*aravis_embed_box.opi')

# Make Hardware Status Screen
iocs = [
    ("BL21I-VA-IOC-01", "Vacuum Internal Beamline RIO"),
    ("BL21I-VA-IOC-02", "Vacuum Internal Beamline"),
    ("BL21I-VA-IOC-03", "Vacuum RGA"),
    ("BL21I-VA-IOC-04", "Vacuum External Beamline"),
    ("BL21I-VA-IOC-05", "Vacuum External Beamline RIO"),
    ("BL21I-VA-IOC-06", "Testing Area RIO"),
    ("BL21I-VA-IOC-07", "Testing Area"),
    ("BL21I-RS-IOC-01", "Radiation Monitor (CAUTION)"),
    ("BL21I-MO-IOC-01", "Motion S1 DGN D1"),
    ("BL21I-MO-IOC-02", "Motion M1"),
    ("BL21I-MO-IOC-05", "Motion S2 S3"),
    ("BL21I-MO-IOC-06", "Motion M2 D2 D3A D3B"),
    ("BL21I-MO-IOC-09", "Motion S4 D4"),
    ("BL21I-MO-IOC-13", "Motion PGM"),
    ("BL21I-MO-IOC-17", "Motion Exit Slits"),
    ("BL21I-MO-IOC-18", "Motion Sample Chamber/M4 base"),
    ("BL21I-MO-IOC-19", "Motion Arm TTH"),
    ("BL21I-MO-IOC-20", "Motion Electron Analyser/M5/FS1"),
    ("BL21I-MO-IOC-21", "Motion SGM"),
    ("BL21I-MO-IOC-22", "Motion S6"),
    ("BL21I-MO-IOC-25", "Motion Spectrometer Arm"),
    ("BL21I-MO-IOC-50", "Motion M4 Smarpod"),
    ("BL21I-MO-IOC-51", "Motion M5 Smarpod"),
    ("BL21I-DI-IOC-01", "ERIO internal beamline"),
    ("BL21I-DI-IOC-02", "Diagnostic Cameras DGN D1 D2 D3A D4"),
    ("BL21I-DI-IOC-03", "Diagnostic Cameras S5 ELAN SMPL D8"),
    ("BL21I-CS-IOC-01", "Terminal Servers"),
    ("BL21I-DI-RSERV-01-scanner", "ERIO scanner bl21i-di-rserv-01"),
    ("BL21I-VA-RSERV-01-scanner", "ERIO scanner bl21i-va-rserv-01"),
    ("BL21I-VA-RSERV-03-scanner", "ERIO scanner bl21i-va-rserv-03"),
    ("BL21I-VA-RSERV-04-scanner", "ERIO scanner bl21i-va-rserv-04"),
    ("BL21I-BL-IOC-01", "GUI Status PVs"),
    ("BL21I-EA-IOC-01", "Andor Windows IOC (transmitter)"),
    ("BL21I-EA-IOC-02", "Andor Linux IOC (receiver)"),
    ("BL21I-EA-IOC-03", "Misc. Experimental Apparatus"),
    ("BL21I-EA-IOC-04", "PGM Zebra IOC"),
    ("BL21I-EA-IOC-05", "Andor 2 POL Windows IOC (transmitter)"),
    ("BL21I-EA-IOC-06", "Andor 2 POL Linux IOC (receiver)"),
    ("BL21I-EA-IOC-07", "XCAM Windows IOC (transmitter 1)"),
    ("BL21I-EA-IOC-08", "XCAM Linux IOC (receiver)"),
    ("BL21I-EA-IOC-09", "XCAM Centroiding IOC (transmitter 2)"),
    ("BL21I-AL-IOC-01", "HLS System"),
]


tservs = [("TSERV.NT1", "BL21I-NT-TSERV-01", "computing rack terminal server 1"),
           ("TSERV.NT2", "BL21I-NT-TSERV-02", "computing rack terminal server 2"),
           ("TSERV.VA1", "BL21I-VA-TSERV-01", "vacuum terminal server 1"),
           ("TSERV.VA3", "BL21I-VA-TSERV-03", "vacuum terminal server 3"),
           ("TSERV.VA4", "BL21I-VA-TSERV-04", "vacuum terminal server 4"),
           ("TSERV.VA5", "BL21I-VA-TSERV-05", "vacuum terminal server 5"),
           ("TSERV.VA6", "BL21I-VA-TSERV-06", "vacuum terminal server 6"),
           ("TSERV.VA7", "BL21I-VA-TSERV-07", "vacuum terminal server 7"),
           ("TSERV.VA8", "BL21I-VA-TSERV-08", "vacuum terminal server 8"),
           ("TSERV.VA20", "BL21I-VA-TSERV-20", "vacuum terminal server 20"),
           ("TSERV.VA21", "BL21I-VA-TSERV-21", "vacuum terminal server 21"),
]

# some falgs to control hardware staus screen creation
doHardwareStatus = True
autoProcServControl = True

# create hardware status screens
if doHardwareStatus:
    ioc_defs = []
    for ioc_name, ioc_desc in iocs:
        procServs = gb.find(name="%s.*" % ioc_name, screen_file="*procServ*")
        crateMons = gb.find(name="%s.*" % ioc_name, screen_file="*crateMon*")
        if not autoProcServControl:
            assert procServs + crateMons, "No procServ or crateMon element found for %s" % ioc_name
        devIocStats = gb.find(name="%s.*" % ioc_name, screen_file="devIocStats*")
        assert len(devIocStats) < 2, "More than 1 devIocStats element found for %s" % ioc_name
        autoSaves = gb.find(name="%s.*" % ioc_name, screen_file="*autosave*")
        assert len(autoSaves) < 2, "More than 1 autoSave element found for %s" % ioc_name
        # These are the macros to pass to BLGuiApp_opi/*_ioc_status_embed.opi
        macros = dict(
            IOC=ioc_name,
            desc=ioc_desc,
            iocstats=len(devIocStats),
            autosave=len(autoSaves)
        )
        if autoProcServControl:
            # this must be a soft IOC
            filename = "BLGuiApp_opi/soft_ioc_status_embed.opi"
            # need to supply pv prefix for procServ
            macros["PROCSERV"] = ioc_name            
        elif len(procServs) == 1:
            # this must be a soft IOC
            filename = "BLGuiApp_opi/soft_ioc_status_embed.opi"
            # need to supply pv prefix for procServ
            macros["PROCSERV"] = procServs[0].screens[0].macro_dict["P"]
        elif len(crateMons) == 1:
            # this must be a real IOC
            filename = "BLGuiApp_opi/real_ioc_status_embed.opi"
            # need to supply pv prefix for crateMon
            macros["CMON"] = crateMons[0].screens[0].macro_dict["device"]
        else:
            raise AssertionError("Can't create IOC embedded object from %d procServer and %d crateMon objects" % (
                len(procServs), len(crateMons)))

        if len(autoSaves) == 1:
            macros["AUTOSAVE"] = autoSaves[0].screens[0].macro_dict["device"]
        # now create the embedded screen
        synoptic = BoyScreen("boyembed", filename, macros)
        # and add it to a Def representing the ioc
        ioc_defs.append(gb.add_def(ioc_name, synoptic))

    for tserv, tserv_name, tserv_desc in tservs:
        tservDefs = gb.find(name=tserv+"*")
        tservScreen = gb.create_screen(tservDefs, tserv_name+".opi", style='row', prefer_typ="boycomponent", height=1200)
        ioc_defs.append(gb.add_def(tserv_name, BoyScreen("boyembed", "terminalServerApp_opi/terminalServer_embed.opi",
            {"P": tserv_name, "path":"../BL21IApp_opi/"+tserv_name, "desc":tserv_desc})))
            
    # we can now make our hardware status screen
    synoptic = gb.create_screen(ioc_defs, "BL21I-hardware")
    gb.add_def("Hardware", synoptic)

# Add PMAC status screen
pmacStatusDefs = gb.find(name=r"MO\.BRICK[0123456789]*", regex=True)
pmacStatusSummary = gb.create_screen(pmacStatusDefs, 'BL21I-pmac-status.opi', style='summary', prefer_file='*pmac_status_list_embed.opi')

gb.add_def("PMAC Status", pmacStatusSummary)


# Write the output
gb.write_screens()
gb.write_database('BL21I.db')
gb.write_xml('BL21I-create-gui.xml')
gb.write_launch_gui('BL21I', 'synoptic.opi')
