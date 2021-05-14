from pkg_resources import require
require('dls_serial_sim')
from dls_serial_sim import serial_device

# Represents a set point.
class SetPoint(object):
    def __init__(self, number, supply, onPressure, offPressure):
        self.number = number
        self.supply = supply
        self.onPressure = onPressure
        self.offPressure = offPressure
        self.currentState = 0

# A pump control crate has two power supplies
class PowerSupply(object):
    def __init__(self, name):
        self.name = name
        self.current = 0.0
        self.text = ''
        self.pressure = 0.0
        self.voltage = 0
        self.status = 'RUNNING 00'
        self.pumpSize = 0
        self.calFactor = 0.0
        self.hvStrapping = 5600

# The pump control crate simulation.
class DigitelMpcCrate(serial_device):
    def __init__(self, name='none', tcpPort=9100, ui=None):
        print "Create Digitel MPC controller %s" % name
        self.name = name
        serial_device.__init__(self, ui=ui)
        self.voltageStrapping = 240
        self.autoRestart = False
        self.fanControl = False
        self.setPoints = {}
        self.supplies = {}
        self.supplies[1] = PowerSupply("%s:%s" % (name, 1))
        self.supplies[2] = PowerSupply("%s:%s" % (name, 2))
        serial_device.Terminator = "\r"
        self.start_ip(tcpPort)

    @staticmethod
    def createUi():
        '''Override to create the user interface for the simulation.'''
        return TerminalWindow()
    
    def pump(self, number):
        result = None
        if number in self.supplies:
            result = self.supplies[number]
        return result

    def reply(self, command):
        result = None
        printMessage = True
        parts = command.strip().split()
        if len(parts) >= 4 and parts[0] == '~':
            printMessage = False
            chan = parts[1]
            cmd = parts[2]
            if cmd == '01':
                result = '%s OK 01 DIGITEL MPC ' % chan
            elif cmd == '02':
                result = '%s OK 02 FIRMWARE VERSION 0.0.a ' % chan
            elif cmd == '23' and len(parts) >= 5:
                self.voltageStrapping = int(parts[3])
                result = '%s OK 23 ' % chan
            elif cmd == '22' and len(parts) >= 4:
                result = '%s OK 22 %s ' % (chan, self.voltageStrapping)
            elif cmd == '33' and len(parts) >= 5:
                self.autoRestart = parts[3] == 'YES'
                result = '%s OK 33 ' % chan
            elif cmd == '34' and len(parts) >= 4:
                result = '%s OK 34 ' % chan
                if self.autoRestart:
                    result += 'YES '
                else:
                    result += 'NO '
            elif cmd == '24' and len(parts) >= 4:
                result = '%s OK 24 50 Hz ' % chan
            elif cmd == '32' and len(parts) >= 5:
                self.fanControl = parts[3] == 'ON'
                result = '%s OK 33 ' % chan
            elif cmd == '3D' and len(parts) >= 7:
                bits = parts[3].split(',')
                number = int(bits[0])
                supply = int(bits[1])
                bits = parts[4].split(',')
                onPressure = float(bits[0])
                offPressure = float(parts[5])
                self.setPoints[number] = \
                    SetPoint(number, supply, onPressure, offPressure)
                result = '%s OK 3D ' % chan
            elif cmd == '3C' and len(parts) >= 5:
                number = int(parts[3])
                result = '%s OK 3C %s,%s,%s,%s,%s ' % (chan, number, self.setPoints[number].supply,
                    self.setPoints[number].onPressure, self.setPoints[number].offPressure,
                    self.setPoints[number].currentState)
            elif cmd == '0A' and len(parts) >= 5:
                pump = int(parts[3])
                result = '%s OK 0A %s Amps ' % (chan, self.supplies[pump].current)
            elif cmd == '0B' and len(parts) >= 5:
                pump = int(parts[3])
                result = '%s OK 0B %s MBR ' % (chan, self.supplies[pump].pressure)
            elif cmd == '0C' and len(parts) >= 5:
                pump = int(parts[3])
                result = '%s OK 0C %s ' % (chan, self.supplies[pump].voltage)
            elif cmd == '0D' and len(parts) >= 5:
                pump = int(parts[3])
                result = '%s OK 0D %s ' % (chan, self.supplies[pump].status)
            elif cmd == 'ED' and len(parts) >= 5:
                bits = parts[3].split(',')
                pump = int(bits[0])
                self.supplies[pump].text = bits[1]
                result = '%s OK ED ' % chan
            elif cmd == '12' and len(parts) >= 5:
                bits = parts[3].split(',')
                pump = int(bits[0])
                self.supplies[pump].pumpSize = int(bits[1])
                result = '%s OK 12 ' % chan
            elif cmd == '11' and len(parts) >= 5:
                pump = int(parts[3])
                result = '%s OK 11 %s L/S ' % (chan, self.supplies[pump].pumpSize)
            elif cmd == '1D' and len(parts) >= 5:
                pump = int(parts[3])
                result = '%s OK 1D %s ' % (chan, self.supplies[pump].calFactor)
            elif cmd == '20' and len(parts) >= 5:
                pump = int(parts[3])
                result = '%s OK 20 %s ' % (chan, self.supplies[pump].hvStrapping)
            elif cmd == '37' and len(parts) >= 5:
                pump = int(parts[3])
                self.supplies[pump].status = 'RUNNING 00'
                result = '%s OK 37 ' % chan
            elif cmd == '38' and len(parts) >= 5:
                pump = int(parts[3])
                self.supplies[pump].status = 'STANDBY'
                result = '%s OK 38 ' % chan
            else:
                printMessage = True
        if result is not None:
            result = result + self.checksum(result)
        if printMessage:
            text = "%s==>%s" % (repr(command), repr(result))
            self.diagnostic(text, 1)
        return result

    @staticmethod
    def checksum(text):
        result = 0
        for ch in text:
            result = result + ord(ch)
        return '%02X' % (result % 256)
