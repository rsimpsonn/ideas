toContributions = list => {
  const contributions = list.map(entry => {
    return {
      color: "#7F85FF",
      title: entry.title,
      text: entry.code.length > 0 || entry.code.length > 0
        ? entry.code
            .map(
              instance =>
                `💻 ${instance.name} wants to contribute ${parseInt(
                  instance.time
                ) / 60} hour${parseInt(instance.time) === 60 ? "" : "s"}/day!`
            )
            .join("\n") +
            "\n" +
            entry.design
              .map(
                instance =>
                  `🎨 ${instance.name} wants to contribute ${parseInt(
                    instance.time
                  ) / 60} hour${parseInt(instance.time) === 60 ? "" : "s"}/day!`
              )
              .join("\n")
        : "Nothing yet 😢",
      callback_id: entry._id,
      actions: [
        {
          name: "remove",
          text: "Remove",
          type: "button",
          value: "remove",
          confirm: {
            title: "Are you sure?",
            text: "Would you like to remove your idea from the list?",
            ok_text: "Yes",
            dismiss_text: "No"
          }
        }
      ]
    };
  });
  return { attachments: contributions };
};

module.exports = toContributions;
