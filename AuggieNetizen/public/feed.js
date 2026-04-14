// simple click interaction
document.querySelectorAll(".card").forEach(card=>{
    card.addEventListener("click", ()=>{
        window.location.href = "incident.html";
    });
});