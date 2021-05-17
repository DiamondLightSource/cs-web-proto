## CVS Info: $Id: SR04C-PS-alarms1.v,v 1.1.1.1 2006/03/20 16:32:20 karb Exp $ $Name:  $
$table.parse("SR04C-PS-alarms.csv")
#set($dom = "SR04C")
#set($nSerial = 0)
#set($nParIlk = 0)
#set($nParLop = -1)
#set($splitRowId = -1)
#set($title = "PSS - SR04C: ALARMS")
#parse("pss_include.v")
