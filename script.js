// Load saved customers
let customers = JSON.parse(localStorage.getItem("customers"));

if (!customers) {
    customers = {};
}


// Save database
function saveCustomers() {
    localStorage.setItem(
        "customers",
        JSON.stringify(customers)
    );
}


// Register customer
function registerCustomer() {

    const name =
        document.getElementById("newCustomerName").value.trim();


    if (name === "") {
        alert("Please enter customer name");
        return;
    }


    // Check if already registered
    if (customers[name]) {
        alert("Customer already exists!");
        return;
    }


    customers[name] = {
        name: name,
        points: 0
    };


    saveCustomers();

    alert(name + " registered successfully!");

    document.getElementById("newCustomerName").value = "";
}


// Scan customer and automatically add point
function scanCustomer(cardName) {

    const customer = customers[cardName];


    if (!customer) {

        document.getElementById("status").innerText =
            "❌ Customer not found";

        return;
    }


    // Automatic +1 point
    customer.points++;

    saveCustomers();


    document.getElementById("customerName").innerText =
        customer.name;

    document.getElementById("points").innerText =
        customer.points;


    if (customer.points >= 10) {

        document.getElementById("status").innerText =
            "🎉 FREE LAUNDRY UNLOCKED!";

    } else {

        document.getElementById("status").innerText =
            "✅ Point automatically added!";
    }

}
