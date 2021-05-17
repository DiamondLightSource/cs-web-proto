## CVS Info: $Id: SR22C-PS-interlocksSet.v,v 1.1.1.1 2006/02/23 09:01:17 karb Exp $ $Name:  $
$table.parse("SR22C-PS-interlocksSet.csv")
#set($dom = "SR22C")
#set($nSerial = 8)
#set($nParIlk = 2)
#set($nParLop = -1)
#set($splitRowId = -1)
#set($title = "PSS - SR22C:INTERLOCKS SET")
#parse("pss_include.v")
