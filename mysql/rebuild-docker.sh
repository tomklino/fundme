#!/bin/bash

cd $( dirname "${BASH_SOURCE[0]}" )
docker build -t lutraman/fundmedb .
