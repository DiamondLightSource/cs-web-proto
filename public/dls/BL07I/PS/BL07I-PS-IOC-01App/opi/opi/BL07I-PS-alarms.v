$table.parse("BL07I-PS-alarms.csv")
#set($dom = "BL07I")
#set($nSerial = 5)
#set($nParIlk = 0)
#set($nParLop = -1)
#set($splitRowId = 8)
#set($title = "PSS - BL07I: ALARMS")
#parse("pss_include.v")