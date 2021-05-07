#!/dls_sw/tools/bin/python2.4

from pkg_resources import require
require("dls_serial_sim==1.8")

from dls_serial_sim import serial_device
from string import *

class mks937a(serial_device):

    Terminator = "\r"
    
    def __init__(self):
        # place your initialisation code here
        serial_device.__init__(self)
        self.nDebugLevel = 0
    
    def setDebugLevel(self, nLevel):
        self.nDebugLevel = nLevel
        
    def diagnostic(self,strDebug):
        if self.nDebugLevel > 0:
            print("mks937a sim: "+strDebug)
                        
    def reply(self,command):
        # reply to commands here
        self.diagnostic("The full command is = " + command)
        ret = ""
        request = command.strip()
        if request == "FREQ":
            ret = "50\r"
        return ret

if __name__ == "__main__":
    # little test program, only run when this script is run from command line
    device = mks937a()
    device.start_ip(9004)
    device.start_debug(9006)
    raw_input()
