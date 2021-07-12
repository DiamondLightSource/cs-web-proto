while [ 1 ]; do
    if [ $(caget -t CS-CS-MSTAT-01:REBOOT) -eq 1 ]; then
        reboot
    fi
    sleep 10
done
