from analyzer import Analyzer
from analyze_fraud import AnalyzerFraud
import os
import sys
import csv
from datetime import date, datetime
from time import strptime
import matplotlib.pyplot as plt

"""
I downloaded the enron dataset, (5 000 000 e-mails, quite a few gigs of data)
and decided to run a sentiment analysis or something to generate data.
I descretized the dates to month so it would be nicer to plot the data
in a bar chart. I also made my own fraudi-lyzer which detects fraud related words.

csv in the format:

month,fraud_count,fraud_percent
907192800.0,0,0
909874800.0,2,8.695652173913043
912466800.0,1,2.0408163265306123
915145200.0,15,25.862068965517242
917823600.0,6,17.647058823529413
920242800.0,0,0
922917600.0,5,25.0

etc.
"""

# absolute paths to lists
positives = os.path.join(sys.path[0], "positive-words.txt")
negatives = os.path.join(sys.path[0], "negative-words.txt")


# instantiate analyzer
analyzer = Analyzer(positives, negatives)
analyzerF = AnalyzerFraud()
mail_dir = "/media/marco/5b508a3b-be31-47a8-a4ba-ef5f30e45caa/maildir"

sent_mail_dictionary = []
counter = 0

for subdir, dirs, files in os.walk(mail_dir):
    # print(subdir)
    # if not subdir.split("/")[-2] == "lay-k":
    #     continue
    if subdir.split("/")[-1] == "sent":
        for mail in files:
            # if counter == 1000:
            #     break

            mail_dir = subdir + "/" + mail

            mail_element = {}
            written_content = ""

            with open(mail_dir, 'r', encoding='latin-1') as f:
                mail_content = csv.reader(f, delimiter='\n')
                after_header = False
                for row in mail_content:
                    # some of these rows are empty or contain only one space

                    if row == [] or row[0] == " ":
                        continue
                    if " -----Original Message-----" in row[0]:
                        break
                    # This is an ugly way to do this but whatever, messy data
                    if "Date:" in row[0] and row[0][0] =="D" and row[0][-1] == ")" and row[0][-2] == "T":
                        # print(row[0].split(" "))
                        # turn date strings into date-time objects
                        # mail_element['date'] = row[0].split(" ")[2:5]
                        mail_element['date'] = datetime(
                        int(row[0].split(" ")[4]),
                        strptime(row[0].split(" ")[3], '%b').tm_mon, 1)
                        # int(row[0].split(" ")[2]))
                        mail_element['date_sec'] = mail_element['date'].timestamp()

                    if "X-FileName:" in row[0]:
                        after_header = True
                        continue
                    # finally gets content
                    if after_header:
                        # print(row[0])
                        written_content += row[0]
                        mail_element['written_content'] = written_content

                try:
                    mail_element['sentiment_score'] = analyzer.analyze(mail_element['written_content'])
                    mail_element['fraud_score'] = analyzerF.analyze_fraud(mail_element['written_content'])

                # if there is a key error continue and do not append to list.
                except KeyError:
                    continue
                # try:
                #     mail_element['date_sec'] = mail_element['date_sec']
                # # if there is a key error continue and do not append to list.
                # except KeyError:
                #     # print(mail_element)
                #     continue
                sent_mail_dictionary.append(mail_element)
                # print(counter)
                counter += 1

print(counter)
# print(sent_mail_dictionary[0:5])

xs = [dic['date_sec'] for dic in sent_mail_dictionary]
# # ys = [dic['sentiment_score'] for dic in sent_mail_dictionary]
# ys = [dic['fraud_score'] for dic in sent_mail_dictionary]
#
# plt.plot(xs, ys, 'ro')
# plt.show()

xs = sorted(set(xs))
monthi_list = [{'month': datto} for datto in xs]

for dic_item in sent_mail_dictionary:
    for dic_month in monthi_list:
        if dic_month['month'] == dic_item['date_sec']:
            try:
                dic_month['count'] += 1
            except KeyError:
                dic_month['count'] = 1

            if dic_item['fraud_score'] > 0:
                try:
                    dic_month['fraud_count'] += 1
                except KeyError:
                    dic_month['fraud_count'] = 1
            else:
                continue
# print(monthi_list)
for monthi in monthi_list:
    try:
        monthi['fraud_percent'] = (monthi['fraud_count']/monthi['count'])*100
    except KeyError:
        monthi['fraud_count'] = 0
        monthi['fraud_percent'] = 0
# print(monthi_list)

with open("enron.csv", 'w', newline='', encoding='utf-8') as output:
    writer = csv.writer(output)
    writer.writerow(["month", "fraud_count", "fraud_percent"])

    for item in monthi_list:
        # writer.writerow([item["date"], item["date_sec"], item["sentiment_score"], item["fraud_score"]])
        writer.writerow([item['month'], item['fraud_count'], item['fraud_percent']])
