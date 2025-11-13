#!/bin/bash
cd /home/kavia/workspace/code-generation/ecoliving-future-224178-224187/eco_cities_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

