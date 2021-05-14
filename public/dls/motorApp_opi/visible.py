from org.csstudio.opibuilder.scriptUtil import ConsoleUtil
from org.csstudio.opibuilder.scriptUtil import PVUtil
from org.csstudio.simplepv import IPVListener


class MyPVListener(IPVListener.Stub):
    def valueChanged(self, pv):
        if pv.getValue().getValue():
            widget.setPropertyValue("visible", True)
        else:
            widget.setPropertyValue("visible", False)


# Set widget invisible so that it will not show up if we fail to connect.
widget.setPropertyValue("visible", False)

# Read script 'arguments' from local String PV.
pv_string = PVUtil.getString(pvs[0])
pv = PVUtil.createPV(pv_string, widget)
pv.addListener(MyPVListener())
