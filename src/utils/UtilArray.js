export class UtilArray {
    static unite(...arrays) {
      return []
        .concat(...arrays)
        .filter((elem, index, self) => self.indexOf(elem) === index);
    }
  }
  