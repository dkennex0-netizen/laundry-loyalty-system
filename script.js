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

    document.getElementById("newCustomerName").value = "";
}


// Add point automatically
function scanCustomer(cardName) {

    const customer = customers[cardName];

    if (!customer) {

        document.getElementById("status").innerText =
            "❌ Customer not found";

        return;
    }

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


// NFC SCANNING
async function startNFC() {

    if (!("NDEFReader" in window)) {

        document.getElementById("status").innerText =
            "❌ NFC is not supported on this device/browser.";

        return;
    }

    try {

        const ndef = new NDEFReader();

        await ndef.scan();

        document.getElementById("status").innerText =
            "📱 Ready! Tap NFC card.";

        ndef.addEventListener("reading", event => {

            for (const record of event.message.records) {

                if (record.recordType === "text") {

                    const decoder = new TextDecoder(
                        record.encoding || "utf-8"
                    );

                    const cardName =
                        decoder.decode(record.data).trim();

                    scanCustomer(cardName);

                    break;
                }
            }
        });

    } catch (error) {

        document.getElementById("status").innerText =
            "❌ NFC error: " + error.message;

    }
}


// Start NFC scanning when page opens
startNFC();
