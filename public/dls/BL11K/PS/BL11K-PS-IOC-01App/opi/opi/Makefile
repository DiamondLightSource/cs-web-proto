TOP = ../../..
include $(TOP)/configure/CONFIG

GENERATE= $(PSS)/pssApp/opi/opigen/generate.py
IOC:= $(patsubst %App,%, $(shell pwd | rev | cut -f3 -d'/' | rev))
SUBSFILE:= ../../Db/$(IOC).substitutions
DOM:= $(shell echo $(IOC) | cut -f1 -d'-')

OBJECTS:= $(patsubst %.v, %.opi, $(wildcard *.v))
PARTSUBS:= $(wildcard *.subs)
FILES:= $(sort $(wildcard $(DOM)-PS-*.csv))

install: $(OBJECTS) $(SUBSFILE)

%.opi: %.csv %.v
	$(GENERATE) $^

%.substitutions: $(FILES) $(PARTSUBS)
	cat $(FILES) | grep PS | grep -v "CVS" | grep -v lop >all.csv
	dls-python $(PSS)/pssApp/opi/python/gensubs.py $(SUBSFILE)
	rm all.csv

clean:
	rm -f $(OBJECTS) $(SUBSFILE)

