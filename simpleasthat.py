#!/usr/bin/env python3

"""
Uber simple static site generator in Python


Jon Vlachogiannis
darksun4@gmail.com
"""
import os
import re
from io import open # for Python 2


def read_config():
    pass


def read_content_data(content_dir):
    # get all posts
    posts = [f for f in os.listdir(content_dir) if f.endswith('.json')]

    # read them
    return [{"name": post_filename,
             "data": eval(open(os.path.join(content_dir, post_filename), "r").read())}
            for post_filename in posts]


def generate_page(template_dir, template, template_html, post):
    # find all the tags inside template
    tags = re.findall(r'{{(.+?)}}', template_html)
    for tag in tags:
        replace_tag = "{{%s}}" % tag

        # create page based on post
        template_html = template_html.replace(
            replace_tag, post["data"].get(tag.strip()))

        # write file
        f = open(
            os.path.join(
                "site",
                template_dir,
                template.split(".html")[0] +
                "-" +
                post["name"].split(".json")[0]) +
            ".html",
            "w+", encoding='utf-8')
        f.write(template_html)
        f.close()


def create_posts(content_folder):
    content_dir = os.path.join("content/", content_folder)
    template_dir = os.path.join("templates/", content_folder)

    # read all content data
    content_data = read_content_data(content_dir)

    # create output dir
    if not os.path.exists(os.path.join("site", content_folder)):
        os.makedirs(os.path.join("site", content_folder))

    # fill up template pages with the content data
    templates = [f for f in os.listdir(template_dir) if f.endswith('.html')]
    for template in templates:
        html_template = open(os.path.join(template_dir, template),
                             "r", encoding='utf-8').read()
        list(map(lambda x: generate_page(content_folder,
                                         template, html_template, x), content_data))


def run():
    # get all content folders
    content_folders = [f for f in os.listdir("content/") if "." not in f]

    # apply them to their templates
    print(content_folders)
    list(map(lambda x: create_posts(x), content_folders))


if __name__ == '__main__':
    run()
