toDocument = body => {
  console.log(body);
  const slash = body.text.indexOf("/");
  const isSlash = slash !== -1;

  return {
    name: body.user_name,
    title: isSlash ? body.text.substring(0, slash) : body.text,
    description: isSlash ? body.text.substring(slash + 1) : undefined,
    design: [],
    code: []
  };
};

module.exports = toDocument;
