async function send() {
    var from = Number.parseInt(document.getElementById("from").value);
    var to = Number.parseInt(document.getElementById("to").value);
    var amount = Number.parseFloat(document.getElementById("amount").value);
    var transaction = { from: from, to: to, amount: amount }
    console.log(transaction)
    const response = await fetch("/api/transaction", { method: "POST", body: JSON.stringify(transaction), headers: { "Content-type": "application/json" } });

    // Greife auf das Eingabefeld zu und setze den Wert auf leer
    document.getElementById('from').value = '';
    document.getElementById('to').value = '';
    document.getElementById('amount').value = '';
    alert("Von " + from + " wurde $" + amount + " an " + to + " gesendet")

}