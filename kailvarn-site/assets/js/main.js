/* KailVarn — shared interactions */
(function(){
"use strict";
var $=function(s,c){return (c||document).querySelector(s)};
var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

/* ---------- Promo banner ---------- */
try{
  if(sessionStorage.getItem("kv_promo_off")==="1"){document.body.classList.add("promo-off")}
}catch(e){}
var px=$("#promoClose");
if(px){px.addEventListener("click",function(){
  document.body.classList.add("promo-off");
  try{sessionStorage.setItem("kv_promo_off","1")}catch(e){}
})}

/* ---------- Header scroll ---------- */
var head=$("#siteHead");
function onScroll(){if(head){head.classList.toggle("scrolled",window.scrollY>30)}}
window.addEventListener("scroll",onScroll,{passive:true});onScroll();

/* ---------- Mobile menu ---------- */
var burger=$("#burger");
if(burger){burger.addEventListener("click",function(){document.body.classList.toggle("menu-open")})}
$$(".m-menu a").forEach(function(a){a.addEventListener("click",function(){document.body.classList.remove("menu-open")})});

/* ---------- Active nav ---------- */
var page=(location.pathname.split("/").pop()||"index.html").replace(".html","");
if(page==="index")page="home";
$$(".main-nav a").forEach(function(a){if(a.getAttribute("data-nav")===page)a.classList.add("active")});

/* ---------- Reveal on scroll ---------- */
var io=new IntersectionObserver(function(es){
  es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}});
},{threshold:.12,rootMargin:"0px 0px -40px 0px"});
$$(".reveal").forEach(function(el){io.observe(el)});

/* ---------- Process line ---------- */
var pl=$("#procLine");
if(pl){var pio=new IntersectionObserver(function(es){
  es.forEach(function(e){if(e.isIntersecting){pl.classList.add("in");pio.disconnect()}});
},{threshold:.3});pio.observe(pl)}

/* ---------- Testimonials ---------- */
var TESTI=[
 {q:"KailVarn ne humara poora ghar transform kar diya — bilkul waise hi jaisa design mein dikhaya tha. Ek bhi paisa extra nahi liya. Best decision tha.",n:"Rajesh Patel",m:"Silvassa • Full Home Interior"},
 {q:"Kitchen renovation ke liye bahut sari jagah quote liya, lekin KailVarn ne best quality diya affordable price mein aur koi hidden charge nahi. Very happy!",n:"Priya Shah",m:"Vapi • Kitchen Interior"},
 {q:"Wardrobe and bedroom furniture made by KailVarn is outstanding. Exactly what I wanted. Quality is top class. Highly recommend.",n:"Amit Desai",m:"Silvassa • Custom Furniture"},
 {q:"Painting aur texture work itna sundar hua ki sab neighbour poochh rahe hain. Crack repair bhi properly kiya — no short cuts.",n:"Neha Joshi",m:"Vapi • Painting & Wall Finishes"},
 {q:"Pehle main nervous tha ki itna kaam kaun sambhalega. KailVarn ne ek hi team se poora kaam kiya — no headache at all. Thank you KailVarn!",n:"Suresh Mehta",m:"Silvassa • Full Home Interior"},
 {q:"Commercial office ka interior KailVarn ne kiya — modern, professional aur budget mein. Clients aur staff dono impress hain.",n:"Disha Trivedi",m:"Vapi • Commercial Interior"}
];
var tq=$("#tQuote"),tn=$("#tName"),tm=$("#tMeta"),td=$("#tDots");
if(tq){
  var ti=0,ttimer=null;
  TESTI.forEach(function(_,i){
    var d=document.createElement("i");if(i===0)d.className="on";
    d.addEventListener("click",function(){showT(i);restartT()});td.appendChild(d);
  });
  function showT(i){
    ti=(i+TESTI.length)%TESTI.length;
    tq.style.opacity=0;
    setTimeout(function(){
      tq.textContent=TESTI[ti].q;tn.textContent=TESTI[ti].n;tm.textContent=TESTI[ti].m;
      tq.style.opacity=1;
    },180);
    $$("i",td).forEach(function(d,j){d.classList.toggle("on",j===ti)});
  }
  tq.style.transition="opacity .25s";
  function restartT(){if(ttimer)clearInterval(ttimer);ttimer=setInterval(function(){showT(ti+1)},7000)}
  tq.textContent=TESTI[0].q;tn.textContent=TESTI[0].n;tm.textContent=TESTI[0].m;
  $("#tPrev").addEventListener("click",function(){showT(ti-1);restartT()});
  $("#tNext").addEventListener("click",function(){showT(ti+1);restartT()});
  restartT();
}

/* ---------- Home portfolio tabs ---------- */
var ht=$("#homeTabs"),hg=$("#homeGrid");
if(ht&&hg){
  ht.addEventListener("click",function(e){
    var b=e.target.closest("button");if(!b)return;
    $$("button",ht).forEach(function(x){x.classList.remove("on")});b.classList.add("on");
    var cat=b.getAttribute("data-cat");
    $$(".pf",hg).forEach(function(card){
      var show=(cat==="all"||card.getAttribute("data-cat")===cat);
      card.style.display=show?"":"none";
    });
  });
}

