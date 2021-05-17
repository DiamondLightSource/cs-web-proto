## CVS Info: $Id: SR04C-PS-alarms2.v,v 1.1.1.1 2006/03/20 16:32:19 karb Exp $ $Name:  $
$table.parse("SR04C-PS-alarms2.csv")
#set($dom = "SR04C")
#set($nSerial = 3)
#set($nParIlk = 0)
#set($nParLop = -1)
#set($splitRowId = -1)
#set($title = "PSS - SR04C: ALARMS")
#parse("pss_include.v")
