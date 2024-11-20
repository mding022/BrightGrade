let achieved;
let weight;
let pendingWeight;

document.getElementById('scrapeLabels').addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getIndividual" }, function (response) {
            if (response && response.labels) {
                achieved = 0; weight = 0; pendingWeight = 0;
                const sortedLabels = response.labels;
                displaySortedGrades(sortedLabels);
                console.log("achieved : " + achieved + " , tot. weight: " + weight)
            }
        });

        chrome.tabs.sendMessage(tabs[0].id, { action: "getLabels" }, function (response) {
            if (response && response.labels) {
                const labels = response.labels;
                const names = [];
                const values = [];
                let numeratorSum = 0;
                let denominatorSum = 0;
                for (let i = 0; i < labels.length; i++) {
                    if (i % 3 === 0) {
                        names.push(labels[i]);
                    } else if (i % 3 === 1) {
                        values.push(labels[i]);
                    }
                }
                let finalGrade = 0;
                if (weight !== 0) {
                    finalGrade = achieved / weight;
                }
                displayLabels(names, values, finalGrade);
            }
        });
    });
});

function displaySortedGrades(sortedLabels) {
    const sortedGradesDiv = document.getElementById('sortedGrades');
    sortedGradesDiv.innerHTML = '';

    const list = document.createElement('ul');

    sortedLabels.forEach(label => {
        if (
            typeof label === 'object' &&
            label !== null &&
            label.name === null &&
            (!label.values || label.values.length === 0) &&
            label.grade === null
        ) {
            return;
        }

        const listItem = document.createElement('li');

        let name;
        let values;
        let grade;
        if (typeof label === 'object' && label !== null) {
            name = label.name;
            values = label.values[1];
            grade = label.grade;


            listItem.innerHTML = validateObject(name, values, grade);
        } else {
            listItem.textContent = label;
        }
        if (validateObject(name, values, grade) === -1) {
            console.log("Completed " + name + " with value of " + values)
        } else {
            list.appendChild(listItem);
        }

    });

    sortedGradesDiv.appendChild(list);
}

function validateObject(name, values, grade) {
    //TODO: empty grade assuming cannot get a 0 mark. Add check for 0 mark.
    const regex = /^0\s*\/\s*\d+(\.\d+)?$/;
    if (regex.test(values)) {
        const weight = values.replace(/^0\s*\/\s*/, "");
        pendingWeight += parseFloat(weight);
        return `
                <strong>Name:</strong> ${name} <br>
                <strong>Pending Grade with weight of ${weight}%</strong>
            `;
    } else {
        const match = values.match(/^(\d+\.?\d*)\s*\/\s*(\d+\.?\d*)$/);
        if (match) {
            const numerator = parseFloat(match[1]);
            const denominator = parseFloat(match[2]);
            if (!isNaN(numerator) && !isNaN(denominator)) {
                achieved += numerator;
                weight += denominator;
            }
        }

        return -1;
    }
}


function displayLabels(names, values, finalGrade) {
    const labelsContainer = document.getElementById('labelsContainer');
    labelsContainer.innerHTML = '';

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    const headerRow = document.createElement('tr');
    const nameHeader = document.createElement('th');
    nameHeader.textContent = 'Category';
    nameHeader.style.textAlign = 'left';
    const valueHeader = document.createElement('th');
    valueHeader.textContent = 'Partial Grade';
    valueHeader.style.textAlign = 'left';
    headerRow.appendChild(nameHeader);
    headerRow.appendChild(valueHeader);
    table.appendChild(headerRow);

    const maxLength = Math.max(names.length, values.length);
    for (let i = 0; i < maxLength; i++) {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.style.fontWeight = 'bold';
        nameCell.textContent = names[i] || '';
        const valueCell = document.createElement('td');
        valueCell.textContent = values[i] || '';
        row.appendChild(nameCell);
        row.appendChild(valueCell);
        table.appendChild(row);
    }

    labelsContainer.appendChild(table);
    const bestGrade = (achieved+pendingWeight)/(weight+pendingWeight);
    console.log("best grade: " + bestGrade + " achieved: " + achieved + " weight: " + weight + " pending : " + pendingWeight)
    updateFinalGrade(finalGrade, bestGrade);
}

function updateFinalGrade(finalGrade, bestGrade) {
    const finalGradeElement = document.getElementById('finalGrade');
    finalGradeElement.textContent = `Final Grade: ${(finalGrade * 100).toFixed(1)}%`;

    const letterGrade = calculateLetterGrade(finalGrade);
    const letterColor = getLetterColor(letterGrade);
    const letterGradeElement = document.getElementById('letterGrade');
    letterGradeElement.textContent = letterGrade;
    letterGradeElement.style.color = letterColor;

    const bestGradeElement = document.getElementById('bestGrade');
    bestGradeElement.textContent = `Best Grade: ${(bestGrade * 100).toFixed(1)}%`;

    const bestLetterGrade = calculateLetterGrade(bestGrade);
    const bestLetterColor = getLetterColor(bestLetterGrade);
    const bestLetterGradeElement = document.getElementById('bestLetterGrade');
    bestLetterGradeElement.textContent = bestLetterGrade;
    bestLetterGradeElement.style.color = bestLetterColor;
}

function calculateLetterGrade(grade) {
    if (grade >= 0.895) return 'A+';
    if (grade >= 0.845) return 'A';
    if (grade >= 0.795) return 'A-';
    if (grade >= 0.746) return 'B+';
    if (grade >= 0.696) return 'B';
    if (grade >= 0.646) return 'C+';
    if (grade >= 0.596) return 'C';
    if (grade >= 0.546) return 'D+';
    if (grade >= 0.496) return 'D';
    if (grade >= 0.40) return 'E';
    return 'F';
}

function getLetterColor(letterGrade) {
    if (letterGrade === 'A+' || letterGrade === 'A') return 'green';
    if (letterGrade === 'A-' || letterGrade === 'B+') return 'lightgreen';
    if (letterGrade === 'B' || letterGrade === 'C+') return 'yellowgreen';
    if (letterGrade === 'C' || letterGrade === 'D+') return 'orange';
    if (letterGrade === 'D' || letterGrade === 'E') return 'red';
    return 'darkred';
}
