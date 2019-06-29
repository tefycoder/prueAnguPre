/********************************************/
/********************************************/
/**************** BaluArt.net ***************/
/******* Arte y Cultura - Blog Peruano*******/
/********************************************/
/********************************************/

/* modifica las caracteristicas de los menus hijos */
function menu_set(){ 
 var i,d='',h="<sty"+"le type=\"text/css\">",tA=navigator.userAgent.toLowerCase();if(window.opera){
 if(tA.indexOf("opera 5")>-1||tA.indexOf("opera 6")>-1){return;}}if(document.getElementById){
 for(i=1;i<20;i++){d+='ul ';h+="\n#menunav "+d+"{position:absolute;left:-9000px;width:11em;}";}
 document.write(h+"\n<"+"/sty"+"le>");}}menu_set();

/* modifica caracteristicas de apertura de menus */
function menu_init(){
 var i,g,tD,tA,tU,pp,lvl,tn=navigator.userAgent.toLowerCase();if(window.opera){
 if(tn.indexOf("opera 5")>-1||tn.indexOf("opera 6")>-1){return;}}else if(!document.getElementById){return;}
 menup=arguments;menuct=new Array;tD=document.getElementById('menunav');if(tD){tA=tD.getElementsByTagName('A');
 for(i=0;i<tA.length;i++){tA[i].menucl=menuct.length;menuct[menuct.length]=tA[i];g=tA[i].parentNode.getElementsByTagName("UL");
 tA[i].menusub=(g)?g[0]:false;ev=tA[i].getAttribute("onmouseover");if(!ev||ev=='undefined'){tA[i].onmouseover=function(){
 menu_trig(this);};}ev=tA[i].getAttribute("onfocus");if(!ev||ev=='undefined'){tA[i].onfocus=function(){menu_trig(this);};}
 if(tA[i].menusub){pp=tA[i].parentNode;lvl=0;while(pp){if(pp.tagName&&pp.tagName=="UL"){lvl++;}pp=pp.parentNode;}
 tA[i].menulv=lvl;}}tD.onmouseout=menu_close;menu_open();}
}

function menu_trig(a){
 var b,t;if(document.menut){clearTimeout(document.menut);}document.menua=1;b=(a.menusub)?'menu_show(':'menu_tg(';
 t='document.menut=setTimeout("'+b+a.menucl+')",160)';eval (t);
}

/*muestra los menus */
function menu_show(a,bp){ 
 var u,lv,oft,ofr,uw,uh,pp,aw,ah,adj,mR,mT,wW=0,wH,w1,w2,w3,sct,pw,lc,pwv,xx=0,yy=0,wP=true;
 var iem=(navigator.appVersion.indexOf("MSIE 5")>-1)?true:false,dce=document.documentElement,dby=document.body;document.menua=1;
 if(!bp){menu_tg(a);}u=menuct[a].menusub;if(u.menuax&&u.menuax==1){return;}u.menuax=1;lv=(menup[0]==1&&menuct[a].menulv==1)?true:false;
 menuct[a].className=menuct[a].className.replace("menutrg","menuon");oft=parseInt(menup[3]);ofr=parseInt(menup[4]);
 uw=u.offsetWidth;uh=u.offsetHeight;pp=menuct[a];aw=pp.offsetWidth;ah=pp.offsetHeight;while(pp){xx+=(pp.offsetLeft)?pp.offsetLeft:0;
 yy+=(pp.offsetTop)?pp.offsetTop:0;if(window.opera||navigator.userAgent.indexOf("Safari")>-1){
 if(menuct[a].menulv!=1&&pp.nodeName=="BODY"){yy-=(pp.offsetTop)?pp.offsetTop:0;}}pp=pp.offsetParent;}
 if(iem&&navigator.userAgent.indexOf("Mac")>-1){yy+=parseInt(dby.currentStyle.marginTop);}adj=parseInt((aw*ofr)/100);mR=(lv)?0:aw-adj;
 adj=parseInt((ah*oft)/100);mT=(lv)?0:(ah-adj)*-1;w3=dby.parentNode.scrollLeft;if(!w3){w3=dby.scrollLeft;}w3=(w3)?w3:0;
 if(dce&&dce.clientWidth){wW=dce.clientWidth+w3;}else if(dby){wW=dby.clientWidth+w3;}if(!wW){wW=0;wP=false;}wH=window.innerHeight;
 if(!wH){wH=dce.clientHeight;if(!wH||wH<=0){wH=dby.clientHeight;}}sct=dby.parentNode.scrollTop;if(!sct){sct=dby.scrollTop;if(!sct){
 sct=window.scrollY?window.scrollY:0;}}pw=xx+mR+uw;if(pw>wW&&wP){mR=uw*-1;mR+=10;if(lv){mR=(wW-xx)-uw;}}lc=xx+mR;if(lc<0){mR=xx*-1;}
 pw=yy+uh+ah+mT-sct;pwv=wH-pw;if(pwv<0){mT+=pwv;}u.style.marginLeft=mR+'px';u.style.marginTop=mT+'px';
 if(menup[2]==1){if(!iem){menu_anim(a,20);}}u.className="menushow";
}

