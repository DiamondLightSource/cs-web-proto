$table.parse("BL05I-PS-alarms.csv")
#set($dom = "BL05I")
#set($nSerial = 6)
#set($nParIlk = 0)
#set($nParLop = -1)
#set($splitRowId = -1)
#set($title = "PSS - BL05I: ALARMS")
#parse("pss_include.v")