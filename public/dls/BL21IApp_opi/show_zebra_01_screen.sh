#! /bin/bash

EA_IOC_04_dir=$(dirname "$(configure-ioc s -p BL21I-EA-IOC-04)")
exec "$EA_IOC_04_dir/stBL21I-EA-IOC-04-gui"
