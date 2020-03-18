export class PV {
  public static DELIMITER = "://";
  public name: string;
  public protocol = "ca";

  public constructor(name: string, protocol?: string) {
    this.name = name;
    if (protocol !== undefined) {
      this.protocol = protocol;
    }
  }

  public static parse(pvName: string, defaultProtocol?: string): PV {
    if (pvName.includes(PV.DELIMITER)) {
      const parts = pvName.split(PV.DELIMITER);
      return new PV(parts[1], parts[0]);
    } else {
      return new PV(pvName, defaultProtocol);
    }
  }

  public qualifiedName(): string {
    return `${this.protocol}${PV.DELIMITER}${this.name}`;
  }
}
