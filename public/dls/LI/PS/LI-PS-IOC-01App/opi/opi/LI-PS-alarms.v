## CVS Info: $Id: LI-PS-alarms.v,v 1.4 2006/04/25 16:00:09 karb Exp $ $Name:  $
$table.parse("LI-PS-alarms.csv")
#set($dom = "LI")
#set($nSerial = 7)
#set($nParIlk = 0)
#set($nParLop = -1)
#set($splitRowId = 8)
#set($title = "PSS - LI: ALARMS")
#parse("pss_include.v")
