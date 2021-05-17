importPackage(Packages.org.csstudio.opibuilder.scriptUtil);

prefix = PVUtil.getString(pvs[0]);
card = PVUtil.getString(pvs[1]);
postfix = PVUtil.getString(pvs[2]);

widget.setPropertyValue("text", prefix + " " + card);
widget.setPropertyValue("pv_name", "$(dom)-PS-IOC-$(id):M" + card + postfix)