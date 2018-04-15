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

    # content class which is loop-able
    contents = dom.find_all(class_="lister-item-content")
    # Title, rating, genre, actors, runtime

    # empty array for all data
    tvseries = []
    for series in contents:
        # empty array for each series
        series_data = []

        # Title movie
        series_data.append(series.find("a").string)
        # Rating
        series_data.append(float(series.find("span", class_="value").string))
        # Genres
        series_data.append(series.find("span", class_="genre").string.strip())


        # make a single string element for actors element
        actors = ""
        for stars in series.select('a[href^="/name/"]'):
            # add commas, this can also be changed later
            actors = actors + stars.string + ", "
        # remove trailing comma
        series_data.append(actors.strip(", "))

        # runtime checker, set to None if None
        if series.find("span", class_="runtime") == None:
            series_data.append(None)
        else:
            series_data.append(int(series.find("span", class_="runtime").string.strip("min")))

        # append series data to the big dataset
        tvseries.append(series_data)

    return [tvseries]


def save_csv(outfile, tvseries):
    """
    Output a CSV file containing highest rated TV-series.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # write elements into csv
    for row in tvseries:
        for item in row:
            writer.writerow(item)




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
