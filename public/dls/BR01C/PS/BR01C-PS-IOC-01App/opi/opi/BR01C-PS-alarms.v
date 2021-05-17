## CVS Info: $Id: BR01C-PS-alarms.v,v 1.3 2006/04/26 10:39:52 karb Exp $ $Name:  $ 
$table.parse("BR01C-PS-alarms.csv")
#set($dom = "BR01C")
#set($nSerial = 3)
#set($nParIlk = 0)
#set($nParLop = -1)
#set($splitRowId = -1)
#set($title = "PSS - BR01C: ALARMS")
#parse("pss_include.v")
