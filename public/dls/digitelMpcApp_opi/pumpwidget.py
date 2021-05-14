"""
pumpwidget.py

A PyQt custom widget for Qt Designer.
"""

import random, sys
import logging, logging.handlers
from pkg_resources import require

from PyQt4 import QtCore, QtGui

require("dls_pyqt4widgets")
from dls_pyqt4widgets.epics_epics_widget import *

#from epics_epics_widget import *

logger = logging.getLogger(__name__)
#logger.setLevel(logging.DEBUG)
logger.setLevel(logging.CRITICAL)

class PumpWidget(EpicsSVGWidget):

    """PumpWidget(EpicsSVGWidget)
    
    Provides a custom widget that shows a vacuum pump.
    Various properties are defined so that the user can customize the
    appearance of the widget, and change the number and behaviour of the
    pump via EPICS.
    """
    
    
    # Establish pump status enumerations
    (Fault, Waiting, Standby, SafeCon, Running, CoolDown, PumpError, HVOff, Interlock, Shutdown, Calibration, Invalid) = range(12)

    
    __black  = QtGui.QColor(0,0,0) 
    __white  = QtGui.QColor(255,255,255) 
    __green  = QtGui.QColor(0,255,0) 
    __yellow = QtGui.QColor(255,255,0) 
    __red    = QtGui.QColor(255,0,0) 
    
   
    def __init__(self, parent = None):
    
        EpicsSVGWidget.__init__(self, "ionp.svg", "", parent)
        self.EDM_filename = "digitelMpcIonpControl.edl"
        self.EDM_Macro = None
        self.svgPathIds = ['epicscolour1',]
        self.setMouseTracking(True)
#        self.setMinimumSize(QtCore.QSize(37, 40))
        self.setMinimumSize(QtCore.QSize(25, 25))
        self.setWindowTitle(self.tr("Pump"))

        self.pumpStatus = 0
        self._twoSetpoints = False
        self._edm_process = None
        # Hook up EPICS data event signal to trigger updateAbsorberStatus()
        # this prevents relatively length UI updates from within a callback.
        self.epics_data.connect(self.updatePumpStatus)

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
    
    
    @staticmethod
    def mouseMoveEvent(event):
        event.accept()
    
    def mouseReleaseEvent(self, event):
        return(EpicsSVGWidget.mouseReleaseEvent(self, event))
    
   
    @staticmethod
    def sizeHint():
    
        return QtCore.QSize(26, 26)

    def showUninitialised(self):
        '''
        Prior to receiving any EPICS updates, the widget should show
        a disconnected state - as with EDM.
        '''
        self.svgLoad(colour = PumpWidget.__white)
                   
    
    # We provide getter and setter methods for the numberOfBubbles property.
    def getPumpStatus(self):
    
        return self.pumpStatus
    
    
    def showUninitialised(self):
        '''
        Prior to receiving any EPICS updates, the widget should show
        a disconnected state - as with EDM.
        '''
        super(PumpWidget, self).showUninitialised()
        self.svgLoad(colour = PumpWidget.__white)
    

    def updatePumpStatus(self):
    
        if self._pvkey is not None:
            if self._pvkey.connected:
                value = self._pvkey.get()
                if ((self._pvkey.severity is None) or (self._pvkey.severity == EpicsTransaction._severity_noalarm)):
                    if (value >= 0) and (value <= PumpWidget.Invalid):
                        self.pumpStatus = value
                        
                        if self.pumpStatus == PumpWidget.Fault:
                            self.svgLoad(colour = PumpWidget.__white)
                        elif self.pumpStatus == PumpWidget.Waiting:
                            self.svgLoad(colour = PumpWidget.__yellow)
                        elif (self.pumpStatus == PumpWidget.Standby) or (self.pumpStatus == PumpWidget.SafeCon):
                            self.svgLoad(colour = PumpWidget.__red)
                        elif self.pumpStatus == PumpWidget.Running:
                            self.svgLoad(colour = PumpWidget.__green)
                        elif self.pumpStatus == PumpWidget.CoolDown:
                            self.svgLoad(colour = PumpWidget.__yellow)
                        elif (self.pumpStatus == PumpWidget.PumpError)\
                              or (self.pumpStatus == PumpWidget.HVOff)\
                              or (self.pumpStatus == PumpWidget.Interlock)\
                              or (self.pumpStatus == PumpWidget.Invalid):
                            self.svgLoad(colour = PumpWidget.__red)
                        else:
                            self.svgLoad(colour = PumpWidget.__white)
                    else:
                        self.svgLoad(colour = PumpWidget.__white)
                if self._pvkey.severity is not None:
                    if (self._pvkey.severity == EpicsTransaction._severity_minor):
                            self.svgLoad(colour = PumpWidget.__yellow)
                    elif (self._pvkey.severity == EpicsTransaction._severity_major):
                            self.svgLoad(colour = PumpWidget.__red)
                    elif (self._pvkey.severity == EpicsTransaction._severity_invalid):
                            self.svgLoad(colour = PumpWidget.__white)
                
        else: # Invalid
            self.svgLoad(colour = PumpWidget.__white)
 
        self.update()

    def leftButtonEvent(self):
        self.showEdm()
    
    def showEdm(self):
        '''
        Given the PV base name and the common GUI support directory,
        both of which have been established in the constructor,
        we are able to invoke the appropriate EDM screen for this widget.
        A check is first performed to ensure that the EDM panel is not already invoked.
        '''
        # Dictionary of local gauge type identifiers mapped to configure-ioc redirector names
        #redirectorName = "FE-SUPPORT-digitelMpc"
        # --> Support for two pairs of protection setpoints added April 2017 (IJG)
        redirectorNames = {"1SP":"FE-SUPPORT-digitelMpc", "2SP":"FE-SUPPORT-digitelMpc2sp"}
        
        feguidir = self.redirectorPath()
        # Setup the process environment variables from support-module-versions in the QT Gui directory, given by the redirector (e.g. FE-QT-GUI)
        # call the edm panel, with macro parameters in the same process space. 
