## CVS Info: $Id: BR01C-PS-alarms2.v,v 1.2 2006/04/26 10:39:57 karb Exp $ $Name:  $ 
$table.parse("BR01C-PS-alarms2.csv")
#set($dom = "BR01C")
#set($nSerial = 4)
#set($nParIlk = 0)
#set($nParLop = -1)
#set($splitRowId = 6)
#set($title = "PSS - BR01C: ALARMS CRATE  2")
#parse("pss_include.v")
