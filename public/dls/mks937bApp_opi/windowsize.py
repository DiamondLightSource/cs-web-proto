#!/usr/bin/env dls-python
'''
Created on 18 August 2015

@author: ig43

Utility to facilitate toggling any given X11 window
between expanded and collapsed dimensions. This is
of particular use for EDM screens where extra detail
is available by clicking a button - then returns to
a smaller overview screen when the button is clicked
again.

All that needs to be provided is the collapsed dimension
and the expanded dimension,
like thus (ideal for a 'Shell Command' control):

windowsize.py --x1=240 --x2=726

Further parameters --y1 and --y2 are recognised to permit height
toggling if required.

This utility makes extensive use of the Linux tool 'xdotool'
which has some very useful and powerful features for manipulating
specific X11 windows.

'''

from optparse import OptionParser
import getopt
import string
import subprocess

class XWindow:
    def __init__(self):
        self.width = 0
        self.height = 0

        self.get_geometry()


    def get_geometry(self, window = None):
        ''' get_geometry(window):
        Get the window geometry of the parent X11 window associated with this script.
        Params: window [optional] - specifies a specific window ID, or the main windo
        associated with this instance of the script in None.
        '''
        res = subprocess.check_output(["xdotool", "getactivewindow", "getwindowgeometry", "--shell"])
        sar = string.split(res, '\n')
        gad = {}
        for tp in sar:
            t = string.split(tp,'=')
            print t,len(t)
            if len(t) > 1:
                gad[t[0]] = t[1]

        if gad.has_key('WIDTH'):
            self.width = int(gad['WIDTH'])

        if gad.has_key('HEIGHT'):
            self.height = int(gad['HEIGHT'])
            
    def set_geometry(self, width=None, height=None):
        ''' set_geometry(width, height):
        Set the window geometry of the parent X11 window associated with this script.
        If either width or height parameters are not supplied, then this dimension will remain unchanged.
        Params: width  [optional] - adjust window width to width px.
                height [optional] - adjust window height to height px.
        '''
        if ((width is None) or (width < 1)):
            width = self.width
        if ((height is None) or (height < 1)):
            height = self.height
            
        subprocess.call(["xdotool", "getactivewindow", "windowsize", "{0}".format(width), "{0}".format(height)])
        #subprocess.call(["xdotool", "getactivewindow", "windowsize", "--sync", "{0}".format(width), "{0}".format(height)])
        
def main():
    usage = "usage: %prog -x1 <collapsed width> -y1 <collapsed height -x2 <expanded width> -y2 <expanded height"
    #parser = OptionParser(usage=usage)
    parser = OptionParser()
    parser.add_option("--x1", dest="widthCollapsed" , type="int", help="collapsed width")
    parser.add_option("--y1", dest="heightCollapsed", type="int", help="collapsed height")
    parser.add_option("--x2", dest="widthExpanded"  , type="int", help="expanded width")
    parser.add_option("--y2", dest="heightExpanded" , type="int", help="expanded height")
    
    widthCollapsed  = 0
    widthExpanded   = 0
    heightCollapsed = 0
    heightExpanded  = 0
    
    isExpanded = False
    
    (options, args) = parser.parse_args()
    if options.widthCollapsed:
        widthCollapsed = options.widthCollapsed
    if options.heightCollapsed:
        heightCollapsed = options.heightCollapsed
    if options.widthExpanded:
        widthExpanded = options.widthExpanded
    if options.heightExpanded:
        heightExpanded = options.heightExpanded
    
    if (not options.widthCollapsed):
        print("Usage: mks937btest.py --x1 <collapsed width> --y1 <collapsed height --x2 <expanded width> --y2 <expanded height")
    
    window = XWindow()
    print("Width collapsed: {0:d}\nHeight collapsed: {1:d}".format(widthCollapsed, heightCollapsed))
    print("Width expanded: {0:d}\nHeight expanded: {1:d}".format(widthExpanded, heightExpanded))
    print("Window Width: {0}  Height {1}".format(window.width, window.height))
    
    # The following code will toggle the expanded or collapsed state depending on
    # the present actual dimensions of the window compared with the expanded and
    # collapsed values.
    # If the width is closer to the expanded value than the collapsed value,
    # then assume it's expanded.
    if abs(widthExpanded - window.width) < abs(window.width - widthCollapsed):
        isExpanded = True;
    
    # Now toggle...
    if (isExpanded):
        print "Exanded: collapsing"
        window.set_geometry(widthCollapsed,heightCollapsed)
    else:
        print "Collapsed: expanding"
        window.set_geometry(widthExpanded,heightExpanded)
    
if __name__ == "__main__":
    main()


