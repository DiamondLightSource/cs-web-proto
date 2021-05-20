#!/usr/bin/env python2.6

"""
rgawidget.py

A PyQt custom widget for Qt Designer.
"""

import random, sys
import logging, logging.handlers
from pkg_resources import require

from PyQt4 import QtCore, QtGui, uic

require("dls_pyqt4widgets")
from dls_pyqt4widgets.epics_epics_widget import *
#from epics_epics_widget import *

import rgacontrol

logger = logging.getLogger(__name__)
#logger.setLevel(logging.DEBUG)
logger.setLevel(logging.CRITICAL)

# Determine the full path of this custom widget,
# in order to load the SVG file from the same directory
pkgdir = os.path.realpath(os.path.dirname(os.path.abspath(__file__)))

class RgaWidget(EpicsSVGWidget):

    """RgaWidget(EpicsSVGWidget)
    
    Provides a custom widget that shows a vacuum rga.
    Various properties are defined so that the user can customize the
    appearance of the widget, and change the number and behaviour of the
    rga via EPICS.
    """
    
    
    # Establish rga status enumerations
    ( Fault, Idle, LocalControl, DegasFilament, CalFaraday, CalMultiplier, Barchart1_50, Barchart1_100, Barchart1_200, Analog1_200, NoRGA, Peak_Jump ) = range(-1,11)

    
    __black  = QtGui.QColor(0, 0, 0) 
    __white  = QtGui.QColor(255, 255, 255) 
    __green  = QtGui.QColor(0, 255, 0) 
    __yellow = QtGui.QColor(255, 255, 0) 
    __red    = QtGui.QColor(255, 0, 0) 

    epics_data = pyqtSignal()
    
    
    def __init__(self, parent = None):
    
        EpicsSVGWidget.__init__(self, "rga.svg", "", parent)
        self.EDM_filename = "rga.edl"
        self.EDM_Macro = None
        self.svgPathIds = ['epicscolour1',]
        self.setMouseTracking(True)
        self.setMinimumSize(QtCore.QSize(25, 25))
        self.setWindowTitle(self.tr("RGA"))
        self.setAspectRatio(1,1)

        self.rgaStatus = 0
        self.dlg = None
        
        # Hook up EPICS data event signal to trigger updateAbsorberStatus()
        # this prevents relatively length UI updates from within a callback.
        self.epics_data.connect(self.update_rga_status)
    
    def getPkgdir(self):
        '''
        getPkgdir(): Override in the subclass to provide the FQDN for the derived class module.
        '''
        pkdir = os.path.realpath(os.path.dirname(os.path.abspath(__file__)))
        logger.debug("{0:s}.getPkdir(): {1:s}".format(self.__class__.__name__, pkdir))
        return(pkdir)
    

    def paintEvent(self, event):
        EpicsSVGWidget.paintEvent(self, event)
    
    def mousePressEvent(self, event):
        if event.button() == QtCore.Qt.LeftButton:
            self.update()
    
        return(EpicsSVGWidget.mousePressEvent(self, event))
    
    
    def mouseMoveEvent(self, event):
        event.accept()
    
    def mouseReleaseEvent(self, event):
        return(EpicsSVGWidget.mouseReleaseEvent(self, event))
    
   
    def sizeHint(self):
        return QtCore.QSize(25, 25)
    
    # We provide getter and setter methods for the numberOfBubbles property.
    def getRgaStatus(self):
        return self.rgaStatus
    

    def showUninitialised(self):
        '''
        Prior to receiving any EPICS updates, the widget should show
        a disconnected state - as with EDM.
        '''
        #super(RgaWidget, self).showUninitialised()
        EpicsSVGWidget.showUninitialised(self)
        self.svgLoad(colour = RgaWidget.__white)
    
    def update_rga_status(self):
        if (self._pvkey is not None):
            if self._pvkey.connected:
                value = self._pvkey.value          
                #if (self._epics_transaction.severity == EpicsTransaction._severity_noalarm):
                if ((self._pvkey.severity is None) or (self._pvkey.severity == EpicsTransaction._severity_noalarm)):
                    if (value >= 0) and (value <= RgaWidget.Peak_Jump):
                        self.rgaStatus = value                      
                        if (self.rgaStatus == RgaWidget.Fault):
                            self.svgLoad(colour=RgaWidget.__white)
                        elif (self.rgaStatus == RgaWidget.Barchart1_50)\
                              or (self.rgaStatus == RgaWidget.Barchart1_100)\
                              or (self.rgaStatus == RgaWidget.Barchart1_200)\
                              or (self.rgaStatus == RgaWidget.Peak_Jump):
                            self.svgLoad(colour=RgaWidget.__green)
                        elif (self.rgaStatus == RgaWidget.LocalControl)\
                              or (self.rgaStatus == RgaWidget.Analog1_200)\
                              or (self.rgaStatus == RgaWidget.NoRGA):
                            self.svgLoad(colour=RgaWidget.__yellow)
                        elif (self.rgaStatus == RgaWidget.Idle)\
                            or (self.rgaStatus == RgaWidget.DegasFilament)\
                            or (self.rgaStatus == RgaWidget.CalMultiplier)\
                            or (self.rgaStatus == RgaWidget.CalFaraday):
                            self.svgLoad(colour=RgaWidget.__red)
                        else:
                            self.svgLoad(colour=RgaWidget.__white)
                    else:
                        self.svgLoad(colour=RgaWidget.__white)
                if self._pvkey.severity is not None:
                    if (self._pvkey.severity == EpicsTransaction._severity_minor):
                        self.svgLoad(colour=RgaWidget.__yellow)
                    elif (self._pvkey.severity == EpicsTransaction._severity_major):
                        self.svgLoad(colour=RgaWidget.__red)
                    elif (self._pvkey.severity == EpicsTransaction._severity_invalid):
                        self.svgLoad(colour=RgaWidget.__white)
 
                self.update()

    def leftButtonEvent(self):
        self.showEdm()
    
