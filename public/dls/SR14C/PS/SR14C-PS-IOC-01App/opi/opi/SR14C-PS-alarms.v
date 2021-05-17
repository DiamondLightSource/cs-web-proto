## CVS Info: $Id: SR14C-PS-alarms.v,v 1.1 2005/11/25 11:17:12 karb Exp $ $Name:  $
$table.parse("SR14C-PS-alarms.csv")
#set($dom = "SR14C")
#set($nSerial = 1)
#set($nParIlk = 0)
#set($nParLop = 0)
#set($splitRowId = -1)
#set($title = "PSS - SR14C: ALARMS")
#parse("pss_include.v")
