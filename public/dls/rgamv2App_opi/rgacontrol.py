#!/usr/bin/env dls-python2.6
"""
rgacontrol.py

RGA Control synoptic, usually invoked from the rgawidget on click.
"""

import random
import sys
import os
from subprocess import Popen
import logging
import logging.handlers
from pkg_resources import require

require("dls_pyqt4widgets")
from app import qtepicsapp

from PyQt4 import QtCore, QtGui, uic, Qwt5 as Qwt
from PyQt4.QtCore import SIGNAL, SLOT, pyqtSignal
import PyQt4.uic

import epics

#from rgaui import Ui_MainWindow

import pjmass_dlg

#from epics_epics_widget import *
logging.basicConfig()
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
#logger.setLevel(logging.CRITICAL)

# Determine the full path of this custom widget,
# in order to load the SVG file from the same directory
pkgdir = os.path.realpath(os.path.dirname(os.path.abspath(__file__)))

#Get the absolute path to my ui file
# !! This is only useful to dynamically load the UI file
# !! as this is not presently used (see below) the code is
# !! here only as a placeholder, in case I can get it working sometime.
#
if pkgdir.find('data') != -1:
    # if the word 'data' is in the path then assume this widget is
    # a built release, so don't drill down to the development tree
    # in the source
    uiFile = os.path.join(pkgdir, 'rga.ui')
else:
    # if the word 'data' is not in the path, then assume this widget is
    # in test and under the source tree.
    uiFile = os.path.join(pkgdir, '..', 'ui', 'rga.ui')

logger.debug("Loading ui file: {0:s}".format(os.path.normpath(uiFile)))

#Load the ui file, and create the RGA control window class
#form_class, base_class = uic.loadUiType(uiFile)
# !! loadUiType() does not appear to work inside a class which itself is being
# !! dynamically loaded. So have had to rely on compiling the UI file with
# !!  pyuic4 then importing the resultant module.


class NewZoomer(Qwt.QwtPlotZoomer):
    """
    Zoom in but force x-axis to have major ticks at 1.0
    """
    def __init__(self, *rest):
        Qwt.QwtPlotZoomer.__init__(self, *rest)

    def rescale(self):
        """
        Redefine zoomer to set scale major ticks to one .

        see qwt_plot_zoomer.cpp line 343
        """
        plt = self.plot()
        if not plt:
            return

        rect = self.zoomStack()[self.zoomRectIndex()]
        if rect != self.scaleRect():

            doReplot = plt.autoReplot()
            plt.setAutoReplot(False)

            x1 = rect.left()
            x2 = rect.right()

            if plt.axisScaleDiv(self.xAxis()).lowerBound() > plt.axisScaleDiv(self.xAxis()).upperBound():
                QtCore.qSwap(x1, x2)
            # re-implemented axis so that there are only major ticks with step 1.0
            # original CPP code: plt.setAxisScale(self.xAxis(), x1, x2)
            plt.setAxisScale(self.xAxis(), x1, x2, 1.0)

            y1 = rect.top()
            y2 = rect.bottom()

            if plt.axisScaleDiv(self.yAxis()).lowerBound() > plt.axisScaleDiv(self.yAxis()).upperBound():
                QtCore.qSwap(y1, y2)
            plt.setAxisScale(self.yAxis(), y1, y2)
            plt.setAutoReplot(doReplot)
            plt.replot()


class RgaPicker(Qwt.QwtPlotPicker):
    '''RgaPicker is a subclass of QwtPlotPicker.
       It handles the display of mass and pressure for a bin
       as it is hovered over with the mouse  '''
    def __init__(self, spectrum, *args):
        Qwt.QwtPlotPicker.__init__(self, *args)
        self._spectrum = spectrum

    def trackerText(self, pos):
        pos2 = self.invTransform(pos)
        index = int(pos2.x())
        mass = self._spectrum.get_mass(index)
        label = self._spectrum.get_label(index)
        pressure = self._spectrum.get_pressure(index)
        #text = Qwt.QwtText("Mass: {0:d}, {1:1.3e} mbar".format(mass, pressure))
        text = Qwt.QwtText("{0:s}, {1:1.3e} mbar".format(label, pressure))
        return text

    def drawTracker(self, painter):
        textRect = self.trackerRect(painter.font())
        if not textRect.isEmpty():
            label = self.trackerText(self.trackerPosition())
            if not label.isEmpty():
                painter.save()
                painter.setPen(QtCore.Qt.NoPen)
                painter.setBrush(QtCore.Qt.white)
                painter.drawRect(textRect)
                painter.setPen(QtCore.Qt.black)
                #painter->setRenderHint(QPainter::TextAntialiasing, false);
                label.draw(painter, textRect)
                painter.restore()


class HistogramItem(Qwt.QwtPlotItem):

    Auto = 0
    Xfy = 1

    def __init__(self, *args):
        Qwt.QwtPlotItem.__init__(self, *args)
        self.__attributes = HistogramItem.Auto
        self.__data = Qwt.QwtIntervalData()
        self.__color = QtGui.QColor()
#        self.__reference = 0.0
        self.__reference = -11.0
        self.setItemAttribute(Qwt.QwtPlotItem.AutoScale, True)
        self.setItemAttribute(Qwt.QwtPlotItem.Legend, True)
        self.setZ(20.0)

    def setData(self, data):
        self.__data = data
        self.itemChanged()

    def data(self):
        return self.__data

    def setColor(self, color):
        if self.__color != color:
            self.__color = color
            self.itemChanged()

    def color(self):
        return self.__color

    def boundingRect(self):
        result = self.__data.boundingRect()
