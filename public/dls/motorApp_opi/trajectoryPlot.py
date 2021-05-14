#!/usr/bin/env dls-python2.6

from pkg_resources import require
require("matplotlib==0.99.1.1")
require("dls.ca2==2.16")
require("dls.thread==1.12")

# install camonitor gui thread queue
import dls.thread.epics
from dls.ca2.catools import *

# PyQt 3
from qt import *

# install interactive Qt - initializes GUI
import iqt

# quit gui when all windows are closed (otherwise it just sits there)
QObject.connect(qApp, SIGNAL("lastWindowClosed()"), qApp.quit)

from pylab import *


# subclass form to implement buttons
class Plot(QHBox):
    "application class"
    def __init__(self,prefix,name):
        QHBox.__init__(self)
        self.setCaption("Trajectory Plot - %s"%prefix)        
        self.prefix = prefix
        self.name = name
        ioff()
        self.f = figure()
        hold(True)
        top = self.f.canvas.parent().parent()
        top.reparent(self, QPoint(0, 0))
        top.hide()
        top.show()
        self.e, self.p, self.sp, self.ep, self.na = 1, 1, 1, 1, 1
        self.y1data, self.y2data, self.y3data = [0], [0], [0]
        (self.y1plot,) = plot([0],[0],'b')
        if name=="Time":
            # plot time
            self.y1 = prefix + "TimeTraj"
            self.y2 = ""
            self.y3 = ""
            ylabel("Time")
            xlabel("Points")            
            self.init = 1
        else:
            xlabel("Pulses")        
            # plot trajectory
            self.y1 = prefix+name+"Traj"
            # plot actual pulses
            self.y2 = prefix+name+"Actual"
            # plot error
            self.y3 = prefix+name+"Error"        
            ylabel("%s Position"%name)
            (self.y2plot,) = plot([0],[0],'m')
            legend((self.y1,self.y2),loc="upper left",prop = matplotlib.font_manager.FontProperties(size='smaller'))            
            self.ax2 = twinx()
            (self.y3plot,) = plot([0],[0],'r')              
            ylabel("%s Error"%name)
            # monitor scaling info
            self.y2key = camonitor(self.y2,self.acallback)            
            self.y3key = camonitor(self.y3,self.acallback)            
            self.pkey = camonitor(prefix+"Npulses",self.scallback)                
            self.pkey = camonitor(prefix+"Nactual",self.scallback)              
            self.spkey = camonitor(prefix+"StartPulses",self.scallback)    
            self.epkey = camonitor(prefix+"EndPulses",self.scallback)  
            self.init = 6        
        self.y1key = camonitor(self.y1,self.acallback)
        self.ekey = camonitor(prefix+"Nelements",self.scallback)
        
        

    def scallback(self,args):
        if args.status == ECA_NORMAL:
            print "Scallback",ca_name(args.chid)        
            if ca_name(args.chid) == self.prefix+"Nelements":
                self.e = args.value
            if ca_name(args.chid) == self.prefix+"StartPulses":
                self.sp = args.value
            if ca_name(args.chid) == self.prefix+"EndPulses":
                self.ep = args.value
            if ca_name(args.chid) == self.prefix+"Npulses":
                self.p = args.value
            if ca_name(args.chid) == self.prefix+"Nactual":
                self.na = args.value                
            self.replot()

    def acallback(self,args):
        if args.status == ECA_NORMAL:
            print "Acallback",ca_name(args.chid)
            if ca_name(args.chid) == self.y1:
                self.y1data = list(args.dbr.value)
            elif ca_name(args.chid) == self.y2:
                self.y2data = list(args.dbr.value)
            elif ca_name(args.chid) == self.y3:
                self.y3data = list(args.dbr.value)
            self.replot()

    def replot(self):
        if self.init != 0:
            self.init -= 1
        else:
            print "Redraw"        
            if self.name == "Time":
                self.y1plot.set_data(range(self.e),self.y1data[:self.e])
                self.f.axes[0].set_xlim([0,self.e])
                all = self.y1data[:self.e]+[0]
                self.f.axes[0].set_ylim([(min(all)-0.1)*0.99,(max(all)+0.1)*1.01])                
            else:
                self.x1 = [ (float(x)-self.sp+1)*(self.p-1)/(self.ep-self.sp+1) for x in range(self.e) ]
                self.y1plot.set_data(self.x1,self.y1data[:self.e])
                self.f.axes[0].set_xlim([(min(self.x1)-0.1)*0.99,(max(self.x1)+0.1)*1.01])
#                self.x2 = [x*(self.ep-self.sp+1)/float(self.p)+self.sp for x in range(self.na)]
                self.y2plot.set_data(range(self.na),self.y2data[:self.na])
                self.y3plot.set_data(range(self.na),self.y3data[:self.na])
                all = self.y3data[:self.na]
                self.ax2.set_ylim([(min(all)-0.001)*0.999,(max(all)+0.001)*1.001])
                all = self.y1data[:self.e]+self.y2data[:self.na]
                self.f.axes[0].set_ylim([(min(all)-0.1)*0.99,(max(all)+0.1)*1.01])            
            draw()
        
# create and show form
s = Plot(sys.argv[1],name=sys.argv[2])
s.show()
# main loop
if "__IP" not in locals():
    qApp.exec_loop()
