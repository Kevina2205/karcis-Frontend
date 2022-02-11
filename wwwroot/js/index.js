
async function query_getTicket() {
    const response = await fetch("../Home/Ticket", {
        method: "GET"
    });
    const data = await response.text();
    return data;
}

async function loadTickets() {

    const data = await query_getTicket();

    document.getElementById("mainTicketContainer").innerHTML = data;

    $(".buyButton").on("click", function () {
        $(".ticketAmount").css("display", "block");
        $("#cartContainer").css("display", "flex");
    });

    $("#cartContainer").on("click", async function () {

        let ticketQty = [
            ["Platinum",
                document.getElementById("inputPlatinum"),
                document.getElementById("inputPricePlatinum")],
            ["Golden",
                document.getElementById("inputGolden"),
                document.getElementById("inputPriceGolden")],
            ["Silver",
                document.getElementById("inputSilver"),
                document.getElementById("inputPriceSilver")],
            ["Bronze",
                document.getElementById("inputBronze"),
                document.getElementById("inputPriceBronze")]
        ]

        var Booking = {};
        Booking.EventName = document.getElementById("EventName").innerHTML;
        Booking.Tickets = []
        for (let i = 0; i < 4; i++) {
            if (ticketQty[i][1] == null) {
                continue;
            }
            Booking.Tickets.push({
                TicketType: ticketQty[i][0],
                Qty: parseInt(ticketQty[i][1].value),
                TicketPrice: parseInt(ticketQty[i][2].value)
            });
        }

        const response = await fetch("../Home/Summary", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Booking),
        });
        if (response.redirected) {
            return window.location.replace("/Registry/Login");
        }
        const summary = await response.text();
        document.getElementById("bookingSummary").innerHTML = summary;
        $("#bookingSummary").css("display", "flex");


    });
}
loadTickets();
function closeBooking() {
    $("#bookingSummary").css("display", "none");
    loadTickets();
}
$("#eventContainer").css("height", window.innerHeight - $("#eventContainer").offset().top);
$("#previousPage").css("top", window.innerHeight - $("#eventContainer").height());

$(window).resize(function () {
    $("#eventContainer").css("height", window.innerHeight - $("#eventContainer").offset().top);
    $("#previousPage").css("top", window.innerHeight - $("#eventContainer").height());
});

$("#nextPage").hover(function () {
    $(this).css("opacity", "1");
}, function () {
    $(this).css("opacity", "0");
});

$("#previousPage").hover(function () {
    $(this).css("opacity", "1");
}, function () {
    $(this).css("opacity", "0");
});

$(".buyButton").on("click", function () {
    $(".ticketAmount").css("display", "block");
    $("#cartContainer").css("display", "flex");
});


function closeBookingSummary() {
    $("#bookingSummary").css("display", "none");
}

function changePage() {
    let currentPage = $("#navbarContainer").attr("currentPage");

    if (currentPage == "Event") {
        $("#eventContainer").css("display", "none");
        $("#footer").css("display", "flex");
        $("#mainTicketContainer").css("display", "flex");
        $("#navbarContainer").attr("currentPage", "Ticket");
        $("#nextPage").css("display", "none");
        $("#previousPage").css("display", "flex");
    }
}

function changePagePrev() {
    let currentPage = $("#navbarContainer").attr("currentPage");

    if (currentPage == "Ticket") {
        $("#mainTicketContainer").css("display", "none");
        $("#bookingSummary").css("display", "none");
        $("#footer").css("display", "none");
        $("#eventContainer").css("display", "flex");
        $("#navbarContainer").attr("currentPage", "Event");
        $("#previousPage").css("display", "none");
        $("#nextPage").css("display", "flex");
    }
}


var navbar = document.querySelector('nav')
window.addEventListener('scroll', function () {
    if (window.pageYOffset > 100) {
        navbar.classList.add('background-navbar', 'shadow');
    } else {
        navbar.classList.remove('background-navbar', 'shadow')
    }
});


function closeBookingSummary() {
    $("#bookingSummary").css("display", "none");
}