#    def showEdm(self):
#        '''
#        Given the PV base name and the common GUI support directory,
#        both of which have been established in the constructor,
#        we are able to invoke the appropriate EDM screen for this widget.
#        A check is first performed to ensure that the EDM panel is not already invoked.
#        '''
#        
#        feguidir = self.redirectorPath()
#        # Setup the process environment variables from support-module-versions in the QT Gui directory, given by the redirector (e.g. FE-QT-GUI)
#        # call the edm panel, with macro parameters in the same process space. 
##        p1 = Popen("source %s;export EDMDATAFILES=/dls_sw/prod/${VER_EPICS}/support/digitelMpc/${VER_MPC}/data; edm -x -m 'device=%s' -eolc digitelMpcIonpControl.edl;" %(feguidir+'/support-module-versions', self._pv_base), shell=True)
#        bInvoke = True
#        if self._edm_process != None:
#            if self._edm_process.poll() == None:
#                logging.debug("EDM process already running - skipping request")
#                bInvoke = False
#
#        if bInvoke:
#            logging.debug("EDM process not running - invoking request")
#            if self.UseEDMDATAFILES:
#                cmd = "edm -x -m 'device={0:s}' -eolc rga.edl;".format(self._pv_base)
#            else:
#                cmd = "source {0:s}/support-module-versions;".format(feguidir) \
#                      +"export EDMDATAFILES=/dls_sw/prod/${VER_EPICS}/support/rga/${VER_RGA}/data;" \
#                      +"edm -x -m 'device={0:s}' -eolc rga.edl;".format(self._pv_base)
#                
#            self._edm_process = Popen(cmd, shell=True)

    def showEdm(self):
#        pkdir = self.getPkgdir()
#        self.dlg = uic.loadUi(pkdir+'/../ui/'"rga.ui")
#        self.dlg.show()
        #pass
        RgaCtrl = rgacontrol.get_rga_control_dialogue_class()
        #self.dlg = rgacontrol.RgaControl(epics_device_name=self._pv_base)
        self.dlg = RgaCtrl(self, epics_device_name=self._pv_base)
        self.dlg.show()

    def onPVValueChange(self, pvname=None, value=None, char_value=None, severity=None, status=None, **kws):
        logger.debug("{0:s}: {1:s} Value change callback: {2:s} severity {3:s}".format(self.__class__.__name__, pvname, repr(char_value), repr(severity)))
        self.epics_data.emit()



