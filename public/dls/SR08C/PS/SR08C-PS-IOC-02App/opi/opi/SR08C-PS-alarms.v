## CVS Info: $Id: SR08C-PS-alarms.v,v 1.1.1.1 2006/01/18 15:12:26 karb Exp $ $Name:  $
$table.parse("SR08C-PS-alarms.csv")
#set($dom = "SR08C")
#set($nSerial = 3)
#set($nParIlk = 0)
#set($nParLop = -1)
#set($splitRowId = -1)
#set($title = "PSS - SR08C: ALARMS")
#parse("pss_include.v")
