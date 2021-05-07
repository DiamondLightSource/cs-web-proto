#! /bin/bash

MO_IOC_06_dir=$(dirname "$(configure-ioc s -p BL21I-MO-IOC-06)")
exec "$MO_IOC_06_dir/stBL21I-MO-IOC-06-gui"
