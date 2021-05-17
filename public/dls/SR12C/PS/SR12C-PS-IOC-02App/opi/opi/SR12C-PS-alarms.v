## CVS Info: $Id: SR12C-PS-alarms.v,v 1.1.1.1 2006/01/16 16:10:21 karb Exp $ $Name:  $
$table.parse("SR12C-PS-alarms.csv")
#set($dom = "SR12C")
#set($nSerial = 3)
#set($nParIlk = 0)
#set($nParLop = -1)
#set($splitRowId = -1)
#set($title = "PSS - SR12C: ALARMS")
#parse("pss_include.v")
