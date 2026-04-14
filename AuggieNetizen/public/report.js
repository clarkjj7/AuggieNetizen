const options = document.querySelectorAll(".option");

options.forEach(opt=>{
    opt.addEventListener("click", ()=>{
        options.forEach(o=>o.classList.remove("selected"));
        opt.classList.add("selected");
    });
});

document.getElementById("submit").addEventListener("click", ()=>{
    alert("Report submitted!");
});