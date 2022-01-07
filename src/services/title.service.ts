class TitleService {
  public setTitle(title: string): void {
    document.title = "predictDb | Imagen Therapeutics";
  }
}

export default new TitleService();
