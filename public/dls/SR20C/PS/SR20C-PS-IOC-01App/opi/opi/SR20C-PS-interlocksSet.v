## CVS Info: $Id: SR20C-PS-interlocksSet.v,v 1.1.1.1 2006/01/18 15:12:36 karb Exp $ $Name:  $
$table.parse("SR20C-PS-interlocksSet.csv")
#set($dom = "SR20C")
#set($nSerial = 8)
#set($nParIlk = 2)
#set($nParLop = -1)
#set($splitRowId = -1)
#set($title = "PSS - SR20C:INTERLOCKS SET")
#parse("pss_include.v")
