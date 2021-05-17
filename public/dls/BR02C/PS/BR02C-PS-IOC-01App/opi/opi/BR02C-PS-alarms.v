## CVS Info: $Id: BR02C-PS-alarms.v,v 1.2 2006/04/26 12:21:22 karb Exp $ $Name:  $ 
$table.parse("BR02C-PS-alarms.csv")
#set($dom = "BR02C")
#set($nSerial = 3)
#set($nParIlk = 0)
#set($nParLop = -1)
#set($splitRowId = -1)
#set($title = "PSS - BR02C: ALARMS")
#parse("pss_include.v")
