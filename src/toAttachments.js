getSum = (total, num) => {
  return total + num;
};

returnColor = people => {
  if (people <= 1) {
    return "#E4E5FF";
  } else if (people <= 2) {
    return "#C5C8FF";
  } else if (people <= 4) {
    return "#C4C7FF";
  } else if (people <= 6) {
    return "#9BA0FF";
  } else if (people <= 8) {
    return "#666DFF";
  } else {
    return "#0C14B0";
  }
};

getPeople = (design, code) => {
  if (!design || !code) {
    return 0;
  }
  var total = design.length + code.length;
  for (i = 0; i < design.length; i++) {
    for (k = 0; k < code.length; k++) {
      if (code[k].name === design[i].name) {
        total -= 1;
      }
    }
  }

  return total;
};

toAttachments = (list, username) => {
  const attachments = list
    .sort(function(a, b) {
      if (getPeople(a.design) < getPeople(b.design)) {
        return -1;
      } else if (getPeople(a.design) > getPeople(b.design)) {
        return 1;
      }
      return 0;
    })
    .map(entry => {
      const designTime = entry.design.length > 0
        ? entry.design.map(i => parseInt(i.time)).reduce(getSum)
        : 0;
      const codeTime = entry.code.length > 0
        ? entry.code.map(i => parseInt(i.time)).reduce(getSum)
        : 0;
      const code = entry.code
        .map(function(e) {
          return e.name;
        })
        .indexOf(username);
      const userCode = code !== -1 ? parseInt(entry.code[code].time) : false;
      const design = entry.design
        .map(function(e) {
          return e.name;
        })
        .indexOf(username);
      const userDesign = design !== -1
        ? parseInt(entry.design[design].time)
        : false;

      return {
        color: returnColor(getPeople(entry.design, entry.code)),
        author_name: entry.name,
        title: entry.title,
        text: entry.description ? entry.description : undefined,
        callback_id: entry._id,
        footer:
          codeTime / 60 +
            ` hr${codeTime === 60 ? "" : "s"} 💻  ` +
            designTime / 60 +
            ` hr${designTime === 60 ? "" : "s"} 🎨  ` +
            getPeople(entry.design, entry.code) +
            " ppl 👫\n\nWhat you want to contribute, daily:",
        actions: [
          {
            name: "code",
            text: "Code hours",
            type: "select",
            options: [
              {
                text: "15 minutes",
                value: "15"
              },
              {
                text: "30 minutes",
                value: "30"
              },
              {
                text: "1 hour",
                value: "60"
              },
              {
                text: "2 hours",
                value: "120"
              },
              {
                text: "4 hours",
                value: "240"
              },
              {
                text: "6 hours",
                value: "360"
              }
            ],
            selected_options: userCode
              ? [
                  {
                    text: `${userCode >= 60
                      ? userCode / 60
                      : userCode} ${userCode >= 60
                      ? `hour${userCode === 60 ? "" : "s"}`
                      : "minutes"}`,
                    value: (userCode >= 60
                      ? userCode / 60
                      : userCode).toString()
                  }
                ]
              : undefined
          },
          {
            name: "design",
            text: "Design hours",
            type: "select",
            options: [
              {
                text: "15 minutes",
                value: "15"
              },
              {
                text: "30 minutes",
                value: "30"
              },
              {
                text: "1 hour",
                value: "60"
              },
              {
                text: "2 hours",
                value: "120"
              },
              {
                text: "4 hours",
                value: "240"
              },
              {
                text: "6 hours",
                value: "360"
              }
            ],
            selected_options: userDesign
              ? [
                  {
                    text: `${userDesign >= 60
                      ? userDesign / 60
                      : userDesign} ${userDesign >= 60
                      ? `hour${userDesign === 60 ? "" : "s"}`
                      : "minutes"}`,
                    value: (userDesign >= 60
                      ? userDesign / 60
                      : userDesign).toString()
                  }
                ]
              : undefined
          }
        ]
      };
    });
  return { attachments };
};

module.exports = toAttachments;
