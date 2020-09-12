function details(url) {
  return new Promise(function (resolve, reject) {
    let req = new XMLHttpRequest();
    req.open("GET", url);
    req.responseType = "json";
    req.onload = function () {
      if (req.status == 200) {
        resolve(req.response);
      } else {
        reject(
          Error("Could not load successfully; error code:" + req.statusText)
        );
      }
    };

    req.onerror = function () {
      reject(Error("There was a network error."));
    };
    req.send();
  });
}

var archjson = details(
  "https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json"
);

archjson
  .then((result) => {
    let tablePunto1 = document
      .getElementById("p1")
      .getElementsByTagName("tbody")[0];

    let hashMap = new Map();
    let hashMap2 = new Map();
    for (let j = 0; j < result.length; j++) {
      const element = result[j];
      let evento = element.events;
      let issquirrel = Boolean(element.squirrel);

      if (hashMap.get(evento) == null) {
        hashMap.set(evento, issquirrel);
      } else if (hashMap.get(evento) !== issquirrel) {
        hashMap.set(evento, issquirrel);
      }

      let row = document.createElement("tr");
      if (issquirrel === true) {
        row.classList.add("table-danger");
      }
      let th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.appendChild(document.createTextNode(`${j + 1}`));
      let events = document.createElement("td");
      events.appendChild(document.createTextNode(`${evento.toString()}`));
      let squirrel = document.createElement("td");
      squirrel.appendChild(document.createTextNode(`${issquirrel.toString()}`));
      row.appendChild(th);
      row.appendChild(events);
      row.appendChild(squirrel);
      tablePunto1.appendChild(row);
    }

    let tablePunto2 = document
      .getElementById("p2")
      .getElementsByTagName("tbody")[0];

    for (var clave of hashMap.keys()) {
      let values = [0, 0, 0, 0];
      clave.forEach((element) => {
        if (hashMap2.get(element) == null) {
          hashMap2.set(element, values);
        }
      });
    }
    let array = [];
    for (var [clave, valor] of hashMap2) {
      for (let j = 0; j < result.length; j++) {
        if (
          result[j].events.includes(clave) &&
          Boolean(result[j].squirrel) === true
        ) {
          valor[3] += 1;
        } else if (
          result[j].events.includes(clave) &&
          Boolean(result[j].squirrel) === false
        ) {
          valor[1] += 1;
        } else if (
          !result[j].events.includes(clave) &&
          Boolean(result[j].squirrel) === true
        ) {
          valor[2] += 1;
        } else if (
          !result[j].events.includes(clave) &&
          Boolean(result[j].squirrel) === false
        ) {
          valor[0] += 1;
        }
      }

      let TN = valor[0];
      let FN = valor[1];
      let FP = valor[2];
      let TP = valor[3];
      let correlation =
        (TP * TN - FP * FN) /
        Math.sqrt((TP + FP) * (TP + FN) * (TN + FP) * (TN + FN));
      array.push({
        name: clave,
        value: correlation,
      });
    }
    var sorted = array.sort(function (a, b) {
      return a.value < b.value ? 1 : b.value < a.value ? -1 : 0;
    });

    for (let i = 0; i < sorted.length; i++) {
      const element = sorted[i];
      let row = document.createElement("tr");
      let th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.appendChild(document.createTextNode(`${i + 1}`));
      let event = document.createElement("td");
      event.appendChild(document.createTextNode(`${element.name.toString()}`));
      let correlation = document.createElement("td");
      correlation.appendChild(
        document.createTextNode(`${element.value.toString()}`)
      );
      row.appendChild(th);
      row.appendChild(event);
      row.appendChild(correlation);
      tablePunto2.appendChild(row);
    }

    console.log(sorted);
  })
  .catch((error) => console.log(error));
