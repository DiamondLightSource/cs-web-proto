## CVS Info: $Id: SR20C-PS-alarms.v,v 1.1.1.1 2006/01/18 15:12:37 karb Exp $ $Name:  $
$table.parse("SR20C-PS-alarms.csv")
#set($dom = "SR20C")
#set($nSerial = 3)
#set($nParIlk = 0)
#set($nParLop = -1)
#set($splitRowId = -1)
#set($title = "PSS - SR20C: ALARMS")
#parse("pss_include.v")
