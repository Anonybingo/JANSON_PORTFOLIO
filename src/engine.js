import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

// Imperative engine: intro animation, Three.js igloo scene, elastic hover physics.
// React renders the page; this module animates it. Call start() once, stop() to clean up.
export function start(photoUrl) {

const $=i=>document.getElementById(i),clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v)),reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,T0=performance.now();
let W=innerWidth,H=innerHeight,ip=0,tp=0,cp=0,mx=0,my=0,lt=0,ptOK=false,pdn=0,lamp=1,lampT=1,upd=()=>{},rs=()=>{};
let raf=0,tm=0,dead=false,disposeGL=()=>{};const offs=[],listen=(t,n,f)=>{t.addEventListener(n,f);offs.push(()=>t.removeEventListener(n,f))},hudEl=$('hud');

/* intro: scrambling title, then your photo assembles from dust */
const pc=$('pc'),c2=pc.getContext('2d'),intro=$('intro'),title=$('ptitle'),dot=$('dot'),Pt=[],img=new Image(),ST=reduce?-9:3.3,G='ABCDEFGHIJKLMNOPQRSTUVWXYZ!#%&*+?/';
function scramble(txt,dur,cb){const t0=performance.now();(function f(n){const p=clamp((n-t0)/dur);title.textContent=[...txt].map((c,i)=>i<p*txt.length?c:G[Math.random()*G.length|0]).join('');p<1?requestAnimationFrame(f):cb&&cb()})(t0)}
title.textContent='PORTFOLIO';
if(reduce){title.style.opacity=1;title.className='low';dot.style.opacity=0;intro.classList.add('rdy')}
else tm=setTimeout(()=>{dot.style.opacity=0;title.style.opacity=1;scramble('PORTFOLIO',1500,()=>{title.className='low';setTimeout(()=>intro.classList.add('rdy'),500)})},1200);
img.onload=()=>{const w=img.width,h=img.height,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.drawImage(img,0,0);const d=x.getImageData(0,0,w,h).data;
  for(let y=0;y<h;y+=3)for(let q=0;q<w;q+=3){const i=(y*w+q)*4,l=(d[i]*.3+d[i+1]*.59+d[i+2]*.11)/255;if(l>.78||Math.random()<.15)continue;
    Pt.push({x:q/w-.5,y:y/h-.5,K:Math.min(4,l*11|0),d:Math.random(),a:Math.random()*6.28,ox:Math.random()*2-1,oy:Math.random()*2-1})}};
img.src=photoUrl;
function drawP(t){
  c2.clearRect(0,0,W,H);if(ip>=1||!Pt.length||t<ST)return;
  const ph=Math.min(H*.74,W*.92*img.height/img.width),pw=ph*img.width/img.height,cx=W/2,cy=H*.46,al=1-ip;
  c2.fillStyle='#fff';
  for(let K=0;K<5;K++){c2.globalAlpha=(.2+.18*K)*al;
    for(const p of Pt){if(p.K!==K)continue;
      const g=clamp((t-ST-p.d*1.3)/1.6),e=1-Math.pow(1-g,3),sx=p.ox*W*.55,sy=p.oy*H*.55,tx=p.x*pw,ty=p.y*ph;
      c2.fillRect(cx+sx+(tx-sx)*e+Math.sin(t*1.7+p.a)*1.4+tx*ip*2.5+Math.cos(p.a)*ip*140,cy+sy+(ty-sy)*e+Math.cos(t*1.3+p.a)*1.4+ty*ip*2.5-ip*90,1.8,1.8)}}
  c2.globalAlpha=1}

