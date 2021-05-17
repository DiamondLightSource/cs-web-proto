## CVS Info: $Id: SR02C-PS-alarms.v,v 1.1.1.1 2006/01/18 15:11:56 karb Exp $ $Name:  $
$table.parse("SR02C-PS-alarms.csv")
#set($dom = "SR02C")
#set($nSerial = 3)
#set($nParIlk = 0)
#set($nParLop = -1)
#set($splitRowId = -1)
#set($title = "PSS - SR02C: ALARMS")
#parse("pss_include.v")
