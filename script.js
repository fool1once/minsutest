const body=document.body;

document.querySelectorAll("a").forEach(link=>{

link.addEventListener("mouseenter",()=>{

body.style.cursor="crosshair";

});

link.addEventListener("mouseleave",()=>{

body.style.cursor="default";

});

});

const observer=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.animate([

{

opacity:0,
transform:"translateY(50px)"

},

{

opacity:1,
transform:"translateY(0px)"

}

],{

duration:800,
fill:"forwards"

});

}

});

});

document.querySelectorAll("section").forEach(sec=>{

observer.observe(sec);

});
