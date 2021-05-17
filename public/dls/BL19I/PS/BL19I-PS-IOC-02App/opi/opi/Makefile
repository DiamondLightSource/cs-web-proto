TOP = ../../..
include $(TOP)/configure/CONFIG

GENERATE= $(PSS)/pssApp/opi/opigen/generate.py
IOC:= $(patsubst %App,%, $(shell pwd | rev | cut -f3 -d'/' | rev))
SUBSFILE:= ../../Db/$(IOC).substitutions
DOM:= $(shell echo $(IOC) | cut -f1 -d'-')

OBJECTS:= $(filter-out $(wildcard *optics*.v), $(wildcard *.v))
OBJECTS:= $(filter-out BL19I-PS-alarmsOH2.v, $(OBJECTS))
OBJECTS:= $(patsubst %.v, %.opi, $(OBJECTS))
PARTSUBS:= $(wildcard *.subs)
FILES:= $(sort $(filter-out $(wildcard *optics*.csv), $(wildcard $(DOM)-PS-*.csv)))
FILES:= $(filter-out BL19I-PS-alarmsOH2.csv, $(FILES))

install: $(OBJECTS) $(SUBSFILE)

%.opi: %.csv %.v
	$(GENERATE) $^

%.substitutions: $(FILES) $(PARTSUBS)
	cat $(FILES) | grep PS | grep -v "CVS" | grep -v lop >all.csv
	dls-python $(PSS)/pssApp/opi/python/gensubs.py $(SUBSFILE)
	rm all.csv

clean:
	rm -f $(OBJECTS) $(SUBSFILE)

