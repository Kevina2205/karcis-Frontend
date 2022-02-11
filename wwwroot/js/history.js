if ($("#footer").offset().top < window.innerHeight - $("#footer").height()) {
    $("#footer").css("position", "fixed");
    $("#footer").css("bottom", "0");
}
else {
    $("#footer").css("position", "flex");
}


async function loadBookingHistoryList() {
    const data = await query_getBookingHistory();
    document.getElementById("historyContent").innerHTML = data;
}
loadBookingHistoryList();
async function query_getBookingHistory() {
    const response = await fetch("../History/GetAllBookingHistory")
    const data = await response.text();
    return data;
}
async function cancelBooking(bookingID) {
    console.log(bookingID);
    const data = await query_cancelBooking(bookingID);
    loadBookingHistoryList();
}
async function query_getBookingByID(bookingID) {
    const response = await fetch("../History/GetBookingByID?id=" + bookingID, {
        method: "GET"
    });
    const data = await response.text();
    return data;
}
function closeBookingDetail() {
    $("#bookingDetailPopUp").css("display", "none");
}

function closeBookingCancel() {
    $("#bookingDetailCancel").css("display", "none");
}

function closeBookingCancelComplete() {
    $("#bookingDetailCancelComplete").css("display", "none");
    $("#bookingDetailPopUp").css("display", "none");
    $("#bookingDetailPayment").css("display", "none");
}
async function query_cancelBooking(bookingID) {
    const response = await fetch("../History/CancelBooking?id=" + bookingID, {
        method: "GET"
    });
    const data = await response.json();
    console.log(data);
    return data;
}

async function getBookingByID(bookingID, total) {
    const data = await query_getBookingByID(bookingID);
    document.getElementById("bookingDetailPopUp").innerHTML = data;
    $('.bookingTotalPrice').text(total);
    $("#bookingDetailPopUp").css("display", "flex");


    $(".bookingCancelButton").on("click", function () {
        $("#bookingDetailCancel").css("display", "flex");
    });

    $(".bookingCancelYes").on("click", async function () {
        $("#history#" + bookingID).css("display", "none");
        $("#bookingDetailCancel").css("display", "none");
        $("#bookingDetailCancelComplete").css("display", "flex");
        cancelBooking(bookingID);


    })

    $(".bookingPaymentButton").on("click", function () {
        $(".totalTransfer").text("Rp" + total + ",00");
        $("#bookingDetailPayment").css("display", "flex");
    })
}