/* oculta los menus */
function menu_hide(u){ 
 var i,tt,ua;u.menuax=0;u.className="menuhide";ua=u.parentNode.firstChild;ua.className=ua.className.replace("menuon","menutrg");
}

function menu_tg(a,b){ 
 var i,u,tA,tU,pp;tA=menuct[a];pp=tA.parentNode;while(pp){if(pp.tagName=="UL"){break;}pp=pp.parentNode;}if(pp){
 tU=pp.getElementsByTagName("UL");for(i=tU.length-1;i>-1;i--){if(b!=1&&tA.menusub==tU[i]){continue;}else{menu_hide(tU[i]);}}}
}

function menu_close(evt){
 var pp,st,tS,m=true;evt=(evt)?evt:((event)?event:null);st=document.menua;if(st!=-1){if(evt){
 tS=(evt.relatedTarget)?evt.relatedTarget:evt.toElement;if(tS){pp=tS.parentNode;while(pp){if(pp&&pp.id&&pp.id=="menunav"){m=false;
 document.menua=1;break;}pp=pp.parentNode;}}if(m){document.menua=-1;if(document.menut){clearTimeout(document.menut);}
 document.menut=setTimeout("menu_clr()",360);}}}
}

function menu_clr(){
 var i,tU,tUU;document.menua=-1;tU=document.getElementById('menunav');if(tU){tUU=tU.getElementsByTagName("UL");if(tUU){
 for(i=tUU.length-1;i>-1;i--){menu_hide(tUU[i]);}}}
}

/* crea la animación */
function menu_anim(a,st){ 
 var g=menuct[a].menusub,sp=30,inc=20;st=(st>=100)?100:st;g.style.fontSize=st+"%";if(st<100){st+=inc;setTimeout("menu_anim("+a+","+st+")",sp);}
}

function menu_mark(){document.menuop=arguments;}

function menu_open(){ 
 var i,x,tA,op,pp,wH,tA,aU,r1,k=-1,kk=-1,mt=new Array(1,'','');if(document.menuop){mt=document.menuop;}op=mt[0];if(op<1){return;}
 tA=document.getElementById('menunav').getElementsByTagName("A");wH=window.location.href;r1=/index\.[\S]*/i;for(i=0;i<tA.length;i++){
 if(tA[i].href){aU=tA[i].href.replace(r1,'');if(op>0){if(tA[i].href==wH||aU==wH){k=i;kk=-1;break;}}if(op==2){if(tA[i].firstChild){
 if(tA[i].firstChild.nodeValue==mt[1]){kk=i;}}}if(op==3 && tA[i].href.indexOf(mt[1])>-1){kk=i;}if(op==4){for(x=1;x<mt.length;x+=2){
 if(wH.indexOf(mt[x])>-1){if(tA[i].firstChild&&tA[i].firstChild.data){if(tA[i].firstChild.data==mt[x+1]){kk=i;break;}}}}}}}k=(kk>k)?kk:k;
 if(k>-1){pp=tA[k].parentNode;while(pp){if(pp.nodeName=="LI"){pp.firstChild.className="menumark"+" "+pp.firstChild.className;}
 pp=pp.parentNode;}}if(kk>-1){document.menuad=1;}
}