#        if not result.isvalid():
#            return result
        if self.testHistogramAttribute(HistogramItem.Xfy):
            result = Qwt.QwtDoubleRect(result.y(), result.x(),
                                       result.height(), result.width())
            if result.left() > self.baseline():
                result.setLeft(self.baseline())
            elif result.right() < self.baseline():
                result.setRight(self.baseline())
        else:
            if result.bottom() < self.baseline():
                result.setBottom(self.baseline())
            elif result.top() > self.baseline():
                result.setTop(self.baseline())
        return result

    def rtti(self):
        return Qwt.QwtPlotItem.PlotHistogram

    def draw(self, painter, xMap, yMap, rect):
        iData = self.data()
        painter.setPen(self.color())
        x0 = xMap.transform(self.baseline())
        y0 = yMap.transform(self.baseline())
        for i in range(iData.size()):
            if self.testHistogramAttribute(HistogramItem.Xfy):
                x2 = xMap.transform(iData.value(i))
                if x2 == x0:
                    continue

                y1 = yMap.transform(iData.interval(i).minValue())
                y2 = yMap.transform(iData.interval(i).maxValue())

                if y1 > y2:
                    y1, y2 = y2, y1
                    
                if  i < iData.size() - 2:
                    yy1 = yMap.transform(iData.interval(i + 1).minValue())
                    yy2 = yMap.transform(iData.interval(i + 1).maxValue())

                    if y2 == min(yy1, yy2):
                        xx2 = xMap.transform(iData.interval(i + 1).minValue())
                        if xx2 != x0 and ((xx2 < x0 and x2 < x0)
                                          or (xx2 > x0 and x2 > x0)):
                            # One pixel distance between neighboured bars
                            y2 += 1

                self.drawBar(
                    painter, QtCore.Qt.Horizontal, QtCore.QRect(x0, y1, x2 - x0, y2 - y1))
            else:
                y2 = yMap.transform(iData.value(i))
                if y2 == y0:
                    continue

                x1 = xMap.transform(iData.interval(i).minValue())
                x2 = xMap.transform(iData.interval(i).maxValue())

                if x1 > x2:
                    x1, x2 = x2, x1

                if i < iData.size() - 2:
                    xx1 = xMap.transform(iData.interval(i + 1).minValue())
                    xx2 = xMap.transform(iData.interval(i + 1).maxValue())
                    x2 = min(xx1, xx2)
                    yy2 = yMap.transform(iData.value(i + 1))
                    if x2 == min(xx1, xx2):
                        if yy2 != 0 and ((yy2 < y0 and y2 < y0)
                                         or (yy2 > y0 and y2 > y0)):
                            # One pixel distance between neighboured bars
                            x2 -= 1
                
                self.drawBar(painter, QtCore.Qt.Vertical, QtCore.QRect(x1, y0, x2 - x1, y2 - y0))

    def setBaseline(self, reference):
        if self.baseline() != reference:
            self.__reference = reference
            self.itemChanged()
    
    def baseline(self,):
        return self.__reference

    def setHistogramAttribute(self, attribute, on=True):
        if self.testHistogramAttribute(attribute):
            return

        if on:
            self.__attributes |= attribute
        else:
            self.__attributes &= ~attribute

        self.itemChanged()

    def testHistogramAttribute(self, attribute):
        return bool(self.__attributes & attribute)

    def drawBar(self, painter, orientation, rect):
        painter.save()
        color = painter.pen().color()
        r = rect.normalized()
        factor = 125
        light = color.light(factor)
        dark = color.dark(factor)

        painter.setBrush(color)
        painter.setPen(QtCore.Qt.NoPen)
        Qwt.QwtPainter.drawRect(painter, r.x() + 1, r.y() + 1,
                                r.width() - 2, r.height() - 2)

        painter.setBrush(QtCore.Qt.NoBrush)

        painter.setPen(QtGui.QPen(light, 2))
        Qwt.QwtPainter.drawLine(
            painter, r.left() + 1, r.top() + 2, r.right() + 1, r.top() + 2)

        painter.setPen(QtGui.QPen(dark, 2))
        Qwt.QwtPainter.drawLine(
            painter, r.left() + 1, r.bottom(), r.right() + 1, r.bottom())

        painter.setPen(QtGui.QPen(light, 1))
        Qwt.QwtPainter.drawLine(
            painter, r.left(), r.top() + 1, r.left(), r.bottom())
        Qwt.QwtPainter.drawLine(
            painter, r.left() + 1, r.top() + 2, r.left() + 1, r.bottom() - 1)

        painter.setPen(QtGui.QPen(dark, 1))
        Qwt.QwtPainter.drawLine(
            painter, r.right() + 1, r.top() + 1, r.right() + 1, r.bottom())
        Qwt.QwtPainter.drawLine(
            painter, r.right(), r.top() + 2, r.right(), r.bottom() - 1)

        painter.restore()


