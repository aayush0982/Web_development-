const ip = document.querySelector(".input");
const wr = document.querySelector(".wrapper");

ip.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const Todo = ip.value;

        if (Todo) {
            const Todoel = document.createElement("div");
            Todoel.classList.add("listcontainer");

            Todoel.innerHTML = `
                <img class="checkbox" src="unchecked.png" alt="checkbox" height="14px">
                <p class="texttodo">${Todo}</p>  
                <img class="delete" src="delete.svg" alt="delete" height="14px">
            `;

            wr.appendChild(Todoel);
            ip.value = "";

            const checkbox = Todoel.querySelector(".checkbox");
            const textTodo = Todoel.querySelector(".texttodo");
            const deleteBtn = Todoel.querySelector(".delete");

            checkbox.addEventListener("click", () => {
                if (checkbox.src.includes("unchecked.png")) {
                    checkbox.src = "checked.png";  
                    textTodo.style.opacity = "0.5";
                    
                    setTimeout(() => {
                        Todoel.remove(); 
                    }, 500);

                } else {
                    checkbox.src = "unchecked.png";
                    textTodo.style.opacity = "1";    
                }
            });

            deleteBtn.addEventListener("click", () => {
                Todoel.remove();  
            });
        }
    }
});
