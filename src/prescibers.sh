#!/usr/bin/env bash
awk '{FS = "\t" } ; {print "\""$1" MD\": {\n\"DEA\": \""$2"\",\n\"NPI\": \""$4"\",\n\"SLN\": \""$3"\"\n},"}' prescribers.csv
