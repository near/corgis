export default function formatToMs(timestamp) {
  return Number(
    (() => {
      let timestampStr = timestamp.toString();
      if (timestampStr.length > 13) {
        return timestampStr.slice(0, 13);
      } if (timestampStr.length < 13) {
        for (let i = timestampStr.length; i < 13; i++) {
          timestampStr += '0';
        }
        return timestampStr;
      }
      return timestampStr;
    })(),
  );
}