/* 3D: block igloo on misty mountains */
try{(function(){
const T=THREE,FOG=0xc9ced9,R=new T.WebGLRenderer({canvas:$('gl'),antialias:true}),scene=new T.Scene(),cam=new T.PerspectiveCamera(48,1,.1,400),tmp=new T.Vector3(),V=a=>a.map(v=>new T.Vector3(...v));
disposeGL=()=>R.dispose();R.setPixelRatio(Math.min(devicePixelRatio,1.5));R.setClearColor(FOG);scene.fog=new T.Fog(FOG,16,95);
scene.add(new T.HemisphereLight(0xe8ecf7,0x7a8091,.85));
const sun=new T.DirectionalLight(0xffffff,.55);sun.position.set(-12,18,9);scene.add(sun);
const warm=new T.PointLight(0xfff1dc,2.2,16);warm.position.set(0,1.6,0);scene.add(warm);
const rock=(()=>{const S=256,c=document.createElement('canvas');c.width=c.height=S;const x=c.getContext('2d'),im=x.createImageData(S,S),oc=[],sf=t=>t*t*(3-2*t);
for(let o=0;o<4;o++){const m=8<<o;oc.push([m,Array.from({length:m*m},Math.random)])}
for(let j=0;j<S;j++)for(let i=0;i<S;i++){let v=0,a=.55;
  for(const[m,gd]of oc){const u=i/S*m,w=j/S*m,i0=Math.floor(u),j0=Math.floor(w),fu=sf(u-i0),fw=sf(w-j0),q=(p,r)=>gd[(r%m)*m+(p%m)];
    v+=a*((q(i0,j0)*(1-fu)+q(i0+1,j0)*fu)*(1-fw)+(q(i0,j0+1)*(1-fu)+q(i0+1,j0+1)*fu)*fw);a*=.55}
  const b=clamp(v*.95)*255,k=(j*S+i)*4;im.data[k]=im.data[k+1]=im.data[k+2]=b;im.data[k+3]=255}
x.putImageData(im,0,0);const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;return t})();
const rt=rock.clone();rt.needsUpdate=true;rt.repeat.set(60,60);
// terrain
const ss=(a,b,x)=>{x=clamp((x-a)/(b-a));return x*x*(3-2*x)},tg=new T.PlaneGeometry(260,260,170,170);tg.rotateX(-Math.PI/2);
const pa=tg.attributes.position,cl=new Float32Array(pa.count*3);
for(let i=0;i<pa.count;i++){const x=pa.getX(i),z=pa.getZ(i),d=Math.hypot(x,z);let v=0,a=1,f=.018;
  for(let o=0;o<4;o++){v+=a*(Math.sin(x*f+o*1.7)*Math.cos(z*f*1.13-o)+.6*Math.sin((x+z)*f*.7+o*2.3));a*=.5;f*=2.1}
  const y=ss(7,40,d)*(v*5+4+ss(30,110,d)*16),c=.4+.3*ss(0,22,y)+.05*Math.sin(x*.9)*Math.cos(z*.8);
  pa.setY(i,y);cl.set([c*.9,c*.93,c],i*3)}
tg.setAttribute('color',new T.BufferAttribute(cl,3));tg.computeVertexNormals();
scene.add(new T.Mesh(tg,new T.MeshStandardMaterial({vertexColors:true,roughness:1,bumpMap:rt,bumpScale:1.2})));
// igloo
const g=new T.Group(),FL=[],O=new T.Vector3();scene.add(g);
function rbox(w,h,d,r,k){const n=2*k+1,bg=new T.BoxGeometry(1,1,1,n,n,n),p=bg.attributes.position,nr=bg.attributes.normal,uv=bg.attributes.uv,hs=.5/n,bx=w/2-r,by=h/2-r,bz=d/2-r,v=new T.Vector3(),o1=Math.random(),o2=Math.random();
  for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);const sx=Math.sign(v.x),sy=Math.sign(v.y),sz=Math.sign(v.z);v.set(v.x-sx*hs,v.y-sy*hs,v.z-sz*hs).normalize();
    const X=bx*sx+v.x*r,Y=by*sy+v.y*r,Z=bz*sz+v.z*r,ax=Math.abs(v.x),ay=Math.abs(v.y),az=Math.abs(v.z);
    p.setXYZ(i,X,Y,Z);nr.setXYZ(i,v.x,v.y,v.z);
    uv.setXY(i,(az>=ax&&az>=ay?X:ax>=ay?Z:X)*1.1+o1,((az>=ax&&az>=ay)||ax>=ay?Y:Z)*1.1+o2)}
  return bg}
const stone=()=>new T.Color().setHSL(.62,.08,.4+Math.random()*.1),ice=()=>new T.Color().setHSL(.6,.35,.88+Math.random()*.08);
const mat=(c,gl)=>new T.MeshStandardMaterial({color:c,roughness:.8,bumpMap:rock,bumpScale:.1,emissive:0x9ec4ff,emissiveIntensity:gl?.5:.04});
function brick(w,h,d,p,tgt,col,up,gl){const m=new T.Mesh(rbox(w,h,d,Math.min(w,h,d)*.22,2),mat(col,gl));
  m.position.copy(p);if(up)m.up.copy(up);m.lookAt(tgt);m.rotateZ((Math.random()-.5)*.05);m.rotateX((Math.random()-.5)*.04);g.add(m);return m}
const RR=3.2,rows=8,th0=.5;let cnt=0;
for(let j=0;j<rows;j++){const f=.05+j*1.3/(rows-1),r=RR*Math.cos(f),y=RR*Math.sin(f),n=Math.max(5,Math.round(6.283*r/.95)),top=j>=rows-2;
  for(let i=0;i<n;i++){const a=(i+(j%2)*.5)/n*6.283,da=Math.abs(Math.atan2(Math.sin(a-th0),Math.cos(a-th0)));
    if(j<3&&da<.32)continue;
    const m=brick(6.283*r/n*.88,RR*1.3/(rows-1)*.86,.55,new T.Vector3(r*Math.cos(a),y,r*Math.sin(a)),O,top?ice():stone(),null,top);
    if(j>1&&da>.45&&Math.cos(a-.9)>.1&&cnt++%9===4){m.position.multiplyScalar(1.12).y+=.12;m.rotateX(.4*(Math.random()-.5));m.rotateY(.5*(Math.random()-.5));m.userData={y0:m.position.y,ph:Math.random()*6};FL.push(m)}}}
const cap=new T.Mesh(rbox(.95,.32,.95,.09,2),mat(ice(),1));cap.position.y=3.3;g.add(cap);
const dir=new T.Vector3(Math.cos(th0),0,Math.sin(th0)),side=new T.Vector3(-dir.z,0,dir.x),Y=new T.Vector3(0,1,0);
for(let s=0;s<3;s++){const c=dir.clone().multiplyScalar(RR+.1+s*.85);
  for(let a=0;a<=6;a++){const q=a/6*Math.PI;brick(.42,.84,.46,c.clone().addScaledVector(side,Math.cos(q)*.95).addScaledVector(Y,Math.sin(q)*.95),c,stone(),dir)}}
for(let i=0;i<6;i++){const p=dir.clone().multiplyScalar(RR+2.8+Math.random()*2.5).addScaledVector(side,(Math.random()-.5)*5);p.y=.2;
  brick(.8,.4,.5,p,p.clone().add(new T.Vector3(Math.random()-.5,0,Math.random()-.5)),stone())}
const glowM=new T.MeshBasicMaterial({color:0xffffff,side:T.DoubleSide});
g.add(new T.Mesh(new T.SphereGeometry(RR-.2,32,16,0,Math.PI*2,0,Math.PI/2),glowM));
const fl=new T.Mesh(new T.CircleGeometry(RR-.2,32),glowM);fl.rotation.x=-Math.PI/2;fl.position.y=.02;g.add(fl);
const BK=[];g.children.forEach(m=>{if(m.geometry.type!=='BoxGeometry')return;const u=m.userData;u.p0=m.position.clone();u.q0=m.quaternion.clone();u.n=m.position.clone().add(new T.Vector3(0,.4,0)).normalize();u.x=0;u.v=0;u.e=m.material.emissiveIntensity;BK.push(m)});
// snow
const N=1300,sa=new Float32Array(N*3);for(let i=0;i<N;i++){sa[i*3]=(Math.random()-.5)*50;sa[i*3+1]=Math.random()*18;sa[i*3+2]=(Math.random()-.5)*50}
const sg=new T.BufferGeometry();sg.setAttribute('position',new T.BufferAttribute(sa,3));
const cv=document.createElement('canvas');cv.width=cv.height=32;const cx=cv.getContext('2d'),gr=cx.createRadialGradient(16,16,0,16,16,16);gr.addColorStop(0,'#fff');gr.addColorStop(1,'rgba(255,255,255,0)');cx.fillStyle=gr;cx.fillRect(0,0,32,32);
scene.add(new T.Points(sg,new T.PointsMaterial({size:.2,map:new T.CanvasTexture(cv),transparent:true,depthWrite:false,opacity:.9})));
// HUD markers
const NS='http://www.w3.org/2000/svg',hud=$('hud'),pl=document.createElementNS(NS,'polyline'),q=new T.Vector3();
pl.setAttribute('fill','none');pl.setAttribute('stroke','#fff');pl.setAttribute('opacity','.8');hud.appendChild(pl);
const TX=FL.slice(0,5).map(()=>{const e=document.createElementNS(NS,'text');e.textContent='+ '+(10+Math.random()*89|0);hud.appendChild(e);return e});
// rings of curved blocks floating in the clouds
const RG=new T.Group();RG.position.set(0,80,0);scene.add(RG);
function arc(L,h,d,Rr){const bg=rbox(L,h,d,Math.min(h,d)*.28,3),p=bg.attributes.position,nr=bg.attributes.normal;
  for(let i=0;i<p.count;i++){const a=p.getX(i)/Rr,r=Rr+p.getZ(i),c=Math.cos(a),s=Math.sin(a),nx=nr.getX(i),nz=nr.getZ(i);
    p.setXYZ(i,r*s,p.getY(i),r*c-Rr);nr.setXYZ(i,nx*c+nz*s,nr.getY(i),-nx*s+nz*c)}
  return bg}
const rings=[[2.3,5],[3.5,6],[4.7,8]].map(([Rr,n],k)=>{const rg=new T.Group();
  for(let i=0;i<n;i++){const m=new T.Mesh(arc(6.283*Rr/n*.74,.62,.5,Rr),mat(stone().offsetHSL(0,0,.1))),f=i/n*6.283;m.position.set(Rr*Math.sin(f),0,Rr*Math.cos(f));m.rotation.y=f;rg.add(m)}
  rg.rotation.set(.9*k+.5,.7*k,.4*k);RG.add(rg);return rg});
const cm=new T.SpriteMaterial({map:new T.CanvasTexture(cv),transparent:true,opacity:.28,depthWrite:false});
for(let i=0;i<16;i++){const s=new T.Sprite(cm),a=Math.random()*6.283,r=10+Math.random()*16;s.position.set(Math.cos(a)*r,(Math.random()-.5)*14,Math.sin(a)*r-6);s.scale.setScalar(14+Math.random()*16);RG.add(s)}
// bloom makes the inner light bleed through the gaps
let comp=null,bloom={};try{comp=new EffectComposer(R);comp.addPass(new RenderPass(scene,cam));comp.addPass(bloom=new UnrealBloomPass(new T.Vector2(W,H),.9,.75,.9))}catch(e){comp=null}
// camera flight: orbit the igloo, then climb into the clouds
const CP=new T.CatmullRomCurve3(V([[7.5,3.4,9.5],[11.5,2.6,.5],[5,3.2,-10.5],[-9.5,3.4,-6],[-10.5,2.6,5.5],[-3,3.2,11],[-2,16,13],[3,45,15],[6,74,13],[-4,82,12]])),
CL=new T.CatmullRomCurve3(V([[0,1.7,0],[0,1.7,0],[0,1.6,0],[0,1.7,0],[0,1.5,0],[0,1.7,0],[0,8,0],[0,50,0],[0,80,0],[0,80,0]])),sm={x:0,y:0};
rs=()=>{R.setSize(W,H,false);comp&&comp.setSize(W,H);cam.aspect=W/H;cam.fov=W/H<1?70:48;cam.updateProjectionMatrix()};rs();
const rc=new T.Raycaster(),qw=new T.Quaternion(),ax=new T.Vector3(1,0,.3).normalize();let hov=null,boost=0;
const halo=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(cv),color:0xdfeaff,transparent:true,opacity:.5,blending:T.AdditiveBlending,depthWrite:false}));
halo.position.copy(dir).multiplyScalar(RR+.9);halo.position.y=.7;halo.scale.setScalar(4.2);scene.add(halo);
const spill=new T.PointLight(0xdfeaff,1.4,10);spill.position.copy(dir).multiplyScalar(RR+1.8);spill.position.y=.6;scene.add(spill);
const kick=(m,s)=>BK.forEach(b=>{const d=b.userData.p0.distanceTo(m.userData.p0);if(d<1.8)b.userData.v+=s*Math.pow(1-d/1.8,2)});
upd=(t,dt)=>{
  const kf=1-Math.exp(-dt*4);
  CP.getPoint(cp,cam.position);CL.getPoint(cp,tmp);
  sm.x+=(mx-sm.x)*kf*.6;sm.y+=(my-sm.y)*kf*.6;cam.position.x+=sm.x*.8;cam.position.y+=sm.y*.5+(reduce?0:Math.sin(t*.5)*.07);cam.lookAt(tmp);
  if(!reduce){for(let i=0;i<N;i++){sa[i*3+1]-=dt*1.1;sa[i*3]+=Math.sin(t+i)*.004;if(sa[i*3+1]<0)sa[i*3+1]=18}sg.attributes.position.needsUpdate=true;
    rings.forEach((r,i)=>{r.rotation.y+=dt*.12*(i+1);r.rotation.x+=dt*.05});
    let hv=null;
    if(ptOK&&ip>.9&&cp<.45){rc.setFromCamera({x:mx,y:my},cam);const h=rc.intersectObjects(BK,false)[0];hv=h?h.object:null}
    if(hv!==hov){hov=hv;document.body.style.cursor=hv?'pointer':'';if(hv)kick(hv,3.5)}
    if(pdn){pdn=0;if(hov)kick(hov,8)}
    BK.forEach(b=>{const u=b.userData;let tg=0;
      if(hov){const d=u.p0.distanceTo(hov.userData.p0);tg=b===hov?.42:d<1.8?.14*(1-d/1.8):0}
      u.v+=(95*(tg-u.x)-6.5*u.v)*dt;u.x+=u.v*dt;
      b.position.copy(u.p0).addScaledVector(u.n,u.x);if(u.ph!==undefined)b.position.y+=Math.sin(t*.9+u.ph)*.07;
      b.scale.setScalar(1+u.x*.35);b.quaternion.copy(u.q0).multiply(qw.setFromAxisAngle(ax,u.x*1.1));
      b.material.emissiveIntensity=u.e+Math.max(0,u.x)*2.4})}
  // inner light: breathes, swells while a block is touched, can be switched off
  lamp+=(lampT-lamp)*kf;boost+=((hov?1:0)-boost)*kf*1.5;
  glowM.color.setScalar(.15+.85*lamp);warm.intensity=lamp*(2.2+Math.sin(t*2.3)*.15+boost*2.2);
  spill.intensity=lamp*(1.4+boost);halo.material.opacity=lamp*(.42+boost*.3);bloom.strength=.15+lamp*(.9+boost*.45);
  const pts=FL.slice(0,5).map(m=>{q.copy(m.position).project(cam);return[(q.x*.5+.5)*W,(-q.y*.5+.5)*H]});
  TX.forEach((e,i)=>{e.setAttribute('x',pts[i][0]-3);e.setAttribute('y',pts[i][1]+3)});
  pl.setAttribute('points',pts.slice().sort((a,b)=>a[0]-b[0]).map(p=>p.join(',')).join(' '));
  hud.style.opacity=ip*clamp(1-cp*5);comp?comp.render():R.render(scene,cam)};
})()}catch(e){console.warn(e)}

