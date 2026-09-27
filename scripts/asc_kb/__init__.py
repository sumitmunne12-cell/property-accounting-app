"""Curated first-principles knowledge base for every FASB ASC Topic in the library.

One `C(topic, ...)` call per Topic. The builder (scripts/build_asc_codification.py) merges each
card with the structure parsed from asc_codification/markdown/ and fails if a Topic has no card,
a card is missing a field, a journal entry does not balance or a cited paragraph does not exist
in the official text.

Card fields
    tag      one-line hook shown in lists
    alias    search keywords (acronyms, common names: "rou", "cecl", "vie", "stock comp")
    re       real-estate relevance for the property-accounting track: "core", "support" or None
    legacy   True for superseded / status-only Topics (840, 605, 225, 305, 848, 915, 995); they rank
             below current standards in search
    truth    first-principles economic truth (2-3 sentences, no jargon)
    analogy  (title, story): a non-accounting story that makes the rule stick
    recog    recognition triggers: when you book it
    meas     (basis, initial, subsequent): how you value it
    je       [(title, scenario, [(DR|CR, account, amount), ...], memo)]; amounts must balance
    traps    [(question, answer)]: audit and interview traps
    lens     how the Topic shows up in multifamily property accounting (real-estate cards)
    cites    key paragraph ids; each must exist in the parsed official text
"""

from importlib import import_module

CARDS = {}


def C(topic, **card):
    if topic in CARDS:
        raise ValueError(f"duplicate card for ASC {topic}")
    CARDS[topic] = card


for _mod in ("s100_200", "s300", "s400_500", "s600_700", "s800", "s900"):
    import_module(f"{__name__}.{_mod}")
