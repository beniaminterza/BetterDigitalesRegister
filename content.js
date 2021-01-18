let boolean = true;
let fächer = [];
let notenFächer = [];
let averageNotenFächer = [];

function start() {
    let url = window.location.href.toString();
    if (url.includes("subjects")) {
        if (boolean) {
            addAverageToPage();
        }
    } else {
        boolean = true;
    }
}

function addAverageToPage() {
    let subjects = document.getElementsByClassName("student-subject-item");
    let marksCounterLastDiv;

    if (
        subjects[subjects.length - 1].getElementsByClassName(
            "student-name ng-binding"
        )[0].innerHTML !== "Notendurchschnitt"
    ) {
        let counter = 0;
        let sumAllMarks = 0;
        for (let i = 0; i < subjects.length; i++) {
            let marks = subjects[i].getElementsByClassName(
                "grade with-tooltip ng-binding"
            );

            if (i == subjects.length - 1) marksCounterLastDiv = marks.length;

            let sum = 0;
            let sumDivide = 0;
            for (let j = 0; j < marks.length; j++) {
                let percentage = getPercentege(marks[j].title);
                let mark = getMarkValue(marks[j].innerHTML);

                sum += (mark * percentage) / 100;
                sumDivide += percentage / 100;
            }

            if (marks.length > 0 && sumDivide > 0) {
                const average = sum / sumDivide;
                let averageFixedLength = average;
                if (average.toString().length > 5)
                    averageFixedLength = averageFixedLength.toFixed(3);

                let valueLeft = subjects[i].getElementsByClassName(
                    "absences ng-binding"
                )[0];
                valueLeft.innerHTML = averageFixedLength;
                valueLeft.title = "Notendurchschnitt";
                valueLeft.setAttribute("popover-trigger", "none");
                valueLeft.setAttribute("uib-popover", "Anzahl Fehlstunden");
                if (averageFixedLength < 5.5) {
                    valueLeft.style.color = "red";
                } else {
                    valueLeft.style.color = "limegreen";
                }
                valueLeft.style.fontWeight = "bold";

                sumAllMarks += average;
                counter += 1;

                //pushing data in the arrays for the chart
                notenFächer.push(average);
                averageNotenFächer.push(sumAllMarks / counter);
                fächer.push(
                    subjects[i].getElementsByClassName("student-name ng-binding")[0]
                        .innerHTML
                );
            }
        }
        if (subjects.length > 0) {
            let averageMarks = sumAllMarks / counter;
            addAverageAllSubjects(averageMarks, marksCounterLastDiv);
        }
    }
}

setInterval(start, 500);

function getPercentege(string) {
    for (let i = string.length - 1; i >= 0; i--) {
        if (string[i] === ">") {
            return parseInt(string.substring(i + 1, string.length - 1));
        }
    }
}

function getMarkValue(mark) {
    let number = parseInt(mark);
    if (mark.length > 1) {
        if (mark[1] === "/") number += 0.5;
        else if (mark[mark.length - 1] === "-") number -= 0.25;
        else if (mark[mark.length - 1] === "+") number += 0.25;
    }
    return number;
}

function addAverageAllSubjects(average, marksCounterLastDiv) {
    let div = document.createElement("div");
    div.className = "student-subject-item";

    let parent = document.getElementsByClassName("ng-scope ng-isolate-scope");

    let title = document.createElement("span");
    title.className = "student-name ng-binding";
    title.innerHTML = "Notendurchschnitt";
    title.style.color = "black";
    title.style.fontWeight = "bold";

    let span = document.createElement("span");
    span.className = "grades";

    let spanMark = document.createElement("span");
    spanMark.className = "grade with-tooltip ng-binding";
    spanMark.innerHTML = average;
    spanMark.style.color = "#6500e0";
    spanMark.style.fontWeight = "bold";

    span.appendChild(spanMark);

    div.appendChild(title);
    div.appendChild(span);

    div.style.backgroundColor = "#d2fff0";
    div.style.fontWeight = "bold";
    div.style.color = "#f23e02";

    parent[parent.length - 1 - marksCounterLastDiv].appendChild(div);
    addChart(marksCounterLastDiv);
}

function addChart(marksCounterLastDiv) {
    let parent = document.getElementById("maincontent");

    let chartjs = document.createElement("script");
    chartjs.setAttribute("src", "https://cdn.jsdelivr.net/npm/chart.js@2.8.0");
    parent.appendChild(chartjs); //adding the script to the header

    let chart = document.createElement("canvas");
    chart.id = "myChart";
    chart.style.width = "400";
    chart.style.height = "400";

    parent.appendChild(chart);

    addChartValues();
}

function addChartValues() {
    console.log(averageNotenFächer);

    let ctx = document.getElementById("myChart").getContext("2d");

    let chart = new Chart(myChart, {
        type: "bar",
        data: {
            labels: fächer,
            datasets: [
                {
                    label: "Durchschnitt der vorherigen Noten",
                    data: averageNotenFächer,

                    // Changes this dataset to become a line
                    type: "line",
                    fill: false,
                    borderColor: "#ff7dc2",
                },
                {
                    label: "Noten",
                    data: notenFächer,
                    backgroundColor: [
                        "#ffbdbd",
                        "#ffd3bd",
                        "#ffe2bd",
                        "#fff4bd",
                        "#f6ffbd",
                        "#deffbd",
                        "#c7ffbd",
                        "#bdffc5",
                        "#bdffe1",
                        "#bdfffd",
                        "#bde2ff",
                        "#bdcfff",
                        "#c0bdff",
                    ],
                },
            ],
        },
    });
}
