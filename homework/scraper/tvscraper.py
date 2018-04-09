#!/usr/bin/env python
# Name: Marco Heuevlman
# Student number: 6434592
"""
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    """
    Extract a list of highest rated TV series from DOM (of IMDB page).
    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """
    contents = dom.find_all(class_="lister-item-content")
    # Title, rating, genre, actors, runtime

    tvseries = []

    for series in contents:

        series_data = []

        # print("Title:", series.find("a").string)
        series_data.append(series.find("a").string)

        # print("Rating:", series.find("span", class_="value").string)
        series_data.append(float(series.find("span", class_="value").string))

        # print("Genre:", series.find("span", class_="genre").string.strip('\n'))
        series_data.append(series.find("span", class_="genre").string.strip())
        # print("ACTORS:", end=" ")

        actors = ""
        for stars in series.select('a[href^="/name/"]'):
            # print(stars.string, end=", ")
            actors = actors + stars.string + ", "

        series_data.append(actors.strip(", "))
        if series.find("span", class_="runtime") == None:
            series_data.append(None)
        # print("Runtime:", series.find("span", class_="runtime").string)
        else:
            series_data.append(int(series.find("span", class_="runtime").string.strip("min")))

        tvseries.append(series_data)
        # print(series_data)



    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RATED TV-SERIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.

    return [tvseries]   # REPLACE THIS LINE AS WELL AS APPROPRIATE


def save_csv(outfile, tvseries):
    """
    Output a CSV file containing highest rated TV-series.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    for row in tvseries:
        for item in row:
            writer.writerow(item)

    # ADD SOME CODE OF YOURSELF HERE TO WRITE THE TV-SERIES TO DISK


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, tvseries)
