"""Unit tests for the ASC markdown parser and supplement merging.

Run: npm run test:py   (python3 -m unittest discover -s scripts/test -p "test_*.py")
"""

import os
import sys
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import asc_parse  # noqa: E402

TOPIC = """# FASB ASC Topic 970: 970 Real Estate—General

Industry

970 Real Estate—General

10 Overall

* * *

# 05 Overview and Background

General Note:

The Overview and Background Section provides overview and background material.

## General

970-10-05-1

The Real Estate—General Topic includes the following Subtopics:

  1. a

Overall

  2. b

Other Assets and Deferred Costs.

970-10-05-1

The Real Estate—General Topic includes the following Subtopics:

  1. a

Overall

  2. b

Other Assets and Deferred Costs.
"""

SUPPLEMENT = """# FASB ASC Subtopic 970-340: Other Assets and Deferred Costs

* * *

# 25 Recognition

General Note:

The Recognition Section provides guidance on the required criteria for recognition.

## General

### > Taxes and Insurance

970-340-25-3

Costs incurred on real estate for property taxes and insurance shall be capitalized as property cost only during periods in which activities necessary to get the property ready for its intended use are in progress. See paragraph [835-20-25-3](/1943274/1/fasb-asc-publication/x "tooltip").

970-340-25-3

Costs incurred on real estate for property taxes and insurance shall be capitalized as property cost only during periods in which activities necessary to get the property ready for its intended use are in progress. See paragraph [835-20-25-3](/1943274/1/fasb-asc-publication/x "tooltip").
"""


def write(dirpath, name, text):
    path = os.path.join(dirpath, name)
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(text)
    return path


class ParseTopic(unittest.TestCase):
    def test_topic_file_collapses_duplicates_and_parses_lists(self):
        with tempfile.TemporaryDirectory() as d:
            doc = asc_parse.parse_topic(write(d, "ASC_970_x.md", TOPIC))
        self.assertEqual(doc["topic"], "970")
        self.assertEqual(doc["title"], "Real Estate—General")
        self.assertEqual(doc["area"], "Industry")
        self.assertFalse(doc["supplement"])
        [st] = doc["subtopics"]
        self.assertEqual((st["code"], st["title"]), ("10", "Overall"))
        paras = [b for sec in st["sections"] for b in sec["blocks"] if "p" in b]
        self.assertEqual(len(paras), 1, "the export's back-to-back duplicate must collapse")
        self.assertEqual(doc["stats"]["duplicatesCollapsed"], 1)
        self.assertEqual(paras[0]["t"][1:], ["\t(a) Overall", "\t(b) Other Assets and Deferred Costs."])

    def test_subtopic_export_parses_without_banner(self):
        with tempfile.TemporaryDirectory() as d:
            sup = asc_parse.parse_topic(write(d, "970-340.md", SUPPLEMENT))
        self.assertTrue(sup["supplement"])
        self.assertEqual(sup["topic"], "970")
        self.assertIsNone(sup["title"])
        [st] = sup["subtopics"]
        self.assertEqual((st["code"], st["title"]), ("340", "Other Assets and Deferred Costs"))
        [para] = [b for sec in st["sections"] for b in sec["blocks"] if "p" in b]
        self.assertEqual(para["p"], "970-340-25-3")
        self.assertIn("See paragraph 835-20-25-3.", para["t"][0])
        self.assertNotIn("fasb-asc-publication", para["t"][0])

    def test_merge_adds_subtopic_in_codification_order(self):
        with tempfile.TemporaryDirectory() as d:
            doc = asc_parse.parse_topic(write(d, "ASC_970_x.md", TOPIC))
            sup = asc_parse.parse_topic(write(d, "970-340.md", SUPPLEMENT))
        changed = asc_parse.merge_subtopics(doc, sup, "970-340.md")
        self.assertEqual(changed, ["340"])
        self.assertEqual([st["code"] for st in doc["subtopics"]], ["10", "340"])
        self.assertEqual(doc["stats"]["paragraphs"], 2)
        self.assertEqual(doc["stats"]["duplicatesCollapsed"], 2)
        self.assertIn("25", doc["notes"])
        # Merging the same export again changes nothing.
        self.assertEqual(asc_parse.merge_subtopics(doc, sup, "970-340.md"), [])

    def test_merge_rejects_wrong_topic(self):
        with tempfile.TemporaryDirectory() as d:
            doc = asc_parse.parse_topic(write(d, "ASC_970_x.md", TOPIC))
            sup = asc_parse.parse_topic(write(d, "974.md", SUPPLEMENT.replace("970-340", "974-340")))
        with self.assertRaises(ValueError):
            asc_parse.merge_subtopics(doc, sup, "974.md")


class MissingSubtopics(unittest.TestCase):
    def test_overview_list_drives_the_missing_manifest(self):
        import build_asc_codification as build

        with tempfile.TemporaryDirectory() as d:
            doc = asc_parse.parse_topic(write(d, "ASC_970_x.md", TOPIC))
            sup = asc_parse.parse_topic(write(d, "970-340.md", SUPPLEMENT))
        titles = {"other assets and deferred costs": "340", "real estate general": "970"}
        pid, missing = build.missing_subtopics(doc, titles)
        self.assertEqual(pid, "970-10-05-1")
        self.assertEqual(missing, [{"code": "970-340", "title": "Other Assets and Deferred Costs"}])
        asc_parse.merge_subtopics(doc, sup)
        self.assertEqual(build.missing_subtopics(doc, titles)[1], [])


if __name__ == "__main__":
    unittest.main()
