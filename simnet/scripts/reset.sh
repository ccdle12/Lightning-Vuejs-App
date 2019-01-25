#!/bin/bash

# Reset the simnet.
cd /simnet

# Remove all files in Alice.
rm -rf /simnet/alice/tls.cert
rm -rf /simnet/alice/tls.key
rm -rf /simnet/alice/data

# Remove all files in Bob.
rm -rf /simnet/bob/tls.cert
rm -rf /simnet/bob/tls.key
rm -rf /simnet/bob/data

# Remove all files in Charlie.
rm -rf /simnet/charlie/tls.cert
rm -rf /simnet/charlie/tls.key
rm -rf /simnet/charlie/data

# Remove all blocks in BTCD.
cd /root/.btcd && rm -rf data
