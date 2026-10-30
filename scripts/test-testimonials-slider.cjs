// Read-only Local browser regression check. Requires Playwright and its Chromium/WebKit browsers.
const assert = require('node:assert/strict');
const { chromium, webkit } = require('playwright');
async function run(name,type) {
 const browser=await type.launch({headless:true});
 try {
 const page=await browser.newPage({viewport:{width:1440,height:1000},ignoreHTTPSErrors:true});
 const errors=[]; page.on('pageerror', e=>errors.push(e.message));
 await page.goto('https://iesaero.local/',{waitUntil:'networkidle',timeout:60000});
 await page.evaluate(()=>document.fonts.ready);
 await page.locator('.block-testimonials-slider').scrollIntoViewIfNeeded();
 await page.mouse.move(0,0);
 const waitIdle=()=>page.waitForFunction(()=>{const f=Flickity.data(document.querySelector('.js-testimonials-slider'));return !f.isAnimating&&!f.isDragging;},null,{timeout:15000});
 const measure=()=>page.evaluate(()=>{const e=document.querySelector('.js-testimonials-slider'),f=Flickity.data(e),v=e.querySelector('.flickity-viewport').getBoundingClientRect(),c=f.selectedElement.getBoundingClientRect();return {height:v.height,maxHeight:Math.max(...f.cells.map(c=>c.element.getBoundingClientRect().height)),index:f.selectedIndex,centreError:Math.abs((v.top+v.bottom-c.top-c.bottom)/2),logosTop:document.querySelector('.client-logos-slider').getBoundingClientRect().top+scrollY,bg:getComputedStyle(e.closest('section')).backgroundColor};});
 function valid(m,label){assert.ok(Math.abs(m.height-m.maxHeight)<1,label+': height matches tallest cell '+JSON.stringify(m));assert.ok(m.centreError<1,label+': centred');assert.equal(m.bg,'rgb(255, 255, 255)');}
 await page.waitForTimeout(5500);
 const autoplay=await measure();assert.notEqual(autoplay.index,0,'autoplay advanced');
 await page.evaluate(()=>Flickity.data(document.querySelector('.js-testimonials-slider')).stopPlayer());await waitIdle();
 await page.evaluate(()=>{const f=Flickity.data(document.querySelector('.js-testimonials-slider'));f.select((f.selectedIndex+1)%f.cells.length);});
 await page.waitForTimeout(350);await page.setViewportSize({width:390,height:844});await waitIdle();await page.waitForTimeout(250);
 const narrow=await measure();valid(narrow,'resize during transition');
 const positions=[];
 for(let i=0;i<5;i++){
  await page.locator('.js-testimonials-slider .flickity-page-dots .dot').nth(i).click();await waitIdle();
  const m=await measure();valid(m,'slide '+i);assert.equal(m.index,i);positions.push(m.logosTop);
 }
 assert.ok(Math.max(...positions)-Math.min(...positions)<1,'logos stationary');
 await page.setViewportSize({width:1440,height:1000});await page.waitForTimeout(500);valid(await measure(),'resize back');
 await page.locator('.block-testimonials-slider').scrollIntoViewIfNeeded();
 const box=await page.locator('.js-testimonials-slider .flickity-viewport').boundingBox();
 await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2-150,box.y+box.height/2,{steps:8});
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(350);await page.mouse.up();await waitIdle();await page.waitForTimeout(250);valid(await measure(),'resize while dragging');
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload({waitUntil:'networkidle'});await page.locator('.block-testimonials-slider').scrollIntoViewIfNeeded();
 const reducedStart=await measure();await page.waitForTimeout(5500);assert.equal((await measure()).index,reducedStart.index,'reduced motion stops autoplay');
 await page.evaluate(()=>Flickity.data(document.querySelector('.js-testimonials-slider')).select(2));await page.waitForTimeout(350);await page.setViewportSize({width:1440,height:1000});await waitIdle();await page.waitForTimeout(250);valid(await measure(),'reduced motion resize');
 await page.screenshot({path:'/tmp/icts-resize-'+name+'.png'});
 assert.deepEqual(errors,[],'no JavaScript errors');
 console.log('PASS '+name+': autoplay; resize during transition; five dots; stable logos; centring/white background; resize back; resize during drag; reduced motion and resize. '+JSON.stringify({desktop:await measure(),mobile:narrow}));
 } finally {await browser.close();}
}
(async()=>{for(const [name,type] of [['chromium',chromium],['webkit',webkit]])await run(name,type);})().catch(e=>{console.error(e);process.exit(1)});