class MassScaleDraw(Qwt.QwtScaleDraw):
    """
    Class to implement the placement of mass text on axis scales
    """

    def __init__(self, spectrum, *args):
        """
        Initialize text scale draw with label strings and any other arguments that
        """
        Qwt.QwtScaleDraw.__init__(self, *args)
        self.__spectrum = spectrum
        self.setLabelAlignment(QtCore.Qt.AlignLeft | QtCore.Qt.AlignBottom)
        self.setLabelRotation(-25.0)
       
    def label(self, value):
        """
        Apply the label at location 'value' . Since this class is to be used for BarPlots
        or LinePlots, every item in 'value' should be an integer.
        """
        label = ""
        # Get the mass name for this display channel
        if value >= 0:
            if len(self.__spectrum) > value:
                lbl  = self.__spectrum.get_label(int(value))
                mass = self.__spectrum.get_mass(int(value))
                #print "MassScaleDraw.label(): value = {0!r}  label = {1:s}".format(value, lbl)
                if mass > 0:
                    label = QtCore.QString(lbl) + " ({0:d})".format(mass)

        return Qwt.QwtText(label)


class RgaSpectrum():
    def __init__(self):
        self.__demoMode = False
        # The dictionary is of the form:
        # {mass: {'label':label, 'pressure':pressure}}
        self.__spectrum = dict()
        self.clear()
        
    def __len__(self):
        '''The length of the spectrum is defined as
           the bin number of the last non-zero mass + 1 '''
        max_bin = 0
        for bin in sorted(self.__spectrum.keys()):
            mass = self.__spectrum[bin]['mass']
            p    = self.__spectrum[bin]['pressure']
            if mass > 0:
                max_bin = bin if bin > max_bin else max_bin

        return(max_bin + 1)
        
    def __repr__(self):
        s = "RgaSpectrum:\n"
        sp = []
        i = 0
        for index in self.__spectrum.keys():
            p    = self.__spectrum[index]['pressure']
            mass = int(self.__spectrum[index]['mass'])
            s += "{0:d} => mass: {1:d}  pressure: {2:1.2e}\n".format(i, mass, p)
            i += 1
        return(s)
        
    def clear(self):
        '''Clear the spectrum'''
        self.empty_spectrum()
        
    def get_spectrum(self):
        return(self.__spectrum)

    def get_spectrum_ord_values(self):
        sp = []
        for bin in sorted(self.__spectrum.keys()):
            mass = self.__spectrum[bin]['mass']
            p    = self.__spectrum[bin]['pressure']
            if mass > 0:
                sp.append((mass, p))

        return(sp)

    def set_pressure(self, mass, pressure):
        for bin in sorted(self.__spectrum.keys()):
            bin_mass = self.__spectrum[bin]['mass']
            if mass == bin_mass:
                item = self.__spectrum[bin]
                item['pressure'] = pressure

    def get_pressure(self, index):
        pressure = 1e-15   # default effectively zero
        if (len(self.__spectrum) > index):
            pressure = sorted(self.__spectrum.items())[index][1]['pressure']
        return(pressure)

    def get_mass(self, index):
        mass = 0
        if (len(self.__spectrum) > index):
            mass = sorted(self.__spectrum.items())[index][1]['mass']
        return(int(mass))

    def get_label(self, index):
        label = "*"
        if (len(self.__spectrum) > index):
            label = sorted(self.__spectrum.items())[index][1]['label']
        return(label)

    def set_label(self, index, label):
        if (len(self.__spectrum) > index):
            sorted(self.__spectrum.items())[index][1]['label'] = label
    
    def set_mass(self, index, mass):
        if (len(self.__spectrum) > index):
            sorted(self.__spectrum.items())[index][1]['mass'] = mass
    
    def empty_spectrum(self):
        ''' Clear the contents of the spectrum '''
        self.__spectrum=dict(
            {
            0: {'mass': 0, 'label': '','pressure': 1e-15},
            1: {'mass': 0, 'label': '','pressure': 1e-15},
            2: {'mass': 0, 'label': '','pressure': 1e-15},
            3: {'mass': 0, 'label': '','pressure': 1e-15},
            4: {'mass': 0, 'label': '','pressure': 1e-15},
            5: {'mass': 0, 'label': '','pressure': 1e-15},
            6: {'mass': 0, 'label': '','pressure': 1e-15},
            7: {'mass': 0, 'label': '','pressure': 1e-15},
            8: {'mass': 0, 'label': '','pressure': 1e-15},
            9: {'mass': 0, 'label': '','pressure': 1e-15},
            10: {'mass': 0, 'label': '','pressure': 1e-15},
            11: {'mass': 0, 'label': '','pressure': 1e-15},
            12: {'mass': 0, 'label': '','pressure': 1e-15},
            13: {'mass': 0, 'label': '','pressure': 1e-15},
            14: {'mass': 0, 'label': '','pressure': 1e-15},
            15: {'mass': 0, 'label': '','pressure': 1e-15},
            })


    def set_demo_mode(self, demo):
        self.__demoMode = demo
        self.__spectrum = self.demo_data()
        
    def get_demo_mode(self):
        return(self.__demoMode)
    
    def demo_data(self):
        ''' for testing... '''
        datLin = dict({
                    0: {'mass': 2, 'label': 'H2'      ,'pressure': 5.61e-9}, 
                    1: {'mass': 4, 'label': 'He'      ,'pressure': 6.39e-12}, 
                    2: {'mass': 14, 'label': 'CH2/N2++','pressure': 3.56e-10}, 
                    3: {'mass': 15, 'label': 'CH3'     ,'pressure': 3.47e-11}, 
                    4: {'mass': 16, 'label': 'CH4'     ,'pressure': 1.92e-10}, 
                    5: {'mass': 18, 'label': 'H2O'     ,'pressure': 2.45e-10}, 
                    6: {'mass': 28, 'label': 'N2/CO'   ,'pressure': 3.17e-9}, 
                    7: {'mass': 32, 'label': 'O2'      ,'pressure': 2.85e-10}, 
                    8: {'mass': 48, 'label': 'Ar'      ,'pressure': 1.10e-10}, 
                    9: {'mass': 44, 'label': 'CO2'     ,'pressure': 2.73e-11}, 
                    10: {'mass': 69, 'label': 'CF3/C5H9','pressure': 2.23e-13},
                    11: {'mass': 0, 'label': '','pressure': 1e-15},
                    12: {'mass': 0, 'label': '','pressure': 1e-15},
                    13: {'mass': 0, 'label': '','pressure': 1e-15},
                    14: {'mass': 0, 'label': '','pressure': 1e-15},
                    15: {'mass': 0, 'label': '','pressure': 1e-15},
                    })

        return(datLin)


    
