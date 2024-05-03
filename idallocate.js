const { readFile, writeFile } = require("fs");

function fixid(data) {
  const decks = data["~:decks"];
  fixdeck(decks);
}

function fixcard(card, pdeck, name) {
  card["~:deck-id"] = name;
  let fields = card["~:fields"];
  let field = Object.keys(fields)[0];
  let namePref = fields[field]["~:value"];
  let nameSuff = pdeck["~:name"].includes("Hira") ? "Hiragana" : "Katakana";
  card["~:id"] = namePref + nameSuff;
}

function fixdeck(decks) {
  let pdeck, cdeck, id, pid, cid, cpid;
  for (let i = 0; i < decks.length; i++) {
    pdeck = decks[i];
    id = pdeck["~:id"];
    pid = pdeck["~:parent-id"];
    pdeck["~:id"];
    let newName = pdeck["~:parent-id"]
      ? pdeck["~:name"] + pdeck["~:parent-id"]
      : pdeck["~:name"];
    for (let j = i + 1; j < decks.length; j++) {
      cdeck = decks[j];
      cid = cdeck["~:id"];
      cpid = cdeck["~:parent-id"];
      if (cpid == id) {
        relfix(cdeck, newName);
      }
    }
    const cardList = pdeck["~:cards"]["~#list"];
    if (cardList.length != 0) {
      for (let i = 0; i < cardList.length; i++) {
        fixcard(cardList[i], pdeck, newName);
      }
    }
    inject(pdeck, "~:id", newName);
  }
}

function relfix(cdeck, name) {
  cdeck["~:parent-id"] = name;
}

function inject(obj, key, value) {
  obj[key] = value;
}

readFile("data.json", "utf8", (error, text) => {
  if (error) throw error;
  let data = JSON.parse(text);
  fixid(data);
  writeFile("data.json", JSON.stringify(data), (error) => {
    if (error) throw error;
  });
});
