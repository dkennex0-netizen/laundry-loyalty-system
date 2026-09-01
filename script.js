// LOAD SAVED CUSTOMERS
let customers = JSON.parse(localStorage.getItem("customers"));

let lastScanTime = 0;
const scanCooldown = 3000; // 3 seconds

if (!customers) {
    customers = {};
}


// SAVE CUSTOMERS
function saveCustomers() {
    localStorage.setItem(
        "customers",
        JSON.stringify(customers)
    );
}


// REGISTER NEW CUSTOMER
function registerCustomer() {

    const name = document
        .getElementById("newCustomerName")
        .value
        .trim();


    if (name === "") {
        alert("Please enter customer name");
        return;
    }


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


    document
        .getElementById("newCustomerName")
        .value = "";
}



// ADD POINT AFTER NFC SCAN
function scanCustomer(cardName) {

    const customer = customers[cardName];

    if (!customer) {

        document.getElementById("status").innerText =
            "❌ Customer not found: " + cardName;

        return;
    }

    // ADD 1 POINT
    customer.points++;

    // SAVE POINTS
    saveCustomers();

    // DISPLAY CUSTOMER
    document.getElementById("customerName").innerText =
        customer.name;

    document.getElementById("points").innerText =
        customer.points;

    // CHECK REWARD
    if (customer.points >= 10) {

        document.getElementById("status").innerText =
            "🎉 FREE LAUNDRY UNLOCKED!";

        customer.points = 0;

        saveCustomers();

        document.getElementById("points").innerText =
            customer.points;

    } else {

        document.getElementById("status").innerText =
            "✅ Point automatically added!";
    }
}


// START NFC SCANNER
async function startNFC() {

    const status = document.getElementById("status");


    // CHECK NFC SUPPORT
    if (!("NDEFReader" in window)) {

        status.innerText =
            "❌ Web NFC is not supported in this browser.";

        return;
    }


    try {

        const ndef = new NDEFReader();

        // START SCANNING
        await ndef.scan();

        status.innerText =
            "📱 NFC Scanner is ON! Tap the customer card.";


        // WHEN NFC CARD IS READ
        ndef.addEventListener("reading", event => {

            for (const record of event.message.records) {

                // READ TEXT RECORD
                if (record.recordType === "text") {

                    const decoder =
                        new TextDecoder(record.encoding || "utf-8");

                    const cardName =
    decoder.decode(record.data).trim();


// Prevent duplicate scanning
const currentTime = Date.now();

if (currentTime - lastScanTime < scanCooldown) {
    return;
}

lastScanTime = currentTime;


// Add only 1 point
scanCustomer(cardName);

                    break;
                }
            }
        });

    } catch (error) {

        status.innerText =
            "❌ NFC Error: " + error.message;

    }
}


// CREATE NFC BUTTON AUTOMATICALLY
window.addEventListener("load", function () {

    const status = document.getElementById("status");

    const button = document.createElement("button");

    button.innerText = "📱 Start NFC Scanner";

    button.style.margin = "15px";
    button.style.padding = "12px 20px";
    button.style.fontSize = "16px";

    button.onclick = startNFC;


    // PUT BUTTON AFTER STATUS
    status.insertAdjacentElement(
        "afterend",
        button
    );

});