def get_rga_control_dialogue_class():
    ''' get_rga_control_dialogue_class():
    A proxy to generate the RGA dialogue class at runtime.
    The class cannot be constructed in the module or application outer context
    as it would cause the event loop to freeze. This gets around the issue.
    '''
    
    #rgaui = os.path.split(pkgdir)[0]+"/ui/rga.ui"
    rgaui = pkgdir+"/rga.ui"
    
    #logger.critical( "get_xbpm_dlg_class(): xbpmui = {0:s}".format(xbpmui))
    rga_form_class, rga_base_class = PyQt4.uic.loadUiType(rgaui)
    
    #class RgaControl(QtGui.QMainWindow, Ui_MainWindow):
    class RgaControl(rga_base_class, rga_form_class):
    
        """RgaControl(QtGui.QMainWindow, form_class)
        
        Provides a synoptic that shows a vacuum RGA control panel.
        """
    
        PJLISTSIZE = 12
        
        epics_data           = pyqtSignal(int, float, name='epics_data')
        epics_massmap_update = pyqtSignal(name='epics_massmap_update')
        epics_connection     = pyqtSignal(name='epics_connection_change')
        rga_mode_change      = pyqtSignal(name='rga_mode_change')
    
        field_vl = ['ZRVL', 'ONVL', 'TWVL', 'THVL', 'FRVL', 'FVVL', 'SXVL', 'SVVL', 'EIVL', 'NIVL', 'TEVL', 'ELVL', 'TVVL', 'TTVL', 'FTVL', 'FFVL']
        field_st = ['ZRST', 'ONST', 'TWST', 'THST', 'FRST', 'FVST', 'SXST', 'SVST', 'EIST', 'NIST', 'TEST', 'ELST', 'TVST', 'TTST', 'FTST', 'FFST']
    
        def __init__(self, parent=None, epics_device_name=None):
        
            rga_base_class.__init__(self, parent)
            #super(QtGui.QMainWindow, self).__init__(parent)

            self.setupUi(self)
            self.connect(self, QtCore.SIGNAL('epics_connection_change()'), QtCore.SLOT('slot_epics_connection_changed()'))
            # Connect EPICS notification signals to slots
            self.epics_connection.connect(self.slot_epics_connected)
            self.epics_massmap_update.connect(self.slot_massmap_udate)
            self.epics_data.connect(self.slot_spectrum_update)
            self.rga_mode_change.connect(self.slot_rga_mode_change)
    
            print("RgaControl.__init__: constructing rga_dlg <=================================================")
            
            #uic adds a function to our class called setupUi, calling this creates all the widgets from the .ui file
            self._redirname = "FE-QT4-GUI"
            self.__epics_device_name = epics_device_name
            self.setObjectName('rgaControlWindow')
            self.setWindowTitle("RGA Control")
            
            toolBar = QtGui.QToolBar(self)
            self.addToolBar(toolBar)
      
            printButton = QtGui.QToolButton(toolBar)
            printButton.setText("Print")
            printButton.setIcon(QtGui.QIcon(QtGui.QPixmap(print_xpm)))
            toolBar.addWidget(printButton)
            toolBar.addSeparator()
            
            self.__initZooming()
            
            #self.__barCurve = BarCurve()
            self.__barCurve = HistogramItem()
    #        self.__barCurve.setItemAttribute(Qwt.QwtPlotItem.AutoScale, False)
    
            self.__barCurve.attach(self.qwtPlotFullScan)
            #self.__barCurve.setBaseline(-11.0)
            self.__barCurve.setBaseline(1.00e-11)
            self.__barCurve.setColor(QtGui.QColor('#00a000'))
    
            self.connect(printButton, QtCore.SIGNAL('clicked()'), self.print_plot)
            self.connect(self.checkBoxLog, QtCore.SIGNAL('stateChanged(int)'), self.checkbox_log_change)
            self.connect(self.ButtonPJSelect, QtCore.SIGNAL('clicked()'), self.clickedPJSelect)
            self.connect(self.ButtonPJST, QtCore.SIGNAL('clicked()'), self.clickedPJST)
    
            # __spectrum holds a dictionary of mass vs pressure
            self.__spectrum = RgaSpectrum()
    
            # EPICS stuff...
            # If we have been given a RGA device name then set the title text
            self._pv_mass_pressure = []
            self._pv_mass_mass     = []
            self._pv_mass_label    = []
            for i in range(0, 16):
                self._pv_mass_mass.append(None)
                self._pv_mass_label.append(None)
                self._pv_mass_pressure.append(None)
            
            # PV for the :MASSMAP record
            self._pvkeyMasses = None
            self._pvkeyHeadCon = None
            self._pv_connected = False
    
            if self.__epics_device_name is not None:
                self.EPICSAppTitleWidget.setText(self.__epics_device_name)
                self.epics_connect()
                self.start_monitor_set()  # Get the MASSMAP record data
    
            self._edm_process_pjstriptool = None
            
            # Instantiate the Peak Jump Masses selection dialogue, ready for showing when needed
            #self._pjmassdlg = pjmass_dlg.PeakJumpSelectDlg(self, self.__epics_device_name)
            PJMassDlg = pjmass_dlg.get_pjmass_dialogue_class()
            self._pjmassdlg = PJMassDlg(epics_device_name=self.__epics_device_name)
            
            # Connect the peak Jump masses selection dialogue 'changed' signal to local function
            self._pjmassdlg.pjchanged_signal.connect(self.on_pjmass_list_changed)
                        
