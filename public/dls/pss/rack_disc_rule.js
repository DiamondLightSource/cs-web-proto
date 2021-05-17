importPackage(Packages.org.csstudio.opibuilder.scriptUtil);
 
var pv0 = PVUtil.getDouble(pvs[0]);
var pvSev0 = PVUtil.getSeverity(pvs[0]);
var maskStr = PVUtil.getString(pvs[1]);
var mask = parseInt(maskStr);

var maskedPv = pv0 & mask;

if(pvSev0==-1)
	widget.setPropertyValue("image_index",0);
else if(maskedPv==0)
	widget.setPropertyValue("image_index",1);
else if((mask==0xA && maskedPv==10)||(mask==0xF && maskedPv==15))
	widget.setPropertyValue("image_index",2);
else
	widget.setPropertyValue("image_index",0);
