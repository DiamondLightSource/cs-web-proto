## CVS Info: $Id: SR22C-PS-alarms.v,v 1.1.1.1 2006/02/23 09:01:18 karb Exp $ $Name:  $
$table.parse("SR22C-PS-alarms.csv")
#set($dom = "SR22C")
#set($nSerial = 3)
#set($nParIlk = 0)
#set($nParLop = -1)
#set($splitRowId = -1)
#set($title = "PSS - SR22C: ALARMS")
#parse("pss_include.v")
