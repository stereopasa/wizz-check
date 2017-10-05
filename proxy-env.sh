# HTTPS_PROXY=http://127.0.0.1:8888
# HTTP_PROXY=http://127.0.0.1:8888
# http_proxy=http://127.0.0.1:8888
# https_proxy=http://127.0.0.1:8888

need_set=0;
if [ "$1" == "yes" ] || [ "$1" == "1" ]; then need_set=1; fi
echo $need_set;

> proxy-env

prefixes="HTTPS_PROXY HTTP_PROXY http_proxy https_proxy"

for prefix in $prefixes
do
    if [ $need_set -eq 1 ]; 
    then
        echo "export $prefix=http://127.0.0.1:8888" >> ./proxy-env
    else
        echo "unset $prefix" >> ./proxy-env
    fi
done

echo "NODE_TLS_REJECT_UNAUTHORIZED=0" >> ./proxy-env

. ./proxy-env

# printenv | grep http