#           self.qwtPlotFullScan.setAxisTitle(Qwt.QwtPlot.xBottom, 'Atomic Mass')
            self.qwtPlotFullScan.setAxisTitle(Qwt.QwtPlot.yLeft, 'Pressure (mbar)')
            self.grid = Qwt.QwtPlotGrid()
            self.grid.attach(self.qwtPlotFullScan)
            self.grid.setPen(QtGui.QPen(QtCore.Qt.black, 0, QtCore.Qt.DotLine))
      
            legend = Qwt.QwtLegend()
            legend.setItemMode(Qwt.QwtLegend.ClickableItem)
            self.qwtPlotFullScan.insertLegend(legend, Qwt.QwtPlot.RightLegend)
            self.qwtPlotFullScan.plotLayout().setCanvasMargin(0)
            self.qwtPlotFullScan.plotLayout().setAlignCanvasToScales(True)
            font = self.qwtPlotFullScan.axisFont(Qwt.QwtPlot.xBottom)
            font.setPointSize(8)
            self.qwtPlotFullScan.setAxisFont(Qwt.QwtPlot.xBottom, font)
            #self.qwtPlotFullScan.setAxisAutoScale(Qwt.QwtPlot.xBottom)
            self.qwtPlotFullScan.setAxisAutoScale(Qwt.QwtPlot.yLeft)
            self.qwtPlotFullScan.setAxisScaleEngine(Qwt.QwtPlot.yLeft, Qwt.QwtLog10ScaleEngine())
            self.qwtPlotFullScan.setAxisMaxMinor(Qwt.QwtPlot.xBottom, 0)
            
            # attach a grid
            grid = Qwt.QwtPlotGrid()
            grid.enableXMin(True)
            grid.setMajPen(QtGui.QPen(QtGui.QPen(QtCore.Qt.gray)))
            grid.setMinPen(QtGui.QPen(QtGui.QPen(QtCore.Qt.lightGray)))
            grid.attach(self.qwtPlotFullScan)
     
             # picker used to display coordinates when clicking on the canvas
            self.qwtPlotFullScan.picker = RgaPicker(self.__spectrum,
                                                        Qwt.QwtPlot.xBottom,
                                                        Qwt.QwtPlot.yLeft,
                                                        Qwt.QwtPicker.PointSelection,
                                                        Qwt.QwtPlotPicker.CrossRubberBand,
                                                        #Qwt.QwtPicker.ActiveOnly,
                                                        Qwt.QwtPicker.AlwaysOn,
                                                        self.qwtPlotFullScan.canvas())
    
            self.qwtPlotFullScan.setAxisScaleDraw(Qwt.QwtPlot.xBottom, MassScaleDraw(self.__spectrum)) 
            self.plot_spectrum()

            logger.debug("{0:s}.__init__(): Base class: {1!r}   Form class: {2!r}".format(self.__class__.__name__, rga_base_class, rga_form_class))

        def sizeHint(self):
            rga_base_class.sizeHint()
            logger.debug("{0:s}.sizeHint()".format(self.__class__.__name__))
            
        def __initZooming(self):
            """Initialize zooming
            """
    
    #        self.zoomer = Qwt.QwtPlotZoomer(
            self.zoomer = NewZoomer(
                                    Qwt.QwtPlot.xBottom,
                                    Qwt.QwtPlot.yLeft,
                                    Qwt.QwtPicker.DragSelection,
                                    Qwt.QwtPicker.AlwaysOff,
                                    self.qwtPlotFullScan.canvas())
            self.zoomer.setRubberBandPen(QtGui.QPen(QtCore.Qt.blue))
        
        def checkbox_log_change(self, state):
            if state == QtCore.Qt.Checked:
                # Set plot to logarithmic
                self.qwtPlotFullScan.setAxisAutoScale(Qwt.QwtPlot.yLeft)
                self.qwtPlotFullScan.setAxisScaleEngine(Qwt.QwtPlot.yLeft, Qwt.QwtLog10ScaleEngine())
            else:
                # Set plot to linear
                #self.qwtPlotFullScan.setAxisAutoScale(Qwt.QwtPlot.yLeft)
                self.qwtPlotFullScan.setAxisScaleEngine(Qwt.QwtPlot.yLeft, Qwt.QwtLinearScaleEngine())
    
            self.qwtPlotFullScan.replot()
                   
        
        def get_pkg_dir(self):
            '''
            get_pkg_dir(): Override in the subclass to provide the FQDN for the derived class module.
            '''
            pkdir = os.path.realpath(os.path.dirname(os.path.abspath(__file__)))
            logger.debug("{0:s}.getPkdir(): {1:s}".format(self.__class__.__name__, pkdir))
            return(pkdir)
        
        def print_plot(self):
            printer = QtGui.QPrinter(QtGui.QPrinter.HighResolution)
            printer.setColorMode(QtGui.QPrinter.Color)
            printDialog = QtGui.QPrintDialog(printer)
            if printDialog.exec_():
                self.qwtPlotFullScan.print_(printer)
    
    
        def clear_zoom_stack(self):
            """Auto scale and clear the zoom stack
            """
            self.qwtPlotFullScan.setAxisScale(Qwt.QwtPlot.yLeft, 1.0e-11, 1.0e-2)
            self.qwtPlotFullScan.setAxisScale(Qwt.QwtPlot.xBottom, -1., len(self.__spectrum), 1)
            self.qwtPlotFullScan.setAxisAutoScale(Qwt.QwtPlot.yLeft)
            
            #self.qwtPlotFullScan.setAxisMaxMajor(Qwt.QwtPlot.xBottom,len(self.__spectrum))
            self.qwtPlotFullScan.replot()
            self.zoomer.setZoomBase()
    
    
        def plot_spectrum(self):
            ''' Plot the histogram of the spectrum '''
            #self.__spectrum.set_demo_mode(True)
    
            #print self.__spectrum
            #logger.debug("{0:s}.plot_spectrum():".format(self.__class__.__name__))
                    
            xarr = []
            yarr = []
            ordvals = self.__spectrum.get_spectrum_ord_values()
            x = 0
            pos = -0.25
            width = 0.5
            numValues = len(self.__spectrum)
            intervals = []
            values = Qwt.QwtArrayDouble(numValues)
            for (mass, p) in ordvals:
                # Lower limit for pressure set in HistogramItem.baseline()
                p = self.__barCurve.baseline() if p < self.__barCurve.baseline() else p
                xarr.append(x)
                yarr.append(p)
                intervals.append(Qwt.QwtDoubleInterval(pos, pos + width))
                values[x] = p
                pos += (width+0.5)
                x += 1
    
            self.__barCurve.setData(Qwt.QwtIntervalData(intervals, values))
    
            self.clear_zoom_stack()
    
        #
        # EPICS handling:
        #
        def showUninitialised(self):
            pass
        
        def epics_connect(self):
            try:
                #result = caget(self._pv, datatype = self._pv_datatype).value
                # First, close any existing connection associated with this key
                self.epics_disconnect()
                self.showUninitialised()
                for i in range(0,16):
                    if self._pv_mass_mass[i] is not None:
                        self._pv_mass_mass[i].disconnect()
                    pvname = self.__epics_device_name + ':MASSMAP.{0:s}'.format(RgaControl.field_vl[i])
                    self._pv_mass_mass[i] = epics.PV(pvname, auto_monitor=True, connection_callback=self.on_pv_connection_change)
                    logger.debug("EpicsSVGWidget: epics_connect()  PV: {0:s}".format(pvname))
                    if self._pv_mass_label[i] is not None:
                        self._pv_mass_label[i].disconnect()
                    self._pv_mass_label[i] = epics.PV(self.__epics_device_name + ':MASSMAP.{0:s}'.format(RgaControl.field_st[i]), auto_monitor=True, connection_callback=self.on_pv_connection_change)
                
                self._pvkeyMasses = epics.PV(self.__epics_device_name + ':MASSMAP', auto_monitor=True, callback=self.on_pv_value_change, connection_callback=self.on_pv_connection_change)
                self._pvkeyHeadCon = epics.PV(self.__epics_device_name + ':CON', auto_monitor=True, callback=self.on_pv_value_change, connection_callback=self.on_pv_connection_change)
            except:
                logger.debug("EpicsSVGWidget: epics_connect() Error trapped!  PV: {0:s}".format(self.__epics_device_name))
      
        
        def epics_disconnect(self):
            try:
                if self._pvkeyMasses is not None:
                    if self._pvkeyMasses.connected:
                        self._pvkeyMasses.disconnect()
                        self._pvkeyMasses = None
                if self._pvkeyHeadCon is not None:
                    if self._pvkeyHeadCon.connected:
                        self._pvkeyHeadCon.disconnect()
                        self._pvkeyHeadCon = None
                for i in range(0,16):
                    if self._pv_mass_mass[i] is not None:
                        if self._pv_mass_mass[i].connected:
                            self._pv_mass_mass[i].disconnect()
                            self._pv_mass_mass[i] = None
                    if self._pv_mass_label[i] is not None:
                        if self._pv_mass_label[i].connected:
                            self._pv_mass_label[i].disconnect()
                            self._pv_mass_label[i] = None                    
            except:
                pass
    
        def slot_massmap_udate(self):
            '''slot_massmap_udate(): 
                  The :MASSMAP pv has been modified,
                  so initiate a new monitor set of masses'''
            self.start_monitor_set()
            
        def start_monitor_set(self):
            '''start_monitor_set(): 
                   Use the :MASSMAP PV to define new mass monitors.
                   Any previous monitors must first be removed. '''
                        
            bChanged = False
            
            for i in range(0, 16):
                # Get the mass value and description from the MASSMAP record
                pvvl = self._pv_mass_mass[i]
                pvst = self._pv_mass_label[i]
                #logger.debug("{0:s}.start_monitor_set():  {1!r}   {2!r}".format(self.__class__.__name__, pvvl, pvst))
                if (pvvl.connected and pvst.connected):
                    vl = pvvl.get()
                    st = pvst.get()
                    if int(vl) > 0: # Only valid for mass > 0
                        #logger.debug("{0:s}.start_monitor_set() CONNECTED :) :  {1!r}   {2!r}".format(self.__class__.__name__, pvvl, pvst))
                        self.__spectrum.set_mass(i, vl)
                        self.__spectrum.set_label(i, st)
                        # Connect monitors to pressure PVs for each given mass
                        newMonitorPVname = "{0:s}:BAR:M{1:d}".format(self.__epics_device_name, int(vl))
                        if self._pv_mass_pressure[i] is not None:
                            if self._pv_mass_pressure[i].pvname == newMonitorPVname:
                                # if we already have this mass assigned to this PV, then leave it alone.
                                continue
                            else:
                                self._pv_mass_pressure[i].disconnect()
                        try:
                            logger.debug("{0:s}.start_monitor_set():  Monitoring {1:s}:BAR:M{2:d}".format(self.__class__.__name__, self.__epics_device_name, int(vl)))
                            self._pv_mass_pressure[i] = epics.PV("{0:s}:BAR:M{1:d}".format(self.__epics_device_name, int(vl)), auto_monitor=True, callback=self.on_pv_value_change, connection_callback=self.on_pv_connection_change)
                            bChanged = True
                        except:
                            logger.debug("EpicsSVGWidget: start_monitor_set() Error trapped!  PV: {0:s}".format(self.__epics_device_name))
                    
                #self.qwtPlotFullScan.replot()
            #self.qwtPlotFullScan.updateAxes()
            #self.qwtPlotFullScan.updateLayout()
            if bChanged:
                logger.debug("{0:s}.start_monitor_set():  bChanged: {1!r}".format(self.__class__.__name__, bChanged))
                self.qwtPlotFullScan.axisScaleDraw(Qwt.QwtPlot.xBottom).enableComponent(Qwt.QwtScaleDraw.Labels, False)
                self.qwtPlotFullScan.axisScaleDraw(Qwt.QwtPlot.xBottom).enableComponent(Qwt.QwtScaleDraw.Labels, True)
                self.plot_spectrum()
                
        @QtCore.pyqtSlot()
        def slot_epics_connected(self):
            ''' slot_epics_connected(): Called when :MASSMAP pv connection is established.'''
            self.start_monitor_set()
            logger.debug("{0:s}.slot_epics_connected():  start_monitor_set() called".format(self.__class__.__name__))

        @QtCore.pyqtSignature('slot_epics_connection_changed()')
        def slot_epics_connection_changed(self):
            ''' slot_epics_connection_change(): Called when :MASSMAP pv connection is established.
            Similar to slot_epics_connected() but for an alternative signalling mechanism'''
            if self._pv_connected:
                #self.start_monitor_set()
                #logger.debug("{0:s}.slot_epics_connection_change(): start_monitor_set() called".format(self.__class__.__name__))
                pass
            else:
                self.showUninitialised()
    
        def slot_rga_mode_change(self):
            ''' slot_rga_mode_change(): Called when :CON pv changes'''
            con = self._pvkeyHeadCon.get()
            if con == 10:  # Peak Jump Mode
                self.stripChartPJ.clear()
                self.stripChartPJ.go()
            else:
                self.stripChartPJ.stop()
        
        def slot_spectrum_update(self, mass, pressure):
            self.__spectrum.set_pressure(mass, pressure)
            #print( "{0:s}.slot_spectrum_update(): mass {1:d} Pressure: {2:1.3e}".format(self.__class__.__name__, mass, pressure) )
            self.plot_spectrum()
        
        def on_pjmass_list_changed(self):
            pvlist = self._pjmassdlg.getActivePeakMasses()
            logger.debug("{0:s}.on_pjmass_list_changed():  {1!r}".format(self.__class__.__name__, pvlist))
            self.stripChartPJ.remove_all_trend_pv()
            for pv in pvlist:
                logger.debug("{0:s}.on_pjmass_list_changed():  PV -> {1!r}".format(self.__class__.__name__, pv))
                self.stripChartPJ.add_trend_pv(pv)
        
        def on_pv_value_change(self, pvname=None, value=None, char_value=None, severity=None, status=None, **kws):
            #print( "{0:s}: {1:s} Value change callback: {2:s} severity {3:s}".format(self.__class__.__name__, pvname, repr(char_value), repr(severity)) )
            if pvname.find('MASSMAP') > -1:
                print( "{0:s}: {1:s} Value change callback: {2:s} severity {3:s}".format(self.__class__.__name__, pvname, repr(char_value), repr(severity)) )
                self.epics_massmap_update.emit()
            elif pvname.find('CON') > -1:
                #print( "{0:s}: {1:s} Value change callback: {2:s} severity {3:s}".format(self.__class__.__name__, pvname, repr(char_value), repr(severity)) )
                self.rga_mode_change.emit()
            else:
                pos = pvname.find(':BAR:M')
                if  pos > -1:
                    #print( "{0:s}: {1:s} Value change callback: {2:s} severity {3:s}".format(self.__class__.__name__, pvname, repr(char_value), repr(severity)) )
                    mass = int(pvname[pos + 6:])
                    pressure = value
                    self.epics_data.emit(mass, pressure)
                
                
            
            #self.epics_data.emit()
    
        def on_pv_connection_change(self, pvname=None, conn=None, **kws):
            self._pv_connected = conn
            self.emit(QtCore.SIGNAL('epics_connection_change()'))
            if conn:
                logger.debug("on_pv_connection_change(): PV: {0:s} - about to call emit()".format(pvname))
                self.epics_connection.emit()
                logger.debug("on_pv_connection_change(): PV: {0:s} - emit() called".format(pvname))
    
        def on_pv_connection_timeout(self, pvname=None, value=None, host=None, **kws):
            pass
        
        def clickedPJSelect(self):
            self._pjmassdlg.show()
        
        def clickedPJST(self):
            '''
            Given the PV base name and the common GUI support directory,
            both of which have been established in the constructor,
            we are able to invoke the appropriate EDM screen for this widget.
            A check is first performed to ensure that the EDM panel is not already invoked.
            '''
            
            # Setup the process environment variables from support-module-versions in the QT Gui directory, given by the redirector (e.g. FE-QT-GUI)
            # call the edm panel, with macro parameters in the same process space. 
    #        p1 = Popen("source %s;export EDMDATAFILES=/dls_sw/prod/${VER_EPICS}/support/digitelMpc/${VER_MPC}/data; edm -x -m 'device=%s' -eolc digitelMpcIonpControl.edl;" %(feguidir+'/support-module-versions', self._pv_base), shell=True)
            bInvoke = True
            if self._edm_process_pjstriptool is not None:
                if self._edm_process_pjstriptool.poll() is None:
                    logger.debug("EDM process already running - skipping request")
                    bInvoke = False
    
            if bInvoke:
                logger.debug("EDM process not running - invoking request")
                pvlist = self._pjmassdlg.getActivePeakMasses()
                pvs = ""
                for pv in pvlist:
                    pvs = pvs + "{0:s} ".format(pv)
                cmd = "buildStripToolconfig.py {0:s}log_mbar".format(pvs)
                logger.debug("{0:s}.clickedPJST():  cmd: {1:s}".format(self.__class__.__name__, cmd))
                self._edm_process_pjstriptool = Popen(cmd, shell=True)
    

            
    return(RgaControl)

        
