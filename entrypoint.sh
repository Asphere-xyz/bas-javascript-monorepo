#!/usr/bin/env bash
export REACT_APP_ENVIRONMENT=$REACT_APP_ENVIRONMENT
if ! [[ -e /usr/ready ]]
then
  echo "Start prepare static"
  echo "Current env: $REACT_APP_ENVIRONMENT"
  for file in $(find /usr/share/nginx/html/static/js/ -regex '.*\.js'); do
    echo "Prepare $file"
    export REACT_APP_ENVIRONMENT=$REACT_APP_ENVIRONMENT
    envsubst '${REACT_APP_ENVIRONMENT} ${CHAIN_ID} ${CHAIN_NAME} ${CHAIN_RPC} ${EXPLORER_HOME_URL} ${EXPLORER_TX_URL} ${EXPLORER_ADDRESS_URL} ${EXPLORER_BLOCK_URL}' < $file > $file.tpm
    mv $file.tpm $file
  done
  echo "Done. Running nginx..."
  touch /usr/ready
else
  echo "Files already prepared. Running nginx..."
fi
exec nginx -g 'daemon off;'