#        p1 = Popen("source %s;export EDMDATAFILES=/dls_sw/prod/${VER_EPICS}/support/digitelMpc/${VER_MPC}/data; edm -x -m 'device=%s' -eolc digitelMpcIonpControl.edl;" %(feguidir+'/support-module-versions', self._pv_base), shell=True)
        bInvoke = True
        if self._edm_process is not None:
            if self._edm_process.poll() is None:
                logger.debug( "EDM process already running - skipping request")
                bInvoke = False

        if bInvoke:
            logger.debug( "EDM process not running - invoking request")
            if (self._twoSetpoints):
                edmdirectory = self.redirectorPath(redirectorNames["2SP"])
            else:
                edmdirectory = self.redirectorPath(redirectorNames["1SP"])

            cmd = "export EDMDATAFILES={0:s};".format(edmdirectory) \
                  +"edm -x -m 'device=%s' -eolc digitelMpcIonpControl.edl;" %(self._pv_base)
            
            self._edm_process = Popen(cmd, shell=True)

    
    def onPVValueChange(self, pvname=None, value=None, char_value=None, severity=None, status=None, **kws):
        # logger.debug( "%s: %s Value change callback: %s severity %s" %(self.__class__.__name__, pvname, repr(char_value), repr(severity)) )
        self.epics_data.emit()

    # Custom properties:
    
    # The following custom property was added after Vacuum Group requested that 
    # the digitelMpc second set of protection setpoints be made available via EPICS.
    # This means that two variants of the EDM panel need to be supported, one for digitelMpc support module which 
    # defines both setpoints (SP1 and SP2) and the original support module which defines just one SP.
    def getTwoSetpoints(self):
        return self._twoSetpoints
    
    def setTwoSetpoints(self, haveTwoSetpoints):
        self._twoSetpoints = haveTwoSetpoints
    
    def resetTwoSetpoints(self):
        self._twoSetpoints = False
    
    twoSetpoints = QtCore.pyqtProperty("bool", getTwoSetpoints, setTwoSetpoints, resetTwoSetpoints)


