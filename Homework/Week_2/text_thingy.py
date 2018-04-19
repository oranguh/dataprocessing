import csv


# I adjusted the KNMI text to a nicer format.

with open("rawdata.txt", 'w', newline='', encoding='utf-8') as output:
    writer = csv.writer(output)
    writer.writerow([
    "#date","maxtemp"
    ])


    with open("KNMI_20180417.txt") as f:
        KNMI_data = csv.reader(f)
        for i, row in enumerate(KNMI_data):
            # skips header
            if row[0][0] == "#":
                # print("#")
                continue
            row.pop(0)
            row[1] = row[1].strip()
            # print(row)
            writer.writerow(row)