/* ---------- Designs page: render 200 real designs ---------- */
var dg=$("#designGrid");
/* Map the site's real 30 design categories to the 8 collection tabs */
var ROOMMAP={
 "Living Room":"living",
 "Master Bedroom":"bedroom","Standard Bedroom":"bedroom","Kids Bedroom":"bedroom",
 "Island Kitchen":"kitchen","L-Shaped Kitchen":"kitchen","Parallel Kitchen":"kitchen",
 "Straight Kitchen":"kitchen","U-Shaped Kitchen":"kitchen",
 "Open Kitchen+Dining":"dining",
 "Full Home Overview":"fullhome",
 "Beds":"furniture","Hinged Wardrobes":"furniture","Sliding Wardrobes":"furniture",
 "Partitions":"furniture","Study Tables":"furniture","TV Units":"furniture",
 "Bathroom":"painting","Exterior Painting":"painting","Feature Walls":"painting",
 "Full Room Painted":"painting","Italian Texture":"painting","Sand Texture":"painting",
 "Stucco Finish":"painting","Toilet":"painting",
 "Caf\u00e9s":"commercial","Offices":"commercial","Reception":"commercial",
 "Retail":"commercial","Showrooms":"commercial"
};
function roomCat(d){return ROOMMAP[d.category]||"commercial"}
var MOTIFS=["wide","","tall","","","","wide","","","","tall","","wide","","","tall","","","wide","","","tall","wide","","","tall","","wide","","","tall","wide","","tall","","","wide","","tall","","wide","","","tall","wide","","","","tall","wide","","tall","","wide","","","tall","","wide","","tall","","wide",""];
function motif(i){return MOTIFS[i%MOTIFS.length]}
if(dg&&window.KAILVARN_DESIGNS){
  var list=window.KAILVARN_DESIGNS;
  function cardHTML(d,i){
    var m=motif(i),rc=roomCat(d);
    return '<div class="pf '+m+'" data-cat="'+rc+'" data-idx="'+i+'">'+
      '<img src="'+d.image+'" alt="'+d.title.replace(/"/g,"")+'" loading="lazy">'+
      '<div class="pf-veil"><span class="cat">'+d.category+'</span><h3>'+d.title+'</h3>'+
      '<span class="rule"></span></div></div>';
  }
  function render(cat){
    var html="",n=0;
    list.forEach(function(d,i){
      if(cat==="all"||roomCat(d)===cat){html+=cardHTML(d,i);n++}
    });
    dg.innerHTML=html;
    var cc=$("#collCount");if(cc)cc.textContent="Showing "+n+" design"+(n===1?"":"s");
    $$(".pf",dg).forEach(function(el){el.addEventListener("click",function(){openLB(parseInt(el.getAttribute("data-idx"),10))})});
  }
  render("all");
  var dtabs=$("#designTabs");
  if(dtabs){dtabs.addEventListener("click",function(e){
    var b=e.target.closest("button");if(!b)return;
    $$("button",dtabs).forEach(function(x){x.classList.remove("on")});b.classList.add("on");
    render(b.getAttribute("data-cat"));
  })}
}

/* ---------- Lightbox ---------- */
var lb=$("#lightbox");
function openLB(i){
  if(!lb||!window.KAILVARN_DESIGNS)return;
  var d=window.KAILVARN_DESIGNS[i];if(!d)return;
  $("#lbImg").src=d.image;$("#lbImg").alt=d.title;
  $("#lbCat").textContent=d.category;
  $("#lbTitle").textContent=d.title;
  $("#lbDesc").textContent=d.description||"";
  var ar=$("#lbAr");
  if(ar){
    if(d.arSlug){ar.hidden=false;ar.href="https://testing-ai-omega.vercel.app/ar/"+d.arSlug}
    else{ar.hidden=true;ar.removeAttribute("href")}
  }
  lb.classList.add("open");document.body.style.overflow="hidden";
}
function closeLB(){if(lb){lb.classList.remove("open");document.body.style.overflow=""}}
var lbx=$("#lbClose");
if(lbx)lbx.addEventListener("click",closeLB);
if(lb)lb.addEventListener("click",function(e){if(e.target===lb)closeLB()});
document.addEventListener("keydown",function(e){if(e.key==="Escape"){closeLB();document.body.classList.remove("menu-open")}});

/* ---------- FAQ accordion ---------- */
$$(".faq-item").forEach(function(item){
  var q=$(".faq-q",item),a=$(".faq-a",item);
  q.addEventListener("click",function(){
    var open=item.classList.contains("open");
    $$(".faq-item.open").forEach(function(o){o.classList.remove("open");$(".faq-a",o).style.maxHeight=null});
    if(!open){item.classList.add("open");a.style.maxHeight=a.scrollHeight+"px"}
  });
});

/* ---------- Enquiry form → WhatsApp ---------- */
var form=$("#enquiryForm");
if(form){
  form.addEventListener("submit",function(e){
    e.preventDefault();
    var name=$("#fName").value.trim(),phone=$("#fPhone").value.trim(),
        email=$("#fEmail").value.trim(),city=$("#fCity").value.trim(),
        service=$("#fService").value,msg=$("#fMsg").value.trim();
    if(!name||!phone||!city||!service){
      alert("Please fill in your name, phone, city and the service you're interested in.");
      return;
    }
    var text="Hi KailVarn! I'd like to send an enquiry.\n\nName: "+name+"\nPhone: "+phone+
      (email?"\nEmail: "+email:"")+"\nCity: "+city+"\nService: "+service+
      (msg?"\nMessage: "+msg:"");
    window.open("https://wa.me/918401226123?text="+encodeURIComponent(text),"_blank");
  });
}
})();