print_xpm = \
    [
        '32 32 12 1',
        'a c #ffffff',
        'h c #ffff00',
        'c c #ffffff',
        'f c #dcdcdc',
        'b c #c0c0c0',
        'j c #a0a0a4',
        'e c #808080',
        'g c #808000',
        'd c #585858',
        'i c #00ff00',
        '# c #000000',
        '. c None',
        '................................',
        '................................',
        '...........###..................',
        '..........#abb###...............',
        '.........#aabbbbb###............',
        '.........#ddaaabbbbb###.........',
        '........#ddddddaaabbbbb###......',
        '.......#deffddddddaaabbbbb###...',
        '......#deaaabbbddddddaaabbbbb###',
        '.....#deaaaaaaabbbddddddaaabbbb#',
        '....#deaaabbbaaaa#ddedddfggaaad#',
        '...#deaaaaaaaaaa#ddeeeeafgggfdd#',
        '..#deaaabbbaaaa#ddeeeeabbbbgfdd#',
        '.#deeefaaaaaaa#ddeeeeabbhhbbadd#',
        '#aabbbeeefaaa#ddeeeeabbbbbbaddd#',
        '#bbaaabbbeee#ddeeeeabbiibbadddd#',
        '#bbbbbaaabbbeeeeeeabbbbbbaddddd#',
        '#bjbbbbbbaaabbbbeabbbbbbadddddd#',
        '#bjjjjbbbbbbaaaeabbbbbbaddddddd#',
        '#bjaaajjjbbbbbbaaabbbbadddddddd#',
        '#bbbbbaaajjjbbbbbbaaaaddddddddd#',
        '#bjbbbbbbaaajjjbbbbbbddddddddd#.',
        '#bjjjjbbbbbbaaajjjbbbdddddddd#..',
        '#bjaaajjjbbbbbbjaajjbddddddd#...',
        '#bbbbbaaajjjbbbjbbaabdddddd#....',
        '###bbbbbbaaajjjjbbbbbddddd#.....',
        '...###bbbbbbaaajbbbbbdddd#......',
        '......###bbbbbbjbbbbbddd#.......',
        '.........###bbbbbbbbbdd#........',
        '............###bbbbbbd#.........',
        '...............###bbb#..........',
        '..................###...........',
    ]
  
if __name__ == "__main__":
    from argparse import ArgumentParser
    
    usage = "usage: %(prog)s -n <RGA device name> (e.g: %(prog)s -n SR01A-VA-RGA-01)"
    parser = ArgumentParser(usage=usage)
    parser.add_argument('-n', '--device')
    parser.add_argument('-u', '--uidir')
    
    strDevice = ""

    args = parser.parse_args()
    if args.device:
        strDevice = args.device
    if (len(strDevice) < 5):
        print(usage)
    else:        
        app = qtepicsapp.QtEpicsApplication(sys.argv, strDevice[:5])
    
        def quit(*args, **kwargs):
            print 'quit() called'
    
        app.connect(app, SIGNAL("lastWindowClosed()"), app, SLOT("quit()"))
    
        RgaCtrl = get_rga_control_dialogue_class()
        #self.dlg = rgacontrol.RgaControl(epics_device_name=self._pv_base)
        dlg = RgaCtrl(None, epics_device_name=strDevice)
        dlg.show()
    
        #g.show()
        # main loop
        app.exec_()
        print 'Terminating __main__'
