## CVS Info: $Id: BR01C-PS-interlocksSet.v,v 1.4 2006/04/26 10:39:51 karb Exp $ $Name:  $ 
$table.parse("BR01C-PS-interlocksSet.csv")
#set($dom = "BR01C")
#set($nSerial = 8)
#set($nParIlk = 2)
#set($nParLop = -1)
#set($splitRowId = -1)
#set($title = "PSS - BR01C:INTERLOCKS SET")
#parse("pss_include.v")
