from pkg_resources import require
require('dls_serial_sim')
from dls_serial_sim import serial_device

# The vacuum device manager class is responsible for calling the process
# functions once per second.  There is only ever a single instance of this
# class, created automaticallyas a global.  There is no need to ever create
# instances of this class manually.
# Its purpose is to avoid a proliferation of threads in the vacuum simulation
# objects, which appears to cause problems for Python.
class VacuumDeviceManager(serial_device):
    def __init__(self):
        serial_device.__init__(self)
        self.devices = []
        self.start_no_io()
        self.schedule(self.process, 1)

    def addDevice(self, device):
        self.devices.append(device)

    def process(self):
        for device in self.devices:
            device.process()

# The one and only
vacuumSpaceDeviceMgr = VacuumDeviceManager()


# Create instances of this class to represent hardware interlock connections.  An
# instance connects an interlock source to an interlock destination, transferring
# the current state of the source to the destination once per second, when the
# process function is called by the VacuumDeviceManager.
class InterlockConnection(object):

    def __init__(self, name='none',
            sourceDev=None, sourceSignal=0, sourceBit=0,
            destDev=None, destSignal=0, destBit=0):
        self.name = name
        self.sourceDev = sourceDev
        self.sourceSignal = sourceSignal
        self.sourceBit = sourceBit
        self.destDev = destDev
        self.destSignal = destSignal
        self.destBit = destBit
        print "Create interlock connection %s, %s:%s:%s to %s:%s:%s" % (name,
            sourceDev.name, sourceSignal, sourceBit,
            destDev.name, destSignal, destBit)
        vacuumSpaceDeviceMgr.addDevice(self)

    def process(self):
        '''Perform background interlock processing.'''
        curState = self.sourceDev.getInterlock(self.sourceSignal, self.sourceBit)
        self.destDev.putInterlock(self.destSignal, self.destBit, curState)

# A vacuum assembly is a combination of a pump, an inverted magnetron gauge,
# a pirani gauge and an RGA.  All elements are optional.  The gauges follow
# the pressure indicated by the pump, unless it is missing, in which case they
# follow the pressure indicated by the vacuum space they are part of.
class VacuumAssembly(object):

    def __init__(self, name='none', pump=None, imgGauge=None,
            piraniGauge=None, rga=None):
        text = "Create vacuum assembly %s" % name
        if pump is not None:
            text += ", pump=%s" % pump.name
        if imgGauge is not None:
            text += ", imgGauge=%s" % imgGauge.name
        if piraniGauge is not None:
            text += ", piraniGauge=%s" % piraniGauge.name
        if rga is not None:
            text += ", rga=%s" % rga.name
        print text
        self.name = name
        self.pump = pump
        self.imgGauge = imgGauge
        self.piraniGauge = piraniGauge
        self.rga = rga
        self.pressure = 1.0

    def operatePump(self, spacePressure):
        # Operate the pump
        if self.pump is not None:
            if self.pump.pumpSize > 0:
                factor = 1.0 / (float(self.pump.pumpSize) / 100.0)
                if factor < 2.0:
                    factor = 2.0
                if self.pump.status == 'RUNNING 00':
                    self.pressure = self.pressure / factor
                    if self.pressure < 1.0e-8:
                        self.pressure = 1.0e-8
                else:
                    self.pressure = self.pressure * factor
                    if self.pressure > 1.0:
                        self.pressure = 1.0
        else:
            self.pressure = spacePressure
        # Update the gauges
        if self.imgGauge is not None:
            self.imgGauge.pressure = self.pressure
        if self.piraniGauge is not None:
            self.piraniGauge.pressure = self.pressure
        return self.pressure

# A vacuum space connects together a number of vacuum assemblies.  This allows
# the pumps and gauges to operate together in a crude simulation of pumping
# action.
class VacuumSpace(object):

    def __init__(self, name='none', assemblies=[]):
        text = "Create vacuum space %s, assemblies=" % name
        for assembly in assemblies:
            text += "%s " % assembly.name
        print text
        self.name = name
        self.assemblies = assemblies
        self.pressure = 1.0
        vacuumSpaceDeviceMgr.addDevice(self)

    def process(self):
        '''Perform the space background processing'''
        oldPressure = self.pressure
        self.pressure = 0.0
        for assembly in self.assemblies:
            self.pressure += assembly.operatePump(oldPressure)
        self.pressure = self.pressure / len(self.assemblies)
