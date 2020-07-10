export class FileDto {
  constructor(
    public name?: string,
    public size?: number,
    public type?: string,
    public uuid?: string
  ) {
  }
}
