#!/usr/bin/env python2.6
"""
pjmass_dlg.py

RGA Peak Jump mass selection synoptic.
Invoked from the PeakJumpSelectDlg module.
"""

import random, sys, os
import logging, logging.handlers
from pkg_resources import require

require("dls_pyqt4widgets")
from app import qtepicsapp

from PyQt4 import QtCore, QtGui, uic
from PyQt4.QtCore import SIGNAL, SLOT, pyqtSignal

#from pjmass_select import Ui_Dialog

logger = logging.getLogger(__name__)
#logger.setLevel(logging.DEBUG)
logger.setLevel(logging.CRITICAL)

# Determine the full path of this custom widget,
# in order to load the SVG file from the same directory
pkgdir = os.path.realpath(os.path.dirname(os.path.abspath(__file__)))

#Get the absolute path to my ui file
# !! This is only useful to dynamically load the UI file
# !! as this is not presently used (see below) the code is
# !! here only as a placeholder, in case I can get it working sometime.
#
if pkgdir.find('data') <> -1:
    # if the word 'data' is in the path then assume this widget is
    # a built release, so don't drill down to the development tree
    # in the source
    uiFile = os.path.join(pkgdir, 'pjmass_select.ui')
else:
    # if the word 'data' is not in the path, then assume this widget is
    # in test and under the source tree.
    uiFile = os.path.join(pkgdir,'..', 'ui', 'pjmass_select.ui')

logger.debug("Loading ui file: {0:s}".format(os.path.normpath(uiFile)))

def isNumeric(strVal):
    numeric = True
    try:
      i = float(strVal)
    except ValueError, TypeError:
        numeric = False
    return(numeric)

#Load the ui file, and create the RGA control window class
#form_class, base_class = uic.loadUiType(uiFile)
# !! loadUiType() does not appear to work inside a class which itself is being
# !! dynamically loaded. So have had to rely on compiling the UI file with pyuic4
# !! then importing the resultant module.
def get_pjmass_dialogue_class():
    ''' get_pjmass_dialogue_class():
    A proxy to generate the Peak Jump Mass dialogue class at runtime.
    The class cannot be constructed in the module or application outer context
    as it would cause the event loop to freeze. This gets around the issue.
    '''
    
    ui = pkgdir+"/pjmass_select.ui"

    PeakJumpSelectDlg = None
        
    # Check that the xbpm ui name is valid or use the default if not
    if os.path.exists(ui):
        
        pjmass_form_class, pjmass_base_class = uic.loadUiType(ui)
        
        class PeakJumpSelectDlg(pjmass_base_class, pjmass_form_class):
        #class PeakJumpSelectDlg(base_class, form_class):
        
            """PeakJumpSelectDlg(QtGui.QMainWindow, form_class)
            
            Provides a synoptic that shows a Peak Jump mass selection dialogue.
            """
            pjchanged_signal = pyqtSignal()
            
            def __init__(self, parent = None, epics_device_name = None):
            
                super(pjmass_base_class, self).__init__(parent)
                #uic adds a function to our class called setupUi, calling this creates all the widgets from the .ui file
                self.__epics_device_name = epics_device_name
                self.setupUi(self)
                self.setObjectName('PeakJumpSelectDlgWindow')
                self.setWindowTitle("Peak Jump Select")
                if self.__epics_device_name is not None:
                    self.EPICSAppTitleWidget.setText(self.__epics_device_name)
                    
                # Wrap QLineEdit controls into a list
                self.listEdit = []
                self.listEdit.append(self.editMass_1)
                self.listEdit.append(self.editMass_2)
                self.listEdit.append(self.editMass_3)
                self.listEdit.append(self.editMass_4)
                self.listEdit.append(self.editMass_5)
                self.listEdit.append(self.editMass_6)
                self.listEdit.append(self.editMass_7)
                self.listEdit.append(self.editMass_8)
                self.listEdit.append(self.editMass_9)
                self.listEdit.append(self.editMass_10)
                self.listEdit.append(self.editMass_11)
                self.listEdit.append(self.editMass_12)
                
                if self.__epics_device_name is not None:
                    for el in self.listEdit:
                        el.substitutePVBase(self.__epics_device_name)
                    
                self.connect(self.btnApply, QtCore.SIGNAL('clicked()'), self.apply);
                self.connect(self.btnOK, QtCore.SIGNAL('clicked()'), self.ok);
                self.connect(self.btnCancel, QtCore.SIGNAL('clicked()'), self.cancel);
        
            
            def getActivePeakMasses(self):
                ''' Return a list of peak Jump BIN PVs which
                    have active mass values (i.e. <> 0)'''
                retList = []
                if self.__epics_device_name is not None:
                    bin = 1
                    for el in self.listEdit:
                        text = str(el.text())
                        logger.debug("{0:s}.getActivePeakMasses(): el.text(): {1:s}".format(self.__class__.__name__, text))
                        if isNumeric(text):
                            fNum = float(text)
                            mass = int(fNum)
                            logger.debug("{0:s}.getActivePeakMasses(): mass: {1:d}".format(self.__class__.__name__, mass))
                            if mass > 0:
                                pv = "{0:s}:PJ:BIN{1:d}".format(self.__epics_device_name, bin)
                                retList.append(pv)
                        bin += 1
                        
                return retList
            
            def get_pkg_dir(self):
                '''
                get_pkg_dir(): Override in the subclass to provide the FQDN for the derived class module.
                '''
                pkdir = os.path.realpath(os.path.dirname(os.path.abspath(__file__)))
                logger.debug("{0:s}.getPkdir(): {1:s}".format(self.__class__.__name__, pkdir))
                return(pkdir)
        
            def apply(self):
                logger.debug("{0:s}.apply()".format(self.__class__.__name__))
        
                for el in self.listEdit:
                    el.updatePV()
                    
                self.pjchanged_signal.emit()
                
                
            def ok(self):
                logger.debug("{0:s}.ok()".format(self.__class__.__name__))
                self.apply()
                self.close()
        
            def cancel(self):
                logger.debug("{0:s}.cancel()".format(self.__class__.__name__))
                self.close()

            
    return(PeakJumpSelectDlg)
    

print_xpm = [
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
    app = qtepicsapp.QtEpicsApplication(sys.argv)

    def quit(*args, **kwargs):
        print 'quit() called'

    app.connect(app, SIGNAL("lastWindowClosed()"), app, SLOT("quit()"))

    dlg = PeakJumpSelectDlg()
    dlg.show()
    #dlg.exec_()
    #g.show()
    # main loop
    app.exec_()
    print 'Terminating __main__'

