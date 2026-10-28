const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function setup() {
  const elements = new Map(), calls = [];
  const colors = JSON.parse(fs.readFileSync(path.join(__dirname,'../web/colors.json'),'utf8'));
  const hexes = Object.keys(colors);
  const defaults = {brand:'MARD',paletteSet:'291',width:'30',height:'10',maxColors:'291',maxColorsNumber:'291',tolerance:'28'};
  function element(id) {
    if (!elements.has(id)) elements.set(id,{value:defaults[id]||'',checked:false,style:{},clientWidth:900,textContent:'',innerHTML:'',append(){},replaceChildren(){}});
    return elements.get(id);
  }
  const ctx = {clearRect(){},fillRect(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},fillText(){},drawImage(...args){calls.push(args)},getImageData(_x,_y,w,h){const data=new Uint8ClampedArray(w*h*4);for(let i=0;i<w*h;i++){const c=hexes[i%hexes.length];data.set([parseInt(c.slice(1,3),16),parseInt(c.slice(3,5),16),parseInt(c.slice(5,7),16),255],i*4)}return {data}}};
  const canvas = {width:0,height:0,style:{},getContext:()=>ctx};
  const sandbox = {console,document:{getElementById:id=>id==='canvas'?canvas:element(id),createElement:tag=>tag==='canvas'?{width:0,height:0,getContext:()=>ctx}:{style:{},append(){},replaceChildren(){}}},window:{},requestAnimationFrame:fn=>setImmediate(fn),fetch:()=>new Promise(()=>{}),colors};
  vm.createContext(sandbox);
  const script=fs.readFileSync(path.join(__dirname,'../web/app.js'),'utf8')+`\nmapping=colors;palette=Object.keys(mapping).map(hex=>({hex,rgb:rgb(hex)}));source={width:200,height:100};globalThis.api={activePalette,parseCustom,generate,stats,applyCrop,resetCrop,getGrid:()=>grid,getCrop:()=>activeCrop};`;
  vm.runInContext(script,sandbox);
  return {api:sandbox.api,element,calls};
}

test('MARD 221 and 291 sets contain the advertised colors',()=>{
  const {api,element}=setup(); assert.equal(api.activePalette().length,291);
  element('paletteSet').value='221'; assert.equal(api.activePalette().length,221);
});
test('custom color cards validate codes, colors and duplicates',()=>{
  const {api}=setup(); const result=api.parseCustom('色号,HEX\nRED,#FF0000\nBLUE,#0000FF');
  assert.equal(result.length,2); assert.equal(result[1].hex,'#0000FF');
  assert.throws(()=>api.parseCustom('A,#FFFFFF\nB,#FFFFFF'),/不能重复/);
  assert.throws(()=>api.parseCustom('<bad>,#FFFFFF'),/每行需为/);
});
test('cropping passes the selected source rectangle into generation',async()=>{
  const {api,element,calls}=setup(); element('cropX').value='10';element('cropY').value='20';element('cropW').value='80';element('cropH').value='40';
  api.applyCrop(); assert.equal(api.getCrop().w,80); await api.generate();
  assert.deepEqual(calls[0].slice(1),[10,20,80,40,0,0,30,10]);
  assert.equal(api.stats().length,291); assert.equal(api.getGrid().length,300);
  api.resetCrop(); assert.equal(api.getCrop(),null);
});
test('invalid oversized input does not replace the existing pattern',async()=>{
  const {api,element}=setup(); await api.generate(); const old=api.getGrid();
  element('width').value='2000';element('height').value='1000';await api.generate();
  assert.equal(api.getGrid(),old);assert.match(element('status').textContent,/100 万/);
});
