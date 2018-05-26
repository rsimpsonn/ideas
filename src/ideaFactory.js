const createErrorAttachment = error => ({
  color: "danger",
  text: `*Error*:\n${error.message}`,
  mrkdwn_in: ["text"]
});

ideaFactory = (slackToken, body) =>
  new Promise((resolve, reject) => {
    if (!body) {
      return resolve({
        text: "",
        attachments: [createErrorAttachment(new Error("Invalid body"))]
      });
    }

    if (slackToken !== body.token) {
      return resolve({
        text: "",
        attachments: [createErrorAttachment(new Error("Invalid token"))]
      });
    }

    const slash = body.text.indexOf("/");
    const isSlash = slash !== -1;

    return resolve({
      attachments: [
        {
          color: "#7F85FF",
          pretext: "Your idea is on the list!",
          author_name: body.user_name,
          title: isSlash ? body.text.substring(0, slash) : body.text,
          text: isSlash ? body.text.substring(slash + 1) : undefined
        }
      ]
    });
  });

module.exports = ideaFactory;
