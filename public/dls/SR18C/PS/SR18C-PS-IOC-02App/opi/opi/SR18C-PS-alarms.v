## CVS Info: $Id: SR18C-PS-alarms.v,v 1.2 2006/04/21 15:35:47 karb Exp $ $Name:  $
$table.parse("SR18C-PS-alarms.csv")
#set($dom = "SR18C")
#set($nSerial = 7)
#set($nParIlk = 0)
#set($nParLop = 0)
#set($splitRowId = 12)
#set($title = "PSS - SR18C: ALARMS")
#parse("pss_include.v")
