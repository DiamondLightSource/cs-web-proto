#!/usr/bin/env dls-python

"""
pump-plugin.py

A vacuum pump widget custom widget plugin for Qt Designer.

"""

from PyQt4 import QtGui, QtDesigner
from pumpwidget import PumpWidget


class PumpPlugin(QtDesigner.QPyDesignerCustomWidgetPlugin):

    """PumpPlugin(QtDesigner.QPyDesignerCustomWidgetPlugin)
    
    """
    
    # The __init__() method is only used to set up the plugin and define its
    # initialized variable.
    def __init__(self, parent = None):
    
        QtDesigner.QPyDesignerCustomWidgetPlugin.__init__(self)

        self.initialized = False

    # The initialize() and isInitialized() methods allow the plugin to set up
    # any required resources, ensuring that this can only happen once for each
    # plugin.
    def initialize(self, core):

        if self.initialized:
            return

        self.initialized = True

    def isInitialized(self):

        return self.initialized

    # This factory method creates new instances of our custom widget with the
    # appropriate parent.
    def createWidget(self, parent):

        return PumpWidget(parent)

    # This method returns the name of the custom widget class that is provided
    # by this plugin.
    def name(self):

        return "PumpWidget"

    # Returns the name of the group in Qt Designer's widget box that this
    # widget belongs to.
    def group(self):

        return "Diamond Widgets"

    # Returns the icon used to represent the custom widget in Qt Designer's
    # widget box.
    def icon(self):

        return QtGui.QIcon(_logo_pixmap)

    # Returns a short description of the custom widget for use in a tool tip.
    def toolTip(self):

        return ""

    # Returns a short description of the custom widget for use in a "What's
    # This?" help message for the widget.
    def whatsThis(self):

        return ""

    # Returns True if the custom widget acts as a container for other widgets;
    # otherwise returns False. Note that plugins for custom containers also
    # need to provide an implementation of the QDesignerContainerExtension
    # interface if they need to add custom editing support to Qt Designer.
    def isContainer(self):

        return False

    # Returns an XML description of a custom widget instance that describes
    # default values for its properties. Each custom widget created by this
    # plugin will be configured using this description.
    def domXml(self):

        return (
               '<widget class="PumpWidget" name=\"PumpWidget\">\n'
               " <property name=\"toolTip\" >\n"
               "  <string>Click and drag here</string>\n"
               " </property>\n"
               " <property name=\"whatsThis\" >\n"
               "  <string>The Pump widget displays an ion pump"
               "</string>\n"
               " </property>\n"
               "</widget>\n"
               )

    # Returns the module containing the custom widget class. It may include
    # a module path.
    def includeFile(self):

        return "pumpwidget"


# Define the image used for the icon.
# Define the image used for the icon.
_logo_16x16_xpm = [
"33 33 2 1",
"# c #000000",
". c #feffff",
".................................",
".................................",
".................................",
"....#.......................#....",
"....#.......................#....",
"....#.......................#....",
"....#.......................#....",
"....#.......................#....",
"....#....###############....#....",
"....#.......................#....",
"....#.......................#....",
".................................",
".................................",
"....#.......................#....",
"....#.......................#....",
"....#.......................#....",
"....#....###############....#....",
"....#.......................#....",
"....#.......................#....",
"....#.......................#....",
".................................",
".................................",
"....#.......................#....",
"....#.......................#....",
"....#....###############....#....",
"....#.......................#....",
"....#.......................#....",
"....#.......................#....",
"....#.......................#....",
"....#.......................#....",
".................................",
".................................",
"................................."]

_logo_pixmap = QtGui.QPixmap(_logo_16x16_xpm)
