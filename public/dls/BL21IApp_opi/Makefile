TOP = ../../..
include $(TOP)/configure/CONFIG

# these are options to create_gui.py
allow_remove = no
log_level = WARNING

SCRIPTS += launch_gui
SCRIPTS += launch.nws
DATA += BL21I-create-gui.xml
DB += BL21I.db

include $(TOP)/configure/RULES

BL21I-create-gui.xml: launch_gui

../O.Common/BL21I.db: BL21I.db
	cp $< $@

BL21I.db: launch_gui
launch.nws: launch_gui

launch_gui: ../create_gui.py $(TOP)/configure/RELEASE $(TOP)/data/BL21I-gui.xml $(wildcard ../*.opi)
	$< --allow_remove=$(allow_remove) --log_level=$(log_level)
	../InsertNwsTop

clean::
	rm -f $(shell grep -l 'Opening and saving this file in cs-studio will delete this comment and stop dls_xmlbuilder regenerating it' *.opi)

