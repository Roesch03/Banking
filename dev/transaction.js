async function send() {
    var from = document.getElementById("from").value;
    var to = document.getElementById("to").value;
    var amount = Number.parseFloat(document.getElementById("amount").value);
    var pkey = document.getElementById("pkey").value;
    var transaction = { from: from, to: to, amount: amount, private: pkey }
    console.log(transaction)
    const response = await fetch("/api/transaction", { method: "POST", body: JSON.stringify(transaction), headers: { "Content-type": "application/json" } });

    // Greife auf das Eingabefeld zu und setze den Wert auf leer
    document.getElementById('from').value = '';
    document.getElementById('to').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('pkey').value = '';
    alert("Von " + from + " wurde $" + amount + " an " + to + " gesendet")

}