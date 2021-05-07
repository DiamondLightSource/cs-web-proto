#! /bin/bash

EA_IOC_03_dir=$(dirname "$(configure-ioc s -p BL21I-EA-IOC-03)")
exec "$EA_IOC_03_dir/stBL21I-EA-IOC-03-gui"
