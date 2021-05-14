# pvs = list of widget names that are currently blocking the beam
# first pv gives beam direction
from org.csstudio.opibuilder.scriptUtil import PVUtil, ConsoleUtil, FileUtil
from org.eclipse.draw2d.geometry import PointList
import os

def makePointList(tuples):
    """Utility function to turn an array of python (x,y) tuples into a draw2d
    points list that can be used in the points property of a polyline or 
    similar"""
    points = PointList()    
    for x, y in tuples:
        points.addPoint(x, y)
    return points

def makeTuples(points):
    """Utility function to turn a draw2d points list into an array of python 
    (x,y) tuples"""
    tuples = []
    for i in range(points.size()):
        pt = points.getPoint(i)
        tuples.append((pt.x(),pt.y()))    
    return tuples
    
def flipPoints(widgetPoints):
    """Flip the given points in the x direction using the given width, and
    return the points. Both points arrays are of the format that the point 
    property of the polyline widget uses"""
    displayw = display.getPropertyValue("width")    
    # Now iterate through the points, flipping the x dim  
    tuples = []
    for i in range(widgetPoints.size()):
        pt = widgetPoints.getPoint(i)
        tuples.append((displayw - pt.x(), pt.y()))
    # now turn this array of points into a java array
    return makePointList(tuples)

def flipIcon(widget, prop, sep):
    """Replace the prop of widget with its flipped counterpart if the flipped
    file exists"""


def flipDisplay(display):
    """Flip all the widgets in a display, not including the ones that use this
    script"""
    displayw = display.getPropertyValue("width") 
    for child in display.children:
        # flip points in a polyline or polygon
        widget_type = child.getPropertyValue("widget_type")
        if widget_type and widget_type.startswith("Poly"):
            # if there is a beam script then don't do this as its own beam.py
            # script will handle its flipping
            if not str(child.getPropertyValue("scripts")).endswith("beam.py"):
                points = child.getPropertyValue("points")
                child.setPropertyValue("points", flipPoints(points)) 
        else:    
            # move it to the other side of the screen
            childw = child.getPropertyValue("width")
            childx = child.getPropertyValue("x")                   
            child.setPropertyValue("x", displayw - childx - childw)
        if child.getPropertyValue("widget_type") == "Action Button":
            flipIcon(child, "image", ".")
        elif child.getPropertyValue("widget_type") == "Multistate Symbol Monitor":
            child.setPropertyValue("flip_horizontal", not child.getPropertyValue("flip_horizontal"))

# First pv tells us if we should flip
try:
    should_flip = PVUtil.getDouble(pvs[0])
except:
    should_flip = 0
    pvs[0].setValue(0)
    
# Cache the initial points of the array
if widget.getVar("orig_points") is None:
    widget.setVar("orig_points", widget.getPropertyValue("points"))

# If we don't have flipped points then generate these
if widget.getVar("flipped_points") is None:
    widget.setVar("flipped_points", flipPoints(widget.getVar("orig_points")))    

# If we should flip
if should_flip != bool(display.getVar("flipped")):
    flipDisplay(display)
    display.setVar("flipped", should_flip)       

# Now iterate through the pvs, stopping when something is blocking the beam
lastx = None
firstpv = True
for pv in pvs:
    # skip the first PV which is 'flipped' (and un-initialised until a flip occurs)
    if firstpv:
        firstpv=False
        continue
    # First get the name of the item
    name = PVUtil.getString(pv)
    # Now see if we can get a named widget from this pv value
    try:
        w = display.getWidget(name)
    except:
        continue
    # If we got this far then we have a widget that is blocking the beam
    # so store its x co-ordinate
    if should_flip:
        lastx = w.getPropertyValue("x") + w.getPropertyValue("width")
    else:
        lastx = w.getPropertyValue("x")
    break
    
# Get the right source array of points
if should_flip:
    orig_points = widget.getVar("flipped_points")
else:   
    orig_points = widget.getVar("orig_points")    
    
# If there is something blocking the beam
if lastx:
    # Now iterate through the points, truncating at lastx    
    new_points = []
    for x,y in makeTuples(orig_points):
        if should_flip:
            truncate = x < lastx
        else:
            truncate = x > lastx
        if truncate:
            new_points.append((lastx, y))
            break            
        else:
            new_points.append((x, y))
    # set widget points
    widget.setPropertyValue("points", makePointList(new_points)) 
else:
    # restore original points
    widget.setPropertyValue("points", orig_points)

   

