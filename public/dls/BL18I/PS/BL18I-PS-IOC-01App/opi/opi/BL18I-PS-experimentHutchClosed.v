$table.parse("BL18I-PS-experimentHutchClosed.csv")
#set($dom = "BL18I")
#set($nSerial = 6)
#set($nParIlk = 0)
#set($nParLop = 0)
#set($splitRowId = -1)
#set($title = "PSS - BL18I:EH1 LOP 9 HUTCH SEARCHED & CLOSED")
#parse("pss_include.v")