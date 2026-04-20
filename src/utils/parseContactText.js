const PHONE_REGEX = /(?:\+?\d{1,3}[\s-]?)?(?:\(?\d{2,4}\)?[\s-]?)?\d{3,4}[\s-]?\d{3,4}/g;
const PHONE_REGEX_NO_GLOBAL = /(?:\+?\d{1,3}[\s-]?)?(?:\(?\d{2,4}\)?[\s-]?)?\d{3,4}[\s-]?\d{3,4}/;

const parseContactText = (rawText = "") => {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const fullText = lines.join(" ");
  const phones = fullText.match(PHONE_REGEX) || [];
  const normalizedPhone = phones[0] ? phones[0].replace(/[^\d+]/g, "") : "";

  let name = "";
  let address = "";

  if (lines.length > 0) {
    const nonPhoneLine = lines.find((line) => !PHONE_REGEX_NO_GLOBAL.test(line));
    name = nonPhoneLine || lines[0];
  }

  const addressCandidates = lines.filter(
    (line) =>
      !line.includes(normalizedPhone) &&
      !line.toLowerCase().includes("phone") &&
      line !== name
  );
  address = addressCandidates.join(", ");

  return {
    name: name.slice(0, 100),
    phone: normalizedPhone.slice(0, 20),
    address: address.slice(0, 250)
  };
};

module.exports = parseContactText;
