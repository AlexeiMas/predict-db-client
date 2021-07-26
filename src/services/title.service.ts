class TitleService {
  public setTitle(title: string): void {
    document.title = "PredictDb | Imagen Therapeutics";
  }
}

export default new TitleService();
