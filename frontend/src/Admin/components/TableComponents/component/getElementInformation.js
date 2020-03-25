export function getElementInformation(el, info) {
  switch (info) {
    default:
      return "";

    case "ID":
      return el.id;

    case "NAME":
      const languagesName = Object.keys(el.names);

      const names = [];
      for (let i = 0; i < languagesName.length; i++) {
        names.push(el.names[languagesName[i]]);
      }

      return names.find((name, index) => {
        if (name !== "") {
          if (languagesName[index] !== "fr") {
            return `${languagesName[index].toUpperCase()} : ${name}`;
          }

          return name;
        }

        return "";
      });

    case "THEMEID":
      return el.themeId;

    case "SCENARIOID":
      return el.scenarioId;

    case "DESCRIPTION":
      const languagesDescription = Object.keys(el.names);

      const descriptions = [];
      for (let j = 0; j < languagesDescription.length; j++) {
        descriptions.push(el.descriptions[languagesDescription[j]]);
      }

      return descriptions.find((description, index) => {
        if (description !== "") {
          if (languagesDescription[index] !== "fr") {
            return `${languagesDescription[
              index
            ].toUpperCase()} : ${description}`;
          }

          return description;
        }

        return "";
      });

    case "LABEL":
      return el.label;

    case "VALUE":
      return el.value;

    case "LANGUAGECODE":
      return el.languageCode.toUpperCase();

    case "QUESTION":
      return el.question;

    case "FIRSTNAME":
      return el.managerFirstName;

    case "LASTNAME":
      return el.managerLastName;

    case "MAIL":
      return el.mail;

    case "TYPE":
      return el.type;
  }
}
