## CVS Info: $Id: SR06C-PS-alarms.v,v 1.1.1.1 2006/01/12 09:57:43 karb Exp $ $Name:  $
$table.parse("SR06C-PS-alarms.csv")
#set($dom = "SR06C")
#set($nSerial = 3)
#set($nParIlk = 0)
#set($nParLop = -1)
#set($splitRowId = -1)
#set($title = "PSS - SR06C: ALARMS")
#parse("pss_include.v")