function size(){W=innerWidth;H=innerHeight;pc.width=W;pc.height=H;rs()}
listen(window,'resize',size);size();
const okT=e=>!(e.target.closest&&e.target.closest('.panel,.h,#intro')),pos=e=>{mx=e.clientX/W*2-1;my=-(e.clientY/H*2-1);ptOK=okT(e)};
listen(window,'pointermove',pos);listen(window,'pointerdown',e=>{pos(e);pdn=ptOK?1:0});
['pointerup','pointercancel'].forEach(n=>listen(window,n,e=>{if(e.pointerType==='touch')ptOK=false}));
listen(document,'mouseleave',()=>ptOK=false);
const panels=[...document.querySelectorAll(".panel")];
function frame(now){
  if(dead)return;raf=requestAnimationFrame(frame);
  const t=(now-T0)/1000,dt=Math.min(.05,t-lt);lt=t;
  const max=document.documentElement.scrollHeight-H,s0=H*.9;
  ip=clamp(scrollY/(H*.85));tp=max>s0?clamp((scrollY-s0)/(max-s0)):0;cp+=(tp-cp)*(reduce?1:1-Math.exp(-dt*3.2));
  document.body.style.setProperty('--ip',ip);$('hint').style.opacity=clamp(ip*(1-cp*7));
  for(const p of panels){const r=p.getBoundingClientRect(),y=p._y||0,o=clamp(Math.min((H*.9-(r.top-y))/(H*.38),(r.bottom-y)/(H*.38))),e=o*o*(3-2*o);p._y=(1-e)*40;p.style.opacity=e;p.style.transform='translateY('+p._y+'px)'}intro.style.opacity=1-ip;intro.style.visibility=ip>=1?'hidden':'visible';
  drawP(t);upd(t,dt)}
raf=requestAnimationFrame(frame);

/* light + sound toggles (the buttons live in React) */
let ac,gn;
const toggleLight=()=>{lampT=lampT?0:1;return !!lampT};
const toggleSound=()=>{if(!ac){ac=new AudioContext();const b=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  const s=ac.createBufferSource();s.buffer=b;s.loop=true;const f=ac.createBiquadFilter();f.type='lowpass';f.frequency.value=380;gn=ac.createGain();gn.gain.value=0;s.connect(f);f.connect(gn);gn.connect(ac.destination);s.start()}
  const on=gn.gain.value==0;gn.gain.value=on?.12:0;return on};
const stop=()=>{dead=true;cancelAnimationFrame(raf);clearTimeout(tm);offs.forEach(f=>f());ac&&ac.close();hudEl.replaceChildren();disposeGL()};
return {stop,toggleLight,toggleSound}
}
