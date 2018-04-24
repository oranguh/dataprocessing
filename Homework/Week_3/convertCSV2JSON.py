import csv
import json

"""
convert csv file that I created into a json object. But I could have
just as well made a json object to begin with but then this assignment would
be obsolete.
It's funny because I created a list of dictionary objects in enron_parse.py
which looks exactly like the JSON file I generate.
"""


csvfile = open('enron.csv', 'r')
jsonfile = open('enron.json', 'w')

reader = csv.DictReader( csvfile)
pydicto = []
for row in reader:

    # json.dump(row, jsonfile)
    # jsonfile.write('\n')
    pydicto.append(dict(row))
    # print(row)

datadict = {"DATA": pydicto}
# print(pydicto)
json.dump(datadict, jsonfile)
# print(pydicto)
