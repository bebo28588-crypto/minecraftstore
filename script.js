// =========================
// Minecraft Store
// =========================

let cart = {};

const shop = document.getElementById("shop");
const search = document.getElementById("search");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const total = document.getElementById("total");
const clickSound = new Audio("sounds/click.mp3");
clickSound.volume = 0.5;
function renderShop(list = items){

    shop.innerHTML = "";

    const categories = {};

    list.forEach(item => {

        if(!categories[item.category]){
            categories[item.category] = [];
        }

        categories[item.category].push(item);

    });

    for(const category in categories){

        const section = document.createElement("div");

        section.className = "category";

        section.innerHTML = `
            <h2>${category}</h2>
            <div class="items"></div>
        `;

        const grid = section.querySelector(".items");

        categories[category].forEach(item => {

            const card = document.createElement("div");

            card.className = "card";

            card.innerHTML = `
                <h3>${item.name}</h3>

                <div class="price">
    ${item.price} EGP
</div>

<div class="stock">
    Stock: ${item.stock}
</div>

<button class="add">
    Add
</button>
            `;
const btn = card.querySelector(".add");

btn.onclick = () => {

    addToCart(item);

    btn.innerHTML = "✔ Added";

    btn.style.background = "#00c853";

    setTimeout(()=>{

        btn.innerHTML = "Add";

        btn.style.background = "";

    },1000);

};
            grid.appendChild(card);

        });

        shop.appendChild(section);

    }

}

renderShop();
function addToCart(item){
if(item.stock <= 0){
    alert("Out of Stock!");
    return;
}

item.stock--;
    if(cart[item.name]){
        cart[item.name].quantity++;
    }else{
        cart[item.name] = {
            ...item,
            quantity: 1
        };
    }

    clickSound.currentTime = 0;
    clickSound.play();

    let count = 0;

for(const name in cart){
    count += cart[name].quantity;
}

cartCount.innerText = count;

    renderCart();
    renderShop();

    const cartBox = document.getElementById("cart");

    cartBox.classList.add("pop");

    setTimeout(() => {
        cartBox.classList.remove("pop");
    }, 300);

}




function renderCart(){

    cartItems.innerHTML = "";

    let sum = 0;

    for(const name in cart){

        const item = cart[name];

        sum += item.price * item.quantity;

        cartItems.innerHTML += `
        <div class="cart-item">

            <span>
                ${item.name} ×${item.quantity} - ${item.price * item.quantity} EGP
            </span>

            <button onclick="removeItem('${item.name}')">🗑</button>

        </div>
        `;

    }

    total.innerText = sum;

}



function removeItem(name){

    if(cart[name].quantity > 1){

        cart[name].quantity--;

    }else{

        delete cart[name];

    }

    let count = 0;

for(const name in cart){
    count += cart[name].quantity;
}

cartCount.innerText = count;
    
    renderCart();

}

renderShop();
if(search){

    search.addEventListener("input", function(){

        const text = this.value.toLowerCase();

        const filtered = items.filter(item =>
            item.name.toLowerCase().includes(text)
        );

        renderShop(filtered);

    });

}
const filters = document.getElementById("filters");

const categories = ["All", ...new Set(items.map(item => item.category))];

categories.forEach(category => {

    const button = document.createElement("button");

    button.className = "filter";

    button.innerText = category;

    if(category === "All"){
        button.classList.add("active");
    }

    button.onclick = () => {

        document.querySelectorAll(".filter").forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        if(category === "All"){

    document.getElementById("ranks").style.display = "none";
    document.getElementById("shop").style.display = "block";
    renderShop(items);

}else if(category === "Ranks"){

    document.getElementById("shop").style.display = "none";
    document.getElementById("ranks").style.display = "grid";

}else{

    document.getElementById("ranks").style.display = "none";
    document.getElementById("shop").style.display = "block";

    renderShop(items.filter(item =>
        item.category === category
    ));

}

    };

    filters.appendChild(button);

});
const ranks = [

{
    name:"👑 SPECIAL",
    price:"30 EGP",
    features:[
        "🛡 Full Diamond Armor",
        "⚔ Diamond Sword",
        "⛏ Diamond Pickaxe",
        "🪓 Diamond Axe",
        "📦 Kit Every 2 Days"
    ]
},

{
    name:"👑 THE BEST",
    price:"50 EGP",
    features:[
        "🛡 Full Netherite Armor",
        "⚔ Netherite Sword",
        "⛏ Netherite Pickaxe",
        "🪓 Netherite Axe",
        "📦 Kit Every Week"
    ]
},

{
    name:"👑 LORD",
    price:"100 EGP",
    features:[
        "🛡 Netherite Armor",
        "🟢 Protection IV",
        "♾️ Mending",
        "⚔ Sharpness V Sword",
        "⛏ Efficiency IV Pickaxe",
        "📦 Weekly Kit"
    ]
},

{
    name:"👑 ALGYAR",
    price:"125 EGP",
    features:[
        "🛡 Everything in LORD",
        "🥩 64 Cooked Beef",
        "🍎 32 Enchanted Golden Apples",
        "📦 Kit Every 3 Days"
    ]
}

];


const ranksDiv = document.getElementById("ranks");

ranks.forEach(rank=>{

    const card = document.createElement("div");

    card.className = "rank-card";

    card.innerHTML = `
        <h2>${rank.name}</h2>

        <div class="rank-price">${rank.price}</div>

        <ul>
            ${rank.features.map(f=>`<li>${f}</li>`).join("")}
        </ul>

        <button class="rank-buy" onclick="buyRank('${rank.name}', ${parseInt(rank.price)})">
    Buy Rank
</button>
    `;

    ranksDiv.appendChild(card);

});
function buyRank(name, price){

    addToCart({
        name: name,
        price: price
    });

}
const savedUsername = localStorage.getItem("username");
const savedPassword = localStorage.getItem("password");

if(savedUsername && savedPassword){
    document.getElementById("login-screen").style.display = "none";
}

const loginBtn = document.getElementById("login-btn");

loginBtn.onclick = () => {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if(username.length < 4){
        alert("Username must be at least 4 characters!");
        return;
    }

    if(password.length < 9){
        alert("Password must be at least 9 characters!");
        return;
    }

    localStorage.setItem("username", username);
    localStorage.setItem("password", password);

    document.getElementById("login-screen").style.display = "none";
};
const logoutBtn = document.getElementById("logout-btn");

logoutBtn.onclick = () => {

    localStorage.removeItem("username");
    localStorage.removeItem("password");

    location.reload();

};
document.getElementById("checkout").onclick = async () => {

    if (Object.keys(cart).length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const username = localStorage.getItem("username");

    const cartArray = Object.values(cart);

    const totalPrice = Number(document.getElementById("total").innerText);

    const response = await fetch("http://localhost:3000/checkout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            cart: cartArray,
            total: totalPrice
        })
    });

    const data = await response.json();

    if (data.success) {
        alert("Ticket Created Successfully!");
    } else {
        alert("Something went wrong!");
    }

};