from analyzer import Analyzer
import os
import sys
import csv

# absolute paths to lists
positives = os.path.join(sys.path[0], "positive-words.txt")
negatives = os.path.join(sys.path[0], "negative-words.txt")


# instantiate analyzer
analyzer = Analyzer(positives, negatives)

mail_dir = "/media/marco/5b508a3b-be31-47a8-a4ba-ef5f30e45caa/maildir"

for subdir, dirs, files in os.walk(mail_dir):

    if subdir.split("/")[-1] == "inbox":
        for mail in files:
            mail_dir = subdir + "/" + mail

            with open(mail_dir, encoding='latin-1') as f:
                mail_content = csv.reader(f)
                for row in mail_content:
                    # skips header
                    print(row)
                    if "Date:" in row:
                        print(row)
                    # row.pop(0)
                    # row[1] = row[1].strip()
                    # # print(row)
                    # writer.writerow(row)

# print(os.walk(mail_dir))
