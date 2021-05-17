## CVS Info: $Id: SR10C-PS-alarms.v,v 1.1.1.1 2006/01/13 13:51:11 karb Exp $ $Name:  $
$table.parse("SR10C-PS-alarms.csv")
#set($dom = "SR10C")
#set($nSerial = 3)
#set($nParIlk = 0)
#set($nParLop = -1)
#set($splitRowId = -1)
#set($title = "PSS - SR10C: ALARMS")
#parse("pss_include.v")
