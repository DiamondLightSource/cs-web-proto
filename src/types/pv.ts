export class PV {
  public static DELIMITER = "://";
  public name: string;
  public protocol = "ca";

  public constructor(name: string, protocol?: string) {
    this.name = name;

    // default protocol of "ca" so only change if protocol is
    // passed in
    if (protocol !== undefined) {
      this.protocol = protocol;
    }
  }

  /**
   * Creates a new PV object with the protocol extracted if present
   * on pvName else the default protocol is used
   * @param pvName
   * @param defaultProtocol
   * @returns PV object
   * @example PV.parse("protocol://pvName")
   * PV.parse("pvName", "protocol")
   * PV.parse("pvName")
   */
  public static parse(pvName: string, defaultProtocol = "ca"): PV {
    if (pvName.includes(PV.DELIMITER)) {
      const parts = pvName.split(PV.DELIMITER);
      return new PV(parts[1], parts[0]);
    } else {
      return new PV(pvName, defaultProtocol);
    }
  }

  /**
   * Create qualifiedName from properties on PV
   * @returns protocol://name
   * @example const pv = new PV("name", "loc")
   * pv.qualifiedName() -> "loc://name"
   */
  public qualifiedName(): string {
    // This can happen if the name is substituted by a macro
    // after the PV object has been created.
    if (this.name.includes(PV.DELIMITER)) {
      return this.name;
    } else {
      return `${this.protocol}${PV.DELIMITER}${this.name}`;
    }
  }

  /**
   * Wrapper function for qualifiedName
   */
  public toString(): string {
    return this.qualifiedName();
  }
}
