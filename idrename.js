const {readFile} = require('fs');
const t = require('transit-js');
const r = t.reader('json');
const w = t.writer('json-verbose');

const open = function(data) {
    return data._entries;
}
const cards = function(data) {
    return open(open(data)[5][0])[11].rep;
}
const card_name = function(data) {
    return open(data)[7];
}
const card_value = function(data) {
    return open(open(open(data)[13])[1])[3];
}
const card_id = function(data) {
    return open(data)[23]._name;
}
var manip = function(data) {
    card=cards(data)[0];
    card_id(card)=w.write('success');
}
readFile('data.json', 'utf8', (error, text)=>{
    if (error) throw error;
    let data= r.read(text);
    manip(data);
});